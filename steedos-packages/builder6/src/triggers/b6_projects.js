/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-06-13 00:56:23
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-14 08:16:24
 * @FilePath: /builder6/steedos-packages/builder6/src/triggers/b6_projects.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const uuid = require("uuid");
const BuilderJS = require("@builder6/builder6.js");
const _ = require("lodash");

const endpointUrl = process.env.B6_CLOUD_API;//NEXT_PUBLIC_B6_API_URL
const apiKey = process.env.B6_CLOUD_PROJECT_SECRET;//NEXT_PUBLIC_B6_API_KEY

const bjs = new BuilderJS({ endpointUrl, apiKey })
const base = bjs.base("meta-builder6-com");

export const projectBeforeUpdate = {
    trigger: {
        listenTo: 'b6_projects',
        when: ['beforeInsert', 'beforeUpdate']
    },
    async handler(ctx) {
        const { doc, id = uuid.v4(), spaceId, isInsert } = ctx.params;
        const { domain = `app-${id}` } = doc;


        const urlDomain = process.env.B6_FRONTEND_APP_DOMAIN || 'builder6.app';

        if (isInsert) {
            doc._id = id;
        }

        if (domain) {
            doc.domain = domain
            doc.url = `https://${domain}.${urlDomain}`;

            let oldDomain = ""
            if (!isInsert) {
                const previousDoc = await this.getObject('b6_projects').findOne(
                    id,
                    {
                        fields: ['domain'],
                    }
                );
                oldDomain = previousDoc.domain
            }

            if (oldDomain != doc.domain) {

                const cloudDomain = await base("b6_domains").find(doc.domain);
                if (cloudDomain && cloudDomain._rawJson)   
                    throw new Error(`域名已存在: ${doc.domain}`)
    
                await base("b6_domains").destroy(oldDomain)
                await base("b6_domains").replace(doc.domain, {
                    type:"project",
                    space: spaceId,
                    project_id: id,
                    domain: doc.domain,
                });
            }

        }
        
        return {
            doc
        }
    }
}