import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getHeader } from '@/utils/auth'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (getToken() !== '') {
      config.headers[getHeader()] = getToken()
    }

    const method = config.method.toLocaleLowerCase()
    if (method === 'get') {
      // GET请求就序列化参数
      if (config.data !== undefined && config.data !== null) {
        config.url += ('?' + qs.stringify(config.data))
      }
      config.params = { ...config.params }
    }
    if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
      // config.data = qs.stringify({ ...config.data })
      config.headers['Content-Type'] = 'application/json;'
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (response.status !== 200) {
      // if the custom code is not 20000, it is judged as an error.
      if (res.status === 401) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      // 系统内部错误
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    } else {
      if(res.status === 4400){
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        })
      }else{
        return res
      }

    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
