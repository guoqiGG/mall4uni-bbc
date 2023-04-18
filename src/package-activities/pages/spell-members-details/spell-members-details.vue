<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 团员详情 -->
  <view class="Mall4j page">
    <view
      v-for="(teamUser, userId) in teamUserList"
      :key="userId"
      class="member-list"
    >
      <view class="member-item">
        <view class="head-img">
          <image
            :src="
              teamUser.pic
                ? teamUser.pic
                : '../../../static/images/icon/head04.png'
            "
            @error="imageError(teamUser,'pic')"
          />
          <!-- 团长标识 -->
          <text v-if="teamUser.identityType == 1" class="group-leader">{{
            i18n.teamLeader
          }}</text>
        </view>
        <view class="member-msg">
          <view class="member-name">{{ teamUser.nickName }}</view>
          <view
            v-if="teamUser.identityType == 1"
            class="time"
          >{{ teamUser.createTime }} {{ i18n.startAGroup }}</view>
          <!-- 参团 -->
          <view
            v-else
            class="time"
          >{{ teamUser.createTime }} {{ i18n.jionInGroup }}</view>
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
      teamUserList: []
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
    options = { ...this.$Route.query }
    const groupTeamId = options.groupTeamId
    this.getGroupTeamInfo(groupTeamId)
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
      title: this.i18n.membersTheDetails
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
     * 获取活动列表
     */
    getGroupTeamInfo: function(groupTempId) {
      http.request({
        url: '/p/groupTeam/joinUsers',
        method: 'GET',
        data: {
          groupTeamId: groupTempId
        },
        callBack: (res) => {
          this.setData({
            teamUserList: res
          })
        }
      })
    }
  }
}
</script>
<style>
@import "./spell-members-details.css";
</style>
