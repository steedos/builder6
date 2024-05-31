/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-05-30 01:31:26
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-05-30 01:43:24
 * @FilePath: /microapps/steedos-packages/builder6/src/default.steedos.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use strict";
const _ = require("lodash")

if(_.isEmpty(process.env.STEEDOS_TENANT_ENABLE_PASSWORD_LOGIN)) {
	process.env.STEEDOS_TENANT_ENABLE_PASSWORD_LOGIN = 'true';
}

if(_.isEmpty(process.env.STEEDOS_UNPKG_URL)) {
	process.env.STEEDOS_UNPKG_URL = 'https://unpkg.steedos.cn';
}
process.env.STEEDOS_UNPKG_URL =  process.env.STEEDOS_UNPKG_URL.replace(/\/+$/, "");

if(_.isEmpty(process.env.STEEDOS_BUILDER_URL)) {
	process.env.STEEDOS_BUILDER_URL = 'https://6-3.builder.steedos.com';
}
process.env.STEEDOS_BUILDER_URL =  process.env.STEEDOS_BUILDER_URL.replace(/\/+$/, "");


if(_.isEmpty(process.env.STEEDOS_AMIS_VERSION)) {
	process.env.STEEDOS_AMIS_VERSION = '6.3.0-patch.3';
}

if(_.isEmpty(process.env.STEEDOS_AMIS_URL)) {
	// process.env.STEEDOS_AMIS_URL = process.env.STEEDOS_UNPKG_URL + '/amis@' + process.env.STEEDOS_AMIS_VERSION;
	// 默认加载 https://unpkg.steedos.cn/@steedos-widgets/amis@3.6.3-patch.2， STEEDOS_AMIS_VERSION可变更版本号
	process.env.STEEDOS_AMIS_URL = process.env.STEEDOS_UNPKG_URL + '/@steedos-widgets/amis@' + process.env.STEEDOS_AMIS_VERSION;
}else{
	process.env.STEEDOS_AMIS_URL = process.env.STEEDOS_AMIS_URL.replace("https://unpkg.com", process.env.STEEDOS_UNPKG_URL)
}
process.env.STEEDOS_AMIS_URL =  process.env.STEEDOS_AMIS_URL.replace(/\/+$/, "");

if(_.isEmpty(process.env.STEEDOS_WIDGETS_VERSION)) {
	process.env.STEEDOS_WIDGETS_VERSION = '6.3.0-beta.17';
}

if(_.isEmpty(process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS)) {
	const widgetsVersion = process.env.STEEDOS_WIDGETS_VERSION;
	const unpkgUrl = process.env.STEEDOS_UNPKG_URL;
	let steedosPublicPageAsseturls = `${unpkgUrl}/@steedos-widgets/amis-object@${widgetsVersion}/dist/assets.json`;
	if (!_.isEmpty(process.env.STEEDOS_WIDGETS_ADDITIONAL)) {
		process.env.STEEDOS_WIDGETS_ADDITIONAL.split(',').forEach(additional => {
			steedosPublicPageAsseturls += `,${unpkgUrl}/${additional}@${widgetsVersion}/dist/assets.json`;
		})
	}
	process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS = steedosPublicPageAsseturls
}

if(_.isEmpty(process.env.SERIALIZER)){
	process.env.SERIALIZER = 'JSON'
}

if (_.isEmpty(process.env.ROOT_URL)) {
	console.error("ERROR: Environment variable ROOT_URL is not defined.")
	process.env.ROOT_URL = "http://localhost"
}

process.env.ROOT_URL = process.env.ROOT_URL.replace(/\/+$/, "");
