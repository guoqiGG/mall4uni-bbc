<!-- 虚拟商品-查看券码 -->
<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j view-voucher-code">
    <view class="card-vouchers card-model">
      <!-- 券码信息 -->
      <view class="top-half item">
        <view class="prod-name">{{ voucherCodeInfo.orderItemDtos[0].prodName }}</view>
        <view class="total-num">
          <text class="weak">{{ i18n.totalAmount }}：</text>￥{{ voucherCodeInfo.actualTotal }}（{{ voucherCodeInfo.virtualInfoList.length + i18n.sheets }}）
        </view>
        <view class="expiry-date">
          <view class="lf weak">{{ i18n.validityDate }}：</view>
          <view class="rg">
            <text v-if="voucherCodeInfo.writeOffStart && !voucherCodeInfo.writeOffEnd">{{ i18n.longTermValidity }}</text>
            <text v-if="voucherCodeInfo.writeOffStart && voucherCodeInfo.writeOffEnd">
              {{ voucherCodeInfo.writeOffStart + i18n.to + voucherCodeInfo.writeOffEnd }}
            </text>
          </view>
        </view>
      </view>
      <!-- 条码 & 二维码 -->
      <view class="bottom-half">
        <!-- 条码 -->
        <view class="bar-code">
          <tki-barcode
            ref="barcode"
            onval
            :val="voucherCodeInfo.orderNumber"
            :load-make="true"
            :opations="barOpations"
          />
        </view>
        <!-- <view class="code-number">{{ voucherCodeInfo.orderNumber }}</view> -->
        <view class="tips weak">{{ i18n.tipsForUsingVoucherCode }}</view>
        <!-- 二维码 -->
        <view class="qr-code">
          <view class="code">
            <tki-qrcode
              ref="qrcode"
              onval
              :val="voucherCodeInfo.orderNumber"
              :size="400"
              :load-make="true"
              :show-loading="true"
              :loading-text="i18n.generating"
              @result="qrcodeResult"
              @longpress="downloadImg"
            />
          </view>
          <view class="qicode-tips">{{ i18n.savePicTips }}</view>
        </view>
      </view>
    </view>

    <!-- 使用情况 -->
    <view class="code-list">
      <!-- 已过期券码列表 -->
      <view v-if="unusedCodeList && unusedCodeList.length && timeLine" class="code-item">
        <view class="text">{{ i18n.expired }}（{{ unusedCount + i18n.sheets }}）</view>
        <view class="text-list">
          <view v-for="(unusedItem, unusedIndex) in unusedCodeList" :key="unusedIndex" class="text">
            {{ i18n.voucherCode + unusedItem.index }}：{{ unusedItem.writeOffCode }}
          </view>
        </view>
      </view>
      <!-- 未使用券码列表 -->
      <view v-if="unusedCodeList && unusedCodeList.length && !timeLine" class="code-item">
        <view class="text">{{ i18n.toBeUsed }}（{{ unusedCount + i18n.sheets }}）</view>
        <view class="text-list">
          <view v-for="(unusedItem, unusedIndex) in unusedCodeList" :key="unusedIndex" class="text">
            {{ i18n.voucherCode + unusedItem.index }}：{{ unusedItem.writeOffCode }}
          </view>
        </view>
      </view>
      <!-- 已使用券码列表 -->
      <view v-if="usedCodeList && usedCodeList.length" class="code-item used">
        <view class="text">{{ i18n.used }}（{{ usedCodeList.length + i18n.sheets }}）</view>
        <view class="text-list">
          <view v-for="(usedItem, usedIndex) in usedCodeList" :key="usedIndex" class="text">
            <text class="used-code">{{ i18n.voucherCode + usedItem.index }}：<text class="code">{{ usedItem.writeOffCode }}</text></text>
            <text class="right">{{ usedItem.writeOffTime }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import tkiBarcode from '../../components/tki-barcode/tki-barcode'
import tkiQrcode from '../../components/tki-qrcode/tki-qrcode'
var Qr = require('@/utils/wxqrcode.js')
var http = require('@/utils/http.js')
export default {
  components: {
    tkiBarcode,
    tkiQrcode
  },
  data() {
    return {
      voucherCodeInfo: {},
      // 条码
      barOpations: {
        height: 150, // 高度
        displayValue: false // 是否在条形码下方显示文字
      },
      // 二维码
      orderNumQrCode: '',

      // 未使用总数
      unusedCount: 0,
      // 未使用列表
      unusedCodeList: [],
      // 已使用列表
      usedCodeList: [],
      timeLine: null,

      qrcodeImg: '', // 临时图片地址
      getStatusS: null
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
  onLoad(options) {
    this.voucherCodeInfo = uni.getStorageSync('bbcVoucherCodeInfo')
    console.log(this.voucherCodeInfo)
    // 计算未使用券总数
    if (this.voucherCodeInfo.virtualInfoList.length) {
      let unusedCount = 0
      const unusedCodeList = []
      const usedCodeList = []
      this.voucherCodeInfo.virtualInfoList.forEach((el, index) => {
        el.index = index + 1
        if (el.isWriteOff === 0) {
          unusedCount = unusedCount + 1
          unusedCodeList.push(el)
        } else if (el.isWriteOff === 1) {
          usedCodeList.push(el)
        }
      })
      this.unusedCount = unusedCount
      this.unusedCodeList = unusedCodeList
      this.usedCodeList = usedCodeList
    }

    // 计算有无过期
    if (this.voucherCodeInfo.writeOffEnd) {
      const writeOffEndTime = new Date(this.voucherCodeInfo.writeOffEnd).getTime()
      const nowTime = new Date().getTime()
      if (nowTime > writeOffEndTime) { this.timeLine = true }
    }

    // this.getQrcode(this.voucherCodeInfo.orderNumber)
  },

  onShow() {
    this.clearGetStatus()
    this.getStatus()
  },

  onHide() {
    this.clearGetStatus()
  },

  methods: {
    /**
     * 生成二维码
     */
    getQrcode: function(code) {
      this.orderNumQrCode = Qr.createQrCodeImg(code)
    },

    qrcodeResult(v) {
      this.qrcodeImg = v
      // console.log('qrcodeImg:', this.qrcodeImg)
    },

    clearGetStatus() {
      if (this.getStatusS) {
        clearInterval(this.getStatusS)
      }
    },

    // 获取订单核销状态
    getStatus() {
      var ths = this
      const params = {
        url: '/p/myOrder/getOrderStatus',
        method: 'GET',
        selfLoading: true,
        data: {
          orderNumber: this.voucherCodeInfo.orderNumber
        },
        callBack: function(res) {
          let unusedCount = 0
          if (res.virtualInfoList && res.virtualInfoList.length) {
            res.virtualInfoList.forEach((el) => {
              if (el.isWriteOff === 0) {
                unusedCount = unusedCount + 1
              }
            })
          }
          if (res.status === 5 && unusedCount === 0) {
            clearInterval(ths.getStatusS)
            uni.navigateBack({
              delta: 1
            })
            return
          }
        }
      }
      this.getStatusS = setInterval(() => {
        http.request(params)
      }, 1000)
    },

    /**
     * 保存图片至相册
     */
    downloadImg() {
      const them = this
      uni.showLoading({
        // #ifndef MP-TOUTIAO
        mask: true
        // #endif
      })
      // #ifdef APP-PLUS
      const bitmap = new plus.nativeObj.Bitmap('test')
      bitmap.loadBase64Data(
        this.qrcodeImg,
        () => {
          const url = '_doc/' + new Date() + '.png' // url建议用时间戳命名方式
          bitmap.save(
            url,
            {
              overwrite: true
            },
            i => {
              uni.saveImageToPhotosAlbum({
                filePath: url,
                success: () => {
                  uni.hideLoading()
                  uni.showToast({
                    title: this.i18n.downloadComplete
                  })
                  bitmap.clear()
                }
              })
            },
            e => {
              uni.hideLoading()
              // alert('保存失败1111', JSON.stringify(e))
              bitmap.clear()
            }
          )
        },
        e => {
          // alert('保存失败2222', JSON.stringify(e))
          uni.hideLoading()
          bitmap.clear()
        }
      )
      // #endif
      // #ifdef MP-WEIXIN
      wx.getImageInfo({
        src: this.qrcodeImg,
        success: (res) => {
          const path = res.path
          wx.saveImageToPhotosAlbum({
            filePath: path,
            success: (res) => {
              console.log('保存图片成功res:', res)
              wx.showToast({
                title: this.i18n.downloadComplete
              })
            },
            fail: (err) => {
              uni.hideLoading()
              console.log('保存图片失败err:', err)

              // 获取授权信息
              wx.getSetting({
                success(res) {
                  if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.showModal({
                      title: them.i18n.prompt,
                      content: them.i18n.failedSaveTips,
                      success(res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                          // 打开授权设置
                          wx.openSetting({
                            success(res) {
                              console.log(res.authSetting)
                            }
                          })
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        },
        fail: (err) => {
          console.log('获取图片信息失败err:', err)
          uni.hideLoading()
        }
      })
      // #endif
    }

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.clearGetStatus()
    uni.removeStorageSync('bbcVoucherCodeInfo')
  }

}
</script>

<style>
@import "./voucher-code.css";
</style>
