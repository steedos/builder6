const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const _ = require('lodash');
const objectql = require('@steedos/objectql');
const {changeCartEstimatedCost} = require('./cart');
/**
 * 此接口目前不支持折扣、运费
 */
router.post('/api/shop/order/submitOrder', core.requireAuthentication, async function (req, res) {
    try {
        const userSession = req.user;

        let financial_status = 'pending';
        let current_subtotal_price = 0.00;
        let current_total_discounts = 0.00;
        let current_total_price = 0.00;
        let current_total_tax = 0.00;
        let status = 'unpaid';

        /**
         * variants: [{_id, quantity}]
         */
        const { variants, isQuick } = req.body;

        const order_lines = [];

        for (const variant of variants) {
            const { _id: variantId, quantity } = variant;
            if (!_.isInteger(quantity)) {
                throw new Error(`Quantity must be Integer`);
            }
            const record = await objectql.getObject('shop_product_variants').findOne(variantId);
            if (!record) {
                throw new Error(`未找到商品`);
            }
            order_lines.push({
                product_variant: record._id,
                product: record.product,
                price: record.price,
                quantity: quantity,
                requires_shipping: false, //此属性应该来自shop_product_variants，但目前未定义。先使用false
                sku: record.sku
            })

            current_subtotal_price += record.price * quantity
        }

        try {
            if(isQuick == false){
                const buyVariantsId = _.map(order_lines, 'product_variant');
                const userCarts = await objectql.getObject('shop_carts').find({filters: [['owner', '=', userSession.userId]]});
                if(userCarts && userCarts.length > 0 && buyVariantsId.length > 0){
                    let userCart = userCarts[0];
                    let userCartId = userCart._id;
                    const cartLines = await objectql.getObject('shop_cart_lines').find({filters: [['cart', '=', userCartId],['merchandise', 'in', buyVariantsId]]})
                    for(const cartLine of cartLines){
                        await objectql.getObject('shop_cart_lines').delete(cartLine._id)
                    }
                    await changeCartEstimatedCost(userSession, userCartId);
                }
            }
        } catch (error) {
            console.error(error);
        }

        current_total_price = current_subtotal_price;

        if (current_total_price <= 0.00) {
            status = 'completed';
            financial_status = '';
        }
        const now = new Date();
        const orderId = await objectql.getObject('shop_orders')._makeNewID()

        for (const order_line of order_lines) {
            await objectql.getObject('shop_order_lines').insert(Object.assign({}, order_line, { 
                order: orderId, 
                owner: userSession.userId,
                space: userSession.spaceId, 
                created: now,
                modified:now,
                created_by: userSession.userId,
                modified_by: userSession.userId,
                company_id: userSession.company_id, 
                company_ids: userSession.company_ids
            }))
        }

        const order = await objectql.getObject('shop_orders').insert({
            _id: orderId,
            status,
            financial_status,
            current_subtotal_price,
            current_total_discounts,
            current_total_price,
            current_total_tax,
            owner: userSession.userId,
            space: userSession.spaceId, 
            created: now,
            modified:now,
            created_by: userSession.userId,
            modified_by: userSession.userId,
            company_id: userSession.company_id, 
            company_ids: userSession.company_ids
        })

        const recordNew = await objectql.getObject('shop_orders').findOne(order._id)
        res.status(200).send(recordNew);
    } catch (err) {
        console.error(`err`, err)
        res.status(500).send({ message: err.message });
    }
});
exports.default = router;