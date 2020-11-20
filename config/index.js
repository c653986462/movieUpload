// const  baseUrl= 'http://192.168.9.6:8087/api'
// const baseUrl= 'http://test.shiduai.com/api'
// const baseUrl = 'http://47.98.112.234:8081/api'
// const  baseUrl= 'http://192.168.9.88:8080/api'
// const baseUrl= 'http://test.shiduai.com/api/'
// const baseUrl = 'http://192.168.9.17:8110'
// 朱坪
// const baseUrl = 'http://192.168.9.14:9400'
// // 秋琴
// const baseUrl = 'http://192.168.9.29:8099/api'
// // 开发环境
// const baseUrl = 'http://test-v.shiduai.com:8081/api'
// 郭鹏
// const baseUrl = 'http://192.168.9.34:9513'
// 测试环境
const baseUrl = 'http://192.168.9.44:3001'
// 环境
// const baseUrl = 'http://shengting-manager.shiduai.com/api'
// 正式环境
// const baseUrl = 'http://spzxjd-zjs-w.shiduai.com/api'

const routerIntercept = [] // 路由拦截 请写入需要拦截的路由路径

module.exports = {
  baseUrl: baseUrl,
  routerIntercept: routerIntercept
}
