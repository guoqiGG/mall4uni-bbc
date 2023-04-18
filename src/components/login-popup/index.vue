<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 提示登录弹框 -->
  <view v-if="!isAuthInfo" class="Mall4j login-popup">
    <view class="log-pop-main">
      <view class="log-pop-tit">{{ i18n.welcomeYami }}</view>
      <view class="log-pop-msg">{{ i18n.authorizeLogin }}</view>
      <view class="log-pop-btns">
        <button class="log-pop-no" @tap="hidePopup">{{ i18n.cancel }}</button>
        <button
          class="log-pop-ok"
          open-type="getUserInfo"
          lang="zh_CN"
          @getuserinfo="onGetUserInfo"
        >
          {{ i18n.confirm }}
        </button>
      </view>
    </view>
  </view>
</template>

<script>
// const http = require('../../utils/http.js')

export default {
  components: {},
  props: {
    isAuthInfo: Boolean
  },
  data() {
    return {}
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  methods: {
    /**
     * 获取用户信息
     */
    onGetUserInfo: function(e) {
      this.$emit('onGotUserInfo', e.detail)
    },
    hidePopup: function() {
      this.setData({
        isAuthInfo: true
      })
    }
  }
}
</script>
<style>
@import "./index.css";
</style>
