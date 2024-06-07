/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-05-06 02:26:31
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-07 08:45:18
 * @FilePath: /builder6/steedos-packages/builder6/src/interfaces.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

module.exports = {
  rest: [{
    method: "GET",
    fullPath: "/api/builder6/interface/page-designer/:pageId/latest"
  }],
  handler: async function (ctx) {
    const {
      pageId = ""
    } = ctx.params;

    const {
      user
    } = ctx.meta || {};

    const userSession = user || {};
    const spaceId = userSession.spaceId;

    const pages = await this.getObject('b6_pages').find({
      filters: [['space', '=', spaceId],['_id', '=', pageId]],
    });

    if (!pages || !pages.length) {
      return {
        "amis_schema":{}
      }
    }

    let page = pages[0];
    

    return page;
  }
}