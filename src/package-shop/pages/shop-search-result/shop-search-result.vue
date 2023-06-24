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
            :value="prodName"
            confirm-type="search"
            :placeholder="i18n.searchSllShop"
            @input="getSearchContent"
            @confirm="toSearchConfirm"
          ></input>
          <image src="/static/images/icon/search.png" class="search-img" />
        </view>
        <view class="search-list-img" @tap="changeShowType">
          <image v-if="showType==1" src="/static/images/icon/search-col.png" />
          <image v-if="showType==2" src="/static/images/icon/search-col2.png" />
        </view>
      </view>
      <view class="tabs">
        <view :class="(curLang=='en'? 'en ': '') + 'tab-item complete'" :style="{color:sortType==''?'#F81A1A':''}" @tap="onStsTap('')">{{ i18n.default }}</view>
        <view :class="'tab-item ' + (sortType=='sales' && (sts==2?'down':'up'))" @tap="onStsTap('sales')">{{ i18n.sales }}</view>
        <view :class="'tab-item ' + (sortType=='price' && (sts==4?'down':'up'))" @tap="onStsTap('price')">{{ i18n.price }}</view>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="prod-list">
      <!-- 纵向列表 -->
      <view v-if="showType==1" class="prod-show">
        <view class="hotsale-item-cont">
          <block v-for="(item, index) in searchProdList" :key="index">
            <prod :item="item" sts="6" />
          </block>
        </view>
      </view>

      <!-- 横向列表 -->
      <view v-if="showType==2" class="cont-item">
        <block v-for="(item, index) in searchProdList" :key="index">
          <view class="show-item" @tap="toProdPage(item.prodId)">
            <view class="more-prod-pic">
              <ImgShow :src="item.pic" :classList="['more-pic']" />
            </view>
            <view class="prod-text-right">
              <view class="prod-text more">
                <view v-if="item.activityInProgress && item.prodType != 0" class="activity-box">
                  <view class="activity">
                    {{ item.prodType === 1 ? i18n.prodType2 : i18n.prodType3 }}
                  </view>
                </view>
                {{ item.prodName }}</view>
              <view class="cate-prod-info">{{ item.commentNum }}{{ i18n.evaluation }} {{ item.positiveRating }}%{{ i18n.praise }}</view>
              <view class="prod-price more">
                <text class="symbol">￥</text>
                <text class="big-num">{{ parsePrice(item.price)[0] }}</text>
                <text class="small-num">.{{ parsePrice(item.price)[1] }}</text>
                <text v-if="item.soldNum || item.soldNum === 0" class="cate-prod-info sold-num">{{ i18n.sold }} {{ item.soldNum }}</text>
              </view>
            </view>
          </view>
        </block>
      </view>
    </view>

    <!-- 空列表或加载全部提示 -->
    <EmptyAllTips
      v-if="isLoaded"
      :isEmpty="searchProdList.length==0"
      :emptyTips="i18n.noProducts"
      :isAll="current == pages"
    />
    <!-- 回到顶部 -->
    <back-top-btn v-if="showBacktop" />
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
import prod from '../../../components/production/index.vue'
import backTopBtn from '../../../components/back-top-btn/index.vue'

export default {

  components: {
    prod,
    backTopBtn
  },
  props: {},
  data() {
    return {
      sts: 0,
      showType: 2,
      searchProdList: [],
      prodName: '',
      shopId: undefined,
      current: 1,
      pages: 0,
      orderBy: 1, // 状态点击事件
      curLang: 'en', // 当前语言
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
    if (options.shopId) {
      this.setData({
        shopId: options.shopId
      })
    } else {
      this.setData({
        shopId: uni.getStorageSync('bbcShopInfo').shopId
      })
    }

    this.setData({
      prodName: decodeURI(options.prodName),
      curLang: uni.getStorageSync('bbcLang')
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
      title: this.i18n.storeSearchResults
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
    // 店铺搜索结果分页
    if (this.current < this.pages) {
      this.current = this.current + 1
      this.toLoadData()
    }
  },

  /**
       * 用户点击右上角分享
       */
  onShareAppMessage: function() {},
  // 页面滚动到指定位置指定元素固定在顶部
  onPageScroll: function(e) {
    this.scrollTop = e.scrollTop
    if (this.scrollTop > 80) {
      this.setData({
        showBacktop: true
      })
    } else if (this.scrollTop < 80) {
      this.setData({
        showBacktop: false
      })
    }
  },
  methods: {
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
    // 输入商品获取数据
    getSearchContent: function(e) {
      this.setData({
        prodName: e.detail.value
      })
    },
    // 请求商品接口
    toLoadData: function() {
      var ths = this // 热门搜索
      this.isLoaded = false
      const params = {
        // url: "/search/searchProdPage",
        url: '/search/page',
        method: 'GET',
        data: {
          current: this.current,
          keyword: this.prodName,
          size: 10,
          sort: this.sts,
          orderBy: this.orderBy,
          shopId: this.shopId,
          isAllProdType: true,
          isActive: 1, // 过滤掉活动商品
          userId:uni.getStorageSync('bbcUserInfo')?uni.getStorageSync('bbcUserInfo').userId:''
        },
        callBack: (res) => {
          this.isLoaded = true
          console.log(res)
          var temp = []
          if (params.data.current == 1) {
            temp = res.records[0].products
          } else {
            temp = ths.searchProdList.concat(res.records[0].products)
          }
          ths.setData({
            searchProdList: temp,
            pages: res.pages
          })
        }
      }
      http.request(params)
    },
    // 当前搜索页二次搜索商品
    toSearchConfirm: function() {
      // 搜索栏为空时
      if (this.prodName === '' || !this.prodName.trim()) {
        uni.showToast({
          title: this.i18n.inpKeyWords,
          icon: 'none'
        })
        return
      }
      let recentSearch = wx.getStorageSync('bbc' + this.shopId + 'recentSearch') || []
      recentSearch = recentSearch.filter(item => item !== this.prodName)
      recentSearch.unshift(this.prodName)
      if (recentSearch.length > 10) {
        recentSearch.pop()
      }
      wx.setStorageSync('bbc' + this.shopId + 'recentSearch', recentSearch)

      this.current = 1
      uni.pageScrollTo({
        duration: 100,
        scrollTop: 0
      })
      this.toLoadData()
    },

    /**
         * 状态点击事件
         * @param {String} sortType 排序类型
         */
    onStsTap: function(sortType) {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
      // var sts = e.currentTarget.dataset.sts;
      // this.orderBy = this.sts == sts ? this.orderBy == 0 ? 1 : 0 : this.orderBy
      this.sortType = sortType
      if (!sortType) {
        this.sts = 0
      } else if (sortType == 'sales') {
        this.sts = this.sts == 3 ? 2 : 3
      } else if (sortType == 'price') {
        this.sts = this.sts == 5 ? 4 : 5
      }
      this.setData({
        current: 1,
        pages: 1
      })
      this.toLoadData()
    },
    toProdPage: function(prodId) {
      this.$Router.push({ path: '/package-prod/pages/prod/prod', query: { prodId }})
    }
  }
}
</script>
<style scoped>
  @import "./shop-search-result.css";
</style>
