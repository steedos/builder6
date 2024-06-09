const { parseJsx, componentToBuilder } = require("@builder.io/mitosis");
const uuid = require("uuid");

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

      output.data.cssCode = tailwind;
      output.id = _id || uuid.v4()

      return output
    } catch (error) {
      return {
          error: "Failed to convert JSX to JSON",
          details: error.message
      }
    }
}