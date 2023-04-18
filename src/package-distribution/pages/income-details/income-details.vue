<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <view>
      <view class="income-detail">
        <view class="gather-income">
          <view class="title">{{ i18n.cumulativeIncome }}</view>
          <view class="number">{{ toPrice(addupAmount) }}</view>
        </view>
        <view class="income-item">
          <view class="items">
            <view>{{ i18n.availableBalance }}</view>
            <view>{{ toPrice(settledAmount) }}</view>
          </view>
          <view class="items">
            <view>{{ i18n.toBeSettled }}</view>
            <view>{{ toPrice(unsettledAmount) }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 收益明细 -->
    <view class="income-block">
      <view class="block-title">
        <view>{{ i18n.monthEarnings }}：￥{{ toPrice(monthAmount) }}</view>
        <view>{{ i18n.todayEarnings }}：￥{{ toPrice(todayAmount) }}</view>
      </view>

      <view class="block-lists">
        <block v-for="(item, id) in records" :key="id">
          <view class="list-item">
            <view class="tit">
              <view class="tit-left">
                <!-- 0其他、1一代奖励、2二代奖励、3邀请奖励 -->
                <text v-if="item.incomeType === 0" class="origin">{{
                  i18n.other
                }}</text>
                <text v-if="item.incomeType === 1" class="origin">{{
                  i18n.reward1
                }}</text>
                <text v-if="item.incomeType === 2" class="origin">{{
                  i18n.reward2
                }}</text>
                <text v-if="item.incomeType === 3" class="origin">{{
                  i18n.reward3
                }}</text>
                <text
                  v-if="item.incomeType === 4 && item.state === null"
                  class="origin"
                >{{ i18n.platformUpdate }}</text>
                <view class="date">{{ item.updateTime }}</view>
              </view>
              <view class="income-num">
                <text
                  :class="[
                    !item.state && item.state === null ? 'income-fail' : '',
                  ]"
                >
                  {{
                    item.incomeAmount > 0
                      ? "+" + toPrice(item.incomeAmount)
                      : toPrice(item.incomeAmount)
                  }}
                </text>
                <!-- <text v-else>+{{toPrice(item.incomeAmount)}}</text> -->
                <text
                  v-if="item.state !== null && item.incomeType !== 4"
                  class="origin-status"
                >{{
                  item.state == -1
                    ? i18n.incomeExpired
                    : item.state == 2
                      ? i18n.settled
                      : i18n.unsettlement
                }}</text>
              </view>
            </view>
          </view>
        </block>
      </view>

      <!-- <view v-if="records.length == 0" class="empty">{{ emptyMsg }}</view> -->
      <!-- <view v-if="totalPage > 1" class="loading">{{ loadingMsg }}</view> -->
      <!-- 空列表或加载全部提示 -->
      <EmptyAllTips
        v-if="isLoaded"
        :isEmpty="records.length == 0"
        :emptyTips="emptyMsg"
        :isAll="totalPage > 1"
        :allTips="loadingMsg"
      />
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
      unsettledAmount: 0,
      // 待结算金额
      settledAmount: 0,
      // 可提现金额
      invalidAmount: 0,
      // 已失效金额
      addupAmount: 0,
      // 累计收益
      monthAmount: 0,
      // 本月收益
      todayAmount: 0,
      // 今日收益
      records: [],
      // loadingMsg: i18n.loading,
      loadingMsg: '',
      emptyMsg: '',
      totalPage: 1,
      pageNum: 1,
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
    this.getDisIncomeData() // 获取收益列表
    this.loadPageData(1)
    this.loadingMsg = this.i18n.loading
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
      title: this.i18n.incomeBreakdown
    })

    // 获取钱包数据
    this.getDisWalletData() // 获取收益数据
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
  onReachBottom: function() {
    if (this.pageNum < this.totalPage) {
      this.loadPageData(this.pageNum + 1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  methods: {
    /**
     * 获取我的钱包信息
     */
    getDisWalletData: function() {
      var ths = this
      const params = {
        url: '/p/distribution/wallet/info',
        method: 'GET',
        callBack: function(res) {
          ths.setData({
            unsettledAmount: res.unsettledAmount,
            settledAmount: res.settledAmount,
            invalidAmount: res.invalidAmount,
            addupAmount: res.addupAmount
          })
        }
      }
      http.request(params)
    },

    /**
     * 获取用户本月收益和今日收益
     */
    getDisIncomeData: function() {
      var ths = this
      const params = {
        url: '/p/distribution/income/statistics',
        method: 'GET',
        // data: {
        //   shopId: 1
        // },
        callBack: function(res) {
          ths.setData({
            todayAmount: res.todayAmount,
            monthAmount: res.monthAmount
          })
        }
      }
      http.request(params)
    },

    /**
     * 收入列表
     */
    loadPageData: function(pageNum) {
      this.isLoaded = false
      var ths = this
      const params = {
        url: '/p/distribution/income/page',
        method: 'GET',
        data: {
          // shopId: 1,
          current: pageNum,
          size: 20
        },
        callBack: (res) => {
          this.isLoaded = true
          var records = []

          if (res.current == 1) {
            records = res.records
          } else {
            records = this.records.concat(res.records)
          }

          var loadingMsg = this.loadingMsg

          if (pageNum == res.pages) {
            loadingMsg = ths.i18n.noMore
          }

          console.log(res)
          this.setData({
            records: records,
            totalPage: res.pages,
            pageNum: pageNum,
            loadingMsg: loadingMsg,
            emptyMsg: ths.i18n.noProfit
          })
        }
      }
      http.request(params)
    }
  }
}
</script>
<style>
@import "./income-details.css";
</style>
