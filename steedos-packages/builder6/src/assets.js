/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-05-29 09:08:58
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-05-30 04:03:52
 * @FilePath: /microapps/steedos-packages/builder6/src/assets.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const _ = require("lodash");

const getConfig = (key) => {
    return process.env[key]
}

const STEEDOS_UNPKG_URL = getConfig("STEEDOS_UNPKG_URL"),
    STEEDOS_AMIS_URL = getConfig("STEEDOS_AMIS_URL"),
    STEEDOS_PUBLIC_PAGE_ASSETURLS = getConfig("STEEDOS_PUBLIC_PAGE_ASSETURLS"),
    STEEDOS_AMIS_VERSION = getConfig("STEEDOS_AMIS_VERSION"),
    ROOT_URL = getConfig("ROOT_URL");

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
    window.lodash = window._;
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

const listenAssetsLoaded = `
    window.addEventListener('message', function (event) {
        const { data } = event;
        if (data.type === 'builder.assetsLoaded') {
            window.assetsLoaded = true;
        }
    });
`;

const getRegistryAssetsComponentsScript = function () {
    Promise.all([
        waitForThing(window, 'assetsLoaded'),
        waitForThing(window, 'amis'),
    ]).then(()=>{
        // window.React = window.__React;
        // window.ReactDOM = window.__ReactDOM;
        const AmisRenderers = [];
        let amis = (window.amisRequire && window.amisRequire('amis')) || window.Amis;
        let amisVersion = amis && amis.version;
        if(amisVersion){
          const amisVersionClassName = "amis-" + amisVersion.split(".")[0] + "-" + amisVersion.split(".")[1];
          document.getElementsByTagName('body')[0].className += " " + amisVersionClassName;
        }
        let amisLib = amisRequire('amis');
        amisLib.registerFilter('t', function (key,param) {
          return typeof key === 'string' ? window.t(key,param) : key;
        });
        const registerMap = {
          renderer: amisLib.Renderer,
          formitem: amisLib.FormItem,
          options: amisLib.OptionsControl,
        };

        const amisComps = lodash.filter(Builder.registry['meta-components'], function(item){ return item.componentName && item.amis && item.amis.render});
        
        lodash.each(amisComps,(comp)=>{
            const Component = Builder.components.find(item => item.name === comp.componentName);
            var type = null;
            if(comp.amis){
              type = comp.amis.render.type
            }
            if (Component && !AmisRenderers.includes(type)){
                try {
                    let AmisWrapper = Component.class
                    AmisRenderers.push(type);
                    if(comp.componentType === 'amisSchema'){
                        let amisReact = amisRequire('react');
                        AmisWrapper = function(props){
                          // console.log(`AmisWrapper===>`, props)
                          const { $schema, body, render } = props
                          const [schema, setSchema] = amisReact.useState(null);
                          amisReact.useEffect(()=>{
                            // console.log("AmisWrapper===>==useEffect==", comp.amis.render.type, JSON.stringify(props.data?.recordId))
                            const result = Component.class(props);
                            if(result.then && typeof result.then === 'function'){
                              result.then((data)=>{
                                // console.log("AmisWrapper===>==useEffect==setSchema", data)
                                setSchema(data);
                              })
                            }else{
                              // console.log("AmisWrapper===>==useEffect==result", result)
                              setSchema(result)
                            }
                          }, [JSON.stringify($schema)]) //, JSON.stringify(props.data)

                          if (!schema)
                            return;
                            // return render('body', {
                            //   "type": "wrapper",
                            //   "className": "h-full flex items-center justify-center",
                            //   "body": {
                            //     "type": "spinner",
                            //     "show": true
                            //   }
                            // })

                          if (props.env.enableAMISDebug && schema) {
                            console.groupCollapsed(`[steedos render ${type}]`);
                            console.trace('Component: ', props, 'Generated Amis Schema: ', schema);
                            console.groupEnd();
                          }
                          return amisReact.createElement(amisReact.Fragment, null, amisReact.createElement(amisReact.Fragment, null, schema && render ? render('body', schema) : ''));
                        }
                      }
                    // 注册amis渲染器
                    let asset = comp.amis.render;
                    if (!registerMap[asset.usage]) {
                      console.error(
                        `自定义组件注册失败，不存在${asset.usage}自定义组件类型。`, comp
                      );
                    } else {
                      registerMap[asset.usage]({
                        test: new RegExp(`(^|\/)${asset.type}`),
                        type: asset.type,
                        weight: asset.weight,
                        autoVar: true,
                      })(AmisWrapper);
                      // 记录当前创建的amis自定义组件
                      console.debug('注册了一个自定义amis组件:', {
                        type: asset.type,
                        weight: asset.weight,
                        component: AmisWrapper,
                        framework: asset.framework,
                        usage: asset.usage,
                      });
                    }
                    // amisRequire("amis").Renderer(
                    //     {
                    //         type: comp.amis?.render.type,
                    //         weight: comp.amis?.render.weight,
                    //         autoVar: true,
                    //     }
                    // )(AmisWrapper);
                } catch(e){console.error(e)}
            }
        });
    });
}


// /main_head.css?platform=browser 中加载了以下css，这里按需加载
// @import url("https://unpkg.steedos.cn/@salesforce-ux/design-system@2.22.2/assets/styles/salesforce-lightning-design-system.min.css");
// @import url("https://unpkg.steedos.cn/@steedos-widgets/amis@6.3.0-patch.3/lib/themes/antd.css");
// @import url("https://unpkg.steedos.cn/@steedos-widgets/amis@6.3.0-patch.3/lib/helper.css");
// @import url("https://unpkg.steedos.cn/@steedos-widgets/amis@6.3.0-patch.3/sdk/iconfont.css");
// @import url("https://unpkg.steedos.cn/@fortawesome/fontawesome-free@6.2.0/css/all.min.css");
// @import url("/tailwind/tailwind-steedos.css");
// @import url("/amis/amis.css");
const getMainHeadCss = () => {
    return `
        <link rel="stylesheet" href="${STEEDOS_UNPKG_URL}/@salesforce-ux/design-system@2.22.2/assets/styles/salesforce-lightning-design-system.min.css" />
        <link rel="stylesheet" href="${STEEDOS_UNPKG_URL}/@steedos-widgets/amis@6.3.0-patch.3/lib/themes/antd.css" />
        <link rel="stylesheet" href="${STEEDOS_UNPKG_URL}/@steedos-widgets/amis@6.3.0-patch.3/lib/helper.css" />
        <link rel="stylesheet" href="${STEEDOS_UNPKG_URL}/@steedos-widgets/amis@6.3.0-patch.3/sdk/iconfont.css" />
        <link rel="stylesheet" href="${STEEDOS_UNPKG_URL}/@fortawesome/fontawesome-free@6.2.0/css/all.min.css" />
        <link rel="stylesheet" href="/tailwind/tailwind-steedos.css" />
        <link rel="stylesheet" href="/amis/amis.css" />
    `
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

const getMainBodyJs = (user) => {
    return `
        <script>
            (function () {
                // 原platform中builder.client.js中的脚本，主要是定义waitForThing函数，并触发请求资产包脚本文件
                (${getBuilderClientJs.toString()})(${JSON.stringify(_.pick(user, ['spaceId', 'userId', 'authToken', 'locale']))});
            })();
        </script>
        <script>
            (function () {
                // 监听message设置window.assetsLoaded
                ${listenAssetsLoaded}
            })();
        </script>
        <script>
            (function () {
                //注册资产包中自定义组件到amis，参考platform的amis.render.client.js文件中相关脚本
                (${getRegistryAssetsComponentsScript.toString()})();
            })();
      </script>
    `
}

module.exports = {
    getMainHeadCss,
    getMainHeadJs,
    getMainBodyJs
}