<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <!-- 用户信息栏 -->
    <view class="banner">
      <view class="bg">
        <view class="user-information">
          <view class="user-info-box">
            <!-- 头像 -->
            <view class="user-head-portrait">
              <image :src=" distInfo.pic ? distInfo.pic : '/static/images/icon/head04.png' " @error="imageError(distInfo,'pic')" />
            </view>
            <view class="right">
              <!-- 用户名 -->
              <view class="username">
                {{ distInfo.nickName }}
              </view>
              <view class="notice" data-dist="true" @tap="toNotice">
                <!-- 小喇叭 -->
                <view class="notice-icon">
                  <image src="../../static/images/icon/notice1.png" />
                </view>
                <!-- 公告 -->
                <view v-if="!disNotice.length" class="notice-txt">{{ i18n.noAnnouncement }}</view>
                <!-- 有公告的时候轮播 -->
                <block v-if="disNotice.length > 0">
                  <swiper
                    circular="true"
                    vertical="true"
                    autoplay="true"
                    duration="1000"
                    class="swiper-cont"
                  >
                    <block v-for="(item, index) in disNotice" :key="index">
                      <swiper-item class="items">{{
                        item.msgTitle
                      }}</swiper-item>
                    </block>
                  </swiper>
                </block>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="card">
        <view class="content">
          <view class="content-top">
            <view class="item">
              <view class="income-money">
                {{ toPrice(settledAmount) }}
              </view>
              <view class="income-text">
                {{ i18n.myBalance }}
              </view>
            </view>
            <view class="item">
              <view class="income-money">
                {{ toPrice(addupAmount) }}
              </view>
              <view class="income-text">
                {{ i18n.totalIncome }}
              </view>
            </view>
          </view>
          <view class="content-buttom">
            <view class="draw-btn-left" @tap="toWithdrawal">
              <view class="btn-text" style="background-color: #F81A1A">{{ i18n.withdrawalsNow }}</view>
            </view>
            <view class="draw-btn-right" @tap="toWalletCashPage">
              <view class="btn-text">{{ i18n.withdrawalsRecord }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 分销业务栏 -->
    <view class="lists">
      <view class="list-item" @tap="toPromotionProdPage">
        <view class="icon">
          <image src="../../static/images/icon/list1.png" wid />
        </view>
        <view class="item-text">
          <view class="item-text-title">
            {{ i18n.promoteGoods }}
          </view>
          <view class="item-text-desc">
            {{ i18n.distributionWinWin }}
          </view>
        </view>
      </view>
      <view class="list-item" @tap="toInvitationCards">
        <view class="icon">
          <image src="../../static/images/icon/list2.png" wid />
        </view>
        <view class="item-text">
          <view class="item-text-title">
            {{ i18n.inviteFriends }}
          </view>
          <view class="item-text-desc">
            {{ i18n.promoteRewards }}
          </view>
        </view>
      </view>
    </view>

    <!-- 列表 -->
    <view class="sorting-menu">
      <view class="menu-cont">
        <view class="menu-cont-list" @tap="toMyFriendsPage">
          <view class="icon">
            <image src="../../static/images/icon/my-friends.png" mode="widthFix" />
          </view>
          <view class="list-title">{{ i18n.myFriends }}</view>
          <text class="arrow" />
        </view>
        <view class="menu-cont-list" @tap="toMyUserPage">
          <view class="icon">
            <image src="../../static/images/icon/menu_4.png" mode="widthFix" />
          </view>
          <view class="list-title">{{ i18n.myUser }}</view>
          <text class="arrow" />
        </view>
        <view class="menu-cont-list" @tap="toPromotionOrderPage">
          <view class="icon">
            <image src="../../static/images/icon/menu_2.png" mode="widthFix" />
          </view>
          <view class="list-title">{{ i18n.myPromotion }}</view>
          <text class="arrow" />
        </view>
        <view class="menu-cont-list" @tap="toIncomeDetailsPage">
          <view class="icon">
            <image src="../../static/images/icon/menu_3.png" mode="widthFix" />
          </view>
          <view class="list-title">{{ i18n.incomeBreakdown }}</view>
          <text class="arrow" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const http = require('../../../utils/http.js')

export default {
  components: {},
  props: {},
  data() {
    return {
      unsettledAmount: 0,
      // 待结算金额
      settledAmount: 0,
      // 可提现金额
      invalidAmount: 0,
      // 已失效金额
      addupAmount: 0,
      // 累计收益
      disNotice: [],
      // 分销公告
      distInfo: {}
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
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.distributioncenter
    })
    // 分销员信息
    this.getDisInfo()
    // 分销钱包数据
    this.getDisInfoData()
    // 获取分销公告
    this.getDistributionMsg()
  },
  methods: {
    /**
     * 获取分销员信息
     */
    getDisInfo() {
      http.request({
        url: '/p/distribution/user/distributionUserInfo',
        method: 'GET',
        callBack: (res) => {
          if (res.state === -1) {
            uni.showModal({
              title: '',
              showCancel: false,
              content: this.i18n.distributorBanned,
              confirmText: this.i18n.confirm,
              confirmColor: '#eb2444',

              success(res) {
                if (res.confirm) {
                  uni.switchTab({
                    url: '/pages/user/user'
                  })
                }
              }
            })
          }

          if (res.state === 2) {
            uni.showToast({
              title: this.i18n.distributorCleared,
              icon: 'none',
              // #ifndef MP-TOUTIAO
              mask: true
              // #endif
            })
            uni.showModal({
              title: '',
              content: this.i18n.distributorCleared,
              confirmText: this.i18n.confirm,
              confirmColor: '#eb2444',
              showCancel: false,
              success(res) {}
            })
          }
          this.distInfo = res
        }
      })
    },
    // 跳转到分销员等级页面
    toSalesmanLevel() {
      uni.navigateTo({
        url: '/package-distribution/pages/salesman-level/salesman-level'
      })
    },

    // 跳转到公告页面
    toNotice() {
      if (this.disNotice.length > 0) {
        uni.navigateTo({
          url: '/package-user/pages/recent-news/recent-news?isDist=' + true
        })
      }
    },

    // 获取分销公告
    getDistributionMsg: function() {
      var ths = this
      const params = {
        url: '/p/distribution/msg/page',
        method: 'GET',
        data: {
          // current: 1,
          isTop: '' // size: 10
        },
        callBack: (res) => {
          ths.setData({
            disNotice: res.records
          })
        }
      }
      http.request(params)
    },

    /**
     * 获取用户钱包数据
     */
    getDisInfoData: function() {
      const ths = this
      const params = {
        url: '/p/distribution/user/info',
        method: 'GET',
        callBack: (res) => {
          this.setData({
            settledAmount: res.distributionUserWallet.settledAmount,
            addupAmount: res.distributionUserWallet.addupAmount
          })
        },
        errCallBack: (res) => {
          uni.showModal({
            title: ths.i18n.tips,
            content: res.data,
            showCancel: false,
            confirmText: ths.i18n.confirm,
            success: function(res) {
              if (res.confirm) {
                uni.switchTab({
                  url: '/pages/user/user'
                })
              }
            }
          })
        }
      }
      http.request(params)
    },

    /**
     * 跳转收入明细
     */
    toIncomeDetailsPage: function() {
      uni.navigateTo({
        url: '/package-distribution/pages/income-details/income-details'
      })
    },

    /**
     * 跳转提现记录
     */
    toWalletCashPage: function() {
      uni.navigateTo({
        url: '/package-distribution/pages/take-notes/take-notes'
      })
    },

    /**
     * 跳转提现规则
     */
    toWalletCashRulePage: function() {
      uni.navigateTo({
        url: '/package-distribution/pages/draw-rule/draw-rule'
      })
    },

    /**
     * 跳转到我的好友页面
     */
    toMyFriendsPage: function() {
      uni.navigateTo({
        url: '/package-distribution/pages/my-friends/my-friends'
      })
    },

    /**
     * 跳转至我的用户
     */
    toMyUserPage: function() {
      uni.navigateTo({
        url: '/package-distribution/pages/my-users/my-users'
      })
    },

    /**
     * 跳转我的推广界面
     */
    toPromotionOrderPage: function() {
      uni.navigateTo({
        url: '/package-distribution/pages/promotion-order/promotion-order'
      })
    },

    /**
     * 跳转我的推广商品
     */
    toPromotionProdPage: function() {
      uni.navigateTo({
        url: '/package-distribution/pages/promotion-prod/promotion-prod'
      })
    },

    /**
     * 跳转到邀请好友页面
     */
    toInvitationCards: function() {
      uni.navigateTo({
        url: '/package-distribution/pages/invitation-cards/invitation-cards'
      })
    },

    /**
     * 跳转到提现
     */
    toWithdrawal: function() {
      uni.navigateTo({
        url: '/package-distribution/pages/withdrawal/withdrawal'
      })
    },

    /*
				跳转到分销员列表，已写好入口，等待对接
			*/
    toDistributorListPage: function() {}
  }
}
</script>
<style>
@import "./dis-center.css";
</style>
