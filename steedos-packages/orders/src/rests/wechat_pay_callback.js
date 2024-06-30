
const WxPay = require('wechatpay-node-v3');
module.exports = {
    rest: {
        method: 'POST',
        fullPath: '/api/wechat/pay/callback',
        authorization: false,
        authentication: false
    },
    async handler(ctx) {
        const { summary, resource } = ctx.params;
        const { requestHeaders } = ctx.meta;
        const ordersObj = this.getObject('b6_orders');
        console.log("=====>",222)
        // console.log("=====>ctx:",ctx)
        console.log("======>req:", requestHeaders);
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
                privateKey: piclient_key,
                key: config.key
            });

            /**
             * 验证签名，提醒：node 取头部信息时需要用小写，例如：req.headers['wechatpay-timestamp']
             * @param params.timestamp HTTP头Wechatpay-Timestamp 中的应答时间戳
             * @param params.nonce HTTP头Wechatpay-Nonce 中的应答随机串
             * @param params.body 应答主体（response Body），需要按照接口返回的顺序进行验签，错误的顺序将导致验签失败。
             * @param params.serial HTTP头Wechatpay-Serial 证书序列号
             * @param params.signature HTTP头Wechatpay-Signature 签名
             * @param params.apiSecret APIv3密钥，如果在 构造器 中有初始化该值(this.key)，则可以不传入。当然传入也可以
            */
            const isValid = await pay.verifySign({
                timestamp: requestHeaders["wechatpay-timestamp"],
                nonce: requestHeaders["wechatpay-nonce"],
                body: ctx.params,
                serial: requestHeaders["wechatpay-serial"],
                signature: requestHeaders["wechatpay-signature"],
                // apiSecret: config.key
            });

            if (isValid) {
                console.log('支付成功:', isValid);
                // 处理支付成功逻辑
                let decryptData = null;
                decryptData = await pay.decipher_gcm(
                    resource.ciphertext, // 结果数据密文
                    resource.associated_data, // 附加数据
                    resource.nonce, // 加密使用的随机串
                );

                if (decryptData){
                    console.log("decryptData-------:",decryptData);
                    let b6_order = await ordersObj.findOne({ filters: [['out_trade_no', "=", decryptData.out_trade_no]] });
                    if (b6_order){
                        await ordersObj.update(b6_order._id, decryptData)
                    }

                }
                
            } else {
                console.log('签名验证失败', isValid);
            }

        } catch (error) {
            console.error(error);
        }
    }
}