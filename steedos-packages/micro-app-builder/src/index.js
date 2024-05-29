/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-09 11:47:34
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-05-29 09:15:07
 * @Description: 
 */
const path = require('path');
// const app = require("./app");
const app = require("./micro");
const appSchema = require("./schema/app");
const pagesSchema = require("./schema/pages");
const appSettings = require("./micro-settings");
const appSettingsSchema = require("./schema/settings/app");
const pagesSettingsSchema = require("./schema/settings/pages");
// const appBuilder = require("./app-builder");

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
        rest: "/app-builder",
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
        app,
        // appBuilder,
        appSchema,
        pagesSchema,
        appSettings,
        appSettingsSchema,
        pagesSettingsSchema
    },
    hooks: {
    },
    methods: {
    },

    async started() {
    }

}