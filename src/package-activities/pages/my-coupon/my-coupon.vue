<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 我的优惠券 -->
  <view class="Mall4j container">
    <view class="h-tabs">
      <!-- 我的优惠券状态(优惠券状态 0:失效 1:有效 2:使用过) -->
      <view
        :class="'h-tab ' + (type == 1 ? 'on' : '')"
        data-type="1"
        @tap="changeTab"
      >{{ i18n.unused }}({{ unUseCount }})</view>
      <view
        :class="'h-tab ' + (type == 2 ? 'on' : '')"
        data-type="2"
        @tap="changeTab"
      >{{ i18n.usageRecord }}({{ useCount }})</view>
      <view
        :class="'h-tab ' + (type == 0 ? 'on' : '')"
        data-type="0"
        @tap="changeTab"
      >{{ i18n.expired }}({{ expiredCount }})</view>
    </view>
    <view class="coupons">
      <block v-for="(item, id) in couponList" :key="id">
        <coupon
          :data-couponid="item.couponId"
          :can-use="type == 1"
          :coupon-item="item"
          :type="type"
          :my-coupon="true"
          @longtap="delCouponHandle"
        />
      </block>
    </view>

    <!-- 空列表或加载全部提示 -->
    <EmptyAllTips
      v-if="isLoaded"
      :isEmpty="!couponList.length"
      :emptyTips="i18n.couponTips"
      :isAll="isAll"
    />
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
import coupon from '@/components/coupon/index.vue'

export default {
  components: {
    coupon
  },
  props: {},
  data() {
    return {
      type: 1,
      couponList: [],
      unUseCount: 0,
      useCount: 0,
      expiredCount: 0,
      pages: 0,
      current: 1,
      size: 20,
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
  onLoad: function(options) {
    this.couponCount()
    this.loadMyCouponData(this.type)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    uni.setNavigationBarTitle({
      title: this.i18n.myDiscountCoupon
    })
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
  onPullDownRefresh: function() {
    if (this.current < this.pages) {
      this.loadOrderData(this.sts, this.current + 1)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.current < this.pages) {
      this.setData({
        current: this.current + 1
      })
      this.loadMyCouponData(this.type)
    } else {
      this.isAll = true
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  methods: {
    /**
     * 获取我的优惠券列表
     */
    loadMyCouponData(type) {
      this.isLoaded = false
      // 我的优惠券状态(status优惠券状态 0:失效 1:有效 2:使用过)
      const params = {
        url: '/p/myCoupon/getCouponList',
        method: 'GET',
        data: {
          status: type,
          current: this.current,
          size: this.size
        },
        callBack: (res) => {
          this.isLoaded = true
          let list = []
          if (res.current == 1) {
            list = res.records
          } else {
            list = this.couponList.concat(res.records)
          }
          this.setData({
            couponList: list,
            pages: res.pages
          })
        }
      }
      http.request(params)
    },

    /**
     *  标签切换事件
     */
    changeTab(e) {
      this.setData({
        current: 1,
        type: e.currentTarget.dataset.type,
        couponList: []
      })
      this.loadMyCouponData(this.type)
    },

    /**
     *  获取各个状态下优惠券数量
     */
    couponCount() {
      var ths = this
      const params = {
        url: '/p/myCoupon/getMyCouponsStatusCount',
        method: 'GET',
        data: {},
        callBack: function(res) {
          ths.setData({
            unUseCount: res.unUseCount,
            expiredCount: res.expiredCount,
            useCount: res.useCount
          })
        }
      }
      http.request(params)
    },

    /**
     * 删除优惠券
     */
    delCouponHandle(e) {
      const couponId = e.currentTarget.dataset.couponid
      const ths = this
      uni.showModal({
        title: '',
        content: ths.i18n.deleteCouponTips,
        cancelText: ths.i18n.cancel,
        confirmText: ths.i18n.confirm,
        confirmColor: '#eb2444',
        success(res) {
          if (res.confirm) {
            const params = {
              url: '/p/myCoupon/deleteCoupon/' + couponId,
              method: 'DELETE',
              data: {},
              callBack: function(res) {
                ths.loadMyCouponData(ths.type)
              }
            }
            http.request(params)
          }
        }
      })
    }
  }
}
</script>
<style>
@import "./my-coupon.css";
</style>
