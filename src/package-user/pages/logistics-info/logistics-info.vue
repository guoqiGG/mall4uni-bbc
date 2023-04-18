<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- pages/logistics-info/logistics-info.wxml -->
  <!-- 物流信息 -->
  <view class="Mall4j logistics-page">
    <view v-if="deliveryList.length" class="logistics-box">
      <!-- nav -->
      <view
        :class="
          'package-list ' +
            (deliveryList.length >= 5
              ? 'package-overlength'
              : 'package-list-flex')
        "
      >
        <block v-for="(item, index) in deliveryList" :key="index">
          <view class="package-item" :data-sts="index" @tap="navChange">
            <view
              :class="'nav-txt ' + (isCurrent == index ? 'active' : '')"
            >{{ i18n.package }}{{ index + 1 }}</view>
          </view>
        </block>
      </view>
      <!-- 包裹信息 -->
      <view :class="['package-info', { mt100: deliveryList.length > 1 }]">
        <view class="package-prod">
          <!-- 单个商品 -->
          <view
            v-if="deliveryList[isCurrent].orderItems.length == 1"
            class="single-package"
          >
            <view class="prod-pic">
              <image
                :src="
                  deliveryList[isCurrent].orderItems[0].pic
                    ? deliveryList[isCurrent].orderItems[0].pic
                    : '../../../images/icon/package-icon.png'
                "
                class="prod-pic"
                @error="imageError(deliveryList[isCurrent].orderItems[0],'pic')"
              />
              <view
                class="quantity"
              >×{{ deliveryList[isCurrent].orderItems[0].prodCount }}</view>
            </view>
            <view class="prod-con">
              <!-- 物流状态 1已揽收 2运输途中 3已签收 4问题件 201达到目的城市 -1删除 -->
              <!-- <view
                v-if="deliveryList[isCurrent].status != -1"
                class="prod-status"
              >{{
                [
                  "",
                  i18n.alreadyReceived,
                  i18n.inTransit,
                  i18n.signedInReceived,
                  i18n.questionableDelivery,
                  i18n.arriveDestinationCity,
                ][deliveryList[isCurrent].status]
              }}</view>
              <view
                v-if="deliveryList[isCurrent].status == -1"
                class="prod-status"
              >{{ i18n.delete }}</view> -->
              <view
                v-if="deliveryInfo&&deliveryInfo.deliveryDto"
                class="prod-carrier"
              >{{ i18n.carriageSource }}：{{
                deliveryInfo.deliveryDto.companyName
              }}</view>
              <view
                v-else
                class="prod-carrier"
              >{{ i18n.carriageSource }}：{{
                deliveryList[isCurrent].deliveryType === 4
                  ? i18n.sameDelivery
                  : i18n.noNeedDelivery
              }}</view>
              <view class="carrier">
                <text
                  v-if="deliveryInfo&&deliveryInfo.deliveryDto"
                  class="waybill-num"
                >{{ i18n.waybillNumber }}：{{
                  deliveryInfo.deliveryDto.dvyFlowId
                }}</text>
                <text v-if="deliveryInfo&&deliveryInfo.deliveryDto" class="copy-btn" @tap="copyBtn">{{
                  i18n.copy
                }}</text>
              </view>
            </view>
          </view>
          <!-- 多个商品 -->
          <view
            v-if="deliveryList[isCurrent].orderItems.length > 1"
            class="multiple-package"
          >
            <view class="prod-con">
              <!-- <view
                v-if="deliveryList[isCurrent].status != -1"
                class="prod-status"
              >{{
                [
                  "",
                  i18n.alreadyReceived,
                  i18n.inTransit,
                  i18n.signedInReceived,
                  i18n.questionableDelivery,
                  i18n.arriveDestinationCity,
                ][deliveryList[isCurrent].status]
              }}</view> -->
              <view
                v-if="deliveryList[isCurrent].status == -1"
                class="prod-status"
              >{{ i18n.delete }}</view>
              <view
                v-if="deliveryInfo&&deliveryInfo.deliveryDto"
                class="prod-carrier"
              >{{ i18n.carriageSource }}：
                {{ deliveryInfo.deliveryDto.companyName }}</view>
              <view
                v-else
                class="prod-carrier"
              >{{ i18n.carriageSource }}：
                {{
                  deliveryList[isCurrent].deliveryType === 4
                    ? i18n.sameDelivery
                    : i18n.noNeedDelivery
                }}</view>
              <view class="carrier">
                <text
                  v-if="deliveryInfo&&deliveryInfo.deliveryDto"
                  class="waybill-num"
                >{{ i18n.waybillNumber }}：{{
                  deliveryInfo.deliveryDto.dvyFlowId
                }}</text>
                <text v-if="deliveryInfo&&deliveryInfo.deliveryDto" class="copy-btn" @tap="copyBtn">{{
                  i18n.copy
                }}</text>
              </view>
            </view>
            <view class="prod-item">
              <block
                v-for="(prod, index) in deliveryList[isCurrent].orderItems"
                :key="index"
              >
                <view class="prod-item-pic">
                  <image
                    :src="
                      prod.pic
                        ? prod.pic
                        : '../../../images/icon/package-icon.png'
                    "
                    class="prod-pic"
                    @error="imageError(prod,'pic')"
                  />
                  <view class="quantity">×{{ prod.prodCount }}</view>
                </view>
              </block>
            </view>
          </view>
        </view>
      </view>
      <!-- 物流信息 -->
      <view v-if="(deliveryInfo&&deliveryInfo.deliveryDto)||deliveryList[isCurrent].deliveryType === 4" class="logistics-info">
        <view
          class="logistics-box"
        >
          <view class="logistics">
            <view
              v-if="
                (deliveryInfo.deliveryDto && deliveryInfo.deliveryDto.state === 0) &&
                  orderInfo.status == 5 &&
                  orderInfo.finallyTime !== null
              "
              class="item"
            >
              <view class="time">{{ orderInfo.finallyTime }}</view>
              <view class="des">买家已收货</view>
            </view>
            <block v-if="deliveryInfo.deliveryDto && deliveryInfo.deliveryDto.traces">
              <block
                v-for="(tracesItem, index) in deliveryInfo.deliveryDto.traces"
                :key="index"
              >
                <view class="item">
                  <view class="time">{{ tracesItem.acceptTime }}</view>
                  <view class="des">{{ tracesItem.acceptStation }}</view>
                </view>
              </block>
            </block>
            <view v-if="!deliveryInfo.deliveryDto || !(deliveryInfo.deliveryDto.traces&&deliveryInfo.deliveryDto.traces.length)" class="item">
              <view class="des">{{ i18n.noDeliveryInformation }}</view>
            </view>
            <view v-if="orderInfo.status >= 3 && orderInfo.dvyTime !== null" class="item">
              <view class="time">{{ orderInfo.dvyTime }}</view>
              <view class="des">商家已发货，等待快递拣货</view>
            </view>
            <view v-if="orderInfo.status >= 2 && orderInfo.payTime !== null" class="item">
              <view class="time">{{ orderInfo.payTime }}</view>
              <view class="des">买家已支付完成，等待发货</view>
            </view>
            <view v-if="orderInfo.status >= 1" class="item">
              <view class="time">{{ orderInfo.createTime }}</view>
              <view class="des">买家提交了订单，等待系统确认</view>
            </view>
          </view>
        </view>
        <!-- 物流信息为空 -->
        <!-- <view
          v-if="!deliveryInfo.deliveryDto || !deliveryInfo.deliveryDto.traces"
          class="logistics-info-empty"
        >{{ i18n.noDeliveryInformation }}</view> -->
      </view>
    </view>
    <!-- 包裹信息为空 -->
    <!-- <view v-if="!deliveryList.length" class="expresses-empty">{{
      i18n.noPackageTips
    }}</view> -->
  </view>
</template>

<script>
const http = require('@/utils/http.js')
import uniCopy from '@/js_sdk/copy/uni-copy.js'

export default {
  components: {},
  props: {},
  data() {
    return {
      // 运单编号
      orderNumber: '',
      // 当前nav
      isCurrent: 0,
      // 包裹集合信息
      deliveryList: [],
      // 展示的物流详情
      deliveryInfo: {},
      // 订单数据
      orderInfo: {}
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
    const params = {
      url: '/p/myDelivery/orderInfo/' + options.orderNumber,
      method: 'GET',
      callBack: (res) => {
        this.deliveryList = res
        if (res[0].deliveryDto && res[0].deliveryDto.traces) {
          res[0].deliveryDto.traces.reverse()
        }
        this.deliveryInfo = res[0]
      }
    }
    http.request(params)
    this.getOrderInfo(options.orderNumber)
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
      title: this.i18n.logisticsDetails
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
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  methods: {
    // 获取订单数据
    getOrderInfo(orderNum) {
      const that = this
      const params = {
        url: '/p/myOrder/orderDetail',
        method: 'GET',
        data: {
          orderNumber: orderNum
        },
        callBack: function(res) {
          that.orderInfo = res
        }
      }
      http.request(params)
    },
    /**
     * 获取指定包裹的物流信息
     */
    getDeliveryDtoById() {
      const params = {
        url:
          '/p/myDelivery/deliveryOrder/' +
          this.deliveryList[this.isCurrent].orderDeliveryId,
        method: 'GET',
        callBack: (res) => {
          if (res.deliveryDto && res.deliveryDto.traces) {
            res.deliveryDto.traces.reverse()
          }
          this.deliveryInfo = res
        },
        errCallBack: (errMsg) => {
          console.log(errMsg)
        }
      }
      http.request(params)
    },
    /**
     * nav切换
     */
    navChange: function(e) {
      const sts = e.currentTarget.dataset.sts
      this.setData({
        isCurrent: sts
      })
      this.getDeliveryDtoById()
    },
    // 一键复制事件
    copyBtn: function() {
      uniCopy({
        content: this.deliveryList[this.isCurrent].dvyFlowId,
        success: (res) => {
          uni.showToast({
            title: res,
            icon: 'none'
          })
        },
        error: (e) => {
          uni.showToast({
            title: e,
            icon: 'none',
            duration: 3000
          })
        }
      })
    }
  }
}
</script>
<style>
@import "./logistics-info.css";
</style>
