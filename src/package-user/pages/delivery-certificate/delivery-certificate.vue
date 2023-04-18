<!-- 提货码详情 -->
<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <view class="delivery-certificate">
      <view class="address-box item">
        <view class="name">{{ stationInfo.stationName }}
          <text class="self-icon">{{ i18n.pickup }}</text>
        </view>
        <view class="a-item">
          <view class="img">
            <image src="/static/images/icon/submit-address.png" />
          </view>
          <view class="text">{{ stationInfo.stationAddress }}</view>
        </view>
        <view class="a-item">
          <view class="img">
            <image src="../../static/images/icon/station-phone.png" /></view>
          <view class="text">{{ stationInfo.stationPhone }}</view>
        </view>
        <view class="a-item">
          <view class="img">
            <image src="../../static/images/icon/time.png" />
          </view>
          <view class="text">{{ stationInfo.stationTime }}</view>
        </view>
      </view>
      <view class="code-det item">
        <view class="bar-code">
          <tki-barcode
            ref="barcode"
            onval
            :val="stationCode"
            :load-make="true"
            :opations="barOpations"
          />
        </view>
        <view class="code-number">{{ i18n.pickingCode }}：{{ stationCode }}</view>
        <view class="code">
          <image :src="stationQrCode" />
        </view>
      </view>
      <view class="btn-box">
        <view class="btn" @tap="backOrderDetail">{{ i18n.returnOrderDetails }}</view>
      </view>
    </view>
  </view>
</template>

<script>
var http = require('@/utils/http.js')
import tkiBarcode from '../../components/tki-barcode/tki-barcode'
var Qr = require('@/utils/wxqrcode.js')
export default {
  components: {
    tkiBarcode
  },
  data() {
    return {
      orderNumber: '', // 订单编号
      stationCode: '', // 12345678
      stationQrCode: '', // 提货码二维码
      stationInfo: {}, // 自提点信息
      barOpations: {
        height: 150,
        displayValue: false
      },
      getStatusS: null
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  onLoad(option) {
    this.orderNumber = option.orderNumber
  },

  onShow: function() {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.deliveryVoucher
    })
    this.getOrderInfo()
    this.getStatus()
  },

  onHide() {
    if (this.getStatusS) {
      clearInterval(this.getStatusS)
    }
  },

  onUnload() {
    if (this.getStatusS) {
      clearInterval(this.getStatusS)
    }
  },

  methods: {
    /**
     * 获取订单详情
     */
    getOrderInfo() {
      const params = {
        url: '/p/myStationOrder/stationDetail',
        method: 'GET',
        data: {
          orderNumber: this.orderNumber
        },
        callBack: res => {
          this.stationInfo = res
          this.stationCode = res.stationCode
          this.getQrcode(this.stationCode)
        }
      }
      http.request(params)
    },

    // 获取订单提货状态
    getStatus() {
      var ths = this
      const params = {
        url: '/p/myOrder/orderDetail',
        method: 'GET',
        selfLoading: true,
        data: {
          orderNumber: this.orderNumber
        },
        callBack: function(res) {
          if (res.status >= 3) {
            clearInterval(this.getStatusS)
            ths.backOrderDetail()
          }
          if (res.refundStatus === 1 || res.refundStatus === 2) {
            clearInterval(ths.getStatusS)
          }
        }
      }
      if (this.getStatusS) {
        clearInterval(this.getStatusS)
      }
      this.getStatusS = setInterval(() => {
        http.request(params)
      }, 1000)
    },

    /**
     * 生成二维码
     */
    getQrcode(stationCode) {
      this.stationQrCode = Qr.createQrCodeImg(stationCode)
    },

    /**
     * 返回详情
     */
    backOrderDetail() {
      // 返回
      uni.navigateBack({
        delta: 1
      })
    }
  }
}
</script>

<style scoped>
.barcode .image {
  margin: 0 auto;
}
</style>

<style>
@import "delivery-certificate.css";
</style>
