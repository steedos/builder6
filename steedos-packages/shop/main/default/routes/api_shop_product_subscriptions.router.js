const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const _ = require('lodash');
const objectql = require('@steedos/objectql');

/***
 * TODO
 * 限制查询范围为 我的魔方
 */

const formatProductSubscriptions = async (productSubscriptions)=>{
    const newProductSubscriptions = [];
    for (const productSubscription of productSubscriptions) {
        const product = await objectql.getObject('shop_products').findOne(productSubscription.product, {fields: ['_id','name','slug','sku','description']})
        newProductSubscriptions.push(Object.assign({}, productSubscription, {product: product}))
    }
    return newProductSubscriptions;
}

router.get('/api/shop/product_subscriptions', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const userId = userSession.userId;
    const records = await objectql.getObject('shop_product_subscriptions').find({filters: [['owner', '=', userId]]}, userSession);
    const result = await formatProductSubscriptions(records)
    res.status(200).send({ data: result});
});


router.get('/api/shop/product_subscriptions/:productTypeSlug', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const userId = userSession.userId;
    const { productTypeSlug } = req.params;
    const types = await objectql.getObject('shop_product_types').find({filters: [['slug', '=', productTypeSlug]]});
    if(types && types.length > 0){
        const records = await objectql.getObject('shop_product_subscriptions').find({filters: [['owner', '=', userId],['product_type', '=', types[0]._id]]}, userSession)
        const result = await formatProductSubscriptions(records)
        return res.status(200).send({ data: result});
    }
    res.status(200).send({ data: []});
});
exports.default = router;