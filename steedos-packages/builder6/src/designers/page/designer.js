const _ = require("lodash");
const ejs = require('ejs');

module.exports = {
    rest: [{
        method: "GET",
        fullPath: "/api/builder6/pgge/designer/:pageId"
    }],

    handler: async function (ctx) {
        const {
            spaceId = "",
            pageId = ""
        } = ctx.params;
        const {
            user
        } = ctx.meta || {};

        let html = "";
        try {
            // res.set('Content-Type', 'text/html');
            const userSession = user;
            let locale = "zh-CN";
            // if (req.query.locale == "en-us") {
            //   locale = "en-US";
            // } else if (req.query.locale == "zh-cn") {
            //   locale = "zh-CN";
            // }
            // const page = await objectql.broker.call(`page.getLatestPageVersion`, { pageId: req.query.pageId });
            const page = {};
            // const retUrl = __meteor_runtime_config__.ROOT_URL + '/app/admin/pages/view/' + req.query.pageId
            const steedosBuilderUrl = process.env.STEEDOS_BUILDER_URL || 'https://builder.steedos.cn';
            // const builderHost = `${steedosBuilderUrl}/amis?${assetUrl}retUrl=${retUrl}&locale=${locale}&pageType=${page.type}`;
            const builderHost = `${steedosBuilderUrl}/amis?locale=${locale}`;

            const filename = __dirname + '/page_designer.ejs';
            const data = {
                builderHost,
                rootUrl: process.env.ROOT_URL,
                tenantId: userSession.spaceId,
                userId: userSession.userId,
                authToken: userSession.authToken,
                pageId: pageId,
                userSession: userSession
            };
            const options = {};
            html = await ejs.renderFile(filename, data, options);
        } catch (error) {
            html = `
      <!DOCTYPE html>
      <html translate="no">
        <head>
          <meta charset="UTF-8" />
        </head>
        <body>
          ${error.message}
        </body>
      </html>
      `;
        }


        ctx.meta.$responseType = "text/html; charset=UTF-8";

        return Buffer.from(html);
    }
}