<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <!-- 搜索框 -->
    <view class="fixed-box">
      <view class="search-bar">
        <view class="search-box">
          <input
            class="sear-input"
            :placeholder="i18n.inpKeyWords"
            :value="shopName"
            confirm-type="search"
            @input="getSearchContent"
            @confirm="toSearchConfirm"
          ></input>
          <image src="/static/images/icon/search.png" class="search-img" />
        </view>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="prod-list">
      <!-- 横向列表 -->
      <view class="cont-item">
        <block v-for="(item, index) in searchShopList" :key="index">
          <view class="prod-items" @tap="toShopPage(item)">
            <view class="hot-imagecont">
              <ImgShow :src="item.shopLogo" :classList="['hotsaleimg']" />
            </view>
            <view class="hot-text">
              <view class="hotprod-text">{{ item.shopName }}</view>
              <view class="prod-text-info">
                <view class="fan">{{ item.fansCount }}{{ i18n.peopleConcerned }}</view>
                <view class="into">{{ i18n.lookShop }}</view>
              </view>
            </view>
          </view>
        </block>
      </view>

      <!-- 纵向列表 -->
      <!-- <view class="cont-item" v-if="showType==2">
      <block v-for="(item, index) in searchShopList" :key="index">
        <view class="show-item" @tap="toShopPage" :data-shopid="item.shopId">
          <view class="more-prod-pic">
            <image :src="item.shopLogo" class="more-pic"></image>
          </view>
          <view class="prod-text-right">
            <view class="prod-text more">{{item.shopName}}</view>
            <view class="prod-price more">{{item.intro}}</view>
            <view class="prod-price more" v-if="item.prodCount">商品数量：{{item.prodCount}}</view>
          </view>
        </view>
      </block>
    </view> -->
    </view>

    <!-- 空列表或加载全部提示 -->
    <EmptyAllTips
      v-if="isLoaded"
      :isEmpty="!searchShopList.length"
      :isAll="loadAll"
    />

    <!-- 回到顶部 -->
    <view class="promo-con">
      <view v-if="showBacktop" class="suspension-btn" @tap="handleScorllTop">
        <image src="/static/images/icon/back-to-top.png" />
      </view>
    </view>
    <!-- 回到顶部 end-->

  </view>
</template>

<script>
const http = require('../../../utils/http.js')

export default {
  props: {},
  data() {
    return {
      sts: 0,
      showType: 2,
      searchShopList: [],
      shopName: '',
      pages: 0,
      current: 1,
      size: 20,
      loadAll: false,
      scrollTop: '',
      showBacktop: false,
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
      shopName: decodeURI(options.shopName)
    })
    this.toLoadData()
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
      title: this.i18n.shopSearch
    })
  },

  /**
		 * 生命周期函数--监听页面隐藏
		 */
  onHide: function() {},

  /**
		 * 生命周期函数--监听页面卸载
		 */
  onUnload: function() {},

  /**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
  onPullDownRefresh: function() {},

  /**
		 * 页面上拉触底事件的处理函数
		 */
  onReachBottom: function() {
    if (this.current < this.pages) {
      this.setData({
        current: this.current + 1
      })
      this.toLoadData()
    }
  },

  /**
		 * 用户点击右上角分享
		 */
  onShareAppMessage: function() {},
  methods: {
    // 页面滚动到指定位置指定元素固定在顶部
    onPageScroll: function(e) {
      this.scrollTop = e.scrollTop
      if (this.scrollTop > 200) {
        this.setData({
          showBacktop: true
        })
      } else if (this.scrollTop < 200) {
        this.setData({
          showBacktop: false
        })
      }
    },

    /**
			 * 回到页面顶部
			 */
    handleScorllTop() {
      uni.pageScrollTo({
        duration: 100,
        scrollTop: 0
      })
    },

    changeShowType: function() {
      var showType = this.showType

      if (showType == 1) {
        showType = 2
      } else {
        showType = 1
      }

      this.setData({
        showType: showType
      })
    },
    // 输入名称获取数据
    getSearchContent: function(e) {
      this.setData({
        shopName: e.detail.value
      })
    },

    /**
			 * 请求店铺列表接口
			 */
    toLoadData: function() {
      this.isLoaded = false
      const params = {
        url: '/shop/searchShops',
        method: 'GET',
        data: {
          current: this.current,
          size: this.size,
          shopName: this.shopName.trim() || this.$route.query.shopName.trim()
        },
        callBack: (res) => {
          this.isLoaded = true
          let list = []

          if (res.current == 1) {
            list = res.records
          } else {
            list = this.searchShopList
            list = list.concat(res.records)
          }
          if (res.pages == res.current) {
            this.setData({
              loadAll: true
            })
          }
          this.setData({
            searchShopList: list,
            pages: res.pages
          })
        }
      }
      http.request(params)
    },

    // 当前搜索页二次搜索商品
    toSearchConfirm: function(e) {
      // 搜索栏为空时
      if (this.shopName === '' || !this.shopName.trim()) {
        uni.showToast({
          title: this.i18n.inpKeyWords,
          duration: 1000,
          icon: 'none'
        })
        return
      }
      // 店铺搜索关键字
      let recentShopSearch = uni.getStorageSync('bbcRecentShopSearch') || []
      recentShopSearch = recentShopSearch.filter(item => item !== e.detail.value)
      recentShopSearch.unshift(e.detail.value)
      if (recentShopSearch.length > 10) {
        recentShopSearch.pop()
      }
      // 将历史放到缓存中
      uni.setStorageSync('bbcRecentShopSearch', recentShopSearch)
      uni.redirectTo({
        url: '/package-search/pages/search-shop-show/search-shop-show?shopName=' + e.detail.value
      })
    },

    toShopPage: function(shopInfo) {
      // 缓存店铺的数据
      uni.setStorageSync('bbcShopInfo', shopInfo)
      if (shopInfo.renovationId) {
        uni.navigateTo({
          url: '/package-shop/pages/feature-index/feature-index0?shopId=' + shopInfo.shopId + '&renovationId=' + shopInfo.renovationId
        })
      } else {
        uni.navigateTo({
          url: '/package-shop/pages/shop-page/shop-page?shopId=' + shopInfo.shopId
        })
      }
    }
  }
}
</script>
<style>
	@import "./search-shop-show.css";
</style>
