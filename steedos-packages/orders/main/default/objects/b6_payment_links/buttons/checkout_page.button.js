// const path = require("path");
module.exports = {
    checkout_page: function(object_name, record_id) {
        // 获取应用url
        console.log("object_name--------",object_name)
        console.log("record_id--------",record_id)
        const b6PaymentLinksObj = Steedos.authRequest(`/api/v1/${object_name}/${record_id}`, {
            type: 'GET',
            async: false,
            contentType: 'application/json'
        });
        if (b6PaymentLinksObj){
            console.log("b6PaymentLinksObj: ",b6PaymentLinksObj);
            const b6PageId = record.page;
            const rootUrl= process.env.ROOT_URL;
            const params = `?b6_page_id=${record_id}&root_url=${rootUrl}`;
           
        }
        
        
    }

}