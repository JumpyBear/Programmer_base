// 基于axios封装网络请求
import theAxios from 'axios'

// 引入router路由对象
// import router from '@/router/index'
import { Notify } from 'vant'
// setToken
import { getToken, removeToken } from '@/utils/token'
// import { refreshTokenAPI } from '@/api/index'
import router from '@/router'

// 新建一个新的axios实例
const axios = theAxios.create({
  baseURL: 'http://geek.itheima.net',
  timeout: 20000 // 设置超时时间为20s，请求20秒无响应直接判断为超时
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 判断有token再携带，判断具体api/index.js里如果没有携带Authorization，再添加上去
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // http状态码为2xx，3xx进入到这里
  return response
}, async function (error) {
  // 对响应错误做点什么
  // http状态码为4xx，5xx进入到这里
  // 只有401才代表身份过期，才需要跳转到登录页
  if (error.response.status === 401) {
    // 不能使用this.$router，因为this不是vue组件对象，不能调用router
    // 解决：this.$router为了拿到router路由对象，直接去上面引入router路由对象
    Notify({ type: 'warning', message: '身份已过期，请重新登录！' })
    // 方式1: 主动删除token,用户有感知
    // 主动删除token,才能使我的路由守卫失效,让我进入登录页
    removeToken()
    // router.currentRoute 相当于在vue文件内的this.$route -> 当前路由对象信息
    // fullPath路由对象里完整的路由路径#后面的一切
    router.replace(`/login?path=${router.currentRoute.fullPath}`)
  }

  // 方式2: 使用refresh_token换回新的token继续使用,JS代码实现,用户无感知
  // const res = await refreshTokenAPI()
  // 1.新的token回来之后要更新本地token
  // setToken(res.data.data.token)
  // 2. 更新新的token在请求头里
  // error.config.headers.Authorization = `Bearer ${res.data.data.token}`
  // 3. 把未完成的请求再次发起
  // error.config就是上次请求的配置对象
  // 结果要return回原本逻辑页面调用的地方
  // return axios(error.config)
  // console.log(res)
  // } else if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
  //   // 清除所有存储
  //   localStorage.clear()
  //   Notify({ type: 'warning', message: '身份已过期,请重新登录!' })
  //   router.replace('/login')
  // }
//   return Promise.reject(error)
})

// 导出自定义函数，对象解构赋值
export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return axios({
    url,
    method,
    params,
    data,
    headers
  })
}

// 以后换库, 只需要改这里, 逻辑页面不用动, 保证代码的复用性和独立性(高内聚低耦合)
// return new Promise((resolve, reject)=> {
// 如果params里有值，需要自己写js代码，把params里的key和value拼接到url上
// $.ajax({
//   url,
//   data,
//   headers,
//   type: method,
//   success: (res) => {
//    resolve(res)
//   },
//   error: (err) => {
//   reject(err)
//  }
//  })
// })
