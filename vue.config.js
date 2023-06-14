// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
module.exports ={
  devServer: {
    // host: 'http://120.26.103.180/',
    host: 'localhost',
    port: 8080,  //没被占用，可以使用的端口
    open: true,
    proxy: {
      '/api':{
        target: 'http://localhost:5000', //接口域名
        // target: 'http://120.26.103.180:5000', //接口域名
        changeOrigin: true,             //是否跨域
        secure: false,                   //是否https接口
        pathRewrite: {                  //路径重置
          '^/api': ''
        }
      }
    }
  }
}
