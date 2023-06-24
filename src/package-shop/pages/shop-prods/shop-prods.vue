<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j shop-container">
    <!-- 店铺信息 -->
    <shopHeader :shop-id="shopInfo.shopId" />
    <!-- 搜索框 && 排序tab -->
    <view class="head-bg">
      <view class="bg-sear">
        <view :class="topFlag? 'navtop' : ''">
          <view class="section" :data-shopid="shopInfo.shopId" @tap="toShopSearchPage">
            <image class="search-img" src="/static/images/icon/search.png" />
            <text class="placeholder">{{ i18n.searchForItems }}</text>
          </view>
          <view class="tab-tit">
            <view :class="(curLang=='en'? 'en ': '') + 'tab-item'" :style="{color:sortType==''?'#F81A1A':''}" @tap="onStsTap('')">
              <text>{{ i18n.default }}</text>
            </view>
            <view :class="'tab-item ' + (sortType=='sales' && (sort==2?'down':'up'))" @tap="onStsTap('sales')">
              <text>{{ i18n.sales }}</text>
            </view>
            <view :class="'tab-item ' + (sortType=='price' && (sort==4?'down':'up'))" @tap="onStsTap('price')">
              <text>{{ i18n.price }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="prodlist-item-cont">
      <block v-for="(prod, prodId) in shopProdList" :key="prodId">
        <prod-item :prod="prod" />
      </block>
    </view>

    <!-- <view v-if="current === pages && current>1" class="tips">{{ i18n.allLoaded }}</view>
    <view v-if="!(shopProdList.length)" class="not-found">
      <image class="not-found-img" src="/static/images/empty-img/not-found.png" mode="" />
      <view class="text"> {{ i18n.noData }}</view>
    </view> -->
    <!-- 空列表或加载全部提示 -->
    <EmptyAllTips
      v-if="isLoaded"
      :emptyImg="2"
      :isEmpty="!shopProdList.length"
      :isAll="current === pages && current > 1"
      :allTips="i18n.allLoaded"
    />

    <shop-tabbar style="position:fixed;bottom:0;width:100%;left:0;right:0;" current-tab="1" />

    <!-- 回到顶部 -->
    <back-top-btn v-if="showBacktop" />
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
import shopTabbar from '../../components/shop-tabbar/index.vue'
import prodItem from '../../components/prod-list-item/index.vue'
import shopHeader from '../../components/shop-header/index.vue'
import backTopBtn from '../../../components/back-top-btn/index.vue'

export default {

  components: {
    shopTabbar,
    prodItem,
    shopHeader,
    backTopBtn
  },
  props: {},
  data() {
    return {
      topFlag: false,
      shopInfo: {},
      shopProdList: [],
      shopId: 0,
      sort: 0,
      orderBy: 1, // 状态点击事件
      current: 1,
      // 当前页
      pages: 0,
      // 总页码
      isAll: false,
      currentTab: true,
      curLang: '',
      scrollTop: '',
      showBacktop: false,
      sortType: '',
      isLoaded: false
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
      shopInfo: wx.getStorageSync('bbcShopInfo'),
      curLang: uni.getStorageSync('bbcLang')
    })
    console.log('页面shopInfo：', this.shopInfo)
    if (options.shopId) {
      this.setData({
        shopId: options.shopId
      })
    } else {
      this.setData({
        shopId: this.shopInfo.shopId
      })
    }
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
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.allCommodities
    })
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
  onReachBottom: function() {
    this.getNextPage()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() { },

  methods: {
    // 页面滚动到指定位置指定元素固定在顶部
    onPageScroll: function(e) {
      this.scrollTop = e.scrollTop
      if (this.scrollTop > 80) {
        this.setData({
          topFlag: true,
          showBacktop: true
        })
      } else if (this.scrollTop < 80) {
        this.setData({
          topFlag: false,
          showBacktop: false
        })
      }
    },

    /**
     * 切换排序
		 * @param {String} sortType 排序类型
     */
    onStsTap: function(sortType) {
      this.sortType = sortType
      if (!sortType) {
        this.sort = 0
      } else if (sortType == 'sales') {
        this.sort = this.sort == 3 ? 2 : 3
      } else if (sortType == 'price') {
        this.sort = this.sort == 5 ? 4 : 5
      }
      uni.pageScrollTo({
        scrollTop: 0, // 距离页面顶部的距离
        duration: 0
      })
      this.setData({
        currentTab: false,
        current: 1,
        pages: 0,
        isAll: false
      })
      this.getShopProds()
    },

    /**
     * 跳转搜索页
     */
    toShopSearchPage: function(e) {
      const shopId = e.currentTarget.dataset.shopid
      uni.navigateTo({
        url: '/package-shop/pages/shop-search/shop-search?shopId=' + shopId
      })
    },

    // 获取店铺商品
    getShopProds() {
      this.isLoaded = false
      const params = {
        url: '/search/page',
        method: 'GET',
        data: {
          shopId: this.shopInfo.shopId,
          sort: this.sort,
          current: this.current,
          orderBy: this.orderBy,
          size: 10,
          isAllProdType: true,
          isActive: 1, // 过滤掉活动商品
          userId:uni.getStorageSync('bbcUserInfo')?uni.getStorageSync('bbcUserInfo').userId:''
        },
        callBack: res => {
          this.isLoaded = true
          var shopProdList = []
          if (this.current == 1) {
            this.setData({
              shopProdList: res.records[0].products,
              pages: res.pages
            })
          } else {
            shopProdList = this.shopProdList
            shopProdList.push(...res.records[0].products)
            this.setData({
              shopProdList
            })
          }
          if (res.pages == res.current) {
            this.isAll = true
          }
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
        this.getShopProds()
      } else {
        this.setData({
          isAll: true
        })
      }
    }
  }
}
</script>
<style>
@import "./shop-prods.css";
</style>
