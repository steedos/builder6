const uuid = require("uuid");
const _ = require('lodash')

export const chatbotsBeforeUpdate = {
    trigger: { 
        listenTo: 'b6_chatbots', 
        when: ['beforeInsert', 'beforeUpdate']
    },
    async handler(ctx) {
        const {doc, id  = uuid.v4(), isInsert, userId, spaceId} = ctx.params;

        const userSession = await this.getUser(userId, spaceId)
        
        if (isInsert) doc._id = id;
        
        if(!_.includes(userSession.roles, 'chatbots') && doc.model != 'gpt-3.5-turbo'){
            throw new Error('403')
        }

        if(!_.includes(['gpt-3.5-turbo', 'gpt-4o'], doc.model)){
            throw new Error('403')
        }

        return  {
            doc
        }
    }   
}
