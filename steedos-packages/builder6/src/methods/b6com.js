/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-06-12 16:06:10
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-06-17 16:02:58
 * @Description: 
 */

const axios = require('axios');
const _ = require('lodash')
const { absoluteUrl } = require('@steedos/utils')

module.exports = {
    formatKnowledgeSource: async function(knowledge_source){
        if(knowledge_source.type === 'file' && knowledge_source.file){
            const fileInfo = await this.getObject('cfs_files_filerecord').findOne(knowledge_source.file)
            if(fileInfo){
                knowledge_source.file_info = {
                    _id: fileInfo._id,
                    url: absoluteUrl(`/api/files/files/${knowledge_source.file}?download=1`),
                    name: fileInfo.original.name
                }
            }
        }else if(knowledge_source.type === 'table' && knowledge_source.table){
            const tableInfo = await this.getObject('b6_tables').findOne(knowledge_source.table)
            const tableFields = await this.getObject('b6_fields').find({filters: ['table_id', '=', knowledge_source.table], fields: ['name', 'label', 'type', 'description']})
            knowledge_source.table_info = {
                _id: tableInfo._id,
                name: tableInfo.name,
                label: tableInfo.label,
                fields: tableFields,
                space: tableInfo.space
            }
        }else if(knowledge_source.type === 'document' && knowledge_source.document){
            const documentInfo = await this.getObject('b6_documents').findOne(knowledge_source.document)
            knowledge_source.document_info = {
                _id: documentInfo._id,
                name: documentInfo.name,
                type: documentInfo.type,
                markdown: documentInfo.markdown,
                html: documentInfo.html,
                space: documentInfo.space
            }
        }else{
            throw new Error('无效类型的知识源')
        }
        return knowledge_source;
    },
    b6comChatbotUpdate: async function(objectName, id){
        const record = await this.getObject(objectName).findOne(id);

        const knowledge_sources = []

        if(!_.isEmpty(record.knowledge_sources)){
            for(const item of record.knowledge_sources){
                knowledge_sources.push(await this.formatKnowledgeSource(item))
            }
        }

        record.knowledge_sources = knowledge_sources

        return await axios.put(`${process.env.B6_FRONTEND_URL}/api/chatbots/record`, {
            record: record
        })
    },
    b6comChatbotDelete: async function(objectName, id) {
        return await axios.delete(`${process.env.B6_FRONTEND_URL}/api/chatbots/record`, {
            recordId: record._id
        })
    },
    b6comChatbotKnowledgeSourceUpdate: async function(objectName, id, knowledge_source){
        const record = await this.getObject(objectName).findOne(id);
        return await axios.put(`${process.env.B6_FRONTEND_URL}/api/chatbots/knowledge_sources`, {
            chatbot: record, 
            knowledge_source: await this.formatKnowledgeSource(knowledge_source)
        })
    },
    b6comChatbotKnowledgeSourceDelete: async function(objectName, id, knowledge_source){
        const record = await this.getObject(objectName).findOne(id);
        return await axios.post(`${process.env.B6_FRONTEND_URL}/api/chatbots/knowledge_sources`, {
            action: 'DELETE',
            chatbot: record, 
            knowledge_source: await this.formatKnowledgeSource(knowledge_source)
        })
    }
}