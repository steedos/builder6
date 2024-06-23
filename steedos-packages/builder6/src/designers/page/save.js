/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-05-06 02:26:31
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-09 12:32:27
 * @FilePath: /builder6/steedos-packages/builder6/src/interfaces.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

module.exports = {
  rest: [{
    method: "PUT",
    fullPath: "/api/builder6/page/designer/:pageId/save"
  }],
  params: {
    pageId: { type: "any" },
    schema: { type: "any" }
  },
  handler: async function (ctx) {
    const {
      pageId = "",
      schema = {}
    } = ctx.params;

    const {
      user
    } = ctx.meta || {};

    const userSession = user || {};

    return await this.getObject('b6_pages').update(pageId, {
      type: "amis",//触发器中判断了type类型，这里必须传过去
      amis_schema: schema
    }, userSession);
  }
}