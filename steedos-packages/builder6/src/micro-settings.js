/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-05-06 02:26:31
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-05-28 01:54:29
 * @FilePath: /microapps/steedos-packages/micro-app-builder/src/micro.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
  rest: [{
    method: "GET",
    fullPath: "/mab/settings/:spaceId/apps/:appId"
  }],
  handler: async function (ctx) {
    const {
      spaceId = "",
      appId = ""
    } = ctx.params;

    const {
      user
    } = ctx.meta || {};

    const appSchema = await ctx.call("@steedos-labs/micro-app-builder.appSettingsSchema", {
      spaceId,
      appId
    });

    ctx.meta.$responseType = "text/html; charset=UTF-8";

    const embedCode = "";
    const applicationName = "Steedos App Builder"
    const baseHref = "/app-builder";
    const language = "zh-CN";
    const favicon = "/app/assets/steedos/favicon.ico";

    const builderJs = `
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
              tenantId: "${user?.spaceId}",
              userId: "${user?.userId}",
              authToken: "${user?.authToken}",
            },
            locale: "${user?.locale}"
          })

          window.postMessage({ type: "Builder.loaded" }, "*")
        })
      })();
    `;

    const listenAssetsLoaded = `
      window.addEventListener('message', function (event) {
        const { data } = event;
        if (data.type === 'builder.assetsLoaded') {
          window.assetsLoaded = true;
        }
      })
    `;

    const registryAssetsComponents = `
      // TODO:这里是不是不应该直接使用amis.render.client.js中的脚本注册资产包中自定义组件，应该单独写个注册脚本
      Promise.all([
        waitForThing(window, 'loadJs'),
        waitForThing(window, 'Builder')
      ]).then(() => {
        loadJs(\`\${Builder.settings.rootUrl}/amis-pages/js/amis.render.client.js\`, (script) => {
        });
      });
    `;

    const embedAmis = `
      // TODO:执行amis.embed相关逻辑，与上面的amis.render.client.js有重复代码，可以合并这两处脚本，待优化
      Promise.all([
        waitForThing(window, 'assetsLoaded'),
        waitForThing(window, 'amis'),
      ]).then(() => {
        let amis = amisRequire('amis/embed');
        const match = amisRequire('path-to-regexp').match;

        // 如果想用 browserHistory 请切换下这处代码, 其他不用变
        // const history = History.createBrowserHistory();
        const history = History.createHashHistory();

        const app = ${JSON.stringify(appSchema.data)};

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
          } else if (pathname[0] != '/' && !/^https?\\:\\/\\//.test(pathname)) {
            let relativeBase = location.pathname;
            const paths = relativeBase.split('/');
            paths.pop();
            let m;
            while ((m = /^\\.\\.?\\//.exec(pathname))) {
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
          '#root',
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
                authToken: "${user?.authToken}"}
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
                (!/^https?\\:\\/\\//.test(location) &&
                  location ===
                    history.location.pathname + history.location.search) ||
                location === history.location.href
              ) {
                // 目标地址和当前地址一样，不处理，免得重复刷新
                return;
              } else if (/^https?\:\\/\\//.test(location) || !history) {
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

              if (/^https?:\\/\\//.test(to)) {
                window.location.href = to;
              } else if (
                (!/^https?\\:\\/\\//.test(to) &&
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
      });
    `;

    return Buffer.from(`
      <!DOCTYPE html>
      <html lang="${language}" translate="no">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <meta name="robots" content="noindex" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <link rel="apple-touch-icon" sizes="180x180" href="/app/assets/img/apple-touch-icon.png">
          <link rel="icon" href="${favicon}" />
          <meta name="msapplication-TileColor" content="#2d89ef">
          <meta name="theme-color" content="#ffffff">
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
          ${embedCode}
      
          <title>${applicationName}</title>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />
          <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
          <link
            rel="stylesheet"
            title="default"
            href="https://unpkg.steedos.cn/amis@3.2.0/sdk/sdk.css"
          />
          <script src="/main_head.js?platform=browser"></script>
          <link rel="stylesheet" href="/main_head.css?platform=browser">
          <!-- 
          <link rel="stylesheet" href="https://unpkg.steedos.cn/amis@3.2.0/sdk/helper.css" />
          <link
            rel="stylesheet"
            href="https://unpkg.steedos.cn/amis@3.2.0/sdk/iconfont.css"
          /><script src="https://unpkg.steedos.cn/amis@3.2.0/sdk/sdk.js"></script> -->
          <script src="https://unpkg.com/history@4.10.1/umd/history.js"></script>
          <style>
            html,
            body,
            .app-wrapper {
              position: relative;
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
            }
          </style>

          <script>
            (function () {
              // 触发main_head.js中请求资产包脚本文件
              ${builderJs}
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
              //注册资产包中自定义组件到amis
              ${registryAssetsComponents}
          })();
          </script>
        </head>
        <body>
          <div id="root" class="app-wrapper"></div>
          <script>
            (function () {
              ${embedAmis}
            })();
          </script>
        </body>
      </html>
      `);
  }
}