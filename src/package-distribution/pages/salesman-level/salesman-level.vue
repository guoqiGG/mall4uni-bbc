<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j">
    <!-- 分销员等级 -->
    <!-- 头部等级展示 -->
    <view class="top-wrapper">
      <view class="toplevelshow">
        <view class="level-txt">{{ levelName }}</view>
        <view class="level-progress">
          <view
            v-for="(item, index) in levelInfo"
            :key="index"
            :class="(level == index ? 'current-level' : '') + ' level-block'"
            :data-index="index"
            @tap="clinkLevel"
          >
            <view :class="'square-block ' + (clickLevel == index ? 'current-bg' : '')" />
            <view :class="'level-block-txt ' + (clickLevel == index ? 'current-color' : '')">{{ item.name }}</view>
          </view>
          <view class="line" />
        </view>
      </view>

    </view>

    <!-- 等级规则 -->
    <view class="rules-wrapper">
      <view class="riles-title">
        <view class="horizontal" />
        <view class="riles-title-txt">{{ i18n.hierarchicalRules }}</view>
        <view class="horizontal" />
      </view>

      <view
        v-for="(rank, index) in levelInfo"
        :key="index"
        :class="'introduction-rules ' + (clickLevel == index ? 'current-rules':'')"
      >
        <view class="intro-level-tit">
          <view class="salesman">{{ rank.name }}</view>
        </view>
        <view class="intron-rule">
          <view class="rule-desc-tit">
            <view class="intro-icon">
              <image src="../../static/images/icon/inviolable-rights.png" />
            </view>
            <view class="intro-title">{{ i18n.introductionUpgradeRules }}</view>
          </view>

          <view class="condition-box">
            <view class="condition">
              <view v-if="rank.levelSetConditionsSwitch.addupAmount" class="intro-detailed">
                <view class="triangle" />{{ i18n.upgradeRules1 }}<text>￥{{ toPrice(rank.distributionLevelConditionDataVO.addupAmount) }}</text>
              </view>
              <view v-if="rank.levelSetConditionsSwitch.boundCustomers" class="intro-detailed">
                <view class="triangle" />{{ i18n.upgradeRules2 }}<text>{{ rank.distributionLevelConditionDataVO.boundCustomers }}</text>{{ i18n.people }}
              </view>
              <view v-if="rank.levelSetConditionsSwitch.invitedVeeker" class="intro-detailed">
                <view class="triangle" />{{ i18n.upgradeRules3 }}<text>{{ rank.distributionLevelConditionDataVO.invitedVeeker }}</text>{{ i18n.people }}
              </view>
              <view v-if="rank.levelSetConditionsSwitch.invitedCustomers" class="intro-detailed">
                <view class="triangle" />{{ i18n.upgradeRules4 }}<text>{{ rank.distributionLevelConditionDataVO.invitedCustomers }}</text>{{ i18n.people }}
              </view>
              <view v-if="rank.levelSetConditionsSwitch.payNumber" class="intro-detailed">
                <view class="triangle" />{{ i18n.upgradeRules5 }}<text>{{ rank.distributionLevelConditionDataVO.payNumber }}</text>{{ i18n.piecesBi }}
              </view>
              <view v-if="rank.levelSetConditionsSwitch.sumOfConsumption" class="intro-detailed">
                <view class="triangle" />{{ i18n.upgradeRules6 }}<text>￥{{ toPrice(rank.distributionLevelConditionDataVO.sumOfConsumption) }}</text>
              </view>
              <view v-if="rank.levelSetConditionsSwitch.successOrderNumber" class="intro-detailed">
                <view class="triangle" />{{ i18n.upgradeRules7 }}<text>{{ rank.distributionLevelConditionDataVO.successOrderNumber }}</text>{{ i18n.piecesBi }}
              </view>
              <view v-if="rank.levelSetConditionsSwitch.successTradingVolume" class="intro-detailed">
                <view class="triangle" />{{ i18n.upgradeRules8 }}<text>￥{{ toPrice(rank.distributionLevelConditionDataVO.successTradingVolume) }}</text>
              </view>
            </view>
          </view>

          <view v-if="rank.distributionLevelConditionDataVO.commodity.length" class="buyprod">
            <view class="buy-tit">
              <view class="triangle" />{{ i18n.purchaseDesignatedGoods }}
            </view>
            <view
              v-for="(prod, index2) in rank.distributionLevelConditionDataVO.commodity"
              :key="index2"
              class="prod-msg"
              @tap="toProdPage(prod.prodId)"
            >
              <view class="prod-img">
                <ImgShow :src="prod.pic" />
              </view>
              <view class="prod-name">
                <view class="prod-name-txt">{{ prod.prodName }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 立即升级 -->
    <view v-if="clickLevel == level+1" class="upgrade-now" @tap="applicationUpgrade">
      <view class="upgrade">{{ i18n.upgradeImmediately }}</view>
    </view>
  </view>
</template>

<script>
// 查看等级
const http = require('../../../utils/http.js')

export default {

  components: {},
  props: {},
  data() {
    return {
      levelInfo: [],
      // 等级
      clickLevel: 0,
      // 用户点击的等级
      levelName: '',
      // 用户当前等级名称
      level: 0, // 用户当前等级
      currentColor: '',
      currentbg: ''
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
    this.getLevelInfo()
  },

  /**
		 * 生命周期函数--监听页面初次渲染完成
		 */
  onReady: function() {},

  /**
		 * 生命周期函数--监听页面显示
		 */
  onShow: function() {},

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
			 * 查看等级
			 */
    getLevelInfo: function() {
      const params = {
        url: '/p/distribution/level/page',
        method: 'GET',
        data: {},
        callBack: res => {
          this.setData({
            levelInfo: res
          })
          if (res.length) {
            res.forEach(levelInfo => {
              if (levelInfo.isCurrentLevel) {
                this.setData({
                  clickLevel: levelInfo.level - 1,
                  level: levelInfo.level - 1,
                  levelName: levelInfo.name
                })
              }
            })
          }
        }
      }
      http.request(params)
    },

    /**
			 * 申请升级
			 */
    applicationUpgrade: function() {
      const params = {
        url: '/p/distribution/level/upgrade',
        method: 'POST',
        callBack: res => {
          uni.showToast({
            title: this.i18n.upgradeSuccessful,
            icon: 'none'
          })
          this.getLevelInfo()
        }
      }
      http.request(params)
    },

    /**
			 * 跳转到商品详情
			 */
    toProdPage: function(prodId) {
      if (prodId) {
        this.$Router.push({ path: '/package-prod/pages/prod/prod', query: { prodId }})
      }
    },

    /**
			 * 点击切换当前等级规则
			 */
    clinkLevel: function(e) {
      this.setData({
        clickLevel: e.currentTarget.dataset.index,
        currentColor: 'current-color',
        currentbg: 'current-bg'
      })
    }
  }
}
</script>
<style>
	@import "./salesman-level.css";
</style>
