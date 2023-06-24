<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j search-bar">
    <view class="search-input-con">
      <image class="search-icon-prefix" src="../../static/images/icon/search-prefix.png" />
      <input v-model="queryString" class="search-input" type="text" :placeholder="placeholder" placeholder-class="placeholder-class" @confirm="handleSearch">
    </view>
  </view>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    keyWord: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入关键字'
    }
  },
  data() {
    return {
      queryString: this.keyWord
    }
  },
  watch: {
    keyWord: {
      handler(val) {
        this.queryString = val
      },
      immediate: true
    }
  },
  methods: {
    /**
			 * 搜索
			 */
    handleSearch() {
      this.$emit('handleSearch', this.queryString)
    }
  }
}
</script>

<style lang="scss">
.search-bar {
	width: 100%;
	.search-input-con {
		display: flex;
		align-items: center;
		padding: 10rpx auto;
		width: 100%;
		height: 64rpx;
		background: #F7F8FA;
		border-radius: 32rpx;
		.search-icon-prefix {
			margin-left: 30rpx;
			width: 24rpx;
			height: 24rpx;
		}
		.search-input {
			margin-left: 12rpx;
			font-size: 24rpx;
      width: 100%;
		}
		.placeholder-class {
			color: #999999;
		}
	}
}
</style>
