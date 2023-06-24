<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 购买会员页面 -->
  <view class="Mall4j buy-vip-container">
    <!-- 用户信息 -->
    <view class="top-bg">
      <view class="member-info">
        <view class="head-portrait">
          <image
            :src="
              userInfo.pic ? userInfo.pic : '/static/images/icon/head04.png'
            "
            @error="imageError(userInfo,'pic')"
          />
        </view>
        <view class="text-box">
          <view class="name-box">
            <text class="name">{{ userInfo.nickName }}</text>
            <view v-if="userLevelInfo.userLevel" class="level">
              <image
                class="l-bg"
                :src="
                  userLevelInfo.levelType == 1
                    ? '/static/images/icon/integral-icon.png'
                    : '/static/images/icon/normal-icon.png'
                "
                role="img"
              />
              <view class="text">{{
                userLevelInfo.userLevel.level == 0
                  ? i18n.ordinaryMembership
                  : userLevelInfo.levelName
              }}</view>
            </view>
          </view>
          <!-- <view class="date">{{
            userLevelInfo.levelType == 1
              ? userLevelInfo.endTime + i18n.expire
              : i18n.notPayingMember
          }}</view> -->
        </view>
      </view>
    </view>
    <!-- /用户信息 -->

    <!-- swiper-会员套餐 -->
    <view class="vip-card-wrapper">
      <swiper
        class="pic-swiper"
        :duration="duration"
        previous-margin="20rpx"
        next-margin="70rpx"
        :current="selectPremiumVipIndex"
        @change="selectVip"
      >
        <block v-for="(item, id) in premiumVipList" :key="id">
          <swiper-item class="banner-item">
            <view class="card-box">
              <view class="banner">
                <view class="card-face">
                  <ImgShow :src="item.img" :classList="['vip-pic']" />
                  <view
                    :class="
                      'level-mark  ' +
                        (currentLevelId == item.id ? '' : 'white-bg')
                    "
                  >{{
                    currentLevelId == item.id
                      ? i18n.current
                      : i18n.notPurchased
                  }}</view>
                  <view class="vip-info">
                    <view class="vip-level">{{ item.levelName }}</view>
                    <view class="vip-price">
                      ￥<text class="amount">{{ item.needAmount }}</text> /
                      <!-- {{ item.term}} -->
                      {{
                        [
                          "",
                          i18n.day,
                          i18n.week,
                          i18n.month,
                          i18n.season,
                          i18n.year,
                        ][item.termType]
                      }}
                    </view>
                  </view>
                  <view class="vip-level-progress">
                    <view v-if="item.needGrowth > 0" class="level-tips">
                      <text>{{ i18n.growthValueUp }} {{ item.needGrowth }}
                        {{ i18n.readyToBuy }}</text>
                      <progress
                        class="level-progress"
                        :percent="
                          item.needGrowth > 0
                            ? (currentGrowth / item.needGrowth) * 100
                            : 0
                        "
                        backgroundColor="#feeee0"
                        activeColor="#9e642e"
                        active="true"
                        border-radius="8"
                        stroke-width="4"
                      />
                      <view class="level-span">
                        <text
                          v-if="
                            userLevelInfo.levelType == 1 &&
                              userLevelInfo.userLevel.level <=
                              selectPremiumVip.level
                          "
                        >{{ userLevelInfo.userLevel.levelName }}</text>
                        <text>{{ item.levelName }}</text>
                      </view>
                    </view>
                    <view
                      class="level-text"
                    >{{ i18n.currentGrowthValue }}
                      {{ userLevelInfo.growth }}</view>
                  </view>
                </view>
              </view>
            </view>
          </swiper-item>
        </block>
      </swiper>
      <!-- /swiper-会员套餐 -->

      <!-- 会员权益 -->
      <view class="vip-rights-container">
        <view class="member-tit">
          <view class="text">{{ i18n.VIPLevelRights }}</view>
        </view>
        <view v-if="selectPremiumVip.userRights" class="rights-item-con">
          <block
            v-for="(item, rightsId) in selectPremiumVip.userRights"
            :key="rightsId"
          >
            <view class="rights-item">
              <view class="rights-img">
                <ImgShow imgMode="heightFix" :src="item.icon" />
              </view>
              <view class="rights-tit">{{ item.rightsName }}</view>
              <view class="rights-desc">{{ item.description }}</view>
            </view>
          </block>
          <view v-if="selectPremiumVip.userRights.length === 0" class="noInterests">{{ i18n.noInterests }}</view>
        </view>
      </view>
      <!-- /会员权益 -->
    </view>

    <!-- 底部按钮 -->
    <view class="bottom">
      <view class="bottom-item">
        <view class="vip-price">
          <text class="vip-total-balck">{{ i18n.totalPrice }}：</text>
          <text class="symbol">￥</text>
          <text class="amount pay-amount">{{
            selectPremiumVip.needAmount
          }}</text>/
          <!-- {{ selectPremiumVip.term}} -->
          {{
            ["", i18n.day, i18n.week, i18n.month, i18n.season, i18n.year][
              selectPremiumVip.termType
            ]
          }}
        </view>
      </view>
      <view
        v-if="userLevelInfo.userLevel"
        :class="[
          'bottom-item',
          'sub-btn',
          (userLevelInfo.levelType == 0 &&
            currentGrowth >= selectPremiumVip.needGrowth) ||
            (userLevelInfo.levelType == 1 &&
              currentGrowth >= selectPremiumVip.needGrowth &&
              userLevelInfo.userLevel.level <= selectPremiumVip.level)
            ? 'btn'
            : 'btn-gray',
        ]"
        @tap="buyNow"
      >{{ i18n.buyNow }}</view>
    </view>
    <!-- 购买会员弹出层:支付类型选择 -->
    <view v-if="popupShow" class="popup-hide" @tap="closePopup">
      <view class="popup-box radius" @tap.stop>
        <view class="popup-tit radius">
          <text>{{ i18n.choosePaymentMethod }}</text>
          <text class="close" @tap="closePopup" />
        </view>
        <view class="popup-cnt pay-way">
          <!-- 支付方式选择器组件 -->
          <PaymentMethodSelector
            :pay-type-str="payTypeStr"
            :total-balance="totalBalance"
            @setPayType="setPayType"
          />
          <view class="sure-pay" @tap="toPay">{{ i18n.determinePayment }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import PaymentMethodSelector from '../../../components/payment-method-selector/index.vue'
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')
import { PayType } from '../../../utils/constant.js'
import Pay from '../../../utils/pay.js'
export default {
  components: {
    PaymentMethodSelector
  },
  props: {},
  data() {
    return {
      payTypeStr: 'aliPay',
      payType: PayType.ALIPAY_H5, // 支付类型，默认支付宝
      PayTypeConstant: PayType, // 支付类型常量
      popupShow: false,
      duration: 1000,
      totalBalance: null,
      userInfo: {},
      userLevelInfo: {},
      // 当前会员信息
      premiumVipList: [],
      // 付费会员等级列表
      currentLevelId: 0,
      selectPremiumVip: {},
      currentGrowth: '',
      selectPremiumVipIndex: '',
      // 当前选择的付费会员id
      selectPremiumVipId: 0
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
    // 初始化支付类型数据
    this.payType = util.initPayType().payType
    this.payTypeStr = util.initPayType().payTypeStr
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({})
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.membershipCentre
    })

    // 获取会员信息
    this.getUserLevelInfo()
    // 获取年费会员列表
    this.getPayMemberList()
    // 获取用户信息
    this.queryUserInfo()
    // 获取用户余额
    this.queryCurrentBalance()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  methods: {
    /**
     * 设置支付类型
     */
    setPayType(paymentInfo) {
      this.payType = paymentInfo.payType
      this.payTypeStr = paymentInfo.payTypeStr
    },

    /**
     * 关闭支付类型选择弹窗
     */
    closePopup: function() {
      this.popupShow = false
    },

    /**
     * 获取用户信息
     */
    queryUserInfo: function() {
      const params = {
        url: '/p/user/userInfo',
        method: 'GET',
        data: {},
        callBack: (res) => {
          this.setData({
            userInfo: res
          })
        }
      }
      http.request(params)
    },

    /**
     * 获取用户当前余额
     */
    queryCurrentBalance: function() {
      const params = {
        url: '/p/user/getUserInfo',
        method: 'GET',
        data: {},
        callBack: (res) => {
          this.totalBalance = res.totalBalance
        }
      }
      http.request(params)
    },

    /**
     * 获取当前会员信息
     */
    getUserLevelInfo() {
      const params = {
        url: '/p/score/scoreLevel/page',
        method: 'GET',
        data: {
          levelType: 0
        },
        callBack: (res) => {
          if (res.endTime) {
            res.endTime = res.endTime.split(' ')[0]
          }
          // 国际化
          if (res.userLevel) {
            const lang = uni.getStorageSync('bbcLang') || 'zh_CN'
            let levelNameCn, levelNameEn
            res.userLevel.userLevelLangList.map(val => {
              if (val.lang === 0) levelNameCn = val.levelName
              if (val.lang === 1) levelNameEn = val.levelName
            })
            res.levelName = lang === 'zh_CN' ? levelNameCn : levelNameEn || levelNameCn
          }
          this.setData({
            userLevelInfo: res, // 非付费会员等级
            currentLevelId: res.userLevel.id,
            currentGrowth: res.growth
          })
        }
      }
      http.request(params)
    },

    /**
     * 获取年费会员列表
     */
    getPayMemberList() {
      const params = {
        url: '/p/score/scoreLevel/page',
        method: 'GET',
        data: {
          levelType: 1
        },
        callBack: (res) => {
          // 国际化
          this.getVipInternationalization(res.userLevels)
          this.premiumVipList = res.userLevels
          let flag = false
          for (let i = 0; i < res.userLevels.length; i++) {
            const el = res.userLevels[i]
            if (el.id == this.selectPremiumVipId) {
              this.selectPremiumVip = el
              this.selectPremiumVipId = el.id
              this.selectPremiumVipIndex = i
              flag = true
              break
            }
          }
          if (!flag) {
            this.selectPremiumVip = res.userLevels[0]
            this.selectPremiumVipId = res.userLevels[0].id
            this.selectPremiumVipIndex = 0
            this.popupShow = false
          }
        }
      }
      http.request(params)
    },

    /**
     * 立即购买- 根据当前付费会员id
     */
    buyNow() {
      // 成长值不足
      if (this.currentGrowth < this.selectPremiumVip.needGrowth) {
        uni.showToast({
          title: this.i18n.growthValueTips,
          icon: 'none'
        })
        return
      }
      // 已有付费会员时购买低级付费会员
      if (
        this.userLevelInfo.levelType == 1 &&
        this.userLevelInfo.userLevel.level > this.selectPremiumVip.level
      ) {
        uni.showToast({
          title: this.i18n.cannotBuyLower,
          icon: 'none'
        })
        return
      }

      // 已有付费会员时购买(同级或更高级)付费会员
      if (
        this.userLevelInfo.levelType == 1 &&
        this.userLevelInfo.userLevel.level < this.selectPremiumVip.level
      ) {
        uni.showModal({
          title: this.i18n.tips,
          content:
            this.i18n.upgradeMemberTips1 +
            this.userLevelInfo.userLevel.levelName +
            ',' +
            this.i18n.upgradeMemberTips2 +
            this.selectPremiumVip.levelName +
            ',' +
            this.i18n.upgradeMemberTips3,
          cancelText: this.i18n.cancel,
          confirmText: this.i18n.confirm,
          success: (res) => {
            if (res.confirm) {
              this.popupShow = true
            }
          }
        })
        return
      }
      this.popupShow = true
    },

    // 去支付 - 购买会员
    toPay: function() {
      if (this.payType == 9) {
        uni.showModal({
          title: this.i18n.tips,
          content: this.i18n.confirmBalancePay,
          showCancel: true, // 是否显示取消按钮
          cancelText: this.i18n.cancel,
          confirmText: this.i18n.confirm,
          success: (res) => {
            if (res.confirm) {
              // 点击确定
              Pay.toOrderPay(
                this.payType,
                '',
                '',
                '',
                this.selectPremiumVip.id
              )
            } else if (res.cancel) {
              console.log('用户点击取消')
              uni.showToast({
                title: this.i18n.cancelBalancePay,
                icon: 'none',
                duration: 1500
              })
            }
          }
        })
        return
      }
      Pay.toOrderPay(this.payType, '', '', '', this.selectPremiumVip.id)
    },

    /**
     * 切换轮播图
     */
    selectVip(e) {
      this.setData({
        selectPremiumVipIndex: e.detail.current,
        selectPremiumVip: this.premiumVipList[e.detail.current],
        selectPremiumVipId: this.premiumVipList[e.detail.current].id
      })
    },
    // 国际化
    getVipInternationalization(data) {
      const lang = uni.getStorageSync('bbcLang') || 'zh_CN'
      if (!data) return
      data.map(element => {
        let levelNameCn, levelNameEn
        element.userLevelLangList.map(val => {
          if (val.lang === 0) levelNameCn = val.levelName
          if (val.lang === 1) levelNameEn = val.levelName
        })
        element.userRights.map(val => {
          let rightsNameCn, rightsNameEn, descriptionCn, descriptionEn
          val.userRightsLangList.map(val2 => {
            if (val2.lang === 0) {
              rightsNameCn = val2.rightsName
              descriptionCn = val2.description
            }
            if (val2.lang === 1) {
              rightsNameEn = val2.rightsName
              descriptionEn = val2.description
            }
          })
          val.rightsName = lang === 'zh_CN' ? rightsNameCn : rightsNameEn || rightsNameCn
          val.description = lang === 'zh_CN' ? descriptionCn : descriptionEn || descriptionCn
        })
        element.levelName = lang === 'zh_CN' ? levelNameCn : levelNameEn || levelNameCn
      })
    }

  }
}
</script>
<style>
@import "./buy-vip.css";
</style>
