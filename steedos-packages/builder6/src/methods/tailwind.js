const postcss = require("postcss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");


// 递归提取 JSON 对象或数组中的所有类名
function extractClasses(data, classes = []) {
  if (!data) return classes;

  if (Array.isArray(data)) {
    // 如果 data 是数组，递归处理每个元素
    data.forEach(item => extractClasses(item, classes));
  } else if (typeof data === 'object') {
    // 如果 data 是对象，遍历其属性
    for (const key in data) {
      if ((key === 'className' || key === 'class') && typeof data[key] === 'string') {
        classes.push(data[key]);
      } else if (Array.isArray(data[key])) {
        // 如果属性值是数组，递归处理数组中的每个元素
        extractClasses(data[key], classes);
      } else if (typeof data[key] === 'object') {
        // 如果属性值是对象，递归处理对象
        extractClasses(data[key], classes);
      }
    }
  } else if (typeof data === 'string') {
    classes.push(data);
  }

  return classes;
}

exports.compileTailwind = async (content) => {
  config = {}

  const classNames = extractClasses(content)
  console.log('compileTailwind', classNames)
  const raw = [...new Set(classNames.join(' ').split(' '))].join(' ');

  // 设置 Tailwind CSS 的内容配置
  const tailwindConfig = {
    content: [{ raw }],
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
