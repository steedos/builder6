module.exports = {
  rest: [{
    method: "GET",
    fullPath: "/api/builder6/page/designer/:pageId/:type/latest"
  }],
  handler: async function (ctx) {
    const { pageId, type } = ctx.params;
    // const { user } = ctx.meta || {};
    // const userSession = user || {};
    // const spaceId = userSession.spaceId;

    try {
      let pgVersion = await this.getLatestPageVersion(pageId, type)

      if (!pgVersion) {
        return {
          success: true
        };
      }

      return {
        success: true,
        ...pgVersion
      };
    } catch (error) {
      this.logger.error("Error fetching latest page version:", error);
      ctx.meta.$statusCode = 500;  // 设置 HTTP 状态码为 500 (Internal Server Error)

      return {
        success: false,
        message: "Failed to fetch latest page version." + "\n" + error.message,
        detail: error.stack // 详细错误信息
      };
    }
  }
}