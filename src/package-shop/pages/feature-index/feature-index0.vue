<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view :key="renovationId" class="Mall4j shop-feature" style="padding-bottom: 80rpx;">
    <feature ref="featureIndex" :page-load="pageLoad" :page-id="renovationId" :shop-id="shopId" :page-scorll-top="pageScorllTop" @pageLoaded="pageLoaded" />
    <shop-tabbar style="position:fixed;bottom:0;width:100%;left:0;right:0;" :renovation-id="renovationId" :shop-id="shopId" />

    <!-- 回到顶部 -->
    <back-top-btn v-if="showBacktop" />
  </view>
</template>

<script>
const http = require('../../../utils/http')
import backTopBtn from '@/components/back-top-btn/index.vue'
import feature from '../../../components/feature/index/index.vue'
import shopTabbar from '../../components/shop-tabbar/index.vue'
export default {
  components: {
    feature,
    shopTabbar,
    backTopBtn
  },
  data() {
    return {
      pageLoad: false,
      renovationId: '', // 页面id
      shopId: '',
      showBacktop: false,
      pageScorllTop: 0 // 页面滚动距离
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.$refs.featureIndex.getNextPage()
  },
  mounted() {
    this.getShopInfo()
  },
  onLoad: function(options) {
    if (options.renovationId) {
      this.renovationId = options.renovationId
    }
    if (options.shopId) {
      this.shopId = options.shopId
    }
  },
  onShow: function() {},
  onPageScroll: function(e) {
    this.pageScorllTop = e.scrollTop
    if (e.scrollTop > 800) {
      this.setData({
        showBacktop: true
      })
    } else if (e.scrollTop < 800) {
      this.setData({
        showBacktop: false
      })
    }
  },
  onPullDownRefresh: function() {
    setTimeout(() => {
      this.$nextTick(() => {
        this.$refs.featureIndex.getPageInfoById()
      })
      uni.stopPullDownRefresh() // 停止下拉刷新
    }, 100)
  },
  methods: {

    /**
			 * 获取店铺信息
			 */
    getShopInfo() {
      const params = {
        url: '/shop/headInfo',
        method: 'GET',
        data: {
          shopId: this.shopId
        },
        callBack: (res) => {
          if (!res.renovationId) {
            uni.redirectTo({
              url: '/package-shop/pages/shop-page/shop-page?shopId=' + this.shopId
            })
          }
          uni.setStorageSync('bbcShopInfo', res)
          if (res.renovationId !== this.renovationId && res.renovationId) {
            this.renovationId = res.renovationId
          }
          // 进入页面时判断店铺状态
          this.handleShopStatus(res)
        }
      }
      http.request(params)
    },

    /**
			 * 店铺状态处理
			 */
    handleShopStatus(res) {
      const shopStatus = res.shopStatus
      // shopStatus店铺状态(-1:未开通 0: 停业中 1:营业中 2:平台下线 3:平台下线待审核)，可修改
      if (shopStatus === -1) {
        this.handleTipsModal(this.i18n.storeStatusTips2)
        return
      }
      if (shopStatus === 0) {
        this.handleTipsModal(this.i18n.storeReviewTips6)
        return
      }
      if (shopStatus === 2 || shopStatus === 3) {
        this.handleTipsModal(this.i18n.storeStatusTips3)
        return
      }
    },
    handleTipsModal(tips) {
      uni.showModal({
        title: this.i18n.tips,
        content: tips,
        showCancel: false, // 是否显示取消按钮
        cancelText: this.i18n.cancel,
        confirmText: this.i18n.confirm,
        success: (res) => {
          if (res.confirm) {
            uni.navigateBack({
              delta: 1
            })
          }
        }
      })
    },

    // 页面加载回调
    pageLoaded(e) {
      uni.setNavigationBarTitle({
        title: e.detail.title
      })
    }
  }
}
</script>

<style>

</style>
