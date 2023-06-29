<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view :class="['Mall4j contenta', popupShowHiden ? 'page-hidden' : '']">
    <!-- 青春豆兑换商品详情 -->
    <view class="container">
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
          <text
            :class="'play-text' + (isPlaying ? ' video-stop' : 'video-play')"
          >{{ isPlaying ? i18n.quitPlaying : "" }}</text>
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

      <!-- 商品信息 -->
      <view class="prod-info">
        <view class="tit-wrap">
          <view class="prod-tit">{{ prodName }}</view>
        </view>
        <view class="sales-p">{{ brief }}</view>

        <!-- 青春豆商品价格 -->
        <view v-if="defaultSku" class="integral-prod-price">
          <block
            v-if="price"
          >￥{{ parsePrice(defaultSku.price)[0] }}.{{
            parsePrice(defaultSku.price)[1]
          }}
            +</block>{{ defaultSku.skuScore }} {{ i18n.integral }}</view>
      </view>
      <!-- 商品信息end -->

      <!-- 已选规格 -->
      <!-- sku弹窗组件 -->
      <prod-sku-select
        v-if="(pic && prodType !== 1) || (prodType === 1 && groupInfoLoaded)"
        :pic="pic"
        :sku-list="skuList"
        :default-price="defaultPrice"
        :prod-type="prodType"
        :prod-num="prodNum"
        :page-type="3"
        :sku-show="skuShow"
        @setSku="setSku"
        @showSku="showSku"
        @closeSkuPop="closePopup"
        @buyNow="redeemNow"
        @setProdNum="setProdNum"
      />
      <!-- 已选规格end -->

      <!-- 商品详情 -->
      <view class="prod-detail">
        <view>
          <rich-text :nodes="content" />
        </view>
      </view>
      <!-- 商品详情end -->
    </view>

    <!-- 青春豆 底部按钮 -->
    <view class="ex-integral-foot">
      <view class="ex-integral-btn" @tap="redeemNow">{{ i18n.redeemNow }}</view>
    </view>
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
const config = require('../../../utils/config.js')
const util = require('../../../utils/util.js')
import prodSkuSelect from '../../../components/prod-sku-select/index.vue'

export default {
  components: {
    prodSkuSelect
  },
  props: {},
  data() {
    return {
      shopId: 1,
      shopName: '',
      picDomain: config.picDomain,
      indicatorDots: true,
      indicatorColor: '#f2f2f2',
      indicatorActiveColor: '#eb2444',
      isAuthInfo: true,
      autoplay: true,
      interval: 3000,
      duration: 1000,
      prodNum: 1,
      totalCartNum: 0,
      groupActivityId: 0,
      pic: '',
      imgs: '',
      prodName: '',
      price: 0,
      actPrice: 0,
      content: '',
      prodId: 0,
      brief: '',
      skuId: 0,
      popupShow: false,
      skuShow: false,
      skuGroupShow: false,
      commentShow: false,
      skuList: null,
      skuGroup: {},
      findSku: true,
      defaultSku: undefined,
      detaultGroupSku: undefined,
      selectedProp: [],
      selectedPropObj: {},
      selectedProperties: '',
      propKeys: [],
      allProperties: [],
      isCollection: false,
      skuShowType: 0,
      // sku的显示类型 0普通sku 1拼团sku
      hasMaxNum: false,
      // 是否限购
      maxNum: 0,
      // 限购数量
      totalStocks: 0, // 库存量
      scorePrice: '',

      videoContext: '', // 视频组件
      isPlaying: false, // 视频是否播放中
      currentSwiper: 0, // 当前轮播index
      touchS: [0, 0], // 滑动屏幕开始坐标
      touchE: [0, 0], // 滑动屏幕结束坐标
      showDiscountPopup: false, // 促销弹窗显隐
      popupShowHiden: false, // 所有弹窗的显隐判断
      video: '',
      videoDuration: '',
      // 商品类型
      prodType: 3,
      // 默认价格
      defaultPrice: 0
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
    this.setData({
      prodId: options.prodId
    }) // 加载商品信息

    this.getProdInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      skuShow: false,
      popupShowHiden: false
    })
    uni.setNavigationBarTitle({
      title: this.i18n.commodityDetails
    })
    // 查看用户是否关注
    this.getCollection()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
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
     * 数量输入失焦
     */
    inpBlur() {
      if (this.prodNum < 1) {
        uni.showToast({
          title: this.i18n.leastTips,
          icon: 'none'
        })
        return
      }
      if (this.totalStocks <= 0 || this.prodNum > this.defaultSku.stocks) {
        this.prodNum = this.defaultSku.stocks
      }
    },
    /**
     * 输入商品数量
     */
    prodNumInp(e) {
      const num = Number(e.detail.value.replace(/[^\d]/g, ''))
      this.prodNum = num
    },
    /**
     * 获取是否关注信息
     */
    getCollection() {
      const params = {
        url: '/p/user/collection/isCollection',
        method: 'GET',
        data: {
          prodId: this.prodId
        },
        callBack: (res) => {
          this.setData({
            isCollection: res
          })
        }
      }
      http.request(params)
    },

    // 获取商品信息
    getProdInfo() {
      let userId = null
      if (uni.getStorageSync('bbcToken') && uni.getStorageSync('bbcUserInfo')) {
        userId = uni.getStorageSync('bbcUserInfo').userId
      }
      const params = {
        url: '/prod/prodInfo',
        method: 'GET',
        data: {
          prodId: this.prodId,
          userId
        },
        callBack: (res) => {
          this.prodInfo = res
          var imgStrs = res.imgs
          var imgs = imgStrs.split(',')
          var content = util.formatHtml(res.content)
          this.setData({
            imgs: imgs,
            content: content,
            price: res.price,
            prodName: res.prodName,
            groupActivityId: res.groupActivityId,
            prodId: res.prodId,
            brief: res.brief,
            totalStocks: res.totalStocks, // 库存量
            // skuId: res.skuId
            skuList: res.skuList,
            pic: res.pic,
            shopId: res.shopId,
            video: res.video ? res.video : '',
            scorePrice: res.scorePrice, // 青春豆价格
            defaultPrice: res.price
          })
          // 初始化视频
          if (res.video) {
            this.$nextTick(() => {
              this.videoContext = uni.createVideoContext('myVideo', this)
            })
          }
          // 团购活动
          if (res.groupActivityId) {
            this.getJoinGroupList()
          }
        },
        errCallBack: (err) => {
          if (err.code === 'A00001') {
            uni.showToast({
              title: err.msg,
              duration: 2000,
              icon: 'none'
            })
            setTimeout(() => {
              uni.navigateBack()
            }, 1500)
          }
        }
      }
      http.request(params)
    },

    /**
     * 立即兑换
     */
    redeemNow: function() {
      this.stopPlay()
      if (!this.findSku) {
        return
      }
      if (!this.skuShow) {
        this.skuShow = true
        this.popupShowHiden = true
        return
      }
      if (this.defaultSku.stocks <= 0) {
        uni.showToast({
          title: this.i18n.insufficientProductInventory,
          icon: 'none'
        })
        return
      }
      if (this.prodNum < 1) {
        uni.showToast({
          title: this.i18n.leastTips,
          icon: 'none'
        })
        this.prodNum = 1
        return
      }
      if (this.totalStocks <= 0 || this.prodNum > this.defaultSku.stocks) {
        this.prodNum = this.defaultSku.stocks
      }
      util.checkAuthInfo(() => {
        uni.setStorageSync(
          'bbcOrderItem',
          JSON.stringify({
            prodId: this.prodId,
            skuId: this.defaultSku.skuId,
            prodCount: this.prodNum,
            shopId: this.shopId,
            distributionCardNo: this.distributionCardNo
          })
        )
        uni.navigateTo({
          url: '/package-member-integral/pages/integral-submit-order/integral-submit-order?orderEntry=1'
        })
      })
    },

    // sku弹框
    showSku: function() {
      this.stopPlay()
      this.setData({
        skuShow: true,
        popupShowHiden: true,
        skuShowType: 0
      })
    },
    // 关闭规格弹窗
    closePopup: function() {
      this.setData({
        popupShow: false,
        skuShow: false,
        popupShowHiden: false,
        commentShow: false
      })
    },

    /**
     * 视频信息
     */
    getVideoInfo() {
      uni.request({
        url: this.video + '?avinfo',
        success: (res) => {
          const time = Number(res.data.format.duration).toFixed(0)
          this.setData({
            videoDuration:
              time < 60
                ? '00′' + time + '″'
                : parseInt(time / 60) + '′' + (time % 60) + '″'
          })
        }
      })
    },
    /**
     * 视频播放/停止按钮
     */
    videoOper() {
      util.tapLog(3)
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
    }
  }
}
</script>
<style>
@import "./convert-prod-det.css";
</style>
