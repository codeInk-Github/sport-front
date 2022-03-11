// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
    // 选项...
    publicPath:"/sports/",
    // devServer:{
    //     proxy:{
    //         '/api': {
    //             target: 'http://localhost:9000/sportsBack', //这里填写项目真实的后台接口地址
    //             changOrigin: true, //设置允许跨域
    //             pathRewrite: {//这个重写不可省略！因为我们真正请求的地址并不含 /api
    //             '^/api': ''
    //             /* 当我们在浏览器中看到请求的地址为：http://localhost:8080/api/data/getdata 时
    //             因为重写了 /api ，所以实际上访问的地址是：http://x.x.x.x:x/data/getdata，
    //             */
    //             },
    //         },
    //     },
    // },
}