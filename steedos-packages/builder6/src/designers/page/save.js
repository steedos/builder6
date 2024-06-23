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
    fullPath: "/api/builder6/page/designer/:pageId/:type/save"
  }],
  params: {
    pageId: { type: "any" },
    type: { type: "any" },
    schema: { type: "object" }//不同的类型传入的key不一样，比如amis应该传入{amis_schema: ...},html应该传入{html: ...},liquid应该传入{liquid_template: ...}
  },
  handler: async function (ctx) {
    const { pageId, type, schema } = ctx.params;
    console.log("page save===pageId, type==", pageId, type);
    const { user } = ctx.meta || {};
    const userSession = user || {};

  //   return await this.getObject('b6_pages').update(pageId, {
  //     type: "amis",//触发器中判断了type类型，这里必须传过去
  //     amis_schema: schema
  //   }, userSession);

    try {
      await this.savePageVersion(pageId, type, schema, userSession);
      // 返回成功响应
      return {
        success: true,
        message: "Page version saved successfully."
      };
    } catch (error) {
      // 捕获并处理错误
      this.logger.error("Error saving page version:", error);
      ctx.meta.$statusCode = 500;  // 设置 HTTP 状态码为 500 (Internal Server Error)

      // 返回错误响应
      return {
        success: false,
        message: "Failed to save page version." + "\n" + error.message,
        detail: error.stack // 详细错误信息
      };
    }
  }
}