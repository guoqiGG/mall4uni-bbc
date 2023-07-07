<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j" style="background-color: #F0F0F0;padding-top:43rpx;min-height:calc(100vh - 43rpx);">
    <!-- 青春豆明细 -->
    <view class="integral-detail">
      <view class="number-box">
        <view class="my-integral">
          <view class="text">我的{{ i18n.integral }}</view>
          <view class="number">{{ userInfo.score }}</view> 
        </view>
        <!-- <view class="explain" @tap="clikcPop">{{ i18n.integralStrategy }}</view> -->
      </view>
      <view class="detail-list">
        <view v-for="(item, logId) in scoreDetails" :key="logId" class="item">
          <view class="text-box">
            <!-- source来源 0注册送青春豆 1. 购物 2.会员等级提升加青春豆 3.签到加青春豆 4购物抵扣使用青春豆 5青春豆过期 6充值获赠 -->
            <!-- ioType出入类型 0=支出 1=收入 -->
            <view v-if="item.source == 0" class="tit">{{
              i18n.registerEarnPoints
            }}</view>
            <view v-if="item.source == 1 && item.ioType == 1" class="tit">{{
              i18n.rewardPointsGoods
            }}</view>
            <view v-if="item.source == 1 && item.ioType == 0" class="tit">{{
              i18n.refundShopping
            }}</view>
            <view v-if="item.source == 2" class="tit">{{
              i18n.pointsLevelPromotion
            }}</view>
            <view v-if="item.source == 3" class="tit">{{
              i18n.signGetPoints
            }}</view>
            <view v-if="item.source == 4 && item.ioType == 1" class="tit">{{
              i18n.refundGoodsPoints
            }}</view>
            <view v-if="item.source == 4 && item.ioType == 0" class="tit">{{
              i18n.purchaseGoodsPoints
            }}</view>
            <view v-if="item.source == 5" class="tit">{{
              i18n.pointsExpired
            }}</view>
            <view v-if="item.source == 6" class="tit">{{
              i18n.rechargeGetPoints
            }}</view>
            <view v-if="item.source == 7" class="tit">{{
              i18n.platformModification
            }}</view>
            <text
              v-if="item.isLock"
              style="font-size: 26rpx; color: #999"
            >({{ i18n.pointsInLock }})</text>
            <view class="time">{{ item.createTime }}</view>
          </view>
          <view
            :class="'score ' + (item.ioType == 0 ? 'reduce' : 'add')"
          >{{ item.ioType == 0 ? "-" : "+" }}{{ item.score }}</view>
        </view>
      </view>
      <!-- <view v-if="scoreDetails.length > 10 && isAll" class="loadall">{{
        i18n.endTips
      }}</view>
      <view v-if="!scoreDetails.length" class="empty">{{
        i18n.noDetails
      }}</view> -->
      <EmptyAllTips
        v-if="isLoaded"
        :isEmpty="!scoreDetails.length"
        :emptyTips="i18n.noDetails"
        :isAll="scoreDetails.length > 10 && isAll"
      />
    </view>

    <!-- 青春豆攻略弹框 -->
    <view v-if="showPop" class="score-strategy">
      <view class="mask" />
      <view class="explain-card">
        <view class="content-wrap">
          <view class="cont-title">{{ i18n.integralStrategy }}</view>
          <image
            class="close-icon"
            src="/static/images/icon/close.png"
            @tap="clikcPop"
          />
          <view class="cont-det">
            <view class="cont-det-text" v-html="scoreExplain.paramValue" />
          </view>
        </view>
      </view>
    </view>
    <!-- /青春豆攻略弹框 -->

    <!-- /青春豆明细 -->
  </view>
</template>

<script>
const http = require('../../../utils/http.js')

export default {
  components: {},
  props: {},
  data() {
    return {
      pages: 0,
      current: 1,
      size: 20,
      scoreDetails: [],
      // 青春豆明细列表
      isAll: false,
      userInfo: {},
      // 用户青春豆等级信息
      scoreExplain: {},
      // 青春豆说明
      showPop: false, // 攻略弹框显隐
      isLoaded: false
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
    // 请求青春豆明细
    this.getScoreDetails() // 获取用户青春豆等级信息

    this.getUserScore() // 青春豆攻略

    this.getScoreExplain()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    uni.setNavigationBarTitle({
      title: this.i18n.pointDetail
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
  onReachBottom: function() {
    this.getNextPage()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  methods: {
    /**
     * 获取用户青春豆等级信息
     */
    getUserScore: function() {
      var param = {
        url: '/p/user/userInfo',
        method: 'GET',
        data: {
          current: this.current,
          size: this.size
        },
        callBack: (res) => {
          this.setData({
            userInfo: res
          })
        }
      }
      http.request(param)
    },

    /**
     * 请求青春豆明细
     */
    getScoreDetails: function() {
      this.isLoaded = false
      var param = {
        url: '/p/score/page',
        method: 'GET',
        data: {
          current: this.current,
          size: this.size
        },
        callBack: (res) => {
          this.isLoaded = true
          var scoreDetails = []

          if (this.current == 1) {
            this.setData({
              scoreDetails: res.records,
              pages: res.pages,
              current: res.current
            })
          } else {
            scoreDetails = this.scoreDetails
            scoreDetails.push(...res.records)
            this.setData({
              scoreDetails
            })
          }

          console.log(this.scoreDetails)
        }
      }
      http.request(param)
    },

    /**
     * 触底加载下一页
     */
    getNextPage() {
      if (this.pages > this.current) {
        this.setData({
          current: this.current + 1
        })
        this.getScoreDetails()
      } else {
        this.setData({
          isAll: true
        })
      }
    },

    /**
     * 青春豆攻略
     */
    getScoreExplain: function() {
      var param = {
        url: '/p/score/getScoreQuestion',
        method: 'GET',
        data: {},
        callBack: (res) => {
          console.log(res)
          this.setData({
            scoreExplain: res
          })
          console.log(this.scoreExplain)
        }
      }
      http.request(param)
    },

    /**
     * 青春豆攻略弹框显隐
     */
    clikcPop: function() {
      var showPop = !this.showPop
      this.setData({
        showPop
      })
    }
  }
}
</script>
<style>
@import "./integral-detail.css";
</style>
