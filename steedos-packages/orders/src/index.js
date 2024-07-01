/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-09 11:47:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-07-01 13:31:41
 * @Description: 
 */
const path = require('path');
const package = require('../package.json');
const packageName = package.name;
const packageLoader = require('@steedos/service-package-loader');

const rests = require('./rests');
const methods = require('./methods');

module.exports = {
    name: packageName,
    namespace: "steedos",
    mixins: [packageLoader],
    dependencies: ['steedos-server'],
    metadata: {
        $package: {
            name: package.name,
            version: package.version,
            path: path.join(__dirname, ".."),
            isPackage: true
        }
    },
    actions: {
        ...rests,
    },
    hooks: {
    },
    methods: methods,

    async started() {
        this.broker.call(`steedos-server.setSettings`, {PUBLIC_SETTINGS: {B6_PAYMENT_CHECKOUT_URL: process.env.B6_PAYMENT_CHECKOUT_URL}}).catch(()=>{
              
        })
    }

}