const postcss = require("postcss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

exports.compileTailwind = async (event) => {
  const { html, config = {}, css = "" } = event;

  // 设置 Tailwind CSS 的内容配置
  const tailwindConfig = {
    content: [{ raw: html }],
    theme: { extend: {} },
    plugins: [],
    ...config
  };

  const cssInput = `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ${css}
  `;

  try {
    console.log(tailwindConfig, cssInput);
    const result = await postcss([
      tailwindcss(tailwindConfig),
      autoprefixer
    ]).process(cssInput, { from: undefined });

    return result.css
  } catch (error) {
    console.log(error);
    return { error: error.message }
  }
};
