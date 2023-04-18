<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- pages/special-discount/special-discount.wxml -->
  <view class="Mall4j discount-list">
    <image src="../../static/images/icon/activity-bg.png" class="list-bg" />
    <block v-if="endTimeList[index] && endTimeList[index].flag">
      <view
        v-for="(item, indexItem) in discountList"
        :key="item.discountId"
        :class="['item', item.mobilePic ? '' : 'no-bg']"
        :data-discountid="item.discountId"
        @tap="toDiscountDetail"
      >
        <image v-if="!item.isPicError" :src="item.mobilePic" class="bg" @error="handlePicError(item)" />
        <image v-else src="/static/images/icon/def.png" class="bg" mode="aspectFill" />
        <view class="text-box">
          <view class="info">{{ item.discountName }}</view>
          <view
            class="shop"
          >{{ item.shopName }}{{ i18n.specialty
          }}<image
            src="../../static/images/icon/activity-arr.png"
            class="arr"
          />
          </view>
          <view class="time">
            <view class="time-icon" />{{ i18n.onlyLeft
            }}<view v-if="endTimeList[indexItem].day" class="much-time">
              <view class="day">{{ endTimeList[indexItem].day }}</view>{{ i18n.day }}</view>
            <!-- 大于24小时展示 -->
            <view v-if="endTimeList[indexItem].day == 0" class="number-box">
              <view class="number">{{ endTimeList[indexItem].hour }}</view>
              <view class="colon">:</view>
              <view class="number">{{ endTimeList[indexItem].min }}</view>
              <view class="colon">:</view>
              <view class="number">{{ endTimeList[indexItem].second }}</view>
            </view>
          <!-- 小于24小时展示 -->
          </view>
        </view>
      </view>
    </block>

    <!-- 空列表或加载全部提示 -->
    <EmptyAllTips
      v-if="isLoaded"
      :isEmpty="discountList.length == 0"
      :emptyTips="i18n.noMoreActivities"
      :isAll="discountList.length>10&&loadAll"
    />
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')

export default {
  props: {},
  data() {
    return {
      index: 0,
      discountList: [],
      // 优惠活动列表
      current: 1,
      // 当前页数
      pages: 1,
      // 总页数
      endTimeList: [],
      // 结束时间
      timer: '',
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
  onLoad: function(options) {
    this.getDiscountPage(1) // 默认加载第一页
  },

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
      title: this.i18n.limitedTimeOffer
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearTimeout(this.timer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.current < this.pages) {
      this.getDiscountPage(this.current + 1)
    } else {
      this.setData({
        loadAll: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  methods: {
    // 获取优惠活动列表
    getDiscountPage(cur) {
      this.isLoaded = false
      var ths = this
      http.request({
        url: '/marking/discount/getDiscountList',
        data: {
          current: cur,
          // 当前页
          size: 20
        },
        method: 'GET',
        callBack: (res) => {
          this.isLoaded = true
          var list = []
          if (res.current == 1) {
            list = res.records
          } else {
            list = ths.discountList
            Array.prototype.push.apply(list, res.records)
          }
          var endTimeList = []
          list.forEach((item) => {
            endTimeList.push({
              endTime: item.endTime
            })
          })
          this.setData({
            discountList: list,
            pages: res.pages,
            endTimeList: endTimeList,
            current: res.current,
            loadAll: res.pages == cur
          })
          this.countTime()
        }
      })
    },

    // 倒计时
    countTime() {
      var endTimeList = this.endTimeList
      endTimeList.forEach((item, index) => {
        // 获取当前时间
        const date = new Date()
        const now = date.getTime() // 设置截止时间

        const end = util.dateToTimestamp(item.endTime) // 时间差

        const leftTime = end - now // 定义变量 d,h,m,s保存倒计时的时间

        if (leftTime >= 0) {
          // 天
          item.day = Math.floor(leftTime / 1000 / 60 / 60 / 24) // 时

          const h = Math.floor((leftTime / 1000 / 60 / 60) % 24)
          item.hour = h < 10 ? '0' + h : h // 分

          const m = Math.floor((leftTime / 1000 / 60) % 60)
          item.min = m < 10 ? '0' + m : m // 秒

          const s = Math.floor((leftTime / 1000) % 60)
          item.second = s < 10 ? '0' + s : s
          item.flag = true
        } else {
          item.day = 0
          item.hour = '00'
          item.min = '00'
          item.second = '00'
          item.flag = false
        }
      })
      this.setData({
        endTimeList: endTimeList
      }) // 递归每秒调用countTime方法，显示动态时间效果,

      this.setData({
        timer: setTimeout(this.countTime, 1000)
      })

      this.$forceUpdate()
    },

    // 跳转活动详情
    toDiscountDetail(e) {
      util.tapLog(3)
      var discountId = e.currentTarget.dataset.discountid
      uni.navigateTo({
        url:
          '/package-activities/pages/discount-detail/discount-detail?discountId=' +
          discountId
      })
    },

    /**
     * 图片加载失败时显示默认图片
     */
    handlePicError(item) {
      this.$set(item, 'isPicError', true)
    }
  }
}
</script>
<style>
@import "./special-discount.css";
</style>
