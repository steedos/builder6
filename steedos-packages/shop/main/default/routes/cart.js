const objectql = require('@steedos/objectql');
const _ = require('lodash');

async function getUserCart(userSession){
    const result = await objectql.getSteedosSchema().broker.call(`api.graphql`, {query: `
        {
            shop_carts(filters: [["owner", "=", "${userSession.userId}"]]){
            name,
            estimated_cost,
            lines: _related_shop_cart_lines_cart{
                merchandise,
                merchandise__expand{
                _id,
                sku,
                barcode,
                image,
                inventory_quantity,
                name,
                option1,
                option2,
                option3
                price,
                product,
                product__expand{
                    _id,
                    name,
                    sku,
                    slug,
                    rating,
                    description,
                    image,
                    keywords,
                    status,
                    tags,
                    option1,
                    option2,
                    option3,
                }
                },
                quantity,
                estimated_cost
            }
            }
        }
    `})
    let cart = null;
    if(result.data && result.data.shop_carts && result.data.shop_carts.length > 0){
        cart = result.data.shop_carts[0];
    }
    return cart;
}

async function changeCartEstimatedCost(userSession, cartId){
    const cartLines = await objectql.getObject('shop_cart_lines').find({filters: [['cart', '=', cartId]]})
    const estimatedCost = {
        subtotal_amount: 0.00,
        total_amount: 0.00
    }

    _.each(cartLines, (line)=>{
        if(!line.estimated_cost){
            line.estimated_cost = {}
        }
        estimatedCost.subtotal_amount = estimatedCost.subtotal_amount + line.estimated_cost.subtotal_amount || 0.00
        estimatedCost.total_amount = estimatedCost.total_amount + line.estimated_cost.total_amount || 0.00
    })
    await objectql.getObject('shop_carts').update(cartId, {estimated_cost: estimatedCost})
}

module.exports = {
    getUserCart,
    changeCartEstimatedCost
}