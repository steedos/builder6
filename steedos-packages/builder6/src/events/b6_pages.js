/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-06-19 11:39:36
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-06-19 13:30:29
 * @Description: 
 */
module.exports = {
    "@b6_pages.inserted": async function (payload, sender, eventName, ctx) {
        const { objectApiName, id, spaceId, userId } = ctx.params;
        await this.builder6SpaceUpdate(objectApiName, id)
    },
    "@b6_pages.updated": async function (payload, sender, eventName, ctx) {
        const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
        await this.builder6SpaceUpdate(objectApiName, id)
    },
    "@b6_pages.deleted": async function (payload, sender, eventName, ctx) {
        const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
        await this.builder6SpaceDelete(objectApiName, id)
    }
}