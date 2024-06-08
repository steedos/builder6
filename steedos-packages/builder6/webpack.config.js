const path = require('path');
const nodeExternals = require('webpack-node-externals');

// default WEBPACK_BUNDLE to development
const WEBPACK_BUNDLE = process.env.WEBPACK_BUNDLE || "development";

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',    
  externals: [
    nodeExternals(),
    nodeExternals({
      modulesDir: path.resolve(__dirname, '../../node_modules'),
    }),
  ],
  optimization: {
    minimize: true,
    nodeEnv: false // 避免业务代码中的process.env.NODE_ENV在编译时就被替换
  },
  watchOptions: {
    ignored: /node_modules/, // 忽略 node_modules 文件夹
    aggregateTimeout: 300,   // 文件变更后，重新构建前的延迟时间（毫秒）
    poll: 1000,              // 轮询间隔时间（毫秒），如果需要轮询文件变化
  },
};