const _ = require('lodash');

module.exports = {
    "*.inserted": async function(payload, sender, eventName, ctx){
      const { objectApiName, id, spaceId, userId  } = ctx.params;
      if(ctx.eventName != `@${objectApiName}.inserted`){
        return
      }
      if(objectApiName && id && _.includes(this.settings.B6_CLOUD_SYNC_OBJECTS, objectApiName)){
        await this.builder6Update(objectApiName, id)
      }
    },
    "*.updated": async function(payload, sender, eventName, ctx){
      const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
      if(ctx.eventName != `@${objectApiName}.updated`){
        return
      }
      if(objectApiName && id && _.includes(this.settings.B6_CLOUD_SYNC_OBJECTS, objectApiName)){
        await this.builder6Update(objectApiName, id)
      }
    },
    "*.deleted": async function(payload, sender, eventName, ctx){
      const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
      if(ctx.eventName != `@${objectApiName}.deleted`){
        return
      }
      if(objectApiName && id && _.includes(this.settings.B6_CLOUD_SYNC_OBJECTS, objectApiName)){
        await this.builder6Delete(objectApiName, id)
      }
    }
  }