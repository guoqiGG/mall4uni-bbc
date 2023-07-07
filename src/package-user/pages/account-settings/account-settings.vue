<!-- 账户设置 -->
<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j">
    <view class="item-wrap">
      <view class="cloumn-item" @tap="toPersonalInformation">
        <view class="left-infor">
          <image
            :src="userInfo.pic? userInfo.pic : '/static/images/icon/head04.png'"
            mode="scaleToFill"
            @error="imageError(userInfo,'pic')"
          />
          <text class="nick-name">{{ userInfo.nickName }}</text>
        </view>
        <view class="right-img">
          <view class="txt-wrap">{{ i18n.personalInfor }}</view>
          <image
            class="right-img"
            src="/static/images/icon/arrow-right.png"
            mode="scaleToFill"
          />
        </view>
      </view>
      <view class="cloumn-item" @tap="toAddressList">
        <view class="txt-wrap">{{ i18n.myAddress }}</view>
        <image
          class="right-img"
          src="/static/images/icon/arrow-right.png"
          mode="scaleToFill"
        />
      </view>
    </view>
    <view class="item-wrap">
      <view class="cloumn-item" @tap.stop="">
        <view class="txt-wrap">{{ i18n.modifyPhone }}</view>
        <view class="right-img">
          <view class="phone-number">{{ userInfo.mobile }}</view>
          <!-- <image
            class="right-img"
            src="/static/images/icon/arrow-right.png"
            mode="scaleToFill"
          />p -->
        </view>
      </view>
      <!-- <view class="cloumn-item" @tap.stop="setPassword">
        <view class="txt-wrap">{{ i18n.changePass }}</view>
        <image
          class="right-img"
          src="/static/images/icon/arrow-right.png"
          mode="scaleToFill"
        />
      </view> -->
      <!-- <view class="cloumn-item" @tap.stop="goPersonalRecommend">
        <view class="txt-wrap">{{ i18n.personRec }}</view>
        <view class="right-img">
          <view class="txt-wrap">{{ userInfo.prodRecommendation?i18n.open:i18n.close }}</view>
          <image
            class="right-img"
            src="/static/images/icon/arrow-right.png"
            mode="scaleToFill"
          />
        </view>
      </view> -->
      <view class="cloumn-item" @tap="cancellation">
        <view class="txt-wrap">{{ i18n.cancellationAccount }}</view>
        <image
          class="right-img"
          src="/static/images/icon/arrow-right.png"
          mode="scaleToFill"
        />
      </view>
    </view>
    <view class="item-wrap">
      <view class="cloumn-item" @tap="gotoMessageBox">
        <view class="txt-wrap">{{ i18n.contactService }}</view>
        <image
          class="right-img"
          src="/static/images/icon/arrow-right.png"
          mode="scaleToFill"
        />
      </view>
      <!-- <view class="cloumn-item" @tap="gotoChat">
        <view class="txt-wrap">{{ i18n.feedbackd }}</view>
        <image
          class="right-img"
          src="/static/images/icon/arrow-right.png"
          mode="scaleToFill"
        />
      </view> -->
      <view class="cloumn-item" @tap="toTermsOfService('serviceTerms')">
        <view class="txt-wrap">{{ i18n.termService }}</view>
        <image
          class="right-img"
          src="/static/images/icon/arrow-right.png"
          mode="scaleToFill"
        />
      </view>
      <view class="cloumn-item" @tap="toTermsOfService('servicePolicy')">
        <view class="txt-wrap">{{ i18n.privacyPolicys }}</view>
        <image
          class="right-img"
          src="/static/images/icon/arrow-right.png"
          mode="scaleToFill"
        />
      </view>
    </view>
    <view class="out-btns">
      <button @tap="logout">{{ i18n.logoutBtns }}</button>
    </view>
  </view>
</template>s

<script>
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')

export default {
  data() {
    return {
      // 用户信息
      userInfo: {}
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  onShow() {
    uni.setNavigationBarTitle({
      title: this.i18n.accountSettings
      // title: '账户设置'
    })
    // 获取用户消息
    this.queryUserInfo()
  },
  methods: {
    /**
			 * 获取用户信息
			 */
    queryUserInfo: function() {
      const params = {
        url: '/p/user/userInfo',
        method: 'GET',
        data: {},
        dontTrunLogin: true,
        callBack: (res) => {
          this.userInfo = res
          uni.setStorageSync('bbcUserInfo', res)
        }
      }
      http.request(params)
    },
    /**
			 * 跳转到修改用户头像昵称资料
			 */
    toPersonalInformation: function() {
      util.tapLog(3)
      uni.navigateTo({
        url: '/package-user/pages/personal-information/personal-information'
      })
    },
    /**
			 * 跳转修改密码
			 */
    setPassword: function() {
      util.tapLog(3)
      uni.navigateTo({
        url: '/pages/user-login/user-login?isForgetPassword=true' + '&isPersonalCenter=true'
      })
    },
    /**
     * 跳转个性化推荐设置
     */
    goPersonalRecommend() {
      util.tapLog(3)
      uni.navigateTo({
        url: '/package-user/pages/personal-recommend/personal-recommend'
      })
    },
    /**
			 * 退出登录
			 */
    logout: function() {
      util.tapLog(3)
      uni.navigateTo({
        url: '/package-user/pages/logout/logout'
      })
    },
    /**
			 * 跳转注销账号
			 */
    cancellation: function() {
      util.tapLog(3)
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-user/pages/cancellation/cancellation'
        })
      })
    },
    /**
			 * 我的地址
			 */
    toAddressList: function() {
      util.tapLog(3)
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-user/pages/delivery-address/delivery-address'
        })
      })
    },
    /**
			 * 跳转到和商家客服聊天的界面
			 */
    gotoMessageBox() {
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-user/pages/message-platform/message-platform?tabType=2'
        })
      })
    },
    /**
			 * 跳转到和客服聊天的界面
			 */
    gotoChat() {
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-user/pages/chat/chat-im?shopId=0'
        })
      })
    },
    /**
			 * 去条款页
			 */
    toTermsOfService(key) {
      uni.navigateTo({
        url: '/package-user/pages/terms-page/terms-page?sts=' + key
      })
    }
  }
}
</script>

<style>
  @import "./account-settings.css"
</style>
