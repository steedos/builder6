const postcss = require("postcss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const typography = require("@tailwindcss/typography");

// 递归提取 JSON 对象或数组中的所有类名
function extractClasses(data, classes = []) {
  if (!data) return classes;

  if (Array.isArray(data)) {
    // 如果 data 是数组，递归处理每个元素
    data.forEach(item => extractClasses(item, classes));
  } else if (typeof data === 'object') {
    // 如果 data 是对象，遍历其属性
    for (const key in data) {
      //if ((key === 'className' || key === 'class') && typeof data[key] === 'string') {
      if (typeof data[key] === 'string') {
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

exports.compileTailwind = async (content, id) => {
  console.log(id)
  config = {}

  const classNames = extractClasses(content)

  const raw = [...new Set(classNames.join(' ').split(' '))].join(' ');

  // 设置 Tailwind CSS 的内容配置
  const tailwindConfig = {
    important: `.builder-component-${id}`,
    content: [{ raw }],
    theme: {
      extend: {
        colors: {
          primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a","950":"#172554"}
        }
      },
    },
    plugins: [
      typography,
    ],
    ...config
  };

  const cssInput = `
    @tailwind components;
    @tailwind utilities;
  `;

  try {
    const result = await postcss([
      tailwindcss(tailwindConfig),
      autoprefixer,
    ]).process(cssInput, { from: undefined });


    return result.css
  } catch (error) {
    console.log(error);
    return { error: error.message }
  }
};
