<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j withdrawal-mian">
    <form class="withdrawal-mian-form">
      <!-- <view class='withdrawal-tab1'>
        <text class='withdrawal-tab1-text'>提现账户</text>
        <image src='../../images/icon/pay.png'></image>
        <text>支付宝</text>
      </view> -->
      <view class="withdrawal-tab2">
        <view class="withdrawal-tab2-text">{{ i18n.withdrawalAmount }}</view>
        <input type="digit" :placeholder="i18n.availableCashAmount + settledAmount" :value="amount" @input="onAmountInput"></input>
        <view class="withdrawal-tab2-text2" @tap="onAllWithdraw">{{ i18n.withdrawAll }}</view>
      </view>
      <!-- <view class='withdrawal-tab3'>
        <text class='withdrawal-tab3-text'>短信验证码</text>
        <input type='text' placeholder='请输入验证码'></input>
        <view class='line'></view>
        <text class='withdrawal-tab3-text2'>获取验证码</text>
      </view> -->
      <button class="withdrawal-btn" @tap="confirmWithdraw">{{ i18n.confirmWithdrawal }}</button>
      <!-- 提现tips -->
      <view class="rule-block">
        <text class="tip">{{ i18n.WithdrawalRules1 }}{{ amountMin }}{{ i18n.yuan }}</text>
        <text class="tip">{{ i18n.WithdrawalRules2 }}{{ amountMax }}{{ i18n.yuan }}</text>
        <text v-if="frequency==-1" class="tip">{{ i18n.WithdrawalRules3 }}</text>
        <text v-else class="tip">{{ i18n.WithdrawalRules31 }}{{ frequency === 30 ? '' : frequency }}{{ frequency === 30 ? i18n.WithdrawalRules34 : i18n.WithdrawalRules32 }}{{ number }}{{ i18n.WithdrawalRules33 }}</text>
        <text v-if="paymentExplain" class="tip">4.{{ paymentExplain }}</text>
      </view>

    </form>
  </view>
</template>

<script>
const http = require('../../../utils/http.js')

export default {

  components: {},
  props: {},
  data() {
    return {
      settledAmount: 0,
      amount: null,
      frequency: 0, // 天数
      number: 0, // 提现次数
      amountMax: 0, // 最大金额
      amountMin: 0, // 最低金额
      paymentExplain: '', // 其他提示
      addupAmount: ''
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  onShow: function() {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.withdrawal
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getDisInfoData()
    this.loadWithdrawCashRule() // 提现规则
  },
  methods: {
    /**
     * 获取用户钱包数据
     */
    getDisInfoData: function() {
      const params = {
        url: '/p/distribution/user/info',
        method: 'GET',
        callBack: res => {
          this.setData({
            settledAmount: res.distributionUserWallet.settledAmount,
            addupAmount: res.distributionUserWallet.addupAmount
          })
        }
      }
      http.request(params)
    },

    /**
     * 确认提现
     */
    confirmWithdraw: function() {
      /**
       *  不可提现的几个判断
       *  1：输入框输入的值为空 || 值小于或等于0的数字（提示：请输入正确金额！）
       *  2：输入框输入的值，大于该分销员的可提现余额（提示：余额不足）
       *  3：输入框输入的值，小于最小提现金额（提示：提现金额小于最小提现金额）
       */
      if (!this.amount || this.amount <= 0) {
        uni.showToast({
          title: this.i18n.enterCorrectAmount,
          icon: 'none'
        })
        return
      } else if (this.amount > this.settledAmount) {
        uni.showToast({
          title: this.i18n.insufficientBalance,
          icon: 'none'
        })
        return
      } else if (this.amount < this.amountMin) {
        uni.showToast({
          title: this.i18n.lessThanWithdrawalAmount,
          icon: 'none'
        })
        return
      } else if (this.amount > this.amountMax) {
        uni.showToast({
          title: this.i18n.greaterThanWithdrawalAmount,
          icon: 'none'
        })
        return
      }

      http.request({
        url: '/p/distribution/withdrawCash/apply',
        method: 'POST',
        data: {
          amount: this.amount
        },
        callBack: res => {
          uni.showModal({
            content: this.i18n.withdrawalApplicationSubmitted,
            showCancel: false,
            cancelText: this.i18n.cancel,
            confirmText: this.i18n.confirm,
            complete: function() {
              uni.navigateTo({
                url: '/package-distribution/pages/take-notes/take-notes'
              })
            }
          })
        }
      })
    },
    onAmountInput: function(e) {
      this.setData({
        amount: e.detail.value
      })
    },
    onAllWithdraw: function() {
      this.setData({
        amount: this.settledAmount
      })
    },

    /**
     * 加载提现规则
     */
    loadWithdrawCashRule: function() {
      const params = {
        url: '/p/distribution/withdrawCash/info',
        method: 'GET',
        callBack: (res) => {
          this.setData({
            frequency: res.frequency,
            number: res.number,
            amountMax: res.amountMax,
            amountMin: res.amountMin,
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
@import "./withdrawal.css";
</style>
