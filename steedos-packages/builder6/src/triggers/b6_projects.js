/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-06-13 00:56:23
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-16 12:37:02
 * @FilePath: /builder6/steedos-packages/builder6/src/triggers/b6_projects.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const uuid = require("uuid");
const BuilderJS = require("@builder6/builder6.js");
const _ = require("lodash");
const crypto = require('crypto');

const endpointUrl = process.env.B6_CLOUD_API;//NEXT_PUBLIC_B6_API_URL
const apiKey = process.env.B6_CLOUD_PROJECT_SECRET;//NEXT_PUBLIC_B6_API_KEY

const bjs = new BuilderJS({ endpointUrl, apiKey })
const base = bjs.base("meta-builder6-com");

function generateShortUrl(uuid, length = 6) {
    // 使用 SHA-256 哈希函数对 UUID 进行哈希处理
    const hash = crypto.createHash('sha256').update(uuid).digest('hex');
    
    // 定义字符集，包括小写字母和数字
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    
    // 将哈希值转换为指定字符集的短域名
    let shortUrl = '';
    for (let i = 0; i < length; i++) {
        const index = parseInt(hash.substr(i * 2, 2), 16) % characters.length;
        shortUrl += characters[index];
    }
    
    return shortUrl;
}

export const projectBeforeUpdate = {
    trigger: {
        listenTo: 'b6_projects',
        when: ['beforeInsert', 'beforeUpdate']
    },
    async handler(ctx) {
        const { doc, id = uuid.v4(), spaceId, isInsert } = ctx.params;
        let { slug, domain } = doc;

        if(slug){
             // 自动生成6个字母的结尾，根据id生成，不会变。
            const domainTail = generateShortUrl(id, 6);
            // 把domain文本框中内容清空时 domian传入的是null
            domain = `${slug}-${domainTail}`;
        }

        const urlDomain = process.env.B6_FRONTEND_APP_DOMAIN || 'builder6.app';

        if (isInsert) {
            doc._id = id;
        }

        if (domain) {
            doc.domain = domain
            doc.url = `https://${domain}.${urlDomain}`;

            let oldDomain;
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

                let clounDomian;
                try {
                    clounDomian = await base("b6_domains").find(doc.domain);
                }
                catch (e) {
                    console.log(e)
                }

                if (clounDomian)
                    throw new Error(`域名已存在： ${doc.domain}`)

                if (oldDomain) {
                    try {
                        await base("b6_domains").destroy(oldDomain)
                    }
                    catch (e) {
                        console.log(e)
                    }
                }

                try {
                    await base("b6_domains").replace(doc.domain, {
                        type: "project",
                        space: spaceId,
                        project_id: id,
                        domain: doc.domain,
                    });                
                }
                catch (e) {
                    console.log(e)
                }
                

            } else {
                try {
                    await base("b6_domains").replace(doc.domain, {
                        type: "project",
                        space: spaceId,
                        project_id: id,
                        domain: doc.domain,
                    });                }
                catch (e) {
                    console.log(e)
                }
            }
        }

        return {
            doc
        }
    }
}

export const projectBeforeDelete = {
    trigger: {
        listenTo: 'b6_projects',
        when: ['beforeDelete']
    },
    async handler(ctx) {
        const { id } = ctx.params;
        const previousDoc = await this.getObject('b6_projects').findOne(
            id,
            {
                fields: ['domain'],
            }
        );
        const { domain } = previousDoc;

        if (domain) {
            await base("b6_domains").destroy(domain)
        }
    }
}