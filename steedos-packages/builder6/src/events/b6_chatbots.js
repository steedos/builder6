/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-06-19 11:39:36
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-06-19 13:32:25
 * @Description: 
 */
module.exports = {
    "@b6_chatbots.inserted": async function (payload, sender, eventName, ctx) {
        const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
        this.b6comChatbotUpdate(objectApiName, id)
    },
    "@b6_chatbots.updated": async function (payload, sender, eventName, ctx) {
        const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
        this.b6comChatbotUpdate(objectApiName, id)
    },
    "@b6_chatbots.deleted": async function (payload, sender, eventName, ctx) {
        const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
        this.b6comChatbotDelete(objectApiName, id)
    }
}