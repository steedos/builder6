/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-06-03 10:03:32
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-04 05:10:15
 * @FilePath: /builder6/frontend/src/app/(interfaces)/interfaces/lib/data.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const axios = require('axios');

export async function getPageSchema(id: string) {
    try {
        const url = `${process.env.STEEDOS_ROOT_URL}/api/v1/b6_pages/${id}`;
        // TODO:换成aws请求
        const result = await axios.get(url, {
            "headers": {
                "Authorization": `Bearer 66593dfaf7b089064654f128,6b009696cc7b2b6c02f7f262f3de2d0028c4ccefa95fc19be880b06dd91f36511903886ffc52511eba7bfb`
            }
        });
        if (result?.data?.data?.amis_schema) {
            return JSON.parse(result.data.data.amis_schema)
        }
        else {
            return {}
        }
    } catch (error) {
        console.log("===getPageSchema====error=====", error);
        return {}
    }
}