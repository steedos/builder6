/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-09 11:47:34
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-06 22:57:01
 * @Description: 
 */
const path = require('path');
const app = require("./interfaces/interfaces");
const appSchema = require("./interfaces/schema/app");
const pagesSchema = require("./interfaces/schema/pages");
const appSettings = require("./interfaces/interfaces-settings");
const appSettingsSchema = require("./interfaces/schema/settings/app");
const pagesSettingsSchema = require("./interfaces/schema/settings/pages");
const designer = require("./interfaces/designer/index");
const events = require('./events')
const methods = require('./methods')

const package = require('../package.json');
const packageName = package.name;
const packageLoader = require('@steedos/service-package-loader');

module.exports = {
    name: packageName,
    namespace: "steedos",
    mixins: [packageLoader],
    dependencies: ['steedos-server'],
    settings: {
        // Base path
        rest: "/app-builder",
        isProduction: process.env.NODE_ENV === "production",
        B6_CLOUD_API: process.env.B6_CLOUD_API,
        B6_CLOUD_PROJECT_ID: process.env.B6_CLOUD_PROJECT_ID,
        B6_CLOUD_PROJECT_SECRET: process.env.B6_CLOUD_PROJECT_SECRET,
        B6_CLOUD_SPACE_PREFIX: process.env.B6_CLOUD_SPACE_PREFIX,
        B6_CLOUD_META_OBJECTS: ['b6_access_tokens', 'b6_chatbots', 'b6_projects', 'b6_tables', 'b6_fields', 'b6_pages', 'spaces', 'spaces_users'],
        B6_CLOUD_SPACE_OBJECTS: ['b6_pages']
    },
    metadata: {
        $package: {
            name: package.name,
            version: package.version,
            path: path.join(__dirname, ".."),
            isPackage: true
        }
    },
    // actions: {
    //     app,
    //     appSchema,
    //     pagesSchema,
    //     appSettings,
    //     appSettingsSchema,
    //     pagesSettingsSchema,
    // },
    actions: {
        designer
    },
    hooks: {
    },
    methods: methods,
    events: events,
    async started() {
        this.broker.call(`steedos-server.setSettings`, {PUBLIC_SETTINGS: {B6_FRONTEND_URL: process.env.B6_FRONTEND_URL}}).catch(()=>{
            
        })
    }

}