/*
 * @Author: hsingyin
 * @Date: 2020-01-22 17:43:09
 * @LastEditTime: 2020-04-27 16:49:54
 * @LastEditors: hsingyin
 * @Description: 工具类
 * @FilePath: /region-hospital-portal/src/utils/utils.js
 */

/**
 * @description: 格式化时间
 * @param {Date} date
 * @param {String} fmt
 * @return {String} 格式化时间字符串
 * @author: somebody
 * @example: formatDate(new Date(), 'yyyy/MM/dd hh:mm:ss')
 */
import router from '@/router'

export function formatDate(date: any, fmt: any) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    const str = o[k] + ''
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      )
    }
  }
  return fmt
}

function padLeftZero(str: any) {
  return ('00' + str).substr(str.length)
}

/**
 * @description: 正则校验
 * @param {String | number} str 待校验串
 * @param {string} type 校验类型
 * @return {boolean} 校验结果
 * @author: somebody
 * @example: check('老哥', name)
 */
export function check(str: any, type: any) {
  try {
    return rules[type](str)
  } catch (e) {
    console.log('没有这个类型的check，需在regRxp.js中添加该正则')
  }
}
// 正则表达式，可以按需添加
const rules = {
  name(str: any) {
    // 中文名
    return /^[\u4e00-\u9fa5]{2,8}$/.test(str)
  },
  phone(str: any) {
    // 手机号
    return /^1[3456789][0-9]\d{8}$/.test(str)
  },
  email(str: any) {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      str
    )
  },
  idCard(str: any) {
    // 身份证号
    var _num18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
      str
    )
    var _num15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/.test(
      str
    )
    return _num18 || _num15
  }
}

/**
 * @description: 设置title
 * @param {string} title
 * @return: underfined
 * @author: hsingyin
 * @example: setTitle('个人中心')
 */
export function setTitle(title: string) {
  document.title = title
  document.head.querySelector('title').innerText = title
}

/**
 * @description: 动态拼接query参数
 * @param {Object} options
 * @return {String} 拼接后的url
 * @author: hsingyin copy from Internet
 * @example: setUrlQuery({url: 'https://www.baidu.com', query: { id: 'xxx' }})
 */
export function setUrlQuery(options: any) {
  let {
    url,
    query
  } = options
  if (!url) {
    return ''
  }
  if (query) {
    let queryArr = []
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        queryArr.push(`${key}=${query[key]}`)
      }
    }
    if (url.indexOf('?') !== -1) {
      url = `${url}&${queryArr.join('&')}`
    } else {
      url = `${url}?${queryArr.join('&')}`
    }
  }
  return url
}

/**
 * @description: 获取问候语
 * @param {type}
 * @return {String}
 * @author: hsingyin copy from Internet
 * @example: getWelcomeText()
 */
export function getWelcomeText() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ?
    '早上好' :
    hour <= 11 ?
    '上午好' :
    hour <= 13 ?
    '中午好' :
    hour < 20 ?
    '下午好' :
    '晚上好'
}

/**
 * @description: 节流 按一定的频率触发函数
 * @param {Function} fn
 * @param {Number} time
 * @return {function}
 * @author: sombody
 * @example: throttle(fn, 2000)()
 */
export function throttle(fn: any, time = 1500) {
  let _lastTime: any = null
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > time || !_lastTime) {
      fn.apply(this, arguments)
      _lastTime = _nowTime
    }
  }
}

/**
 * @description: 去抖 一段时间后触发函数
 * @author: sombody
 * @param  {Number} time 空闲时间，单位毫秒
 * @param  {Function} fn 请求关联函数，实际应用需要调用的函数
 * @return {function}    返回客户调用函数
 * @example: debounce(fn, 200)()
 */
let last:any = null
export function debounce(fn, time = 300) {
  return function () {
    let ctx = this
    let args = arguments
    clearTimeout(last)
    last = setTimeout(function () {
      fn.apply(ctx, args)
    }, time)
  }
}

/**
 * @description: 跳转页面
 * @author: bevis
 * @param  {String} url 路由
 * @param  {Object} query 路由query对象
 * @return {function}    跳转路由
 * @example: gotoPage(url)
 */
export function gotoPage(url: any, query = {}) {
  if (!url) {
    return
  }
  // 增加外链的判断
  if (/^http/.test(url)) {
    window.location.href = url
  } else {
    router.push({
      path: url,
      query: query
    })
  }
}

/**
 * 转化日期
 * @param data 需要转化的数据
 * @returns {string}
 */
export function formatLocalDate(data: string) {
  const year = data.slice(0, 4)
  const mouth = data.slice(4, 6)
  const day = data.slice(6, 8)

  return `${year}/${mouth}/${day}`
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source: any) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 拼接的图片链接
 * @param url 需要拼接的链接
 * @returns {string}
 */
export function formatImage(url: any) {
  // 增加外链的判断
  if (/^http/.test(url)) {
    return url
  } else {
    return window.YHSERVICECONFIG.picBaseLink + url
  }
}

/**
 * 信息脱敏
 * @param str 需要脱敏的字符串
 * @returns {string}
 */
export function desensitization(str: string) {
  let tempStr = ''

  if (str !== null && str !== undefined) {
    // 身份证
    if (str.length === 18) {
      tempStr = str.substring(0, 3) + str.substring(4, str.length - 3).replace(/[\s\S]/gi, '*') +
        str.substring(str.length - 3, str.length)
      return tempStr
    }
    // 手机号
    if (str.length === 11) {
      tempStr = str.substring(0, 3) + str.substring(3, str.length - 3).replace(/[\s\S]/gi, '*') +
        str.substring(str.length - 3, str.length)
      return tempStr
    }
    // 姓名或其他
    if (str.length < 3) {
      tempStr = '*' + str.substring(1, str.length)
      return tempStr
    } else if (str.length >= 3 && str.length <= 6) {
      tempStr =
        str.substring(0, 1) +
        str.substring(1, str.length - 1).replace(/[\s\S]/gi, '*') +
        str.substring(str.length - 1, str.length)
      return tempStr
    } else if (str.length > 6) {
      tempStr = str.substring(0, 3) + '***' + str.substring(6, str.length)
      return tempStr
    }
  } else {
    return ''
  }
}

/**
 * 就诊卡类型
 * @param  cardType 卡类型
 * @returns 
 */
export function cardTypeFmt(cardType: any) {
  if (!cardType) {
    return ''
  }
  const cardTypeArr: any = {
    '01': '社保卡',
    '02': '临时卡',
    '03': '就诊卡',
    '04': '金融卡',
    '05': '电子健康卡',
    '08': '就诊号',
  }
  return cardTypeArr[cardType] || cardType
}

/**
 * 证件类型
 * @param  idType 证件类型
 * @returns 
 */
export function idTypeFmt(idType: any) {
  if (!idType) {
    return ''
  }
  const idTypeArr: any = {
    '01': '身份证',
    '02': '居民户口簿',
    '03': '护照',
    '04': '军官证',
    '05': '驾驶证',
    '06': '港澳居民来往内地通行证',
    '07': '台湾居民来往内地通行证',
  }
  return idTypeArr[idType] || idType
}

//预约状态 1：已预约；2：已退号；3：已履约；4：爽约；5：停诊；6：替诊；
export function orderStatusFmt(status: any) {
  if (!status) {
    return ''
  }
  const idTypeArr: any = {
    '1': '已预约',
    '2': '已签到',
    '3': '已就诊',
    '4': '已改签',
    '5': '已取消',
    '6': '锁号',
    '7': '停止预约',
    '8': '停诊',
    '9': '已过期'
  }
  return idTypeArr[status] || status
}

//团体订单预约状态 ,0可以编辑，1显示下载,其他当做拒绝
export function groupStatusFmt(status: any) {
  if (!status) {
    return ''
  }
  const idTypeArr: any = {
    "0": "已申请",
    "1": "已通过",
    "2": "已拒绝",
    "3": "已完成",
    "9": "已超时",
  }
  return idTypeArr[status] || status
}
//支付状态 
export function payTypeFmt(payType: any) {
  if (!payType) {
    return ''
  }
  const idTypeArr: any = {
    "0": "已保存",
    "1": "预结算完成",
    "2": "待支付",
    "3": "自费完成",
    "4": "医保支付完成",
    "5": "院内结算完成",
    "6": "结算完成",
    "7": "已退款",
    "8": "已医保全部退款",
    "9": "仅自费全部退款",
    "10": "仅自费部分退款",
    "11": "医保全部退自费部分退款",
    "12": "已撤销",
    "13": "医保已撤销",
    "14": "异常",
    "15": "结算失败",
    "16": "医保结算失败自费冲正失败",
    "17": '退款中'
  }
  return idTypeArr[payType] || payType
}

/**医生类型   ("1","住院医师"),
    ("2","主治医师"),
    ("3","副主任医师"),
    ("4","主任医师"),
    ("5","知名专家"),
    ("6","医师"),
    ("99","其他")
*/
export function doctorLevelFmt(level: any) {
  if (!level) {
    return '暂无'
  }
  const idTypeArr: any = {
    '1': '住院医师',
    '2': '主治医师',
    '3': '副主任医师',
    '4': '主任医师',
    '5': '知名专家',
    '6': '医师',
    '99': '其他'
  }
  return idTypeArr[level] || level
}

// 获取当前ua
export function getCurrentUA() {
  const _ua = navigator.userAgent.toLowerCase()
  let _term_type = process.env.VUE_APP_TERMTYPE
  if (_ua.match(/MicroMessenger/i) && _ua.match(/MicroMessenger/i)[0] === 'micromessenger') {
    _term_type = 'WX'
  } else if (_ua.match(/Alipay/i) && _ua.match(/Alipay/i)[0] === 'alipay') {
    _term_type = 'ALI'
  }
  return _term_type
}

export function wxPubPay(pub_pay: any, callback: any) {
  var obj = pub_pay;
  if (typeof WeixinJSBridge == "undefined") {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', function (obj, callback) {
        onBridgeReady(obj, callback);
      }, false);
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', function (obj, callback) {
        onBridgeReady(obj, callback);
      });
      document.attachEvent('onWeixinJSBridgeReady', function (obj, callback) {
        onBridgeReady(obj, callback);
      });
    }
  } else {
    onBridgeReady(obj, callback);
  }
}

function onBridgeReady(obj: any, callback: any) {
  WeixinJSBridge.invoke('getBrandWCPayRequest', {
    "appId": obj.appId, // 公众号名称，由商户传入
    "timeStamp": obj.timeStamp, // 时间戳，自1970年以来的秒数
    "nonceStr": obj.nonceStr, // 随机串
    "package": obj.package,
    "signType": obj.signType, // 微信签名方式:
    "paySign": obj.paySign
    // 微信签名
  }, function (res: any) {
    // 使用以下方式判断前端返回,微信团队郑重提示:res.err_msg将在用户支付成功后返回
    if (res.err_msg == "get_brand_wcpay_request:ok") {
      callback();
    } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
      Toast({
        message: '支付取消'
      })
    } else {
      Toast({
        message: '支付失败,' + res.err_msg
      })
    }
    // ok，但并不保证它绝对可靠。
  });
}

/**
 * 时间-多久前
 * @param {}} dateStr 例： 20210525162850
 * @returns 
 */
export function replyDateAfter(dateStr: string) {
  if (!dateStr) return ''
  let str = dateStr.substring(0, 4) + '/' + dateStr.substring(4, 6) + '/' + dateStr.substring(6, 8) + ' ' + dateStr.substring(8, 10) + ':' + dateStr.substring(10, 12) + ':' + dateStr.substring(12, 14)
  let timestamp: any = new Date(str).getTime() / 1000
  // 补全为13位
  var arrTimestamp:Array<any> = (timestamp + '').split('');
  for (var start = 0; start < 13; start++) {
    if (!arrTimestamp[start]) {
      arrTimestamp[start] = '0';
    }
  }
  timestamp = arrTimestamp.join('') * 1;
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - timestamp;

  // 如果本地时间反而小于变量时间
  if (diffValue < 0) {
    return '刚刚';
  }
  // 计算差异时间的量级
  var monthC: any = diffValue / month;
  var weekC: any = diffValue / (7 * day);
  var dayC: any = diffValue / day;
  var hourC: any = diffValue / hour;
  var minC: any = diffValue / minute;

  // 数值补0方法
  var zero = function (value: any) {
    if (value < 10) {
      return '0' + value;
    }
    return value;
  };

  // 使用
  if (monthC > 4) {
    // 超过1年，直接显示年月日
    return (function () {
      var date = new Date(timestamp);
      return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
    })();
  } else if (monthC >= 1) {
    return parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    return parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    return parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    return parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    return parseInt(minC) + "分钟前";
  }
  return '刚刚';
}

/**
 * 判断是否我们自己APP内调用
 */
export function isApp() {
  var _userAgent = navigator.userAgent;
  return (_userAgent.indexOf('COM_MSTPAY') > -1);
}


/**
 * JSBridge调用
 */
export function setupWebViewJavascriptBridge(callback: any) {
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'https://__bridge_loaded__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe)
  }, 0);
}

// jsbridge 调用v2
export function callYhapp(method: any,param: any){
  var message: any = {}
  message.method = method;//方法名
  message.param = param;//参数数据
  message.callback = 'callbackByApp';//回调方法名
  //标准调用
  yhapp.postMessage(JSON.stringify(message));
}