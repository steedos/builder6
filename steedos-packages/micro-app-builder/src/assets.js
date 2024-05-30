/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-05-29 09:08:58
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-05-30 02:43:01
 * @FilePath: /microapps/steedos-packages/micro-app-builder/src/assets.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const getConfig = (key) => {
    return process.env[key]
}

const STEEDOS_UNPKG_URL = getConfig("STEEDOS_UNPKG_URL"),
    STEEDOS_AMIS_URL = getConfig("STEEDOS_AMIS_URL"),
    STEEDOS_PUBLIC_PAGE_ASSETURLS = getConfig("STEEDOS_PUBLIC_PAGE_ASSETURLS"),
    STEEDOS_AMIS_VERSION = getConfig("STEEDOS_AMIS_VERSION");

const getEnvData = function (toString) {
    let data = {
        ROOT_URL: '',
        STEEDOS_SENTRY_ENABLED: process.env.STEEDOS_SENTRY_ENABLED,
        NODE_ENV: process.env.NODE_ENV,
        // STEEDOS_SENTRY_DSN: process.env.STEEDOS_SENTRY_DSN,
        STEEDOS_UNPKG_URL: getConfig('STEEDOS_UNPKG_URL'),
        STEEDOS_AMIS_URL: getConfig('STEEDOS_AMIS_URL'),
        // STEEDOS_PUBLIC_SCRIPT_VCONSOLE: getConfig('STEEDOS_PUBLIC_SCRIPT_VCONSOLE'),
        // STEEDOS_PUBLIC_SCRIPT_PLUGINS: getConfig('STEEDOS_PUBLIC_SCRIPT_PLUGINS'),
        // STEEDOS_PUBLIC_STYLE_PLUGINS: getConfig('STEEDOS_PUBLIC_STYLE_PLUGINS'),
        STEEDOS_VERSION: process.env.STEEDOS_VERSION,
        STEEDOS_LOCALE: "",
        STEEDOS_PUBLIC_PAGE_ASSETURLS: getConfig("STEEDOS_PUBLIC_PAGE_ASSETURLS"),
        STEEDOS_AMIS_VERSION: process.env.STEEDOS_AMIS_VERSION,
        // platform: __meteor_runtime_config__.PUBLIC_SETTINGS && __meteor_runtime_config__.PUBLIC_SETTINGS.platform || {},
        // STEEDOS_PUBLIC_USE_OPEN_API: process.env.STEEDOS_PUBLIC_USE_OPEN_API
    }
    if (toString) {
        data = JSON.stringify(data);
    }
    return data;
}

const getAfterBuilderSDKLoadedScript = function (env) {
    window.Builder = BuilderSDK.Builder;
    window.builder = BuilderSDK.builder;
    window.builder.init('steedos');

    let searchParams = new URLSearchParams(location.search);
    if (searchParams.get('assetUrls')) {
        sessionStorage.setItem('assetUrls', searchParams.get('assetUrls'))
    }

    let assetUrls = sessionStorage.getItem('assetUrls') ? sessionStorage.getItem('assetUrls') : env.STEEDOS_PUBLIC_PAGE_ASSETURLS
    if (typeof "assetUrls" == 'string') {
        assetUrls = assetUrls.split(',');
    }

    const getBrowserLocale = function () {
        var l, locale;
        l = window.navigator.userLanguage || window.navigator.language || 'en';
        if (l.indexOf("zh") >= 0) {
            locale = "zh-cn";
        } else {
            locale = "en-us";
        }
        return locale;
    };

    Builder.set({
        nodeEnv: env.NODE_ENV,
        rootUrl: env.ROOT_URL,
        unpkgUrl: env.STEEDOS_UNPKG_URL,
        steedosVersion: env.STEEDOS_VERSION,
        assetUrls,
        steedosAmisVersion: env.STEEDOS_AMIS_VERSION,
        locale: env.STEEDOS_LOCALE || getBrowserLocale(),
        // useOpenAPI: env.STEEDOS_PUBLIC_USE_OPEN_API
    });
}

const getAfterAmisSDKLoadedScript = function () {
    window.axios = amisRequire('axios');
    window.moment = amisRequire('moment');
    window.React = amisRequire('react');
    window.ReactDOM = amisRequire('react-dom');
    window.React17 = window.React;
    window.ReactDOM17 = window.ReactDOM;
}


const getBuilderClientJs = function (user) {
    window.lodash = _;
    window.Creator = {};
    ; Object.defineProperty(window, 'MonacoEnvironment', { set: () => { }, get: () => undefined });
    ; (function () {
        function _innerWaitForThing(obj, path, func) {
            const timeGap = 100;
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    let thing = null;
                    if (lodash.isFunction(func)) {
                        thing = func(obj, path);
                    } else {
                        thing = lodash.get(obj, path);
                    }
                    if (thing) {
                        return resolve(thing);
                    }
                    reject();
                }, timeGap);
            }).catch(() => {
                return _innerWaitForThing(obj, path, func);
            });
        }

        window.waitForThing = (obj, path, func) => {
            let thing = null;
            if (lodash.isFunction(func)) {
                thing = func(obj, path);
            } else {
                thing = lodash.get(obj, path);
            }
            if (thing) {
                return Promise.resolve(thing);
            }
            return _innerWaitForThing(obj, path, func);
        };

        Promise.all([
            waitForThing(window, 'Builder')
        ]).then(() => {
            Builder.set({
                context: {
                    rootUrl: Builder.settings.rootUrl,
                    tenantId: user ? user.spaceId : "",
                    userId: user ? user.userId : "",
                    authToken: user ? user.authToken : ""
                },
                locale: user ? user.locale : ""
            })

            window.postMessage({ type: "Builder.loaded" }, "*")
        })
    })();
}

const getMainHeadJs = () => {
    return `
        <script src="${STEEDOS_UNPKG_URL}/lodash@4.17.21/lodash.min.js"></script>
        <script src="${STEEDOS_UNPKG_URL}/@steedos-builder/sdk@1.0.0/dist/index.umd.js"></script>
        <script src="${STEEDOS_AMIS_URL}/sdk/sdk.js"></script>
        <script>
            const envData = ${getEnvData(true)};
            (${getAfterBuilderSDKLoadedScript.toString()})(envData);
        </script>
        <script>
            (${getAfterAmisSDKLoadedScript.toString()})();
        </script>
        <script>
            window.addEventListener('message', function (event) {
                const { data } = event;
                if (data.type === 'Builder.loaded') {
                    Builder.registerRemoteAssets(Builder.settings.assetUrls);
                }
            });

            const loadJs = (url, callback)=>{
                let scriptTag = document.createElement("script");
                scriptTag.type = "text/javascript";
                scriptTag.src = url;
                scriptTag.async = false;
                document.getElementsByTagName("head")[0].appendChild(scriptTag);
                scriptTag.onload = function(script){
                    if(callback){
                        callback(script)
                    }
                }
            }

            const loadCss = (url)=>{
                let styleTag = document.createElement("link");
                styleTag.setAttribute("rel", "stylesheet");
                styleTag.setAttribute("type", "text/css");
                styleTag.setAttribute("href", url);
                document.getElementsByTagName("head")[0].appendChild(styleTag);
            }

            window.loadJs = loadJs;
            window.loadCss = loadCss;
        </script>
    `;
}

module.exports = {
    getMainHeadJs,
    getBuilderClientJs
}