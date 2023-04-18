<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 发票信息弹窗 -->
  <view class="Mall4j invoice-popup">
    <view class="popup" :class="{ show: isShowInvoicePopup }">
      <view class="popup-mask" @tap="closePopup" />
      <view class="invoice-popup-con-bottom invoice">
        <view class="invoice-popup-tit">
          <view class="tit-text">{{ i18n.invoice.invoiceInfo }}</view>
          <view class="invoice-close" @tap="closePopup">
            <image src="../../static/images/icon/invoice/close.png" />
          </view>
        </view>
        <view class="con-box">
          <view class="invoice-msg">
            <view class="invoice-item">
              <view class="item-tit">
                <view class="text">{{ i18n.invoice.invoiceType }}</view>
              </view>
              <view class="item-con">
                <view class="item-btn" :class="{active : dataFrom.invoiceType === 1}" @tap="selectInvoiceType(1)">{{ i18n.invoice.generalInvoice }}</view>
                <view v-if="!orderInvoiceId" class="item-btn" :class="{active : dataFrom.invoiceType === 2}" @tap="selectInvoiceType(2)">{{ i18n.invoice.noInvoice }}</view>
              </view>
            </view>
            <view v-if="dataFrom.invoiceType === 1" class="invoice-item">
              <view class="item-tit">
                <view class="text">{{ i18n.invoice.invoiceTitle }}</view>
              </view>
              <view v-if="dataFrom.invoiceType === 1" class="item-con">
                <view class="item-btn pd60" :class="{active : dataFrom.headerType === 2}" @tap="selectheaderType(2)">{{ i18n.invoice.personal }}</view>
                <view class="item-btn pd60" :class="{active : dataFrom.headerType === 1}" @tap="selectheaderType(1)">{{ i18n.invoice.unit }}</view>
              </view>
            </view>
            <view v-if="dataFrom.invoiceType === 1 && dataFrom.headerType === 1" class="invoice-item">
              <view class="item-tit">
                <view class="text">{{ i18n.invoice.unitName }}</view>
                <view class="text-red">*</view>
              </view>
              <view class="item-con">
                <input v-model="dataFrom.headerName" type="text" class="item-input" :placeholder="i18n.invoice.inputTips2">
              </view>
            </view>
            <view v-if="dataFrom.invoiceType === 1 && dataFrom.headerType === 2" class="invoice-item">
              <view class="item-tit">
                <view class="text">{{ i18n.invoice.personalName }}</view>
                <!-- <view class="text-red">*</view> -->
              </view>
              <view class="item-con">
                <input v-model="dataFrom.headerName" type="text" class="item-input" :placeholder="i18n.invoice.inputTips1" maxlength="11">
              </view>
            </view>
            <view v-if="dataFrom.invoiceType === 1 && dataFrom.headerType === 1" class="invoice-item">
              <view class="item-tit">
                <view class="text">{{ i18n.invoice.TaxpayerIDNumber }}</view>
                <view class="text-red">*</view>
              </view>
              <view class="item-con">
                <input v-model="dataFrom.invoiceTaxNumber" maxlength="20" type="text" class="item-input" :placeholder="i18n.invoice.inputTips3">
              </view>
            </view>
            <view v-if="dataFrom.invoiceType === 1 && dataFrom.invoiceType === 1" class="invoice-item">
              <view class="item-tit">
                <view class="text">{{ i18n.invoice.invoiceContent }}</view>
              </view>
              <view class="item-con">
                <view class="item-btn active">{{ i18n.invoice.productDetails }}</view>
              </view>
            </view>
            <view class="invoice-item">
              <view class="item-tit">
                <view class="text">{{ i18n.invoice.invoiceInstructions }}</view>
              </view>
              <view class="item-con">
                <view class="text-box">
                  <view class="item-text">1、{{ i18n.invoice.invoiceTips1 }}</view>
                  <view class="item-text">2、{{ i18n.invoice.invoiceTips2 }}</view>
                  <view class="item-text">3、{{ i18n.invoice.invoiceTips3 }}</view>
                  <view class="item-text">4、{{ i18n.invoice.invoiceTips4 }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="btn-box">
          <view class="sumbit-btn" @tap="submitData">{{ i18n.confirm }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import http from '../../utils/http'

export default {
  props: {
    orderInvoiceId: {
      type: Number,
      default: 0
    },
    shopId: {
      type: Number
    },
    invoiceDataFrom: {
      type: Object,
      default() {
        return {}
      }
    },
    orderNumber: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShowInvoicePopup: false, // 发票信息弹窗
      dataFrom: {
        invoiceType: 2, // 发票类型 1、普通电子发票 2、不开具发票
        headerType: 2, // 抬头类型 2、个人 1、企业
        invoiceContext: 1
      },
      type: 0,
      TaxNumberReg: /^(([0-9A-Za-z]{15})|([0-9A-Za-z]{17})|([0-9A-Za-z]{18})|([0-9A-Za-z]{20}))$/,
      issubmitDataLoading: false // 申请开票中
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  created() {
    if (JSON.stringify(this.invoiceDataFrom) !== '{}') {
      this.dataFrom = JSON.parse(JSON.stringify(this.invoiceDataFrom))
    } else {
      this.dataFrom = {
        invoiceType: 2, // 发票类型 1、普通电子发票 2、不开具发票
        headerType: 2, // 抬头类型 2、个人 1、企业
        invoiceContext: 1,
        headerName: ''
      }
    }
    this.isShowInvoicePopup = true
  },
  methods: {
    init(data) {
      this.dataFrom = JSON.parse(JSON.stringify(data))
    },
    selectInvoiceType(type) {
      this.dataFrom.invoiceType = type
    },
    selectheaderType(headerType) {
      // this.dataFrom.headerName = ''
      this.dataFrom.headerType = headerType
    },
    // 关闭弹窗
    closePopup() {
      this.isShowInvoicePopup = false
      this.$emit('closePopup')
    },
    // 提交数据
    submitData() {
      if (this.issubmitDataLoading) return // 提交数据中
      if (this.dataFrom.invoiceType === 2) {
        this.$emit('getInvoiceData', this.dataFrom)
        this.$emit('closePopup')
        return
      }
      if (this.dataFrom.invoiceType === 1 && this.dataFrom.headerType === 2 && this.dataFrom.headerName && !this.dataFrom.headerName.trim()) {
        uni.showToast({
          title: this.i18n.inputAllSpace,
          icon: 'none'
        })
        this.dataFrom.headerName = ''
        return
      }
      if (this.dataFrom.headerType === 1 && (!this.dataFrom.headerName || !this.dataFrom.headerName.trim())) {
        uni.showToast({
          title: this.i18n.invoice.inputTips2,
          icon: 'none'
        })
        return
      }
      if (this.dataFrom.headerType === 1) {
        if (!this.dataFrom.invoiceTaxNumber || !this.dataFrom.invoiceTaxNumber.trim()) {
          uni.showToast({
            title: this.i18n.invoice.inputTips3,
            icon: 'none'
          })
          return
        } else {
          if (!this.TaxNumberReg.test(this.dataFrom.invoiceTaxNumber && this.dataFrom.invoiceTaxNumber.trim())) {
            uni.showToast({
              title: this.i18n.invoice.inputTips4,
              icon: 'none'
            })
            return
          }
        }
      }
      if (this.dataFrom.headerType === 2) {
        delete this.dataFrom.invoiceTaxNumber
      }
      if (this.shopId) {
        this.dataFrom.shopId = this.shopId
      }
      this.dataFrom.headerName = this.dataFrom.headerName.trim()
      this.dataFrom.invoiceTaxNumber = this.dataFrom.invoiceTaxNumber && this.dataFrom.invoiceTaxNumber.trim()
      if (this.orderNumber) {
        this.dataFrom.orderNumber = String(this.orderNumber)
        if (this.orderInvoiceId) {
          this.dataFrom.orderInvoiceId = this.orderInvoiceId
        }
        const method = this.orderInvoiceId ? 'PUT' : 'POST'
        const msg = this.orderInvoiceId ? this.i18n.invoice.updateMsg : this.i18n.invoice.successMsg
        const params = {
          url: '/p/orderInvoice',
          method: method,
          data: this.dataFrom,
          callBack: res => {
            uni.showToast({
              title: msg,
              icon: 'none',
              duration: 1000
            })
            setTimeout(() => {
              this.$emit('getData')
              this.$emit('closePopup')
              this.isShowInvoicePopup = false
              this.issubmitDataLoading = false
            }, 1000)
          },
          errCallBack: err => {
            this.issubmitDataLoading = false
            this.errCallBackPop(err)
          }
        }
        http.request(params)
        this.issubmitDataLoading = true
      } else {
        this.$emit('closePopup')
        this.$emit('getInvoiceData', this.dataFrom)
        this.isShowInvoicePopup = false
      }
    }
  }
}
</script>

  <style scoped>
  @import url('./index.css');
  </style>
