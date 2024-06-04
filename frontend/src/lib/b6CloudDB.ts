const axios = require('axios');

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

export const getRecords = async (tableId: string, id: string, record: JSON)=>{
    const result = await axios.get(`${B6_CLOUD_API}/v0/${B6_CLOUD_PROJECT_ID}/${tableId}`, {
        "headers": {
            "Authorization": `Bearer ${B6_CLOUD_PROJECT_SECRET}`
        }
    })
    return result.data;
}