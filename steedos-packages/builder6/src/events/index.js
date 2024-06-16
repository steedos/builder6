/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-06-03 18:28:30
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-06-16 14:14:19
 * @Description: 
 */
const _ = require('lodash');

const knowledge_source = require('./b6_chatbots_knowledge_source');

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
      if(objectApiName && id && _.includes(this.settings.B6_CLOUD_PROJECT_OBJECTS, objectApiName)){
        await this.builder6ProjectUpdate(objectApiName, id)
      }
    },
    "*.updated": async function(payload, sender, eventName, ctx){
      const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
      console.log(objectApiName, id)
      if(ctx.eventName != `@${objectApiName}.updated`){
        return
      }
      if(objectApiName && id && _.includes(this.settings.B6_CLOUD_META_OBJECTS, objectApiName)){
        console.log(objectApiName, id)
        await this.builder6Update(objectApiName, id)
      }
      if(objectApiName && id && _.includes(this.settings.B6_CLOUD_SPACE_OBJECTS, objectApiName)){
        await this.builder6SpaceUpdate(objectApiName, id)
      }
      if(objectApiName && id && _.includes(this.settings.B6_CLOUD_PROJECT_OBJECTS, objectApiName)){
        await this.builder6ProjectUpdate(objectApiName, id)
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
      if(objectApiName && id && _.includes(this.settings.B6_CLOUD_PROJECT_OBJECTS, objectApiName)){
        await this.builder6ProjectDelete(objectApiName, id)
      }
    },
    "@b6_chatbots.inserted": async function(payload, sender, eventName, ctx){
      const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
      this.b6comChatbotUpdate(objectApiName, id)
    },
    "@b6_chatbots.updated": async function(payload, sender, eventName, ctx){
      const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
      this.b6comChatbotUpdate(objectApiName, id)
    },
    "@b6_chatbots.deleted": async function(payload, sender, eventName, ctx){
      const { objectApiName, id, spaceId, userId, previousDoc } = ctx.params;
      this.b6comChatbotDelete(objectApiName, id)
    },
    ...knowledge_source
  }