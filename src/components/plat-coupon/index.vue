<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view :class="'Mall4j coupon-item ' + (canUse ? '' : 'gray')">
    <view class="left">
      <view v-if="item.couponType == 1 || item.couponType == 3" class="num">
        <!-- ￥
      <text class="coupon-price">{{item.reduceAmount}}</text> -->
        <view class="cou-amount">{{ item.reduceAmount }}</view>
        <view class="cou-text">{{ i18n.yuan }}</view>
      </view>
      <view v-if="item.couponType == 2" class="num">
        <text class="coupon-price">{{ item.couponDiscount }}</text>{{ i18n.discount }}</view>
      <view
        class="condition"
      >{{ i18n.available }}{{ item.cashCondition
      }}{{ i18n.availableUse }}</view>
    </view>
    <view class="right">
      <view class="c-des">
        <!-- <text class="c-type">{{item.suitableProdType==0?'通用':'商品'}}</text> {{item.suitableProdType==0?'全场通用':'指定商品可用'}} -->
        <view class="cou-name">{{ item.couponName }}</view>
      </view>
      <view class="c-date">
        <!-- <text wx:if="{{showTimeType==1 && item.couponType==2}}" class="c-data-info">领券{{item.validDays}}天后失效</text> -->
        <!-- <text wx:else class="c-data-info">{{item.startTime}}~{{item.endTime}}</text> -->
        <text class="c-data-info">{{ item.startTime }}~{{ item.endTime }}</text>
        <!-- <view class="cou-term"> {{item.validTimeType == 1?coupon.endTime+'前':'领取后' +coupon.afterReceiveDays}}结束</view> -->
        <!-- <text class="c-btn" wx:if="{{item.canReceive && !order}}" bindtap='receiveCoupon'>立即领取</text> -->
        <text
          v-if="!item.canReceive && !order"
          class="c-btn get-btn"
          @tap="useCoupon"
        >{{ i18n.useItNow }}</text>
      </view>
      <view v-if="order && canUse" class="sel-btn">
        <checkbox
          color="#eb2444"
          :data-couponid="item.couponId"
          :checked="item.choose"
          @tap="checkCoupon"
        />
      </view>
    </view>
    <image
      v-if="type == 1"
      class="tag-img"
      :src="
        isEn
          ? '/static/images/icon/coupon-used-en.png'
          : '/static/images/icon/coupon-used.png'
      "
    />
    <image
      v-if="type == 2"
      class="tag-img"
      :src="
        isEn
          ? '/static/images/icon/coupon-ot-en.png'
          : '/static/images/icon/coupon-ot.png'
      "
    />
  </view>

  <!-- 券面 -->
  <!-- <view class="coupon-surface">
    <view class="coupon-content">
      <view class="coupon-left">
        <view class="cou-money-amount">
          <view class="cou-amount">{{coupon.reduceAmount}}</view>
          <view class="cou-text">元</view>
        </view>
        <view class="use-condition">满{{coupon.cashCondition}}元使用</view>
      </view>
      <view class="coupon-right">
        <view class="cou-name">{{coupon.couponName}}</view>
        <view class="cou-term"> {{coupon.validTimeType == 1?coupon.endTime+'前':'领取后' +coupon.afterReceiveDays}}结束</view>
      </view>
    </view>
  </view> -->
  <!-- 券面 -->
</template>

<script>
const http = require('../../utils/http.js')
const util = require('../../utils/util.js')
export default {
  components: {},
  props: {
    item: Object,
    type: Number,
    order: Boolean,
    canUse: Boolean,
    index: Number,
    showTimeType: Number
  },
  data() {
    return {
      stsType: 4,
      isEn: uni.getStorageSync('bbcLang') == 'en' // 是否为英文
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  beforeMount: function() {
    // console.log(this.data.item);
  },
  methods: {
    receiveCoupon() {
      util.checkAuthInfo(() => {
        var couponId = this.item.couponId
        http.request({
          url: '/p/myCoupon/receive',
          method: 'POST',
          data: couponId,
          callBack: () => {
            var coupon = this.item
            coupon.canReceive = false
            this.setData({
              item: coupon
            })
          }
        })
      })
    },

    checkCoupon(e) {
      // this.triggerEvent('checkCoupon', this.data.index);
      this.$emit('checkCoupon', {
        couponId: e.currentTarget.dataset.couponid
      })
      console.log(e.currentTarget.dataset.couponid)
    },

    /**
     * 立即使用
     */
    useCoupon() {
      var url = '/pages/prod-classify/prod-classify?sts=' + this.stsType
      var id = this.item.couponId
      var title = this.i18n.couponEventGoods

      if (id) {
        url += '&tagid=' + id + '&title=' + title
      }

      uni.navigateTo({
        url: url
      })
    }
  }
}
</script>
<style>
@import "./index.css";
</style>
