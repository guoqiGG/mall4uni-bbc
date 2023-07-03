/*
 * Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.
 *
 * https://www.mall4j.com/
 *
 * 未经允许，不可做商业用途！
 *
 * 版权所有，侵权必究！
 */

import { util } from './util.js'
const config = require('./config.js') // 统一的网络请求方法
import {
  AppType
} from './constant.js'

import i18n from '../main.js'
let loadingTimer, isShowLoad
function request(params) {
  // 全局变量
  var globalData = getApp().globalData
  // 默认全局 loading
  // 如需自定义请求loading, 将 params.selfLoading 设置为 true;  (e.g 提交秒杀订单)
  if (globalData.currentReqCounts === 0 && !params.selfLoading) {
    loadingTimer = setTimeout(() => {
      clearTimeout(loadingTimer)
      isShowLoad = true
      uni.showLoading()
    }, 500)
  }
  globalData.currentReqCounts++
  // 刷新token
  if (!params.login && !globalData.isLanding && !params.isRefreshing) {
    params = util.refreshToken(params)
  }
  // 如果正在进行登陆，就将非登陆请求放在队列中等待登陆完毕后进行调用
  const appType = uni.getStorageSync('bbcAppType')
  if ((appType === AppType.MP || appType === AppType.MINI) &&
				!params.login && globalData.isLanding && !params.isRefreshing) {
    globalData.requestQueue.push(params)
    clearTimeout(loadingTimer)
    uni.hideLoading()
    return
  }
  if (Object.prototype.toString.call(params.data) == '[object Array]') {
    params.data = JSON.stringify(params.data)
  } else if (Object.prototype.toString.call(params.data) == '[object Number]') {
    params.data = params.data + ''
  }

  uni.request({
    url: (params.domain ? params.domain : config.domain) + params.url,
    // 接口请求地址
    data: params.data,
    header: {
      // 'content-type': params.method == "GET" ? 'application/x-www-form-urlencoded' : 'application/json;charset=utf-8',
      'Authorization': uni.getStorageSync('bbcToken'),
      'locale': uni.getStorageSync('bbcLang') || 'zh_CN'
    },
    method: params.method == undefined ? 'POST' : params.method,
    dataType: 'json',
    responseType: params.responseType == undefined ? 'text' : params.responseType,
    success: (res) => {
      // 隐藏loading加载，放在最前面，防止真机小程序showToast显示时间太短问题
      hideLoad(globalData)
      const responseData = res.data
      // 请求小程序码
      if (params.responseType === 'arraybuffer' && res.statusCode === 200) {
        if (params.callBack) {
          params.callBack(responseData)
        }
        return
      }

      // 00000 请求成功
      if (responseData.code === '00000') {
        if (params.callBack) {
          params.callBack(responseData.data)
        }
        return
      }

      // A00004 未授权
      if (responseData.code === 'A00004') {
        // 重设登录后跳转地址
        util.setRouteUrlAfterLogin()
        uni.removeStorageSync('bbcLoginResult')
        uni.removeStorageSync('bbcToken')
        uni.removeStorageSync('bbcHadBindUser')
        uni.removeStorageSync('bbcCode')
        uni.removeStorageSync('bbcUserInfo')
        uni.removeStorageSync('bbcExpiresTimeStamp')
        if (!params.dontTrunLogin && !getApp().globalData.showLoginExpired) {
          getApp().globalData.showLoginExpired = true
          uni.showModal({
            title: i18n.t('index.tips'),
            content: uni.getStorageSync('bbcHadLogin') ? i18n.t('index.loginExpired') : i18n.t('index.loginPlease'),
            cancelText: i18n.t('index.cancel'),
            confirmText: i18n.t('index.confirm'),
            success: res => {
              if (res.confirm) {
                getApp().globalData.showLoginExpired = false
                uni.redirectTo({
                  url: '/pages/user-login/user-login'
                })
              } else {
                getApp().globalData.showLoginExpired = false
                const router = getCurrentPages()
                if (router[0].route === 'pages/basket/basket') {
                  util.toHomePage()
                } else {
                  uni.navigateBack(0)
                }
              }
            }
          })
        }
        if (params.errCallBack) {
          params.errCallBack(responseData)
        }
        return
      }

      // A00005 服务器出了点小差
      if (responseData.code === 'A00005') {
        console.error('============== 请求异常 ==============')
        console.log('接口: ', params.url)
        console.log('异常信息: ', responseData)
        console.error('============== 请求异常 ==============')
        if (params.errCallBack) {
          params.errCallBack(responseData)
          return
        }
        uni.showToast({
          title: '服务器出了点小差~',
          icon: 'none'
        })
      }

      // A00001 用于直接显示提示用户的错误，内容由输入内容决定
      if (responseData.code === 'A00001') {
        if (params.errCallBack) {
          params.errCallBack(responseData)
          return
        }
        uni.showToast({
          title: responseData.msg || 'Error',
          icon: 'none'
        })
        return
      }

      // 其他异常
      if (responseData.code !== '00000') {
        // console.log('params', params)

        if (params.errCallBack) {
          params.errCallBack(responseData)
        } else {
          console.log(`接口: ${params.url}`)
          console.log(`返回信息： `, res)
        }
      }
    },
    fail: (err) => {
      // 隐藏loading加载，放在最前面，防止真机小程序showToast显示时间太短问题
      hideLoad(globalData)
      if (err.errMsg == 'request:fail abort') {
        console.log('请求被取消啦~')
        return
      }
      setTimeout(() => {
        uni.showToast({
          title: i18n.t('index.serverWrong'),
          icon: 'none'
        })
      }, 1)
    },
    complete: (res) => {
      // const resCode = res.data.code
      // globalData.currentReqCounts--
      // if (globalData.currentReqCounts === 0 && !params.selfLoading) {
      //   clearTimeout(loadingTimer)
      //   uni.hideLoading()
      // }
    }
  })
}
function hideLoad(globalData) {
  globalData.currentReqCounts--
  if (globalData.currentReqCounts === 0) {
    clearTimeout(loadingTimer)
    isShowLoad && uni.hideLoading()
    isShowLoad = false
  }
}

/**
 * 上传文件统一接口
 */
function upload(params) {
  console.log(params)
  wx.uploadFile({
    url: config.domain + params.url,
    filePath: params.filePath,
    name: params.name,
    header: {
      'Authorization': params.login ? undefined : wx.getStorageSync('bbcToken'),
    },
    dataType: 'json',
    responseType: params.responseType == undefined ? 'json' : params.responseType,
    success: (res) => {
      const responseData = JSON.parse(res.data)
      if (responseData.code === '00000') {
        if (params.callBack) {
          params.callBack(responseData.data)
        }
      } else {
        uni.showToast({
          title: i18n.t('index.serverWrong'),
          icon: 'none'
        })
      }
    },
    fail: function() {
      uni.hideLoading()
    }
  })
}

// 更新用户头像昵称
function updateUserInfo() {
  wx.getUserInfo({
    success: res => {
      var userInfo = JSON.parse(res.rawData)
      request({
        url: '/p/user/setUserInfo',
        method: 'PUT',
        data: {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName
        }
      })
    }
  })
}

/**
 * 获取购物车商品数量
 */
function getCartCount() {
  if (!wx.getStorageSync('bbcToken')) {
    util.removeTabBadge()
    return
  }
  const params = {
    url: '/p/shopCart/prodCount',
    method: 'GET',
    dontTrunLogin: true,
    data: {},
    callBack: function(res) {
      if (res > 0) {
        let pl = ''
        // #ifdef MP-WEIXIN
        pl = 'mp'
        // #endif
        wx.setTabBarBadge({
          index: pl == 'mp' ? 2 : 2,
          text: res > 99 ? '99+' : res + ''
        })
        const app = getApp().globalData
        app.totalCartCount = res
      } else {
        util.removeTabBadge()
        const app = getApp().globalData
        app.totalCartCount = 0
      }
    }
  }
  request(params)
}

function isUserAuthInfo() {
  // 查看是否授权
  wx.getSetting({
    success(res) {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        wx.getUserInfo({
          success: function(res) {
            console.log(res.userInfo)
          }
        })
      }
    }
  })
}

function mpAuthLogin(page, needCode) {
  // 在微信环境打开,请求公众号网页登陆
  var redirectUrl = null

  if (!page || page === config.domainAddress) {
    redirectUrl = window.location.href
  } else {
    redirectUrl = config.domainAddress + page
  }
  var scope = 'snsapi_userinfo'
  window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + config.mpAppId +
		'&redirect_uri=' +
		encodeURIComponent(redirectUrl) + '&response_type=code&scope=' + scope + '&state=' + (needCode ? 'needCode'
    : 'unNeedCode') +
    '#wechat_redirect'
}

/**
 * 用户操作记录
 */
var saveLog = function(flowData, visitType) {
  var flowAnalysisLogDto = Object.assign(flowData)
  flowAnalysisLogDto.visitType = visitType
  const params = {
    url: uni.getStorageSync('bbcToken') ? '/p/flowAnalysisLog' : '/flowAnalysisLog',
    dontTrunLogin: true,
    method: 'POST',
    data: flowAnalysisLogDto,
    callBack: () => {}
  }
  request(params)
}

exports.request = request
exports.getCartCount = getCartCount
exports.updateUserInfo = updateUserInfo
exports.upload = upload
exports.mpAuthLogin = mpAuthLogin
exports.saveLog = saveLog
exports.isUserAuthInfo = isUserAuthInfo
