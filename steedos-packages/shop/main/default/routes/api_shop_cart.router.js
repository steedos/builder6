const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');
const _ = require('lodash');
const {getUserCart, changeCartEstimatedCost} = require('./cart');

/**
 * 获取用户购物车记录，如果没有则新建
 * 新增cart lines 记录：如果有则数量加1，如果没有则新增
 */
router.post('/api/api/shop/cart', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    let { variantId, quantity = 1 } = req.body;    
    const userCarts = await objectql.getObject('shop_carts').find({filters: [['owner', '=', userSession.userId]]});
    let userCart = null;
    if(userCarts && userCarts.length > 0){
        userCart = userCarts[0];
    }
    const now = new Date();
    let userCartId = null;
    if(!userCart){
        userCart = await objectql.getObject('shop_carts').insert({ 
            owner: userSession.userId,
            space: userSession.spaceId, 
            created: now,
            modified:now,
            created_by: userSession.userId,
            modified_by: userSession.userId,
            company_id: userSession.company_id, 
            company_ids: userSession.company_ids
        }) 
    }

    userCartId = userCart._id;

    const variant = await objectql.getObject('shop_product_variants').findOne(variantId);
    if (!variant) {
        throw new Error(`未找到商品`);
    }

    if(quantity > 0){
        const cartLines = await objectql.getObject('shop_cart_lines').find({filters: [['cart', '=', userCartId],['merchandise', '=', variantId]]})
        if(cartLines && cartLines.length > 0){
            const cartLine = cartLines[0];
            if(!_.has(req.body,'quantity')){
                quantity = cartLine.quantity + 1
            }
            await objectql.getObject('shop_cart_lines').update(cartLine._id, {
                quantity: quantity,
                estimated_cost:{
                    subtotal_amount: variant.price * quantity,
                    total_amount: variant.price * quantity
                } 
            })
        }else{
            await objectql.getObject('shop_cart_lines').insert({
                merchandise: variantId,
                quantity: quantity || 1,
                cart: userCartId,
                estimated_cost:{
                    subtotal_amount: variant.price * quantity,
                    total_amount: variant.price * quantity
                },
                owner: userSession.userId,
                space: userSession.spaceId, 
                created: now,
                modified:now,
                created_by: userSession.userId,
                modified_by: userSession.userId,
                company_id: userSession.company_id, 
                company_ids: userSession.company_ids
            })
        }
    }else{
        const cartLines = await objectql.getObject('shop_cart_lines').find({filters: [['cart', '=', userCartId],['merchandise', '=', variantId]]})
        if(cartLines && cartLines.length > 0){
            const cartLine = cartLines[0];
            await objectql.getObject('shop_cart_lines').delete(cartLine._id)
        }
    }

    await changeCartEstimatedCost(userSession, userCartId);

    const cart = await getUserCart(userSession);
    res.status(200).send({ ...cart });
});

router.get('/api/api/shop/cart', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const cart = await getUserCart(userSession);
    res.status(200).send({ ...cart });
});

exports.default = router;