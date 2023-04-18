<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 会员中心 -->
  <view class="Mall4j member-index">
    <!-- 会员信息 -->
    <view class="member-msg">
      <view class="member-container">
        <image
          src="../../static/images/icon/memberLevelBg.png"
          :class="'m-bg ' + (isSmallScreen ? 'small-screen' : '')"
        />
        <view class="member-info">
          <view class="member-info-top">
            <view class="user-info">
              <image
                class="user-avatar"
                :src="userInfo.pic ? userInfo.pic : '/static/images/icon/head04.png'"
                @error="userInfo.pic=''"
              />
              <view class="user-nickname">
                <view class="nickname">{{ memberInfo.nickName }}</view>
              </view>
            </view>
            <view class="user-level">
              <text v-if="memberInfo.userLevel">{{
                memberInfo.userLevel.levelName
              }}</text>
            </view>
          </view>

          <view class="member-info-bottom">
            <view class="vip-level-progress">
              <view class="level-tips">
                <text v-if="currentGrowthFull">{{
                  i18n.currentGrowthFull
                }}</text>
                <text
                  v-else
                >{{ i18n.upgradeStillNeeded }} {{ upgradeNeedGrowth }}
                  {{ i18n.growthValue }}</text>
                <progress
                  class="level-progress"
                  :percent="percent"
                  backgroundColor="#feeee0"
                  activeColor="#9e642e"
                  active="true"
                  border-radius="8"
                  stroke-width="4"
                />
                <view class="level-span">
                  <text v-if="memberInfo.userLevel">{{
                    memberInfo.userLevel.levelName
                  }}</text>
                  <text>{{ memberInfo.nextLevelName }}</text>
                </view>
              </view>
              <view
                v-if="memberInfo.nextGrowth"
                class="level-text"
              >{{ i18n.growthValue }} {{ memberInfo.growth }} /
                {{ memberInfo.nextGrowth }}</view>
              <view
                v-else
                class="level-text"
              >{{ i18n.growthValue }} {{ memberInfo.growth }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- /会员信息 -->

    <!-- 会员成长说明 -->
    <view v-if="memberInfo.levelType != 1" class="member-growth">
      <view class="member-tit">
        <view class="text">{{ i18n.memberGrowthDescription }}</view>
      </view>
      <!-- 成长值 -->
      <view class="growth-value">
        <view class="value-table">
          <view class="tr">
            <view class="td-left th">{{ i18n.grade }}</view>
            <view class="td-right th">{{ i18n.correspondingGrowthValue }}</view>
          </view>
          <view v-for="(item, id) in userLevels" :key="id" class="tr">
            <view class="td-left">{{ item.levelName }}</view>
            <view class="td-right">{{ item.needGrowth }}</view>
          </view>
        </view>
      </view>
      <!-- 成长值 -->
    </view>
    <!-- /会员成长说明 -->

    <!-- vip专属权益 -->
    <view class="member-growth member-rights">
      <view class="member-tit">
        <view class="text">{{ i18n.exclusiveMembers }}</view>
        <text
          class="more-rights"
          @tap="toogleShowRights"
        >{{ i18n.moreInterests }}></text>
      </view>
      <view v-if="userLevel" class="rights-container">
        <block
          v-for="(right, rightsId) in userLevel.userRights"
          :key="rightsId"
        >
          <view class="right-item">
            <view class="right-lf">
              <ImgShow :src="right.icon" img-mode="widthFix" />
            </view>
            <view class="right-rt">
              <view class="right-tit">{{ right.rightsName }}</view>
              <view class="right-desc">{{ right.description }}</view>
            </view>
          </view>
        </block>
      </view>
    </view>
    <!-- /vip专属权益 -->

    <!-- 弹窗Swiper -->
    <view v-if="showRights" class="swiperPop">
      <view v-if="showRights" class="mask" @tap="toogleShowRights">
        <view class="close">
          <image src="/static/images/icon/close-white.png" />
        </view>
      </view>
      <swiper
        indicator-dots
        indicator-active-color="#fff"
        indicator-color="rgba(255,255,255,.2)"
        :duration="duration"
        next-margin="20rpx"
        previous-margin="50rpx"
      >
        <block v-for="(levelItem, id) in userLevels" :key="id">
          <swiper-item class="member-item">
            <view class="swiper-box">
              <view class="top-bg">
                <ImgShow :src="levelItem.img" :classList="['member-bg']" />
                <view class="top-con">
                  <view class="member-title">{{ levelItem.levelName }}</view>
                  <view
                    class="member-desc"
                  >{{ levelItem.userRights.length }} {{ i18n.itemXiang }}
                    <text class="member-desc-text">{{ i18n.exclusiveMembers }}</text></view>
                </view>
              </view>
              <view class="rights-item-con">
                <block
                  v-for="(right, rightsId) in levelItem.userRights"
                  :key="rightsId"
                >
                  <view class="rights-item">
                    <view class="rights-img">
                      <ImgShow :src="right.icon" img-mode="heightFix" />
                    </view>
                    <view class="rights-tit">{{ right.rightsName }}</view>
                    <view class="rights-desc">{{ right.description }}</view>
                  </view>
                </block>
                <view v-if="levelItem.userRights.length === 0" class="noInterests">{{ i18n.noInterests }}</view>
              </view>
            </view>
          </swiper-item>
        </block>
      </swiper>
    </view>
    <!-- /弹窗Swiper -->
  </view>
</template>

<script>
const http = require('../../../utils/http')
export default {
  components: {},
  props: {},
  data() {
    return {
      interval: 2000,
      duration: 1000,
      showRights: false,
      memberInfo: {},
      userInfo: {},
      userLevels: [],
      userLevel: [],
      percent: 0,
      isSmallScreen: false, // 是否小屏幕(高度低于568: 如iphone5)
      currentGrowthFull: false, // 当前成长值已满
      upgradeNeedGrowth: 0 // 升级仍需成长值
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    },
    lang() {
      return uni.getStorageSync('bbcLang') || 'zh_CN'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    uni.getSystemInfo({
      success: (res) => {
        this.isSmallScreen = res.screenHeight <= 568
      }
    })
    // 获取用户信息
    this.userInfo = uni.getStorageSync('bbcUserInfo')
    // 获取当前会员信息
    this.getMemberInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 设置头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.membershipCentre
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  methods: {
    /**
     * 跳转
     */
    routeTo(e) {
      const path = e.currentTarget.dataset.path

      if (path == 'scoreDet') {
        uni.navigateTo({
          url: '/pages/integral-detail/integral-detail'
        })
      }
    },

    /**
     * 获取用户当前会员信息
     */
    getMemberInfo() {
      const params = {
        url: '/p/score/scoreLevel/page',
        method: 'GET',
        data: {
          levelType: 0
        },
        callBack: (res) => {
          const percent =
            res.nextGrowth > 0
              ? res.growth / res.nextGrowth
              : (res.nextGrowth === 0 && res.growth === 0) ||
                res.growth > res.nextGrowth
                ? 100
                : 0
          const currentGrowthFull = res.growth >= res.nextGrowth
          const upgradeNeedGrowth = res.nextGrowth
            ? res.nextGrowth - res.growth
            : 0

          // 国际化
          this.getVipInternationalization(res.userLevels)
          this.International(res.userLevel.userRights)

          this.setData({
            memberInfo: res,
            userLevel: res.userLevel,
            userLevels: res.userLevels,
            percent: percent,
            currentGrowthFull: currentGrowthFull,
            upgradeNeedGrowth: upgradeNeedGrowth
          })
        }
      }
      http.request(params)
    },

    /**
     * 显/隐更多权益
     */
    toogleShowRights() {
      this.setData({
        showRights: !this.showRights
      })
    },
    // 更多权益国际化
    getVipInternationalization(data) {
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
          val.rightsName = this.lang === 'zh_CN' ? rightsNameCn : rightsNameEn || rightsNameCn
          val.description = this.lang === 'zh_CN' ? descriptionCn : descriptionEn || descriptionCn
        })
        element.levelName = this.lang === 'zh_CN' ? levelNameCn : levelNameEn || levelNameCn
      })
      return data
    },
    /**
     * 会员专属权益列表国际化
     */
    International(arr) {
      if (!arr || arr.length === 0) return
      arr.map(item => {
        // 没有英文名，默认是中文名
        if (item.userRightsLangList[0].rightsName) item.rightsName = item.userRightsLangList[0].rightsName
        if (item.userRightsLangList[0].description) item.description = item.userRightsLangList[0].description
        if (this.lang !== 'zh_CN') {
          // en
          if (item.userRightsLangList[1].rightsName) item.rightsName = item.userRightsLangList[1].rightsName
          if (item.userRightsLangList[1].description) item.description = item.userRightsLangList[1].description
        }
      })
    }
  }
}
</script>
<style>
@import "./member-center.css";
</style>
