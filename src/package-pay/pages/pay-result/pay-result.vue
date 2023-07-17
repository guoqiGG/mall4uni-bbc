<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <!-- 失败 -->
    <view v-if="sts == 0" class="pay-fail">
      <view class="img">
        <image src="/static/images/icon/pay-fail.png" mode=""></image>
      </view>
      <view class="pay-sts fail">{{ i18n.payFail }}</view>
      <view class="order-detail-title">订单信息</view>
      <view class="tips">
        {{ i18n.paymentFailedTips1 }}
        <text class="warn">{{ i18n.paymentFailedTips2 }}</text>
        ,{{ i18n.paymentFailedTips2 }}{{ i18n.paymentFailedTips3 }}
        <text class="tips">{{ i18n.paymentFailedTips4 }}</text>
      </view>
      
      <view class="btns">
        <text class="button checkorder" @tap="toOrderList">{{ i18n.checkOrder }}</text>
        <text class="button payagain" @tap="payAgain">{{ i18n.payAgain }}</text>
      </view>
    </view>
    <!-- 成功 -->
    <view v-if="sts == 1" class="pay-success">
      <view class="img">
        <image src="/static/images/icon/pay-success.png" mode=""></image>
      </view>
      <view class="pay-sts succ">{{ i18n.paymentSuccessful }}</view>
      <view class="tips">支付成功，您可以去<text class="my-order" @tap="toOrderList">我的订单</text>里查看订单详情</view>
      <view class="btns">
        <text class="button checkorder" @tap="toOrderList">{{ i18n.checkOrder }}</text>
        <text class="button shopcontinue" @tap="toCategory">{{ i18n.continueShopping }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import util from '../../../utils/util.js'
export default {

  components: {},
  props: {},
  data() {
    return {
      sts: 0,
      orderNumbers: '',
      selPayType: '',
      orderType: '', // 订单类型 1团购 2秒杀
      hadUpload: false,
      ordermold: '' // 1虚拟商品
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
      sts: options.sts,
      orderNumbers: options.orderNumbers,
      orderType: options.orderType,
      ordermold: options.ordermold
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 设置头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.paymentResults
    })
    if (this.sts == 1) {
      if (!this.hadUpload) {
        util.tapLog(null, this.orderNumbers, true)
        this.hadUpload = true
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.hadUpload = false
  },

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
    toOrderList: function() {
      let paySts = this.sts == 0 ? 1 : 2
      if (this.orderType == 1 || this.ordermold == 1) { // 1团购 || orderMold=1虚拟商品
        paySts = 0
      }
      paySts = 0
      this.$Router.replace({
        path: '/package-user/pages/order-list/order-list', query: { sts: paySts }
      })
    },
    // 继续购物
    toCategory: function() {
      uni.switchTab({
        url:'/pages/category/category'
      })
    },
    payAgain: function() {
      this.$Router.replace({
        path: '/package-pay/pages/pay-way/pay-way', query: { orderNumbers: this.orderNumbers }
      })
    }
  }
}
</script>
<style>
@import "./pay-result.css";
</style>
