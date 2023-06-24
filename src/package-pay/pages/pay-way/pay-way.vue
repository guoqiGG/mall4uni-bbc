<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j pay-way">
    <view class="pay-number">
      <view class="price">
        <view class="big-num"><text class="small-num">￥</text>{{ parsePrice(actualTotal)[0] }}</view>
        <view class="small-num">.{{ parsePrice(actualTotal)[1] }}</view>
        <text v-if="!isPurePoints && orderScore" class="small-num"> + </text>
        <text v-if="!isPurePoints && orderScore" class="big-num">{{ orderScore }} {{ i18n.integral }}</text>
      </view>
      <view v-if="isPurePoints" class="price">{{ i18n.confirmTheCost }} {{ orderScore }} {{ i18n.integralPayment }}?</view>
      <view v-if="timer" class="time">{{ i18n.theRemainingTime }}&nbsp;{{ hou }}:{{ min }}:{{ sec }}</view>
    </view>

    <view>
      <!-- 支付方式选择器组件 -->
      <PaymentMethodSelector v-if="actualTotal > 0" :total-balance="totalBalance" :pay-type-str="payTypeStr" @setPayType="setPayType" />
      <view class="sure-pay" @tap="toPay">{{ i18n.determinePayment }}</view>
    </view>
  </view>
</template>

<script>
import PaymentMethodSelector from '../../../components/payment-method-selector/index.vue'
const http = require('../../../utils/http.js')
import { PayType } from '../../../utils/constant.js'
import Pay from '../../../utils/pay.js'
import util from '../../../utils/util.js'
export default {
  components: {
    PaymentMethodSelector
  },
  data() {
    return {
      orderNumbers: '', // 订单号
      actualTotal: 0, // 订单价格
      totalBalance: 0, // 当前账户余额
      payType: PayType.ALIPAY_H5, // 支付类型，默认支付宝
      PayTypeConstant: PayType, // 支付类型常量
      timer: '', // 定时器名称
      endTime: '', // 订单过期时间
      countDown: false, // 倒计时变量
      hou: '', // 时
      min: '', // 分
      sec: '', // 秒
      orderScore: 0, // 订单使用氢春豆
      orderType: '', // 订单类型 1团购 2秒杀
      isPurePoints: false, // 是否纯氢春豆订单
      payTypeStr: 'aliPay'
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
      title: this.i18n.checkoutCounter
    })
    util.getSysPaySwitch(true)
  },

  methods: {
    /**
			 * 设置支付类型
			 */
    setPayType(paymentInfo) {
      this.payType = paymentInfo.payType
      this.payTypeStr = paymentInfo.payTypeStr
    },
    // 获取订单价格
    getActualTotal: function() {
      const params = {
        url: '/p/myOrder/orderDetail',
        method: 'GET',
        data: {
          orderNumber: this.orderNumbers
        },
        callBack: res => {
          this.setData({
            // 需支付金额
            actualTotal: res.actualTotal,
            orderScore: res.orderScore,
            orderType: res.orderType // 订单类型（1团购订单 2秒杀订单）
          })
        }
      }
      http.request(params)
    },

    /**
			 * 获取账户当前余额
			 */
    queryCurrentBalance: function() {
      const params = {
        url: '/p/user/getUserInfo',
        method: 'GET',
        dontTrunLogin: true,
        callBack: res => {
          this.totalBalance = res.totalBalance
        }
      }
      http.request(params)
    },

    // 获取订单过期时间
    getEndTime: function() {
      if (!this.orderNumbers) {
        return
      }
      const params = {
        url: '/p/order/getOrderPayInfoByOrderNumber',
        method: 'GET',
        data: {
          orderNumbers: this.orderNumbers
        },
        callBack: res => {
          this.setData({
            // 订单过期时间
            endTime: res.endTime,
            actualTotal: res.totalFee,
            orderScore: res.totalScore,
            isPurePoints: !res.totalFee
          })
          this.getCountDown()
        }
      }
      http.request(params)
    },

    // 倒计时
    getCountDown: function() {
      var nowTime = new Date().getTime() // 现在时间（时间戳）
      var endTime = new Date(this.endTime.replace(/\-/g, '/')).getTime() // 结束时间（时间戳）
      var time = (endTime - nowTime) / 1000 // 距离结束的毫秒数
      // 获取时、分、秒
      let hou = parseInt(time % (60 * 60 * 24) / 3600)
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60)
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60)
      hou = this.timeFormin(hou)
      min = this.timeFormin(min)
      sec = this.timeFormin(sec)
      this.setData({
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec)
      })
      // 每1000ms刷新一次
      if (time > 0) {
        this.setData({
          countDown: true,
          timer: setTimeout(this.getCountDown, 1000)
        })
      } else {
        this.setData({
          countDown: false
        })
        // uni.navigateTo({
        // 	url: '/pages/order-list/order-list'
        // })
        this.$Router.push('/package-user/pages/order-list/order-list')
      }
    },
    // 小于10的格式化函数（2变成02）
    timeFormat(num) {
      return num < 10 ? '0' + num : num
    },
    // 小于0的格式化函数（不会出现负数）
    timeFormin(num) {
      return num < 0 ? 0 : num
    },

    // 去支付
    toPay: util.debounce(function() {
      util.tapLog(2, this.orderNumbers)
      if (this.payType == 9) {
        if (this.actualTotal > this.totalBalance) {
          uni.showToast({
            title: this.i18n.shortBalance,
            icon: 'none',
            duration: 3000
          })
          return
        }
        uni.showModal({
          title: this.i18n.tips,
          content: this.i18n.confirmBalancePay,
          showCancel: true, // 是否显示取消按钮
          cancelText: this.i18n.cancel,
          confirmText: this.i18n.confirm,
          success: (res) => {
            if (res.confirm) {
              // 点击确定
              // uni.redirectTo({
              // 	url: '/package-pay/pages/pay-result/pay-result?sts=1&orderNumbers=' + this.orderNumbers
              // });
              Pay.toOrderPay(this.payType, this.orderNumbers, this.isPurePoints, this.dvyType, '', '', this.orderType, this.ordermold)
            }
            // else if (res.cancel) {
            // 	uni.showToast({
            // 		title: this.i18n.cancelBalancePay,
            // 		icon: 'none',
            // 		duration: 1500
            // 	});
            // }
          }
        })
        return
      }
      if (this.orderScore > 0 && this.actualTotal <= 0) {
        this.payType = 0 // 氢春豆支付
      }
      Pay.toOrderPay(this.payType, this.orderNumbers, this.isPurePoints, this.dvyType, '', '', this.orderType, this.ordermold)
    }, 500)
  },

  onLoad: function(options) {
    this.orderType = options.orderType // 订单类型 1团购 2秒杀
    this.ordermold = options.ordermold
    this.orderNumbers = options.orderNumbers
    if (options.isPurePoints) {
      // 纯氢春豆订单
      this.isPurePoints = options.isPurePoints
    }
    if (options.dvyType) {
      this.dvyType = options.dvyType
    }
    // 初始化支付类型数据
    this.payType = util.initPayType().payType
    this.payTypeStr = util.initPayType().payTypeStr

    // this.getActualTotal()
    this.getEndTime()
    this.queryCurrentBalance()
  },

  onUnload: function() {
    clearTimeout(this.timer)
  }
}
</script>

<style>
	@import "./pay-way.css";
</style>
