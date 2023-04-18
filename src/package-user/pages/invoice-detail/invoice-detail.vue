<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j invoice-detail">
    <!-- 发票状态 -->
    <view class="status-box">
      <view class="bg">
        <image style="height: 160rpx;width: 100%;" src="../../static/images/icon/invoice/status-bg.jpg" />
      </view>
      <view v-if="invoiceInfo.invoiceState === 2" class="status">{{ i18n.invoice.invoiceStatus }}：{{ i18n.invoice.invoiced }}</view>
      <view v-else class="status">{{ i18n.invoice.invoiceStatus }}：{{ i18n.invoice.application }}</view>
    </view>

    <!-- 发票信息 -->
    <view class="invoice-info">
      <view class="item">
        <view class="tit">{{ i18n.invoice.invoiceType }}</view>
        <view class="text">{{ i18n.invoice.generalInvoice }}</view>
      </view>
      <view class="item">
        <view class="tit">{{ i18n.invoice.invoiceContent }}</view>
        <view class="text">{{ i18n.invoice.productDetails }}</view>
      </view>
      <view class="item">
        <view class="tit">{{ i18n.invoice.invoiceTitle }}</view>
        <view v-if="invoiceInfo.headerType === 1" class="text">{{ invoiceInfo.headerName }}</view>
        <view v-else class="text">{{ invoiceInfo.headerName || i18n.invoice.personal }}</view>
      </view>
      <view v-if="invoiceInfo.headerType === 1" class="item">
        <view class="tit">{{ i18n.invoice.TaxpayerIDNumber }}</view>
        <view class="text">{{ invoiceInfo.invoiceTaxNumber }}</view>
      </view>
      <view v-if="invoiceInfo.invoiceState === 2" class="item">
        <view class="tit">{{ i18n.invoice.uploadTime }}</view>
        <view class="text">{{ invoiceInfo.uploadTime }}</view>
      </view>
    </view>

    <!-- 商品信息 -->
    <view class="prods-box">
      <view class="shop" @tap="toShopIndex(orderInfo.shopId)">
        <view class="icon">
          <image style="width: 24rpx;height: 24rpx;" src="../../static/images/icon/invoice/shop.png" />
        </view>
        <view class="name text-arrow">{{ orderInfo.shopName }}</view>
      </view>
      <view v-for="(item) in orderInfo.orderItemDtos" :key="item.orderItemId" class="prod-item" @tap="toSpuDetail(item.prodId)">
        <!-- 单商品 -->
        <view class="single-prod">
          <view class="prod-img">
            <ImgShow :src="item.pic" imgMode="aspectFit" :imgStyle="{maxWidth: '100%',maxHeight: '100%'}" />
          </view>
          <view class="text-box">
            <view class="name">{{ item.prodName }}</view>
            <view class="sku"><text v-if="item.skuName" style="margin-right: 20rpx" class="sku-name">{{ item.skuName }} </text><text>￥{{ item.prodCount*item.price | price }}</text><text class="prod-count">X{{ item.prodCount }}</text></view>
          </view>
        </view>
      </view>
      <!-- 订单信息 -->
      <view class="order-msg">
        <view class="item">
          <view class="tit">{{ i18n.invoice.amountPaid }}</view>
          <view class="text">￥{{ orderInfo.actualTotal | price }}</view>
        </view>
        <view class="item">
          <view class="tit">{{ i18n.invoice.orderStatus }}</view>
          <view class="text">{{ ['',i18n.waitingBuyerPay,i18n.waitingForDelivery,i18n.toBeReceived,i18n.orderCompleted,i18n.orderCompleted,i18n.orderCancelled,i18n.itInaGroup][orderInfo.status] }}</view>
        </view>
        <view class="item">
          <view class="tit">{{ i18n.invoice.orderNumber }}</view>
          <view class="text">{{ orderNumber }}</view>
        </view>
        <view class="item">
          <view class="tit">{{ i18n.invoice.orderCreateTime }}</view>
          <view class="text">{{ orderInfo.createTime }}</view>
        </view>
      </view>
    </view>

    <!-- 常见问题 -->
    <view class="invoice-notice">
      <view class="tit">{{ i18n.invoice.questions }}</view>
      <view class="text">1、{{ i18n.invoice.questions1 }}</view>
      <view class="text">2、{{ i18n.invoice.questions2 }}</view>
      <view class="text">3、{{ i18n.invoice.questions3 }}</view>
      <view class="text">4、{{ i18n.invoice.questions4 }}</view>
      <view class="text">5、{{ i18n.invoice.questions5 }}</view>
    </view>

    <!-- 底部 -->
    <view class="foot-box">
      <view class="btn-box">
        <!-- <view class="btn">咨询客服</view> -->
        <view class="btn" @tap="showInvoicePopup">{{ i18n.invoice.invoiceExchange }}</view>
        <!-- #ifdef APP-PLUS || MP-WEIXIN || MP-TOUTIAO -->
        <view v-if="filePath" class="btn btn-r" @tap="downloadInvoice">{{ i18n.invoice.invoiceDownload }}</view>
        <!-- #endif -->

        <!-- #ifdef H5 -->
        <a v-if="filePath" class="btn btn-r" style="text-decoration:none;" target="_blank" :href="resourcesUrl+filePath">{{ i18n.invoice.invoiceDownload }}</a>
        <!-- #endif -->
      </view>
    </view>
    <invoiceEdit
      v-if="isShowInvoicePopup"
      ref="invoiceAddOrUpdate"
      :order-number="orderNumber"
      :shop-id="invoiceInfo.shopId"
      :order-invoice-id="invoiceInfo.orderInvoiceId"
      @closePopup="closePopup"
      @getData="getInvoiceDetail"
    />
  </view>
</template>

<script>
import invoiceEdit from '@/components/invoice-edit/index'
import http from '@/utils/http'
import config from '@/utils/config.js'
export default {
  filters: {
    price(value) {
      if (!value) {
        return 0.00
      }
      return (value).toFixed(2)
    }
  },
  components: {
    invoiceEdit
  },
  data() {
    return {
      invoiceId: '',
      orderInvoiceId: '',
      invoiceInfo: {},
      orderInfo: {},
      filePath: '',
      orderNumber: '',
      resourcesUrl: config.picDomain,
      isShowInvoicePopup: false // 发票弹窗
    }
  },
  onLoad(options) {
    console.log(options)
    this.orderInvoiceId = options.orderInvoiceId
    this.orderNumber = options.orderNumber
    this.getInvoiceDetail()
    this.getOrderDetail()
  },
  onShow() {
    uni.setNavigationBarTitle({
      title: this.i18n.invoice.InvoiceDetails
    })
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  methods: {
    toSpuDetail(spuId) {
      uni.navigateTo({
        url: '/pages/prod/prod?prodId=' + spuId
      })
    },
    toShopIndex(shopId) {
      return
    },
    // 保存发票
    downloadInvoice() {
      uni.downloadFile({
        url: this.resourcesUrl + this.filePath, // 文件链接
        header: {
          'Authorization': uni.getStorageSync('bbcToken')
        },
        success: (res) => {
          // statusCode状态为200表示请求成功，tempFIlePath临时路径
          if (res.statusCode === 200) {
            // 保存到本地
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: (res) => {
                // res.savedFilePath文件的保存路径
                // 保存成功并打开文件
                uni.showToast({
                  title: '发票保存成功',
                  icon: 'none'
                })
                uni.openDocument({
                  filePath: res.savedFilePath,
                  success: (res) => console.log('成功打开文档')
                })
              },
              fail: () => console.log('下载失败')
            })
          }
        },
        fail: () => { console.log('下载失败') }
      })
    },
    getInvoiceFile() {
      const params = {
        url: '/p/file/get_file_by_id',
        method: 'GET',
        data: {
          fileId: this.invoiceInfo.fileId
        },
        callBack: res => {
          this.filePath = res.filePath
        }
      }
      http.request(params)
    },
    // 获取发票详情
    getInvoiceDetail() {
      const params = {
        url: `/p/orderInvoice/info/${this.orderInvoiceId}`,
        method: 'GET',
        callBack: res => {
          this.invoiceInfo = res
          if (res.fileId) {
            this.getInvoiceFile()
          }
        },
        errCallBack: err => {
          this.errCallBackPop(err)
        }
      }
      http.request(params)
    },
    // 获取订单详情
    getOrderDetail() {
      const params = {
        url: `/p/myOrder/orderDetail?orderNumber=${this.orderNumber}`,
        method: 'GET',
        callBack: res => {
          this.orderInfo = res
        },
        errCallBack: err => {
          this.errCallBackPop(err)
        }
      }
      http.request(params)
    },
    // 查看自提凭证
    viewCertificate() {
      uni.navigateTo({
        url: '/pages/delivery-certificate/delivery-certificate'
      })
    },
    // 申请售后
    toApplyRefund() {
      uni.navigateTo({
        url: '/pages/apply-refund/apply-refund'
      })
    },
    // 关闭弹窗
    closePopup() {
      this.isShowInvoicePopup = false
    },
    // 发票信息弹窗
    showInvoicePopup() {
      this.isShowInvoicePopup = true
      console.log(this.invoiceInfo)
      const data = {
        headerName: this.invoiceInfo.headerName,
        headerType: this.invoiceInfo.headerType,
        invoiceContext: this.invoiceInfo.invoiceContext,
        invoiceState: this.invoiceInfo.invoiceState,
        invoiceTaxNumber: this.invoiceInfo.invoiceTaxNumber,
        invoiceType: this.invoiceInfo.invoiceType
      }
      this.$nextTick(() => {
        this.$refs.invoiceAddOrUpdate.init(data)
      })
    }
  }
}
</script>

  <style>
  @import "./invoice-detail.css";
  </style>
