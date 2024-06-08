const { parseJsx, componentToBuilder } = require("@builder.io/mitosis");

export const compileJsx = async (page) => {
    const {jsx, tailwind, _id} = page
    try {

      if (!jsx) {
        return { error: "JSX is required" }
      }

      const component = parseJsx(jsx);

      const output = await componentToBuilder({ includeIds: true })({
        component
      });

      console.log('compileJsx', output)
      output.data.cssCode = tailwind;

      return output
    } catch (error) {
      return {
          error: "Failed to convert JSX to JSON",
          details: error.message
      }
    }
}