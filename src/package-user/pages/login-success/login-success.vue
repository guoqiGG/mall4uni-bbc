<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j login-success">
    <view class="success-img">
      <image src="@/static/images/icon/allow.png" mode="heightFix" />
    </view>
    <view class="title">{{ i18n.loginSuccessTips1 }}</view>
    <view class="sub-title">{{ i18n.loginSuccessTips2 }}</view>
    <button class="btn" @tap="back">{{ i18n.Back }}</button>
  </view>
</template>

<script>
const util = require('@/utils/util.js')
export default {
  data() {
    return {

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
  onLoad: function (options) {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.userLogin
    })
    uni.getUserInfo({
      provider: 'wx',
      withCredentials: true,
      success: ({ userInfo, rawData, signature, encryptedData, iv, errMsg }) => {
        console.log(userInfo)
      },
      fail: (error) => {}
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.userLogin
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  methods: {
    back() {
      util.previousPage()
      // uni.switchTab({
      //   url: '/pages/user/user'
      // })
    }
  }
}
</script>
<style>
@import "./login-success.css";
</style>
