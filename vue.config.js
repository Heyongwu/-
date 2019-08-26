var webpack = require('webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        'Quill': 'quill/dist/quill.js'
      }),
    ]
  },
  chainWebpack: config => {
    config
      .module
      .rule("images")
      .test(/\.(jpg|png|gif)$/)
      .use("url-loader")
      .loader("url-loader")
      .options({
        limit: 10,        // 以下配置项用于配置file-loader
        // 根据环境使用cdn或相对路径
        publicPath: process.env.NODE_ENV === 'production' ? 'static/img' : './',
        // 将图片打包到dist/img文件夹下, 不配置则打包到dist文件夹下
        outputPath: 'img',
        // 配置打包后图片文件名
        name: '[name].[ext]',
      })
      .end();

  }
}