
const WxPay = require('wechatpay-node-v3');
const express = require('express');
const QRCode = require('qrcode');
module.exports = {
    rest: {
        method: 'POST',
        fullPath: '/api/orders/user/get_payment_QRcode'
    },
    params: {
        price: { type: 'number' }, 
        name: { type: 'string' } 
    },
    async handler(ctx) {
        const { price ,name } = ctx.params;
        console.log("=====>",111)
        console.log("======>",ctx.params);
        try {
            const piclient_key_params = {

            };
            const apiclient_cert_params = {

            };
            const wechatpay_params = {

            };
            const piclient_key = await this.get_s3_data(piclient_key_params);
            const apiclient_cert = await this.get_s3_data(apiclient_cert_params);
            const cert = await this.get_s3_data(wechatpay_params);
            const config = {
            };
            const pay = new WxPay({
                appid: config.appid,
                mchid: config.mchid,
                publicKey: apiclient_cert,
                privateKey: piclient_key
            });
            // console.log("==pay==", pay)
            // 创建订单
            const params = {
                description: name,
                out_trade_no: `order_${Date.now()}`,
                notify_url: 'https://automation.steedos.cn/api/v1/webhooks/tMXBhaKbjLlNynHLI7Ep3',
                amount: {
                    total: price,
                    currency: 'CNY'
                },
                scene_info: {
                    payer_client_ip: 'ip',
                },
            };
            const result = await pay.transactions_native(params);
            console.log("========>",result)
            return result
        } catch (error) {
            console.error(error);
        }
    }
}