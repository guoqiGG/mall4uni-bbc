<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j wallet-container">
    <!-- 余额 -->
    <view class="wallet-info">
      <view class="item">
        <view class="item-box" style="margin-left: -20rpx;">
          <view>
            <view class="w-tit">
              <!-- <image style="width: 40rpx;height: 40rpx;margin-right: 16rpx;"
								src="/static/images/myWallet/balance.png"></image> -->
              <text>{{ i18n.totalBalance }}</text>
            </view>
            <view class="w-num">{{ toPrice(balance) }}</view>
          </view>
        </view>
        <view class="item-box" style="margin-right: -20rpx;">
          <view class="btn" @tap="toRechargeBalance">
            <view class="btn-text">
              {{ i18n.recharge }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 明细 -->
    <view class="wallet-detail">
      <view class="det-tit">{{ i18n.balanceDetails }}</view>
      <view class="det-list">
        <view v-for="(item,index) in walletList" :key="index" class="det-item">
          <view class="det-lt">
            <!-- <image class="banner-icon" src="/static/images/icon/make-integral.png"></image> -->
            <view class="det-content">
              <!-- type 1:充值 2:赠送 3:支付 4:退款 5.平台充值 6.购买会员 -->
              <text
                class="content"
              >{{ ['',i18n.rechargeBalance,i18n.rechargeGift,i18n.shoppingConsumption,i18n.refund,i18n.platformChanges,i18n.buyMembership][item.type] }}
              </text>
              <text class="create-time">({{ item.createTime }})</text>

              <view
                v-for="(orderId,index) in item.orderNumberList"
                :key="index"
                class="order-number"
              >{{ i18n.orderNumber }}:{{ orderId }}</view>
              <!-- <view class="date">{{item.orderNumberList[0]}}</view> -->
            </view>
          </view>
          <view class="det-rt">
            <text
              :class="item.ioType == 0 ? 'gray' : 'red'"
            >{{ ['-','+'][item.ioType] }}{{ item.changeBalance }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 空 -->
    <!-- <view v-if="!walletList.length" class="list-empty">{{ i18n.noBalanceDetails }}</view> -->
    <!-- 加载完成 -->
    <!-- <view v-if="walletList.length > 8 && loadAll" class="all-load">{{ i18n.endTips }}</view> -->
    <!-- 空列表或加载全部提示 -->
    <EmptyAllTips
      v-if="isLoaded"
      :isEmpty="!walletList.length"
      :emptyTips="i18n.noBalanceDetails"
      :isAll="walletList.length > 8 && loadAll"
    />
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
export default {
  data() {
    return {
      balance: 0,
      walletList: [],
      current: 1,
      size: 20,
      pages: 1,
      loadAll: false,
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
  onLoad: function(options) {},

  onShow: function() {
    uni.setNavigationBarTitle({
      title: this.i18n.balance
    })
    this.queryBalance() // 请求余额
    this.queryWalletDetailed() // 请求明细
  },

  /**
		 * 页面上拉触底事件的处理函数
		 */
  onReachBottom: function() {
    if (this.current < this.pages) {
      this.setData({
        current: this.current + 1
      })
      this.queryWalletDetailed()
    } else {
      this.setData({
        loadAll: true
      })
    }
  },

  methods: {
    /**
			 * 请求余额
			 */
    queryBalance: function() {
      const params = {
        url: '/p/userBalance/getBalanceInfo',
        method: 'GET',
        data: {},
        callBack: res => {
          this.balance = res
        }
      }
      http.request(params)
    },

    /**
			 * 请求余额明细
			 */
    queryWalletDetailed: function() {
      this.isLoaded = false
      const params = {
        url: '/p/userBalanceLog/log',
        method: 'GET',
        data: {
          current: this.current,
          size: this.size
        },
        callBack: res => {
          this.isLoaded = true
          this.walletList = res.current == 1 ? res.records : this.walletList.concat(res.records)
          this.pages = res.pages
          this.current = res.current
        }
      }
      http.request(params)
    },

    // 跳转余额充值
    toRechargeBalance: function() {
      uni.navigateTo({
        url: '/package-user/pages/recharge-balance/recharge-balance'
      })
    }

  }
}
</script>

<style>
	@import "./my-wallet.css";
</style>
