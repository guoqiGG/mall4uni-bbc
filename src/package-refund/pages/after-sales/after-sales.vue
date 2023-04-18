<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 退款/售后 -->
  <view class="Mall4j page">
    <view class="goods-list">
      <view v-for="(item, index) in list" :key="index" class="goods-item">
        <!-- 店铺 -->
        <view class="shop-box clearfix">
          <view
            class="shop-img"
          ><image
            src="/static/images/icon/shop.png"
          /></view>
          <view class="shopname">{{ i18n.shop }}: {{ item.shopName }}</view>
        </view>
        <view v-if="item.orderItems.length == 1" class="goods-msg-box">
          <!-- 图片 -->
          <view class="img-box">
            <ImgShow :src="item.orderItems[0].pic" />
          </view>
          <!-- 信息 -->
          <view class="goods-text">
            <view class="goods-title">{{ item.orderItems[0].prodName }}</view>
            <view
              class="goods-quantity"
            >{{ i18n.quantity }}：{{ item.refundType === 1 ? item.orderItems[0].prodCount : item.goodsNum }}{{ i18n.piece }}</view>
            <!-- 查看详情btn -->
            <view class="item-bottom clearfix">
              <text
                class="view-details"
                :data-refundsn="item.refundSn"
                @tap="toRefundDetails"
              >{{ i18n.seeDetails }}</text>
            </view>
          </view>
        </view>
        <view v-else class="goods-msg-box">
          <block>
            <view
              class="item-cont"
              :data-refundsn="item.refundSn"
              @tap="toRefundDetails"
            >
              <scroll-view
                scroll-x="true"
                scroll-left="0"
                scroll-with-animation="false"
                class="categories"
              >
                <block v-for="(prod, index2) in item.orderItems" :key="index2">
                  <view class="prod-pic">
                    <ImgShow :src="prod.pic" />
                  </view>
                </block>
              </scroll-view>
            </view>
          </block>
        </view>

        <!-- 退款进度提示 -->
        <view class="goods-item-tips">
          <view class="rmb-icon">
            <!-- 仅退款 -->
            <image
              v-if="item.applyType == 1"
              src="../../static/images/icon/rmb-icon.png"
            />
            <!-- 退货退款 -->
            <image
              v-if="item.applyType == 2"
              src="../../static/images/icon/refunds.png"
            />
          </view>
          <!-- applyType  申请类型:1,仅退款,2退款退货 -->
          <!-- 处理退款状态:(1.买家申请 2.卖家接受 3.买家发货 4.卖家收货 5.退款成功 6.买家撤回申请 7.商家拒绝 -1.退款关闭) -->
          <view v-if="item.applyType == 1" class="refund-type">{{
            i18n.refund01
          }}</view>
          <view v-if="item.applyType == 2" class="refund-type">{{
            i18n.refund02
          }}</view>
          <view v-if="item.returnMoneySts == 1" class="refund-process">{{
            i18n.refund1
          }}</view>
          <view
            v-if="item.returnMoneySts == 2 && item.applyType == 1"
            class="refund-process"
          >{{ i18n.refund21 }}</view>
          <view
            v-if="item.returnMoneySts == 2 && item.applyType == 2"
            class="refund-process"
          >{{ i18n.refund22 }}</view>
          <view
            v-if="item.returnMoneySts == 3 && item.applyType == 2"
            class="refund-process"
          >{{ i18n.refund3 }}</view>
          <view
            v-if="item.returnMoneySts == 4 && item.applyType == 2"
            class="refund-process"
          >{{ i18n.refund4 }}</view>
          <view v-if="item.returnMoneySts == 5" class="refund-process">{{
            i18n.refund5
          }}</view>
          <view v-if="item.returnMoneySts == 6" class="refund-process">{{
            i18n.refund6
          }}</view>
          <view v-if="item.returnMoneySts == 7" class="refund-process">{{
            i18n.refund7
          }}</view>
          <view v-if="item.returnMoneySts == -1" class="refund-process">{{
            i18n.refund_1
          }}</view>
        </view>
      </view>

      <!-- 空列表或加载全部提示 -->
      <EmptyAllTips
        v-if="isLoaded"
        :isEmpty="!list.length"
        :emptyTips="i18n.refundEmpty"
        :isAll="loadAll"
      />
    </view>
  </view>
</template>

<script>
const http = require('@/utils/http.js')

export default {
  components: {},
  props: {},
  data() {
    return {
      list: [],
      current: 1,
      pages: 0,
      startTime: '',
      // 开始时间
      endTime: '', // 结束时间
      isLoaded: false
      // orderItems: '',  //订单项
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
    this.myRefundOrder() // 退款订单列表
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
      title: this.i18n.refundAfterSale
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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.current < this.pages) {
      this.setData({
        current: this.current + 1
      })
      this.myRefundOrder()
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
    /**
     * 我的退款订单列表
     */
    myRefundOrder: function(e) {
      this.isLoaded = false
      const params = {
        url: '/p/orderRefund/list',
        method: 'GET',
        data: {
          current: this.current,
          size: 20,
          startTime: this.startTime,
          endTime: this.endTime
        },
        callBack: (res) => {
          this.isLoaded = true
          var list = []
          if (res.current == 1) {
            list = res.records
          } else {
            list = this.list
            list = list.concat(res.records)
          }
          this.list = list
          this.pages = res.pages
          this.current = res.current
        }
      }
      http.request(params)
    },

    /**
     * 点击查看详情跳转页面
     */
    toRefundDetails: function(e) {
      var refundSn = e.currentTarget.dataset.refundsn
      uni.navigateTo({
        url:
          '/package-refund/pages/details-of-refund/details-of-refund?refundSn=' +
          refundSn
      })
    }
  }
}
</script>
<style>
@import "./after-sales.css";
</style>
