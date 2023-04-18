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
            :value="prodName"
            confirm-type="search"
            @input="getSearchContent"
            @confirm="toSearchConfirm"
          >
          <image src="/static/images/icon/search.png" class="search-img" />
        </view>
        <view class="search-list-img" @tap="changeShowType">
          <image v-if="showType==1" src="/static/images/icon/search-col.png" />
          <image v-if="showType==2" src="/static/images/icon/search-col2.png" />
        </view>
      </view>
      <view class="tabs">
        <view :class="'tab-item '" :style="{color:sortType==''?'#F81A1A':''}" data-sts="0" @tap="onStsTap('')">{{ i18n.Comprehensive }}</view>
        <view :class="'tab-item ' + (sortType=='sales' && (sts==2?'down':'up'))" @tap="onStsTap('sales')">{{ i18n.sales }}</view>
        <view :class="'tab-item ' + (sortType=='price' && (sts==4?'down':'up'))" @tap="onStsTap('price')">{{ i18n.price }}</view>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="prod-list">
      <!-- 横向列表 -->
      <view v-if="showType==1" class="prod-show">
        <view class="hotsale-item-cont">
          <block v-for="(item, index) in searchProdList" :key="index">
            <prod :item="item" sts="6" />
          </block>
        </view>
      </view>

      <!-- 纵向列表 -->
      <view v-if="showType==2" class="cont-item">
        <block v-for="(item, index) in searchProdList" :key="index">
          <view class="show-item" @tap="toProdDetail(item.prodId)">
            <view class="more-prod-pic">
              <image v-if="item.pic" :src="item.pic" class="more-pic" @error="handlePicError(index)" />
              <image v-else src="/static/images/icon/def.png" mode="aspectFit" class="more-pic" />
            </view>
            <view class="prod-text-right">
              <view v-if="item.prodName" class="prod-text more">
                <view class="activity-box">
                  <view v-if="item.shopId === 1" class="activity">{{ i18n.selfEmployed }}</view>
                  <block v-if="item.activityInProgress && item.prodType != 0">
                    <view v-if="item.prodType != 1" class="activity">
                      {{ prodTypeArr[item.prodType] }}
                    </view>
                    <view v-else class="activity">
                      {{ item.groupActivitySearchVO.groupNumber }}{{ i18n.join }}
                    </view>
                  </block>
                </view>
                {{ item.prodName }}
              </view>
              <view class="cate-prod-info">{{ item.commentNum || 0 }}{{ i18n.evaluation }} {{ item.positiveRating }}%{{ i18n.praise }}</view>
              <view class="prod-price more">
                <text class="symbol">￥</text>
                <text class="big-num">{{ parsePrice(item.activityInProgress && item.prodType != 0 ? item.activityPrice :item.price)[0] }}</text>
                <text class="small-num">.{{ parsePrice(item.activityInProgress && item.prodType != 0 ? item.activityPrice :item.price)[1] }}</text>
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
      :isEmpty="!searchProdList.length"
      :emptyTips="i18n.noProducts"
      :isAll="loadAll"
    />

    <!-- 回到顶部 -->
    <back-top-btn v-if="showBacktop" />
  </view>
</template>

<script>
const http = require('../../utils/http.js')
import prod from '../../components/production/index.vue'
import backTopBtn from '../../components/back-top-btn/index.vue'

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
      pages: 0,
      current: 1,
      size: 20,
      orderBy: 1, // 排序(0升序 1降序)
      loadAll: false, // 是否加载完成
      scrollTop: '',
      showBacktop: false,
      sortType: '',
      prodTypeArr: [],
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
      prodName: decodeURI(options.prodName)
    })
    this.toLoadData()
    this.prodTypeArr = [
      this.i18n.prodType1,
      this.i18n.prodType2,
      this.i18n.prodType3,
      this.i18n.prodType4
    ]
  },

  /**
		 * 生命周期函数--监听页面初次渲染完成
		 */
  onReady: function() {},

  /**
		 * 生命周期函数--监听页面显示
		 */
  onShow: function() {
    // 设置头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.searchResult
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
    } else {
      if (!this.pages) {
        return
      }
      this.loadAll = true
    }
  },

  /**
		 * 用户点击右上角分享
		 */
  onShareAppMessage: function() {},
  methods: {
    handlePicError(index) {
      console.log(index)
      this.searchProdList[index].pic = '../../static/images/icon/def.png'
    },
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
      if (!e.detail.value) {
        uni.redirectTo({
          url: '/pages/search-page/search-page'
        })
      }
      this.setData({
        prodName: e.detail.value
      })
    },
    // 请求商品接口
    toLoadData: function() {
      var ths = this // 热门搜索
      const data = {
        current: this.current,
        keyword: this.prodName || this.$route.query.prodName,
        size: this.size,
        sort: this.sts || null,
        orderBy: this.sts ? this.orderBy : null,
        isAllProdType: true,
        isActive: 1 // 过滤掉活动商品
      }
      this.isLoaded = false
      const params = {
        url: '/search/page',
        method: 'GET',
        data: this.removeNullUndefined(data),
        callBack: (res) => {
          this.isLoaded = true
          let list = []
          if (params.data.current == 1) {
            list = res.records[0].products
          } else {
            list = ths.searchProdList
            list = ths.searchProdList.concat(res.records[0].products)
          }
          ths.setData({
            searchProdList: list,
            pages: res.pages
          })

          if (res.pages == res.current && res.pages) {
            ths.setData({
              loadAll: true
            })
          }
        }
      }
      http.request(params)
    },
    // 当前搜索页二次搜索商品
    toSearchConfirm: function(e) {
      if (this.prodName === '' || !this.prodName.trim()) {
        uni.showToast({
          title: this.i18n.inpKeyWords,
          duration: 1000,
          icon: 'none'
        })
        return
      }
      // 商品搜索关键字
      let recentProdSearch = uni.getStorageSync('bbcRecentProdSearch') || []
      recentProdSearch = recentProdSearch.filter(item => item !== e.detail.value)
      recentProdSearch.unshift(e.detail.value)
      if (recentProdSearch.length > 10) {
        recentProdSearch.pop()
      }
      // 将历史放到缓存中
      uni.setStorageSync('bbcRecentProdSearch', recentProdSearch)
      uni.redirectTo({
        url: '/pages/search-prod-show/search-prod-show?prodName=' + e.detail.value
      })
    },

    /**
			 * 切换排序
			 * @param {String} sortType 排序类型
			 */
    onStsTap: function(sortType) {
      this.sortType = sortType
      if (!sortType) {
        this.sts = 0
      } else if (sortType == 'sales') {
        this.sts = this.sts == 3 ? 2 : 3
      } else if (sortType == 'price') {
        this.sts = this.sts == 5 ? 4 : 5
      }
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
      this.setData({
        current: 1,
        pages: 1
      })
      this.toLoadData()
    },
    toProdDetail: function(prodId) {
      this.$Router.push({
        path: '/pages/prod/prod',
        query: {
          prodId
        }
      })
    },
    removeNullUndefined: (obj) => {
      return Object.entries(obj).reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {})
    }
  }
}
</script>
<style>
	@import "./search-prod-show.css";
</style>
