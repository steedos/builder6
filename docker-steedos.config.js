/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-06-05 17:01:47
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-06-05 17:02:35
 * @Description: 
 */
require('dotenv-flow').config({});

// Moleculer Configuration
// https://moleculer.services/docs/0.14/configuration.html
module.exports = {
	// Namespace of nodes to segment your nodes on the same network.
	namespace: "steedos",
	// Default log level for built-in console logger. It can be overwritten in logger options above.
	// Available values: trace, debug, info, warn, error, fatal
	logLevel: "warn",

    transporter: process.env.TRANSPORTER,

	// Called after broker started.
	started(broker) {
	},

};