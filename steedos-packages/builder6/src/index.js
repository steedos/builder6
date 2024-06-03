/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-09 11:47:34
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-05-31 04:07:27
 * @Description: 
 */
require("./default.steedos.config"); //TODO:不懂为什么拿不到platform中的环境变量默认值，还需要这里执行一次
const path = require('path');
// const app = require("./app");
const app = require("./interfaces");
const appSchema = require("./schema/app");
const pagesSchema = require("./schema/pages");
const appSettings = require("./interfaces-settings");
const appSettingsSchema = require("./schema/settings/app");
const pagesSettingsSchema = require("./schema/settings/pages");
// const appBuilder = require("./app-builder");
const events = require('./events')
const methods = require('./methods')

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
        B6_CLOUD_API: process.env.B6_CLOUD_API,
        B6_CLOUD_PROJECT_ID: process.env.B6_CLOUD_PROJECT_ID,
        B6_CLOUD_PROJECT_SECRET: process.env.B6_CLOUD_PROJECT_SECRET,
        SYNC_TO_B6_CLOUD_OBJECTS: ['b6_chatbots', 'b6_documents', 'b6_document_versions', 'b6_projects', 'b6_tables', 'interfaces', 'interface_pages']
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
    methods: methods,
    events: events,
    async started() {
    }

}