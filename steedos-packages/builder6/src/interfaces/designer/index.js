/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-05-06 02:26:31
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-07 02:59:18
 * @FilePath: /builder6/steedos-packages/builder6/src/interfaces.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const _ = require("lodash");
const ejs = require('ejs');

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

      const filename = __dirname + '/page_design.ejs';
      const data = {
        builderHost,
        rootUrl: "",
        tenantId: userSession.spaceId,
        userId: userSession.userId,
        authToken: userSession.authToken,
        pageId: pageId,
        userSession: userSession
      };
      const options = {};
      console.log("==html==before==renderFile=====", filename, data, options);
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