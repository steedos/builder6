/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-06-03 18:28:30
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-06-05 10:20:55
 * @Description: 
 */
const _ = require('lodash');

module.exports = {
    "steedos-server.started": function(payload, sender, eventName, ctx){
      ctx.broker.call(`steedos-server.setSettings`, {PUBLIC_SETTINGS: {B6_FRONTEND_URL: process.env.B6_FRONTEND_URL}})
    },
    "*.inserted": async function(payload, sender, eventName, ctx){
      const { objectApiName, id, spaceId, userId  } = ctx.params;
      if(ctx.eventName != `@${objectApiName}.inserted`){
        return
      }
      if(objectApiName && id && _.includes(this.settings.B6_CLOUD_META_OBJECTS, objectApiName)){
        await this.builder6Update(objectApiName, id)
      }
      if(objectApiName && id && _.includes(this.settings.B6_CLOUD_SPACE_OBJECTS, objectApiName)){
        await this.builder6SpaceUpdate(objectApiName, id)
      }
    },
    "*.updated": async function(payload, sender, eventName, ctx){
      const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
      if(ctx.eventName != `@${objectApiName}.updated`){
        return
      }
      if(objectApiName && id && _.includes(this.settings.B6_CLOUD_META_OBJECTS, objectApiName)){
        await this.builder6Update(objectApiName, id)
      }
      if(objectApiName && id && _.includes(this.settings.B6_CLOUD_SPACE_OBJECTS, objectApiName)){
        await this.builder6SpaceUpdate(objectApiName, id)
      }
    },
    "*.deleted": async function(payload, sender, eventName, ctx){
      const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
      if(ctx.eventName != `@${objectApiName}.deleted`){
        return
      }
      if(objectApiName && id && _.includes(this.settings.B6_CLOUD_META_OBJECTS, objectApiName)){
        await this.builder6Delete(objectApiName, id)
      }
      if(objectApiName && id && _.includes(this.settings.B6_CLOUD_SPACE_OBJECTS, objectApiName)){
        await this.builder6SpaceDelete(objectApiName, id)
      }
    }
  }