const objectql = require('@steedos/objectql');
const auth = require('@steedos/auth');
const _ = require('lodash');

const addProductSubscriptions = async function (orderId){
    const order = await objectql.getObject('shop_orders').findOne(orderId);
    if(order && order.status === 'completed'){
        const orderLines = await objectql.getObject('shop_order_lines').find({filters: [['order', '=', orderId]]});
        for (const orderLine of orderLines) {
            const product = await objectql.getObject('shop_products').findOne(orderLine.product);
            if(product.is_subscription){
                const productVariant = await objectql.getObject('shop_product_variants').findOne(orderLine.product_variant);
                if(productVariant){
                    const { subscription_duration, subscription_user_number} = productVariant

                    let expired_at = null;
                    let user_number = null;
                    if(_.isNumber(subscription_duration)){
                        expired_at = new Date(moment().add(subscription_duration, 'd').format('YYYY-MM-DD hh:mm:ss'));
                    }

                    if(_.isNumber(subscription_user_number)){
                        user_number = subscription_user_number
                    }
                    for (const iterator of _.times(orderLine.quantity || 1, _.constant(1))) {
                        await objectql.getObject('shop_product_subscriptions').insert({
                            name: productVariant.name,
                            product: productVariant.product,
                            product_type: product.product_type,
                            order: orderId,
                            expired_at,
                            user_number,
                            space: order.space,
                            owner: order.owner,
                            company_id: order.company_id,
                            company_ids: order.company_ids,
                            created: new Date(),
                            modified: new Date()
                        })
                    }
                    
                }
            }
        }
    }
}

module.exports = {
    listenTo: 'shop_orders',

    beforeUpdate: async function(){
        const { id } = this;
        const order = await objectql.getObject('shop_orders').findOne(id);
        if(order.status === 'completed'){
            throw new Error(`已结束的订单禁止修改`);
        }
    },

    afterInsert: async function(){
        const { doc, id, userId } = this;
        const newDoc = await objectql.getObject('shop_orders').findOne(id)
        const userSession = await auth.getSessionByUserId(userId, doc.space);
        if(doc.status === 'completed'){
            await addProductSubscriptions(id)
        }else{
            const payWeixinInfo = await objectql.getSteedosSchema().broker.call(`~packages-@steedos-labs/pay-weixin.createUnifiedOrder`, {
                reference_object: 'shop_orders', 
                reference_record: id, 
                reference_record_label: newDoc.name, 
                amount: newDoc.current_total_price,
                space: doc.space
            }, {
                meta: {
                    user: userSession
                }
            })
            await objectql.getObject('shop_orders').directUpdate(id, {payment_method: 'pay-weixin', payment_id: payWeixinInfo._id})
        }
    },

    afterUpdate: async function(){
        const { id } = this;
        const newDoc = await objectql.getObject('shop_orders').findOne(id);
        if(newDoc.status === 'completed'){
            await addProductSubscriptions(id)
        }
    },

}