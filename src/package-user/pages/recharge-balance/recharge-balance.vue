<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j recharge-container">
    <view class="page-title">{{ i18n.onlineRecharge }}</view>

    <view class="amount">
      <!-- banner -->
      <view class="msg-banner">
        <image
          class="bg"
          :src="
            '../../static/images/icon/recharge-balance-bg.jpg'
          "
        >
          <view v-if="currentAmountOption.balanceId" class="current-selected">
            <view class="con">
              <view class="sel-amount">
                <text class="big">{{
                  currentAmountOption.rechargeAmount
                }}</text>
                <text class="small">{{ i18n.yuan }}</text>
              </view>
              <view
                v-if="
                  currentAmountOption.presAmount ||
                    currentAmountOption.presScore ||
                    currentAmountOption.presGrowth ||
                    currentAmountOption.couponList.length
                "
                class="recharge-info"
              >
                {{ i18n.rechargeOffer }}：
                <block
                  v-if="
                    currentAmountOption.presAmount &&
                      currentAmountOption.presAmount > 0
                  "
                >
                  {{ i18n.additionalGifts }}{{ currentAmountOption.presAmount
                  }}{{ i18n.yuan }}；
                </block>
                <block v-if="currentAmountOption.presScore">
                  {{ i18n.handsels }}{{ currentAmountOption.presScore
                  }}{{ i18n.userIntegral }}；
                </block>
                <block v-if="currentAmountOption.presGrowth">
                  {{ i18n.handsels }}{{ currentAmountOption.presGrowth
                  }}{{ i18n.growthValue }}；
                </block>
                <block v-if="currentAmountOption.couponList.length > 0">
                  {{ i18n.handsels }}{{ currentAmountOption.couponList.length
                  }}{{ i18n.sheet }}{{ i18n.coupon }}【
                  <block
                    v-for="(cou, couIdx) in currentAmountOption.couponList"
                    :key="couIdx"
                  >
                    {{ cou.couponName }}
                    <text
                      v-if="couIdx != currentAmountOption.couponList.length - 1"
                    >、</text> </block>】
                </block>
              </view>
            </view>
          </view>
          <view
            v-if="!currentAmountOption.balanceId"
            class="current-selected custom"
          >
            <view class="txt">{{ i18n.customAmount }}</view>
          </view>
        </image></view>

      <!-- 金额选项 -->
      <view class="amount-options">
        <view
          v-for="(item, index) in rechargeList"
          :key="index"
          :class="[
            'amount-item',
            currentAmountOption.balanceId === item.balanceId ? 'active' : '',
          ]"
          @tap="swichAmountOption(item)"
        >
          {{ item.rechargeAmount }} {{ i18n.yuan }}</view>
      </view>

      <!-- 自定义金额 -->
      <view class="custom-amount">
        <view class="tit">{{ i18n.customAmount }}（{{ i18n.yuan }}）</view>
        <view class="int">
          <input
            type="digit"
            :value="balance.customRechargeAmount"
            maxlength="100000"
            :placeholder="i18n.maximumTopUp + 10 + i18n.millionYuan"
            @input="getInputValue"
            @focus="onFocus"
            @blur="onBlur"
          >
        </view>
      </view>
    </view>

    <!-- 支付方式 -->
    <view class="ways">
      <!-- 支付方式选择器组件 -->
      <PaymentMethodSelector
        :pay-type-str="payTypeStr"
        :show-balance-pay="false"
        @setPayType="setPayType"
      />
    </view>

    <view class="btn-box">
      <view class="btn" @tap="toPay">{{ i18n.recharge }}</view>
    </view>
  </view>
</template>

<script>
import PaymentMethodSelector from '../../../components/payment-method-selector/index.vue'
const http = require('../../../utils/http.js')
const util = require('../../../utils/util')
import { PayType } from '../../../utils/constant.js'
import config from '../../../utils/config.js'
import Pay from '../../../utils/pay.js'
export default {
  components: {
    PaymentMethodSelector
  },
  data() {
    return {
      picDomain: config.picDomain, // 图片前缀
      payType: PayType.ALIPAY_H5, // 支付类型，默认支付宝
      PayTypeConstant: PayType, // 支付类型常量
      rechargeList: [], // 充值数据列表
      currentAmountOption: {}, // 当前项
      balance: {}, // 金额传参
      exceedingLimit: false, // 超出小数位数限制
      payTypeStr: 'aliPay'
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  onLoad: function() {
    this.payType = util.initPayType().payType
    this.payTypeStr = util.initPayType().payTypeStr
  },

  onShow: function() {
    uni.setNavigationBarTitle({
      title: this.i18n.rechargeBalance
    })
    this.queryRechargeDataList() // 获取充值数据列表
  },

  methods: {
    /**
     * 设置支付类型
     */
    setPayType(paymentInfo) {
      this.payType = paymentInfo.payType
      this.payTypeStr = paymentInfo.payTypeStr
    },

    // 面额选项点击切换
    swichAmountOption(item) {
      this.currentAmountOption = item
      this.balance = {
        balanceId: item.balanceId,
        customRechargeAmount: '' // 自定义金额
      }
    },

    /**
     * 获取充值数据列表
     */
    queryRechargeDataList: function() {
      const params = {
        url: '/p/userBalance/getList',
        method: 'GET',
        data: {},
        callBack: (res) => {
          this.rechargeList = res
          this.swichAmountOption(this.rechargeList[0])
        }
      }
      http.request(params)
    },

    /**
     * 获取焦点
     */
    onFocus() {
      this.currentAmountOption = {}
      this.balance = {
        balanceId: -1,
        customRechargeAmount: this.balance.customRechargeAmount // 自定义金额
      }
    },

    // 失焦
    onBlur() {
      if (this.balance.customRechargeAmount > 100000) {
        this.balance.customRechargeAmount = 100000
        return
      }
      const reg = /^\d*\.?\d{0,2}$/
      const intVal = reg.test(this.balance.customRechargeAmount)
      this.exceedingLimit = false
      if (!intVal) {
        this.balance.customRechargeAmount = ''
        uni.showToast({
          title: '最多支持2位小数',
          icon: 'none'
        })
        this.exceedingLimit = true
      }
    },

    /**
     * 获取input框的值
     */
    getInputValue(e) {
      this.balance = {
        balanceId: -1,
        customRechargeAmount: e.detail.value // 自定义金额
      }
    },

    /**
     * 修改支付类型
     */
    handlePayTypeChange(e) {
      console.log(this.PayTypeConstant.ALIPAY_H5)
    },

    // 去支付
    toPay: function() {
      const balanceId = this.balance.balanceId
      const customRechargeAmount = this.balance.customRechargeAmount
      if (this.exceedingLimit) {
        return
      }
      if (balanceId === -1 && !customRechargeAmount) {
        uni.showToast({
          title: this.i18n.enterRechargeAmount,
          icon: 'none'
        })
        return
      }
      // 请输入充值金额
      if (
        balanceId === -1 &&
        !customRechargeAmount &&
        customRechargeAmount !== 0
      ) {
        uni.showToast({
          title: this.i18n.enterRechargeAmount,
          icon: 'none'
        })
        return
      }
      // 充值金额不能小于0.01
      if (balanceId === -1 && customRechargeAmount < 0.01) {
        this.balance.customRechargeAmount = ''
        uni.showToast({
          title: this.i18n.rechargeAmountMinimum,
          icon: 'none'
        })
        return
      }
      // 充值金额不能超过10万
      if (balanceId === -1 && customRechargeAmount > 100000) {
        this.balance.customRechargeAmount = ''
        uni.showToast({
          title: this.i18n.rechargeAmountMaximum,
          icon: 'none'
        })
        return
      }
      Pay.toOrderPay(this.payType, '', '', '', '', this.balance)
    }
  }
}
</script>

<style scoped>
@import "./recharge-balance.css";
</style>
