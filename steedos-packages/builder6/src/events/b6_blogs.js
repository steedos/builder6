/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-06-19 11:39:36
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-06-19 13:31:22
 * @Description: 
 */
module.exports = {
    "@b6_blogs.inserted": async function (payload, sender, eventName, ctx) {
        const { objectApiName, id, spaceId, userId } = ctx.params;
        await this.builder6SpaceUpdate(objectApiName, id)
    },
    "@b6_blogs.updated": async function (payload, sender, eventName, ctx) {
        const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
        await this.builder6SpaceUpdate(objectApiName, id)
    },
    "@b6_blogs.deleted": async function (payload, sender, eventName, ctx) {
        const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
        await this.builder6SpaceDelete(objectApiName, id)
    }
}