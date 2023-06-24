<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <view class="take-notes">
      <view class="total">
        <text>{{ i18n.totalWithdrawal }}：</text>
        <text class="total-num">￥{{ toPrice(totalWithdrawCash) }}</text>
      </view>
      <block v-for="(item, id) in records" :key="id">
        <view class="items">
          <view class="left">
            <view v-if="item.type===0" class="text">{{ i18n.offlinePayment }}</view>
            <view v-if="item.type===1" class="text">{{ i18n.onlinePayment }}</view>
            <view class="date">{{ item.createTime }}</view>
          </view>
          <view class="right">
            <view class="number">+ {{ toPrice(item.amount) }}</view>
            <view v-if="item.state == -1" class="status">{{
              i18n.theFallback
            }}</view>
            <view v-if="item.state == 0" class="status">{{
              i18n.withdrawing
            }}</view>
            <view v-if="item.state == 1" class="status">{{
              i18n.successfulWithdrawal
            }}</view>
            <view v-if="item.state == 2" class="status">{{
              i18n.rejection
            }}</view>
          </view>
        </view>
      </block>
      <!-- <view v-if="records.length == 0" class="empty">{{ emptyMsg }}</view>
      <view v-if="totalPage > 1" class="loading">{{ loadingMsg }}</view> -->
      <!-- 空列表或加载全部提示 -->
      <EmptyAllTips
        v-if="isLoaded"
        :isEmpty="!records.length"
        :emptyTips="i18n.noWithdrawalRecord"
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
      totalWithdrawCash: 0,
      records: [],
      // loadingMsg: this.i18n.loading,
      loadingMsg: '',
      emptyMsg: '',
      totalPage: 1,
      pageNum: 1,
      current: '',
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
      title: this.i18n.withdrawalsRecord
    })

    this.getTotalWithdrawCash()
    this.loadPageData(1)
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
      this.setData({
        current: this.current + 1
      })
      this.getWithdrawCashPage()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.pageNum < this.totalPage) {
      this.loadPageData(this.pageNum + 1)
    }
  },
  methods: {
    /**
     * 获取提现总金额
     */
    getTotalWithdrawCash: function() {
      var ths = this
      const params = {
        url: '/p/distribution/withdrawCash/totalWithdrawCash',
        method: 'GET',
        // data: {
        //   shopId: 1
        // },
        callBack: function(res) {
          ths.setData({
            totalWithdrawCash: res
          })
        }
      }
      http.request(params)
    },

    /**
     * 分页获取提现记录
     */
    loadPageData: function(pageNum) {
      this.isLoaded = false
      var ths = this
      const params = {
        url: '/p/distribution/withdrawCash/page',
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
          ths.setData({
            records: records,
            totalPage: res.pages,
            pageNum: pageNum,
            loadingMsg: loadingMsg,
            emptyMsg: ths.i18n.noWithdrawalRecord
          })
        }
      }
      http.request(params)
    }
  }
}
</script>
<style>
@import "./take-notes.css";
</style>
