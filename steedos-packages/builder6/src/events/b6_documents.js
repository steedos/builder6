/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-06-19 11:39:36
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-06-19 13:31:32
 * @Description: 
 */
module.exports = {
    "@b6_documents.inserted": async function (payload, sender, eventName, ctx) {
        const { objectApiName, id, spaceId, userId } = ctx.params;
        await this.builder6SpaceUpdate(objectApiName, id)
    },
    "@b6_documents.updated": async function (payload, sender, eventName, ctx) {
        const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
        await this.builder6SpaceUpdate(objectApiName, id)
    },
    "@b6_documents.deleted": async function (payload, sender, eventName, ctx) {
        const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
        await this.builder6SpaceDelete(objectApiName, id)
    }
}