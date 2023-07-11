// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,
//   config.module
//       .rule('raw')
//       .test(/\.txt$/)
//       .use('raw-loader')
//       .loader('raw-loader')
//       .end()
// })
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('raw')
      .test(/\.txt$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
  }
}