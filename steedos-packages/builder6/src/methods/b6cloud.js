
const axios = require('axios');

module.exports = {
    builder6Update: async function(objectName, id){
        const record = await this.getObject(objectName).findOne(id);
        return await axios.put(`${this.settings.B6_CLOUD_API}/v0/${this.settings.B6_CLOUD_PROJECT_ID}/${objectName}/${id}`, {
            fields: record
        }, {
            "headers": {
                "Authorization": `Bearer ${this.settings.B6_CLOUD_PROJECT_SECRET}`
            }
        })
    },
    builder6Delete: async function(objectName, id) {
        return await axios.delete(`${this.settings.B6_CLOUD_API}/v0/${this.settings.B6_CLOUD_PROJECT_ID}/${objectName}/${id}`, {
            "headers": {
                "Authorization": `Bearer ${this.settings.B6_CLOUD_PROJECT_SECRET}`
            }
        })
    },
    builder6SpaceUpdate: async function(objectName, id){
        const record = await this.getObject(objectName).findOne(id);
        return await axios.put(`${this.settings.B6_CLOUD_API}/v0/${this.settings.B6_CLOUD_SPACE_PREFIX}${record.space}/${objectName}/${id}`, {
            fields: record
        }, {
            "headers": {
                "Authorization": `Bearer ${this.settings.B6_CLOUD_PROJECT_SECRET}`
            }
        })
    },
    builder6SpaceDelete: async function(objectName, id) {
        return await axios.delete(`${this.settings.B6_CLOUD_API}/v0/${this.settings.B6_CLOUD_SPACE_PREFIX}${record.space}/${objectName}/${id}`, {
            "headers": {
                "Authorization": `Bearer ${this.settings.B6_CLOUD_PROJECT_SECRET}`
            }
        })
    },
    builder6ProjectUpdate: async function(objectName, id){
        const record = await this.getObject(objectName).findOne(id);
        return await axios.put(`${this.settings.B6_CLOUD_API}/v0/${this.settings.B6_CLOUD_PROJECT_PREFIX}${record.project_id}/${objectName}/${id}`, {
            fields: record
        }, {
            "headers": {
                "Authorization": `Bearer ${this.settings.B6_CLOUD_PROJECT_SECRET}`
            }
        })
    },
    builder6ProjectDelete: async function(objectName, id) {
        return await axios.delete(`${this.settings.B6_CLOUD_API}/v0/${this.settings.B6_CLOUD_PROJECT_PREFIX}${record.project_id}/${objectName}/${id}`, {
            "headers": {
                "Authorization": `Bearer ${this.settings.B6_CLOUD_PROJECT_SECRET}`
            }
        })
    }
}