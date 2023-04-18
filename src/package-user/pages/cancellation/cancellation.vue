<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j login-success">
    <view class="top">
      <!-- <view class="img-text">
        <view class="circle">
          <image src="@/static/images/icon/search-col.png" mode="heightFix" />
        </view>
        <view class="text">当前登录</view>
      </view>
      <view class="text">我是昵称</view> -->
    </view>
    <view class="card">
      <view class="card-title">1. {{ i18n.cancellationNotice }}</view>
      <view class="text">{{ i18n.cancellationCon }}</view>
      <view class="text">1.1. {{ i18n.cancellationTips1 }}</view>
      <view class="text">1.2. {{ i18n.cancellationTips2 }}</view>
      <view class="text">1.3. {{ i18n.cancellationTips3 }}</view>
      <view class="text">1.4. {{ i18n.cancellationTips4 }}</view>
    </view>
    <!-- 其他登录方式 -->
    <view class="footer">
      <view class="logout-text">
        {{ i18n.cancellationConfirmTips }}
      </view>
      <view class="logout-btn">
        <button class="btn-left" @tap="cancellation">{{ i18n.cancellationConfirm }}</button>
        <button class="btn-right" @tap="back">{{ i18n.cancellationCancel }}</button>
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
      title: this.i18n.accountCancellation
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
      title: this.i18n.accountCancellation
    })
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
    cancellation: function() {
      util.tapLog(3)
      uni.showModal({
        title: this.i18n.tips,
        content: this.i18n.cancellationConfirmTips,
        confirmText: this.i18n.confirm,
        cancelText: this.i18n.cancel,
        success: res => {
          if (res.confirm) {
            this.destroyUser(false)
          }
        }
      })
    },
    destroyUser: function(forceDestroy) {
      const params = {
        url: '/p/user/destroy?forceDestroy=' + forceDestroy,
        method: 'GET',
        callBack: res => {
          uni.removeStorageSync('bbcLoginResult')
          uni.removeStorageSync('bbcToken')
          uni.removeStorageSync('bbcRecentSearch')
          uni.removeStorageSync('bbcHadBindUser')
          uni.removeStorageSync('bbcCode')
          uni.removeStorageSync('bbcUserInfo')
          uni.removeStorageSync('bbcTempUid')
          util.removeTabBadge()
          // 重置uuid、uuidSession、sessionTimeStamp、step、flowAnalysisLogDto
          uni.setStorageSync('bbcUuid', util.getUuid())
          uni.setStorageSync('bbcUuidSession', util.getUuid())
          uni.setStorageSync('bbcSessionTimeStamp', new Date().getTime())
          uni.setStorageSync('bbcStep', 0)
          uni.setStorageSync('bbcFlowAnalysisLogDto', '')
          util.toHomePage()
        },
        errCallBack: err => {
          // 弹窗
          if (err.code === 'A00001') {
            let flag = false
            if (err.msg === '您的账户当前存在未完成的订单，请待所有订单完成后再注销账户' || err.msg === 'you still have unfinished orders. Please wait until all orders have been finish') {
              flag = true
            }
            uni.showModal({
              title: this.i18n.tips,
              content: err.msg,
              confirmText: flag ? this.i18n.confirm : this.i18n.compulsoryCancellation,
              cancelText: this.i18n.cancel,
              success: res => {
                if (res.confirm) {
                  if (flag) {
                    this.back()
                  } else {
                    this.destroyUser(true)
                  }
                }
              }
            })
          } else {
            uni.showToast({
              title: err.msg || 'Error',
              icon: 'none'
            })
          }
        }
      }
      http.request(params)
    }
  }
}
</script>
<style scoped>
@import "./cancellation.css";
</style>
