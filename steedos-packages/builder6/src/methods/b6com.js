/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-06-12 16:06:10
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-06-13 13:22:24
 * @Description: 
 */

const axios = require('axios');
const _ = require('lodash')
const { absoluteUrl } = require('@steedos/utils')

module.exports = {
    b6comChatbotUpdate: async function(objectName, id){
        const record = await this.getObject(objectName).findOne(id);

        const knowledge_source_files = []

        if(!_.isEmpty(record.knowledge_source_files)){
            for(const item of record.knowledge_source_files){
                if(item.file){
                    item.url = absoluteUrl(`/api/files/files/${item.file}?download=1`);
                    const fileInfo = await this.getObject('cfs_files_filerecord').findOne(item.file)
                    if(fileInfo){
                        item.name = fileInfo.original.name
                        knowledge_source_files.push(item)
                    }
                }
            }
        }

        record.knowledge_source_files = knowledge_source_files

        return await axios.put(`${process.env.B6_FRONTEND_URL}/api/chatbots/record`, {
            record: record
        })
    },
    b6comChatbotDelete: async function(objectName, id) {
        //TODO
    }
}