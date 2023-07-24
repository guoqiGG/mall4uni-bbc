<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j index-stytle">
    <!-- 骨架屏 -->
    <!-- #ifndef H5-->
    <navigationBar v-if="navigationBarIsShow" bg-color="bg-gradual-pink" :show-back="false"
      :navigation-bar-style="tabConfig" :is-left="false" :is-bg-img="isBgImg" :title="title" />
    <!-- #endif -->
    <view v-if="showScreen" class="screen">
      <view class="screen-bg-sear" />
      <view class="screen-swiper" />
      <view class="screen-cat-item">
        <view v-for="item in 5" :key="item" class="item" />
      </view>
      <view v-for="item in 4" :key="item" class="screen-more" />
    </view>
    <!-- 骨架屏 end -->

    <view v-if="!renovationId" class="container">

      <!-- 导航&公告 -->
      <view :class="['content']">
        <!-- 消息播放 -->
        <view style="display:block; padding-top: 26rpx;height:280rpx;background:#005AFF;">
          <view v-if="news.title" class="message-play">
            <image src="/static/images/icon/horn.png" class="hornpng" />
            <view class="scroll-news-content" :style="'transform: translateX(' + move + 'px);'">
              <view class="news-content">
                <view class="content"> {{ news.title }}</view>
                <view class="content" v-html="news.content"></view>
              </view>
            </view>
            <!-- <text class="arrow" /> -->
          </view>
        </view>
        <!-- 消息播放end -->
        <!-- swiper -->
        <swiper v-if="indexImgs.length" circular="true" :autoplay="autoplay" :indicator-color="indicatorColor"
          :interval="interval" :duration="duration" :indicator-active-color="indicatorActiveColor" class="card-swiper"
          indicator-dots>
          <block v-for="(item, seq) in indexImgs" :key="seq">
            <swiper-item class="banner-item">
              <view class="img-box">
                <ImgShow :src="item.imgUrl" :classList="['banner']" @handleTap="() => toIndexImgContent(item)" />
              </view>
            </swiper-item>
          </block>
        </swiper>
        <!-- end swiper -->
        <!-- 板块 -->
        <view class="cat-item">
          <view class="item" @tap="toMemberInteral">
            <view class="item-title">青春豆兑换区</view>
            <view class="item-desc">福利多多</view>
            <view class="item-go">
              <view>GO</view>
              <view class="image">
                <image src="/static/images/icon/spring-bean-exchange-arrow.png" />
              </view>
            </view>
            <image src="/static/images/icon/spring-bean-exchange.png" />
          </view>
          <view class="item" @tap="toPointsCenter">
            <view class="item-title">签到</view>
            <view class="item-desc">签到有礼</view>
            <view class="item-go">
              <view style="color:#FE8103;">GO</view>
              <view class="image">
                <image src="/static/images/icon/check-in-arrow.png" />
              </view>
            </view>
            <image src="/static/images/icon/check-in.png" />
            <view class="watch-time">{{ signTime >= 50 ? '已签到' : ('今日观看直播' + watchTime + '分' + watchSecond + '秒') }}
            </view>
          </view>
        </view>
        <!-- 板块end -->
      </view>

      <view v-if="liveBroadcastList.length > 0" :style="liveBroadcastList.length > 0 ? 'padding-bottom:10rpx;' : ''">
        <view class="live-title">
          直播列表
        </view>
        <view class="live-container">
          <view v-for="(item, index) in liveBroadcastList" :key="index" :data-roomid="item.roomId"
            :data-anchorwechat="item.anchorWechat" :data-roomStatus="item.liveStatus" @tap="toLivePage">
            <view class="live-item">
              <view class="live-left">
                <image class="image"
                  :src="item.coverImg.includes('http') ? item.coverImg : 'http://img.zzqct.com/shop/' + item.coverImg"
                  mode="aspectFill"></image>
                <view :class="['b-situation', 'bg-white', item.liveStatus == 101 ? 'on-live' : 'no-live']">
                  <image class="like-icon" src="/static/images/icon/icon-live.png"></image>
                  <view class="b-processing"><text class="state">{{
                    item.liveStatus == 101 ? i18n.liveing : item.liveStatus == 102 ? i18n.notStarted : item.liveStatus
                      ==
                      103
                      ? i18n.finished : item.liveStatus == 104 ? i18n.noBroadcasting : item.liveStatus == 105 ?
                        i18n.suspend
                        :
                        item.liveStatus == 106 ? i18n.abnormal : item.liveStatus == 107 ? i18n.expired : ''
                  }}</text></view>
                </view>
                <view :class="['like', 'bg-white', item.liveStatus == 101 ? 'on-live' : 'no-live']">
                  <image class="like-icon" src="/static/images/icon/icon-product.png"></image>
                  <view class="like-num" style="color:ff0000;opacity:1;"> 商品99+</view>
                </view>
              </view>
              <view class="live-right">
                <view class="top">
                  <image class="image"
                    :src="item.feedsImg.includes('http') ? item.feedsImg : 'http://img.zzqct.com/shop/' + item.feedsImg"
                    mode="aspectFill"></image>
                </view>
                <view class="bottom">
                  <image class="image"
                    :src="item.shareImg.includes('http') ? item.shareImg : 'http://img.zzqct.com/shop/' + item.shareImg"
                    mode="aspectFill"></image>
                </view>
              </view>
            </view>
            <view v-if="index < liveBroadcastList.length - 1" class="item-center-line"></view>

          </view>
        </view>
      </view>
      <!-- 回到顶部 -->
      <!-- <back-top-btn v-if="showBacktop" /> -->
      <!-- <privacy-pop v-if="showPop" @hidePop="hidePop" /> -->
    </view>
    <view class="kefu" @tap="gotoChat">
      <image src="/static/images/icon/kefu.png" />
    </view>
    <!-- 空列表或加载全部提示 -->
    <!-- <EmptyAllTips v-if="isLoaded" :isEmpty="!liveBroadcastList.length" :emptyTips="i18n.liveBroadcastTips"
      :isAll="liveBroadcastList.length > 5 && loadAll" /> -->
  </view>
</template>

<script>
// index.js
// 获取应用实例
const http = require('@/utils/http.js')
// const config = require('../../utils/config.js')
const util = require('@/utils/util.js')
// const app = getApp().globalData
import backTopBtn from '@/components/back-top-btn/index.vue'
import feature from '@/components/feature/index/index.vue'
import privacyPop from '@/components/privacy-pop/index.vue'
import navigationBar from '@/components/navigation-bar/index.vue'
// const updateManager = wx.getUpdateManager();

export default {
  components: {
    backTopBtn,
    feature,
    privacyPop,
    navigationBar
  },
  props: {},
  data() {
    return {
      navigationBarIsShow: false,

      indicatorDots: true,
      indicatorColor: '#d1e5fb',
      indicatorActiveColor: '#1b7dec',
      autoplay: true,
      interval: 3000,
      duration: 1000,
      indexImgs: [],
      seq: 0,
      news: [],
      hotSalesList: [],
      sts: 0,
      current: 1,
      sort: 1,
      isAll: false,
      snapUpList: [],
      // 秒杀列表
      aBulkList: [], // 团购列表
      pages: '',
      scrollTop: '',
      showBacktop: false,

      // 装修
      pageLoad: false,
      renovationId: '', // 页面id
      shopId: '',
      pageScorllTop: 0, // 页面滚动距离
      platformHomePage: '',
      uniLoginLogoImg: uni.getStorageSync('bbcUniLoginLogoImg'),
      showScreen: true, // 骨架屏的显隐
      showPop: false,
      bgImg: '',
      tabConfig: {
        background: '#005AFF',
        fontColor: '#FFFFFF',
        iconColor: '#FFFFFF'
      },
      title: '氢春态欢乐团',
      isBgImg: false,
      titleTextColor: '#ffffff',
      prodTypeArr: [],
      isLoaded: false,
      scene: '',
      watchTime: '00',
      sign: wx.getStorageSync('sign'),
      watchSecond: '00',
      signTime: 0,
      size: 10,
      pages: 1,
      searchType: 1, // searchType 搜索类型 1.搜索直播间信息 2搜索商品名
      searchKey: '', // 搜索key
      prodId: '', // 商品id（商品详情页跳转列表时）
      liveBroadcastList: [],
      timer: null,//计时器,
      isWechat: false, // 是否为微信环境
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  created() {
    const res = wx.getSystemInfoSync()
    if (res['system'].toString().indexOf('Windows') < 0) {
      this.navigationBarIsShow = true
    }
    this.prodTypeArr = [
      this.i18n.prodType1,
      this.i18n.prodType2,
      this.i18n.prodType3,
      this.i18n.prodType4
    ]
  },
  onLoad: function (options) {
    // #ifdef H5
    this.isWechat = Wechat.isWechat()
    // #endif
    // #ifdef APP-PLUS
    this.isWechat = false
    // #endif
    // #ifdef MP-WEIXIN
    this.isWechat = true
    // #endif
    uni.showNavigationBarLoading()
    util.transTabbar()
    // 获取装修数据
    this.getFeatureIndex()
    // 加载分销员推广
    if (this.$Route.query.scene) {
      http.request({
        url: `/p/distribution/register/bindUser/${this.$Route.query.scene}`,
        method: 'POST',
        callBack: (res) => {
          uni.showToast({
            title: '邀请成功',
            icon: 'none',
          })
        }
      })
    }
    // #ifdef APP-PLUS
    if (
      !uni.getStorageSync('bbcIsPrivacy') ||
      uni.getStorageSync('bbcIsPrivacy') === -1
    ) {
      uni.hideTabBar()
      this.showPop = true
    }
    // #endif
  },
  onShow: function () {
    this.clear()
    // #ifndef H5
    var logData = uni.getStorageSync('bbcFlowAnalysisLogDto')
    uni.setStorageSync('bbcStep', uni.getStorageSync('bbcStep') / 1 + 1)
    if ((logData && logData.pageId != 1) || uni.getStorageSync('bbcStep') == 1) {
      logData.pageId = 1
      logData.step = uni.getStorageSync('bbcStep')
      uni.setStorageSync('bbcFlowAnalysisLogDto', logData)
      http.saveLog(logData, 1)
    }
    // #endif
    http.getCartCount() // 重新计算购物车总数量
    this.queryLiveList()
    this.getSignTime() // 直播间签到的时长
    this.queryUserInfo() // 获取用户信息
  },
  onUnload() {
    this.clear()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.renovationId) {
      this.$refs.featureIndex.getNextPage()
    } else {
      this.getNextPage()
    }
  },
  onPullDownRefresh: function () {
    // 模拟加载
    this.current = 1
    setTimeout(() => {
      this.getFeatureIndex()
      this.queryLiveList()
      wx.stopPullDownRefresh() // 停止下拉刷新
    }, 100)
  },
  onShareAppMessage: function (e) {
    return {
      path: 'pages/index/index'
    }
  },

  // 页面滚动到指定位置指定元素固定在顶部
  onPageScroll: function (e) {
    this.scrollTop = e.scrollTop
    this.pageScorllTop = e.scrollTop
    if (this.scrollTop > 800) {
      this.setData({
        showBacktop: true
      })
    } else if (this.scrollTop < 800) {
      this.setData({
        showBacktop: false
      })
    }
  },
  methods: {
    hidePop() {
      this.showPop = false
      uni.showTabBar()
    },
    /**
     * 获取装修页面数据
     */
    getFeatureIndex() {
      http.request({
        url: '/shopRenovation/getHomePage',
        method: 'GET',
        callBack: (res) => {
          if (res && res.homeStatus === 1 && res.renovationType === 2) {
            this.renovationId ? this.$refs.featureIndex.getPageInfoById() : ''
            this.renovationId = res.renovationId
            this.shopId = res.shopId
          } else {
            this.renovationId = ''
            this.getAllData()
            uni.setNavigationBarTitle({
              // title: this.i18n.yamiMultiStore
              title: '氢春态欢乐团'
            })

            // 头部标题
            this.title = '氢春态欢乐团'
          }
          this.showScreen = false
          if (!this.renovationId) {
            this.tabConfig = {
              background: '#005AFF',
              fontColor: '#FFFFFF',
              iconColor: '#FFFFFF'
            }
            this.isBgImg = false
          }
        }
      })
      uni.hideNavigationBarLoading()
    },
    // 页面加载回调
    pageLoaded(e) {
      uni.setNavigationBarTitle({
        title: e.detail.title
      })
      this.bgImg = e.detail.bgImg
      this.title = '氢春态欢乐团'
      // 头部标题
      this.titleTextColor = e.detail.textColor || '#ffffff'
      this.tabConfig.fontColor = this.titleTextColor || '#ffffff'
      if (e.detail.bgType) {
        if (this.bgImg) {
          this.tabConfig = {
            backgroundImage: `url(${this.bgImg})`,
            background: e.detail.bgColor || '#005AFF',
            fontColor: this.titleTextColor,
            iconColor: '#FFFFFF'
          }
          this.isBgImg = true
        } else {
          this.isBgImg = false
        }
      } else {
        this.isBgImg = false
        this.tabConfig = {
          backgroundImage: `url(${this.bgImg})`,
          background: e.detail.bgColor || '#005AFF',
          fontColor: this.titleTextColor,
          iconColor: '#FFFFFF'
        }
      }
      // 设置导航栏字体的颜色
      uni.setNavigationBarColor({
        frontColor: this.titleTextColor,
        backgroundColor: '#005AFF',
        complete: (res) => { }
      })
    },
    toCouponCenter: function () {
      uni.navigateTo({
        url: '/package-activities/pages/coupon-center/coupon-center'
      })
    },
    // 跳转公告列表页面
    onNewsPage: function () {
      uni.navigateTo({
        url: '/package-user/pages/recent-news/recent-news'
      })
    },
    getAllData() {
      this.getIndexImgs()
      this.getNoticeList()
      // this.getHotSalesProds()
      // this.getSnapUpList()
      // this.getAbulk()
    },
    // 加载轮播图
    getIndexImgs() {
      // 加载轮播图
      const params = {
        url: '/indexImgs/0',
        method: 'GET',
        data: {},
        callBack: (res) => {
          this.setData({
            indexImgs: res || [],
            seq: res
          })
        }
      }
      http.request(params)
    },

    getNoticeList() {
      let path = '/notice/topNoticeList/0'
      if (uni.getStorageSync('bbcToken')) {
        path = '/p/notice/topNoticeList/0'
      }
      // 加载公告
      const params = {
        url: path,
        method: 'GET',
        callBack: (res) => {
          if (res.length > 0) {
            let path = '/notice/info/'
            if (uni.getStorageSync('bbcToken')) {
              path = '/p/notice/info/'
            }
            // 加载公告详情
            const params = {
              url: path + res[0].id,
              method: 'GET',
              callBack: res1 => {
                // console.log(res1)
                // if (res1.content) {
                //   res1.content = util.formatHtml(res1.content)
                //   console.log(res1.content)
                // }
                this.setData({
                  news: res1 || {}
                })
              }
            }
            http.request(params)
          }
          // this.setData({
          //   news: res || []
          // })
        }
      }
      http.request(params)
    },
    // 触底加载下一页
    getNextPage() {
      if (this.pages > this.current) {
        this.setData({
          current: this.current + 1
        })
        // this.getHotSalesProds()
        this.queryLiveList()
      } else {
        this.setData({
          isAll: true
        })
      }
    },
    /**
     * 图片加载失败时显示默认图片
     */
    handlePicError(item) {
      this.$set(item, 'isPicError', true)
    },
    /**
   * 跳转到和客服聊天的界面
   */
    gotoChat() {
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-user/pages/chat/chat-im?shopId=0'
        })
      })
    },
    // 青春豆中心
    toPointsCenter: function () {
      // util.tapLog(3)
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-member-integral/pages/member-index/member-index'
        })
      })
    },
    /**
       * 跳转青春豆中心
       */
    toMemberInteral() {
      // util.tapLog(3)
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-member-integral/pages/integral-index/integral-index'
        })
      })
    },
    // 获取直播间列表
    queryLiveList: function () {
      this.isLoaded = false
      const params = {
        url: '/live/liveRoom/page',
        method: 'GET',
        data: {
          name: this.searchKey,
          searchType: this.searchType,
          current: this.current,
          size: 2,
          prodId: this.prodId
        },
        callBack: (res) => {
          this.isLoaded = true
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
    /**
      * 前往直播页面
      */
    toLivePage: function (e) {
      util.checkAuthInfo(() => {
        this.roomId = e.currentTarget.dataset.roomid // 填写具体的房间号
        this.url = e.currentTarget.dataset.url
        // this.anchorwechat = e.currentTarget.dataset.anchorwechat
        wx.setStorageSync('liveStatus', e.currentTarget.dataset.roomstatus)
        util.checkAuthInfo(this.toLivePlayer)
      })
    },
    toLivePlayer: function () {
      const roomId = this.roomId
      const url = this.url
      if (uni.getStorageSync('sign')) {
        uni.removeStorageSync('sign')
      }
      if (this.isWechat) {
        // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取
        const customParams = encodeURIComponent(JSON.stringify({
          path: url
        }))

        if (this.roomid !== wx.getStorageSync('liveRoomId')) {
          this.clear()
        }
        wx.setStorageSync('liveRoomId', roomId)
        if (wx.getStorageSync('liveStatus') == 101) {
          let aa = wx.getStorageSync('isWatchTime')
          console.log('已观看时长', aa)
          this.timer = setInterval(() => {
            aa += 1
            if (aa > uni.getStorageSync('signTime')) {
              console.log('签到')
              if (!uni.getStorageSync('sign')) {
                this.userSign()
              }
            }
            if (aa % 60 == 0) {
              console.log('插入签到')
              this.watchTimes()
              this.watchSecond = '00'
            }
            if (aa % 60 !== 0) {
              let bb = (aa % 60).toString().length == 1 ? '0' + (aa % 60).toString() : (aa % 60).toString()
              this.watchSecond = bb
              console.log('已观看时长', bb)
            }
          }, 1000)
        }
        wx.navigateTo({
          url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}&open_share_ticket=1`
        }) // 其中wx2b03c6e691cd7370是直播组件appid不能修改
      } else {
        uni.showToast({
          title: this.i18n.pleaseOpenInWechat,
          icon: 'none'
        })
      }
    },
    // 获取直播签到时长限制
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
    // 签到
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
    // 插入观看时间
    watchTimes() {
      const params = {
        url: '/live/liveRoom/putRealTime',
        method: 'POST',
        data: {
          userId: wx.getStorageSync('userID'), // 用户ID
          liveRoomId: wx.getStorageSync('liveRoomId'), // 房间ID
        },
        callBack: (res) => {
          if (res) {
            console.log('插入成功')
          }
        }
      }
      http.request(params)
    },
    // 获取用户信息
    queryUserInfo: function () {
      const params = {
        url: '/p/user/userInfo',
        method: 'GET',
        data: {},
        dontTrunLogin: true,
        callBack: (res) => {
          uni.setStorageSync('bbcUserInfo', res)
          uni.setStorageSync('userID', res.userId)
          this.getUserWatchTime()
        }
      }
      http.request(params)
    },
    //  获取用户观看直播时间
    getUserWatchTime: function () {
      const params = {
        url: '/live/liveRoom/getRealTime',
        method: 'GET',
        data: {
          userId: wx.getStorageSync('userID')
        },
        callBack: (res) => {
          wx.setStorageSync('isWatchTime', Number(res) * 60)
          this.watchTime = res.length > 1 ? res : '0' + res.toString()
        }
      }
      http.request(params)
    },
    // 清除计时器 
    clear: function () {
      clearInterval(this.timer)
      this.timer = null
    },
  }
}
</script>
<style>
@import './index.css';
</style>
