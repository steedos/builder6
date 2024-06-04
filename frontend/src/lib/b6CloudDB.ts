/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-06-04 11:01:33
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-06-04 14:21:05
 * @Description: 
 */
const axios = require('axios');
const _ = require('lodash')

const B6_CLOUD_API = process.env.B6_CLOUD_API
const B6_CLOUD_PROJECT_ID = process.env.B6_CLOUD_PROJECT_ID
const B6_CLOUD_PROJECT_SECRET = process.env.B6_CLOUD_PROJECT_SECRET


export const getRecord = async (tableId: string, id: string)=>{
    try {
        const result = await axios.get(`${B6_CLOUD_API}/v0/${B6_CLOUD_PROJECT_ID}/${tableId}/${id}`, {
            "headers": {
                "Authorization": `Bearer ${B6_CLOUD_PROJECT_SECRET}`
            }
        });
        return result.data.fields;
    } catch (error) {
        console.log(`error====?`, error)
        return null
    }
}

export const updateRecord = async (tableId: string, id: string, record: JSON)=>{
    const result = await axios.put(`${B6_CLOUD_API}/v0/${B6_CLOUD_PROJECT_ID}/${tableId}/${id}`, {
        fields: record
    }, {
        "headers": {
            "Authorization": `Bearer ${B6_CLOUD_PROJECT_SECRET}`
        }
    })
    return result.data;
}

export const deleteRecord = async (tableId: string, id: string, record: JSON)=>{
    const result = await axios.delete(`${B6_CLOUD_API}/v0/${B6_CLOUD_PROJECT_ID}/${tableId}/${id}`, {
        "headers": {
            "Authorization": `Bearer ${B6_CLOUD_PROJECT_SECRET}`
        }
    })
    return result.data;
}

export const getRecords = async (tableId: string)=>{
    const result = await axios.get(`${B6_CLOUD_API}/v0/${B6_CLOUD_PROJECT_ID}/${tableId}`, {
        "headers": {
            "Authorization": `Bearer ${B6_CLOUD_PROJECT_SECRET}`
        }
    })
    return _.map(result.data, 'fields');
}