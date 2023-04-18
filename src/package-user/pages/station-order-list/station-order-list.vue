<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- pages/station-order-list/station-order-list.wxml -->
  <view class="Mall4j container">
    <view
      class="station-order-list"
      :class="{ 'bigger-bottom': curAppType !== appType.H5 }"
    >
      <view class="main">
        <!-- 订单列表 -->
        <block v-for="(item, shopIndex) in stationList" :key="shopIndex">
          <view class="prod-item">
            <!-- 店铺 -->
            <!-- <view class="shop-box">
              <view class="shop-icon">
                <image src="/static/images/icon/shop.png"></image>
              </view>
              <view class="shop-name">{{item.shopName}}</view>
            </view> -->
            <!-- 订单编号 -->
            <view class="order-num">
              <checkbox
                color="#eb2444"
                class="check"
                :data-shopindex="shopIndex"
                :checked="item.checked"
                @tap="orderRadioChange(shopIndex)"
              />
              <text>{{ i18n.orderNumber }}：{{ item.orderNumber }}</text>
              <view class="order-state">
                <text :class="['order-sts', { red: item.status < 5 }]">{{
                  [
                    '',
                    i18n.toBePaid,
                    i18n.goodsBePicked,
                    i18n.pendingWriteOffs,
                    i18n.toBeEvaluated,
                    i18n.completed,
                    i18n.cancelled,
                    i18n.inAGroup
                  ][item.status]
                }}</text>
                <view
                  v-if="item.status == 6"
                  class="clear-btn"
                >
                  <image
                    src="/static/images/icon/clear-his.png"
                    class="clear-list-btn"
                    :data-ordernum="item.orderNumber"
                    @tap="delOrderList"
                  />
                </view>
              </view>
            </view>
            <!-- 商品列表 -->
            <!-- 一个订单单个商品的显示 -->
            <block v-for="(prod, index) in item.orderItemDtos" :key="index">
              <view
                v-if="prod.returnMoneySts!==5"
                class="item-cont"
                :data-ordernum="item.orderNumber"
                @tap="toOrderDetailPage"
              >
                <view class="prod-pic">
                  <ImgShow :src="prod.pic" />
                </view>
                <view class="prod-info">
                  <view class="prodname">{{ prod.prodName }}</view>
                  <view class="prod-info-cont">{{ prod.skuName }}</view>
                  <view v-if="prod.giveawayOrderItemId" class="give-icon">
                    {{ i18n.gift }}
                  </view>
                  <view v-else class="price-nums">
                    <text class="prodprice">
                      <text v-if="item.actualTotal" class="symbol">￥</text>
                      <text v-if="item.actualTotal" class="big-num">{{
                        parsePrice(prod.price)[0]
                      }}</text>
                      <text
                        v-if="item.actualTotal"
                        class="small-num"
                      >.{{ parsePrice(prod.price)[1] }}</text>
                      <text
                        v-if="item.actualTotal && item.orderType == 3"
                        class="small-num"
                        decode="true"
                      >&emsp;+&emsp;</text>
                      <text
                        v-if="prod.useScore && item.orderType == 3"
                        class="small-num"
                      >{{ prod.useScore }} {{ i18n.integral }}</text>
                    </text>
                    <text class="prodcount">× {{ prod.prodCount }}</text>
                  </view>
                </view>
              </view>
            </block>
            <view class="total-num">
              <view v-if="item.orderType" class="spell-group-icon">
                <!-- orderType 订单类型(0普通订单 1团购订单 2秒杀订单) -->
                {{
                  ['', i18n.aGroup, i18n.spike, i18n.integral][item.orderType]
                }}
              </view>
              <view class="spell-group-icon">{{
                item.orderMold === 1 ? i18n.virtualGoods : i18n.SelfPickupGoods
              }}</view>
              <view class="right">
                <view
                  class="prodcount"
                >{{ i18n.inTotal }}{{ item.productNums
                }}{{ i18n.items }}</view>
                <view
                  class="prodprice"
                >{{ i18n.total }}：<text
                  v-if="item.actualTotal"
                  class="symbol"
                >￥</text>
                  <text v-if="item.actualTotal" class="big-num">{{
                    parsePrice(item.actualTotal)[0]
                  }}</text>
                  <text
                    v-if="item.actualTotal"
                    class="small-num"
                  >.{{ parsePrice(item.actualTotal)[1] }}</text>
                  <text
                    v-if="item.actualTotal && item.orderType == 3"
                    class="small-num"
                  >+</text>
                  <text
                    v-if="
                      item.orderType == 3 ||
                        (!item.actualTotal && item.orderItemDtos[0].useScore)
                    "
                    class="small-num"
                  >{{ item.orderItemDtos[0].useScore }} {{ i18n.integral }}</text>
                </view>
              </view>
            </view>
            <!-- end 商品列表 -->
          </view>
        </block>
      </view>

      <!-- 空列表或加载全部提示 -->
      <EmptyAllTips
        v-if="isLoaded"
        :isEmpty="!stationList.length"
        :emptyTips="i18n.noOrderTips"
        :isAll="stationList.length > 5 && loadAll"
      />
    </view>

    <!-- 提交按钮 -->
    <view v-if="stationList.length" class="foot">
      <view
        class="confirm"
        :class="{ grey: !orderNumbers.length }"
        @tap="confirmRemoval"
      >{{ i18n.confirmPickUp }}</view>
    </view>
  </view>
  <!-- end 订单列表 -->
</template>

<script>
const http = require('@/utils/http.js')
import { AppType } from '@/utils/constant'
export default {
  components: {},
  props: {},
  data() {
    return {
      stationList: [],
      stationId: 0,
      shopId: 0,
      orderNumbers: [], // 选中的订单

      // 分页
      current: 1,
      size: 10,
      pages: 0,
      total: 0,
      loadAll: false, // 加载完成

      timer: '',

      appType: AppType,
      // 当前设备类型
      curAppType: uni.getStorageSync('bbcAppType'),
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
    options = { ...this.$Route.query }
    if (options.shopId) {
      this.shopId = decodeURI(options.shopId)
    }
    if (options.stationId) {
      this.stationId = decodeURI(options.stationId)
    }
    this.loadStationOrderData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.shopId ? this.i18n.shopOrderList : this.i18n.pickUpOrderList
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
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
      this.current += 1
      this.loadStationOrderData()
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
     * 加载自提点订单数据
     */
    loadStationOrderData: function() {
      let url = ''
      let data = {}
      if (this.shopId) {
        url = '/p/myStationOrder/getOrderByShopId'
        data = { shopId: this.shopId }
      } else {
        url = '/p/myStationOrder/getOrderBystationId'
        data = { stationId: this.stationId }
      }
      this.isLoaded = false
      const params = {
        url: url,
        method: 'GET',
        data: {
          ...data,
          current: this.current,
          size: this.size
        },
        callBack: (res) => {
          this.isLoaded = true
          var list = []
          if (res.current == 1) {
            list = res.records
          } else {
            list = this.stationList.concat(res.records)
          }
          this.stationList = list
          this.stationList.forEach((item) => {
            item.checked = false
          })
          console.log(this.stationList)
          this.pages = res.pages
          this.current = res.current
        },
        errCallBack: (err) => {
          console.log(err)
          uni.showModal({
            title: this.i18n.tips,
            content: this.i18n.stationNotFound,
            confirmText: this.i18n.confirm,
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                uni.switchTab({
                  url: '/pages/user/user'
                })
              }
            }
          })
          // 清空列表
          this.stationList = []
          // 清空选中的订单编号
          this.orderNumbers = []
        }
      }
      http.request(params)
    },

    /**
     * 查看订单详情
     */
    toOrderDetailPage: function(e) {
      // uni.navigateTo({
      //   url: '/pages/order-detail/order-detail?orderNum=' + e.currentTarget.dataset.ordernum
      // });
      this.$Router.push({
        path: '/package-user/pages/order-detail/order-detail',
        query: { orderNum: e.currentTarget.dataset.ordernum }
      })
    },

    /**
     * 订单选择
     */
    orderRadioChange: function(shopIndex) {
      var stationList = this.stationList
      stationList[shopIndex].checked = !stationList[shopIndex].checked
      const orderNumbers = []
      this.stationList.forEach((el) => {
        if (el.checked) {
          orderNumbers.push(el.orderNumber)
        }
      })
      this.orderNumbers = orderNumbers.join()
    },

    /**
     * 一键核销（整单）
     */
    confirmRemoval: function() {
      var orderNumbers = this.orderNumbers
      if (!orderNumbers || !orderNumbers.length) {
        uni.showToast({
          title: this.i18n.SelectOrderPickup,
          icon: 'none',
          duration: 1500
        })
        return
      }
      // let url = ''
      const data = this.shopId ? { shopId: this.shopId } : { stationId: this.stationId }
      uni.showModal({
        title: this.i18n.tips,
        content: this.i18n.confirmPickUpTips,
        cancelText: this.i18n.cancel,
        confirmText: this.i18n.confirm,
        success: (res) => {
          if (res.confirm) {
            const params = {
              url: '/p/myStationOrder/orderStationByOrderNumber',
              method: 'PUT',
              data: {
                orderNumbers,
                ...data
              },
              callBack: () => {
                uni.showToast({
                  title: this.i18n.pickUpSuccessfully,
                  icon: 'none',
                  duration: 1500
                })
                // 清空选中的订单编号
                this.orderNumbers = []
                this.stationList = []
                this.timer = setTimeout(() => {
                  this.current = 1
                  this.loadStationOrderData()
                }, 500)
                this.$forceUpdate()
              },
              errCallBack: res => {
                uni.showToast({
                  title: res.msg || 'Error',
                  icon: 'none'
                })
                if (res.msg.indexOf('卡券不存在或者已核销') !== -1) {
                  // 清空选中的订单编号
                  this.orderNumbers = []
                  this.timer = setTimeout(() => {
                    this.current = 1
                    this.loadStationOrderData()
                  }, 1000)
                }
              }
            }
            http.request(params)
          } else if (res.cancel) {
            // console.log('用户点击取消');
          }
        }
      })
    }
  }
}
</script>
<style>
@import './station-order-list.css';
</style>
