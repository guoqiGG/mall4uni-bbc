<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view id="featureSearchBar" class="Mall4j con" :style="{'margin-bottom':dataField.position===2&&fixSearchBar?(dataField.boxHeight+16) + 'px': '0',}">
    <view
      class="search-bar-container"
      :style="{background:dataField.bgColor, 'position': dataField.position===2&&fixSearchBar?'fixed': 'unset',
               'top':dataField.position===2&&fixSearchBar? top : 'unset','z-index':dataField.position===2&&fixSearchBar?'999': 'unset', }"
      @tap="toSearchPage"
    >
      <view class="search-bar" :style="{height: dataField.boxHeight + 'px',background:dataField.boxColor, color: dataField.textColor, borderRadius: dataField.boxRadio+ 'px', justifyContent: dataField.textAlgin }">
        <image src="../../../../static/images/icon/search.png" mode="" />
        <text>{{ i18n.search }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    dataField: {
      type: Object,
      default() {
        return {}
      }
    },
    pageScorllTop: {
      type: Number,
      default: 0
    },
    shopId: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      fixSearchBar: false,
      searchBarTop: 0,
      top: '0'
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  watch: {
    pageScorllTop(nv) {
      let extraHeight = 0
      // #ifdef H5
      extraHeight = 40
      // #endif
      if (nv >= this.searchBarTop + extraHeight) {
        this.fixSearchBar = true
      } else {
        this.fixSearchBar = false
      }
    }
  },
  mounted() {
    // #ifndef H5
    if (this.shopId === 0) {
      this.top = this.$lineHeight + 'rpx'
    }
    // #endif
    this.getSearchBarScrollTop()
  },
  methods: {
    /**
			 * 获取搜索框所在位置
			 */
    getSearchBarScrollTop() {
      this.$nextTick(() => {
        const view = uni.createSelectorQuery().in(this).select('#featureSearchBar')
        view.boundingClientRect(data => {
          this.searchBarTop = data.top
        }).exec()
      })
    },
    /**
			 * 跳转搜索页面
			 */
    toSearchPage() {
      // 平台首页，跳转到平台搜索页面
      uni.navigateTo({
        url: this.shopId === 0 ? '/package-search/pages/search-page/search-page' : '/package-shop/pages/shop-search/shop-search'
      })
    }
  }
}
</script>

<style>
	@import url("./index.css");
</style>
