const uuid = require("uuid");
const _ = require('lodash')

export const chatbotsBeforeUpdate = {
    trigger: { 
        listenTo: 'b6_chatbots', 
        when: ['beforeInsert', 'beforeUpdate']
    },
    async handler(ctx) {
        const {doc, isInsert, userId, spaceId} = ctx.params;

        const userSession = await this.getUser(userId, spaceId)
        
        if(doc.model){
            if(!_.includes(userSession.roles, 'chatbots') && doc.model != 'gpt-3.5-turbo'){
                throw new Error('403')
            }
    
            if(!_.includes(['gpt-3.5-turbo', 'gpt-4o'], doc.model)){
                throw new Error('403')
            }
        }

        if(!_.includes(userSession.roles, 'chatbots') && !_.isEmpty(doc.knowledge_sources)){
            throw new Error('403')
        }

        // 计算附件大小总计不能超过1MB
        if(!_.isEmpty(doc.knowledge_sources)){
            let countSize = 0
            for (const item of doc.knowledge_sources) {
                if(item.type === 'file' && item.file){
                    const fileInfo = await this.getObject('cfs_files_filerecord').findOne(item.file)
                    if(fileInfo){
                        countSize = countSize + fileInfo.original.size;
                    }
                }
            }

            if(countSize > 1 * 1024 * 1024){
                throw new Error('403')
            }
        }

        if(doc.knowledge_sources?.length > 5){
            throw new Error('403')
        }

        return  {
            doc
        }
    }   
}
