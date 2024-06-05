/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-06-05 03:40:23
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-05 03:49:08
 * @FilePath: /builder6/frontend/src/app/(interfaces)/_lib/amis-sdk.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { Fragment } from 'react';
import Script from 'next/script';
import _ from "lodash";

if(_.isEmpty(process.env.STEEDOS_UNPKG_URL)) {
	process.env.STEEDOS_UNPKG_URL = 'https://unpkg.steedos.cn';
}
process.env.STEEDOS_UNPKG_URL =  process.env.STEEDOS_UNPKG_URL.replace(/\/+$/, "");

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

const getConfig = (key) => {
  return process.env[key]
}

const STEEDOS_UNPKG_URL = getConfig("STEEDOS_UNPKG_URL"),
  STEEDOS_AMIS_URL = getConfig("STEEDOS_AMIS_URL");

const getMainHeadCss = () => {
    return <Fragment>
        <link rel="stylesheet" href={STEEDOS_UNPKG_URL + "/@salesforce-ux/design-system@2.22.2/assets/styles/salesforce-lightning-design-system.min.css"} />
        <link rel="stylesheet" href={STEEDOS_UNPKG_URL + "/@steedos-widgets/amis@6.3.0-patch.3/lib/themes/antd.css"} />
        {/* <link rel="stylesheet" href={STEEDOS_UNPKG_URL + "/@steedos-widgets/amis@6.3.0-patch.3/lib/helper.css"} />
        <link rel="stylesheet" href={STEEDOS_UNPKG_URL + "/@steedos-widgets/amis@6.3.0-patch.3/sdk/iconfont.css"} />
        <link rel="stylesheet" href={STEEDOS_UNPKG_URL + "/@fortawesome/fontawesome-free@6.2.0/css/all.min.css"} />
        <link rel="stylesheet" href="/tailwind/tailwind-steedos.css" />
        <link rel="stylesheet" href="/amis/amis.css" /> */}
    </Fragment>
}

const getMainHeadJs = () => {
    return <Fragment>
        <Script src={STEEDOS_UNPKG_URL + "/lodash@4.17.21/lodash.min.js"} strategy="beforeInteractive" />
        <Script src={STEEDOS_AMIS_URL + "/sdk/sdk.js"} strategy="beforeInteractive" />
        <Script src={"https://unpkg.com" + "/history@4.10.1/umd/history.js"} strategy="beforeInteractive" />
    </Fragment>
}


export {
    getMainHeadCss,
    getMainHeadJs
}