/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-06-18 16:26:15
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-06-18 18:08:36
 * @Description: 
 */


module.exports = {
    addSendDataToCloudQueue: async function(ctx){
        const { baseName, tableName, data } = ctx.params;
        await this.queue(ctx, '@steedos/builder6', 'sendDataToCloud', { baseName: baseName, tableName: tableName, data: {
            doc: data
          }}, { priority: 10 })
    }
}