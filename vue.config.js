// gzip压缩插件
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 打包提速文件
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const config = require('./config')

// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development'

// 本地环境是否需要使用cdn
const devNeedCdn = false

// cdn链接
const cdn = {
  // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    axios: 'axios'
  },
  // cdn的css链接
  css: [],
  // cdn的js链接
  js: [
    'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
    'https://cdn.jsdelivr.net/npm/vue-router@3.3.4/dist/vue-router.min.js',
    'https://cdn.jsdelivr.net/npm/vuex@3.5.1/dist/vuex.min.js',
    'https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js'
  ]
}

module.exports = {
  // 基本路径(开发路径和打包路径)
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  assetsDir: 'static',
  // use the full build with in-browser compiler?
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {
    // ============注入cdn start============
    config.plugin('html').tap(args => {
      // 生产环境或本地需要cdn时，才注入cdn
      if (isProduction || devNeedCdn) args[0].cdn = cdn
      return args
    })
    // ============注入cdn end============
  }, //  将接收ChainableConfig由webpack-chain提供支持的实例的函数。
  configureWebpack: config => {
    // 配置去console和Gzip压缩
    const plugins = [
      new CompressionWebpackPlugin({
        // 开启gzip
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }),
      new HardSourceWebpackPlugin()
    ]
    if (process.env.NODE_ENV !== 'development') {
      config.plugins = [...config.plugins, ...plugins]
    }
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: process.env.NODE_ENV === 'production',
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      css: {}
    }
    // 启用 CSS modules for all css / pre-processor files.
    // requireModuleExtension: false
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  // webpack-dev-server 相关配置
  devServer: {
    // open: process.platform === 'darwin',
    open: true,
    host: config.host ? config.host : '0.0.0.0',
    port: 5700,
    https: false,
    hotOnly: true,
    before: () => {},
    proxy: {
      // 设置代理
      '/api': {
        target: config.baseUrl,
        ws: true, //
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': '' // 本身的接口地址没有 '/api' 这种通用前缀，所以要去掉
        }
      }
    }
  },
  // 第三方插件配置
  pluginOptions: {},
  transpileDependencies: []
}
