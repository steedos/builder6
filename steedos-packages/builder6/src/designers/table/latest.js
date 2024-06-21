module.exports = {
  rest: [{
    method: "GET",
    fullPath: "/api/builder6/table/designer/:tableId/latest"
  }],
  handler: async function (ctx) {
    const { tableId = "" } = ctx.params;
    const { user } = ctx.meta || {};
    const userSession = user || {};
    const spaceId = userSession.spaceId;

    try {
      const tables = await this.getObject('b6_tables').find({
        filters: [['space', '=', spaceId], ['_id', '=', tableId]],
      });

      const fields = await this.getObject('b6_fields').find({
        filters: [['space', '=', spaceId], ['table_id', '=', tableId]],
      });

      if (!tables || !tables.length) {
        return {
          success: false,
          message: "Table not found."
        };
      }

      const amisSchema = this.convertTableFieldsToAmisSchema(tables[0], fields);

      return {
        success: true,
        "amis_schema": amisSchema
      };
    } catch (error) {
      this.logger.error("Error fetching table or fields:", error);
      ctx.meta.$statusCode = 500;  // 设置 HTTP 状态码为 500 (Internal Server Error)

      return {
        success: false,
        message: "Failed to fetch table or fields." + "\n" + error.message,
        detail: error.stack // 详细错误信息
      };
    }
  }
};
