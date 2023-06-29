<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <!-- 搜索框 -->
    <view class="search-bar">
      <view class="select-theme" @tap="changeShopOrProd">
        <view class="select">
          <text>{{ selectItem == 0? i18n.shop : i18n.commodity }}</text>
          <image src="/static/images/icon/switch.png" class="arrow" />
        </view>
      </view>
      <view class="search-box">
        <input
          :placeholder="i18n.enterKeywordSearch"
          class="sear-input"
          confirm-type="search"
          :value="searchKey"
          @confirm="toSearchProdPage"
          @input="getSearchContent"
        />
        <image src="/static/images/icon/search.png" class="search-img" />
      </view>
      <text class="search-hint" @tap="goBackIndex">{{ i18n.cancel }}</text>
    </view>

    <view class="search-display">
      <!-- 热门搜索 -->
      <view v-if="(selectItem == 1 && hotProdSearchList.length) || (selectItem == 0 && hotShopSearchList.length)" class="hot-search">
        <view class="title-text">{{ i18n.popularSearches }}</view>
        <view class="hot-search-tags">
          <block v-if="selectItem == 1 && hotProdSearchList.length">
            <block v-for="(item, index) in hotProdSearchList" :key="index">
              <text class="tags" :data-name="item.content" @tap="onHistSearch">{{ item.title }}</text>
            </block>
          </block>
          <block v-if="selectItem == 0 && hotShopSearchList.length">
            <block v-for="(item, index) in hotShopSearchList" :key="index">
              <text class="tags" :data-name="item.shopName" @tap="onHistSearch">{{ item.shopName }}</text>
            </block>
          </block>
        </view>

      </view>

      <!-- 搜索历史 -->
      <view v-if="(recentProdSearch && recentProdSearch.length > 0 && selectItem == 1) || (recentShopSearch && recentShopSearch.length > 0 && selectItem == 0)" class="history-search">
        <view class="title-text history-line" :style="{borderTop:((selectItem == 0 && hotShopSearchList.length) || (selectItem == 1 && hotProdSearchList.length) ? '2rpx solid #e1e1e1;': 'none')}">{{ i18n.searchHistory }}
          <view class="clear-history">
            <image src="/static/images/icon/clear-his.png" @tap="clearSearch" />
          </view>
        </view>
        <!-- 商品 -->
        <block v-if="recentProdSearch && recentProdSearch.length > 0">
          <block v-for="(item, index) in recentProdSearch" :key="index">
            <view v-if="selectItem == 1" class="his-search-tags">
              <text class="tags" :data-name="item" @tap="onHistSearch">{{ item }}</text>
            </view>
          </block>
        </block>
        <!-- 店铺 -->
        <block v-if="recentShopSearch && recentShopSearch.length > 0">
          <block v-for="(item, index) in recentShopSearch" :key="index">
            <view v-if="selectItem == 0" class="his-search-tags">
              <text class="tags" :data-name="item" @tap="onHistSearch">{{ item }}</text>
            </view>
          </block>
        </block>
      </view>
      <!-- <view v-if="(selectItem == 1 && !hotProdSearchList.length && !recentProdSearch.length) || (selectItem == 0 && !hotShopSearchList.length && !recentShopSearch.length)" class="not-found">
        <image class="not-found-img" src="/static/images/empty-img/not-found.png" mode="" />
        <view class="text"> {{ i18n.noData }}</view>
      </view> -->
      <!-- 空列表或加载全部提示 -->
      <EmptyAllTips
        v-if="isLoaded"
        :emptyImg="2"
        :isEmpty="(selectItem == 1 && !hotProdSearchList.length && !recentProdSearch.length) || (selectItem == 0 && !hotShopSearchList.length && !recentShopSearch.length)"
      />
    </view>
  </view>
</template>

<script>
const http = require('../../../utils/http.js')

export default {

  components: {},
  props: {},
  data() {
    return {
      hotProdSearchList: [], // 商品热搜
      hotShopSearchList: [], // 店铺
      searchKey: '', // 搜索关键字
      recentShopSearch: [], // 店铺搜索历史
      recentProdSearch: [], // 商品搜索历史
      selectItem: 1, // 选择搜索店铺或者搜索商品 0店铺 1商品
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
  onLoad: function(options) {},

  /**
		 * 生命周期函数--监听页面初次渲染完成
		 */
  onReady: function() {},

  /**
		 * 生命周期函数--监听页面显示
		 */
  onShow: function() {
    // 加载导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.search
    })
    // 商品热搜
    this.prodHotSearch()
    // 店铺热搜
    this.shopHotSearch()
    // 获取搜索历史
    this.getRecentSearch()
  },

  /**
		 * 生命周期函数--监听页面隐藏
		 */
  onHide: function() {
    this.searchKey = ''
  },

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
  onReachBottom: function() {},

  /**
		 * 用户点击右上角分享
		 */
  onShareAppMessage: function() {},
  methods: {
    /**
			 * 改变选择店铺搜索或者商品搜索
			 */
    changeShopOrProd: function() {
      // 选择搜索店铺或者搜索商品 0店铺 1商品
      this.selectItem == 0 ? this.selectItem = 1 : this.selectItem = 0
    },

    /**
			 * 商品热搜
			 */
    prodHotSearch: function() {
      this.isLoaded = false
      const params = {
        url: '/search/hotSearch',
        method: 'GET',
        data: {
          number: 10,
          sort: 1
        },
        callBack: (res) => {
          this.isLoaded = true
          this.hotProdSearchList = res
        }
      }
      http.request(params) // 获取历史搜索
    },
    // 店铺热搜
    shopHotSearch: function() {
      this.isLoaded = false
      const params = {
        url: '/shop/hotShops',
        method: 'GET',
        data: {},
        callBack: (res) => {
          this.isLoaded = true
          this.hotShopSearchList = res
        }
      }
      http.request(params) // 获取历史搜索
    },

    /**
			 * 搜索店铺(商品)提交
			 */
    toSearchProdPage: function() {
      // this.searchKey = encodeURIComponent(this.searchKey)
      // 判断搜索框是否为空
      if (this.searchKey === '' || !this.searchKey.trim()) {
        uni.showToast({
          title: this.i18n.inpKeyWords,
          icon: 'none'
        })
        return
      }
      if (this.selectItem == 0) {
        // 记录最近搜索(搜索历史)
        // 店铺搜索关键字
        let recentShopSearch = uni.getStorageSync('bbcRecentShopSearch') || []
        recentShopSearch = recentShopSearch.filter(item => item !== this.searchKey)
        recentShopSearch.unshift(this.searchKey)
        if (recentShopSearch.length > 10) {
          recentShopSearch.pop()
        }
        // 将历史放到缓存中
        uni.setStorageSync('bbcRecentShopSearch', recentShopSearch)
        uni.navigateTo({
          url: '/package-search/pages/search-shop-show/search-shop-show?shopName=' + this.searchKey
        })
      } else if (this.selectItem == 1) {
        // 商品搜索关键字
        let recentProdSearch = uni.getStorageSync('bbcRecentProdSearch') || []
        recentProdSearch = recentProdSearch.filter(item => item !== this.searchKey)
        recentProdSearch.unshift(this.searchKey)
        if (recentProdSearch.length > 10) {
          recentProdSearch.pop()
        }
        // 将历史放到缓存中
        uni.setStorageSync('bbcRecentProdSearch', recentProdSearch)
        // 跳转到商品(店铺)列表页
        uni.redirectTo({
          url: '/package-search/pages/search-prod-show/search-prod-show?prodName=' + this.searchKey
        })
      }
    },

    /**
			 * 获取历史搜索
			 */
    getRecentSearch: function() {
      const recentShopSearch = wx.getStorageSync('bbcRecentShopSearch')
      const recentProdSearch = wx.getStorageSync('bbcRecentProdSearch')
      this.setData({
        recentShopSearch,
        recentProdSearch
      })
    },

    /**
			 * 清空搜索历史
			 */
    clearSearch: function() {
      if (!this.selectItem) {
        wx.removeStorageSync('bbcRecentShopSearch')
      } else {
        wx.removeStorageSync('bbcRecentProdSearch')
      }
      this.getRecentSearch()
    },
    // 返回首页
    goBackIndex: function() {
      uni.navigateBack({
        // url: '/package-search/pages/search-page/search-page',
      })
    },
    // 输入商品名获取数据 || 绑定输入值
    getSearchContent: function(e) {
      this.setData({
        searchKey: e.detail.value
      }) // this.data.searchKey=e.detail.value
    },
    // 点击搜素历史
    onHistSearch: function(e) {
      var name = e.currentTarget.dataset.name
      this.setData({
        searchKey: name
      })
      this.toSearchProdPage()
    }
  }
}
</script>
<style>
	@import "./search-page.css";
</style>
