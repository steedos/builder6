/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-05-06 02:26:31
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-06 09:55:55
 * @FilePath: /builder6/steedos-packages/builder6/src/interfaces.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const _ = require("lodash");

module.exports = {
  rest: [{
    method: "GET",
    fullPath: "/api/interface/pageDesign/:pageId"
  }],
  handler: async function (ctx) {
    const {
      spaceId = "",
      pageId = ""
    } = ctx.params;

    const {
      user
    } = ctx.meta || {};


    // try {
    //   res.set('Content-Type', 'text/html');
    //   const userSession = req.user;
    //   let assetUrls = getPublicAssetUrls(req.query.assetUrls);
    //   const assetUrl = `assetUrl=${assetUrls.split(',').join("&assetUrl=")}&`;

    //   // const dataContext = {
    //   //     rootUrl: __meteor_runtime_config__.ROOT_URL,
    //   //     tenantId: userSession.spaceId,
    //   //     userId: userSession.userId,
    //   //     authToken: userSession.authToken
    //   // }
    //   let locale = "zh-CN";
    //   if (req.query.locale == "en-us") {
    //     locale = "en-US";
    //   } else if (req.query.locale == "zh-cn") {
    //     locale = "zh-CN";
    //   }
    //   const page = await objectql.broker.call(`page.getLatestPageVersion`, { pageId: req.query.pageId });
    //   const retUrl = __meteor_runtime_config__.ROOT_URL + '/app/admin/pages/view/' + req.query.pageId
    //   const steedosBuilderUrl = process.env.STEEDOS_BUILDER_URL || 'https://builder.steedos.cn';
    //   const builderHost = `${steedosBuilderUrl}/amis?${assetUrl}retUrl=${retUrl}&locale=${locale}&pageType=${page.type}`;

    //   const filename = __dirname + '/page_design.ejs'
    //   const data = {
    //     builderHost,
    //     assetUrls,
    //     rootUrl: __meteor_runtime_config__.ROOT_URL,
    //     tenantId: userSession.spaceId,
    //     userId: userSession.userId,
    //     authToken: userSession.authToken,
    //     pageId: req.query.pageId,
    //     userSession: userSession,
    //     useOpenAPI: process.env.STEEDOS_PUBLIC_USE_OPEN_API
    //   }
    //   const options = {}
    //   ejs.renderFile(filename, data, options, function (err, str) {
    //     // str => Rendered HTML string
    //     res.send(str);
    //   });

    // } catch (error) {
    //   res.status(500).send({ message: error.message });
    // }


    ctx.meta.$responseType = "text/html; charset=UTF-8";


    return Buffer.from(`
      <!DOCTYPE html>
      <html lang="${language}" translate="no">
        <head>
          <meta charset="UTF-8" />
        </head>
        <body>

        工
        </body>
      </html>
      `);
  }
}