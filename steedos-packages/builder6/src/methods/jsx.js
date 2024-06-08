const { parseJsx, componentToBuilder } = require("@builder.io/mitosis");

export const compileJsx = {
  async handler(jsx) {
    try {

      if (!jsx) {
        return { error: "JSX is required" }
      }

      const component = parseJsx(jsx);

      const output = await componentToBuilder({ includeIds: true })({
        component
      });

      console.log('compileJsx', output)

      return output
    } catch (error) {
      return {
          error: "Failed to convert JSX to JSON",
          details: error.message
      }
    }
  }
}