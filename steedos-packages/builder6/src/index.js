/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-09 11:47:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-06-19 13:23:04
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
const designers = require("./designers/index");
const events = require('./events')
const triggers = require('./triggers')
const methods = require('./methods')

const package = require('../package.json');
const packageName = package.name;
const packageLoader = require('@steedos/service-package-loader');
const BullMqMixin = require('moleculer-bullmq');
const Cron = require("moleculer-cron");

const crons = require('./crons')

const actions = require('./actions')

module.exports = {
    name: packageName,
    namespace: "steedos",
    mixins: [packageLoader, BullMqMixin, Cron],
    dependencies: ['steedos-server'],
    settings: {
        bullmq: {
            client: process.env.QUEUE_BACKEND,
            worker: { concurrency: 50 }
        },
        // Base path
        rest: "/app-builder",
        isProduction: process.env.NODE_ENV === "production",
        B6_CLOUD_API: process.env.B6_CLOUD_API,
        B6_CLOUD_PROJECT_ID: process.env.B6_CLOUD_PROJECT_ID,
        B6_CLOUD_PROJECT_SECRET: process.env.B6_CLOUD_PROJECT_SECRET,
        B6_CLOUD_SPACE_PREFIX: process.env.B6_CLOUD_SPACE_PREFIX,
        B6_CLOUD_PROJECT_PREFIX: process.env.B6_CLOUD_PROJECT_PREFIX
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
    crons,
    actions: {
        ...designer,
        ...designers,
        ...triggers,
        ...actions
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
