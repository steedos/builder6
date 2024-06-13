/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-06-13 00:56:23
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-13 12:09:52
 * @FilePath: /builder6/steedos-packages/builder6/src/triggers/b6_projects.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const uuid = require("uuid");
const Builder6 = require("@builder6/builder6.js");
const _ = require("lodash");

const endpointUrl = process.env.B6_CLOUD_API;//NEXT_PUBLIC_B6_API_URL
const apiKey = process.env.B6_CLOUD_PROJECT_SECRET;//NEXT_PUBLIC_B6_API_KEY

const builder6 = new Builder6({ endpointUrl, apiKey })
const base = builder6.base("meta-builder6-com");

export const projectBeforeUpdate = {
    trigger: {
        listenTo: 'b6_projects',
        when: ['beforeInsert', 'beforeUpdate']
    },
    async handler(ctx) {
        const { doc, id = uuid.v4(), isInsert } = ctx.params;
        const { domain } = doc;
        let waitForCheckDomain, previousDomain;
        if (isInsert) {
            waitForCheckDomain = domain;
        }
        else {
            const previousDoc = await this.getObject('b6_projects').findOne(
                id,
                {
                    fields: ['domain'],
                }
            );
            if (previousDoc) {
                previousDomain = previousDoc.domain;
                // domain有变更时才需要check是否重复
                if (previousDomain !== domain) {
                    waitForCheckDomain = domain;
                }
            }
            else {
                waitForCheckDomain = domain;
            }
        }

        let isDomainRepeated = false;
        if (waitForCheckDomain) {
            const cloudDomain = await base('b6_domains').find(waitForCheckDomain);
            isDomainRepeated = !_.isEmpty(cloudDomain?.fields);
        }

        if (isDomainRepeated) {
            throw new Error("域名前缀已经被占用了，请输入新的域名前缀！");
        }
        else {
            if (previousDomain && previousDomain !== domain) {
                // 只要domain有变更，包括把domain值清空，即domain值为空时也要删除previousDomain
                // TODO:删除previousDoc.domain，且删除失败要报错中断数据更新操作
            }
        }

        if (isInsert) doc._id = id;

        doc.url = `https://${id}.builder6.app`;

        return {
            doc
        }
    }
}