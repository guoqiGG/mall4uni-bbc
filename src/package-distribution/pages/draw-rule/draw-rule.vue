<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <view class="withdrawal">
      <view class="title">{{ i18n.WithdrawalRules }}</view>
      <view class="rule-block">
        <text class="tip">{{ i18n.WithdrawalRules1 }}{{ amountMin }}{{ i18n.yuan }}</text>
        <text class="tip">{{ i18n.WithdrawalRules2 }}{{ amountMax }}{{ i18n.yuan }}</text>
        <text v-if="frequency == -1" class="tip">{{ i18n.WithdrawalRules3 }}</text>
        <text v-else class="tip">{{ i18n.WithdrawalRules31 }}{{ frequency }}{{ i18n.WithdrawalRules32 }}{{ number }}{{ i18n.WithdrawalRules33 }}</text>
        <text class="tip">4.{{ paymentExplain }}</text>
      </view>
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
      // 提现频率(天)
      frequency: '',
      // 单笔提现最高
      amountMax: '',
      // 单笔提现最低
      amountMin: '',
      // 提现次数(N天N次)
      number: '',
      // 打款说明
      paymentExplain: ''
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
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.WithdrawalRules
    })

    this.loadWithdrawCashRule()
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
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  methods: {
    /**
     * 加载提现规则
     */
    loadWithdrawCashRule: function() {
      var ths = this
      const params = {
        url: '/p/distribution/withdrawCash/info',
        method: 'GET',
        callBack: function(res) {
          ths.setData({
            frequency: res.frequency,
            amountMax: res.amountMax,
            amountMin: res.amountMin,
            number: res.number,
            paymentExplain: res.paymentExplain
          })
        }
      }
      http.request(params)
    }
  }
}
</script>
<style>
@import "./draw-rule.css";
</style>
