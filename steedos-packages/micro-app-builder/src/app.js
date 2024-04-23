/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-07-25 16:39:35
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-01-16 09:50:06
 * @Description: 
 */

module.exports = {
    rest: [{
        method: "GET",
        fullPath: "/mab/:spaceId/apps/:appId"
      },{
        method: "GET",
        fullPath: "/mab/"
      }
    ],
    handler: async function(ctx) {
      
      const {
          appId = "",
      } = ctx.params

      const pages = await this.getObject('pages').find({
          objectName: 'pages',  
          filters: ['name', '=', "mab_app"], 
      });
      const page = pages && pages[0]
      console.log(page)
      const pageVersion = await ctx.call(`page.getLatestPageVersion`, {pageId: page._id});
      const pageSchema = pageVersion?.schema || {};
      console.log(page, pageVersion, pageSchema)

      ctx.meta.$responseType = "text/html; charset=UTF-8";
  
      const embedCode = "";
      const applicationName = "Steedos App Builder"
      const baseHref = "/app-builder";
      const language = "zh-CN";
      const favicon = "/app/assets/steedos/favicon.ico";
  
      return Buffer.from(`
      <!DOCTYPE html>
      <html lang="${language}" translate="no">
        <head>
          <meta charset="utf-8" />
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
          <meta name="base-href" content="${baseHref}" />
      
          ${embedCode}
      
          <title>${applicationName}</title>
      
          <base href="${baseHref}/" />
  
          <script src="https://unpkg.steedos.cn/amis@3.2.0/sdk/sdk.js"></script>
          <link rel="stylesheet" href="https://unpkg.steedos.cn/amis@3.2.0/lib/themes/antd.css">
          <link rel="stylesheet" href="https://unpkg.steedos.cn/amis@3.2.0/lib/helper.css">
          <link rel="stylesheet" href="https://unpkg.steedos.cn/amis@3.2.0/sdk/iconfont.css">
          <link rel="stylesheet" href="https://unpkg.steedos.cn/@fortawesome/fontawesome-free@6.2.0/css/all.min.css">
          <script type="text/javascript">
            window.React = amisRequire('react');
            window.ReactDOM = amisRequire('react-dom');  	
            window.moment = amisRequire('moment');
          </script>

          <style>
          </style>
  
        </head>
      
        <body>
            <div id="root"></div>

            <script type="text/javascript">
            (function () {
            let amis = amisRequire('amis/embed');
            let amisLib = amisRequire('amis');
            let React = amisRequire('react');
            let ReactDOM = amisRequire('react-dom');


            let data = {
              "context": {}
            };
            let options = {
                theme: 'antd',
            };
            let amisScoped = amis.embed('#root', ${pageSchema}, data, options);
            })();
        </script>
        </body>
      </html>
  
  `);
    }
  }