<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <!-- 自定义导航头 -->
    <!-- #ifndef H5-->
    <navigationBar v-if="navigationBarIsShow" :show-back="false" :navigation-bar-style="tabConfig" :is-left="false"
      :is-bg-img="isBgImg" :is-mine-page="true" :title="i18n.personalCenter" />
    <!-- #endif -->
    <view class="top-wrap">
      <view v-if="isAuthInfo" class="top-infor-wrap">
        <!-- 用户信息（登录） -->
        <view v-if="isAuthInfo" class="userinfo-wrap">
          <view class="left-infor">
            <!-- 头像 -->
            <view class="avatsr-con">
              <image class="avatsr" src="/static/images/icon/user-avatar-bg.png" mode="scaleToFill" />
              <image class="avatsr-bg" :src="userInfo.pic ? userInfo.pic : '/static/images/icon/head04.png'"
                mode="scaleToFill" @tap="toPersonalInformation" @error="imageError(userInfo, 'pic')" />
            </view>
            <view class="infor-wrap">
              <!-- 姓名 -->
              <view class="user-name" @tap="toPersonalInformation">
                {{ userInfo.nickName }}
              </view>
              <!-- vip称号 -->
              <view class="pay-vip-wrap menbers" @tap="toMemberCenter">
                <image class="user-grade-icon" src="/static/images/icon/normal-icon.png"></image>
                <text class="vip-txt">{{ userLevelInfo.levelName }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- end 用户信息 -->

      <!-- 未登录 -->
      <view v-else class="default-userinfor-wrap top-infor-wrap" style="margin-top:0;">
        <view class="left-infor">
          <!-- 头像 -->
          <view class="avatsr-con">
            <image class="avatsr-bg" style="margin-top:0;" src="/static/images/icon/head04.png" mode="scaleToFill"
              @tap="onGotUserInfo" />
          </view>
          <view class="sign-in-txt" @tap="onGotUserInfo">
            {{ i18n.loginNow }}
          </view>
        </view>
        <!-- 头像 end -->
      </view>
      <!-- 未登录 end -->
    </view>

    <!-- 钱包数据 -->
    <view v-if="isAuthInfo" class="wallet-wrap">
      <view class="cloumn-wrap">
        <view class="cloumn-item" @tap="toMyWallet">
          <view class="left-view">
            <image class="cloumn-item-img" src="/static/images/icon/user-blance.png" />
            <view class="infor-txt">我的{{ i18n.balance }}
            </view>

          </view>
          <view class="arr">
            <view class="numbers-txt">{{ totalBalance | millionNumber }}</view>
            <image src="/static/images/icon/arrow-right.png" />
          </view>
        </view>
        <view class="line"></view>
        <view class="cloumn-item" @tap="toInteralDetail">
          <view class="left-view">
            <image class="cloumn-item-img" src="/static/images/icon/user-bean.png" />
            <view class="infor-txt">{{ i18n.prodType4 }}
            </view>
          </view>

          <view class="arr">
            <view class="numbers-txt">{{ (userLevelInfo.score ? userLevelInfo.score : '0') | millionNumber }}</view>
            <image src="/static/images/icon/arrow-right.png" />
          </view>
        </view>
      </view>
    </view>
    <!-- 钱包数据 end -->
    <!-- 钱包数据 -->
    <view v-else class="wallet-wrap" @tap="onGotUserInfo">
      <view class="cloumn-wrap">
        <view class="cloumn-item">
          <view class="left-view">
            <image class="cloumn-item-img" src="/static/images/icon/user-blance.png" />
            <view class="infor-txt">我的{{ i18n.balance }}</view>
          </view>
          <view class="numbers-txt">-</view>
        </view>
        <view class="line"></view>
        <view class="cloumn-item">
          <view class="left-view">
            <image class="cloumn-item-img" src="/static/images/icon/user-bean.png" />
            <view class="infor-txt">{{ i18n.prodType4 }}</view>
          </view>
          <view class="numbers-txt">-</view>
        </view>
      </view>
    </view>
    <!-- 钱包数据 end -->
    <!-- 我的订单 -->
    <view class="my-order-wrap">
      <view class="top-title">
        <view class="title-left">{{ i18n.myOrder }}</view>
        <view class="title-right" data-sts="0" @tap="toOrderListPage">
          <text>{{ i18n.allOrder }}</text>
          <image src="/static/images/icon/arrow-right.png" />
        </view>
      </view>
      <view class="cloumn-wrap">
        <view class="cloumn-item" data-sts="1" @tap="toOrderListPage">
          <image class="item-img" src="/static/images/icon/icon_unpaid.png" />
          <view class="infor-txt">{{ i18n.toBePaid }}</view>
          <view v-if="orderAmount.unPay > 0" class="quantity-tip-dots">{{ orderAmount.unPay }}</view>
        </view>
        <view class="cloumn-item" data-sts="2" @tap="toOrderListPage">
          <image class="item-img" src="/static/images/icon/icon_delivery.png" />
          <view class="infor-txt">{{ i18n.toBeDelivered }}</view>
          <view v-if="orderAmount.payed > 0" class="quantity-tip-dots">{{ orderAmount.payed }}</view>
        </view>
        <view class="cloumn-item" data-sts="3" @tap="toOrderListPage">
          <image class="item-img" src="/static/images/icon/icon_logistics.png" />
          <view class="infor-txt">{{ i18n.toBeReceived }}</view>
          <view v-if="orderAmount.consignment > 0" class="quantity-tip-dots">{{ orderAmount.consignment }}</view>
        </view>
        <view class="cloumn-item" data-sts="5" @tap="toOrderListPage">
          <image class="item-img" src="/static/images/icon/icon_complete.png" />
          <view class="infor-txt">{{ i18n.complete }}</view>
        </view>
        <view class="cloumn-item" @tap="toAfterSalesPage">
          <image class="item-img" src="/static/images/icon/icon_refund.png" />
          <view class="infor-txt">{{ i18n.refundAfterSale }}</view>
          <view v-if="orderAmount.refund > 0" class="quantity-tip-dots">{{ orderAmount.refund }}</view>
        </view>
      </view>
    </view>
    <!-- end 我的订单 -->

    <!-- 我的当前自提点 -->
    <view class="my-pick-up-address">
      <view class="pick-up-title">{{ station.province ? '门店自提地址' : '自提地址' }}</view>
      <view class="pick-up-item" v-if="(station.province || address.province) && isAuthInfo">
        <view class="pick-up-info">
          <view class="station-name">{{ station.provience ? station.stationName : address.stationName }}</view>
          <view class="station-address">
            {{ station.province ? (station.province + station.city + station.area + station.addr) : (address.province
              +
              address.city + address.area + address.addr) }}
          </view>
          <view class="station-phone"><text style="color:#333;font-weight: bold;">电话:</text>{{ station.province ?
            ((station.phonePrefix ? (station.phonePrefix + '-') : '') + station.phone) : address.mobile }}
          </view>
        </view>
        <view class="address-icon"
          @tap="selectLoaction(station.provience ? station.lat : address.lat, station.provience ? station.lng : address.lng)">
          <image src="/static/images/icon/submit-address.png"></image>
          <view class="text">路线</view>
        </view>
      </view>
      <view class="pick-up-item" v-else>
        <view class="station-address">暂无自提信息</view>
      </view>
    </view>
    <!--end 我的当前自提点  -->

    <!-- 分销中心 & 青春豆商店 -->
    <view class="distribution-points-wrap">
      <view class="item" @tap="toDistCenter">
        <image class="img" src="/static/images/icon/distribution-center.png" />
        <text class="item-title">{{ isDistributionUserInfo ? '团长管理' : i18n.distributionUser }}</text>
        <text class="item-desc">{{ i18n.shareGet }}</text>
      </view>
      <view class="item" @tap="toMemberInteral">
        <image class="img" src="/static/images/icon/integral-mall.png" />
        <text class="item-title">{{ i18n.pointsMall }}</text>
        <text class="item-desc">{{ i18n.savePoints }}</text>
      </view>
    </view>
    <!-- end 分销中心 & 青春豆商店 -->

    <!-- 服务与工具 -->
    <view class="tools-wrap">
      <view class="title-txt">{{ i18n.servicesTools }}</view>
      <view class="cloumn-wrap">
        <view class="cloumn-item" @tap="toMyCouponPage">
          <image class="item-img" src="/static/images/icon/icon_youhui.png" />
          <view class="infor-txt">优惠券</view>
        </view>
        <view class="cloumn-item" @tap="toCouponCenter">
          <image class="item-img" src="/static/images/icon/icon_gift.png" />
          <view class="infor-txt">礼品券</view>
        </view>
        <view class="cloumn-item" @tap="toAddressList">
          <image class="item-img" src="/static/images/icon/icon_address.png" />
          <view class="infor-txt">{{ i18n.addressManagenment }}</view>
        </view>
        <view class="cloumn-item" @tap="toSystemSetUp">
          <image class="item-img" src="/static/images/icon/icon_set.png" />
          <view class="infor-txt">{{ i18n.systemSetup }}</view>
        </view>
      </view>
    </view>
    <!-- end 服务与工具 -->

    <!-- 为您推荐 -->
    <!-- <view v-if="hotSalesList.length != 0" class="recommend">
      <image class="before-img" src="/static/images/icon/decor-1.png" mode="widthFix" />
      <view class="title-txt">
        {{ i18n.RecommendedYou }}
      </view>
      <image class="after-img" src="/static/images/icon/decor-2.png" mode="widthFix" />
    </view> -->
    <!-- end 为您推荐 -->
    <!-- 推荐内容 -->
    <!-- <view v-if="hotSalesList.length != 0" class="recommend-products">
      <block v-for="(item, index) in hotSalesList" :key="index">
        <view class="column-item" @tap="toProdDetail(item.prodId)">
          <image v-if="item.pic && !item.isPicError" class="pro-img" :src="item.pic" mode="aspectFit"
            @error="handlePicError(item)" />
          <image v-else src="/static/images/icon/def.png" class="pro-img" mode="aspectFit" />

          <view class="pro-title">
            <text v-if="item.activityInProgress && item.prodType != 0" class="pro-activity-tag">
              {{ prodTypeArr[item.prodType] }}
            </text>
            <text class="pro-title-name">{{ item.prodName }}</text>
          </view>
          <view class="pro-tag">{{ item.brief || '' }}</view>
          <view class="pro-price">
            <text>￥</text>
            <text>{{ parsePrice(item.price)[0] }}</text>
            <text>.{{ parsePrice(item.price)[1] }}</text>
          </view>
        </view>
      </block>
    </view> -->
    <!-- <EmptyAllTips v-if="isLoaded" :isAll="current >= pages" :allTips="i18n.allLoaded2" /> -->
    <!-- 回到顶部 -->
    <view style="display:block; margin-top: 20rpx;height:1rpx;"></view>
    <back-top-btn v-if="showBacktop" />
  </view>
</template>

<script>
const config = require('@/utils/config.js')
const http = require('../../utils/http.js')
const util = require('../../utils/util.js')
import Wechat from '../../utils/wechat.js'
import backTopBtn from '@/components/back-top-btn/index.vue'
import navigationBar from '@/components/navigation-bar/index.vue'
export default {
  components: {
    navigationBar
  },
  filters: {
    millionNumber(val) {
      if (val) {
        const lang = uni.getStorageSync('bbcLang').indexOf('zh') === -1 ? 'en' : 'zh_CN'
        const value = val.toString().split('.')[0]
        if (value.length >= 5 && lang === 'zh_CN') {
          return value.slice(0, -4) + 'w+'
        } else if (value.length >= 4 && lang === 'en') {
          return value.slice(0, -3) + 'k+'
        }
      }
      return val
    }
  },
  data() {
    return {
      config: config,
      // 推荐商品
      hotSalesList: [],
      // 推荐商品页数
      current: 1,
      pages: 0,
      // 活动类型
      prodTypeArr: [],
      // 回到顶部
      showBacktop: false,
      // 距离顶部高度
      scrollTop: 0,

      isBgImg: false,
      tabConfig: {
        background: '#005AFF',
        fontColor: '#FFF',
        iconColor: '#FFF'
      },
      navigationBarIsShow: false,

      shopId: 0,
      orderAmount: {},
      sts: '',
      collectionCount: 0,
      // 分销开关
      canDistribution: true,
      isAuthInfo: false,
      // 店铺状态：0 未审核 1已通过 -1未通过 null 未开店
      shopAuditStatus: null,
      // 是否已经设置过支付密码
      isSetPassword: false,
      userLevelInfo: {},
      // 默认展示付费会员信息
      vipMarking: {},
      // 会员权益种类
      powerNumber: 0,
      // 会员到期剩余天数
      vipRemainingDay: '',
      // 店铺状态
      shopStatus: '',
      // 用户信息
      userInfo: {},
      // 消息数量
      messageCount: 0,
      // 优惠券数量
      couponNum: 0,
      // 用户青春豆
      score: 0,
      // 用户余额
      totalBalance: 0,
      notifyNum: 0,
      // 应用类型
      appType: uni.getStorageSync('bbcAppType'),
      isLoaded: false,
      isDistributionUserInfo: false,
      station: {},// 自提点信息
      address: {},//用户默认收货地址 近期使用/添加的一个
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

  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    util.transTabbar()
  },

  /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady: function () { },

  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    if (!uni.getStorageSync('bbcToken')) {
      uni.navigateTo({ url: 'pages/user-login/user-login' })
    }
    uni.setNavigationBarTitle({
      title: this.i18n.personalCenter
    })
    http.getCartCount()
    // #ifndef H5
    var logData = uni.getStorageSync('bbcFlowAnalysisLogDto')
    uni.setStorageSync('bbcStep', uni.getStorageSync('bbcStep') / 1 + 1)
    if (logData && logData.pageId != 12) {
      logData.pageId = 12
      logData.step = uni.getStorageSync('bbcStep')
      uni.setStorageSync('bbcFlowAnalysisLogDto', logData)
      http.saveLog(logData, 1)
    }
    // #endif
    // 热销商品推荐数据重置
    this.hotSalesList = []
    this.current = 1
    this.pages = 0
    // 排除影响，真实登陆后再请求数据
    if (uni.getStorageSync('bbcToken')) {
      this.isAuthInfo = true
      // 加载订单数据
      this.loadOrderCountFun()
      // 获取会员信息
      this.getUserLevelInfo()
      // 获取默认收费会员信息
      this.getUserLevelList()
      // 查询分销是否开启
      this.getDistInfo()
      // 查询用户信息
      this.queryUserInfo()
      // 获取用户消息
      this.getMyNotifyRemind()
      // 钱包数据
      this.queryUserData()
      // 查询所有的收藏量
      // this.showCollectionCount()
      // 查看用户是否是团长
      this.getIsDistributionUserInfo()
      // 获取用户收货地址
      this.getAddrList()
    } else {
      // this.getHotSalesProds() // 获取热销商品推荐
      this.isAuthInfo = false
      const emptyObj = {}
      this.setData({
        orderAmount: emptyObj,
        couponNum: 0, // 优惠券数量
        score: 0, // 用户青春豆
        totalBalance: 0, // 用户余额
        notifyNum: 0, // 消息提醒
        messageCount: 0,
        collectionCount: 0, // 总收藏数量
        isDistributionUserInfo: false,
        station: {}
      })
    }
  },

  /**
     * 生命周期函数--监听页面隐藏
     */
  onHide: function () { },

  /**
     * 生命周期函数--监听页面卸载
     */
  onUnload: function () { },

  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () { },

  /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {
    this.getNextPage()
  },

  /**
     * 用户点击右上角分享
     */
  onShareAppMessage: function () { },

  /**
     * 页面滚动到指定位置指定元素固定在顶部
     */
  onPageScroll: function (e) {
    this.scrollTop = e.scrollTop
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
    /**
   * 跳转到会员中心(当前成长值)
   */
    toMemberCenter: function () {
      uni.navigateTo({
        url: '/package-member-integral/pages/member-index/member-index'
      })
    },

    /**
    * 打开地图选择地址
    */
    selectLoaction(lat, lng) {
      uni.openLocation({
        type: 'gcj02',
        latitude: lat,
        longitude: lng,
        success: (res) => {
        },
        fail: () => {
        }
      })
    },
    /**
     * 商家入驻弹框
     */
    merchantInclusion() {
      uni.showModal({
        content: `${this.i18n.registerTxt}\r\n秦先生:${config.merchantPlatformUrl}`,
        showCancel: false,
        confirmColor: '#F81A1A',
        confirmText: this.i18n.copyUrl,
        success: ({ confirm, cancel }) => {
          // 复制网址
          uni.setClipboardData({
            data: config.merchantPlatformUrl,
            success: () => {
              uni.showToast({
                title: this.i18n.copySuccess,
                icon: 'none'
              })
            }
          })
        }
      })
    },
    /**
     * 触底加载推荐商品数据
     */
    getNextPage() {
      if (this.current >= this.pages) return
      ++this.current
      // this.getHotSalesProds()
    },
    /**
     * 跳转到商品详情页
     */
    toProdDetail: function (prodId) {
      util.tapLog(3)
      if (prodId) {
        this.$Router.push({
          path: '/package-prod/pages/prod/prod',
          query: {
            prodId
          }
        })
      }
    },
    /**
     * 加载推荐商品列表
     */
    getHotSalesProds() {
      const categoryId = uni.getStorageSync('bbcBrowseCategoryId')
      const userInfo = uni.getStorageSync('bbcUserInfo')
      let paramUrl = '/search/page'
      const paramData = {
        current: this.current,
        size: 20,
        userId: uni.getStorageSync('bbcUserInfo') ? uni.getStorageSync('bbcUserInfo').userId : ''
      }
      // prodRecommendation 0:关(新品推荐)  1:开(个性化推荐)
      if (userInfo && userInfo.prodRecommendation === 1) {
        paramUrl = '/prod/recommendList'
        paramData.categoryId = categoryId
      } else {
        paramData.sort = 21
      }
      this.isLoaded = false
      var param = {
        url: paramUrl,
        method: 'GET',
        data: paramData,
        callBack: (res) => {
          var hotSalesList = []
          if (res.records && res.records.length <= 0) return
          if (this.current === 1) {
            this.setData({
              hotSalesList: res.records[0].products,
              pages: res.pages
            })
          } else {
            hotSalesList = this.hotSalesList
            hotSalesList.push(...res.records[0].products)
            this.setData({
              hotSalesList
            })
          }
          this.isLoaded = true
        }
      }
      http.request(param)
    },
    /**
       * 获取未读消息数量
       */
    getMyNotifyRemind() {
      const params = {
        url: '/p/myNotifyLog/unReadCount',
        method: 'GET',
        dontTrunLogin: true,
        data: {},
        callBack: res => {
          if (uni.getStorageSync('bbcToken')) {
            this.setData({
              messageCount: res
            })
          }
        }
      }
      http.request(params)
    },
    /**
       * 跳转站内消息
       */
    toMyMessage() {
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-user/pages/message-platform/message-platform?tabType=0'
        })
      })
    },
    /**
       * 切换语言
       */
    changeLangs() {
      // const locale = uni.getStorageSync('bbcLang').indexOf('zh') !== -1 ? 'en' : 'zh_CN'
      // this._i18n.locale = locale
      // uni.setStorageSync('bbcLang', locale)
      // uni.setLocale(locale === 'en' ? locale : 'zh-Hans')
      uni.navigateTo({
        url: '/package-user/pages/lang/lang'
      })
    },
    /**
       * 钱包数据
       */
    queryUserData: function () {
      const params = {
        url: '/p/user/getUserInfo',
        method: 'GET',
        dontTrunLogin: true,
        data: {},
        callBack: res => {
          if (uni.getStorageSync('bbcToken')) {
            this.setData({
              couponNum: res.couponNum, // 优惠券数量
              score: res.score, // 用户青春豆
              totalBalance: res.totalBalance, // 用户余额
              notifyNum: res.notifyNum // 消息提醒
            })
          }
        }
      }
      http.request(params)
    },

    // 加载订单数据
    loadOrderCountFun() {
      const params = {
        url: '/p/user/centerInfo',
        method: 'GET',
        dontTrunLogin: true,
        data: {},
        callBack: res => {
          if (uni.getStorageSync('bbcToken')) {
            this.setData({
              // 店铺审核状态shopAuditStatus：-1未通过 0 未审核 1已通过 null未开店
              shopAuditStatus: res.shopAuditStatus,
              isSetPassword: res.isSetPassword,
              orderAmount: res.orderCountData,
              shopId: res.shopId,
              // 店铺状态shopStatus：-1未开通 0停业中 1营业中 2平台下线 3平台下线待审核
              shopStatus: res.shopStatus
            })
          }
        }
      }
      http.request(params)
    },

    // 我的钱包
    toMyWallet() {
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-user/pages/my-wallet/my-wallet'
        })
      })
    },

    /**
       * 扫一扫
       */
    sacnCode: util.debounce(function () {
      util.tapLog(3)
      util.checkAuthInfo(() => {
        // #ifdef H5
        if (!Wechat.isWechat()) {
          uni.showToast({
            title: this.i18n.openInWeChatBrowser,
            icon: 'none'
          })
          return
        }
        Wechat.scanQRCode((codeStr) => {
          var code = ''
          let flag = 0 // flag为0时，表示结果为自提点二维码，flag为1时，表示结果为商家二维码
          // 处理扫码结果
          if (codeStr.indexOf(',') > -1) {
            code = codeStr.split(',')[1]
          } else if (codeStr.indexOf('?shopId=') > -1) {
            code = codeStr.split('?shopId=')[1]
            flag = 1
          } else {
            code = codeStr
          }
          if (!/^\d+$/.test(code)) {
            uni.showModal({
              title: this.i18n.tips,
              content: this.i18n.stationCodeTips,
              confirmText: this.i18n.confirm,
              showCancel: false
            })
          } else {
            uni.navigateTo({
              url:
                '/package-user/pages/station-order-list/station-order-list?' +
                (flag ? 'shopId=' : 'stationId=') +
                code
            })
          }
        }, () => {
          uni.showToast({
            title: this.i18n.failedInvokeScan,
            icon: 'none'
          })
        })
        // #endif

        // #ifdef APP-PLUS || MP-WEIXIN
        uni.scanCode({
          success: (e) => {
            let code = ''
            let flag = 0 // flag为0时，表示结果为自提点二维码，flag为1时，表示结果为商家二维码
            // 处理扫码结果
            if (e.result.indexOf(',') > -1) {
              code = e.result.split(',')[1]
            } else if (e.result.indexOf('?shopId=') > -1) {
              code = e.result.split('?shopId=')[1]
              flag = 1
            } else {
              code = e.result
            }
            if (!/^\d+$/.test(code)) {
              uni.showModal({
                title: this.i18n.tips,
                content: this.i18n.stationCodeTips,
                confirmText: this.i18n.confirm,
                showCancel: false
              })
            } else {
              uni.navigateTo({
                url:
                  '/package-user/pages/station-order-list/station-order-list?' +
                  (flag ? 'shopId=' : 'stationId=') +
                  code
              })
            }
          },
          fail: (err) => {
            console.log(err)
          }
        })
        // #endif
      })
    }, 1000),

    /**
       * 获取用户信息
       */
    queryUserInfo: function () {
      const params = {
        url: '/p/user/userInfo',
        method: 'GET',
        data: {},
        dontTrunLogin: true,
        callBack: (res) => {
          this.userInfo = res
          uni.setStorageSync('bbcUserInfo', res)
          // this.getHotSalesProds() // 获取热销商品推荐
          if (uni.getStorageSync('bbcUserInfo').station) {
            this.station = uni.getStorageSync('bbcUserInfo').station
          }
        }
      }
      http.request(params)
    },

    /**
 * 获取收货地址列表
 */
    getAddrList: function () {
      const params = {
        url: '/p/address/list',
        method: 'GET',
        callBack: (res) => {
          if (res.length > 0) {
            this.address = res[0]
          }
        }
      }
      http.request(params)
    },

    /**
       * 查询分销相关信息
       */
    getDistInfo() {
      // 查询分销开关是否开启
      http.request({
        url: '/p/distribution/distributionBasicSet/canDistribution',
        method: 'GET',
        // data: {
        //   shopId: 1,
        // },
        dontTrunLogin: true,
        callBack: res => {
          this.setData({
            canDistribution: res == 1
          })
        }
      })
    },

    /**
       * 跳转注销账号
       */
    cancellation: function () {
      util.tapLog(3)
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-user/pages/cancellation/cancellation'
        })
      })
    },

    /**
       * 跳转分销员中心
       */
    toDistCenter: function () {
      // 判断分销中心功能是否开启
      if (!this.canDistribution) {
        return uni.showToast({
          title: this.i18n.distributionErrorTxt,
          icon: 'none'
        })
      }

      util.tapLog(3)
      util.checkAuthInfo(() => {
        http.request({
          url: '/p/distribution/user/distributionUserInfo',
          method: 'GET',
          callBack: res => {
            if (res && res.state == 1) {
              uni.setStorageSync('bbcDistCardNo', res.cardNo)
              uni.setStorageSync('bbcDistInfo', res)
              uni.navigateTo({
                url: '/package-distribution/pages/dis-center/dis-center'
              })
            } else if (res && res.state == 0) {
              uni.showToast({
                title: this.i18n.applicationReview,
                icon: 'none'
              })
            } else if (res && res.state == 3) {
              uni.showModal({
                title: '',
                content: this.i18n.applicationFailed,
                cancelText: this.i18n.cancel,
                confirmText: this.i18n.confirm,
                confirmColor: '#eb2444',

                success(res2) {
                  if (res2.confirm) {
                    if (res.recruitState) {// 0下线 1上线
                      uni.navigateTo({
                        url: '/package-distribution/pages/apply-dist/apply-dist'
                      })
                    } else {
                      uni.navigateTo({
                        url: '/package-distribution/pages/apply-dist-con/apply-dist-con'
                      })
                    }
                  } else if (res2.cancel) {
                    console.log('用户点击取消')
                  }
                }

              })
            } else if (res && res.state == -1) {
              uni.showModal({
                title: '',
                content: this.i18n.distributorBanned,
                confirmColor: '#eb2444',
                cancelText: this.i18n.cancel,
                confirmText: this.i18n.confirm,
                showCancel: false,
                success(res2) {
                  if (res2.confirm) {
                    console.log('用户点击确认')
                  } else if (res2.cancel) {
                    console.log('用户点击取消')
                  }
                }

              })
            } else if (res && res.state == 2) {
              uni.showModal({
                title: '',
                content: this.i18n.distributorCleared,
                confirmColor: '#eb2444',
                cancelText: this.i18n.cancel,
                confirmText: this.i18n.confirm,
                showCancel: false,
                success(res2) {
                }

              })
            } else {
              if (res?.recruitState) { //  0下线 1上线）
                uni.navigateTo({
                  url: '/package-distribution/pages/apply-dist/apply-dist'
                })
              } else {
                uni.navigateTo({
                  url: '/package-distribution/pages/apply-dist-con/apply-dist-con'
                })
              }
            }
          }
        })
      })
    },
    // 查看是否已经是团长
    getIsDistributionUserInfo: function () {
      http.request({
        url: '/p/distribution/user/distributionUserInfo',
        method: 'GET',
        callBack: res => {
          if (res && res.state == 1 && res.userMobile) {
            this.setData({
              isDistributionUserInfo: true
            })
          }
          else {
            this.setData({
              isDistributionUserInfo: false
            })
          }


        }
      })
    },
    toSystemSetUp: function () {
      util.tapLog(3)
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-user/pages/account-settings/account-settings'
        })
      })
    },
    toAfterSalesPage: function () {
      util.tapLog(3)
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-refund/pages/after-sales/after-sales'
        })
      })
    },
    // 青春豆中心
    toPointsCenter: function () {
      util.tapLog(3)
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-member-integral/pages/member-index/member-index'
        })
      })
    },
    toCouponCenter: function () {
      util.tapLog(3)
      uni.navigateTo({
        url: '/package-activities/pages/coupon-center/coupon-center'
      })
      // util.checkAuthInfo(() => {
      // 	uni.navigateTo({
      // 		url: '/package-activities/pages/coupon-center/coupon-center'
      // 	})
      // })
    },
    toMyCouponPage: function () {
      util.tapLog(3)
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-activities/pages/my-coupon/my-coupon'
        })
      })
    },
    toAddressList: function () {
      util.tapLog(3)
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-user/pages/delivery-address/delivery-address'
        })
      })
    },
    toOrderListPage: function (e) {
      util.tapLog(3)
      util.checkAuthInfo(() => {
        var sts = e.currentTarget.dataset.sts
        // uni.navigateTo({
        // 	url: '/pages/order-list/order-list?sts=' + sts
        // })
        this.$Router.push({
          path: '/package-user/pages/order-list/order-list',
          query: {
            sts: sts
          }
        })
      })
    },

    /**
       * 查询所有的收藏量
       */
    showCollectionCount: function () {
      const params = {
        url: '/p/user/collection/collectionCount',
        method: 'GET',
        callBack: (res) => {
          this.collectionCount = res
        }
      }
      http.request(params)
    },

    /**
       * 我的收藏跳转
       */
    // myCollectionHandle: function () {
    //   util.tapLog(3)
    //   util.checkAuthInfo(() => {
    //     var url = '/package-prod/pages/prod-classify/prod-classify?sts=5'
    //     var id = 0
    //     var title = this.i18n.myCollection
    //     if (id) {
    //       url += '&tagid=' + id + '&title=' + title
    //     }
    //     uni.navigateTo({
    //       url: url
    //     })
    //   })
    // },

    myHistory() {
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-user/pages/history/history'
        })
      })
    },

    /**
       * 跳转修改密码
       */
    setPassword: function () {
      util.tapLog(3)
      uni.navigateTo({
        url: '/pages/user-login/user-login?isForgetPassword=true' + '&isPersonalCenter=true'
      })
    },

    /**
       * 跳转到修改用户头像昵称资料
       */
    toPersonalInformation: function () {
      util.tapLog(3)
      uni.navigateTo({
        url: '/package-user/pages/personal-information/personal-information'
      })
    },

    /**
       * 获取用户信息
       */
    onGotUserInfo: function (e) {
      util.tapLog(3)
      util.checkAuthInfo()
    },

    /**
       * 跳转到我的店铺
       */
    enterMyShop: function (e) {
      if (this.shopStatus == 0 || this.shopStatus == 2 || this.shopStatus == 3) {
        uni.showModal({
          title: this.i18n.tips,
          content: this.i18n.storeStatusTips,
          showCancel: false, // 是否显示取消按钮
          cancelText: this.i18n.cancel,
          confirmText: this.i18n.confirm
        })
      } else {
        util.checkAuthInfo(() => {
          uni.navigateTo({
            url: '/package-shop/pages/shop-page/shop-page?shopId=' + e.currentTarget.dataset.shopid
          })
        })
      }
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
    /**
       * 跳转到和商家客服聊天的界面
       */
    gotoMessageBox() {
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-user/pages/message-platform/message-platform?tabType=2'
        })
      })
    },
    /**
       * 获取会员青春豆详情
       */
    getUserLevelInfo() {
      const params = {
        url: '/p/score/scoreInfo',
        method: 'GET',
        dontTrunLogin: true,
        data: {},
        callBack: res => {
          this.getVipInternationalization(res)
          this.setData({
            userLevelInfo: res
          })
        }
      }
      http.request(params)
    },
    /**
     * 获取会员信息
     */
    getUserLevelList() {
      const params = {
        url: '/p/score/scoreLevel/page',
        method: 'GET',
        data: {
          levelType: 1
        },
        callBack: res => {
          this.vipRemainingDay = ''
          // 要获取剩余天数
          if (res.endTime) {
            const diffDay = this.getTimeDifference(res.endTime)
            if (diffDay > 0) this.vipRemainingDay = diffDay
          }

          const userLevelList = res.userLevels || []
          if (userLevelList.length > 0) {
            userLevelList.forEach((termItem) => {
              if (termItem.level === 1) {
                this.vipMarking = termItem
                if (termItem.userRights) this.powerNumber = termItem.userRights.length
              }
            })
            // this.vipMarking.needAmount = (this.vipMarking.needAmount / 100).toFixed(2)
          }
        }
      }
      http.request(params)
    },
    /**
     * 求距今相差的天数
     * @param {*} endTime 过期时间
     */
    getTimeDifference(endTime) {
      const timer = new Date(endTime)
      let timeDifference = (timer - new Date()) / (1000 * 60 * 60 * 24)
      timeDifference = parseInt(timeDifference)
      // console.log('差值', timeDifference)
      return timeDifference
    },

    /**
       * 跳转购买会员
       */
    toBuyMember() {
      util.tapLog(3)
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-member-integral/pages/buy-vip/buy-vip'
        })
      })
    },

    /**
       * 跳转青春豆中心
       */
    toMemberInteral() {
      util.tapLog(3)
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-member-integral/pages/integral-index/integral-index'
        })
      })
    },

    /**
   * 跳转青春豆明细
   */
    toInteralDetail() {
      util.tapLog(3)
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-member-integral/pages/integral-detail/integral-detail'
        })
      })
    },

    /**
       * 退出登录
       */
    logout: function () {
      util.tapLog(3)
      uni.navigateTo({
        url: '/package-user/pages/logout/logout'
      })
    },
    /**
     * 图片加载失败时显示默认图片
     */
    handlePicError(item) {
      this.$set(item, 'isPicError', true)
    },
    // 国际化
    getVipInternationalization(data) {
      if (!data) return
      const lang = uni.getStorageSync('bbcLang') || 'zh_CN'
      let levelNameCn, levelNameEn
      data.userLevelLangList.map(val => {
        if (val.lang === 0) levelNameCn = val.levelName
        if (val.lang === 1) levelNameEn = val.levelName
      })
      data.levelName = lang === 'zh_CN' ? levelNameCn : levelNameEn || levelNameCn
    }
  }
}
</script>
<style>
@import "./user.css";
</style>
