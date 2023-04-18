<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j shop-tabbar-container">
    <block v-for="(item, index) in list" :key="index">
      <view class="tabBar" :data-index="index" @tap="tabChange">
        <image v-if="currentTab==index" class="tabIcon" :src="item.selectedIconPath" />
        <image v-else class="tabIcon" :src="item.iconPath" />
        <text :class="'tabTitle ' + (activeTab==index?'on':'')">{{ item.text }}</text>
      </view>
    </block>
  </view>
</template>

<script>
export default {

  components: {},
  props: {
    currentTab: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      activeTab: this.currentTab,
      list: [{
        // text: "店铺首页",
        iconPath: require('../../static/images/tabbar/shop-home.png'),
        selectedIconPath: require('../../static/images/tabbar/shop-home-sel.png')
      }, {
        // text: "全部商品",
        iconPath: require('../../static/images/tabbar/shop-prods.png'),
        selectedIconPath: require('../../static/images/tabbar/shop-prods-sel.png')
      }, {
        // text: "商品分类",
        iconPath: require('../../static/images/tabbar/shop-category.png'),
        selectedIconPath: require('../../static/images/tabbar/shop-category-sel.png')
      }, {
        // text: "店内搜索",
        iconPath: require('../../static/images/tabbar/shop-search.png'),
        selectedIconPath: require('../../static/images/tabbar/shop-search-sel.png')
      }],
      shopInfo: null
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  beforeMount: function() {
    // 在组件实例进入页面节点树时执行
    var listText = this.list
    var shopHomepage = this.i18n.shopHomepage
    this.$set(listText[0], 'text', shopHomepage)
    var allCommodities = this.i18n.allCommodities
    this.$set(listText[1], 'text', allCommodities)
    var commodityClassification = this.i18n.commodityClassification
    this.$set(listText[2], 'text', commodityClassification)
    var storeSearch = this.i18n.storeSearch
    this.$set(listText[3], 'text', storeSearch)

    // 店铺信息
    this.shopInfo = uni.getStorageSync('bbcShopInfo')
  },
  destroyed: function() { // 在组件实例被从页面节点树移除时执行
  },
  methods: {
    // tabbar切换
    tabChange(e) {
      const {
        index
      } = e.currentTarget.dataset
      this.activeTab = index
      if (this.activeTab == 0) {
        uni.redirectTo({
          url: this.shopInfo.renovationId ? '/package-shop/pages/feature-index/feature-index0?shopId=' + this.shopInfo.shopId +
							'&renovationId=' + this.shopInfo.renovationId : '/package-shop/pages/shop-page/shop-page?shopId=' + this.shopInfo.shopId
        })
      } else if (this.activeTab == 1) {
        uni.redirectTo({
          url: '/package-shop/pages/shop-prods/shop-prods'
        })
      } else if (this.activeTab == 2) {
        uni.redirectTo({
          url: '/package-shop/pages/shop-category/shop-category'
        })
      } else if (this.activeTab == 3) {
        uni.redirectTo({
          url: '/package-shop/pages/shop-search/shop-search'
        })
      }
    }

  }
}
</script>
<style>
	@import "./index.css";
</style>
