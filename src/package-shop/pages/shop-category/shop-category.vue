<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <!-- 店铺信息 -->
    <view>
      <shopHeader :shop-id="shopInfo.shopId" />
    </view>

    <!-- 头部搜索区 -->
    <view class="search-bar">
      <view class="search-box" @tap="toShopSearchPage">
        <image src="/static/images/icon/search.png" class="search-img" />
        <text class="sear-input">{{ i18n.searchForItems }}</text>
      </view>
    </view>
    <!-- 滚动内容区 -->
    <view :class="isEn ? 'main-en' : 'main'">
      <!-- 左侧菜单start -->
      <scroll-view scroll-y="true" :class="isEn ? 'leftmenu-en' : 'leftmenu'">
        <block v-for="(item, index) in shopCategoryList" :key="index">
          <view :class="'menu-item ' + (selIndex==index?'active':'')" :data-index="index" :data-categoryid="item.categoryId" @tap="onMenuTab">
            <text class="menu-text">{{ item.categoryName }}</text>
          </view>
        </block>
      </scroll-view>
      <!-- 左侧菜单end -->

      <!-- 右侧内容start -->
      <scroll-view scroll-y="true" class="rightcontent" lower-threshold="200" :scroll-top="prodListScrollTop" @scrolltolower="loadNextPage">
        <view class="cont-item">
          <block v-for="(prod, index) in prodList" :key="index">
            <view class="show-item"@tap="toProdPage(prod.prodId)">
              <view class="more-prod-pic">
                <image v-if="prod.pic" :src="prod.pic" class="more-pic" @error="handlePicError(index)" />
                <image v-else src="/static/images/icon/def.png" class="more-pic" />
              </view>
              <view class="prod-text-right">
                <view class="prod-text more">
                  <view v-if="prod.activityInProgress && prod.prodType != 0" class="activity-box">
                    <view class="activity">
                      {{ prodTypeArr[prod.prodType] }}
                    </view>
                  </view>
                  {{ prod.prodName }}
                </view>
                <view class="cate-prod-info">{{ prod.brief === null ? "" : prod.brief }}</view>
                <view class="prod-price more">
                  <text class="symbol">￥</text>
                  <text class="big-num">{{ prod.price }}</text>
                </view>
              </view>
            </view>
          </block>
          <!-- <view v-if="prodList.length==0" class="empty-tips">{{ i18n.noProductsTips }}</view> -->
          <!-- 空列表或加载全部提示 -->
          <EmptyAllTips
            v-if="isLoaded"
            :isEmpty="prodList.length==0"
            :emptyTips="i18n.noProductsTips"
          />
        </view>
      </scroll-view>
    <!-- 右侧内容end -->

    </view>
    <shop-tabbar style="position:fixed;bottom:0;width:100%;left:0;right:0;" current-tab="2" />
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
import shopTabbar from '../../components/shop-tabbar/index.vue'
import shopHeader from '../../components/shop-header/index.vue'
export default {
  components: {
    shopTabbar,
    shopHeader
  },
  props: {},
  data() {
    return {
      shopInfo: {},
      shopCategoryList: [],
      selIndex: 0,
      prodList: [],
      categoryLength: 0,
      shopCategoryId: 0,
      current: 1,
      pages: 0,
      prodListScrollTop: 0,
      isEn: uni.getStorageSync('bbcLang') == 'en',
      currentCategorId: '',
      isLoaded: false
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    },
    prodTypeArr() {
      return [
        this.i18n.prodType1,
        this.i18n.prodType2,
        this.i18n.prodType3,
        this.i18n.prodType4
      ]
    }
  },
  watch: {
    prodListScrollTop() {
      console.log(this.prodListScrollTop)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const { link } = options
    this.setData({
      shopInfo: wx.getStorageSync('bbcShopInfo'),
      currentCategorId: link
    })
    this.getShopCategory()
    this.getProdListByCategoryId()
    // shopCategoryList
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
      title: this.i18n.commodityClassification
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
  onReachBottom: function() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() { },
  methods: {
    // 跳转进来
    redirectToPage() {
      this.shopCategoryList.forEach((item, index) => {
        if (item.categoryId == this.currentCategorId) {
          this.setData({
            selIndex: index,
            shopCategoryId: item.categoryId,
            current: 1,
            pages: 0,
            prodListScrollTop: 0 })
        }
      })
    },
    // 加载下一页
    loadNextPage() {
      if (this.current < this.pages) {
        this.current = this.current + 1
        this.getProdListByCategoryId()
      }
    },
    // 跳转店内搜索页
    toShopSearchPage: function() {
      uni.navigateTo({
        url: '/package-shop/pages/shop-search/shop-search?shopId=' + this.shopInfo.shopId
      })
    },
    // 分类点击事件
    onMenuTab: function(e) {
      const categoryId = e.currentTarget.dataset.categoryid
      const {
        index
      } = e.currentTarget.dataset
      this.setData({
        selIndex: index,
        shopCategoryId: categoryId,
        current: 1,
        pages: 0,
        prodListScrollTop: 0
      })
      this.getProdListByCategoryId()
    },
    // 获取店内分类列表

    getShopCategory: function() {
      const shopId = this.shopInfo.shopId
      const params = {
        url: '/category/categoryInfo',
        method: 'GET',
        data: {
          shopId,
          userId:uni.getStorageSync('bbcUserInfo')?uni.getStorageSync('bbcUserInfo').userId:''
        },
        callBack: res => {
          if (res.length === 0) return
          // 添加长度标识
          res.forEach((item, index) => {
            item.categoryLength = item.categoryName.length
          })
          this.setData({
            shopCategoryList: res,
            shopCategoryId: res[0].categoryId
          })
          this.redirectToPage()
          this.getProdListByCategoryId()
        }
      }
      http.request(params)
    },

    // 根据店铺分类id获取商品
    getProdListByCategoryId() {
      this.isLoaded = false
      const params = {
        // url: '/search/searchProdPage',
        url: '/search/page',
        method: 'GET',
        data: {
          shopCategoryId: this.shopCategoryId,
          shopId: this.shopInfo.shopId,
          current: this.current || 1,
          // 新增参数
          isAllProdType: true,
          size: 20,
          sort: 0,
          isActive: 1, // 过滤掉活动商品
          userId:uni.getStorageSync('bbcUserInfo')?uni.getStorageSync('bbcUserInfo').userId:''
        },
        callBack: res => {
          this.isLoaded = true
          var list = []
          if (params.data.current == 1) {
            list = res.records[0].products
          } else {
            list = this.prodList.concat(res.records[0].products)
          }
          this.setData({
            prodList: list,
            pages: res.pages
          })
        }
      }
      http.request(params)
    },

    // 跳转商品详情页
    toProdPage: function(prodId) {
      this.$Router.push({ path: '/package-prod/pages/prod/prod', query: { prodId }})
    },
    // 图片加载失败时显示默认图片
    handlePicError(index) {
      console.log(1)
      this.prodList[index].pic = '/static/images/icon/def.png'
    }
  }
}
</script>
<style>
@import "./shop-category.css";
</style>
