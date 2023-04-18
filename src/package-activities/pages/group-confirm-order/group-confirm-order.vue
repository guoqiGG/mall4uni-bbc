<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view v-if="showPage" class="Mall4j">
    <!-- 确认订单 -->

    <!-- 参团流程 -->
    <view class="process">

      <view class="process-item choose-prod">
        <view class="process-icon">
          <image src="../../static/images/icon/gift.png" />
        </view>
        <view class="process-text">{{ i18n.group1 }}</view>
      </view>

      <view class="next-icon">
        <image src="/static/images/icon/more.png" />
      </view>

      <view class="process-item invent">
        <view class="process-icon">
          <image src="../../static/images/icon/chat.png" />
        </view>
        <view class="process-text">{{ i18n.group2 }}</view>
      </view>

      <view class="next-icon">
        <image src="/static/images/icon/more.png" />
      </view>

      <view class="process-item full">
        <view class="process-icon">
          <image src="/static/images/icon/enough.png" />
        </view>
        <view class="process-text">{{ i18n.group3 }}</view>
      </view>
    </view>
    <!-- 流程end -->

    <!--地址栏 -->
    <view v-if="mold !== 1" class="address-box" @tap="toAddrListPage">
      <!-- 地址图标 -->
      <view class="addr-icon">
        <image src="/static/images/icon/addr.png" />
      </view>
      <view v-if="!userAddrDto" class="add-addr">{{ i18n.addShippingAddress }}</view>
      <block v-if="userAddrDto">
        <!-- 地址信息 -->
        <view class="recipient clearfix">
          <text class="username">{{ userAddrDto.receiver }}</text>
          <text class="cellphone">{{ userAddrDto.mobile }}</text>
        </view>
        <view class="addr-text">
          {{ i18n.shippingAddress }}：{{ userAddrDto.province }}{{ userAddrDto.city }}{{ userAddrDto.area }}{{ userAddrDto.addr }}
        </view>
      </block>

      <!-- 右箭头 -->
      <view class="more-icon">
        <image src="/static/images/icon/more.png" />
      </view>
      <!-- 下虚线 -->
      <view class="dotted-line">
        <image src="../../static/images/icon/dotted-line.png" />
      </view>
    </view>
    <!--地址栏end -->

    <!-- 商品信息 -->
    <view class="prod-box">
      <!-- <view class="prod-shop">
      <view class="shop-icon"><image src="../../images/icon/shop.png"></image></view>
      <text class="shop-name">笑橙小店190827</text>
    </view>
    -->
      <!-- 商品信息 -->
      <view class="prod-con">
        <view class="prod-msg">
          <view class="prod-img">
            <image :src="orderInfo.skuPic || orderInfo.prodPic" mode="aspectFit" />
          </view>
          <view class="prod-text clearfix">
            <view class="prod-name">{{ orderInfo.prodName }}</view>
            <view v-if="orderInfo.skuName" class="prod-sku">{{ orderInfo.skuName }}</view>
            <view class="prod-price-box">
              <text class="prod-price">￥{{ orderInfo.actPrice }}</text>
              <text class="prod-price-del">￥{{ orderInfo.price }}</text>
              <text class="prod-amount">x {{ orderInfo.prodTotalCount }}</text>
            </view>
          </view>
        </view>
        <!-- 虚拟商品留言 start -->
        <view
          v-if="virtualRemarkList && virtualRemarkList.length"
          class="virtual-goods-msg"
        >
          <view
            v-for="(msgItem, msgIndex) in virtualRemarkList"
            :key="msgIndex"
            class="v-msg-item"
          >
            <view class="v-msg-tit">{{ msgItem.name }}
              <text v-if="msgItem.isRequired" class="stress">*</text>
            </view>
            <view class="v-msg-con">
              <input
                v-model="msgItem.value"
                class="v-msg-input"
                placeholder-class="ph-class"
                :placeholder="i18n.pleaseEnter + `${msgItem.name}`"
                maxlength="20"
                @blur="handleInputBlur(msgItem.value, msgIndex)"
              >
            </view>
          </view>
        </view>
        <!-- 虚拟商品留言 end -->
      </view>
    </view>
    <!-- 商品信息end -->

    <!-- 配送&留言 -->
    <view class="row">
      <!-- <view class="dispatching clearfix">
      <text class="dispatching-tit">配送方式</text>
      <text class="dispatching-way">快递 免运费</text>
    </view> -->
      <view class="live-message">
        <text class="message-tit">{{ i18n.OrderNotes }}：</text>
        <input
          class="message-int"
          maxlength="100"
          :placeholder="i18n.buyerTips"
          :value="remarks"
          @input="onRemarksInput"
        ></input>
      </view>
      <view class="item invoice">
        <view class="tit">{{ i18n.invoice.onvoiceIssuance }}：</view>
        <view
          v-if="!invoiceDataFrom.invoiceType || invoiceDataFrom.invoiceType === 2"
          class="item"
          @tap="showInvoicePopup(orderInfo.shopId)"
        >
          <view class="text-arrow">
            <view class="text">{{ i18n.invoice.noInvoice }}</view>
          </view>
        </view>
        <view v-else class="item" @tap="showInvoicePopup(orderInfo.shopId,invoiceDataFrom)">
          <view class="text-arrow">
            <!-- <view class="text">本次不开具发票</view> -->
            <view class="text">{{ i18n.invoice.electronic }}({{ i18n.invoice.productDetails }}-{{ invoiceDataFrom.headerName || i18n.invoice.personal }})</view>
          </view>
        </view>
      </view>
      <!-- <view v-if="mold == 1 && virtualRemarkList.length" class="item invoice all-msg">
        <view class="tit">{{ i18n.allMsg }}：</view>
        <view class="item">
          <view class="text-arrow" @tap="showViewMsgPopup">
            <view class="text">
              <view class="msg-name">{{ virtualRemarkList[0].name }}</view>
              <view class="msg-con">{{ virtualRemarkList[0].value }}</view>
            </view>
          </view>
        </view>
      </view> -->
    </view>
    <!-- 配送&留言 end -->

    <!-- 商品总额 -->
    <view class="sum">
      <view class="cost-box">
        <view class="prod-table clearfix">
          <text
            class="prod-table-tit"
          >{{ (orderInfo.hasLeaderPrice==1&&groupTeamId=="0")?i18n.headPrice:i18n.groupPurchasePrice }}</text>
          <text class="prod-table-way">￥<text
            v-if="orderInfo.hasLeaderPrice"
            class="leader-price"
          >{{ orderInfo.groupProdActualTotal }} </text><text
            :class="orderInfo.hasLeaderPrice?'del-line':''"
          >{{ orderInfo.actPrice }}</text></text>
        </view>
        <view v-if="mold !== 1" class="prod-table clearfix">
          <text class="prod-table-tit">{{ i18n.shipping }}</text>
          <text class="prod-table-way">￥{{ orderInfo.transfee }}</text>
        </view>
        <view class="prod-table clearfix">
          <text class="prod-table-tit">{{ i18n.groupPurchaseOffer }}</text>
          <text class="prod-table-way shine">-￥{{ orderInfo.discountPrice }}</text>
        </view>
      </view>
      <!-- 合计 -->
      <view class="total-cost">{{ i18n.total }}：<text class="total-num">￥{{ orderInfo.orderTotalPrice }}</text>
      </view>
    </view>
    <!-- 商品金额 end -->

    <!-- 底部 -->
    <view class="foot-box">
      <view class="foot">
        <view class="total-price">{{ i18n.total }}：<text
          class="total-price-num"
        >￥{{ orderInfo.orderTotalPrice }}</text></view>
        <!-- 提交按钮 -->
        <view class="submit-btn" @tap="commitOrder">{{ i18n.submitOrders }}</view>
      </view>
    </view>
    <!-- 底部end -->
    <invoiceEdit
      v-if="isShowInvoicePopup"
      :invoice-data-from="invoiceDataFrom"
      :shop-id="invoiceShopId"
      :invoice-id="invoiceId"
      @closePopup="closePopup"
      @getInvoiceData="getInvoiceData"
    />

    <!-- 查看留言（虚拟商品） -->
    <view class="popup-hide" :hidden="!showViewMsg">
      <view class="popup-box virtual-goods-msg-pop">
        <view class="con-tit">
          <view class="tit-text">{{ i18n.viewMsg }}</view>
          <view class="close" @tap="closePopup" />
        </view>
        <view class="msg-pop-con">
          <view class="msg-list">
            <view v-for="(item, index) in virtualRemarkList" :key="index" class="msg-item">
              <view class="item-con weak">{{ item.name }}</view>
              <view class="item-con">{{ item.value }}</view>
            </view>
          </view>
          <view class="pop-foot">
            <view class="foot-btn" @tap="closePopup">{{ i18n.gotIt }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
import {
  PayType,
  AppType
} from '../../../utils/constant.js'
import Pay from '../../../utils/pay.js'
import invoiceEdit from '../../../components/invoice-edit/index.vue'
export default {

  components: {
    invoiceEdit
  },
  props: {},
  data() {
    return {
      orderInfo: {},
      userAddr: null,
      remarks: '',
      userAddrDto: {},
      showPage: false, // 拼团信息展示
      groupTeamId: '', // 判断开团还是拼团

      invoiceId: '', // 发票id
      invoiceShopId: '',
      invoiceDataFrom: {},
      isShowInvoicePopup: false,

      mold: null, // 1虚拟商品
      // 留言（虚拟商品）
      virtualRemarkList: [],
      // 查看留言弹窗显隐
      showViewMsg: false
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
      title: this.i18n.makeSureOrder
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
    // 发票信息弹窗
    showInvoicePopup(shopId, invoiceDataFrom) {
      if (invoiceDataFrom) {
        this.invoiceDataFrom = invoiceDataFrom
      }
      this.invoiceShopId = shopId
      this.isShowInvoicePopup = true
    },
    getInvoiceData(data) {
      // invoiceDataFrom
      this.invoiceDataFrom = data
      console.log(data)
    },
    onRemarksInput: function(e) {
      this.setData({
        remarks: e.detail.value
      })
    },
    closePopup: function() {
      this.setData({
        isShowInvoicePopup: false,
        showViewMsg: false
      })
    },
    // 加载订单数据
    loadOrderData: function() {
      var addrId = 0
      if (this.userAddr != null) {
        addrId = this.userAddr.addrId
      }
      const groupOrderItem = JSON.parse(wx.getStorageSync('bbcGroupOrderItem'))
      this.groupTeamId = groupOrderItem.groupTeamId
      const params = {
        url: '/p/group/order/confirm',
        method: 'POST',
        data: {
          addrId: addrId,
          groupSkuId: groupOrderItem.groupSkuId,
          groupTeamId: groupOrderItem.groupTeamId,
          prodCount: groupOrderItem.prodCount
        },
        callBack: res => {
          this.setData({
            orderInfo: res,
            userAddrDto: res.userAddrDto,
            mold: res.mold,
            virtualRemarkList: res.virtualRemarkList || []
          })
          this.showPage = true
        },
        errCallBack: errRes => {
          uni.showModal({
            showCancel: false,
            title: this.i18n.tips,
            content: errRes.data,
            cancelText: this.i18n.cancel,
            confirmText: this.i18n.confirm,
            success: successRes => {
              if (successRes.confirm) {
                uni.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      }
      http.request(params)
    },

    // 查看留言弹窗
    showViewMsgPopup: function() {
      this.showViewMsg = true
    },

    /**
		 * 虚拟商品留言输入框失焦
		 */
    handleInputBlur(value, msgIndex) {
      if (!value) {
        return
      }
      if (value && !value.trim()) {
        this.virtualRemarkList[msgIndex].value = value.trim()
      }
    },

    // 提交订单
    commitOrder() {
      if (this.mold !== 1 && !this.userAddrDto) {
        uni.showToast({
          title: this.i18n.addAddressFirst,
          icon: 'none'
        })
        return
      }
      // 虚拟商品留言校验
      if (this.virtualRemarkList.length &&
          this.virtualRemarkList.find(el => el && el.value && !el.value.trim())) {
        uni.showToast({
          title: this.i18n.msgCannotBeAllSpaces,
          icon: 'none'
        })
        return
      }
      if (this.virtualRemarkList.length &&
          this.virtualRemarkList.find(el => el && el.isRequired && !el.value)) {
        uni.showToast({
          title: this.i18n.requiredMessage,
          icon: 'none'
        })
        return
      }

      let orderInvoiceDTO = null // invoiceDataFrom
      if (this.invoiceDataFrom && this.invoiceDataFrom.invoiceType === 1) {
        orderInvoiceDTO = this.invoiceDataFrom
      }
      var orderShopParam = {
        remarks: this.remarks.trim() ? this.remarks : '',
        virtualRemarkList: this.virtualRemarkList,
        orderInvoice: orderInvoiceDTO
      }
      http.request({
        url: `/p/group/order/submit`,
        method: 'POST',
        data: orderShopParam,
        callBack: res => {
          const orderType = 1 // 1拼团 2秒杀
          uni.redirectTo({
            url: '/pages/pay-way/pay-way?orderNumbers=' + res.orderNumbers +
								'&orderType=' + orderType
          })
        },
        errCallBack: errRes => {
          uni.showModal({
            title: this.i18n.tips,
            content: errRes.data,
            confirmText: this.i18n.confirm,
            showCancel: false,
            success: (errModSuccess) => {
              if (errModSuccess.confirm) {
                uni.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      })
    },

    /**
			 * 唤起微信支付
			 */
    calWeixinPay: function(orderNumbers) {
      const isOA = uni.getStorageSync('bbcAppType') == AppType.MP // 是否微信内环境
      var payType = isOA ? PayType.WECHATPAY_MP : PayType.WECHATPAY_H5
      Pay.toOrderPay(payType, orderNumbers)
    },

    /**
			 * 去地址页面
			 */
    toAddrListPage: function() {
      uni.navigateTo({
        url: '/package-user/pages/delivery-address/delivery-address?order=0'
      })
    }
  }
}
</script>
<style>
	@import "./group-confirm-order.css";
</style>
