<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container pages">
    <!-- 搜索框 -->
    <view class="search-bar">
      <view class="search-box">
        <input
          :placeholder="i18n.searchSllShop"
          class="sear-input"
          confirm-type="search"
          :value="prodName"
          @confirm="toSearchProdPage"
          @input="getSearchContent"
        ></input>
        <image src="/static/images/icon/search.png" class="search-img" />
      </view>
      <text class="search-hint" :data-shopid="shopId" @tap="toSearchProdPage">{{ i18n.search }}</text>
    </view>

    <view class="search-display">
      <!-- 热门搜索 -->
      <view v-if="hotSearchList && hotSearchList.length" class="hot-search">
        <view class="title-text">{{ i18n.shopHotSearch }}</view>
        <view class="hot-search-tags">
          <block v-for="(item, index) in hotSearchList" :key="index">
            <text class="tags" :data-name="item.content" @tap="onHistSearch">{{ item.title }}</text>
          </block>
        </view>

      </view>

      <!-- 搜索历史 -->
      <view v-if="recentSearch && recentSearch.length" class="history-search">
        <!-- <view class="title-text history-line">{{ i18n.searchHistory }}<view class="clear-history"> -->
        <!-- #ifdef MP-WEIXIN -->
        <view view :class="{'title-text':true,'history-line':hotSearchList}">{{ i18n.searchHistory }}<view class="clear-history">
          <image src="/static/images/icon/clear-his.png" @tap="clearSearch" />
        </view>
        </view>
        <!--  #endif -->

        <!--  #ifndef MP-WEIXIN -->
        <view view :class="singleList">{{ i18n.searchHistory }}<view class="clear-history">
          <image src="/static/images/icon/clear-his.png" @tap="clearSearch" />
        </view>
        </view>
        <!--  #endif -->
        <block v-for="(item, index) in recentSearch" :key="index">
          <view class="his-search-tags">
            <text class="tags" :data-name="item" @tap="onHistSearch">{{ item }}</text>
          </view>
        </block>
      </view>

      <!-- 历史和热搜列表都为空 -->
      <!-- <view v-if="!(recentSearch && recentSearch.length) && !(hotSearchList && hotSearchList.length)" class="not-found">
        <image class="not-found-img" src="/static/images/empty-img/not-found.png" mode="" />
        <view class="text"> {{ i18n.noData }}</view>
      </view> -->
      <!-- 空列表或加载全部提示 -->
      <EmptyAllTips
        v-if="isLoaded"
        :emptyImg="2"
        :isEmpty="!(recentSearch && recentSearch.length) && !(hotSearchList && hotSearchList.length)"
      />

    </view>
    <shop-tabbar style="position:fixed;bottom:0;width:100%;left:0;right:0;" current-tab="3" />
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
import shopTabbar from '../../components/shop-tabbar/index.vue'

export default {

  components: {
    shopTabbar
  },
  props: {},
  data() {
    return {
      hotSearchList: [],
      prodName: '',
      recentSearch: [],
      shopId: uni.getStorageSync('bbcShopInfo').shopId,
      isLoaded: false
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    },
    // 当只有搜索历史时，取消分割线
    singleList() {
      return {
        'title-text': true,
        'history-line': (this.hotSearchList && this.hotSearchList.length)
      }
    }
  },

  /**
		 * 生命周期函数--监听页面加载
		 */
  onLoad: function(options) {
    this.getHotSearch()
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
      title: this.i18n.storeSearch
    })

    // 获取搜索历史
    this.getRecentSearch()
  },

  /**
		 * 生命周期函数--监听页面隐藏
		 */
  onHide: function() {
    this.prodName = ''
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
    // 热门搜索
    getHotSearch() {
      this.isLoaded = false
      var ths = this
      const params = {
        url: '/search/hotSearchByShopId',
        method: 'GET',
        data: {
          number: 10,
          sort: 1,
          shopId: this.shopId
        },
        callBack: (res) => {
          this.isLoaded = true
          ths.setData({
            hotSearchList: res
          })
        }
      }
      http.request(params)
    },

    /**
			 * 获取历史搜索
			 */
    getRecentSearch: function() {
      const recentSearch = wx.getStorageSync('bbc' + this.shopId + 'recentSearch')
      this.setData({
        recentSearch
      })
    },

    /**
			 * 搜索提交
			 */
    toSearchProdPage: function() {
      // 判断搜索框是否为空
      if (!this.prodName.trim()) {
        uni.showToast({
          title: this.i18n.inpKeyWords,
          icon: 'none'
        })
        return
      }
      // 记录最近搜索
      let recentSearch = wx.getStorageSync('bbc' + this.shopId + 'recentSearch') || []
      recentSearch = recentSearch.filter(item => item !== this.prodName)
      recentSearch.unshift(this.prodName)
      if (recentSearch.length > 10) {
        recentSearch.pop()
      }
      wx.setStorageSync('bbc' + this.shopId + 'recentSearch', recentSearch)
      // 跳转到商品列表页
      uni.navigateTo({
        url: '/package-shop/pages/shop-search-result/shop-search-result?prodName=' + this.prodName
      })
    },

    /**
			 * 清空搜索历史
			 */
    clearSearch: function() {
      wx.removeStorageSync('bbc' + this.shopId + 'recentSearch')
      this.getRecentSearch()
    },
    // 输入商品名获取数据 || 绑定输入值
    getSearchContent: function(e) {
      this.setData({
        prodName: e.detail.value.trim()
      })
    },
    // 点击搜素历史
    onHistSearch: function(e) {
      var name = e.currentTarget.dataset.name
      this.setData({
        prodName: name
      })
      this.toSearchProdPage()
    }
  }
}
</script>
<style>
	@import "./shop-search.css";
</style>
