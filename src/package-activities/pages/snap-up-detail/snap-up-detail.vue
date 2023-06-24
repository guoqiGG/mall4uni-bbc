<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view :class="['Mall4j','contenta', popupShowHiden ? 'page-hidden' : '']">
    <view v-if="countDownList[0]" class="page-container">
      <!-- 秒杀商品详情 -->
      <!-- pages/snap-up-detail/snap-up-detail.wxml -->
      <view class="top-goods-box">
        <!-- 商品图片 -->
        <!-- 轮播图 -->
        <!-- 轮播图 -->
        <view class="swiper-con">
          <view v-if="video && isPlaying" class="video-container">
            <video
              id="myVideo"
              enable-progress-gesture="false"
              objectFit="fill"
              :src="video"
              controls
              @ended="playEnd"
            />
          </view>
          <view v-if="video" class="play-btn" @tap="videoOper">
            <image
              v-if="!isPlaying"
              class="play-icon"
              src="/static/images/icon/play-red.png"
            />
            <text :class="'play-text' + isPlaying ? '' : 'video-play'">{{
              isPlaying ? i18n.quitPlaying : ""
            }}</text>
          </view>
          <swiper
            v-if="!isPlaying"
            :indicator-dots="indicatorDots"
            :autoplay="autoplay"
            :indicator-color="indicatorColor"
            :interval="interval"
            :duration="duration"
            :indicator-active-color="indicatorActiveColor"
          >
            <block v-for="(item, index) in imgs" :key="index">
              <swiper-item>
                <ImgShow :src="item" img-mode="aspectFit" />
              </swiper-item>
            </block>
          </swiper>
        </view>
        <!-- 轮播图end -->
        <!-- 倒计时栏 -->
        <view class="countdown-box">
          <!-- 秒杀 -->
          <text class="second-kill">{{ i18n.spike }}</text>
          <view class="countdown-content">
            <!-- 秒杀未开始 -->
            <view v-if="countDownList[0].type === 0">
              <text class="countdown-tips">{{ i18n.onlyStart }}</text>
              <text
                class="countdown-time"
              ><text class="countdown-tips">{{ countDownList[0].day }}</text>{{ countDownList[0].hou }}{{ countDownList[0].min
              }}{{ countDownList[0].sec }}</text>
            </view>
            <!-- 秒杀在进行 -->
            <view v-if="countDownList[0].type === 1">
              <text class="countdown-tips">{{ i18n.onlyEnd }}</text>
              <text
                class="countdown-time"
              ><text class="countdown-tips">{{ countDownList[0].day }}</text>{{ countDownList[0].hou }}{{ countDownList[0].min
              }}{{ countDownList[0].sec }}</text>
            </view>
            <!-- 秒杀已结束 -->
            <view v-if="countDownList[0].type === 2">
              <text class="countdown-tips">{{ i18n.secondKillOver }}</text>
              <text
                class="countdown-time"
              ><text class="countdown-tips">{{ countDownList[0].day }}</text>{{ countDownList[0].hou }}{{ countDownList[0].min
              }}{{ countDownList[0].sec }}</text>
            </view>
          </view>
        </view>
        <!-- 商品信息 -->
        <view class="goods-msg">
          <!-- 标题 -->
          <view class="goods-title">{{ seckilldet.prodName }}</view>
          <view class="col" @tap="addOrCannelCollection">
            <image
              v-if="!isCollection"
              src="/static/images/icon/prod-col.png"
            />
            <image
              v-if="isCollection"
              src="/static/images/icon/prod-col-red.png"
            />{{ i18n.collection }}
          </view>
          <!-- 价格 -->
          <!-- 秒杀开始后 -->
          <view class="goods-price display">
            <text class="current-price">
              <text class="sub">￥</text>1.00 -<text class="sub">￥</text>2.00</text>
            <text class="original-price">￥2.00 - ￥3.00</text>
          </view>
          <!-- 秒杀开始前 -->
          <view class="goods-price">
            <text class="current-price">
              <text class="sub">￥</text>{{ toPrice(defaultSku.seckillPrice) }}</text>
            <text
              class="original-price"
            >￥{{ toPrice(defaultSku.price) }}</text>
          </view>
          <!-- 运费 -->
          <view class="other-infor clearfix">
            <text
              v-if="seckilldet && seckilldet.seckillVO"
              class="inventory"
            >{{ i18n.remaining }}：{{ defaultSku.seckillStocks }}</text>
          </view>
        </view>
      </view>
      <!-- 已选规格 -->
      <!-- sku弹窗组件 -->
      <prod-sku-select
        v-if="loaded"
        :mold="mold"
        :pic="pic"
        :sku-list="skuList"
        :default-price="seckillPrice"
        :virtual-info="virtualInfo"
        :prod-type="2"
        :prod-num="prodNum"
        :has-max-num="seckilldet.seckillVO.maxNum > -1"
        :max-num="maxNum"
        :page-type="2"
        :sku-show="!hideModal"
        @buyNow="seckillconfirm"
        @setSku="setSku"
        @showSku="showModal"
        @closeSkuPop="hideModalFun"
        @setVirtualInputInfo="setVirtualInputInfo"
        @setProdNum="setProdNum"
      />
      <!-- 已选规格end -->
      <!-- 商品详情 -->
      <view v-if="prodParameterList.length || content" class="prod-detail">
        <view>
          <view
            v-for="item in prodParameterList"
            :key="item.prodParameterId"
            class="parameter-box"
          >
            <view class="parameter-key">
              {{ item.parameterKey }}
            </view>
            <view class="parameter-vaule">
              {{ item.parameterValue }}
            </view>
          </view>
        </view>
        <!-- <view v-html="content"></view> -->
        <rich-text :nodes="content" />
      </view>
      <!-- 商品详情end -->

      <!-- 【秒杀】立即抢购btn -->
      <view class="footer">
        <view class="foot-btn" @tap="toHomePage">
          <image src="/static/images/tabbar/homepage.png" />{{ i18n.homepage }}
        </view>
        <view class="foot-btn" @tap="handleCustomService">
          <image src="/static/images/icon/shop-customer-service.png" />{{
            i18n.service
          }}
        </view>
        <view
          v-if="countDownList[0].type === 1"
          class="foot-btn buy-btn"
          @tap="showModal"
        >
          {{ i18n.immediatelyBuy }}
        </view>
        <view
          v-if="countDownList[0].type === 0"
          class="foot-btn buy-btn retail-price-buy"
          @tap="toProdDetailsPage"
        >
          {{ i18n.retailPricePurchase }}
        </view>
      </view>

      <!-- 直播悬浮按钮 -->
      <view
        v-if="liveRoomParams && liveRoomParams.length"
        class="live"
        :data-roomid="liveRoomParams[0].roomId"
        :data-url="liveRoomParams[0].url"
        @tap="toLivePage"
      >
        <image class="earn" src="/static/images/liveBroadcast/living03.png" />
      </view>
    </view>
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')
const config = require('../../../utils/config.js')
// #ifdef H5
import Wechat from '../../../utils/wechat.js'
// #endif
import prodSkuSelect from '../../../components/prod-sku-select/index.vue'

export default {
  components: {
    prodSkuSelect
  },
  props: {},
  data() {
    return {
      isEn: uni.getStorageSync('bbcLang') == 'en', // 是否为英文
      isWechat: false, // 是否为微信环境
      hideModal: true,
      popupShowHiden: false,
      seckillId: 0,
      seckilldet: {},
      countdown: '',
      // 秒杀倒计时
      countdownlist: [],
      // 秒杀倒计时列表
      clearTimer: null,
      originalPrice: 0,
      skuList: [],
      skuGroup: {},
      defaultSku: {},
      selectedProp: [],
      selectedPropObj: {},
      propKeys: [],
      allProperties: [],
      seckillPrice: 0,
      prodNum: 1,
      maxNum: 1,
      orderPath: '',
      seckillTotalStocks: 1,
      // 秒杀活动剩余库存
      findSku: true,
      isAuthInfo: true,
      countDownListTimer: '',
      countDownList: '',
      animationData: '',
      content: '', // 商品详情富文本
      // 轮播图片相关
      imgs: '',
      indicatorDots: true,
      indicatorColor: '#f2f2f2',
      indicatorActiveColor: '#eb2444',
      autoplay: true,
      interval: 3000,
      duration: 1000,
      video: '', // 商品视频
      isPlaying: false,
      showBacktop: false,
      liveRoomParams: [], // 直播列表信息
      shopId: '',
      pic: '',
      prodId: null,
      isCollection: false,

      // 虚拟商品
      mold: null, // 1虚拟商品
      virtualRemarks: [], // 留言
      isRefund: null, // 0不支持退款 1支持退款
      writeOffTime: null, // 核销有效期 -1.长期有效 0.自定义 x.x天内有效
      writeOffNum: null, // 核销次数 -1.多次核销 0.无需核销 1.单次核销
      writeOffStart: null, // 核销有效期开始时间
      writeOffEnd: null, // 核销有效期结束时间
      prodParameterList: [],

      virtualInfo: {},
      loaded: false,
      prodType: 0
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // #ifdef H5
    this.isWechat = Wechat.isWechat()
    // #endif
    // #ifdef APP-PLUS
    this.isWechat = false
    // #endif
    // #ifdef MP-WEIXIN
    this.isWechat = true
    // #endif

    this.setData({
      seckillId: options.seckillId
    })
    // this.getskdet(true);
    this.prodId = options.seckillId
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.secondsKillProductDetails
    })

    this.getskdet(true)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.hideModal = true
    this.popupShowHiden = false
    if (this.isPlaying) {
      this.stopPlay()
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearTimeout(this.countDownListTimer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  watch: {
    skuShow(nv) {
      if (nv && this.isPlaying) {
        this.stopPlay()
      }
    },
    commentShow(nv) {
      if (nv && this.isPlaying) {
        this.stopPlay()
      }
    },
    showDiscountPopup(nv) {
      if (nv && this.isPlaying) {
        this.stopPlay()
      }
    },
    popupShow(nv) {
      if (nv && this.isPlaying) {
        this.stopPlay()
      }
    }
  },
  methods: {
    /**
     * 修改商品的sku
     */
    setSku(sku, findSku) {
      this.findSku = findSku
      this.defaultSku = sku
    },

    /**
     * 修改商品数量
     */
    setProdNum(prodNum) {
      this.prodNum = prodNum
    },

    /**
     * 输入商品数量
     */
    prodNumInp(e) {
      const num = Number(e.detail.value.replace(/[^\d]/g, ''))
      this.prodNum = num
    },
    /**
     * 咨询客服
     */
    handleCustomService() {
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url:
            '/package-user/pages/chat/chat-im?shopId=' +
            this.shopId +
            '&prodId=' +
            this.prodId
        })
      })
    },

    /**
     * 添加或者取消收藏商品
     */
    addOrCannelCollection() {
      util.tapLog(3)
      util.checkAuthInfo(() => {
        const params = {
          url: '/p/user/collection/addOrCancel',
          method: 'POST',
          data: this.prodId,
          callBack: (res) => {
            this.setData({
              isCollection: !this.isCollection
            })
            uni.showToast({
              title: res
                ? this.i18n.collectionAdded
                : this.i18n.collectionCancelled,
              duration: 1200,
              icon: 'none'
            })
          }
        }
        http.request(params)
      })
    },

    /**
     * 获取秒杀商品详情
     */
    getskdet(isFirst) {
      //  url: '/seckillVO/prod?seckillId=' + this.seckillId,
      http.request({
        url: '/prod/prodInfo?prodId=' + this.seckillId,
        method: 'GET',
        callBack: (res) => {
          const endTimeList = []
          var objs = {}
          // 轮播图片
          var imgStrs = res.imgs
          var imgs = imgStrs.split(',')
          objs.eTime = res.seckillVO.endTime
          objs.sTime = res.seckillVO.startTime
          objs.countType = null // 1表示秒杀活动正在进行,0表示秒杀活动未开始
          endTimeList.push(objs)
          res.seckillVO.seckillSkuList.forEach((skuItem) => {
            if (skuItem.pic && skuItem.pic.indexOf('http') === -1) {
              skuItem.pic = config.picDomain + skuItem.pic
            }
          })
          this.setData({
            loaded: true,
            imgs,
            seckillTotalStocks: res.seckillVO.seckillTotalStocks,
            seckilldet: res,
            countdownlist: endTimeList,
            skuList: res.seckillVO.seckillSkuList,
            seckillPrice: res.seckillVO.seckillPrice,
            maxNum: res.seckillVO.maxNum,
            originalPrice: res.price,
            content: util.formatHtml(res.content),
            video: res.video ? res.video : '',
            liveRoomParams: res.liveRoomParams, // 直播列表
            shopId: res.shopId,
            prodId: res.prodId,
            pic: res.pic,
            // 虚拟商品
            mold: res.mold, // 1虚拟商品
            virtualRemarks: res.virtualRemark
              ? JSON.parse(res.virtualRemark)
              : [], // 留言
            isRefund: res.isRefund, // 0不支持退款 1支持退款
            writeOffTime: res.writeOffTime, // 核销有效期 -1.长期有效 0.自定义 x.x天内有效
            writeOffNum: res.writeOffNum, // 核销次数 -1.多次核销 0.无需核销 1.单次核销
            writeOffStart: res.writeOffStart, // 核销有效期开始时间
            writeOffEnd: res.writeOffEnd, // 核销有效期结束时间
            prodParameterList: res.prodParameterList
          })
          if (res.mold === 1) {
            this.virtualInfo = {
              virtualRemarks: res.virtualRemark
                ? JSON.parse(res.virtualRemark)
                : [], // 留言
              isRefund: res.isRefund, // 0不支持退款 1支持退款
              writeOffTime: res.writeOffTime, // 核销有效期 -1.长期有效 0.自定义 x.x天内有效
              writeOffNum: res.writeOffNum, // 核销次数 -1.多次核销 0.无需核销 1.单次核销
              writeOffStart: res.writeOffStart, // 核销有效期开始时间
              writeOffEnd: res.writeOffEnd, // 核销有效期结束时间
              prodParameterList: res.prodParameterList,
              defaultPrice: res.price
            }
          }
          // 初始化视频
          if (res.video) {
            this.$nextTick(() => {
              this.videoContext = uni.createVideoContext('myVideo', this)
            })
          }
          this.countdownFun()
          if (uni.getStorageSync('bbcToken')) {
            this.prodBrowseLog(res.prodId)
          }
          // 虚拟商品
          if (
            res.mold === 1 &&
            this.virtualRemarks &&
            this.virtualRemarks.length
          ) {
            this.virtualRemarks.forEach((el) => (el.value = ''))
          }
          this.prodType = res.prodType
        },
        errCallBack: (err) => {
          if (err.statusCode === 204) {
            uni.showToast({
              title: this.i18n.secondKillOver,
              duration: 2000,
              icon: 'none',
              complete: (res) => {
                setTimeout(() => {
                  const pages = getCurrentPages()
                  if (pages.length >= 2) {
                    uni.navigateBack({
                      delta: 1
                    })
                  } else {
                    uni.reLaunch({
                      url: '/pages/index/index'
                    })
                  }
                }, 2000)
              }
            })
          }
        }
      })
    },
    // 保存浏览记录
    prodBrowseLog(prodId) {
      http.request({
        url: '/p/prodBrowseLog',
        method: 'POST',
        data: {
          prodId
        },
        callBack: (res) => {}
      })
    },
    // 倒计时
    countdownFun() {
      let isEnd = false
      // 获取当前时间，同时得到活动结束时间数组
      const newTime = new Date().getTime()
      const endTimeList = this.countdownlist
      const countDownArr = [] // 对结束时间进行处理渲染到页面

      endTimeList.forEach((o) => {
        if (newTime - util.dateToTimestamp(o.sTime) > 0) {
          const endTime = util.dateToTimestamp(o.eTime)
          let obj = null // 如果活动未结束，对时间进行处理
          if (endTime - newTime > 0) {
            const time = (endTime - newTime) / 1000 // 获取天、时、分、秒
            const day = parseInt(time / (60 * 60 * 24))
            const hou = parseInt((time % (60 * 60 * 24)) / 3600)
            const min = parseInt(((time % (60 * 60 * 24)) % 3600) / 60)
            const sec = parseInt(((time % (60 * 60 * 24)) % 3600) % 60)
            // obj = {
            // 	day: `${this.timeFormat(day)} 天`,
            // 	hou: `${this.timeFormat(hou)} 时`,
            // 	min: `${this.timeFormat(min)} 分`,
            // 	sec: `${this.timeFormat(sec)} 秒`,
            // 	type: 1 // 表示秒杀正在进行
            // };
            obj = {
              day: this.timeFormat(day) + this.i18n.day,
              hou: this.timeFormat(hou) + ':',
              min: this.timeFormat(min) + ':',
              sec: this.timeFormat(sec),
              type: 1 // 表示秒杀正在进行
            }
          } else { // 活动已结束
            obj = {
              day: '00',
              hou: '00',
              min: '00',
              sec: '00'
            }
            isEnd = true
          }
          countDownArr.push(obj)
        } else { // 活动未开始
          const startTime = util.dateToTimestamp(o.sTime)
          const time = (startTime - newTime) / 1000
          let obj = null // 获取天、时、分、秒

          const day = parseInt(time / (60 * 60 * 24))
          const hou = parseInt((time % (60 * 60 * 24)) / 3600)
          const min = parseInt(((time % (60 * 60 * 24)) % 3600) / 60)
          const sec = parseInt(((time % (60 * 60 * 24)) % 3600) % 60)
          obj = {
            day: this.timeFormat(day) + this.i18n.day,
            hou: this.timeFormat(hou) + ':',
            min: this.timeFormat(min) + ':',
            sec: this.timeFormat(sec),
            type: 0
          }
          countDownArr.push(obj)
        }
      })
      if (isEnd) {
        clearTimeout(this.countDownListTimer)
        uni.redirectTo({
          url: '/package-activities/pages/snap-up-list/snap-up-list'
        })
        return
      }
      // 然后每隔一秒执行一次倒计时函数
      this.setData({
        countDownList: countDownArr,
        countDownListTimer: setTimeout(this.countdownFun, 1000)
      })
    },

    // 小于10的格式化函数
    timeFormat(times) {
      return times < 10 ? '0' + times : times
    },

    /**
     * 视频的方法
     */
    videoOper() {
      if (this.isPlaying) {
        this.stopPlay()
      } else {
        this.startPlay()
      }
    },
    playEnd() {
      this.stopPlay()
    },

    startPlay() {
      this.setData({
        isPlaying: true
      })
      setTimeout(() => {
        this.videoContext.seek(0)
        this.videoContext.play()
      }, 200)
    },
    stopPlay() {
      this.setData({
        isPlaying: false
      })
      setTimeout(() => {
        this.videoContext.seek(0)
        this.videoContext.stop()
      }, 200)
    },

    // 确认秒杀商品
    seckillconfirm() {
      // var secKillObj = {}
      // secKillObj.addrId = 0
      // secKillObj.prodCount = this.prodNum
      // secKillObj.seckillSkuId = this.defaultSku.seckillSkuId
      // wx.setStorageSync('bbcSecKillObj', secKillObj)
      // uni.navigateTo({
      //   url: '/package-activities/pages/confirm-order/confirm-order'
      // })
      const confirmOrderParams = {
        addrId: 0,
        prodCount: this.prodNum,
        prodId: this.prodId,
        shopId: this.shopId,
        seckillSkuId: this.defaultSku.seckillSkuId
      }
      uni.setStorageSync('bbcConfirmOrderParams', confirmOrderParams)
      // 获取秒杀商品路径
      this.getSeckillPath()
    },

    /**
     * 获取秒杀商品路径
     */
    getSeckillPath() {
      const params = {
        url: '/p/seckill/orderPath',
        method: 'GET',
        data: {
          prodId: this.prodId
        },
        callBack: res => {
          console.log(res)
          uni.navigateTo({
            url: `/package-prod/pages/submit-order/submit-order?prodType=${this.prodType}&orderPath=${res}`
          })
        }
      }
      http.request(params)
    },

    //  零售价购买
    toProdDetailsPage: function(e) {
      uni.navigateTo({
        url: '/package-prod/pages/prod/prod?prodId=' + this.seckilldet.prodId
      })
    },

    /**
     * 设置虚拟商品信息
     */
    setVirtualInputInfo(virtualRemarkList) {
      this.virtualRemarks = virtualRemarkList
    },

    /**
     * 显示遮罩层
     */
    showModal: function() {
      this.hideModal = false
    },

    /**
     * 获取用户信息
     */
    onGotUserInfo: function(e) {
      if (e.detail.errMsg !== 'getUserInfo:fail auth deny') {
        this.setData({
          isAuthInfo: true
        })
        http.updateUserInfo()
      }
    },

    /**
     * 隐藏遮罩层
     */
    hideModalFun: function() {
      this.hideModal = true
    },

    /**
     * 跳转到首页
     */
    toHomePage: function() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    },

    /**
     * 跳转到购物车
     */
    toCartPage: function() {
      uni.switchTab({
        url: '/pages/basket/basket'
      })
    },

    /**
     * 跳转直播
     */
    /**
     * 前往直播页面
     */
    toLivePage: function(e) {
      console.log(e)
      this.roomId = e.currentTarget.dataset.roomid // 填写具体的房间号
      this.url = e.currentTarget.dataset.url
      util.checkAuthInfo(this.toLivePlayer)
    },
    toLivePlayer: function() {
      const roomId = this.roomId
      const url = this.url
      if (this.isWechat) {
        // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取
        const customParams = encodeURIComponent(
          JSON.stringify({
            path: url
          })
        )
        wx.navigateTo({
          url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
        }) // 其中wx2b03c6e691cd7370是直播组件appid不能修改
      } else {
        uni.showToast({
          title: this.i18n.pleaseOpenInWechat,
          icon: 'none'
        })
      }
    }
  }
}
</script>
<style>
@import "./snap-up-detail.css";
</style>
