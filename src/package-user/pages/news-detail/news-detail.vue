<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <view class="news-detail">
      <view v-if="news.msgTitle" class="news-detail-title">{{ news.msgTitle }}</view>
      <view v-else class="news-detail-title">{{ news.title }}</view>
      <u-parse :content="news.content" @navigate="navigate" />
    </view>
  </view>
</template>

<script>
import uParse from '../../components/feng-parse/parse.vue'
const http = require('@/utils/http.js')
const util = require('@/utils/util.js')

export default {

  components: {
    uParse
  },
  props: {},
  data() {
    return {
      news: {
        title: '',
        // 标题
        msgTitle: '',
        // 分销通知标题
        content: '',
        id: 0
      }
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
    if (options.type == 'dist') {
      // 加载分销公告
      const params = {
        url: '/p/distribution/msg/info',
        method: 'GET',
        data: {
          msgId: options.id
        },
        callBack: res => {
          if (res.content) {
            res.content = util.formatHtml(res.content)
          }
          this.setData({
            news: res
          })
        }
      }
      http.request(params)
    } else {
      let path = '/notice/info/'
      if (uni.getStorageSync('bbcToken')) {
        path = '/p/notice/info/'
      }
      // 加载公告详情
      const params = {
        url: path + options.id,
        method: 'GET',
        callBack: res => {
          if (res.content) {
            res.content = util.formatHtml(res.content)
            console.log(res.content)
          }
          this.setData({
            news: res
          })
        }
      }
      http.request(params)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.latestAnnouncement
    })
  },
  methods: {
    preview() {
    },
    navigate(href) {
      /* #ifndef H5 */
      uni.navigateTo({ url: `/pages/out/out?name=${href}` })
      /* #endif */

      /* #ifdef H5 */
      window.location.href = href
      /* #endif */
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() { }
}
</script>
<style>
@import "./news-detail.css";
@import url("../../components/feng-parse/parse.css");
</style>
