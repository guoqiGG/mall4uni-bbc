<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j">
      <!-- 搜索框 -->
      <view class="search-bar">
        <view class="select-theme" @tap="changeSearch">
          <view class="select">
            <text>{{ selectItem == 0 ? i18n.phoneNumber : i18n.pointsSource }}</text>
            <image src="/static/images/icon/switch.png" class="arrow" />
          </view>
        </view>
        <view class="search-box" v-if="selectItem == 0">
          <input :placeholder="i18n.enterKeywordSearch" class="sear-input" confirm-type="search" :value="searchKey"
            @confirm="getScoreflowInfo" @input="getSearchContent" />
          <image src="/static/images/icon/search.png" class="search-img" />
        </view>
        <picker v-else class="search-box" @change="bindPickerChange" :value="index" :range="array">
          <view class="sear-input" style="line-height:70rpx" v-if="index==8">请选择豆来源类型</view>
          <view v-else class="picker sear-input" style="line-height:70rpx">
            {{ array[index] }}
          </view>
        </picker>
        <!-- <text class="search-hint" @tap="goBackIndex">{{ i18n.cancel }}</text> -->
      </view>
    <!-- 氢春豆明细 -->
    <view class="integral-detail">
      <view class="detail-list">
        <view v-for="(item, logId) in scoreDetails" :key="logId" class="item">
          <view class="text-box">
            <!-- source来源 0注册送氢春豆 1. 购物 2.会员等级提升加氢春豆 3.签到加氢春豆 4购物抵扣使用氢春豆 5氢春豆过期 6充值获赠 -->
            <!-- ioType出入类型 0=支出 1=收入 -->
            <view class="tit">{{ item.nickName }}</view>
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
            <text v-if="item.isLock" style="font-size: 26rpx; color: #999">({{ i18n.pointsInLock }})</text>
            <view class="time">{{ item.createTime }}</view>
          </view>
          <view :class="'score ' + (item.ioType == 0 ? 'reduce' : 'add')">{{ item.ioType == 0 ? "-" : "+" }}{{ item.score
          }}</view>
        </view>
      </view>
      <!-- <view v-if="scoreDetails.length > 10 && isAll" class="loadall">{{
      i18n.endTips
    }}</view>
    <view v-if="!scoreDetails.length" class="empty">{{
      i18n.noDetails
    }}</view> -->
      <EmptyAllTips v-if="isLoaded" :isEmpty="!scoreDetails.length" :emptyTips="i18n.noDetails"
        :isAll="scoreDetails.length > 10 && isAll" />
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
      pages: 0,
      current: 1,
      size: 20,
      scoreDetails: [],
      // 氢春豆明细列表
      isAll: false,
      isLoaded: false,
      selectItem: 0, // 0 手机号 1 豆来源
      searchKey: '',// 搜索框内容
      index: 8,
      array: ['注册送氢春豆', '订单', '等级提升获取', '看够直播时长签到得豆', ' 购物抵扣氢春豆', '氢春豆过期', '余额充值', '系统更改氢春豆']
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  onShow: function () {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.integralTurnover
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getScoreflowInfo()
  },
  methods: {
    bindPickerChange: function (e) {
      if (e.detail.value == this.index) {
        return
      }
      this.setData({
        index: e.detail.value
      })
      this.getScoreflowInfo()
    },
    // 切换手机号和豆来源搜索
    changeSearch: function () {
      this.selectItem == 0 ? this.selectItem = 1 : this.selectItem = 0
      this.searchKey = ''
      this.index=8
      this.getScoreflowInfo()
    },
    // 输入内容获取数据 || 绑定输入值
    getSearchContent: function (e) {
      this.setData({
        searchKey: e.detail.value
      })
    },
    /**
     * 获取团长下的团长及邀请用户的氢春豆流水
     */
    getScoreflowInfo: function () {
      const params = {
        url: '/p/score/scoreflowInfo',
        method: 'POST',
        data: {
          current: this.current,
          size: this.size,
          parentId: uni.getStorageSync('distributionUserId'),
          mobilePhone: this.selectItem == 0 ? this.searchKey : '',
          source: this.selectItem == 1 ? this.index==8?'':this.index : ''
        },
        callBack: res => {
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
      http.request(params)
    },
    /**
   * 触底加载下一页
   */
    getNextPage() {
      if (this.pages > this.current) {
        this.setData({
          current: this.current + 1
        })
        this.getScoreflowInfo()
      } else {
        this.setData({
          isAll: true
        })
      }
    },

  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    this.getNextPage()
  },
}
</script>
<style>
@import "./turnover.css";
</style>
  