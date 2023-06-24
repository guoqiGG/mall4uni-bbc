<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view :class="'Mall4j coupon-item ' + (canUse?'':'gray')">
    <view class="left">
      <view
        v-if="item.couponType == 1 || item.couponType == 3"
        class="num"
      >￥<text class="coupon-price">
        <text>{{ parsePrice(item.reduceAmount)[0] }}</text>
        <text class="small">.{{ parsePrice(item.reduceAmount)[1] }}</text>
      </text>
      </view>
      <view
        v-if="item.couponType == 2"
        class="num"
      >
        <text class="coupon-price">{{ item.couponDiscount }}</text>{{ i18n.discount }}</view>
      <view class="coupon-condition">{{ i18n.available }}{{ item.cashCondition }}{{ i18n.availableUse }}</view>
    </view>
    <view class="right">
      <view class="c-des">
        <text>
          <text class="c-type">{{ item.shopId==0?i18n.universal:i18n.shop }}</text>
          {{ item.suitableProdType==0?i18n.allUniversal:i18n.specifiedItems }}
        </text>
      </view>
      <view v-if="item.shopId!=0 && item.shopName" class="c-desc">
        {{ i18n.purchaseLimit }} [{{ item.shopName }}] {{ item.suitableProdType==0?i18n.allUniversal:i18n.specifiedItems }}
      </view>
      <view v-if="item && update" class="c-date">
        <view
          v-if="showTimeType==1 && item.validTimeType==2"
          class="c-data-info"
        >{{ i18n.getCoupons + ' ' }}{{ item.validDays }}{{ i18n.invalid }}</view>
        <view
          v-else
          class="c-data-info"
        >{{ item.startTime }}~{{ item.endTime }}</view>
        <view
          v-if="item.canReceive && !order"
          class="c-btn"
          @tap="receiveCoupon"
        >{{ i18n.getIt }}</view>
        <view
          v-if="!item.canReceive && !order"
          class="c-btn get-btn"
          @tap="useCoupon"
        >{{ i18n.useItNow }}</view>
        <view
          v-if="item.canUse==false && !order"
          class="no-use-btn"
          @tap="receiveCoupon"
        >{{ i18n.getIt }}</view>
      </view>
      <view
        v-if="order && canUse"
        class="sel-btn"
      >
        <checkbox
          color="#eb2444"
          :data-couponid="item.couponId"
          :checked="item.choose"
          @tap="checkCoupon"
        />
      </view>
    </view>
    <!-- 我的优惠券状态(优惠券状态 0:失效 1:有效 2:使用过) -->
    <!-- 已使用 -->
    <image
      v-if="type==2 && myCoupon"
      class="tag-img"
      :src="isEn ? '/static/images/icon/coupon-used-en.png':'/static/images/icon/coupon-used.png'"
    />
    <!-- 已过期 -->
    <image
      v-if="type==0 && myCoupon"
      class="tag-img"
      :src="isEn ? '/static/images/icon/coupon-ot-en.png':'/static/images/icon/coupon-ot.png'"
    />
  </view>
</template>

<script>
const http = require('../../utils/http.js')
const util = require('../../utils/util.js')

export default {

  components: {},
  props: {
    // item: Object,
    couponItem: Object,
    type: [Number, String],
    order: Boolean,
    canUse: Boolean,
    index: Number,
    showTimeType: Number,
    myCoupon: Boolean
  },
  data() {
    return {
      stsType: 4,
      item: this.couponItem, // 领券操作会直接修改父组件传递的数据引起报错,这个用来存数据
      update: true, // 组件内部数据改变不触发视图重绘,这个用来手动重绘
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
  },
  methods: {
    /**
     * 调整金额格式
     */
    parsePrice(val) {
      if (!val) {
        val = 0
      }
      return val.toFixed(2).split('.')
    },
    receiveCoupon(e) {
      util.checkAuthInfo(() => {
        var couponId = this.item.couponId
        http.request({
          url: '/p/myCoupon/receive',
          method: 'POST',
          data: couponId,
          callBack: (res) => {
            this.update = false
            var coupon = this.item
            coupon.canReceive = false
            this.setData({
              item: coupon
            })
            uni.showToast({
              title: res,
              // #ifndef MP-TOUTIAO
              mask: true
              // #endif
            })
            this.update = true
          }
        })
      })
    },

    checkCoupon(e) {
      this.$emit('checkCoupon', {
        couponId: e.currentTarget.dataset.couponid
      })
    },

    /**
     * 立即使用
     */
    useCoupon() {
      util.checkAuthInfo(() => {
        var url = '/package-prod/pages/prod-classify/prod-classify?sts=' + this.stsType
        var id = this.item.couponId
        var title = this.i18n.couponEventGoods

        if (id) {
          url += '&tagid=' + id + '&title=' + title
        }

        uni.navigateTo({
          url: url
        })
      })
    }

  }
}
</script>
<style>
@import "./index.css";
</style>
