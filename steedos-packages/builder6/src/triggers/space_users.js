"use strict";
const axios = require("axios")
const nodemailer = require('nodemailer');

/**
 * 新增人员前判断是否符合新增条件：配置了id.steedos.cn相关参数
 */
export const spaceUsersBeforeInsert = {
    trigger: {
        listenTo: 'space_users',
        when: [
            'beforeInsert',
        ]
    },
    async handler(ctx) {
        const {
            STEEDOS_KEYCLOAK_URL,
            STEEDOS_KEYCLOAK_ADMIN_USERNAME,
            STEEDOS_KEYCLOAK_ADMIN_PASSWORD,
            STEEDOS_EMAIL_URL,
            ROOT_URL,
        } = this.settings;

        // console.log('STEEDOS_KEYCLOAK_URL', STEEDOS_KEYCLOAK_URL);
        // console.log('STEEDOS_KEYCLOAK_ADMIN_USERNAME', STEEDOS_KEYCLOAK_ADMIN_USERNAME);
        // console.log('STEEDOS_KEYCLOAK_ADMIN_PASSWORD', STEEDOS_KEYCLOAK_ADMIN_PASSWORD);
        // console.log('STEEDOS_EMAIL_URL', STEEDOS_EMAIL_URL);
        // console.log('ROOT_URL', ROOT_URL);

        if (!STEEDOS_KEYCLOAK_URL ||
            !STEEDOS_KEYCLOAK_ADMIN_USERNAME ||
            !STEEDOS_KEYCLOAK_ADMIN_PASSWORD ||
            !STEEDOS_EMAIL_URL ||
            !ROOT_URL) {
            throw new Error("请联系平台配置邀请注册功能相关环境变量。")
        }

    }
};

/**
 * 新增人员后在触发器中判断用户是否已存在于id.steedos.cn，如不存在则发送id.steedos.cn的邀请邮件
 */
export const spaceUsersAfterInsert = {
    trigger: {
        listenTo: 'space_users',
        when: [
            'afterInsert'
        ]
    },
    async handler(ctx) {
        const { doc, userId, spaceId } = ctx.params;

        const { email } = doc

        const suObj = this.getObject("space_users")
        const spaceObj = this.getObject("spaces")
        const suDoc = await suObj.findOne({
            filters: [
                ["space", "=", spaceId],
                ["user", "=", userId]
            ]
        })
        const spaceDoc = await spaceObj.findOne(spaceId)

        const {
            STEEDOS_KEYCLOAK_URL,            // Keycloak服务器的URL
            STEEDOS_KEYCLOAK_ADMIN_USERNAME, // Keycloak管理员凭证
            STEEDOS_KEYCLOAK_ADMIN_PASSWORD, // Keycloak管理员凭证
            STEEDOS_EMAIL_URL,               // 发件人的电子邮件配置
            ROOT_URL,                        // ROOT_URL
        } = this.settings;

        // Keycloak realm的名称
        const realmName = 'master';
        // 要检查的用户名
        const username = email;
        const clientId = 'steedos-oidc-public'; // 通常用于管理API的客户端ID
        // 收件人的电子邮件地址
        const recipientEmail = email;

        // 发送邀请邮件的函数
        const sendInvitationEmail = async (email) => {
            const transporter = nodemailer.createTransport(STEEDOS_EMAIL_URL);

            const mailOptions = {
                from: `"${suDoc.name}" <noreply@steedos.com>`, // 发件人地址
                to: email, // 收件人地址
                subject: '邀请加入', // 主题
                text: `你好，管理员${suDoc.name}邀请您加入工作区${spaceDoc.name}。请点击以下链接注册。`, // 文本内容
                html: `<p>你好，管理员${suDoc.name}邀请您加入工作区${spaceDoc.name}。请点击以下链接注册：</p>
                        <p><a href="${ROOT_URL}">${ROOT_URL}</a></p>` // HTML内容
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log('邀请邮件已发送到:', email);
            } catch (error) {
                console.error('发送邮件失败:', error);
            }
        };

        // 获取Keycloak访问令牌的函数
        const getAccessToken = async () => {
            const url = `${STEEDOS_KEYCLOAK_URL}/realms/${realmName}/protocol/openid-connect/token`;
            const params = new URLSearchParams();
            params.append('client_id', clientId);
            params.append('username', STEEDOS_KEYCLOAK_ADMIN_USERNAME);
            params.append('password', STEEDOS_KEYCLOAK_ADMIN_PASSWORD);
            params.append('grant_type', 'password');

            try {
                const response = await axios.post(url, params);
                return response.data.access_token;
            } catch (error) {
                console.error('获取访问令牌失败:', error);
                throw error;
            }
        };

        // 检查用户是否存在并发送邀请邮件的函数
        const checkUserAndSendInvitation = async () => {
            try {
                const token = await getAccessToken();

                const url = `${STEEDOS_KEYCLOAK_URL}/admin/realms/${realmName}/users?username=${username}`;
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                const response = await axios.get(url, { headers });

                if (response.status === 200) {
                    const userExists = response.data.length > 0;
                    if (userExists) {
                        console.log(`用户 ${username} 存在于 Keycloak 中`);
                    } else {
                        console.log(`用户 ${username} 不存在于 Keycloak 中`);
                        await sendInvitationEmail(recipientEmail);
                    }
                } else {
                    console.log('请求失败，状态码:', response.status);
                }
            } catch (error) {
                console.error('发生错误:', error);
            }
        };

        // 执行检查和发送邀请邮件的操作
        checkUserAndSendInvitation();


    }
}