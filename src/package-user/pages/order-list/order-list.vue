<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- pages/order-list/order-list.wxml -->
  <view class="Mall4j container order-list">
    <!-- 头部菜单 -->
    <view class="order-tit">
      <text data-sts="0" :class="sts == 0 ? 'on' : ''" @tap="onStsTap">{{ i18n.all }}</text>
      <text data-sts="1" :class="sts == 1 ? 'on' : ''" @tap="onStsTap">{{ i18n.toBePaid }}</text>
      <text data-sts="2" :class="sts == 2 ? 'on' : ''" @tap="onStsTap">{{ i18n.toBeDelivered }}</text>
      <text data-sts="3" :class="sts == 3 ? 'on' : ''" @tap="onStsTap">{{ i18n.toBeReceived }}</text>
      <text data-sts="5" :class="sts == 5 ? 'on' : ''" @tap="onStsTap">{{ i18n.completed }}</text>
    </view>
    <!-- 头部菜单 end -->

    <!-- 订单列表 -->
    <view class="main">
      <block v-for="(item, orderNumber) in list" :key="orderNumber">
        <view class="prod-item">
          <!-- 店铺 -->
          <!-- <view class="shop-box" @tap="toShopIndex(item.shopId)">
            <view class="shop-icon">
              <image src="/static/images/icon/shop.png" />
            </view>
            <view class="shop-name">{{ item.shopName }}<span /></view>
          </view> -->
          <!-- 订单编号 -->
          <view class="order-num">
            <text>{{ i18n.orderNumber }}：{{ item.orderNumber }}</text>
            <view class="order-state">
              <text :class="['order-sts', { red: (item.status < 5) }]">{{
                ['', i18n.toBePaid, i18n.toBeDelivered, i18n.toBeReceived, i18n.toBeEvaluated, i18n.completed, i18n.cancelled, i18n.inAGroup][item.status]
              }}</text>
              <view class="red">
                <!-- returnMoneySts 退款状态 1.买家申请 2.卖家接受 3.买家发货 4.卖家收货 5.退款成功 6.买家撤回申请(无) 7.商家拒绝(无) -1.退款关闭 -->
                <!-- refundStatus 订单退款状态参考（1:申请退款 2:退款成功 3:部分退款成功 4:退款失败 -->
                <text v-if="item.returnMoneySts == 0" />
                <text
                  v-if="item.returnMoneySts == 1 || item.returnMoneySts == 2 || item.returnMoneySts == 3 || item.returnMoneySts == 4">({{
                    i18n.refunding }}
                  <block v-if="item.status <= 2 && item.deliveryCount && item.productNums > item.deliveryCount">, {{
                    i18n.partialDelivery }}</block>)
                </text>
                <!-- 部分退款关闭（退款中）item.refundStatus === 1 && item.returnMoneySts === -1 -->
                <text v-if="item.refundStatus === 1 && item.returnMoneySts === -1">({{ i18n.refunding }}
                  <block v-if="item.status <= 2 && item.deliveryCount && item.productNums > item.deliveryCount">, {{
                    i18n.partialDelivery }}</block>)
                </text>
                <!-- <text v-if="item.returnMoneySts==5||item.returnMoneySts==7">({{i18n.refundComplete}})</text> -->
                <!-- 退款完成 -->
                <text v-if="item.returnMoneySts == 5 && item.refundStatus !== 3">({{ i18n.refundComplete }})</text>
                <!-- 部分退款完成refundStatus === 3 && returnMoneySts === 5 -->
                <text
                  v-if="item.returnMoneySts == 5 && item.refundStatus == 3 && (item.status > 2 || (item.status === 2 && !item.deliveryCount))">
                  ({{ i18n.partialRefundCompleted }})
                </text>
                <!-- 部分发货 && 部分退款 -->
                <text
                  v-if="item.status <= 2 && item.deliveryCount && item.productNums > item.deliveryCount && item.returnMoneySts == 5 && item.refundStatus == 3">
                  ({{ i18n.partialRefund }}, {{ i18n.partialDelivery }})
                </text>
                <!-- 部分发货 -->
                <text
                  v-if="!item.refundStatus && item.status <= 2 && item.deliveryCount && item.productNums > item.deliveryCount">
                  ({{ i18n.partialDelivery }})
                </text>
                <!-- 退款关闭 -->
                <text
                  v-if="item.refundStatus !== 1 && item.returnMoneySts == -1 && (item.status > 2 || (item.status === 2 && !item.deliveryCount))">
                  ({{ i18n.refundClosed }})
                </text>
                <!-- 退款关闭, 部分发货 -->
                <text
                  v-if="item.refundStatus !== 1 && item.returnMoneySts == -1 && item.status <= 2 && item.deliveryCount && item.productNums > item.deliveryCount">
                  ({{ i18n.refundClosed }}, {{ i18n.partialDelivery }})
                </text>
              </view>
              <!-- 删除订单按钮 -->
              <view
                v-if="(item.status == 5 || item.status == 6) && (item.returnMoneySts > 4 || item.returnMoneySts == -1 || item.returnMoneySts == null || item.returnMoneySts == '')"
                class="clear-btn">
                <image src="/static/images/icon/clear-his.png" class="clear-list-btn" :data-ordernum="item.orderNumber"
                  @tap="delOrderList" />
              </view>
            </view>
          </view>
          <!-- 商品列表 -->
          <!-- 一个订单单个商品的显示 -->
          <block v-if="item.orderItemDtos.length == 1">
            <block v-for="(prod, prodId) in item.orderItemDtos" :key="prodId">
              <view>
                <view class="item-cont" :data-ordernum="item.orderNumber" @tap="toOrderDetailPage">
                  <view class="prod-pic">
                    <image v-if="prod.pic && !prod.isPicError" mode="aspectFill" :src="prod.pic"
                      @error="handlePicError(prod)" />
                    <image v-else src="/static/images/icon/def.png" mode="aspectFill" />
                  </view>
                  <view class="prod-info">
                    <view>
                      <view class="prodname">{{ prod.prodName }}</view>
                      <view class="sku-box">
                        <!-- 拼团icon -->
                        <text v-if="item.orderType" class="spell-group-icon">
                          <!-- orderType 订单类型(0普通订单 1团购订单 2秒杀订单) -->
                          {{ ['', i18n.aGroup, i18n.spike, i18n.integral][item.orderType] }}
                        </text>
                        <!-- 拼团icon end -->
                        <!-- 配送类型 1:快递 2:自提 3：无需快递) -->
                        <text v-if="item.dvyType == 2" class="spell-group-icon">{{ i18n.pickitUp }}</text>
                        <text class="prod-info-cont">{{ prod.skuName || '' }}</text>
                      </view>
                      <view v-if="item.preSaleTime" class="sku-box">
                        <text class="prod-info-cont">{{ tsToDate(item.preSaleTime) }}&nbsp;{{ $t('index.startDelivery')
                        }}</text>
                      </view>
                    </view>
                    <view class="price-nums">
                      <text class="prodprice">
                        <text v-if="prod.price" class="symbol">￥</text>
                        <text v-if="prod.price" class="big-num">{{ parsePrice(prod.price)[0] }}</text>
                        <text v-if="prod.price" class="small-num" style="font-size: 32rpx;">.{{ parsePrice(prod.price)[1] }}</text>
                        <text v-if="prod.price && item.orderType == 3" class="small-num" decode="true">&emsp;+&emsp;</text>
                        <text v-if="prod.useScore && item.orderType == 3" class="small-num">{{ prod.useScore / prod.prodCount
                        }} {{ i18n.integral }}</text>
                      </text>
                      <text class="prodcount">x{{ prod.prodCount }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </block>
          </block>
          <!-- 一个订单多个商品时的显示 -->
          <block v-else>
            <view class="item-cont" :data-ordernum="item.orderNumber" @tap="toOrderDetailPage">
              <scroll-view scroll-x="true" scroll-left="0" scroll-with-animation="false" class="categories">
                <block v-for="(prod, prodId) in item.orderItemDtos" :key="prodId">
                  <view class="prod-pic">
                    <!-- 拼团icon -->
                    <!-- <view class="spell-group-order"><image src="../../images/icon/spell-group-order.png"></image></view> -->
                    <!-- 拼团icon end -->
                    <image v-if="prod.pic && !prod.isPicError" mode="aspectFit" :src="prod.pic"
                      @error="handlePicError(prod)" />
                    <image v-else src="/static/images/icon/def.png" mode="aspectFit" />
                  </view>
                </block>
              </scroll-view>
            </view>
          </block>
          <!-- 总计 -->
          <view class="total-num">
            <text class="prodcount">{{ i18n.inTotal }}{{ item.totalCounts }}{{ i18n.items }}</text>
            <view class="prodprice">{{ i18n.total }}：
              <text v-if="item.actualTotal" class="symbol">￥</text>
              <text v-if="item.actualTotal" class="big-num">{{ parsePrice(item.actualTotal)[0] }}</text>
              <text v-if="item.actualTotal" class="small-num" style="font-size:32rpx;" decode="true">.{{ parsePrice(item.actualTotal)[1] + '&nbsp;'
              }}</text>
              <text v-if="(item.actualTotal && item.userScore > 0)" class="small-num">+</text>
              <text v-if="item.userScore > 0" class="big-num" decode="true">{{ '&nbsp;' + item.userScore + '&nbsp;' }}
                <text class="small-num">{{ i18n.integral }}</text></text>
            </view>
          </view>
          <!-- 商品列表 end -->
          <view
            v-if="item.status == 1 || item.status == 3 || item.status == 5 || (item.status == 5 && item.orderItemDtos[0].commSts == 0) || (item.status == 6 && item.returnMoneySts == 5 && item.refundStatus !== 3)"
            class="prod-foot">
            <view class="btn">
              <view v-if="item.status === 7" class="button" @tap="toGroupDetail(item.orderNumber)">{{
                i18n.inviteFriendsJoin }}
              </view>
              <view
                v-if="((item.orderInvoiceId && item.status !== 6) ||
                  (item.orderInvoiceId && (item.status === 6 && item.refundStatus))) && item.status !== 1 && item.orderType !== 3 && (!item.returnMoneySts || item.returnMoneySts >= 6 || item.returnMoneySts === -1)"
                class="button" @tap="viewIinvoice(item.orderNumber, item.orderInvoiceId)">{{ i18n.invoice.viewInvoice }}
              </view>
              <!-- <view
                v-if="!item.orderInvoiceId && item.status !== 6 && item.status !== 1 && item.orderType !== 3 && (!item.returnMoneySts || item.returnMoneySts >= 6 || item.returnMoneySts === -1)"
                class="button" @tap="showInvoicePopup(item.shopId, item.orderNumber)">{{ i18n.invoice.InvoicingRequest }}
              </view> -->
              <text v-if="item.status == 1" class="button" @tap="onCancelOrder(item.orderNumber)">{{ i18n.cancelOrder
              }}</text>
              <text v-if="item.status == 1" class="button warn"
                @tap="onPayAgain(item.orderNumber, item.orderType, item.dvyType)">{{ i18n.payment }}</text>
              <text v-if="(item.status == 3 || item.status == 5) && item.dvyType == 1" class="button"
                @tap="toDeliveryPage(item.orderNumber)">{{ i18n.viewLogistics }}</text>
              <text v-if="item.status == 3" class="button warn" :data-ordernum="item.orderNumber"
                @tap="onConfirmReceive(item.orderNumber)">{{ i18n.confirmRceipt }}</text>
              <!-- 评价 status==5 (已完成) || status==6 && item.returnMoneySts == 5 && item.refundStatus !== 3 (退款完成)  -->
              <text
                v-if="item.status == 5 && !item.orderItemDtos.some(val => val.commSts !== 0) && item.orderItemDtos.some(val => val.returnMoneySts !== 5 && val.commSts === 0) && item.shopId !== null && item.refundStatus !== 1 && item.orderType !== 3"
                class="button warn" :data-info="JSON.stringify(item.orderItemDtos)" :data-ordernum="item.orderNumber"
                @tap="onComment(item.orderItemDtos || item)">{{ i18n.evaluation }}</text>
            </view>
          </view>
          <view v-else class="prod-foot">
            <view class="btn">
              <view v-if="item.status === 7" class="button" @tap="toGroupDetail(item.orderNumber)">{{
                i18n.inviteFriendsJoin }}
              </view>
              <view
                v-if="((item.orderInvoiceId && item.status !== 6) ||
                  (item.orderInvoiceId && (item.status === 6 && item.refundStatus))) && item.status !== 1 && item.orderType !== 3 && (!item.returnMoneySts || item.returnMoneySts >= 6 || item.returnMoneySts === -1)"
                class="button" @tap="viewIinvoice(item.orderNumber, item.orderInvoiceId)">{{ i18n.invoice.viewInvoice }}
              </view>

              <!-- <view
                v-if="!item.orderInvoiceId && item.status !== 6 && item.status !== 1 && item.orderType !== 3 && (!item.returnMoneySts || item.returnMoneySts >= 6 || item.returnMoneySts === -1)"
                class="button" @tap="showInvoicePopup(item.shopId, item.orderNumber)">{{ i18n.invoice.InvoicingRequest }}
              </view> -->
            </view>
          </view>
        </view>
      </block>
      <!-- 空列表或加载全部提示 -->
      <EmptyAllTips v-if="isLoaded" :isEmpty="!list.length" :emptyTips="i18n.noOrderTips" :isAll="list.length > 4 && loadAll"
        :m0="true" />
    </view>
    <!-- 订单列表 end -->
    <!-- 返回首页的悬浮按钮 -->
    <view class="home" @tap="toHomePage">
      <image src="../../../static/images/icon/order-home.png" />
    </view>

    <invoiceEdit v-if="isShowInvoicePopup" :shop-id="invoiceShopId" :order-number="invoiceOrderNumber"
      @closePopup="closePopup" @getData="getOrderDataList" />
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')
const config = require('@/utils/config.js') 
import invoiceEdit from '../../../components/invoice-edit/index.vue'

export default {
  components: {
    invoiceEdit
  },
  props: {},
  data() {
    return {
      list: [],
      current: 1,
      pages: 0,
      sts: 0,
      endTime: '', // 订单过期时间
      loadAll: false, // 已加载全部
      invoiceShopId: '',
      isShowInvoicePopup: false,
      invoiceOrderNumber: '', // 当前选择发票的id
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
  onLoad: function (options) {
    if (options.sts) {
      this.setData({
        sts: options.sts
      })
    }
  },

  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {
    // 加载导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.orderList
    })
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    this.loadOrderData(this.sts, 1)
  },

  /**
    * 生命周期函数--监听页面初次渲染完成
    */
  onReady: function () { },

  /**
    * 生命周期函数--监听页面隐藏
    */
  onHide: function () {

  },

  /**
    * 生命周期函数--监听页面卸载
    */
  onUnload: function () { },

  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () { },

  /**
    * 页面上拉触底事件的处理函数
    */
  onReachBottom: function () {
    if (this.current < this.pages) {
      this.loadOrderData(this.sts, this.current + 1)
    } else {
      this.setData({
        loadAll: true
      })
    }
  },

  /**
    * 用户点击右上角分享
    */
  onShareAppMessage: function () { },
  methods: {
    /**
      * 邀请好友拼团(跳转拼团详情)
      */
    toGroupDetail(orderNumber) {
      uni.navigateTo({
        url: '/package-activities/pages/spell-group-details/spell-group-details?orderNumber=' + orderNumber
      })
    },

    // 发票信息弹窗
    showInvoicePopup(shopId, invoiceOrderNumber) {
      this.invoiceShopId = shopId
      this.invoiceOrderNumber = invoiceOrderNumber
      this.isShowInvoicePopup = true
    },
    // 关闭弹窗
    closePopup() {
      this.isShowInvoicePopup = false
    },
    getOrderDataList() {
      this.loadOrderData(this.sts, this.current, true)
    },
    /**
      * 加载订单数据
      */
    loadOrderData: function (sts, current, isGetOrderDataList = false) { //  isGetOrderDataList 是否为申请开票
      var ths = this
      this.isLoaded = false
      const params = {
        url: '/p/myOrder/myOrder',
        method: 'GET',
        data: {
          current: current,
          size: 10,
          status: sts
        },
        callBack: (res) => {
          this.isLoaded = true
          res.records.forEach(orderItem => {
            orderItem.totalCounts = 0
            if (orderItem.returnMoneySts == null) {
              orderItem.returnMoneySts = 0
            }
            orderItem.orderItemDtos.forEach(prod => {
              orderItem.totalCounts += prod.prodCount
            })
          })
          var list = []
          if (res.current == 1) {
            list = res.records
          } else {
            if (isGetOrderDataList) { // 申请开票  修改数据状态
              list = this.list.map((element) => {
                const index = res.records.findIndex(orderItem => orderItem.orderNumber === element.orderNumber)
                if (index !== -1) {
                  element = res.records[index]
                }
                return element
              })
            } else {
              list = ths.list.concat(res.records)
            }
          }
          ths.setData({
            list: list,
            pages: res.pages,
            current: res.current
          })
        }
      }
      http.request(params)
    },

    /**
      * 状态点击事件
      */
    onStsTap: function (e) {
      util.tapLog(3)
      var sts = e.currentTarget.dataset.sts
      this.setData({
        sts: sts
      })
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
      this.loadOrderData(sts, 1)
    },

    /**
      * 跳转店铺首页
      */
    toShopIndex(shopId) {
      if (shopId === 0) {
        uni.navigateTo({
          url: '/package-member-integral/pages/integral-index/integral-index'
        })
        return
      }
      const params = {
        url: '/shop/headInfo',
        method: 'GET',
        data: {
          shopId
        },
        callBack: (res) => {
          let url = '/package-shop/pages/shop-page/shop-page?shopId=' + shopId
          if (res.renovationId) {
            url = '/package-shop/pages/feature-index/feature-index0?shopId=' + shopId + '&renovationId=' + res.renovationId
          }
          uni.navigateTo({
            url
          })
        }
      }
      http.request(params)
    },

    /**
      * 查看物流
      */
    toDeliveryPage: function (orderNumber) {
      util.tapLog(3)
      
      // uni.navigateTo({
      //   url: '/package-user/pages/logistics-info/logistics-info?orderNumber=' + orderNumber
      // })

      // 查询快递单号
      const params = {
        url: `/p/myDelivery/delivery/${orderNumber}`,
        method: 'GET',
        data: {},
        callBack: (res) => {
          if (res[0].dvyFlowId) {
            wx.navigateTo({
              url: `plugin://kdPlugin/index?num=${res[0].dvyFlowId}&appName=${config.mpAppName}`
            })
          }
        }
      }
      http.request(params)
    },

    /**
      * 取消订单
      */
    onCancelOrder: function (orderNumber) {
      util.tapLog(3)
      uni.showModal({
        content: this.i18n.cancelOrderTips,
        confirmColor: '#3e62ad',
        cancelColor: '#3e62ad',
        cancelText: this.i18n.no,
        confirmText: this.i18n.yes,
        success: res => {
          if (res.confirm) {
            const params = {
              url: '/p/myOrder/cancel/' + orderNumber,
              method: 'PUT',
              callBack: () => {
                this.loadOrderData(this.sts, 1)
              }
            }
            http.request(params)
          }
        }
      })
    },

    /**
      * 付款
      * @param {String/Numver} orderNumber 订单编号
      * @param {String/Numver} orderType 订单类型
      * @param {String/Numver} dvyType 物流方式
      */
    onPayAgain: function (orderNumber, orderType, dvyType) {
      util.tapLog(3)
      const params = {
        url: '/p/order/getOrderPayInfoByOrderNumber',
        method: 'GET',
        data: {
          orderNumbers: orderNumber
        },
        callBack: res => {
          this.setData({
            // 订单过期时间
            endTime: res.endTime.replace(/-/g, '/')
          })
          var nowTime = new Date().getTime() // 现在时间（时间戳）
          var endTime = new Date(this.endTime).getTime() // 结束时间（时间戳）
          var time = (endTime - nowTime) / 1000 // 距离结束的毫秒数
          if (time > 0) {
            uni.navigateTo({
              url: `/package-pay/pages/pay-way/pay-way?orderNumbers=${orderNumber}&orderType=${orderType}&dvyType=${dvyType}`
            })
          } else {
            uni.showModal({
              title: this.i18n.tips,
              content: this.i18n.orderExpired,
              cancelText: this.i18n.cancel,
              confirmText: this.i18n.confirm,
              showCancel: false,
              confirmColor: '#F81A1A',
              success: (res) => {
                if (res.confirm) {
                  this.loadOrderData(this.sts, 1)
                } else if (res.cancel) {
                  // console.log('用户点击取消')
                }
              }
            })
            return
          }
        }
      }
      http.request(params)
    },

    /**
      * 查看订单详情
      */
    toOrderDetailPage: function (e) {
      util.tapLog(3)
      // uni.navigateTo({
      // 	url: '/pages/order-detail/order-detail?orderNum=' + e.currentTarget.dataset.ordernum
      // });
      this.$Router.push({
        path: '/package-user/pages/order-detail/order-detail', query: { orderNum: e.currentTarget.dataset.ordernum }
      })
    },

    /**
      * 确认收货
      */
    onConfirmReceive: function (orderNumber) {
      util.tapLog(3)
      uni.showModal({
        content: this.i18n.haveRceivedGoods,
        cancelText: this.i18n.cancel,
        confirmText: this.i18n.confirm,
        confirmColor: '#eb2444',
        success: (res) => {
          if (res.confirm) {
            const params = {
              url: '/p/myOrder/receipt/' + orderNumber,
              method: 'PUT',
              callBack: (res) => {
                this.loadOrderData(this.sts, 1)
              }
            }
            http.request(params)
          } else if (res.cancel) { // console.log('用户点击取消')
          }
        }

      })
    },
    // 删除已完成||已取消的订单
    delOrderList: function (e) {
      util.tapLog(3)
      uni.showModal({
        content: this.i18n.sureDeleteOrder,
        cancelText: this.i18n.cancel,
        confirmText: this.i18n.confirm,
        confirmColor: '#eb2444',
        success: res => {
          if (res.confirm) {
            var ordernum = e.currentTarget.dataset.ordernum
            const params = {
              url: '/p/myOrder/' + ordernum,
              method: 'DELETE',
              callBack: (res) => {
                uni.showToast({
                  icon: 'none',
                  mask: true,
                  title: res,
                  complete: () => {
                    setTimeout(() => {
                      this.loadOrderData(this.sts, 1)
                    }, 1500)
                  }
                })
              }
            }
            http.request(params)
          }
        }

      })
    },

    /**
      * 跳转评价页面
      */
    onComment: function (orderItems) {
      // 把商品项缓存起来
      const preCommentData = []
      orderItems.forEach(el => {
        if (el.returnMoneySts !== 5 && el.commSts === 0) {
          preCommentData.push({
            spuName: el.spuName,
            prodName: el.prodName,
            pic: el.pic,
            orderItemId: el.orderItemId,
            shopId: el.shopId,
            skuName: el.skuName
          })
        }
      })
      uni.setStorageSync('bbcOrderItemInfo', preCommentData)
      uni.navigateTo({
        url: '/package-prod/pages/prod-comm/prod-comm'
      })
    },
    /**
      * 跳转首页
      * */
    toHomePage() {
      util.toHomePage()
    },
    // 查看发票
    viewIinvoice(orderNumber, orderInvoiceId) {
      uni.navigateTo({
        url: `/package-user/pages/invoice-detail/invoice-detail?orderNumber=${orderNumber}&orderInvoiceId=${orderInvoiceId}`
      })
    },
    /**
     * 图片加载失败时显示默认图片
     */
    handlePicError(prod) {
      this.$set(prod, 'isPicError', true)
    },
    // 格式化时间
    tsToDate(data) {
      return util.tsToDate(data.replace(/\-/g, '/'), 'Y-M-D')
    }
  }
}
</script>
<style>@import "./order-list.css";</style>
