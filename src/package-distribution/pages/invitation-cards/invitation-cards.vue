<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j InvitationCards-mian">
    <view class="InvitationCards-ont">
      <view class="InvitationCards-in">
        <view class="title">
          <view class="hrLineLeft">
            <view class="line" />
            <view class="circle" />
          </view>
          <view class="centerText">{{ i18n.invitationCard }}</view>
          <view class="hrLineRight">
            <view class="circle" />
            <view class="line" />
          </view>
        </view>
        <view class="InvitationCards-in-image">
          <image
            :src="
              distInfo.pic
                ? distInfo.pic
                : '../../../static/images/icon/head01.png'
            "
            mode=""
            @error="imageError(distInfo,'pic')"
          />
        </view>
        <view class="userinfo-name">
          <text>{{ distInfo.nickName }}</text>
        </view>
        <view class="InvitationCards-yaoqi">{{ i18n.inviteJoin }}</view>
        <view class="InvitationCards-in-image2">
          <image :src="shareWxCode" />
        </view>
      </view>
    </view>
    <view class="InvitationCards-mian-text">
      <text>{{ i18n.screenshotTips }}</text>
    </view>
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
const config = require('../../../utils/config.js')
var Qr = require('../../../utils/wxqrcode')
import Wechat from '../../../utils/wechat.js'
export default {
  components: {},
  props: {},
  data() {
    return {
      shareWxCode: '', // 生成的二维码路径 微信端
      qrSrc: '', // 生成的二维码路径 h5端
      isWechat: false, // 是否微信环境
      distInfo: {}
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  onShow: function() {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.invitationCard
    })
    // #ifdef H5
    this.isWechat = Wechat.isWechat()
    // #endif
    this.getInvitationCode()
    this.getDisInfo()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  methods: {
    /**
     * 获取分销员信息
     */
    getDisInfo() {
      http.request({
        url: '/p/distribution/user/distributionUserInfo',
        method: 'GET',
        data: {
          shopId: 1
        },
        callBack: (res) => {
          this.distInfo = res
        }
      })
    },
    /**
     * 生成分销邀请二维码
     * 小程序端 生成小程序菊花码  否则生成普通二维码
     */
    getInvitationCode() {
      const cardno = uni.getStorageSync('bbcDistCardNo')
      // #ifdef H5 || APP-PLUS
      const code = `${config.domainAddress}/package-distribution/pages/apply-dist-con/apply-dist-con?scene=${cardno}`
      this.shareWxCode = Qr.createQrCodeImg(code, { size: 250 })
      // #endif

      // #ifdef MP-WEIXIN
      // 请求小程序菊花码
      const params = {
        url: '/p/distribution/qrCode/invitation',
        method: 'GET',
        responseType: 'arraybuffer',
        data: {
          page: 'package-distribution/pages/apply-dist/apply-dist',
          scene: cardno
        },
        callBack: (res) => {
          this.shareWxCode = 'data:image/jpg;base64,' + wx.arrayBufferToBase64(res)
        }
      }
      http.request(params)
      // #endif
    }
  }
}
</script>
<style>
@import "./invitation-cards.css";
</style>
