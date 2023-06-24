<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 氢春豆商品提交订单页面 -->
  <view class="Mall4j container">
    <view class="submit-order">
      <!-- 收货地址 -->
      <view class="delivery-addr" @tap="toAddrListPage">
        <view v-if="!userAddr" class="addr-bg">
          <view class="add-addr">
            <view class="plus-sign-img">
              <image src="/static/images/icon/plus-sign.png" />
            </view>
            <text>{{ i18n.addNewAddress }}</text>
          </view>
          <view class="arrow empty" />
        </view>
        <view v-if="userAddr" class="addr-bg whole">
          <view class="addr-icon">
            <image src="/static/images/icon/addr.png" />
          </view>
          <view class="user-info">
            <text class="item">{{ userAddr.receiver }}</text>
            <text class="item">{{ userAddr.mobile }}</text>
          </view>
          <view class="addr">{{ userAddr.province }}{{ userAddr.city }}{{ userAddr.area }}{{ userAddr.addr }}</view>
          <view class="arrow" />
        </view>
      </view>
      <!-- 店铺商品明细 -->
      <view class="prod-item">
        <view class="item-box">
          <!-- 商品信息 -->
          <view class="item-cont">
            <view class="prod-pic">
              <ImgShow :src="productItemDto.pic" />
            </view>
            <view class="prod-info">
              <view class="prodname">{{ productItemDto.prodName }}</view>
              <view class="prod-info-cont">{{ productItemDto.skuName }}</view>
              <view class="show-price">
                <view class="price-nums">
                  <text class="prodprice"><text v-if="productItemDto.price" class="symbol">￥</text>
                    <text v-if="productItemDto.price" class="big-num">{{ parsePrice(productItemDto.price)[0] }}</text>
                    <text v-if="productItemDto.price" class="small-num">.{{ parsePrice(productItemDto.price)[1] }}</text>
                    <text v-if="productItemDto.price" class="small-num" decode="true">&ensp;+&ensp;</text>
                  </text>
                  <text class="prodcount">x{{ productItemDto.prodCount }}</text>
                </view>
                <!-- 氢春豆 -->
                <view class="integral-num">
                  <text decode="true">{{ productItemDto.scorePrice / productItemDto.prodCount }} {{ i18n.integral }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- /店铺商品明细 -->

      <!-- 店铺优惠券和买家留言 -->
      <view class="order-msg">
        <view class="msg-item">
          <view class="item">
            <text>{{ i18n.storeNotes }}：</text>
            <input :placeholder="i18n.storeNotesTips" maxlength="100" :value="remarks" @input="onRemarkIpt"></input>
          </view>
        </view>
      </view>
      <!-- /店铺优惠券和买家留言 -->

      <!-- 总金额计算 -->
      <view class="order-msg">
        <view class="msg-item">
          <!-- 商品总额 -->
          <view class="item">
            <view class="item-tit">{{ i18n.comTotal }}：</view>
            <view class="item-txt price">
              <text class="symbol">￥</text>
              <text class="big-num">{{ parsePrice(total)[0] }}</text>
              <text class="small-num">.{{ parsePrice(total)[1] }}</text>
            </view>
          </view>
          <!-- 应付运费 -->
          <view class="item">
            <view class="item-tit">{{ i18n.freightPayable }}：</view>
            <view class="price black item-txt">
              <text class="symbol">￥</text>
              <text class="big-num">{{ parsePrice(transfee)[0] }}</text>
              <text class="small-num">.{{ parsePrice(transfee)[1] }}</text>
            </view>
          </view>
          <!-- 平台开启会员包邮(运费减免) -->
          <view v-if="freeTransfee" class="item">
            <view class="item-tit">{{ i18n.memberPackage }}：</view>
            <view class="price item-txt">
              <text class="symbol">-￥</text>
              <text class="big-num">{{ parsePrice(freeTransfee)[0] }}</text>
              <text class="small-num">.{{ parsePrice(freeTransfee)[1] }}</text>
            </view>
          </view>
          <!-- 优惠金额 -->
          <view v-if="orderReduce" class="item">
            <view class="item-tit">{{ i18n.preferentialAmount }}：</view>
            <view class="item-txt price">
              <text class="symbol">-￥</text>
              <text class="big-num">{{ parsePrice(orderReduce)[0] }}</text>
              <text class="small-num">.{{ parsePrice(orderReduce)[1] }}</text>
            </view>
          </view>
        </view>
      </view>
      <!-- /总金额计算 -->
    </view>

    <!-- 底部栏 -->
    <view class="submit-order-footer">
      <view class="sub-order">
        <view class="item-txt">{{ i18n.total }}:<view class="price">
          <text v-if="actualTotal" class="symbol">￥</text>
          <text v-if="actualTotal" class="big-num">{{ parsePrice(actualTotal)[0] }}</text>
          <text v-if="actualTotal" class="small-num">.{{ parsePrice(actualTotal)[1] }}</text>
          <text v-if="actualTotal" class="small-num" decode="true">&ensp;+&ensp;</text>
        </view>
          <!-- 氢春豆 -->
          <view class="integral-num">
            <text decode="true">{{ scorePrice }} {{ i18n.integral }}</text>
          </view>
        </view>
      </view>
      <view class="footer-box" @tap="toPay">{{ i18n.submitOrders }}</view>
    </view>
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
const Big = require('../../../utils/big.min.js')
import Pay from '../../../utils/pay.js'

export default {
  props: {},
  data() {
    return {
      popupShow: false,
      // 订单入口 0购物车 1立即购买
      orderEntry: '0',
      userAddr: null,
      orderItems: [],
      // 所有店铺的数据
      productItemDto: [],
      // 商品信息
      actualTotal: 0,
      total: 0,
      totalCount: 0,
      transfee: 0,
      freeTransfee: 0, // 用户等级免运费金额
      reduceAmount: 0,
      couponIds: [],
      orderReduce: 0,
      platformCoupons: [],
      // 整个订单可以使用的优惠券列表
      scorePrice: 0,
      remarks: '',
      // 留言
      isPurePoints: false // 是否纯氢春豆商品
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
    this.setData({
      orderEntry: options.orderEntry
    })
  },

  /**
		 * 生命周期函数--监听页面初次渲染完成
		 */
  onReady: function() {},

  /**
		 * 生命周期函数--监听页面显示
		 */
  onShow: function() {
    // 设置头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.submitOrders
    })
    var pages = getCurrentPages()
    var currPage = pages[pages.length - 1]
    if (currPage.selAddress == 'yes') {
      this.setData({
        // 将携带的参数赋值
        userAddr: currPage.item
      })
    }
    this.loadOrderData()
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
    // 加载订单数据
    loadOrderData: function() {
      var addrId = 0
      if (this.userAddr != null) {
        addrId = this.userAddr.addrId
      }
      const params = {
        url: '/p/score/confirm',
        method: 'POST',
        data: {
          addrId: addrId,
          orderItem: this.orderEntry === '1' ? JSON.parse(wx.getStorageSync('bbcOrderItem')) : undefined,
          basketIds: this.orderEntry === '0' ? JSON.parse(wx.getStorageSync('bbcBasketIds')) : undefined,
          couponIds: this.couponIds,
          userChangeCoupon: 1
        },
        callBack: res => {
          // 运费
          const transfee = Number(new Big(res.totalTransfee).minus(new Big(res.freeTransfee)).valueOf())
          this.setData({
            productItemDto: res.productItemDto,
            // 商品信息
            actualTotal: res.actualTotal,
            // 实际总值
            total: res.total,
            // 商品总值
            totalCount: res.totalCount,
            // 商品总数
            userAddr: res.userAddr,
            // 地址Dto
            // 用户等级免运费金额
            freeTransfee: res.freeTransfee,
            // 运费
            transfee: transfee >= 0 ? transfee : 0,
            scorePrice: res.productItemDto.scorePrice, // 商品所需氢春豆
            orderReduce: res.orderReduce
          })
        }
      }
      http.request(params)
    },

    /**
			 * 提交订单
			 */
    toPay: function() {
      if (!this.userAddr) {
        uni.showToast({
          title: this.i18n.saveAndUseTips,
          icon: 'none'
        })
        return
      }
      this.submitOrder()
    },

    /**
			 * 提交订单
			 */
    submitOrder: function() {
      var isPurePoints = this.actualTotal > 0 ? '' : 1 // 是否纯氢春豆: 1是
      if (isPurePoints) {
        uni.showModal({
          title: this.i18n.prompt,
          content: this.i18n.confirmSpend + this.scorePrice + this.i18n.scoreToPay,
          confirmText: this.i18n.confirm,
          cancelText: this.i18n.cancel,
          success: (modalRes) => {
            if (modalRes.confirm) {
              const params = {
                url: '/p/score/submit',
                method: 'POST',
                data: {
                  remarks: this.remarks
                },
                callBack: res => {
                  Pay.toOrderPay(0, res.orderNumbers, isPurePoints)
                }
              }
              http.request(params)
            }
          }
        })
        return
      }
      const params = {
        url: '/p/score/submit',
        method: 'POST',
        data: {
          remarks: this.remarks
        },
        callBack: res => {
          uni.navigateTo({
            url: '/package-pay/pages/pay-way/pay-way?orderNumbers=' + res.orderNumbers + '&isPurePoints=' + isPurePoints
          })
        },
        errCallBack: (errMsg) => {
          if (errMsg.code === 'A00001' || errMsg.code === 'A03002' || errMsg.code === 'A07001') {
            if (errMsg.code === 'A07001') {
              errMsg.msg += this.productItemDto.prodName
            }
            uni.showModal({
              title: this.i18n.tips,
              showCancel: false,
              content: errMsg.msg,
              confirmText: this.i18n.confirm,
              success: (res) => {
                if (res.confirm) {
                  uni.navigateBack()
                }
              }
            })
          }
        }
      }
      http.request(params)
    },

    /**
			 * 去地址页面
			 */
    toAddrListPage: function() {
      uni.navigateTo({
        url: '/package-user/pages/delivery-address/delivery-address?order=0'
      })
    },

    /**
			 * 输入备注
			 */
    onRemarkIpt: function(e) {
      this.remarks = e.detail.value
    }
  }
}
</script>
<style>
	@import "./integral-submit-order.css";
</style>
