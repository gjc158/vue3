/*
 * @Author: hsingyin
 * @Date: 2020-01-22 17:44:49
 * @LastEditTime: 2020-04-29 18:23:06
 * @LastEditors: hsingyin
 * @Description: 配置文件
 * @FilePath: /region-hospital-portal/src/config/api.js
 */

// 请求地址, 权重 base（baseTest） >  VUE_APP_API_LOCATION
const base = window.YHSERVICECONFIG.base ? window.YHSERVICECONFIG.base : ''
// 中台配置
const ucLoginUrl = window.YHSERVICECONFIG.ucLoginUrl ? window.YHSERVICECONFIG.ucLoginUrl : import.meta.env.VUE_APP_UC_AUTH_URL // 登录地址
const getOpenIdUrl = window.YHSERVICECONFIG.getOpenIdUrl ? window.YHSERVICECONFIG.getOpenIdUrl : import.meta.env.VUE_APP_GET_OPENID_URL // 获取openid地址
const wxAccountId = window.YHSERVICECONFIG.wxAccountId ? window.YHSERVICECONFIG.wxAccountId : import.meta.env.VUE_APP_WX_ACCOUNTID // 原始id
const ucAppId = window.YHSERVICECONFIG.ucAppId ? window.YHSERVICECONFIG.ucAppId : import.meta.env.VUE_APP_APPID // appid

// 完整请求地址
const url = import.meta.env.VUE_APP_API_LOCATION

// 数据传输类配置
const contentType = 'application/json' // form提交数据：application/x-www-form-urlencoded

// token校验
const tokenCheck = false
const openidCodeCheck = false

// 统一请求配置
const responseConfig = {
  // 响应代码
  code: 'respCode',
  // 响应数据
  data: 'param',
  // 错误提示信息
  msg: 'respMsg',
  // 加密数据
  encode: 'encData',
  // 签名数据
  signData: 'signData',
  // 响应是否是成功的
  isOK: function(response) {
    return response instanceof Object && response['respCode'] === '000000'
  },
  // tokenCheck为true时，token验证不通过时返回的异常码， 出现这种情况情况下将直接执行回调errorCallBack
  errorCodes: [500023, '070199'],
  // auth error code
  authErrorCode: ['030400', '030401', '090000', '200040'],
  errorCallback: function() {
    // token过期后,自定义处理,或返回错误
  }
}

// 提示语
const waitTips = '敬请期待'

// 过渡动画(低版本系统建议关闭)
const routerTransition = false

// 白名单
const routerWhiteList = []
const openidWiteList = []

export default {
  base,
  url,
  contentType,
  tokenCheck,
  openidCodeCheck,
  responseConfig,
  waitTips,
  routerTransition,
  routerWhiteList,
  openidWiteList,
  ucLoginUrl,
  getOpenIdUrl,
  wxAccountId,
  ucAppId
}
