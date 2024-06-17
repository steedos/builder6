module.exports = {
  rest: [{
    method: "PUT",
    fullPath: "/api/builder6/table/designer/:tableId/save"
  }],
  params: {
    tableId: { type: "any" },
    schema: { type: "any" }
  },
  handler: async function (ctx) {
    const {
      tableId = "",
      schema = {}
    } = ctx.params;

    const {
      user
    } = ctx.meta || {};

    const userSession = user || {};

    return true;
    // return await this.getObject('b6_tables').update(tableId, {
    //   type: "amis",//触发器中判断了type类型，这里必须传过去
    //   amis_schema: schema
    // }, userSession);
  }
}