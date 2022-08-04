/*
 * @Author: Ztr
 * @Date: 2020-01-22 17:43:09
 * @LastEditTime: 2020-04-28 17:25:32
 * @LastEditors: hsingyin
 * @Description: 全局封装Axios
 * @FilePath: /region-hospital-portal/src/utils/https.js
 */

import Axios from 'axios'
import store from '../store/index'
import api from '../config/api'
import router from '../router'
import { Toast, Dialog } from 'vant'
import { getCurrentUA } from '@/utils/utils'

// 全局请求接口配置信息
Axios.defaults.baseURL = api.base
Axios.defaults.headers['Content-Type'] = api.contentType
Axios.defaults.timeout = process.env.VUE_APP_API_TIMEOUT
const _term_type = getCurrentUA()
let _haveLoading = true
let _isShow = false
// Request拦截器
Axios.interceptors.request.use(
  config => {
    const _timestamp = +new Date() + ''
    // 注入token
    if (store.getters.token) {
      // config.headers['Authorization'] = 'bearer ' + store.getters.token
      config.headers['Authorization'] = store.getters.token
      config.data['sessionId'] = store.getters.token
    }

    if (config.method === 'post') {
      config.data['appId'] = api.ucAppId || ''
      // config.data['deviceId'] = process.env.VUE_APP_DEVICEID || ''
      config.data['encryptType'] = process.env.VUE_APP_ENCRYPTTYPE || ''
      // config.data['sign'] = process.env.VUE_APP_SIGN || ''
      config.data['signType'] = process.env.VUE_APP_SIGNTYPE || ''
      config.data['termType'] = _term_type || ''
      config.data['timestamp'] = _timestamp
      config.data['version'] = process.env.VUE_APP_VERSION || ''
    }
    if (config.method === 'get') {
      if (store.getters.token) {
        config.params['token'] = store.getters.token
      }
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// Response拦截器
Axios.interceptors.response.use(
  response => {
    // 处理关闭loading
    // _haveLoading && Toast.clear()
    Toast.clear()
    // axios默认请求判断状态
    if (response.status === 200) {
      // 成功过滤处理，返回数据对象，属性信息走配置文件的配置
      if (
        !api.responseConfig.isOK(response.data) ||
        api.responseConfig.errorCodes.indexOf(
          response.data[api.responseConfig['code']]
        ) >= 0
      ) {
        if (response.data[api.responseConfig['code']] === '070199') {
          _isShow = false
          const userRealName = window.location.origin + '/uc-auth-front/#/identification?returnUrl=' + encodeURIComponent('/pages/loading/index?gotoUrl=' + encodeURIComponent(window.location.href)) + '&appId=8a8a87106b72a440016b72bf44a10000&token=' + store.getters.token
          // const userRealName = 'https://dev.ylzpay.com/uc-auth-front/#/identification?returnUrl=' + encodeURIComponent(window.location.href) + '&appId=8a8a87106b72a440016b72bf44a10000&token=' + store.getters.token
          Dialog.confirm({
            title: '温馨提示',
            message: '您还未实名，请前往实名'
          })
            .then(() => {
              // on confirm
              window.location.href = userRealName
            })
            .catch(() => {
              // on cancel
            })
          return Promise.reject(response.data)
        }
        // 请求出错，统一处理
        if (!_isShow) {
          _isShow = true
          Toast({
            message: `${response.data[api.responseConfig.msg] ||
              '请求数据出错'}`
          })
          setTimeout(() => {
            if (
              api.responseConfig.errorCodes.includes(
                response.data[api.responseConfig['code']]
              )
            ) {
              api.responseConfig.errorCallback(store, router)
            }
            _isShow = false
          }, 1200)
        }
        return Promise.reject(response.data)
      } else {
        try {
          return Promise.resolve(response.data[api.responseConfig.data])
        } catch (error) {
          return Promise.reject(error)
        }
      }
    } else {
      return Promise.reject(response.data[api.responseConfig.data])
    }
  },
  error => {
    // 处理关闭loading
    _haveLoading && Toast.clear()
    if (error.response) {
      // 处理错误状态码
      switch (error.response.status) {
        case 401:
          break
        default:
          break
      }
    }
    if (error.response.data && error.response.data.error_msg) {
      Toast({
        message: error.response.data.error_msg || '请求数据出错'
      })
    }
    return Promise.reject(error.response.data)
  }
)

// 包装https请求方法，做统一的请求控制
export default function https({
  url = api.url,
  isLoading = true,
  method = 'POST',
  serviceId,
  params = {},
  pageParam = {}
}) {
  _haveLoading = isLoading
  if (isLoading) {
    Toast.loading({ message: '数据处理中...' })
  }
  return new Promise((resolve, reject) => {
    const _axiosConfig = {
      method: method,
      params: {},
      pageParam: {},
      data: {},
      url: url
    }

    if (method.toUpperCase() === 'GET') {
      // _axiosConfig['params']['serviceId'] = serviceId
      _axiosConfig['param'] = params
    } else {
      _axiosConfig['data']['serviceId'] = serviceId
      _axiosConfig['data']['param'] = params
      _axiosConfig['data']['pageParam'] = pageParam
    }

    Axios(_axiosConfig)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
