module.exports = {
    "@b6_product_config.inserted": async function (payload, sender, eventName, ctx) {
        const { objectApiName, id, spaceId, userId } = ctx.params;
        await this.builder6Update(objectApiName, id)
        await this.builder6SpaceUpdate(objectApiName, id)
    },
    "@b6_product_config.updated": async function (payload, sender, eventName, ctx) {
        const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
        await this.builder6Update(objectApiName, id)
        await this.builder6SpaceUpdate(objectApiName, id)
    },
    "@b6_product_config.deleted": async function (payload, sender, eventName, ctx) {
        const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
        await this.builder6Delete(objectApiName, id)
        await this.builder6SpaceDelete(objectApiName, id, spaceId)
    }
}