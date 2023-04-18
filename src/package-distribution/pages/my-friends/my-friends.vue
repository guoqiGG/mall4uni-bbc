<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <view class="my-user">
      <view class="user-bg">
        <view class="text">{{ i18n.inTotal }}<view class="number">{{ totalInvite }}</view>{{ i18n.people }}</view>
      </view>

      <view v-if="totalInvite> 0" class="user-list">
        <view class="table">
          <view class="tr title">
            <view>{{ i18n.userInformation }}</view>
            <view>{{ i18n.contributionRevenueRMB }}</view>
          </view>
          <view class="bg-g" style="height: 50rpx;" />
          <block v-for="(item, id) in records" :key="id">
            <view class="tr tr2 bot-border">
              <view class="td flex-space flex-item">
                <view class="items  flex-space">
                  <view class="img">
                    <image :src="item.pic ? item.pic : '/static/images/icon/head04.png'" @error="imageError(item,'pic')" />
                  </view>
                </view>
                <view class="user-info">
                  <view class="username text-nowrap flex-item ">
                    <view v-if="id==0" class="no no1-bg ">N0.1</view>
                    <view v-else-if="id==1" class="no no2-bg ">N0.2</view>
                    <view v-else-if="id==2" class="no no3-bg ">N0.3</view>
                    <view class="username-text text-nowrap">{{ item.nickName }}</view>
                  </view>
                  <view class="join-time text-nowrap">
                    {{ i18n.joinTime }}{{ item.bindTime? item.bindTime.split(" ")[0]:'' }}
                  </view>
                </view>
              </view>
              <!-- <view class="td">{{ item.nickName }}</view> -->
              <view class="td user-profit">{{ item.money.toFixed(2) }}</view>
            </view>
          </block>
        </view>
      </view>
      <!-- <view v-if="records.length == 0" class="empty">{{ i18n.noFriendsYet }}</view> -->
      <!-- <view v-if="totalPage > 1" class="loading">{{ loadingMsg }}</view> -->
      <!-- 空列表或加载全部提示 -->
      <EmptyAllTips
        v-if="isLoaded"
        :isEmpty="records.length == 0"
        :emptyTips="i18n.noFriendsYet"
        :isAll="totalPage > 1"
        :allTips="loadingMsg"
      />

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
      totalInvite: 0,
      records: [],
      // loadingMsg: this.i18n.loading,
      loadingMsg: '',
      emptyMsg: '',
      totalPage: 1,
      pageNum: 1,
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
  onLoad: function(options) {},

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
      title: this.i18n.myFriends
    })
    uni.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#FFAA00'
    })
    this.loadingMsg = this.i18n.loading

    this.loadPageData()
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
    if (this.pageNum < this.totalPage) {
      this.loadPageData(this.pageNum + 1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  methods: {
    /**
     * 加载用户数据
     */
    loadPageData: function(pageNum) {
      this.isLoaded = false
      const params = {
        url: '/p/distribution/user/subordinateUser',
        method: 'GET',
        data: {
          userType: 2
        },
        callBack: (res) => {
          this.isLoaded = true
          var records = []
          records = res
          this.setData({
            records: records,
            emptyMsg: this.i18n.noUsersYet,
            totalInvite: records.length
          })
        }
      }
      http.request(params)
    }

  }
}
</script>
<style>
@import "./my-friends";
</style>
