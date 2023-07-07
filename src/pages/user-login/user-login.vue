<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j con">
    <view class="logo">
      <view class="logo-con">
        <image :src="uniLoginLogoImg" mode="heightFix" @tap="toIndex" />
      </view>
    </view>
    <!-- 账号登录 -->
    <view v-if="!isForgetPassword && loginStatus === 0" class="login-form">
      <!-- 账号 -->
      <view :class="['item', errorTips == 1 ? 'error' : '']">
        <view class="account">
          <input v-model="principal" type="text" data-type="account" placeholder-class="inp-palcehoder"
            :placeholder="i18n.enterUsername" @blur="principalInput" @confirm="login">
        </view>
        <view v-if="errorTips == 1" class="error-text"><text class="warning-icon">!</text>{{ i18n.usernameWarn }}
        </view>
      </view>
      <!-- 密码 -->
      <view :class="['item', errorTips == 2 ? 'error' : '']">
        <view class="account">
          <input v-model="credentials" type="text" :password="passwordType" data-type="password"
            placeholder-class="inp-palcehoder" :placeholder="i18n.enterPassword" @blur="principalInput" @confirm="login">
          <div class="image-box">
            <image :src="passwordImage" style="width:26rpx;height:18rpx" mode="heightFix" @tap="showPassword" />
          </div>
          <text class="input-suffix" @tap="forgotPassword">{{ i18n.forgetPwd }}</text>
        </view>
        <view v-if="errorTips == 2" class="error-text"><text class="warning-icon">!</text>{{ i18n.enterPassword }}
        </view>
      </view>
      <!-- 按钮 -->
      <view>
        <button class="authorized-btn" @tap="login">{{ i18n.login }}</button>
      </view>
      <!-- 服务条款 -->
      <view v-if="serviceTermsSwitch || privacyPolicySwitch" class="item statement">
        <label class="statement-label" @tap.stop="handlePrivacyClick">
          <checkbox class="check-box" :checked="isPrivacy === 1" />
          <view style="color: #999999">
            {{ i18n.loginAgree }}
            <text v-if="serviceTermsSwitch" @tap.stop="toTermsOfService('serviceTerms')">《{{ i18n.termsOfService
            }}》</text>
            <text v-if="privacyPolicySwitch && serviceTermsSwitch" style="color: #999999">{{ i18n.and }}</text>
            <text v-if="privacyPolicySwitch" @tap.stop="toTermsOfService('servicePolicy')">《{{ i18n.privacyPolicy
            }}》</text>
          </view>
        </label>
      </view>

    </view>
    <!-- 手机验证码登录 -->
    <view v-if="!isForgetPassword && loginStatus === 1" class="login-form">
      <!-- 手机号 -->
      <view :class="['item', errorTips ? 'error' : '']">
        <view class="account" :style="{ justifyContent: 'unset', background: errorTips === 1 ? '#FBEFEF' : '#fff' }">
          <text class="input-item">+86</text>
          <input v-model="principal" type="number" maxlength="11" data-type="account" placeholder-class="inp-palcehoder"
            :placeholder="i18n.enterMobileNumber" @confirm="login">
        </view>
        <view v-if="errorTips == 1" class="error-text"><text class="warning-icon">!</text>{{ i18n.phoneWarn }}
        </view>
        <view v-if="!principal && errorTips == 8" class="error-text"><text class="warning-icon">!</text>{{ i18n.enterPhone
        }}</view>
        <view v-if="errorTips == 9" class="error-box">
          <view class="error-text">
            {{ i18n.hadBind }}
          </view>
          <image src="@/static/images/icon/icon-prompt.png" style="width:28rpx;height:28rpx;margin-top: 10rpx;"
            mode="heightFix" />
        </view>
      </view>
      <!-- 验证码 -->
      <view :class="['item', errorTips ? 'error' : '']">
        <view class="account">
          <input v-model="validCode" type="number" maxlength="6" placeholder-class="inp-palcehoder"
            :placeholder="i18n.enterCode" @confirm="login">
          <text v-if="show" class="login-code" @tap="getCode">{{ i18n.getCode }}</text>
          <text v-if="!show" class="input-btn">{{ count }} s</text>
        </view>
        <view v-if="errorTips == 3" class="error-text"><text class="warning-icon">!</text>{{ i18n.enterCode }}
        </view>
        <view v-if="errorTips == 6" class="error-text"><text class="warning-icon">!</text>{{ i18n.enterCodeFirst }}
        </view>
      </view>
      <!-- 按钮 -->
      <view>
        <button class="authorized-btn" @tap="login">{{ i18n.login }}</button>
      </view>
      <!-- 服务条款 -->
      <view v-if="serviceTermsSwitch || privacyPolicySwitch" class="item statement">
        <label class="statement-label" @tap.stop="handlePrivacyClick">
          <checkbox class="check-box" :checked="isPrivacy === 1" />
          <view style="color: #999999">
            {{ i18n.regAgree }}
            <text v-if="serviceTermsSwitch" @tap.stop="toTermsOfService('serviceTerms')">《{{ i18n.termsOfService
            }}》</text>
            <text v-if="privacyPolicySwitch && serviceTermsSwitch" style="color: #999999">{{ i18n.and }}</text>
            <text v-if="privacyPolicySwitch" @tap.stop="toTermsOfService('servicePolicy')">《{{ i18n.privacyPolicy
            }}》</text>
          </view>
        </label>
      </view>
    </view>
    <!-- 微信登录 -->
    <view v-if="!isForgetPassword && loginStatus === 2" class="login-form">
      <!-- 按钮 -->
      <view>
        <button v-if="!isPrivacy" class="authorized-btn" @tap="maskBtn">{{ i18n.wechatOneKeyLogin }} </button>
        <button v-else open-type="getPhoneNumber" class="authorized-btn" @getphonenumber="getPhoneNumberLogin">{{
          i18n.wechatOneKeyLogin }}</button>
      </view>
      <!-- 服务条款 -->
      <view v-if="serviceTermsSwitch || privacyPolicySwitch" class="item statement">
        <label class="statement-label" @tap.stop="handlePrivacyClick">
          <checkbox class="check-box" :checked="isPrivacy === 1" />
          <view style="color: #999999">
            {{ i18n.regAgree }}
            <text v-if="serviceTermsSwitch" @tap.stop="toTermsOfService('serviceTerms')">《{{ i18n.termsOfService
            }}》</text>
            <text v-if="privacyPolicySwitch && serviceTermsSwitch" style="color: #999999">{{ i18n.and }}</text>
            <text v-if="privacyPolicySwitch" @tap.stop="toTermsOfService('servicePolicy')">《{{ i18n.privacyPolicy
            }}》</text>
          </view>
        </label>
      </view>
    </view>
    <!-- 修改密码 -->
    <view v-if="isForgetPassword" class="login-form">
      <!-- 手机号 -->
      <view v-if="!nextBtn" :class="['item', errorTips ? 'error' : '']">
        <view class="account">
          <input v-if="!isPersonalCenter" v-model="principal" type="number" placeholder-class="inp-palcehoder"
            :placeholder="i18n.enterPhone" maxlength="11" @confirm="nextStep">
          <view v-else>{{ privacyNumber }}</view>
        </view>
        <view v-if="errorTips == 1" class="error-text"><text class="warning-icon">!</text>{{ i18n.phoneWarn }}
        </view>
        <view v-if="!principal && errorTips == 8" class="error-text"><text class="warning-icon">!</text>{{ i18n.enterPhone
        }}</view>
      </view>
      <!-- 验证码 -->
      <view v-if="!nextBtn" :class="['item', errorTips ? 'error' : '']">
        <view class="account">
          <input v-model="validCode" type="text" class="int-yzm" maxlength="6" placeholder-class="inp-palcehoder"
            :placeholder="i18n.enterCode" @confirm="nextStep">
          <text v-if="show" class="login-code" @tap="getCode">{{
            i18n.getCode
          }}</text>
          <text v-if="!show" class="input-btn">{{ count }} s</text>
        </view>
        <view v-if="errorTips == 3" class="error-text"><text class="warning-icon">!</text>{{ i18n.enterCode }}
        </view>
        <view v-if="errorTips == 6" class="error-text"><text class="warning-icon">!</text>{{ i18n.enterCodeFirst }}
        </view>
      </view>
      <!-- 新密码 -->
      <view v-if="nextBtn" :class="['item', errorTips ? 'error' : '']">
        <view class="account">
          <input type="text" :password="newPasswordType" data-type="0" :value="newPassWord"
            placeholder-class="inp-palcehoder" :placeholder="i18n.enterNew" @input="getPassInputVal"
            @confirm="changePassWord">
          <div class="image-box">
            <image :src="newPasswordImage" style="width:26rpx;height:18rpx" mode="heightFix" @tap="showNewPassword" />
          </div>
        </view>
        <view v-if="errorTips == 4" class="error-text"><text class="warning-icon">!</text>{{ i18n.enterNew }}</view>
        <view v-if="errorTips == 9" class="error-text"><text class="warning-icon">!</text>{{ i18n.passwordVerification }}
        </view>
        <view v-if="errorTips == 10" class="error-text"><text class="warning-icon">!</text>{{ i18n.enterNewPasswordTips }}
        </view>
      </view>
      <!-- 确认密码 -->
      <view v-if="nextBtn" :class="['item', errorTips ? 'error' : '']">
        <view class="account">
          <input type="text" :password="conNewPasswordType" data-type="1" :value="comNewPassWord"
            placeholder-class="inp-palcehoder" :placeholder="i18n.enterNewAgain" @input="getPassInputVal"
            @confirm="changePassWord">
          <div class="image-box">
            <image :src="conNewPasswordImage" style="width:26rpx;height:18rpx" mode="heightFix"
              @tap="showConNewPassword" />
          </div>
        </view>
        <view v-if="errorTips == 5" class="error-text"><text class="warning-icon">!</text>{{ i18n.enterNewAgain }}
        </view>
        <view v-if="errorTips == 7 && !identical" class="error-text"><text class="warning-icon">!</text>{{
          i18n.comparedPassword }}</view>
      </view>

      <view v-if="isForgetPassword && !nextBtn" style="text-align: center;">
        <button class="authorized-btn" @tap="nextStep">
          {{ i18n.nextStep }}
        </button>
        <view v-if="!isPersonalCenter" class="back-login" @tap="goBack">
          {{ i18n.BackLogin }}
        </view>
      </view>
      <view v-if="isForgetPassword && nextBtn" style="text-align: center;">
        <button class="authorized-btn" @tap="changePassWord">
          {{ i18n.confirmChanges }}
        </button>
        <view v-if="!isPersonalCenter" class="back-login" @tap="goBack">
          {{ i18n.BackLogin }}
        </view>
      </view>
    </view>
    <!-- 其他登录方式 -->
    <view v-if="!isForgetPassword" class="footer" :style="{ top: regLocation }">
      <!--  <view class="other-login-text">
        {{ i18n.otherLogMethods }}
      </view> -->
      <view class="other-login">
        <!-- #ifdef MP-WEIXIN -->
        <!-- <view class="other-login-one" @tap="otherLogin(1)">
          <image :src="loginStatus === 0 || loginStatus === 1 ? '../../static/images/icon/weixin.png' :'../../static/images/icon/mobile-phone.png'" mode="heightFix" />
          <view>{{ loginStatus == 0 || loginStatus == 1 ? i18n.wechatLogin : i18n.phoneLogin }}</view>
        </view> -->
        <!-- #endif -->
        <!--  <view class="other-login-two" @tap="otherLogin(2)">
          <image :src="loginStatus === 1 || loginStatus === 2 ? '../../static/images/icon/password.png' :'../../static/images/icon/mobile-phone.png'" mode="heightFix" />
          <view>{{ loginStatus === 1 || loginStatus === 2 ? i18n.accountLogin : i18n.phoneLogin }}</view>
        </view> -->
      </view>
    </view>
  </view>
</template>

<script>
const http = require('../../utils/http')
const util = require('../../utils/util.js')
import { encrypt } from '@/utils/crypto'
import { AppType } from '@/utils/constant'
export default {
  props: {},
  data() {
    return {
      principal: '',
      credentials: '',
      isForgetPassword: false, // 是否修改密码
      isPersonalCenter: false, // 是否从个人中心页面跳转过来
      show: true, // 获取验证码按钮
      // 验证码相关
      validCode: '', // 验证码
      count: '',
      timer: null,
      nextBtn: false, // 修改密码下一步
      newPassWord: '', // 新密码
      comNewPassWord: '', // 确认新密码

      checkRegisterSmsFlag: '', // 校验验证码成功的标识
      errorTips: 0, // 错误提示
      identical: Boolean, // 是否一致
      uniLoginLogoImg: '',
      code: '',
      serviceTermsSwitch: false,
      privacyPolicySwitch: false,
      isPrivacy: uni.getStorageSync('bbcIsPrivacy') || 0,
      passwordType: true,
      passwordImage: '../../static/images/icon/icon-hide.png',
      loginStatus: 2, // 选择的登录方式 0密码、1验证码、2微信
      newPasswordType: true,
      conNewPasswordType: true,
      newPasswordImage: '../../static/images/icon/icon-hide.png',
      conNewPasswordImage: '../../static/images/icon/icon-hide.png',
      appType: uni.getStorageSync('bbcAppType'),
      regLocation: '',
      privacyNumber: ''
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  watch: {
    loginStatus(nv) {
      this.errorTips = 0
      this.validCode = ''
      this.principal = ''
      this.credentials = ''
      const phone = uni.getStorageSync('bbcUserInfo').userMobile || ''
      if (this.isForgetPassword) {
        const pre = phone.substr(0, 3)
        const next = phone.substr(7, 4)
        this.privacyNumber = pre + '****' + next
        this.principal = phone
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options && options.isForgetPassword) {
      this.isForgetPassword = options.isForgetPassword
      uni.setNavigationBarTitle({
        title: this.i18n.changePassword
      })
    }
    if (options && options.isPersonalCenter) {
      this.isPersonalCenter = options.isPersonalCenter
      uni.setNavigationBarTitle({
        title: this.i18n.changePassword
      })
    } else {
      // 头部导航标题
      uni.setNavigationBarTitle({
        title: this.i18n.userLogin
      })
    }
    this.getSwitch()
    this.loginStatus = this.appType === AppType.MINI ? 2 : 1

    this.getConfig()
    // 如果没有 tempUid 重新请求一个
    if (!uni.getStorageSync('bbcTempUid')) util.weChatLogin()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    uni.getSystemInfo({
      success: res => {
        // 根据屏幕高度设置 top 值
        this.regLocation = res.windowHeight - 150 + 'px'
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.isForgetPassword
        ? this.i18n.changePassword
        : this.i18n.userLogin
    })

    // 如果没有tempUid 则先获取
    if (!uni.getStorageSync('bbcTempUid')) {
      // #ifdef H5
      window.history.replaceState({}, '', window.location.href.split('?')[0])
      // #endif
      util.weChatLogin()
    }
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
    // 获取网站配置
    getConfig() {
      const params = {
        url: '/webConfig/getUniWebConfig',
        method: 'GET',
        callBack: res => {
          this.uniLoginLogoImg = res.uniLoginLogoImg || ''
          uni.setStorageSync('bbcUniLoginLogoImg', res.uniLoginLogoImg || '')
          uni.setStorageSync('bbcUniTitleContent', res.uniTitleContent || null)
        }
      }
      http.request(params)
    },
    // #ifdef MP-WEIXIN
    /**
     * 蒙版按钮
     */
    maskBtn() {
      uni.showToast({
        title: this.i18n.agreementTips,
        icon: 'none'
      })
    },

    /**
     * 微信小程序获取手机号一键登录按钮
     */
    getPhoneNumberLogin(e) {
      // 拒绝了授权
      if (!e.detail.code) {
        return
      }
      const params = {
        url: '/ma/login',
        method: 'POST',
        data: {
          code: e.detail.code,
          tempUid: uni.getStorageSync('bbcTempUid')
        },
        callBack: res => {
          if (res.accessToken) {
            uni.setStorageSync('bbcIsPrivacy', 1)
            uni.setStorageSync('bbcHadLogin', true)
            uni.setStorageSync('bbcToken', res.accessToken)
            uni.setStorageSync('bbcLoginResult', res) // 保存整个登录数据
            const expiresTimeStamp = res.expiresIn * 1000 / 2 + new Date().getTime() 
            // 缓存token的过期时间
            uni.setStorageSync('bbcExpiresTimeStamp', expiresTimeStamp)

            // 还原全局 正在登录状态
            getApp().globalData.isLanding = false
            while (getApp().globalData.requestQueue.length) {
              http.request(getApp().globalData.requestQueue.pop())
            }
            // 请求购物车数量
            http.getCartCount()
            uni.redirectTo({
              url: '/package-user/pages/login-success/login-success'
            })
          }
        },
        errCallBack: err => {
          this.loginErrHandle(err)
        }
      }
      http.request(params)
    },
    // #endif

    /**
     * 条款点击事件(勾选/取选)
     */
    handlePrivacyClick() {
      this.isPrivacy = this.isPrivacy === 1 ? 0 : 1
    },

    principalInput() {
      this.principal = this.principal.replace(/\s/g, '')
      this.credentials = this.credentials.replace(/\s/g, '')
      this.setData({
        principal: this.principal,
        credentials: this.credentials
      })
    },

    /**
     * 获取服务条款或隐私策略开关相关配置
     */
    getSwitch: function () {
      const params = {
        url: '/sys/config/info/getSysServiceSwitch',
        method: 'GET',
        callBack: (data) => {
          this.serviceTermsSwitch = data.serviceTermsSwitch
          this.privacyPolicySwitch = data.privacyPolicySwitch
        }
      }
      http.request(params)
    },

    /**
     * 输入框的值
     */
    getInputVal: function (e) {
      const type = e.currentTarget.dataset.type
      // 手机号码
      if (type == 'account') {
        this.setData({
          principal: e.detail.value
        })
        // 密码
      } else if (type == 'password') {
        this.setData({
          credentials: e.detail.value
        })
      }
    },

    getPassInputVal: function (e) {
      var type = e.currentTarget.dataset.type
      if (type == 0) {
        this.newPassWord = e.detail.value
        // 密码由字母加数字或符号至少两种以上字符组成6-20位半角字符，区分大小写
        var reg = new RegExp('^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,20}$')
        const result = reg.test(this.newPassWord)
        if (!result) {
          this.setData({
            errorTips: 9
          })
          return
        } else {
          this.setData({
            errorTips: 0
          })
        }
      } else if (type == 1) {
        if (this.errorTips == 9) {
          this.setData({
            errorTips: 10
          })
          return
        }
        this.comNewPassWord = e.detail.value
        setTimeout(() => {
          if (this.errorTips == 9 || this.errorTips == 10) {
            return
          }
          if (
            this.comNewPassWord &&
            this.newPassWord &&
            this.comNewPassWord != this.newPassWord
          ) {
            this.setData({
              errorTips: 7,
              identical: false
            })
          } else if (!this.comNewPassWord) {
            this.errorTips = 5
          } else {
            this.setData({
              errorTips: 0,
              identical: true
            })
          }
        }, 1000)
      }
    },

    /**
     * 登录
     */
    login() {
      // 密码账号登录
      if (this.loginStatus === 0) {
        this.errorTips = !this.principal.trim() ? 1 : !this.credentials.trim() ? 2 : 0
      }
      // 验证码登录 - 手机号校验
      if (this.loginStatus === 1) {
        this.errorTips = !this.principal.trim() ? 8 : !util.checkPhoneNumber(this.principal) ? 1 : !this.validCode.trim() ? 3 : 0
      }
      if (this.errorTips) return
      if (this.isPrivacy != 1) {
        uni.showToast({
          title: this.i18n.agreementTips,
          icon: 'none'
        })
        return
      }
      const url = uni.getStorageSync('bbcAppType') > AppType.MP ? this.loginStatus === 0 ? '/login' : '/smsLogin' : this.loginStatus === 0 ? '/wx/login' : '/smsLogin'
      const params = {
        url,
        method: 'POST',
        data: {
          passWord: this.loginStatus === 0 ? encrypt(this.credentials) : this.validCode,
          socialType: uni.getStorageSync('bbcAppType'),
          tempUid: uni.getStorageSync('bbcTempUid'),
          userName: this.principal
        },
        callBack: (res) => {
          util.loginSuccess(res.tokenInfo ? res.tokenInfo : res)
        },
        errCallBack: (err) => {
          this.loginErrHandle(err)
        }
      }
      http.request(params)
    },

    /**
     * 登录异常
     */
    loginErrHandle(err) {
      if (err.code === 'A00001' || err.code === 'A00005' || err.code === 'A00006') {
        uni.showToast({
          title: err.msg || 'Error',
          icon: 'none'
        })
      }
      if (err.code === 'A00012') {
        // 还原全局 正在登录状态
        getApp().globalData.isLanding = false
        while (getApp().globalData.requestQueue.length) {
          http.request(getApp().globalData.requestQueue.pop())
          getApp().globalData.currentReqCounts--
        }
        // tempUid 错误，重新获取
        uni.removeStorageSync('bbcTempUid')
        uni.showModal({
          showCancel: false,
          title: this.i18n.tips,
          content: this.i18n.codeErrorTips,
          confirmText: this.i18n.confirm,
          success: res => {
            if (res.confirm) {
              // #ifdef H5
              window.history.replaceState({}, '', window.location.href.split('?')[0])
              // #endif
              util.weChatLogin()
            }
          }
        })
      }
      if (err.code === 'A04002') {
        // 弹窗
        uni.showModal({
          showCancel: false,
          title: this.i18n.bindedTipsTit,
          content: this.i18n.bindedTipsCon,
          confirmText: this.i18n.bindedTipsBtn,
          confirmColor: '#F81A1A'
        })
      }
    },

    /**
     * 回到首页
     */
    toIndex() {
      util.toHomePage()
    },

    /**
     * 去条款页
     */
    toTermsOfService(key) {
      uni.navigateTo({
        url: '/package-user/pages/terms-page/terms-page?sts=' + key
      })
    },
    // 控制密码输入框显隐
    showPassword() {
      this.setData({
        passwordImage: this.passwordType ? '../../static/images/icon/icon-view.png' : '../../static/images/icon/icon-hide.png',
        passwordType: !this.passwordType
      })
    },
    // 控制新密码输入框显隐
    showNewPassword() {
      this.setData({
        newPasswordImage: this.newPasswordType ? '../../static/images/icon/icon-view.png' : '../../static/images/icon/icon-hide.png',
        newPasswordType: !this.newPasswordType
      })
    },
    // 控制确认密码输入框显隐
    showConNewPassword() {
      this.setData({
        conNewPasswordImage: this.conNewPasswordType ? '../../static/images/icon/icon-view.png' : '../../static/images/icon/icon-hide.png',
        conNewPasswordType: !this.conNewPasswordType
      })
    },
    // 其他登录方式
    otherLogin(val) {
      if (val === 1) {
        this.setData({
          loginStatus: this.loginStatus === 0 || this.loginStatus === 1 ? 2 : 1
        })
      } else {
        this.setData({
          loginStatus: this.loginStatus === 1 || this.loginStatus === 2 ? 0 : 1
        })
      }
    },
    /**
     * 修改密码（登录页修改密码按钮）
     */
    forgotPassword() {
      this.setData({
        isForgetPassword: true,
        errorTips: 0,
        principal: '',
        credentials: ''
      })
      uni.setNavigationBarTitle({
        title: this.i18n.changePassword
      })
    },
    // 返回
    goBack() {
      this.setData({
        principal: '',
        errorTips: '',
        newPassWord: '',
        validCode: '',
        comNewPassWord: '',
        isForgetPassword: false,
        nextBtn: false
      })

      uni.setNavigationBarTitle({
        title: this.i18n.userLogin
      })
    },

    /**
     * 获取验证码
     */
    getCode: function () {
      if (!this.principal.trim()) {
        this.errorTips = 8
        return
      }
      // 判断手机号码格式是否正确
      if (!util.checkPhoneNumber(this.principal)) {
        this.setData({
          errorTips: 1
        })
        return
      }
      this.errorTips = 0
      const params = {
        url: this.isForgetPassword ? '/sms/sendUpdatePwdCode' : '/sms/sendLoginCode',
        method: 'POST',
        selfLoading: true,
        data: {
          mobile: this.principal
        },
        callBack: (res) => {
          const timeCount = 60
          if (!this.timer) {
            this.count = timeCount
            this.show = false
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= timeCount) {
                this.count--
              } else {
                clearInterval(this.timer)
                this.timer = null
                this.show = true
              }
            }, 1000)
          }
        }
      }
      http.request(params)
    },

    /**
     *  修改密码（下一步）
     */
    nextStep() {
      if (!this.principal.trim()) {
        this.errorTips = 8
        return
      }
      if (!util.checkPhoneNumber(this.principal)) {
        this.setData({
          errorTips: 1
        })
        return
      }
      if (!this.validCode.trim()) {
        // 请输入验证码
        this.setData({
          errorTips: 3
        })
        return
      }
      this.errorTips = 0
      // 校验验证码
      const params = {
        url: '/user/checkUpdatePwdSms',
        method: 'put',
        data: {
          mobile: this.principal,
          validCode: this.validCode
        },
        callBack: (res) => {
          this.setData({
            checkRegisterSmsFlag: res,
            nextBtn: !this.nextBtn
          })
        }
      }
      http.request(params)
    },
    /**
     * 修改密码(确认按钮)
     */
    changePassWord() {
      if (this.errorTips == 9 || this.errorTips == 10) {
        return
      }
      if (!this.newPassWord) {
        this.setData({
          errorTips: 4
        })
        return
      }
      if (!this.newPassWord.trim()) {
        // uni.showToast({
        // 	title: this.i18n.pwdCantBeEmpty,
        // 	icon: 'none',
        // })
        this.setData({
          errorTips: 10
        })
        return
      }
      if (!this.comNewPassWord) {
        this.setData({
          errorTips: 5
        })
        return
      }
      if (
        this.comNewPassWord &&
        this.newPassWord &&
        this.comNewPassWord != this.newPassWord
      ) {
        this.setData({
          errorTips: 7,
          identical: false
        })
        return
      }
      this.errorTips = 0
      const params = {
        url: '/user/updatePwd',
        method: 'put',
        data: {
          appType: uni.getStorageSync('bbcAppType'), // 应用类型
          checkRegisterSmsFlag: this.checkRegisterSmsFlag, // 校验登陆注册验证码成功的标识
          mobile: this.principal,
          password: encrypt(this.newPassWord),
          validCode: this.validCode,
          validateType: 1 // 验证类型 1验证码验证 2 小程序encryptedData验证 3 密码验证
        },
        callBack: (res) => {
          uni.showToast({
            title: this.i18n.successfullyModified,
            icon: 'none',
            duration: 1500
          })
          setTimeout(() => {
            this.setData({
              isForgetPassword: false
            })
            uni.removeStorageSync('bbcLoginResult')
            uni.removeStorageSync('bbcToken')
            uni.removeStorageSync('bbcRecentSearch')
            util.removeTabBadge()
            // 重置uuid、uuidSession、sessionTimeStamp、step、flowAnalysisLogDto
            uni.setStorageSync('bbcUuid', util.getUuid())
            uni.setStorageSync('bbcUuidSession', util.getUuid())
            uni.setStorageSync('bbcSessionTimeStamp', new Date().getTime())
            uni.setStorageSync('bbcStep', 0)
            uni.setStorageSync('bbcFlowAnalysisLogDto', '')
            uni.redirectTo({
              url: '/pages/user-login/user-login'
            })
          }, 1500)
        }
      }
      http.request(params)
    }
  }
}
</script>
<style>
@import "./user-login.css";
</style>
