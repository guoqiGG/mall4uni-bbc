<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view v-if="fullItemObj.actualTotal" class="Mall4j">
    <!--地址栏 -->
    <view v-if="mold !== 1" class="address-part">
      <view class="address-box" @tap="toAddrListPage">
        <!-- 地址图标 -->
        <view class="addr-icon">
          <image src="/static/images/icon/addr.png" />
        </view>
        <!-- 地址为空 -->
        <view v-if="!fullItemObj.userAddr" class="add-addr">{{ i18n.addShippingAddress }}</view>
        <!-- 地址信息 -->
        <block v-if="fullItemObj.userAddr">
          <view class="recipient clearfix">
            <text class="username">{{ fullItemObj.userAddr.receiver }}</text>
            <text class="cellphone">{{ fullItemObj.userAddr.mobile }}</text>
          </view>
          <view class="addr-text">{{ i18n.shippingAddress }}：{{ fullItemObj.userAddr.province }}{{ fullItemObj.userAddr.city }}{{ fullItemObj.userAddr.area }}{{ fullItemObj.userAddr.addr }}</view>
        </block>

        <!-- 右箭头 -->
        <view class="more-icon">
          <image src="/static/images/icon/more.png" />
        </view>
      </view>
      <!-- 下虚线 -->
      <view class="dotted-line">
        <image src="../../static/images/icon/dotted-line.png" />
      </view>
    </view>
    <!--地址栏end -->

    <!-- 商品信息 -->
    <view class="goods-box">
      <!-- <view class="goods-shop">
    <view class="shop-icon"><image src="../../images/icon/shop.png"></image></view>
    <text class="shop-name">笑橙小店190827</text>
  </view>
  -->
      <!-- 商品信息 -->
      <view class="goods-msg">
        <view class="goods-con">
          <view class="goods-img">
            <ImgShow :src="fullItemObj.shopCartItem.pic" />
            <!-- <view class="miaosha">
              <image src="../../images/icon/miaosha.png"></image>
            </view> -->
          </view>
          <view class="goods-text clearfix">
            <view class="goods-name">{{ fullItemObj.shopCartItem.prodName }}</view>
            <view class="miaosha">
              <image src="../../static/images/icon/miaosha.png" />
            </view>
            <view class="goods-sku">{{ fullItemObj.shopCartItem.skuName }}</view>
            <text class="goods-price">￥{{ toPrice(fullItemObj.shopCartItem.seckillPrice) }}</text>
            <text class="goods-price-del">￥{{ toPrice(fullItemObj.shopCartItem.price) }}</text>
            <text class="goods-amount">x {{ fullItemObj.shopCartItem.prodCount }}</text>
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
        <input class="message-int" maxlength="100" :placeholder="i18n.buyerTips" :value="remarks" @input="onRemarksInput"></input>
      </view>
      <view class="item invoice">
        <view class="tit">{{ i18n.invoice.onvoiceIssuance }}：</view>
        <view
          v-if="!invoiceDataFrom.invoiceType || invoiceDataFrom.invoiceType === 2"
          class="item"
          @tap="showInvoicePopup(fullItemObj.shopId)"
        >
          <view class="text-arrow">
            <view class="text">{{ i18n.invoice.noInvoice }}</view>
          </view>
        </view>
        <view v-else class="item" @tap="showInvoicePopup(fullItemObj.shopId,invoiceDataFrom)">
          <view class="text-arrow">
            <!-- <view class="text">本次不开具发票</view> -->
            <view class="text">{{ i18n.invoice.electronic }}({{ i18n.invoice.productDetails }}-{{ invoiceDataFrom.headerName || i18n.invoice.personal }})</view>
          </view>
        </view>
      </view>
      <!-- <view v-if="mold == 1 && virtualRemarkList.length" class="item invoice all-msg">
        <view class="tit">全部留言：</view>
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
        <view class="goods-table clearfix">
          <text class="goods-table-tit">{{ i18n.goodsAmount }}</text>
          <text class="goods-table-way">￥{{ toPrice(goodsPrice) }}</text>
        </view>
        <view v-if="mold != 1" class="goods-table clearfix">
          <text class="goods-table-tit">{{ i18n.shipping }}</text>
          <text class="goods-table-way">￥{{ toPrice(transfee) }}</text>
        </view>
        <view v-if="fullItemObj.seckillReduce > 0" class="goods-table clearfix">
          <text class="goods-table-tit">{{ i18n.seckillReduce }}</text>
          <text class="goods-table-way shine">-￥{{ toPrice(fullItemObj.seckillReduce) }}</text>
        </view>
      </view>
      <!-- 合计 -->
      <view class="total-cost">{{ i18n.total }}：<text class="total-num">￥{{ toPrice(totalPrice) }}</text>
      </view>
    </view>
    <!-- 商品金额 end -->

    <!-- 底部 -->
    <view class="foot-box">
      <view class="foot">
        <view class="total-price">{{ i18n.total }}：<text class="total-price-num">￥{{ toPrice(totalPrice) }}</text></view>
        <!-- 提交按钮 -->
        <view class="submit-btn" @tap="submitOrder">{{ i18n.submitOrders }}</view>
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
import invoiceEdit from '../../../components/invoice-edit/index.vue'
export default {

  components: { invoiceEdit },
  props: {},
  data() {
    return {
      orderPath: '',
      fullItemObj: {},
      totalPrice: 0,
      goodsPrice: 0,
      transfee: 0,
      userAddr: null,
      remarks: '',
      seckillOrderNumber: '',
      pollingTimes: 0,
      seckillOrderStsTimer: '',

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
    // this.getSeckill()
  },

  /**
		 * 生命周期函数--监听页面初次渲染完成
		 */
  onReady: function() {},

  /**
		 * 生命周期函数--监听页面显示
		 */
  onShow: function() {
    this.getSeckill()
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.makeSureOrder
    })
    var pages = getCurrentPages() // 当前页面栈
    var currPage = pages[pages.length - 1] // 当前页面
    if (currPage.selAddress == 'yes') {
      this.setData({
        // 将携带的参数赋值
        userAddr: currPage.item
      })
      this.confirmOrder()
    }
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
    closePopup: function() {
      this.setData({
        isShowInvoicePopup: false,
        showViewMsg: false
      })
    },
    onRemarksInput: function(e) {
      this.setData({
        remarks: e.detail.value
      })
    },

    // 获取orderPath
    getSeckill() {
      http.request({
        url: '/p/seckill/orderPath',
        method: 'GET',
        callBack: res => {
          this.setData({
            orderPath: res
          })
          this.confirmOrder()
        }
      })
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

    // 确认订单
    confirmOrder() {
      var secKillObj = wx.getStorageSync('bbcSecKillObj')
      if (this.mold !== 1 && this.userAddr) {
        secKillObj.addrId = this.userAddr.addrId
      }
      http.request({
        url: `/p/seckill/${this.orderPath}/confirm`,
        method: 'POST',
        data: secKillObj,
        callBack: res => {
          this.setData({
            fullItemObj: res,
            goodsPrice: res.shopCartItem.prodCount * res.shopCartItem.seckillPrice,
            transfee: res.transfee,
            totalPrice: res.transfee + res.shopCartItem.prodCount * res.shopCartItem.seckillPrice,
            userAddr: res.userAddr,
            mold: res.mold, // 1虚拟商品
            virtualRemarkList: res.virtualRemarkList || [] // 虚拟商品留言
          })
        }
      })
    },

    /**
			 * 提交订单
			 */
    submitOrder() {
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
      console.log(orderInvoiceDTO)
      const orderShopParam = {
        remarks: this.remarks.trim() ? this.remarks : '',
        shopId: this.fullItemObj.shopCartItem.shopId,
        orderInvoice: orderInvoiceDTO,
        virtualRemarkList: this.virtualRemarkList
      }
      const params = {
        url: `/p/seckill/${this.orderPath}/submit`,
        method: 'POST',
        data: orderShopParam,
        selfLoading: true,
        callBack: res => {
          this.seckillOrderNumber = res.orderNumbers
          uni.showLoading({
            title: this.i18n.desperatelyBuying,
            // #ifndef MP-TOUTIAO
            mask: true
            // #endif
          })
          setTimeout(() => {
            this.checkSeckillOrderSubmitStatus()
          }, 3000)
        }
      }
      http.request(params)
    },

    /**
			 * 检查秒杀订单提交状态
			 */
    checkSeckillOrderSubmitStatus() {
      if (this.pollingTimes < 10) {
        const params = {
          url: '/p/seckill/createOrderStatus',
          method: 'GET',
          data: {
            orderNumber: this.seckillOrderNumber
          },
          callBack: res => {
            if (res) {
              uni.hideLoading()
              clearTimeout(this.seckillOrderStsTimer)
              this.$Router.replace({ path: '/pages/pay-way/pay-way?orderNumbers=' + this.seckillOrderNumber })
            } else {
              this.pollingTimes++
              this.seckillOrderStsTimer = setTimeout(this.checkSeckillOrderSubmitStatus, 3000)
            }
          }
        }
        http.request(params)
      } else {
        uni.hideLoading()
        clearTimeout(this.seckillOrderStsTimer)
        uni.showToast({
          title: this.i18n.secFailTips,
          icon: 'none',
          // #ifndef MP-TOUTIAO
          mask: true
          // #endif
        })
      }
    },

    /**
			 * 选择地址
			 */
    toAddrListPage: function() {
      uni.navigateTo({
        url: '/package-user/pages/delivery-address/delivery-address?order=0'
      })
    }
  }
}
</script>
<style scoped>
	@import "./confirm-order.css";
</style>
