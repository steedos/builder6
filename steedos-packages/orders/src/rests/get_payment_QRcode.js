
const WxPay = require('wechatpay-node-v3');
module.exports = {
    rest: {
        method: 'POST',
        fullPath: '/api/orders/user/get_payment_QRcode',
        authorization: false,
        authentication: false
    },
    params: {
        price: { type: 'number' }, 
        name: { type: 'string' } 
    },
    async handler(ctx) {
        const { price ,name } = ctx.params;
        const rootUrl = process.env.ROOT_URL;
        const ordersObj = this.getObject('b6_orders');
        console.log("=====>",111)
        console.log("======>",ctx.params);
        try {
            const piclient_key_params = {
                Bucket: 'wechat-pay-certs',
                Key: 'apiclient_key.pem'
            };
            const apiclient_cert_params = {
                Bucket: 'wechat-pay-certs',
                Key: 'apiclient_cert.pem'
            };
            const wechatpay_params = {
                Bucket: 'wechat-pay-certs',
                Key: 'wechatpay.pem'
            };
            const piclient_key = await this.get_s3_data(piclient_key_params);
            const apiclient_cert = await this.get_s3_data(apiclient_cert_params);
            const cert = await this.get_s3_data(wechatpay_params);
            const config = {
                appid: '', // 微信支付分配的公众账号ID
                mchid: '', // 微信支付分配的商户号
                key: '', // 商户平台设置的密钥
                serial: '', // 商户API证书的序列号
                platformCertificateSerial: '',
                privateKey: piclient_key,
                cert: cert
            };
            const pay = new WxPay({
                appid: config.appid,
                mchid: config.mchid,
                publicKey: apiclient_cert,
                privateKey: piclient_key
            });
            // console.log("==pay==", pay)
            // 创建订单
            let outTradeNo = `order_${Date.now()}`;
            const params = {
                description: name,
                out_trade_no: outTradeNo,
                notify_url: rootUrl + '/api/wechat/pay/callback',
                amount: {
                    total: parseFloat(price),
                    currency: 'CNY'
                },
                scene_info: {
                    payer_client_ip: 'ip',
                },
            };
            const result = await pay.transactions_native(params);
            console.log("========>",result)

            const query = {
                name: outTradeNo,
                trade_state: "PENDING"
            }
            await ordersObj.insert(query);
            return result
        } catch (error) {
            console.error(error);
        }
    }
}