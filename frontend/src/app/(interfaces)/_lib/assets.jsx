import React, { Fragment } from 'react';
import { pick } from "lodash";
import './default.steedos.config';
import Script from 'next/script';

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

const getWaitForThingJs = function () {
    window.lodash = window._;
    window.Creator = {};
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
}


const getBuilderClientJs = function (user) {
    (function () {
        Promise.all([
            waitForThing(window, 'Builder')
        ]).then(() => {
            Builder.set({
                context: {
                    rootUrl: Builder.settings.rootUrl,
                    user: user
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
    ]).then(() => {
        // window.React = window.__React;
        // window.ReactDOM = window.__ReactDOM;
        const AmisRenderers = [];
        let amis = (window.amisRequire && window.amisRequire('amis')) || window.Amis;
        let amisVersion = amis && amis.version;
        if (amisVersion) {
            const amisVersionClassName = "amis-" + amisVersion.split(".")[0] + "-" + amisVersion.split(".")[1];
            document.getElementsByTagName('body')[0].className += " " + amisVersionClassName;
        }
        let amisLib = amisRequire('amis');
        amisLib.registerFilter('t', function (key, param) {
            return typeof key === 'string' ? window.t(key, param) : key;
        });
        const registerMap = {
            renderer: amisLib.Renderer,
            formitem: amisLib.FormItem,
            options: amisLib.OptionsControl,
        };

        const amisComps = lodash.filter(Builder.registry['meta-components'], function (item) { return item.componentName && item.amis && item.amis.render });

        lodash.each(amisComps, (comp) => {
            const Component = Builder.components.find(item => item.name === comp.componentName);
            var type = null;
            if (comp.amis) {
                type = comp.amis.render.type
            }
            if (Component && !AmisRenderers.includes(type)) {
                try {
                    let AmisWrapper = Component.class
                    AmisRenderers.push(type);
                    if (comp.componentType === 'amisSchema') {
                        let amisReact = amisRequire('react');
                        AmisWrapper = function (props) {
                            // console.log(`AmisWrapper===>`, props)
                            const { $schema, body, render } = props
                            const [schema, setSchema] = amisReact.useState(null);
                            amisReact.useEffect(() => {
                                // console.log("AmisWrapper===>==useEffect==", comp.amis.render.type, JSON.stringify(props.data?.recordId))
                                const result = Component.class(props);
                                if (result.then && typeof result.then === 'function') {
                                    result.then((data) => {
                                        // console.log("AmisWrapper===>==useEffect==setSchema", data)
                                        setSchema(data);
                                    })
                                } else {
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
                } catch (e) { console.error(e) }
            }
        });
    });
}

const getRegistryRenderAmisFunctionScript = function () {
    // 执行amis.embed相关逻辑
    Promise.all([
        waitForThing(window, 'assetsLoaded'),
        waitForThing(window, 'amis'),
    ]).then(() => {
        let amis = amisRequire('amis/embed');
        const match = amisRequire('path-to-regexp').match;

        // 如果想用 browserHistory 请切换下这处代码, 其他不用变
        const history = History.createBrowserHistory();
        // const history = History.createHashHistory();
        const app = {
        };

        function normalizeLink(to, location = history.location) {
            to = to || '';

            if (to && to[0] === '#') {
                to = location.pathname + location.search + to;
            } else if (to && to[0] === '?') {
                to = location.pathname + to;
            }

            const idx = to.indexOf('?');
            const idx2 = to.indexOf('#');
            let pathname = ~idx
                ? to.substring(0, idx)
                : ~idx2
                    ? to.substring(0, idx2)
                    : to;
            let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : '';
            let hash = ~idx2 ? to.substring(idx2) : location.hash;

            if (!pathname) {
                pathname = location.pathname;
            } else if (pathname[0] != '/' && !/^https?\:\/\//.test(pathname)) {
                let relativeBase = location.pathname;
                const paths = relativeBase.split('/');
                paths.pop();
                let m;
                while ((m = /^\.\.?\//.exec(pathname))) {
                    if (m[0] === '../') {
                        paths.pop();
                    }
                    pathname = pathname.substring(m[0].length);
                }
                pathname = paths.concat(pathname).join('/');
            }

            return pathname + search + hash;
        }

        function isCurrentUrl(to, ctx) {
            if (!to) {
                return false;
            }
            const pathname = history.location.pathname;
            const link = normalizeLink(to, {
                ...location,
                pathname,
                hash: ''
            });

            if (!~link.indexOf('http') && ~link.indexOf(':')) {
                let strict = ctx && ctx.strict;
                return match(link, {
                    decode: decodeURIComponent,
                    strict: typeof strict !== 'undefined' ? strict : true
                })(pathname);
            }

            return decodeURI(pathname) === link;
        }

        let amisInstance = amis.embed(
            '#root_interface_page',
            app,
            {
                location: history.location,
                data: {
                    // 全局数据，是受控的数据
                },
                context: {
                    // 全局上下文数据, 非受控的数据，无论哪一层都能获取到，包括弹窗自定义数据映射后都能获取到。
                    // 可以用来放一下全局配置等。比如 API_HOST, 这样页面配置里面可以通过 \${API_HOST} 来获取到。
                    // API_HOST: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com',
                    spaceId: "${spaceId}",
                    appId: "${appId}",
                    context: {
                        tenantId: "${user?.spaceId}",
                        userId: "${user?.userId}",
                        authToken: "${user?.authToken}"
                    }
                }
            },
            {
                // watchRouteChange: fn => {
                //   return history.listen(fn);
                // },
                updateLocation: (location, replace) => {
                    location = normalizeLink(location);
                    if (location === 'goBack') {
                        return history.goBack();
                    } else if (
                        (!/^https?\:\/\//.test(location) &&
                            location ===
                            history.location.pathname + history.location.search) ||
                        location === history.location.href
                    ) {
                        // 目标地址和当前地址一样，不处理，免得重复刷新
                        return;
                    } else if (/^https?\:\/\//.test(location) || !history) {
                        return (window.location.href = location);
                    }

                    history[replace ? 'replace' : 'push'](location);
                },
                jumpTo: (to, action) => {
                    if (to === 'goBack') {
                        return history.goBack();
                    }

                    to = normalizeLink(to);

                    if (isCurrentUrl(to)) {
                        return;
                    }

                    if (action && action.actionType === 'url') {
                        action.blank === false
                            ? (window.location.href = to)
                            : window.open(to, '_blank');
                        return;
                    } else if (action && action.blank) {
                        window.open(to, '_blank');
                        return;
                    }

                    if (/^https?:\/\//.test(to)) {
                        window.location.href = to;
                    } else if (
                        (!/^https?\:\/\//.test(to) &&
                            to === history.pathname + history.location.search) ||
                        to === history.location.href
                    ) {
                        // do nothing
                    } else {
                        history.push(to);
                    }
                },
                isCurrentUrl: isCurrentUrl,
                theme: 'antd'
            }
        );

        history.listen(state => {
            amisInstance.updateProps({
                location: state.location || state
            });
        });


        window.renderAmisPage = function (schema, data) {
            console.log("===window.renderAmis===data===", data);
            amisInstance.updateSchema(schema);
        };
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
        <Script src={STEEDOS_UNPKG_URL + "/@steedos-builder/sdk@1.0.0/dist/index.umd.js"} strategy="beforeInteractive" />
        <Script src={"https://unpkg.com" + "/history@4.10.1/umd/history.js"} strategy="beforeInteractive" />
        <Script dangerouslySetInnerHTML={{ __html: `
            const envData = ${getEnvData(true)};
            (${getAfterBuilderSDKLoadedScript.toString()})(envData);
        ` }} strategy="beforeInteractive" />
        <Script dangerouslySetInnerHTML={{ __html: `
            (${getAfterAmisSDKLoadedScript.toString()})();
        ` }} strategy="beforeInteractive" />
        <Script dangerouslySetInnerHTML={{ __html: `
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
        ` }} strategy="beforeInteractive" />
    </Fragment>
}

const getMainBodyJs = (user) => {
    console.log("===getMainBodyJs===", user);
    return <Fragment>
        <Script dangerouslySetInnerHTML={{ __html: `
            (function () {
                (${getWaitForThingJs.toString()})();
            })();
        ` }} strategy="beforeInteractive" />
        <Script dangerouslySetInnerHTML={{ __html: `
            (function () {
                // 原platform中builder.client.js中的脚本，主要是定义waitForThing函数，并触发请求资产包脚本文件
                var user = ${JSON.stringify(user)};
                (${getBuilderClientJs.toString()})(user);
            })();
        ` }} strategy="beforeInteractive" />
        <Script dangerouslySetInnerHTML={{ __html: `
            (function () {
                // 监听message设置window.assetsLoaded
                ${listenAssetsLoaded}
            })();
        ` }} strategy="beforeInteractive" />
        <Script dangerouslySetInnerHTML={{ __html: `
            (function () {
                //注册资产包中自定义组件到amis，参考platform的amis.render.client.js文件中相关脚本
                (${getRegistryAssetsComponentsScript.toString()})();
            })();
        ` }} strategy="beforeInteractive" />
    </Fragment>
}

const getEmbedAmisJs = () => {
    return <Fragment>
        <Script dangerouslySetInnerHTML={{ __html: `
            (function () {
                //注册renderAmis函数到window，参考platform的amis.render.client.js文件中window.renderAmis函数定义
                (${getRegistryRenderAmisFunctionScript.toString()})();
            })();
        ` }} strategy="beforeInteractive" />
    </Fragment>
}

export {
    getMainHeadCss,
    getMainHeadJs,
    getMainBodyJs,
    getEmbedAmisJs
}