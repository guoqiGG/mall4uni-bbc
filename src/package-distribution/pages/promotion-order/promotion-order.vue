<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <view class="pro-order">
      <view class="title">
        <!-- (0:待支付 1:待结算 2:已结算 -1:订单失效) -->
        <text data-state="0" :class="state == 0 ? 'on' : ''" @tap="onStsTap">{{
          i18n.all
        }}</text>
        <text data-state="1" :class="state == 1 ? 'on' : ''" @tap="onStsTap">{{
          i18n.unsettlement
        }}</text>
        <text data-state="2" :class="state == 2 ? 'on' : ''" @tap="onStsTap">{{
          i18n.settled
        }}</text>
        <text
          data-state="-1"
          :class="state == -1 ? 'on' : ''"
          @tap="onStsTap"
        >{{ i18n.incomeExpired }}</text>
      </view>

      <!-- 推广订单列表 -->
      <view class="main">
        <view v-for="(item, id) in records" :key="id" class="prod-item">
          <view class="order-num">
            <text>{{ i18n.orderNumber }}：{{ item.orderNumber }}</text>
            <view class="order-state">
              <text v-if="item.state == 1" class="colorTop">{{ i18n.unsettlement }}</text>
              <text v-if="item.state == 2">{{ i18n.settled }}</text>
              <text v-if="item.state == -1" class="colorFailure">{{ i18n.incomeExpired }}</text>
            </view>
          </view>
          <!-- 商品无效原因 -->
          <view v-if="item.reson == 1 || item.reson == 2 ||item.reson == 3 " class="order-invalid">
            <image class="icon" src="../../static/images/icon/my-friends-warn.png" />
            <text v-if="item.reson === 1">{{ i18n.reasonsForInvalidOrders1 }}</text>
            <text v-if="item.reson === 2">{{ i18n.reasonsForInvalidOrders2 }}</text>
            <text v-if="item.reson === 3">{{ i18n.reasonsForInvalidOrders3 }}</text>
          </view>

          <!-- 一个订单单个商品的显示 -->
          <block>
            <block>
              <view>
                <view class="item-cont">
                  <view class="prod-pic">
                    <image v-if="item.pic" :src="item.pic" @error="imgErr(id)" />
                    <image v-else src="/static/images/icon/def.png" mode="aspectFit" />
                  </view>
                  <view class="prod-info">
                    <view class="prodname">{{ item.prodName }}</view>
                    <view v-if="item.skuName " class="prod-info-cont">{{ item.skuName || "" }}</view>
                    <view class="price-nums">
                      <text class="prodprice">
                        <text class="symbol">￥</text>
                        <!-- <text class='big-num'>{{parsePrice(35)[0]}}</text>
                      <text class='small-num'>.{{parsePrice(00)[1]}}</text>-->
                        <text class="big-num">{{ toPrice(item.price) }}</text>
                      </text>
                      <text class="prodcount">x{{ item.prodCount }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </block>
          </block>
          <view class="total-num">
            <view>
              <text class="prodcount">{{ i18n.inTotal }}{{ item.prodCount }}{{ i18n.items }}</text>
              <view class="prodprice">{{ i18n.total }}：<text class="symbol">￥</text>
                <text class="big-num">{{ toPrice(item.total) }}</text>
              </view>
            </view>
            <view class="prodprice">{{ i18n.commission }}：<text class="symbol color">￥</text>
              <text class="big-num color">{{ toPrice(item.distributionAmount) }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空 -->
      <!-- <view v-if="records.length == 0" class="empty">{{ emptyMsg }}</view> -->
      <!-- 加载到底~ -->
      <!-- <view v-if="totalPage > 1" class="loading">{{ loadingMsg }}</view> -->

      <!-- 空列表或加载全部提示 -->
      <view :style="records.length == 0?'margin-top:100px;':''">
        <EmptyAllTips
          v-if="isLoaded"
          :isEmpty="records.length == 0"
          :emptyTips="emptyMsg"
          :isAll="totalPage > 1"
          :allTips="loadingMsg"
        />
      </view>

      <!-- end 推广订单列表 -->
    </view>
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
const config = require('../../../utils/config.js')

export default {
  components: {},
  props: {},
  data() {
    return {
      sts: 0,
      state: '',
      records: [],
      loadingMsg: '',
      emptyMsg: '',
      totalPage: 1,
      pageNum: 1,
      current: 0,
      size: 20,
      pages: 0,
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.myPromotion
    })

    this.loadingMsg = this.i18n.loading
    this.loadPageData(1)
  },

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
  methods: {
    /**
     * 点击切换事件 0:全部
     */
    onStsTap: function(e) {
      const state = e.currentTarget.dataset.state
      this.setData({
        state: state,
        current: 1,
        size: 20,
        pages: 0
      })
      this.loadPageData(1)
    },

    // 商品图片加载失败
    imgErr(id) {
      this.records[id].pic = ''
    },

    /**
     * 通过状态加载分销订单列表
     */
    loadPageData: function(pageNum) {
      this.isLoaded = false
      var state = this.state
      if (state === '0') {
        state = ''
      }
      const params = {
        url: '/p/distribution/income/myPromotionOrder',
        method: 'GET',
        data: {
          current: pageNum,
          size: this.size,
          state
        },
        callBack: (res) => {
          this.isLoaded = true
          // console.log(res)
          res.records.forEach(item => {
            item.pic = item.pic?.indexOf('http') !== -1 ? item.pic : config.picDomain + item.pic
          })
          var records = []
          if (res.current == 1) {
            records = res.records
          } else {
            records = this.records.concat(res.records)
          }
          var loadingMsg = this.loadingMsg
          if (pageNum == res.pages) {
            loadingMsg = this.i18n.noMore
          }

          this.setData({
            records: records,
            totalPage: res.pages,
            pageNum: pageNum,
            loadingMsg: loadingMsg,
            emptyMsg: this.i18n.noRecordsFound
          })
        }
      }
      http.request(params)
    }
  }
}
</script>
<style>
@import "./promotion-order.css";
</style>
