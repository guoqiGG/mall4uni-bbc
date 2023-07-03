/*
 * Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.
 *
 * https://www.mall4j.com/
 *
 * 未经允许，不可做商业用途！
 *
 * 版权所有，侵权必究！
 */

const config = require('./config.js')
const http = require('./http.js')
import i18n from '../main.js'
import { router } from '../router'
import {
  PayType,
  AppType
} from '../utils/constant.js'
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatHtml = content => {
  if (!content) {
    return
  }
  content = content.replace(/\<p/gi, '<p style="max-width:100% !important;word-wrap:break-word;word-break:break-word;" ')
  content = content.replace(/\<img/gi, '<img style="width:100% !important;height:auto !important;margin:0;display:flex;" ')
  content = content.replace(/style="/gi, 'style="max-width:100% !important;table-layout:fixed;word-wrap:break-word;word-break:break-word;')
  content = content.replace(/\<table/gi, '<table style="table-layout:fixed;word-wrap:break-word;word-break:break-word;" ')
  // content = content.replace(/\<td/gi,'<td cellspacing="0" cellpadding="0" border="0" style="display:block;vertical-align:top;margin: 0px; padding: 0px; border: 0px;outline-width:0px;"');
  content = content.replace(/\<td/gi, '<td cellspacing="0" cellpadding="0" style="border-width:1px; border-style:solid; border-color:#666; margin: 0px; padding: 0px;"')
  content = content.replace(/width=/gi, 'sss=')
  content = content.replace(/height=/gi, 'sss=')
  content = content.replace(/ \/\>/gi, ' style="max-width:100% !important;height:auto !important;margin:0;display:block;" \/\>')
  return content
}

const endOfStartTime = (startTime, endTime) => {
  let result = {
    day: '00',
    hou: '00',
    min: '00',
    sec: '00',
    signs: 0
  }

  if (endTime - startTime > 0) {
    const time = (endTime - startTime) / 1000 // 获取天、时、分、秒
    const day = parseInt(time / (60 * 60 * 24))
    const hou = parseInt(time % (60 * 60 * 24) / 3600)
    const min = parseInt(time % (60 * 60 * 24) % 3600 / 60)
    const sec = parseInt(time % (60 * 60 * 24) % 3600 % 60)
    result = {
      day: `${timeFormat(day)}`,
      hou: `${timeFormat(hou)}`,
      min: `${timeFormat(min)}`,
      sec: `${timeFormat(sec)}`,
      signs: 1
    }
  }

  return result
} // 小于10的格式化函数

const timeFormat = times => {
  return times < 10 ? '0' + times : times
}

const dateToTimestamp = dateStr => {
  if (!dateStr) {
    return ''
  }

  const newDataStr = dateStr.replace(/\.|\-/g, '/')
  const date = new Date(newDataStr)
  const timestamp = date.getTime()
  return timestamp
}

/**
 * 初始化支付类型
 */
const initPayType = () => {
  const appType = uni.getStorageSync('bbcAppType')
  const switchInfo = uni.getStorageSync('bbcPaySwitchInfo').switchInfo
  const payTypeInfo = {
    payType: PayType.ALIPAY_H5,
    payTypeStr: 'aliPay'
  }
  if (switchInfo.aliPaySwitch) {
    payTypeInfo.payType = PayType.ALIPAY_H5
    payTypeInfo.payTypeStr = 'aliPay'
  } else if (switchInfo.wxPaySwitch) {
    payTypeInfo.payType = appType === AppType.MP ? PayType.WECHATPAY_MP : PayType.WECHATPAY_H5
    payTypeInfo.payTypeStr = 'wechatPay'
  } else if (switchInfo.balancePaySwitch) {
    payTypeInfo.payType = PayType.BALANCEPAY
    payTypeInfo.payTypeStr = 'balancePay'
  } else if (switchInfo.payPalSwitch) {
    payTypeInfo.payType = PayType.PAYPAL
    payTypeInfo.payTypeStr = 'payPal'
  }
  // #ifdef H5
  if (appType === AppType.MP) {
    // 如果是微信环境打开,使用公众号支付
    payTypeInfo.payType = PayType.WECHATPAY_MP
    payTypeInfo.payTypeStr = 'wechatPay'
  }
  // #endif

  // #ifdef APP-PLUS
  payTypeInfo.payType = PayType.ALIPAY_APP
  payTypeInfo.payTypeStr = 'aliPay'
  // #endif

  // #ifdef MP-WEIXIN
  payTypeInfo.payType = PayType.WECHATPAY
  payTypeInfo.payTypeStr = 'wechatPay'
  // #endif
  return payTypeInfo
}

// 检查是否授权
const checkAuthInfo = fn => {
  // eslint-disable-next-line no-undef
  const pages = getCurrentPages()
  if (uni.getStorageSync('bbcToken')) {
    fn()
    return
  }
  if (pages[0] && pages[0].route === 'pages/cart/cart') {
    return
  }
  // 设置登录后的跳转地址
  setRouteUrlAfterLogin()
  uni.redirectTo({
    url: '/pages/user-login/user-login'
  })
}

// 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
// 详情查看javascript的数值范围
function checkIDCard(idcode) {
  // 加权因子
  var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  // 校验码
  var check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

  var code = idcode + ''
  var last = idcode[17]// 最后一位

  var seventeen = code.substring(0, 17)

  // ISO 7064:1983.MOD 11-2
  // 判断最后一位校验码是否正确
  var arr = seventeen.split('')
  var len = arr.length
  var num = 0
  for (var i = 0; i < len; i++) {
    num = num + arr[i] * weight_factor[i]
  }

  // 获取余数
  var resisue = num % 11
  var last_no = check_code[resisue]

  // 格式的正则
  // 正则思路
  /*
  第一位不可能是0
  第二位到第六位可以是0-9
  第七位到第十位是年份，所以七八位为19或者20
  十一位和十二位是月份，这两位是01-12之间的数值
  十三位和十四位是日期，是从01-31之间的数值
  十五，十六，十七都是数字0-9
  十八位可能是数字0-9，也可能是X
  */
  var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/

  // 判断格式是否正确
  var format = idcard_patter.test(idcode)

  // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
  return !!(last === last_no && format)
}

/**
 * 手机号正则校验
 */
const checkPhoneNumber = (phoneNumber) => {
  var regexp = /^[1][0-9]{10}$/
  return regexp.test(phoneNumber)
}

/**
 * 用户名正则校验
 */
const checkUserName = (userName) => {
  var regexp = /^([a-zA-Z0-9_]{4,16})$/
  return regexp.test(userName)
}

/**
 * 用户密码校验
 * @returns {Boolean}
 */
const checkPassword = (password) => {
  const regexp = new RegExp('^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,20}$')
  return regexp.test(password)
}

/**
 * 获取链接上的参数
 */
const getUrlKey = (name) => {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || ['', ''])[1]
    .replace(/\+/g, '%20')) || null
}

/**
 * 处理参数
 * @param {obj}  to: 目标页面路由信息
 */
const getPageInfo = (to) => {
  var path = to.path
  var query = to.query
  var pageInfo = {}
  if (path == '/pages/index/index' || path == '' || path == '*') {
    pageInfo.pageId = 1
  } else if (path == '/package-prod/pages/prod/prod' && !query.seckillId && !query.groupActivityId) {
    pageInfo.pageId = query.bannerEnter == '1' ? 2 : 3
    pageInfo.bizType = 0
    pageInfo.bizData = query.prodId
  } else if (path == '/pages/snap-up-detail/snap-up-detail' && query.seckillId) {
    pageInfo.pageId = 4
    pageInfo.bizType = 2
    pageInfo.bizData = query.seckillId
  } else if (path == '/package-prod/pages/prod/prod' && query.groupActivityId) {
    pageInfo.pageId = 5
    pageInfo.bizType = 1
    pageInfo.bizData = query.prodId
  } else if (path == '/pages/category/category') {
    pageInfo.pageId = 6
  } else if (path == '/pages/special-discount/special-discount') {
    pageInfo.pageId = 7
  } else if (path == '/pages/basket/basket') {
    pageInfo.pageId = 8
  } else if (path == '/package-user/pages/order-detail/order-detail') {
    pageInfo.pageId = 9
  } else if (path == '/package-pay/pages/pay-way/pay-way') {
    pageInfo.pageId = 10
    pageInfo.bizData = query.orderNumbers
  } else if (path == '/package-pay/pages/pay-result/pay-result') {
    pageInfo.pageId = 11
    pageInfo.bizData = query.orderNumbers
  }	else if (path == '/pages/user/user') {
    pageInfo.pageId = 12
  } else if (path == '/package-user/pages/order-list/order-list') {
    pageInfo.pageId = 13
  }
  return pageInfo
}

/**
 * 记录页面点击次数
 */
const tapLog = (visitType, orderNumbers, isPayRes, prodNum) => {
  // 更新会话时间
  uni.setStorageSync('bbcSessionTimeStamp', new Date().getTime())
  var flowAnalysisLogDto = uni.getStorageSync('bbcFlowAnalysisLogDto')

  flowAnalysisLogDto.visitType = visitType || 3
  flowAnalysisLogDto.nums = prodNum || undefined
  // 支付页面单独处理
  if (orderNumbers) {
    visitType = 1
    flowAnalysisLogDto.orderNumbers = orderNumbers
    flowAnalysisLogDto.step = flowAnalysisLogDto.step + 1
    flowAnalysisLogDto.pageId = !isPayRes ? 10 : 11
  }
  http.saveLog(flowAnalysisLogDto, visitType)
}

/**
 * 获取唯一值
 */
const getUuid = () => {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  var uuid = s.join('')
  return uuid
}

/**
 *	时间戳与当前时间比较，是否为同一天
 */
const checkSameDay = (timestamp) => {
  var nt = new Date(new Date().getTime())
  var ot = new Date(timestamp)
  return ot.getFullYear() + ot.getMonth() + ot.getDate() == nt.getFullYear() + nt.getMonth() + nt.getDate()
}

/**
 * 函数节流
 * @param fn
 * @param wait
 * @returns {Function}
 * @constructor
 */
const throttle = (fn, wait) => {
  var timer = null
  return function() {
    var context = this
    var args = arguments
    if (!timer) {
      timer = setTimeout(function() {
        fn.apply(context, args)
        timer = null
      }, wait)
    }
  }
}

/**
 * 防抖
 * @param fn
 * @param wait
 * @returns {Function}
 * @constructor
 */
const debounce = (fn, t) => {
  const delay = t || 300
  let timer
  return function() {
    const args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    const callNow = !timer
    timer = setTimeout(() => {
      timer = null
    }, delay)
    if (callNow) fn.apply(this, args)
  }
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
const tsToDate = (number, format) => {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
  var returnArr = []

  var date = new Date(number)
  returnArr.push(date.getFullYear())
  returnArr.push(date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
  returnArr.push(date.getDate() < 10 ? '0' + date.getDate() : date.getDate())

  returnArr.push(date.getHours() < 10 ? '0' + date.getHours() : date.getHours())
  returnArr.push(date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  returnArr.push(date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i])
  }
  return format
}

/**
     * 进行相隔时间判断
     *
     * true 删除显示时间
     * false 保留显示时间
     */
const timeBeApart = (uppTime, preTime) => {
  if (!uppTime) {
    return false
  }
  var dateDiff = preTime - uppTime// 时间差的毫秒数
  var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))// 计算出相差天数
  var leave1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))// 计算出小时数
  // 计算相差分钟数
  var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))// 计算相差分钟数

  // console.log('相差' + dayDiff + '天')
  // console.log('相差' + hours + '小时')
  // console.log('相差' + minutes + '分钟')

  if (dayDiff >= 1 || hours >= 1 || minutes > 4) {
    return false
  } else {
    return true
  }
}

/**
 * tabbar国际化
 */
const transTabbar = () => {
  uni.setTabBarItem({
    index: 0,
    text: i18n.t('index.homepage')
  })
  uni.setTabBarItem({
    index: 1,
    text: i18n.t('index.classification')
  })
  // #ifdef MP-WEIXIN
  // uni.setTabBarItem({
  //   index: 2,
  //   text: i18n.t('index.tabbarLive')
  // })
  uni.setTabBarItem({
    index: 2,
    text: i18n.t('index.cart')
  })
  uni.setTabBarItem({
    index: 3,
    text: i18n.t('index.myself')
  })
  // #endif
  // #ifndef MP-WEIXIN
  uni.setTabBarItem({
    index: 2,
    text: i18n.t('index.cart')
  })
  uni.setTabBarItem({
    index: 3,
    text: i18n.t('index.myself')
  })
  // #endif
}

/**
 * 移除购物车Tabbar的数字
 */
const removeTabBadge = () => {
  let pl = ''
  // #ifdef MP-WEIXIN
  pl = 'mp'
  // #endif
  uni.removeTabBarBadge({
    index: pl == 'mp' ? 2 : 2
  })
}

/**
 * 定位经纬度换算
 * @param {Obj}  经纬度对象
 * @return {Obj} 转换后的经纬度对象
 */
const locationConversions = (locationObj) => {
  // 转换坐标
  const x_pi = 3.14159265358979324 * 3000.0 / 180.0
  const x = locationObj.longitude
  const y = locationObj.latitude
  const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi)
  const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi)
  const lngs = z * Math.cos(theta) + 0.0065
  const lats = z * Math.sin(theta) + 0.006

  return {
    latitude: lats,
    longitude: lngs
  }
}

/**
 * 装修页面中的跳转方法
 * @param {Object} item 跳转信息
 */
const featureRoute = (item) => {
  // item.type: 1商品详情; 2购物车; 3个人中心; 4自定义页面;
  if (item.type == 1) {
    uni.navigateTo({
      url: '/package-prod/pages/prod/prod?prodId=' + item.link
    })
  }
  // 跳转自定义页面
  if (item.type == 2 || item.type == 3) {
    uni.switchTab({
      url: item.type == 2 ? '/pages/basket/basket' : '/pages/user/user'
    })
  }
  // 跳转自定义页面
  if (item.type == 4) {
    if (!item.link) {
      return
    }
    item.link = item.link.replace(/&amp;/g, '&')
    if (item.link == '/pages/category/category' || item.link == '/pages/basket/basket' || item.link == '/pages/user/user' || item.link == '/pages/index/index') {
      uni.switchTab({
        url: item.link
      })
    } else if (item.link.indexOf('/package-distribution') > -1 || item.link.indexOf('/package-member-integral') > -1) {
      checkAuthInfo(() => {
        uni.navigateTo({
          url: item.link
        })
      })
    } else {
      uni.navigateTo({
        url: item.link
      })
    }
  }
}

/**
 * 请求系统支付开关
 * @param {Boolean} forcedRefresh 是否强制刷新数据
 */
const getSysPaySwitch = (forcedRefresh) => {
  // 获取缓存中的配置
  const paySwitchInfo = uni.getStorageSync('bbcPaySwitchInfo') || {}
  if (!paySwitchInfo.expiredTime || new Date().getTime() > paySwitchInfo.expiredTime || forcedRefresh) {
    const params = {
      url: '/sys/config/info/getSysPaySwitch',
      method: 'GET',
      callBack: res => {
        const paySwitchInfo = {
          switchInfo: res,
          expiredTime: 5 * 60 * 60 * 1000 + new Date().getTime()
        }
        uni.setStorageSync('bbcPaySwitchInfo', paySwitchInfo)
      }
    }
    http.request(params)
  }
}

/**
 * 微信环境统一登录方法 (公众号 & 小程序)
 */
const weChatLogin = () => {
  const appType = uni.getStorageSync('bbcAppType')
  if (appType !== AppType.MP && appType !== AppType.MINI) {
    return
  }
  if (getApp().globalData.isLanding) return
  // 改变全局中登录
  const globalData = getApp().globalData
  globalData.isLanding = true
  if (appType === AppType.MINI) {
    // 微信小程序
    // 请求微信接口获取 code
    wx.login({
      success: (res) => {
        // 用code 请求登录
        loginByCode(res.code)
      }
    })
    return
  }
  if (appType === AppType.MP) {
    const tempuid = uni.getStorageSync('bbcTempUid')
    const token = uni.getStorageSync('bbcToken')
    // 微信公众号
    if (!tempuid && !token) {
      const code = getUrlKey('code')
      if (!code) {
        globalData.isLanding = false
        http.mpAuthLogin(config.domainAddress, true)
        return
      }
      // 先请求微信公众号登录接口
      loginByCode(code)
    } else {
      globalData.isLanding = false
    }
  }
}

/**
 * 通过微信返回的code登录
 * @param {String} code 请求微信返回的 code
 */
const loginByCode = (code) => {
  const params = {
    login: true,
    url: uni.getStorageSync('bbcAppType') === AppType.MINI ? '/social/ma' : '/social/mp',
    method: 'POST',
    data: code,
    callBack: res => {
      uni.setStorageSync('bbcTempUid', res.tempUid)
      if (res.tokenInfo) {
        loginSuccess(res.tokenInfo)
      }
      // 还原全局 正在登录状态
      getApp().globalData.isLanding = false
      while (getApp().globalData.requestQueue.length) {
        http.request(getApp().globalData.requestQueue.pop())
        getApp().globalData.currentReqCounts--
      }
    },
    errCallBack: () => {
      // 还原全局 正在登录状态
      getApp().globalData.isLanding = false
      while (getApp().globalData.requestQueue.length) {
        http.request(getApp().globalData.requestQueue.pop())
        getApp().globalData.currentReqCounts--
      }
      uni.removeStorageSync('bbcLoginResult')
      uni.removeStorageSync('bbcToken')
      uni.removeStorageSync('bbcHadBindUser')
      uni.removeStorageSync('bbcCode')
      uni.removeStorageSync('bbcUserInfo')
      uni.removeStorageSync('bbcExpiresTimeStamp')
    }
  }
  http.request(params)
}

/**
 * 登录成功
 * @param {Object} loginRes 登录成功返回的数据
 * @param {Boolean} isRefreshToken 该次登录是否为刷新token;
 */
const loginSuccess = (loginRes, isRefreshToken) => {
  uni.setStorageSync('bbcIsPrivacy', 1)
  uni.setStorageSync('bbcHadLogin', true)
  uni.setStorageSync('bbcToken', loginRes.accessToken)
  uni.setStorageSync('bbcLoginResult', loginRes) // 保存整个登录数据
  const expiresTimeStamp = loginRes.expiresIn * 1000 / 2 + new Date().getTime()
  // 缓存token的过期时间
  uni.setStorageSync('bbcExpiresTimeStamp', expiresTimeStamp)

  // 还原全局 正在登录状态
  getApp().globalData.isLanding = false
  while (getApp().globalData.requestQueue.length) {
    http.request(getApp().globalData.requestQueue.pop())
  }
  // 请求购物车数量
  http.getCartCount()
  previousPage(isRefreshToken)
}

// 登录返回上一页
const previousPage = (isRefreshToken) => {
  const routeUrlAfterLogin = uni.getStorageSync('bbcRouteUrlAfterLogin')
  const pages = getCurrentPages()
  const nowRoute = pages[pages.length - 1].route
  if (nowRoute === 'package-prod/pages/prod/prod' || nowRoute === 'package-activities/pages/spell-group-details/spell-group-details') {
    // 如果当前页面是商品详情页或拼团详情页，则不跳转其它页面
    uni.removeStorageSync('bbcRouteUrlAfterLogin')
    return
  }
  // 若为刷新token的登录
  if (isRefreshToken) {
    // 在登录页面登录时
    if (nowRoute === 'pages/user-login/user-login') {
      util.toHomePage()
    }
    return
  }

  if (pages.length === 1) {
    uni.reLaunch({
      url: routeUrlAfterLogin || '/pages/index/index'
    })
    uni.removeStorageSync('bbcRouteUrlAfterLogin')
    return
  }
  const prevPage = pages[pages.length - 2]
  if (!prevPage) {
    util.toHomePage()
    return
  }
  // 判断上一页面是否为tabbar页面 (首页和分类页无需登录接口)
  const isTabbar = prevPage.route === 'pages/user/user' || prevPage.route === 'pages/basket/basket'
  if (isTabbar) {
    router.pushTab('/' + prevPage.route)
  } else {
    // 非tabbar页面
    let backDelata = 0
    pages.forEach((page, index) => {
      if (page.$page.fullPath === routeUrlAfterLogin) {
        backDelata = pages.length - index - 1
      }
    })
    if (backDelata) {
      uni.navigateBack({
        delta: backDelata
      })
    } else {
      util.toHomePage()
    }
  }
}

/**
 * 刷新token
 */
const refreshToken = (params) => {
  const refreshToken = uni.getStorageSync('bbcLoginResult').refreshToken
  const expiresTimeStamp = uni.getStorageSync('bbcExpiresTimeStamp')
  if (!(refreshToken && expiresTimeStamp && expiresTimeStamp < new Date().getTime())) {
    return params
  }
  getApp().globalData.isLanding = true
  getApp().globalData.requestQueue.push(params)
  return {
    url: '/token/refresh',
    method: 'POST',
    login: true,
    isRefreshing: true,
    dontTrunLogin: true,
    data: {
      refreshToken
    },
    callBack: res => {
      getApp().globalData.isLanding = false
      loginSuccess(res, true)
    },
    errCallBack: errMsg => {
      // 清除refreshToken 过期时间
      uni.removeStorageSync('bbcExpiresTimeStamp')
      uni.removeStorageSync('bbcLoginResult')
      uni.removeStorageSync('bbcToken')
      uni.removeStorageSync('bbcHadBindUser')
      uni.removeStorageSync('bbcCode')
      uni.removeStorageSync('bbcUserInfo')
      uni.removeStorageSync('bbcExpiresTimeStamp')

      // 还原全局 正在登录状态
      getApp().globalData.isLanding = false
      while (getApp().globalData.requestQueue.length) {
        const queueParam = getApp().globalData.requestQueue.pop()
        http.request(queueParam)
      }
      // 请求微信环境登录
      weChatLogin()
    }
  }
}
/**
 * 套餐商品的支持的物流方式
 */
const initComboDelivery = (comboProdItems) => {
  const length = comboProdItems.length
  const deliveryModeVO = {}
  // mold   虚拟订单不判断
  deliveryModeVO.hasCityDelivery = comboProdItems.filter(el => el.deliveryModeVO.hasCityDelivery || el.mold === 1).length === length
  deliveryModeVO.hasShopDelivery = comboProdItems.filter(el => el.deliveryModeVO.hasShopDelivery || el.mold === 1).length === length
  deliveryModeVO.hasUserPickUp = comboProdItems.filter(el => el.deliveryModeVO.hasUserPickUp || el.mold === 1).length === length

  return deliveryModeVO
}

/**
 * 获取uni-app相关配置
 */
const getUniWebConfig = () => {
  const params = {
    url: '/webConfig/getUniWebConfig',
    method: 'GET',
    callBack: res => {
      uni.setStorageSync('bbcUniLoginLogoImg', res.uniLoginLogoImg || require('@/static/images/website-config/logo.png'))
      uni.setStorageSync('bbcUniTitleContent', res.uniTitleContent || '氢春态欢乐团')
    }
  }
  http.request(params)
}

/**
 * 设置登录后的跳转地址
 */
const setRouteUrlAfterLogin = () => {
  const pages = getCurrentPages()
  // 登录后的回跳地址
  if (pages[pages.length - 1].route.indexOf('register') === -1 && pages[pages.length - 1].route.indexOf('accountLogin') === -1) {
    uni.setStorageSync('bbcRouteUrlAfterLogin', pages[pages.length - 1].$page.fullPath)
  }
}

/**
 * 选择的图片是否小于2M
 * @param {Array} tempFiles 上传的图片临时文件数组
 * @return {Boolean} 是否小于2M
 */
const lessThan2M = (tempFiles) => {
  let flag = true
  for (let i = 0; i < tempFiles.length; i++) {
    const file = tempFiles[i]
    if (file.size > 1024 * 1024 * 2) {
      uni.showToast({
        title: i18n.t('index.lessThan2M'),
        duration: 2000,
        icon: 'none'
      })
      flag = false
      break
    }
  }
  return flag
}

/**
 * 根据地址返回省市区
 * @param {String} address 地址
 * @param {String} name 地名
 * @return {Array} 省市区的信息
 */
const area = async(address, name) => {
  if (!address) return
  const areaInfoArr = []
  let province, city, area // 名字
  let provinceIndex, cityIndex, areaIndex // 所处的索引
  let provinceId, cityId, areaId // areaId
  // 特殊的区域
  if (name.includes('苏滁现代产业园')) {
    province = '安徽省'
    city = '苏滁市'
    area = '苏滁现代产业园'
  } else if (name.includes('保定白沟新城')) {
    province = '河北省'
    city = '保定市'
    area = '保定白沟新城'
  } else if (name.includes('中沙群岛')) {
    province = '海南省'
    city = '三沙市'
    area = '中沙群岛的岛礁及其海域'
  } else {
    const provSuffix = ['省', '自治区', '黑龙江', '北京市', '天津市', '上海市']
    const citySuffix = ['市', '地区', '自治州', '盟']
    const areaSuffix = ['区', '市', '县', '群岛']
    let aIndex = 0
    const common = (arr) => {
      aIndex = 0
      for (let i = 0; i < arr.length; i++) {
        const index = address.indexOf(arr[i])
        if (index !== -1) {
          aIndex = index + arr[i].length
          break
        }
      }
    }
    common(provSuffix)
    if (aIndex === 0) return
    province = address.substring(0, aIndex)
    address = address.substring(aIndex)
    // 直辖市
    if (province === '北京市' || province === '天津市' || province === '上海市') {
      common(areaSuffix)
      if (aIndex === 0) return
      area = address.substring(0, aIndex)
      city = area.includes('县') ? '县' : '市辖区'
    } else {
      common(citySuffix)
      if (aIndex === 0) return
      city = address.substring(0, aIndex)
      address = address.substring(aIndex)
      common(areaSuffix)
      if (aIndex === 0) return
      area = address.substring(0, aIndex)
    }
  }
  const getListByPid = (pid) => {
    let paramData = {}
    if (pid === 0) {
      paramData = { level: 1 }
    } else {
      paramData = { pid }
    }
    return new Promise((resolve, reject) => {
      const params = {
        url: '/p/area/listByPid',
        method: 'GET',
        data: paramData,
        callBack: (res) => {
          resolve(res)
        }
      }
      http.request(params)
    })
  }
  // 省
  const res1 = await getListByPid(0)
  for (let i = 0; i < res1.length; i++) {
    if (province === res1[i].areaName) {
      provinceIndex = i
      provinceId = res1[i].areaId
      break
    }
  }
  // 市
  const res2 = await getListByPid(provinceId)
  for (let i = 0; i < res2.length; i++) {
    if (city === res2[i].areaName) {
      cityIndex = i
      cityId = res2[i].areaId
      break
    }
  }
  // 区
  const res3 = await getListByPid(cityId)
  for (let i = 0; i < res3.length; i++) {
    if (area === res3[i].areaName) {
      areaIndex = i
      areaId = res3[i].areaId
      break
    }
  }
  areaInfoArr.push({
    name: province,
    index: provinceIndex,
    areaId: provinceId
  })
  areaInfoArr.push({
    name: city,
    index: cityIndex,
    areaId: cityId
  })
  areaInfoArr.push({
    name: area,
    index: areaIndex,
    areaId
  })
  areaInfoArr.push(res1) // 省数组
  areaInfoArr.push(res2) // 市数组
  areaInfoArr.push(res3) // 区数组
  return areaInfoArr
}

/**
 * 回到首页
 */
const toHomePage = () => {
  const appType = uni.getStorageSync('bbcAppType')
  if (appType === 2 || appType === 4) {
    router.pushTab('/')
  } else {
    router.pushTab('/pages/index/index')
  }
}

/*
 分销接口
*/
const isSaleMessage = () => {
  return new Promise((resolve, reject) => {
    const params = {
      url: '/p/distribution/user/distributionUserInfo',
      method: 'GET',
      callBack: (res) => {
        resolve(res)
      }
    }
    http.request(params)
  })
}
/*
 获取店铺信息
*/
const getShopMessage = (shopId) => {
  return new Promise((resolve, reject) => {
    const params = {
      url: '/shop/headInfo',
      method: 'GET',
      data: {
        shopId: shopId
      },
      callBack: (res) => {
        resolve(res)
      }
    }
    http.request(params)
  })
}
// 页面跳转
const toRedirectLink = async(type, link, shopId) => {
  let newUrl = ''
  switch (type) {
    case '1': // 跳转到商品
      uni.navigateTo({
        url: '/package-prod/pages/prod/prod?prodId=' + link
      })
      break
    case '2': // 跳转到分类
      if (Array.isArray(link)) {
        uni.navigateTo({
          url: `/package-prod/pages/sub-category/sub-category?parentId=${link[1].value}&categoryId=${link[2].value}`
        })
      } else {
        uni.navigateTo({
          url: '/package-shop/pages/shop-category/shop-category?link=' + link.categoryId
        })
      }
      break
    case '3': // 跳转到店铺
      const storeRes = await getShopMessage(link)
      let url = ''
      if (storeRes.renovationId) {
        url = '/package-shop/pages/feature-index/feature-index0?shopId=' + link + '&renovationId=' + storeRes.renovationId
      } else {
        url = '/package-shop/pages/shop-page/shop-page?shopId=' + link
      }
      uni.navigateTo({
        url
      })
      break
    case '4': // 跳转到页面
      if (mobileLoginList.indexOf(link) > -1) {
        util.checkAuthInfo(async() => {
          if (link === '/package-distribution/pages/dis-center/dis-center') { // 用户跳转去分销中心
            const res = await isSaleMessage()
            if (res.state == 1) { // 说明此人是分销员
              uni.navigateTo({
                url: link
              })
            } else { // 否则该用户不是分销员
              if (res.recruitState == 1) { // 开启了邀请页
                uni.navigateTo({
                  url: '/package-distribution/pages/apply-dist/apply-dist'
                })
              } else if (res.recruitState == 0) { // 关闭开启页
                uni.navigateTo({
                  url: '/package-distribution/pages/apply-dist-con/apply-dist-con'
                })
              }
            }
          } else {
            if (link === '/pages/live-broadcast/live-broadcast') {
              uni.switchTab({
                url: link
              })
            } else {
              uni.navigateTo({
                url: link
              })
            }
          }
        })
      } else {
        if (link === '/package-shop/pages/feature-index/feature-index0') {
          const store = await getShopMessage(shopId)
          uni.navigateTo({
            url: '/package-shop/pages/feature-index/feature-index0?shopId=' + shopId + '&renovationId=' + store.renovationId
          })
        } else {
          // #ifndef MP-WEIXIN
          if (link === '/pages/live-broadcast/live-broadcast') {
            uni.showModal({
              title: '',
              showCancel: false,
              content: i18n.t('index.liveTips'),
              confirmText: i18n.t('index.gotIt'),
              confirmColor: '#F81A1A',
              success: () => {}
            })
            return
          }
          // #endif
          if (link === '/pages/user/user' || link === '/pages/live-broadcast/live-broadcast' || link === '/pages/basket/basket' || link === '/') {
            uni.switchTab({
              url: link
            })
          } else {
            uni.navigateTo({
              url: link
            })
          }
        }
      }
      break
    case '5': // 跳转到微页面
      uni.navigateTo({
        url: '/package-prod/pages/feature-index/feature-index0?renovationId=' + link + '&shopId=' + shopId
      })
      break
    case '6': // 跳转到自定义链接
      newUrl = link.url || link
      if (newUrl === '/') return
      const reg1 = /^\//
      const reg2 = /^(http|https)/
      if (reg1.test(newUrl)) { // 如果是以 / 开头
        let isStatus = false
        uni.navigateTo({
          url: newUrl,
          success: function(res) {},
          fail: function() {},
          complete: function(val) {
            if (val.path == '/') {
              isStatus = true
            }
          }
        })
        setTimeout(() => {
          if (isStatus) {
            uni.showToast({
              icon: 'error',
              title: '跳转链接异常'
            })
          }
        }, 100)
      } else if (reg2.test(newUrl)) { // 否则以http开头
        // #ifdef H5
        location.href = newUrl
        // #endif
        // #ifdef MP-WEIXIN
        const url = encodeURIComponent(newUrl)
        uni.navigateTo({
          url: '/package-prod/pages/web-view/web-view?url=' + url
        })
        // #endif
        // #ifdef APP-PLUS
        plus.runtime.openURL(newUrl)
        // #endif
      } else {
        uni.showToast({
          icon: 'error',
          title: '跳转链接异常'
        })
      }
      break
    default:
      break
  }
}

const mobileLoginList = [ // 移动端需要登录页面
  '/package-user/pages/order-list/order-list',
  '/package-prod/pages/prod-classify/prod-classify?sts=5',
  '/package-member-integral/pages/integral-index/integral-index',
  '/package-member-integral/pages/member-index/member-index',
  '/package-distribution/pages/dis-center/dis-center'
]

// 设置当前的所展示的语言
const setLanguage = function() {
  const param = {
    url: '/sys/config/lang',
    method: 'GET',
    callBack: (res) => {
      console.log('首次加载设置语言')
      const { language, langItemList } = res
      const langList = langItemList.filter(f => !f.hide) // 过滤掉隐藏的语言
      const bbcLang = uni.getStorageSync('bbcLang')
      // 当前语言存在语言列表中
      let isExist = false
      if (bbcLang) {
        for (const it of langList) {
          if (it.language === bbcLang) {
            isExist = true
            break
          }
        }
      }
      // 当前无缓存语言或当前缓存语言不在语言列表时
      if (!bbcLang || !isExist) {
        uni.setStorageSync('bbcLang', language)
      }
    }
  }
  http.request(param)
}

export const util = {
  getUrlKey,
  dateToTimestamp,
  formatTime,
  formatHtml,
  endOfStartTime,
  checkAuthInfo,
  checkPhoneNumber,
  checkUserName,
  throttle,
  getPageInfo,
  tapLog,
  getUuid,
  checkSameDay,
  tsToDate,
  checkIDCard,
  transTabbar,
  removeTabBadge,
  locationConversions,
  debounce,
  timeBeApart,
  initPayType,
  featureRoute,
  getSysPaySwitch,
  weChatLogin,
  loginSuccess,
  previousPage,
  refreshToken,
  checkPassword,
  initComboDelivery,
  getUniWebConfig,
  setRouteUrlAfterLogin,
  lessThan2M,
  toHomePage,
  toRedirectLink,
  area,
  setLanguage
}

module.exports = util
