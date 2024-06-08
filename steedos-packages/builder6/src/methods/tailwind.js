const postcss = require("postcss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

exports.compileTailwind = async (html) => {
  config = {}

  // 设置 Tailwind CSS 的内容配置
  const tailwindConfig = {
    content: [{ raw: html }],
    theme: { extend: {} },
    plugins: [],
    ...config
  };

  const cssInput = `
    @tailwind components;
    @tailwind utilities;
  `;

  try {
    const result = await postcss([
      tailwindcss(tailwindConfig),
      autoprefixer
    ]).process(cssInput, { from: undefined });

    console.log('compileTailwind', result.css)

    return result.css
  } catch (error) {
    console.log(error);
    return { error: error.message }
  }
};
