<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j payment-selector-container">
    <radio-group :class="['ways',!showBalancePay?'recharge-ways':'']" @change="changePayType">
      <!-- 支付宝支付 -->
      <label v-if="appType > 2 && paySwitchInfo.aliPaySwitch" :class="['item',!showBalancePay?'recharge-item':'']">
        <view class="pay-name">
          <view class="img">
            <image src="/static/images/icon/alipay.png" mode="" />
          </view>
          <view class="name">{{ i18n.PayWithAli }}</view>
        </view>
        <radio value="aliPay" color="#F81A1A" :checked="payTypeStr==='aliPay'" />
      </label>
      <!-- 微信支付 -->
      <label v-if="paySwitchInfo.wxPaySwitch" :class="['item',!showBalancePay?'recharge-item':'']">
        <view class="pay-name">
          <view class="img">
            <image src="/static/images/icon/wxpay.png" />
          </view>
          <view class="name">{{ i18n.payWithWeChat }}</view>
        </view>
        <radio value="wechatPay" color="#F81A1A" :checked="payTypeStr==='wechatPay'" />
      </label>
      <!-- #ifdef H5 -->
      <!-- PayPal支付 -->
      <label v-if="paySwitchInfo.payPalSwitch">
        <view class="item">
          <view class="pay-name">
            <view class="img">
              <image src="../../static/images/icon/paypal-logo.png" mode="" />
            </view>
            <view class="name">{{ i18n.paypalPay }}</view>
          </view>
          <view class="check">
            <radio value="payPal" color="#F81A1A" :checked="payTypeStr==='payPal'" />
          </view>
        </view>
      </label>
      <!-- #endif -->
      <!-- 余额支付 -->
      <label v-if="showBalancePay && paySwitchInfo.balancePaySwitch">
        <view class="item">
          <view class="pay-name">
            <view class="img">
              <image src="/static/images/icon/balancePay.png" />
            </view>
            <view class="name">{{ i18n.balancePay + `（${i18n.currentBalance}：${totalBalance}）` }}</view>
          </view>
          <view class="check">
            <radio value="balancePay" color="#F81A1A" :checked="payTypeStr==='balancePay'" />
          </view>
        </view>
      </label>

    </radio-group>
  </view>
</template>

<script>
import { PayType, AppType } from '../../utils/constant'
const util = require('../../utils/util.js')
export default {
  name: 'PaymentMethodSelector',
  props: {
    // 支付类型字符串
    payTypeStr: {
      default: 'aliPay',
      type: String || Number
    },
    // 是否显示余额支付
    showBalancePay: {
      default: true,
      type: Boolean
    },
    // 当前用户余额
    totalBalance: {
      default: 0,
      type: Number || String
    }
  },
  data() {
    return {
      // 支付类型常量
      currentPayTypeStr: 'aliPay',
      payType: PayType.ALIPAY_H5,
      appType: uni.getStorageSync('bbcAppType'),
      // 系统支付设置
      paySwitchInfo: uni.getStorageSync('bbcPaySwitchInfo').switchInfo
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  methods: {
    /**
			 * 修改支付类型
			 */
    changePayType(val) {
      util.tapLog()
      // 支付类型(字符串格式) payTypeStr: aliPay 支付宝   wechatPay 微信支付   balancePay 余额支付
      this.currentPayTypeStr = val.detail.value

      // 设置支付类型 payType
      let payType
      if (val.detail.value === 'balancePay') {
        payType = PayType.BALANCEPAY
      } else if (val.detail.value === 'payPal') {
        payType = PayType.PAYPAL
      } else {
        // #ifdef H5
        payType = val.detail.value === 'aliPay' ? PayType.ALIPAY_H5 : this.appType === AppType.MP ? PayType.WECHATPAY_MP : PayType.WECHATPAY_H5
        // #endif
        // #ifdef APP-PLUS
        payType = val.detail.value === 'aliPay' ? PayType.ALIPAY_APP : PayType.WECHATPAY_APP
        // #endif
        // #ifdef MP-WEIXIN
        payType = PayType.WECHATPAY
        // #endif
      }
      // this.payType = payType
      const paymentInfo = {
        payTypeStr: val.detail.value,
        payType: payType
      }
      this.$emit('setPayType', paymentInfo)
    }
  }
} 
</script>
<style>
.ways {
	padding: 0 20rpx;
	font-size: 24rpx;
}
.ways.recharge-ways {
	padding: 0;
	font-size: 28rpx;
}
.ways .item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 2rpx solid #eee;
	padding: 20rpx 0;
}
.ways .item.recharge-item {
	border: none;
}
.ways .item .pay-name {
	display: flex;
	align-items: center;
}

.ways .item .pay-name .img {
	width: 44rpx;
	height: 44rpx;
	font-size: 0;
}
.ways .item .pay-name .img image{
	width: 100%;
	height: 100%;
}

.ways .item .pay-name .name {
	margin-left: 20rpx;
}

</style>

