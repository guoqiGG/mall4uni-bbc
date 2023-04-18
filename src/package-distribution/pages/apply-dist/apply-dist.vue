<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j claimer-mian">
    <ImgShow :src="pic" :classList="['dist-pic']" imgMode="widthFix" />
    <view class="dist-cont">
      <rich-text :nodes="content" space="emsp" />
    </view>
    <!-- <button class='claimer-mian-btn'>申请成为分销员</button> -->
    <view class="claimer-mian-btn" @tap="onApplyDist">{{
      i18n.applyDistributor
    }}</view>
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')

export default {
  components: {},
  props: {},
  data() {
    return {
      shopid: 1,
      content: '',
      pic: '',
      title: '',
      scene: ''
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
    // 加载分销员推广
    // console.log(decodeURIComponent(options.scene),'11')
    this.setData({
      scene: this.$Route.query.scene
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getClaimerList(this.shopid)
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
     * 查看
     */
    getClaimerList: function(shopid) {
      const params = {
        url: '/p/distribution/recruit/info',
        method: 'GET',
        callBack: (res) => {
          res.content = res.content
            .replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/gi, '<p')
            .replace(
              /<p>/gi,
              '<p style="font-size: 15px; line-height: 25px; word-wrap: break-word; word-break: normal;">'
            )
            .replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/gi, '<img$1')
            .replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/gi, '<img$1')
            .replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/gi, '<img$1')
            .replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/gi, '<img$1')
            .replace(
              /<img([\s\w"-=\/\.:;]+)/gi,
              '<img style="width: 100%;" $1'
            )

          this.setData({
            content: util.formatHtml(res.content),
            pic: res.pic,
            title: res.title
          }) // 设置标题

          wx.setNavigationBarTitle({
            title: res.title
          })
        }
      }
      http.request(params)
    },
    onApplyDist: function() {
      if (this.scene) {
        uni.navigateTo({
          url:
            '/package-distribution/pages/apply-dist-con/apply-dist-con?scene=' +
            this.scene
        })
      } else {
        uni.navigateTo({
          url: '/package-distribution/pages/apply-dist-con/apply-dist-con'
        })
      }
    }
  }
}
</script>
<style>
@import "./apply-dist.css";
</style>
