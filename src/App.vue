<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<script>
// app.js
const util = require('./utils/util.js')
const http = require('@/utils/http.js')
import { AppType } from './utils/constant.js'
import Vue from 'vue'
let livePlayer = requirePlugin('live-player-plugin')
export default {
  onLaunch: function (options) {
    console.log('mall4j.v230327')
    // #ifdef H5
    uni.getSystemInfo({
      success: function (res) {
        // 客户端平台，值域为：ios、android
        if (res.platform == 'ios') {
          uni.setStorageSync('bbcIosUrl', window.location.href.split('#')[0])
        }
      }
    })
    // 判断浏览器环境
    var ua = navigator.userAgent.toLowerCase()
    if (ua.search(/MicroMessenger/i) > -1 && !uni.getStorageSync('bbcAppType')) {
      // 微信环境
      uni.setStorageSync('bbcAppType', AppType.MP)
    } else if (ua.search(/Alipay/i) > -1 && !uni.getStorageSync('bbcAppType')) {
      // 支付宝环境
      uni.setStorageSync('bbcAppType', AppType.ALI)
    } else {
      if (!uni.getStorageSync('bbcAppType')) {
        uni.setStorageSync('bbcAppType', AppType.H5)
      }
    }
    // #endif
    // #ifdef APP-PLUS
    // APP模式下保持竖屏
    plus.screen.lockOrientation('portrait-primary')
    uni.getSystemInfo({
      success: (sysInfo) => {
        if (sysInfo.platform == 'android') {
          uni.setStorageSync('bbcAppType', AppType.ANDROID)
        } else {
          uni.setStorageSync('bbcAppType', AppType.IOS)
        }
      }
    })
    // #endif

    // 设置当前的展示语言
    util.setLanguage()

    // #ifdef MP-WEIXIN
    uni.setStorageSync('bbcAppType', AppType.MINI)
    // #endif

    // #ifdef MP-ALIPAY
    uni.setStorageSync('bbcAppType', AppType.ALI)
    // #endif

    // #ifdef MP-TOUTIAO
    uni.setStorageSync('bbcAppType', AppType.TTMINI)
    // #endif

    // 获取系统支付设置
    util.getSysPaySwitch()

    // 微信环境统一登录方法
    util.weChatLogin()

    // #ifdef MP-WEIXIN
    // 微信小程序检查升级
    this.checkMiniUpdate()
    // #endif

    // 初始加载获取配置
    util.getUniWebConfig()

    // #ifndef H5
    uni.getSystemInfo({
      success: function (res) {
        // px转换到rpx的比例
        const pxToRpxScale = 750 / res.windowWidth
        const systems = {
          ktxStatusHeight: res.statusBarHeight * pxToRpxScale, // 状态栏的高度
          navigationHeight: 44 * pxToRpxScale, // 导航栏的高度
          ktxWindowWidth: res.windowWidth * pxToRpxScale, // window的宽度
          ktxWindowHeight: res.windowHeight * pxToRpxScale, // window的高度
          ktxScreentHeight: res.screenHeight * pxToRpxScale // 屏幕的高度
        }
        Vue.prototype.$system = systems
        Vue.prototype.$lineHeight =
          systems.ktxStatusHeight + systems.navigationHeight
      }
    })
    // #endif
  },
  onShow: function (options) {
    // this.queryUserInfo() // 获取用户信息 
    // this.getSignTime() // 获取直播间签到时长限制
    // this.queryLiveList() // 获取直播间列表

    if (options.scene == 1007 || options.scene == 1008 || options.scene == 1044) {
      livePlayer.getShareParams()
        .then(res => {
          console.log('get room id', res);
          // 判断用户登录状态
          // if (!uni.getStorageSync('bbcToken')) return
          // // 判断房间状态
          // // 1.先获取房间列表 2.判断该房间直播状态 只有直播中才开始计时
          // if (this.globalData.liveBroadcastList.length) {
          //   this.globalData.liveBroadcastList
          //   this.globalData.liveBroadcastList = this.globalData.liveBroadcastList.filter(item => {
          //     return item.roomid == res.roomid
          //   })
          //   if (this.globalData.liveBroadcastList[0].status != 101) {
          //     return
          //   } else {
          //     // 开始计时
          //     let aa = wx.getStorageSync('isWatchTime')
          //     console.log('已观看时长', aa)
          //     this.timer = setInterval(() => {
          //       if (aa > uni.getStorageSync('signTime')) {
          //         console.log('签到')
          //         if (!uni.getStorageSync('sign')) {
          //           this.userSign()
          //         }
          //       }
          //       if (aa % 60 == 0) {
          //         console.log('插入签到')
          //         this.watchTimes()
          //         this.watchSecond = '00'
          //       }
          //       if (aa % 60 !== 0) {
          //         let bb = (aa % 60).toString().length == 1 ? '0' + (aa % 60).toString() : (aa % 60).toString()
          //         this.watchSecond = bb
          //         console.log('已观看时长', bb)
          //       }
          //     }, 1000)
          //   }
          // }
        })
    }
  },
  globalData: {
    // 定义全局请求队列
    requestQueue: [],
    // 是否正在进行登陆
    isLanding: false,
    // 购物车商品数量
    totalCartCount: 0,
    // 当前请求数量
    currentReqCounts: 0,
    // 当前是否已显示登录失效弹窗
    showLoginExpired: false,
    liveBroadcastList: []
  },
  methods: {
    // 获取直播间列表
    queryLiveList: function () {
      this.isLoaded = false
      const params = {
        url: '/live/liveRoom/page',
        method: 'GET',
        data: {
          searchType: 1,
          current: 1,
          size: 2
        },
        callBack: (res) => {
          var list = []
          if (res.current == 1) {
            list = res.records
          } else {
            list = this.liveBroadcastList
            list = list.concat(res.records)
          }
          this.liveBroadcastList = list
          this.pages = res.pages
          this.current = res.current
        }
      }
      http.request(params)
    },
    /* 签到 */
    userSign: function () {
      const params = {
        url: '/p/score/updateUserScore',
        method: 'GET',
        data: {
          bizId: wx.getStorageSync('liveRoomId')
        },
        callBack: (res) => {
          if (res) {
            wx.setStorageSync('sign', '签到成功')
          }
        }
      }
      http.request(params)
    },
    /* 插入观看时间 */
    watchTimes(roomid) {
      const params = {
        url: '/live/liveRoom/putRealTime',
        method: 'POST',
        data: {
          userId: wx.getStorageSync('userID'), // 用户ID
          roomId: roomid, // 房间ID
        },
        callBack: (res) => {
          if (res) {
            console.log('插入成功')
          }
        }
      }
      http.request(params)
    },
    /* 获取用户信息 */
    queryUserInfo: function () {
      const params = {
        url: '/p/user/userInfo',
        method: 'GET',
        data: {},
        dontTrunLogin: true,
        callBack: (res) => {
          uni.setStorageSync('bbcUserInfo', res)
          uni.setStorageSync('userID', res.userId)
          // this.getUserWatchTime()
        }
      }
      http.request(params)
    },
    /* 获取直播签到时长的限制 */
    getSignTime: function () {
      const params = {
        url: '/p/score/getViewTime',
        method: 'GET',
        callBack: (res) => {
          wx.setStorageSync('signTime', Number(res) * 60)
        }
      }
      http.request(params)
    },
    /**
     * 微信小程序检查升级
     */
    checkMiniUpdate() {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate)
      })

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })

      updateManager.onUpdateFailed(function () {
        // 新版本下载失败
        uni.showToast({
          title: '新版本下载失败,请重试',
          duration: 2000,
          icon: 'none'
        })
      })
    }
  },
}
</script>
<style>
@import "./app.css";
@import url('@/static/iconfont/iconfont.css');

/* 隐藏头部 */
uni-page-head {
  display: none;
}

/* 轮播图指示点 */
uni-swiper .uni-swiper-dots-horizontal {
  bottom: 20px !important;
}

/* 新增底部tab挡住左侧分类tab点击 */
.uni-tabbar-bottom {
  bottom: 0 !important;
}

/* 解决使用ImgShow组件小程序图片不显示问题 */
img-show {
  width: 100% !important;
  height: 100% !important;
}

.img-show-box {
  width: 100%;
  height: 100%;
}
</style>
