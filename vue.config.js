const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: "/",
  assetsDir: './resources/scripts/vuetasks/',
  transpileDependencies: true,
  // css/[name].css
  css: {
    extract: {
      filename: '[name]-vue-tasks.css',
      chunkFilename: '[name]-vue-tasks.css',
    },
  },
  // js/[name].[contenthash:8].min.js
  configureWebpack: config => {
    if(process.env.NODE_ENV === "production") {
      config.output.filename = 'js/[name]-vue-tasks.min.js'
      config.output.chunkFilename = 'js/[name]-vue-tasks.min.js'
    } else {
      config.output.filename = 'js/[name].js'
      config.output.chunkFilename = 'js/[name].js';
    }
  }
  // devServer: {
  //   // headers: {},
  //   proxy: {
  //     '^/api': {
  //       target: 'https://app-new.local-env.goboomtown.com', // TODO: .ENV file
  //       changeOrigin: true,
  //       logLevel: 'debug',
  //       pathRewrite: { '^/api': '/' }
  //     }
  //   }
  // }

})
