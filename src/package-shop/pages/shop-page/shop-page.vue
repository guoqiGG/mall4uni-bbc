<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- pages/shop-page/shop-page.wxml -->
  <view class="Mall4j shop-container">

    <!-- 渐变背景 -->
    <view class="head-bg shop-index">
      <shopHeader style="color: #fff;" :shop-id="shopId" />
      <!-- 搜索框 -->
      <view class="bg-sear">
        <view :class="'bg-search ' + (topFlag? 'navtop' : '')">
          <view class="section" :data-shopid="shopId" @tap="toShopSearchPage">
            <image src="/static/images/icon/search.png" class="search-img" />
            <text class="placeholder">{{ i18n.searchForItems }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- /渐变背景 -->

    <!-- 内容大盒子 -->
    <view :class="'prod-wrapper'">
      <!-- 轮播图 -->
      <view v-if="indexImgs" :class="'content ' + (indexImgs.length? '' : 'display')">
        <swiper :autoplay="autoplay" :indicator-color="indicatorColor" :interval="interval" :duration="duration" :indicator-active-color="indicatorActiveColor" circular="true" class="pic-swiper" indicator-dots>
          <block v-for="(item, index) in indexImgs" :key="index">
            <swiper-item class="banner-item">
              <view class="img-box">
                <ImgShow :src="item.imgUrl" :classList="['banner']" @handleTap="()=>bannerToProdPage(item)" />
              </view>
            </swiper-item>
          </block>
        </swiper>
      </view>
      <!-- 店内公告 -->
      <view v-if="news.length" class="message-play" @tap="onNewsPage">
        <image src="/static/images/icon/horn.png" class="hornpng" />
        <swiper vertical="true" autoplay="true" duration="1000" circular="true" class="swiper-cont">
          <block v-for="(item, id) in news" :key="id">
            <swiper-item class="items">{{ item.title }}</swiper-item>
          </block>
        </swiper>
        <text class="arrow" />
      </view>
      <!-- 商品列表 -->
      <view class="prod-list">
        <view class="tit" @tap="hotsellTit">
          <view class="hotsell">
            <image src="../../static/images/icon/hotsell03.png" />
          </view>
          <text class="hotsell-tit">{{ i18n.shopHotSale }}</text>
        </view>

        <view class="prodlist-item-cont">
          <block v-for="(prod, index) in shopProdList" :key="index">
            <view class="prod-items" @tap="toProdPage(prod.prodId)">
              <view class="hot-imagecont">
                <ImgShow :src="prod.pic" :classList="['hotsaleimg']" img-mode="aspectFit" />
              </view>
              <view class="hot-text">
                <view class="prod-name">{{ prod.prodName }}</view>
                <view class="prod-info">
                  <view class="brief">{{ prod.brief || '' }}</view>
                </view>
                <view class="prod-text-info">
                  <view class="price">
                    <text class="symbol">￥</text>
                    <text class="big-num">{{ prod.price }}</text>
                  </view>
                  <image src="/static/images/tabbar/basket-sel.png" class="basket-img" />
                </view>
              </view>
            </view>
          </block>

          <!-- 查看更多商品 -->
          <view v-if="shopProdList.length>=6" class="view-more" @tap="toShopProds">{{ i18n.viewMoreProducts }}</view>
          <view v-if="!shopProdList.length" class="view-more">{{ i18n.noData }}</view>
        </view>

      </view>
    </view>

    <!-- /内容大盒子 -->
    <shop-tabbar style="position:fixed;bottom:0;width:100%;left:0;right:0;" :shop-id="shopId" />

    <!-- 回到顶部 -->
    <back-top-btn v-if="showBacktop" />
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
import shopTabbar from '../../components/shop-tabbar/index.vue'
import shopHeader from '../../components/shop-header/index.vue'
import backTopBtn from '../../../components/back-top-btn/index.vue'

export default {
  components: {
    shopTabbar,
    shopHeader,
    backTopBtn
  },
  props: {},
  data() {
    return {
      shopId: 0,
      shopInfo: {},
      indicatorDots: true,
      indicatorColor: '#d1e5fb',
      indicatorActiveColor: '#1b7dec',
      autoplay: true,
      interval: 2000,
      duration: 1000,
      indexImgs: null,
      topFlag: false,
      isCollection: false,
      shopProdList: [],
      news: [],
      scrollTop: '',
      showBacktop: false
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
    this.toShopIndex(options.shopId)
    uni.setNavigationBarTitle({
      title: this.i18n.myShop
    })
    this.setData({
      shopId: options.shopId
    })
    this.getIndexImgs()
    this.getShopProds()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getNoticeList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() { },
  methods: {
    /**
     * 店铺装修
     */
    toShopIndex(shopId) {
      const params = {
        url: '/shop/headInfo',
        method: 'GET',
        data: {
          shopId
        },
        callBack: (res) => {
          if (res.renovationId) {
            uni.redirectTo({
              url: '/package-shop/pages/feature-index/feature-index0?shopId=' + shopId +	'&renovationId=' + res.renovationId
            })
          }
        }
      }
      http.request(params)
    },
    /**
		 * 轮播图跳转商品详情
		 */
    bannerToProdPage(item) {
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
        callBack: res => {
          if (res) {
            this.$Router.push({
              path: '/package-prod/pages/prod/prod',
              query: {
                prodId: prodId,
                bannerEnter: '1'
              }
            })
          }
        }
      })
    },

    // 加载公告
    getNoticeList() {
      let path = '/notice/topNoticeList/'
      if (uni.getStorageSync('bbcToken')) {
        path = '/p/notice/topNoticeList/'
      }
      const params = {
        url: path + this.shopId,
        method: 'GET',
        data: {},
        callBack: res => {
          this.setData({
            news: res
          })
        }
      }
      http.request(params)
    },

    hotsellTit() {},

    // 跳转公告列表页面
    onNewsPage: function() {
      uni.navigateTo({
        url: '/package-user/pages/recent-news/recent-news?shopId=' + this.shopId
      })
    },

    // 加载轮播图
    getIndexImgs() {
      var shopId = this.shopId // 加载轮播图
      const params = {
        url: `/indexImgs/${shopId}`,
        method: 'GET',
        data: {},
        callBack: res => {
          this.setData({
            indexImgs: res // seq: res
          })
        }
      }
      http.request(params)
    },

    // 跳转店铺详情页
    toShopInfo(e) {
      const shopId = e.currentTarget.dataset.shopid
      uni.navigateTo({
        url: '/pages/shop-info/shop-info?shopId=' + shopId
      })
    },

    // 跳转店内搜索页
    toShopSearchPage: function(e) {
      uni.navigateTo({
        url: '/package-shop/pages/shop-search/shop-search?shopId=' + e.currentTarget.dataset.shopid
      })
    },

    // 跳转所有商品页
    toShopProds(e) {
      uni.navigateTo({
        url: '/package-shop/pages/shop-prods/shop-prods?shopId=' + e.currentTarget.dataset.shopid
      })
    },

    // 跳转商品详情页
    toProdPage: function(prodId) {
      this.$Router.push({ path: '/package-prod/pages/prod/prod', query: { prodId: prodId }})
    },

    // 获取店铺商品
    getShopProds() {
      const params = {
        // url: '/search/searchProdPage',
        url: '/search/page',
        method: 'GET',
        data: {
          shopId: this.shopId,
          current: 1,
          size: 20,
          isActive: 1, // 过滤掉活动商品
          userId:uni.getStorageSync('bbcUserInfo')?uni.getStorageSync('bbcUserInfo').userId:''
        },
        callBack: res => {
          console.log(res)
          this.setData({
            shopProdList: res.records[0].products
          })
        }
      }
      http.request(params)
    },

    // 设置页面标题
    setNavTitle() {
      uni.setNavigationBarTitle({
        title: this.shopInfo.shopName
      })
    },

    // 页面滚动事件
    onPageScroll: function(e) {
      var _this = this
      if (e.scrollTop > 76) {
        _this.setData({
          topFlag: true,
          showBacktop: true
        })
      } else {
        _this.setData({
          topFlag: false,
          showBacktop: false
        })
      }
    }
  }
}
</script>
<style>
@import "./shop-page.css";
</style>
<style scoped>
</style>
