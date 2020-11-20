// 引入api地址配置
const API_ADDRESS = '/api'

var Api = {}
Api.install = function (Vue) {
  if (!Vue.axios) {
    console.error('Api需要引入axios插件...')
    return
  }

  // 定义一个请求拦截器
  Vue.axios.interceptors.request.use(function (config) {
    return config
  })

  // 定义一个响应拦截器
  Vue.axios.interceptors.response.use(
    function (res) {
      if (res.data.code !== 0) {
        console.error(res.data.msg || '获取数据失败')
      }
      return res.data
    },
    function (err) {
      console.error('获取数据失败')
      return Promise.reject(err)
    }
  )

  Vue.axios.defaults.headers = {
    // 'Client-Type': 'H5',
    // 'Content-Type': 'application/json'
    'Content-Type': 'multipart/form-data'
  }

  // 接口列表
  Vue.prototype.Api = {
    // 获取信息员周报列表
    video (data) {
      return Vue.axios.post(`${API_ADDRESS}/video`, data)
    }
  }
}
export default Api
