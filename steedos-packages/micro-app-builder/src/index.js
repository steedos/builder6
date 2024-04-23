/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-09 11:47:34
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-02-19 09:48:55
 * @Description: 
 */
const path = require('path');

const package = require('../package.json');
const packageName = package.name;
const packageLoader = require('@steedos/service-package-loader');

module.exports = {
    name: packageName,
    namespace: "steedos",
    mixins: [packageLoader],
    dependencies: [],
    settings: {
        // Base path
        rest: "/amis-builder",
        isProduction: process.env.NODE_ENV === "production",
    },
    metadata: {
        $package: {
            name: package.name,
            version: package.version,
            path: path.join(__dirname, ".."),
            isPackage: true
        }
    },
    actions: {
    },
    hooks: {
    },
    methods: {
    },

    async started() {
    }

}