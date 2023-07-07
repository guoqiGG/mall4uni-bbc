view<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 青春豆商城 -->
  <view class="Mall4j integral-index">
    <view class="integral-msg">
      <view class="my-integral">
        <view class="number-box">
          <view class="text">{{ i18n.myIntegral }}</view>
          <view class="number">{{ scoreInfo.score }}</view>
        </view>
        <view class="det" @tap="navigateTo('integral-detail')">{{ i18n.detailed }}
        </view>
      </view>
      <!-- <view class="make" @tap="navigateTo('member-index')">
        <image src="/static/images/icon/make-integral.png" />{{ i18n.earnPoints }}
      </view> -->
    </view>
    <view class="integral-list">
      <view class="member-tits">
        <view class="text">{{ i18n.pointsExchange }}</view>
      </view>
      <view class="con-box">
        <block v-for="(prod, prodId) in scoreProdList" :key="prodId">
          <goodsitem :prod="prod"  />
        </block>
      </view>
      <!-- <view v-if="scoreProdList.length > 10 && loadAll" class="loadall">{{
        i18n.endTips
      }}</view>
      <view v-if="!scoreProdList.length" class="empty">{{ i18n.noData }}</view> -->
      <!-- 空列表或加载全部提示 -->
      <EmptyAllTips v-if="isLoaded" :isEmpty="!scoreProdList.length" :isAll="scoreProdList.length > 10 && loadAll" />
    </view>
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
import goodsitem from '../../components/integral-goods-list/index.vue'

export default {
  components: {
    goodsitem
  },
  props: {},
  data() {
    return {
      current: 1,
      size: 20,
      scoreProdList: [],
      scoreInfo: '',
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
  onLoad: function (options) {
    this.getScoreProdList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    uni.setNavigationBarTitle({
      title: this.i18n.pointCenter
    })
    // 获取当前青春豆信息
    this.getScoreInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.current < this.pages) {
      this.current = this.current + 1
      this.getScoreProdList()
    } else {
      this.setData({
        loadAll: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
  methods: {
    /**
     * 跳转
     */
    navigateTo(path) {
      uni.navigateTo({
        url: `/package-member-integral/pages/${path}/${path}`
      })
    },

    /**
     * 获取当前青春豆信息
     */
    getScoreInfo() {
      const params = {
        url: '/p/score/scoreInfo',
        method: 'GET',
        data: {},
        callBack: (res) => {
          this.setData({
            scoreInfo: res
          })
        }
      }
      http.request(params)
    },

    /**
     * 获取青春豆商品列表
     */
    getScoreProdList() {
      this.isLoaded = false
      var param = {
        url: '/search/page',
        method: 'GET',
        data: {
          current: this.current,
          size: this.size,
          prodType: 3,
          sort: 2,
          userId: uni.getStorageSync('bbcUserInfo') ? uni.getStorageSync('bbcUserInfo').userId : ''
        },
        callBack: (res) => {
          this.isLoaded = true
          var scoreProdList = []
          if (this.current == 1) {
            this.setData({
              scoreProdList: res.records[0].products,
              pages: res.pages
            })
          } else {
            scoreProdList = this.scoreProdList
            scoreProdList.push(...res.records[0].products)
            this.setData({
              scoreProdList
            })
          }
        }
      }
      http.request(param)
    }
  }
}
</script>
<style>
@import "./integral-index.css";
</style>
