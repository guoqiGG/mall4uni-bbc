<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j">
    <feature ref="featureIndex" :page-load="pageLoad" :page-id="renovationId" :shop-id="shopId" :page-scorll-top="pageScorllTop" @pageLoaded="pageLoaded" />
    <shop-tabbar v-if="homeStatus == 1" style="position:fixed;bottom:0;width:100%;left:0;right:0;" :renovation-id="renovationId" :shop-id="shopId" />
  </view>
</template>

<script>
import feature from '../../components/feature/index/index.vue'
import shopTabbar from '../../package-shop/components/shop-tabbar/index.vue'
export default {
  components: {
    feature,
    shopTabbar
  },
  data() {
    return {
      pageLoad: false,
      renovationId: '', // 页面id
      shopId: '',
      pageScorllTop: 0, // 页面滚动距离
      homeStatus: 0 // 是否为主页
    }
  },
  onLoad: function(options) {
    if (options.renovationId) {
      this.renovationId = options.renovationId
    }
    if (options.shopId) {
      this.shopId = options.shopId
    }
  },
  onShow: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.$refs.featureIndex.getNextPage()
  },
  onPageScroll: function(e) {
    this.pageScorllTop = e.scrollTop
  },
  methods: {
    // 页面加载回调
    pageLoaded(e) {
      console.log(e)
      uni.setNavigationBarTitle({
        title: e.detail.title
      })
      this.pageLoad = false
      this.homeStatus = e.detail.homeStatus
    }
  }
}
</script>

<style>

</style>
