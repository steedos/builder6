/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-06-04 11:01:33
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-06-05 14:18:09
 * @Description: 
 */
const axios = require('axios');
const _ = require('lodash')

const B6_CLOUD_API = process.env.B6_CLOUD_API
const B6_CLOUD_PROJECT_ID = process.env.B6_CLOUD_PROJECT_ID
const B6_CLOUD_PROJECT_SECRET = process.env.B6_CLOUD_PROJECT_SECRET

const callCloudApi = async (method: string, url: string, data?: any)=>{
    return await axios.request({
        method,
        url,
        data,
        headers: {
            "Authorization": `Bearer ${B6_CLOUD_PROJECT_SECRET}`
        }
    })
}

const getSPCProjectId = (spaceId: string)=>{
    return `${process.env.B6_CLOUD_SPACE_PREFIX}${spaceId}`
}

const getProjectId = (spaceId?: string)=>{
    return spaceId ? getSPCProjectId(spaceId) : B6_CLOUD_PROJECT_ID
}

export const getRecord = async (tableId: string, id: string, spaceId?: string)=>{
    try {
        const result = await callCloudApi('GET', `${B6_CLOUD_API}/v0/${getProjectId(spaceId)}/${tableId}/${id}`)
        return result.data.fields;
    } catch (error: any) {
        console.error(`getRecord error`, error.message)
        return null
    }
}

export const updateRecord = async (tableId: string, id: string, record: JSON, spaceId?: string)=>{
    const result = await callCloudApi('PUT', `${B6_CLOUD_API}/v0/${getProjectId(spaceId)}/${tableId}/${id}`, {
        fields: record
    });
    return result.data;
}

export const deleteRecord = async (tableId: string, id: string, spaceId?: string)=>{
    const result = await callCloudApi(`DELETE`, `${B6_CLOUD_API}/v0/${getProjectId(spaceId)}/${tableId}/${id}`)
    return result.data;
}

export const getRecords = async (tableId: string, spaceId?: string)=>{
    const result = await callCloudApi('GET', `${B6_CLOUD_API}/v0/${getProjectId(spaceId)}/${tableId}`)
    return _.map(result.data, 'fields');
}