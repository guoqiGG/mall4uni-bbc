<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 团购列表 -->
  <view class="Mall4j abulk-list-wrapper">
    <view class="banner">
      <view
        class="bg"
      ><image
        src="../../static/images/icon/group-bg.png"
      /></view>
      <view
        class="img"
      ><image
        src="../../static/images/icon/group-banner.png"
      /></view>
    </view>
    <view class="abulk-list">
      <!-- 商品项 -->
      <block v-for="(item, index) in aBulkList" :key="index">
        <view class="abulk-list-item" @tap="toAbulkListPage(item.prodId)">
          <!-- 商品图片 -->
          <view class="prod-img">
            <ImgShow :src="item.pic" imgMode="aspectFit" />
          </view>
          <!-- 商品信息 -->
          <view class="prod-msg">
            <view
              class="prod-title"
            ><view
              v-if="item.groupActivitySearchVO"
              class="prod-describe"
            >{{ item.groupActivitySearchVO.groupNumber }}
              {{ i18n.join }}</view>{{ item.prodName }}</view>
            <view class="prod-price">
              <!-- 团购价 -->
              <view class="pic">
                <text class="symbol">￥</text>
                <text class="big-num">{{
                  parsePrice(item.activityPrice)[0]
                }}</text>
                <text
                  class="small-num"
                >.{{ parsePrice(item.activityPrice)[1] }}</text>
              </view>
              <!-- 原价 -->
              <view v-if="item.price > item.activityPrice" class="original-price">￥{{ toPrice(item.price) }}</view>
            </view>
          </view>
        </view>
      </block>
    </view>
    <!-- 空列表或加载全部提示 -->
    <EmptyAllTips
      v-if="isLoaded"
      :isEmpty="!aBulkList.length"
      :emptyTips="i18n.noMoreActivities"
      :isAll="aBulkList.length>10 && loadAll"
    />

  </view>
</template>

<script>
const http = require('../../../utils/http.js')

export default {
  props: {},
  data() {
    return {
      aBulkList: [],
      // 商品列表
      current: 1,
      size: 20,
      pages: '',
      loadAll: false, // 已加载全部
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
    this.getAbulkList()
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
      title: this.i18n.groupBuyingList
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
      this.getAbulkList()
    } else {
      this.setData({
        loadAll: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  methods: {
    /**
     * 获取团购商品列表
     */
    getAbulkList: function() {
      this.isLoaded = false
      const params = {
        url: '/search/page',
        method: 'GET',
        data: {
          current: this.current,
          size: this.size,
          prodType: 1,
          isActive: 1, // 过滤掉活动商品
          userId:uni.getStorageSync('bbcUserInfo')?uni.getStorageSync('bbcUserInfo').userId:''
        },
        callBack: (res) => {
          this.isLoaded = true
          var aBulkList = []
          if (params.data.current == 1) {
            aBulkList = res.records[0].products
          } else {
            aBulkList = this.aBulkList.concat(res.records[0].products)
          }
          if (res.total <= 4 && res.total > 0) {
            this.setData({
              loadAll: true
            })
          }
          this.setData({
            aBulkList: aBulkList,
            pages: res.pages
          })
        }
      }
      http.request(params)
    },

    /**
     * 跳转到拼团商品详情
     */
    toAbulkListPage(prodId) {
      this.$Router.push({
        path: '/package-prod/pages/prod/prod',
        query: {
          prodId
        }
      })
    }
  }
}
</script>
<style>
@import "./a-bulk-list.css";
</style>
