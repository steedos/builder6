/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-06-03 18:28:30
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-06-19 13:36:00
 * @Description: 
 */
const _ = require('lodash');

module.exports = {
    "steedos-server.started": function(payload, sender, eventName, ctx){
      ctx.broker.call(`steedos-server.setSettings`, {PUBLIC_SETTINGS: {B6_FRONTEND_URL: process.env.B6_FRONTEND_URL}})
    },
    ...require('./b6_access_tokens'),
    ...require('./b6_blocks'),
    ...require('./b6_blogs'),
    ...require('./b6_chatbots_knowledge_source'),
    ...require('./b6_chatbots'),
    ...require('./b6_components'),
    ...require('./b6_documents'),
    ...require('./b6_fields'),
    ...require('./b6_pages'),
    ...require('./b6_projects'),
    ...require('./b6_tables'),
    ...require('./b6_orders'),
    ...require('./b6_payment_links'),
    ...require('./b6_products'),
    ...require('./b6_product_config'),
  }