// const path = require("path");
module.exports = {
    checkout_page: function(object_name, record_id) {
        // 获取支付链接
        const b6PaymentLinksObj = Steedos.authRequest(`/api/v1/${object_name}/${record_id}`, {
            type: 'GET',
            async: false,
            contentType: 'application/json'
        });
        if (b6PaymentLinksObj){
            const b6PageId = b6PaymentLinksObj.data.page;
            const rootUrl= __meteor_runtime_config__.ROOT_URL;
            const params = `?b6_payment_link_id=${record_id}&root_url=${rootUrl}`;
            console.log("------",`${Meteor.settings.public.B6_PAYMENT_CHECKOUT_URL}${params}`);
            window.open(`${Meteor.settings.public.B6_PAYMENT_CHECKOUT_URL}${params}`)
        }
    }
}