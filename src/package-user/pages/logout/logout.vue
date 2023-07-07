<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j login-success">
    <view class="top">
      <view class="img-text">
        <view class="circle">
          <image :src="userInfo.pic? userInfo.pic : '/static/images/icon/head04.png'" mode="heightFix" @error="handlePicError(userInfo)" />
        </view>
        <view class="text">{{ i18n.logged }}</view>
      </view>
      <view class="text">{{ userInfo.nickName }}</view>
    </view>
    <view class="card">
      <view class="card-title">{{ i18n.logoutNotice }}</view>
      <view class="cart-item-con">
        <view v-if="appType <= 2" class="item">
          <image src="../../static/images/icon/weixin.png" mode="heightFix" />
          <text class="text">{{ i18n.logoutNotice1 }}</text>
        </view>
        <view class="item">
          <image src="../../static/images/icon/icon-acount.png" mode="heightFix" />
          <text class="text">{{ i18n.logoutNotice2 }}</text>
        </view>
        <view class="item">
          <image src="../../static/images/icon/icon-order.png" mode="heightFix" />
          <text class="text">{{ i18n.logoutNotice3 }}</text>
        </view>
        <view class="item">
          <image src="../../static/images/icon/icon-preferential.png" mode="heightFix" />
          <text class="text">{{ i18n.logoutNotice4 }}</text>
        </view>
      </view>
    </view>
    <!-- 其他登录方式 -->
    <view class="footer">
      <view class="logout-text">
        {{ i18n.logoutConfirm }}
      </view>
      <view class="logout-btn">
        <button class="btn-left" @tap="logout">{{ i18n.logoutBtn }}</button>
        <button class="btn-right" @tap="back">{{ i18n.keepLogin }}</button>
      </view>
    </view>
  </view>
</template>

<script>
const util = require('@/utils/util.js')
const http = require('@/utils/http.js')
export default {
  data() {
    return {
      userInfo: '',
      appType: uni.getStorageSync('bbcAppType')
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
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.logoutBtn
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.logoutBtn
    })
    // 查询用户信息
    this.userInfo = uni.getStorageSync('bbcUserInfo')
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

  methods: {
    back() {
      uni.switchTab({
        url: '/pages/user/user'
      })
    },
    /**
			 * 退出登录
			 */
    logout: function() {
      util.tapLog(3)
      const params = {
        url: '/logOut',
        method: 'POST',
        callBack: res => {
          uni.removeStorageSync('bbcLoginResult')
          uni.removeStorageSync('bbcToken')
          uni.removeStorageSync('bbcRecentSearch')
          uni.removeStorageSync('bbcHadBindUser')
          uni.removeStorageSync('bbcCode')
          uni.removeStorageSync('bbcUserInfo')
          uni.removeStorageSync('bbcExpiresTimeStamp')
          uni.removeStorageSync('watchSecond')
          util.removeTabBadge()
          // 重置uuid、uuidSession、sessionTimeStamp、step、flowAnalysisLogDto
          uni.setStorageSync('bbcUuid', util.getUuid())
          uni.setStorageSync('bbcUuidSession', util.getUuid())
          uni.setStorageSync('bbcSessionTimeStamp', new Date().getTime())
          uni.setStorageSync('bbcStep', 0)
          uni.setStorageSync('bbcFlowAnalysisLogDto', '')
          // util.toHomePage()
          // 跳转到登录页
          uni.reLaunch({ url: '/pages/user-login/user-login' })
        },
        errCallBack: errMsg => {
          console.log(errMsg)
        }
      }
      http.request(params)
    },
    handlePicError(item) {
      // 替换为默认图片
      item.pic = '/static/images/icon/head04.png'
    }
  }
}
</script>
<style scoped>
@import "./logout.css";
</style>
