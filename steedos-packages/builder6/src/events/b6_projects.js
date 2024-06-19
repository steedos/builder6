/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-06-19 11:39:36
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-06-19 13:29:14
 * @Description: 
 */
module.exports = {
    "@b6_projects.inserted": async function (payload, sender, eventName, ctx) {
        const { objectApiName, id, spaceId, userId } = ctx.params;
        await this.builder6Update(objectApiName, id)
        await this.builder6SpaceUpdate(objectApiName, id)
    },
    "@b6_projects.updated": async function (payload, sender, eventName, ctx) {
        const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
        await this.builder6Update(objectApiName, id)
        await this.builder6SpaceUpdate(objectApiName, id)
    },
    "@b6_projects.deleted": async function (payload, sender, eventName, ctx) {
        const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
        await this.builder6Delete(objectApiName, id)
        await this.builder6SpaceDelete(objectApiName, id)
    }
}