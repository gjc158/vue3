import axios, { AxiosResponse } from 'axios'
import { errorCodeType } from '@/utils/server/error-code-type'
import { Toast } from 'vant'
import store from '@/store/index'

console.info(store)
// 创建axios实例
const service = axios.create({
  // 服务接口请求
  baseURL: '/',
  // 超时设置
  timeout: 15000,
  headers: { 
    'Content-Type': 'application/json;charset=utf-8',
    'Authorization': ''
  }
})

let loading: any;
//正在请求的数量
let requestCount: number = 0
//显示loading
const showLoading = () => {
  if (requestCount === 0 && !loading) {
    loading = Toast.loading({
      message: '加载中...',
      forbidClick: true,
    });
  }
  requestCount++;
}
//隐藏loading
const hideLoading = () => {
  requestCount--
  if (requestCount == 0) {
    loading.clear()
  }
}

// 请求拦截
service.interceptors.request.use((config: any) => {
  showLoading()
  // 是否需要设置 token
  // config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  const token = store.getters['user/getUserToken']
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?';
    for (const propName of Object.keys(config.params)) {
      const value = config.params[propName];
      var part = encodeURIComponent(propName) + "=";
      if (value !== null && typeof (value) !== "undefined") {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            let params = propName + '[' + key + ']';
            var subPart = encodeURIComponent(params) + "=";
            url += subPart + encodeURIComponent(value[key]) + "&";
          }
        } else {
          url += part + encodeURIComponent(value) + "&";
        }
      }
    }
    url = url.slice(0, -1);
    config.params = {};
    if (token) {
      config.params['token'] = token
    }
    config.url = url;
  } else{
    const _timestamp = +new Date() + ''
    // 注入token
    if (token) {
      // config.headers['Authorization'] = 'bearer ' + token
      config.headers['Authorization'] = token
      config.data['sessionId'] = token
    }

    if (config.method === 'post') {
      config.data['appId'] = import.meta.env.VITE_APP_APPID
      // config.data['deviceId'] = import.meta.env.VITE_APP_DEVICEID || ''
      config.data['encryptType'] = import.meta.env.VITE_APP_ENCRYPTTYPE || ''
      // config.data['sign'] = import.meta.env.VITE_APP_SIGN || ''
      config.data['signType'] = import.meta.env.VITE_APP_SIGNTYPE || ''
      config.data['termType'] = import.meta.env.VITE_APP_TERMTYPE || ''
      config.data['timestamp'] = _timestamp
      config.data['version'] = import.meta.env.VITE_APP_VERSION || ''
    }
    if (config.method === 'get') {
      if (token) {
        config.params['token'] = token
      }
    }
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use((res: AxiosResponse) => {
  hideLoading()
  // 未设置状态码则默认成功状态
  const code = res.data['respCode'] || res.data['code'];
  // 获取错误信息
  const msg = res.data['respMsg'] || errorCodeType(code) || errorCodeType(0)
  if (code === '000000') {
    return Promise.resolve(res.data.param as any)
  } else {
    Toast.fail(msg)
    return Promise.reject(res.data)
  }
},
  error => {
    console.log('err' + error)
    hideLoading()
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    }
    else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Toast.fail({
      message: message,
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service