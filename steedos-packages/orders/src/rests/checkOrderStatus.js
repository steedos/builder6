/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-07-01 15:35:19
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-07-01 15:39:40
 * @Description: 
 */

module.exports = {
    rest: {
        method: 'GET',
        fullPath: '/api/orders/user/check_order_status/:orderId',
        authorization: false,
        authentication: false
    },
    params: {
        orderId: { type: 'string' } 
    },
    async handler(ctx) {
        const { orderId } = ctx.params;
        try {
            const ordersObj = this.getObject('b6_orders');
            const record = await ordersObj.findOne(orderId)
            return {
                trade_state: record.trade_state
            }
        } catch (error) {
            console.error(error);
            return {
                trade_state: ""   
            }
        }
    }
}