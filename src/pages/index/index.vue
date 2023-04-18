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
    <navigationBar
      v-if="navigationBarIsShow"
      bg-color="bg-gradual-pink"
      :show-back="false"
      :navigation-bar-style="tabConfig"
      :is-left="false"
      :is-bg-img="isBgImg"
      :title="title"
    />
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
      <!-- 搜索框 -->
      <view class="bg-sear">
        <view class="scrolltop">
          <view class="section" @tap="toSearchPage">
            <image src="/static/images/icon/search.png" class="search-img" />
            <text class="placeholder">{{ i18n.search }}</text>
          </view>
        </view>
      </view>
      <!-- 搜索框end -->

      <!-- 导航&公告 -->
      <view :class="['content']">
        <!-- swiper -->
        <swiper
          v-if="indexImgs.length"
          circular="true"
          :autoplay="autoplay"
          :indicator-color="indicatorColor"
          :interval="interval"
          :duration="duration"
          :indicator-active-color="indicatorActiveColor"
          class="card-swiper"
          indicator-dots
          previous-margin="20rpx"
          next-margin="20rpx"
        >
          <block v-for="(item, seq) in indexImgs" :key="seq">
            <swiper-item class="banner-item">
              <view class="img-box">
                <ImgShow :src="item.imgUrl" :classList="['banner']" @handleTap="()=>toIndexImgContent(item)" />
              </view>
            </swiper-item>
          </block>
        </swiper>
        <!-- end swiper -->

        <!-- 板块 -->
        <view class="cat-item">
          <view class="item" data-sts="1" @tap="toClassifyPage">
            <image src="/static/images/icon/newProd.png" />
            <text>{{ i18n.newProduct }}</text>
          </view>
          <view class="item" data-sts="2" @tap="toSpecialDiscount">
            <image src="/static/images/icon/timePrice.png" />
            <text>{{ i18n.limitedTimeOffer }}</text>
          </view>
          <view class="item" @tap="toAbulkPage">
            <image src="/static/images/icon/group.png" />
            <text>{{ i18n.groupDiscount }}</text>
          </view>
          <view class="item" data-sts="3" @tap="toSecKillPage">
            <image src="/static/images/icon/neweveryday.png" />
            <text>{{ i18n.spikeSpecial }}</text>
          </view>
          <view class="item" @tap="toCouponCenter">
            <image src="/static/images/icon/newprods.png" />
            <text>{{ i18n.couponCenter }}</text>
          </view>
        </view>
        <!-- 板块end -->

        <!-- 消息播放 -->
        <view v-if="news.length" class="message-play" @tap="onNewsPage">
          <image src="/static/images/icon/horn.png" class="hornpng" />
          <swiper
            vertical="true"
            autoplay="true"
            duration="1000"
            circular="true"
            class="swiper-cont"
          >
            <block v-for="(item, id) in news" :key="id">
              <swiper-item class="items">{{ item.title }}</swiper-item>
            </block>
          </swiper>
          <text class="arrow" />
        </view>
        <!-- 消息播放end -->
      </view>
      <!-- 导航&公告end -->

      <!-- 直播列表入口 -->
      <!-- #ifdef MP-WEIXIN -->
      <!-- <view class="live-enter" @tap="toLiveListPage">
				<image src="/static/images/liveBroadcast/live-enter.png"></image>
			</view>	 -->
      <!-- #endif -->

      <!-- 秒杀 -->
      <view v-if="snapUpList.length" class="snap-up clearfix">
        <!-- 头部 -->
        <view class="snap-up-head clearfix">
          <text class="snap-up-tit">{{ i18n.spike }}</text>
          <!-- 更多 -->
          <view class="more-goods" @tap="toSnapUpPage">
            <text class="more-goods-txt">{{ i18n.moreSpikes }}</text>
            <view class="more-icon">
              <image src="/static/images/icon/more.png" />
            </view>
          </view>
        </view>

        <!-- 列表 -->
        <view class="snap-up-goods-show">
          <!-- 商品盒子 -->
          <view
            v-for="(item, index) in snapUpList"
            :key="index"
            class="snap-up-goods-box"
            @tap="toProdDetail(item.prodId)"
          >
            <view class="img-box">
              <ImgShow :src="item.pic" img-mode="aspectFit" />
            </view>
            <view
              class="snap-up-price"
            ><text class="symbol">￥</text>{{ toPrice(item.activityPrice) }}</view>
            <view class="original-price">￥{{ toPrice(item.price) }}</view>
          </view>
          <!-- 查看更多 -->
          <view
            v-if="snapUpList.length > 3"
            class="view-more"
            @tap="toSnapUpPage"
          >{{ i18n.seeMore }}
            <image class="view-more-icon" src="/static/images/icon/more-icon.png" />
          </view>
        </view>
      </view>
      <!-- 秒杀end -->

      <!-- 团购 -->
      <view v-if="aBulkList.length" class="abulk clearfix">
        <!-- 头部 -->
        <view class="snap-up-head clearfix">
          <text class="snap-up-tit">{{ i18n.groupBuy }}</text>
          <!-- 更多 -->
          <view class="more-goods" @tap="toAbulkPage">
            <text class="more-goods-txt">{{ i18n.moreGroupBuy }}</text>
            <view class="more-icon">
              <image src="/static/images/icon/more.png" />
            </view>
          </view>
        </view>

        <!-- 列表 -->
        <view class="snap-up-goods-show">
          <!-- 商品盒子 -->
          <view
            v-for="(item, index) in aBulkList"
            :key="index"
            class="snap-up-goods-box"
            @tap="toProdDetail(item.prodId)"
          >
            <view class="img-box">
              <ImgShow :src="item.pic" img-mode="aspectFit" />
            </view>
            <view class="purchase-conditions">
              <view class="group-number">{{ item.groupActivitySearchVO.groupNumber }}{{ i18n.join }}</view>
              <view class="snap-up-price"><text class="symbol">￥</text>{{ toPrice(item.activityPrice) }}</view>
            </view>
            <view class="original-price">￥{{ toPrice(item.price) }}</view>
          </view>
          <!-- 查看更多 -->
          <view
            v-if="aBulkList.length > 3"
            class="view-more"
            @tap="toAbulkPage"
          >{{ i18n.seeMore }}
            <image class="view-more-icon" src="/static/images/icon/more-icon.png" />
          </view>
        </view>
      </view>
      <!-- 团购end -->

      <!-- 商城热卖 -->
      <view class="goods-list">
        <view class="title">
          <text>{{ i18n.hotSale }}</text>
        </view>
        <view class="goods-item-cont">
          <block v-for="(prod, prodId) in hotSalesList" :key="prodId">
            <view class="prod-items" @tap="toProdDetail(prod.prodId)">
              <view class="goods-item-imagecont">
                <image v-if="prod.pic && !prod.isPicError" :src="prod.pic" class="goods-item-img" mode="aspectFit" @error="handlePicError(prod)" />
                <image v-else src="/static/images/icon/def.png" mode="aspectFit" class="goods-item-img" />
              </view>
              <view class="goods-item-text">
                <view class="goods-item-prod-text">
                  <view v-if="prod.activityInProgress && prod.prodType != 0" class="activity-box">
                    <view class="activity">
                      {{ prodTypeArr[prod.prodType] }}
                    </view>
                  </view>
                  {{ prod.prodName }}
                </view>
                <view class="prod-info">{{ prod.brief || '' }}</view>
                <view class="prod-text-info">
                  <view class="price">
                    <text class="symbol">￥</text>
                    <text class="big-num">{{ parsePrice(prod.price)[0] }}</text>
                    <text class="small-num">.{{ parsePrice(prod.price)[1] }}</text>
                  </view>
                </view>
              </view>
            </view>
          </block>
          <!-- 空列表或加载全部提示 -->
          <EmptyAllTips
            v-if="isLoaded"
            :isAll="isAll"
            :allTips="i18n.allLoaded"
          />
        </view>
      </view>

    </view>
    <view v-if="renovationId">
      <feature
        ref="featureIndex"
        :page-load="pageLoad"
        :page-id="renovationId"
        :shop-id="0"
        :page-scorll-top="pageScorllTop"
        @pageLoaded="pageLoaded"
      />
    </view>

    <!-- 回到顶部 -->
    <back-top-btn v-if="showBacktop" />
    <privacy-pop v-if="showPop" @hidePop="hidePop" />
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
        background: '',
        fontColor: '#FFFFFF',
        iconColor: '#FFFFFF'
      },
      title: '',
      isBgImg: false,
      titleTextColor: '#ffffff',
      prodTypeArr: [],
      isLoaded: false
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
  onLoad: function() {
    uni.showNavigationBarLoading()
    util.transTabbar()
    // 获取装修数据
    this.getFeatureIndex()

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
  onShow: function() {
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
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.renovationId) {
      this.$refs.featureIndex.getNextPage()
    } else {
      this.getNextPage()
    }
  },
  onPullDownRefresh: function() {
    // 模拟加载
    this.current = 1
    setTimeout(() => {
      this.getFeatureIndex()
      wx.stopPullDownRefresh() // 停止下拉刷新
    }, 100)
  },
  onShareAppMessage: function(e) {
    return {
      path: 'pages/index/index'
    }
  },

  // 页面滚动到指定位置指定元素固定在顶部
  onPageScroll: function(e) {
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
              title: uni.getStorageSync('bbcUniTitleContent')
            })

            // 头部标题
            this.title = uni.getStorageSync('bbcUniTitleContent')
          }
          this.showScreen = false
          if (!this.renovationId) {
            this.tabConfig = {
              background: '#F81A1A',
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
      this.title = e.detail.title
      // 头部标题
      this.titleTextColor = e.detail.textColor || '#ffffff'
      this.tabConfig.fontColor = this.titleTextColor || '#ffffff'
      if (e.detail.bgType) {
        if (this.bgImg) {
          this.tabConfig = {
            backgroundImage: `url(${this.bgImg})`,
            background: e.detail.bgColor || '#F81A1A',
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
          background: e.detail.bgColor || '#F81A1A',
          fontColor: this.titleTextColor,
          iconColor: '#FFFFFF'
        }
      }
      // 设置导航栏字体的颜色
      uni.setNavigationBarColor({
        frontColor: this.titleTextColor,
        backgroundColor: '#F81A1A',
        complete: (res) => {}
      })
    },

    /**
     * 跳转到商品详情页
     */
    toProdDetail: function(prodId) {
      util.tapLog(3)
      if (prodId) {
        this.$Router.push({
          path: '/pages/prod/prod',
          query: {
            prodId
          }
        })
      }
    },
    // 点击轮播图跳转相应页面
    toIndexImgContent: function(item) {
      util.tapLog(3)
      if (item.type !== 0) {
        return
      }
      const prodId = item.relation
      http.request({
        url: '/prod/isStatus',
        method: 'GET',
        data: {
          prodId: prodId
        },
        callBack: (res) => {
          if (res) {
            this.$Router.push({
              path: '/pages/prod/prod',
              query: {
                prodId: prodId,
                bannerEnter: '1'
              }
            })
          }
        }
      })
    },
    toCouponCenter: function() {
      uni.navigateTo({
        url: '/package-activities/pages/coupon-center/coupon-center'
      })
    },

    /**
     * 跳转到直播列表
     */
    toLiveListPage: function() {
      util.tapLog(3)
      uni.navigateTo({
        url: '/pages/live-broadcast/live-broadcast'
      })
    },

    /**
     * 秒杀
     */
    getSnapUpList: function() {
      const params = {
        // url: "/seckill/pageProd",
        url: '/search/page',
        method: 'GET',
        data: {
          size: 20,
          current: 1,
          prodType: 2,
          isActive: 1 // 过滤掉活动商品
        },
        callBack: (res) => {
          const result = res.records[0].products.filter(
            (item) =>
              util.dateToTimestamp(item.seckillSearchVO.endTime) >
              new Date().getTime()
          ) // 过滤掉秒杀时间已结束的商品

          this.setData({
            snapUpList: result
          })
        }
      }
      http.request(params)
    },

    /**
     * 跳转秒杀列表页
     */
    toSnapUpPage: function() {
      util.tapLog(3)
      uni.navigateTo({
        url: '/package-activities/pages/snap-up-list/snap-up-list'
      })
    },

    /**
     * 团购
     */
    getAbulk: function() {
      var param = {
        url: '/search/page',
        method: 'GET',
        data: {
          current: 1,
          size: 5,
          prodType: 1,
          isActive: 1 // 过滤掉活动商品
        },
        callBack: (res) => {
          this.setData({
            aBulkList: res.records[0].products
          })
        }
      }
      http.request(param)
    },

    /**
     * 跳转团购列表页
     */
    toAbulkPage: function() {
      util.tapLog(3)
      uni.navigateTo({
        url: '/package-activities/pages/a-bulk-list/a-bulk-list'
      })
    },

    // 跳转搜索页
    toSearchPage: function() {
      util.tapLog(3)
      uni.navigateTo({
        url: '/pages/search-page/search-page'
      })
    },
    // 跳转商品活动页面
    toClassifyPage: function(e) {
      util.tapLog(3)
      var url =
        '/pages/prod-classify/prod-classify?sts=' + e.currentTarget.dataset.sts
      var id = e.currentTarget.dataset.id
      var title = e.currentTarget.dataset.title

      if (id) {
        url += '&tagid=' + id + '&title=' + title
      }

      uni.navigateTo({
        url: url
      })
    },
    toSecKillPage: function() {
      uni.navigateTo({
        url: '/package-activities/pages/snap-up-list/snap-up-list'
      })
    },
    toSpecialDiscount: function() {
      this.$Router.push(
        '/package-activities/pages/special-discount/special-discount'
      )
    },
    // 跳转公告列表页面
    onNewsPage: function() {
      uni.navigateTo({
        url: '/package-user/pages/recent-news/recent-news'
      })
    },

    getAllData() {
      this.getIndexImgs()
      this.getNoticeList()
      this.getHotSalesProds()
      this.getSnapUpList()
      this.getAbulk()
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
          this.setData({
            news: res || []
          })
        }
      }
      http.request(params)
    },

    /**
     * 加载热销商品列表
     */
    getHotSalesProds() {
      this.isLoaded = false
      var param = {
        // url: "/search/searchProdPage",
        url: '/search/page',
        method: 'GET',
        data: {
          current: this.current,
          size: 20,
          sort: 2,
          orderBy: 1,
          isActive: 1 // 过滤掉活动商品
        },
        callBack: (res) => {
          this.isLoaded = true
          var hotSalesList = []
          if (this.current == 1) {
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
        }
      }
      http.request(param)
    },

    // 触底加载下一页
    getNextPage() {
      if (this.pages > this.current) {
        this.setData({
          current: this.current + 1
        })
        this.getHotSalesProds()
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
    }
  }
}
</script>
<style>
@import './index.css';
</style>
