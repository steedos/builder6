module.exports = {
  rest: [{
    method: "PUT",
    fullPath: "/api/builder6/table/designer/:tableId/save"
  }],
  params: {
    tableId: { type: "string" }, // 确保 tableId 是字符串类型
    schema: [
      { type: "object" },  // schema 可以是对象
      { type: "string" }   // schema 也可以是字符串
    ]
  },
  handler: async function (ctx) {
    const { tableId, schema } = ctx.params;
    const { user } = ctx.meta || {};
    const userSession = user || {};

    let parsedSchema;

    try {
      // 如果 schema 是字符串，则尝试将其解析为对象
      if (typeof schema === "string") {
        parsedSchema = JSON.parse(schema);
      } else {
        parsedSchema = schema;
      }
    } catch (parseError) {
      this.logger.error("Error parsing schema:", parseError);
      ctx.meta.$statusCode = 400;  // 设置 HTTP 状态码为 400 (Bad Request)
      return {
        success: false,
        message: "Invalid schema format." + "\n" + parseError.message
      };
    }

    try {
      // 将 parsedSchema 转换为 tableFields
      const tableFields = this.convertAmisSchemaToTableFields(parsedSchema);

      // 调用 putTableFields 函数
      await this.putTableFields(tableId, tableFields, userSession);

      // 返回成功响应
      return {
        success: true,
        message: "Table fields saved successfully."
      };
    } catch (error) {
      // 捕获并处理错误
      this.logger.error("Error saving table fields:", error);
      ctx.meta.$statusCode = 500;  // 设置 HTTP 状态码为 500 (Internal Server Error)

      // 返回错误响应
      return {
        success: false,
        message: "Failed to save table fields." + "\n" + error.message,
        detail: error.stack // 详细错误信息
      };
    }
  }
};
