module.exports = {
  rest: [{
    method: "GET",
    fullPath: "/api/builder6/table/designer/:tableId/latest"
  }],
  handler: async function (ctx) {
    const {
      tableId = ""
    } = ctx.params;

    const {
      user
    } = ctx.meta || {};

    const userSession = user || {};
    const spaceId = userSession.spaceId;

    const tables = await this.getObject('b6_tables').find({
      filters: [['space', '=', spaceId],['_id', '=', tableId]],
    });

    if (!tables || !tables.length) {
      return {
        "amis_schema":{}
      }
    }

    return tables[0];
  }
}