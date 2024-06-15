/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-06-13 00:56:23
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-14 08:16:24
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

const checkAndRegisterProjectDomain = async (domain, projectId, spaceId, ctx, _this) => {
    const { isInsert } = ctx.params;
    let waitForCheckDomain, previousDomain;
    if (isInsert) {
        waitForCheckDomain = domain;
    }
    else {
        const previousDoc = await _this.getObject('b6_projects').findOne(
            projectId,
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
    let cloudDomain, isCloudDomainExist;
    if (waitForCheckDomain) {
        // console.log("waitForCheckDomain===sss====", waitForCheckDomain);
        cloudDomain = await base('b6_domains').find(waitForCheckDomain);
        // console.log("cloudDomain===sss====", cloudDomain);
        //记录不存在时cloudDomain还是有返回值，且返回的cloudDomain?.fields值为空对象，这是db层bug，所以用cloudDomain?.fields来判断是否查到record
        isDomainRepeated = !_.isEmpty(cloudDomain?.fields);
        isCloudDomainExist === cloudDomain?.fields?.project_id !== projectId;
    }

    if (isCloudDomainExist) {
        // 考虑cloudDomain创建成功后，project record未保存成功的情况，
        // 所以这里判断cloudDomain的project_id就是当前record的话，即当前域名已经存在且正好属于当前record时，强制判断为域名不重复，且不再重复新建域名
        isDomainRepeated = false;
    }

    if (isDomainRepeated) {
        throw new Error("域名前缀已经被占用了，请输入新的域名前缀！");
    }
    else {
        if (previousDomain && previousDomain !== domain) {
            // 只要domain有变更，包括把domain值清空，即domain值为空时也要删除previousDomain
            // 删除previousDoc.domain，且删除失败要报错中断数据更新操作，但是要注意如果previousDoc.domain本身不存在时执行删除操作的报错不要中断数据更新操作
            // TODO:db destroy执行会报错进catch，可能是db层bug，待修正后再放开
            // try {
            //     console.log("deletedRecords===waitForCheckDomain====", waitForCheckDomain);
            //     console.log("deletedRecords===previousDomain====", previousDomain);

            //     let xxx = await base('b6_domains').find(previousDomain);
            //     console.log("deletedRecords===previousDomain==xxx==", xxx);

            //     const deletedRecords = await base('b6_domains').destroy([previousDomain]);
            //     console.log("deletedRecords===result====", deletedRecords);
            // } catch (e) {
            //     _this.broker.logger.error(e);
            //     throw new Error(`移除旧域名 ${previousDomain} 失败！`, e);
            // }
        }
    }

    if (waitForCheckDomain && !isCloudDomainExist) {
        // 填写了域名、域名有变更、域名不重复(!isDomainRepeated)，且要创建的域名并不是在云端已经存在时才向云端插入新域名(!isCloudDomainExist)
        // TODO:上面移除旧域名，db destroy执行会报错进catch，可能是db层bug，待修正后再放开
        // try {
        //     console.log("insertedDomain===waitForCheckDomain====", waitForCheckDomain);
        //     const insertedDomain = await base('b6_domains').update([{
        //         "id": waitForCheckDomain,
        //         "fields": {
        //             "type": "project",
        //             "project_id": projectId,
        //             "space_id": spaceId
        //         }
        //     }]);
        //     console.log("insertedDomain===result====", insertedDomain);
        // } catch (e) {
        //     _this.broker.logger.error(e);
        //     throw new Error(`注册新域名 ${waitForCheckDomain} 失败！`, e);
        // }
    }
}

export const projectBeforeUpdate = {
    trigger: {
        listenTo: 'b6_projects',
        when: ['beforeInsert', 'beforeUpdate']
    },
    async handler(ctx) {
        const { doc, id = uuid.v4(), spaceId, isInsert } = ctx.params;
        const { domain } = doc;

        await checkAndRegisterProjectDomain(domain, id, spaceId, ctx, this);

        if (isInsert) doc._id = id;

        const urlDomain = process.env.B6_FRONTEND_APP_DOMAIN || 'builder6.app';
        if (domain) {
            doc.url = `https://${domain}.${urlDomain}`;
        }
        else{
            doc.url = `https://app-${id}.${urlDomain}`;
        }

        return {
            doc
        }
    }
}