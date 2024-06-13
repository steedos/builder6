"use strict";
const nodemailer = require('nodemailer');

/**
 * 开启oidc服务后，新增人员后在触发器中发送keycloak邀请邮件
 */
export const spaceUsersAfterInsert = {
    trigger: {
        listenTo: 'space_users',
        when: [
            'afterInsert'
        ]
    },
    async handler(ctx) {
        const {
            STEEDOS_IDENTITY_OIDC_ENABLED,
            STEEDOS_IDENTITY_OIDC_CONFIG_URL,
            STEEDOS_IDENTITY_OIDC_CLIENT_ID,
            STEEDOS_EMAIL_URL,               // 发件人的电子邮件配置
            ROOT_URL,                        // ROOT_URL
        } = this.settings;

        // 开启oidc才发送邮件
        if (true != STEEDOS_IDENTITY_OIDC_ENABLED && "true" != STEEDOS_IDENTITY_OIDC_ENABLED) {
            return;
        }

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

        // 发送邀请邮件的函数
        const sendInvitationEmail = async (email) => {
            const transporter = nodemailer.createTransport(STEEDOS_EMAIL_URL);
            const parts = STEEDOS_IDENTITY_OIDC_CONFIG_URL.split("/.well-known");
            const registerUrl = `${parts[0]}/protocol/openid-connect/registrations?client_id=${STEEDOS_IDENTITY_OIDC_CLIENT_ID}&scope=openid%20profile&redirect_uri=${ROOT_URL}&response_type=code`;

            const mailOptions = {
                from: `"${suDoc.name}" <noreply@steedos.com>`, // 发件人地址
                to: email, // 收件人地址
                subject: `${suDoc.name} 邀请您加入 ${spaceDoc.name}`, // 主题
                html: `<p>你好，${suDoc.name} 邀请您加入 ${spaceDoc.name}。请点击以下链接登录：</p>
                        <p><a href="${ROOT_URL}">${ROOT_URL}</a></p>
                        <p>如果没有账号请点击以下链接创建账号：</p>
                        <p><a href="${registerUrl}">${registerUrl}</a></p>` // HTML内容
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log('邀请邮件已发送到:', email);
            } catch (error) {
                console.error('发送邮件失败:', error);
            }
        };

        await sendInvitationEmail(email);

    }
}