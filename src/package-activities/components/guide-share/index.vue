<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 引导分享蒙版 -->
  <view class="Mall4j guide-share-mask">
    <view class="mask" />
    <view class="guide-share-close" @tap="close">
      <image src="/static/images/icon/close.png" mode="" />
    </view>
    <!-- H5: 微信浏览器，引导用户右上角分享 -->
    <view v-if="isWechat" class="guide-content">
      <view class="share-img">
        <image src="/static/images/icon/shareIcon.png" />
      </view>
      <view class="share-word">
        <view class="big-word">{{ i18n.shareFriendsNow }}</view>
        <view class="small-word">{{ i18n.shareFriendsTips2 }}</view>
      </view>
    </view>
    <!-- 普通浏览器，生成链接二维码 -->
    <view v-else class="guide-qrcode">
      <view class="guide-main">
        <image :src="qrSrc" mode="" />
        <view class="guide-copy-btn" @tap="copyLink">
          <text>{{ i18n.copyLink }}</text>
        </view>
      </view>
    </view>

  </view>
  <!-- 引导分享蒙版 end -->
</template>

<script>
import uniCopy from '@/js_sdk/copy/uni-copy.js'
var Qr = require('../../../utils/wxqrcode')
export default {
  props: {
    isWechat: Boolean,
    qrLink: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      qrSrc: '' // 生成的二维码路径
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  created() {
    if (!this.isWechat && this.qrLink) {
      this.drawQrCode()
    }
  },
  methods: {
    /**
     * 关闭
     */
    close() {
      this.$emit('hideGuideShare', false)
    },
    /**
     * 绘制二维码
     */
    drawQrCode() {
      this.qrSrc = Qr.createQrCodeImg(this.qrLink, { size: 175 })
    },
    /**
     * 复制链接
     */
    copyLink() {
      uniCopy({
        content: this.qrLink,
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
@import url("./index.css");
</style>
