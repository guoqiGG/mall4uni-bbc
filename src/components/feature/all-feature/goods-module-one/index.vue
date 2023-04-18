<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j micro-goodsOne-box">
    <view class="left-items">
      <module-component :config="dataField.leftConfig" />
    </view>
    <view class="right-items">
      <module-component :config="dataField.rightConfig" />
    </view>
  </view>
</template>
<script>
import moduleComponent from './module.vue'
export default {
  components: {
    moduleComponent
  },
  props: {
    dataField: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style scoped>
	.micro-goodsOne-box {
		display: flex;
		width: calc(100% - 48rpx);
		margin: 24rpx 24rpx 0rpx 24rpx;
		box-sizing: border-box;
		border-radius: 12rpx;
		overflow: hidden;
		background: #fff;
		border: 2rpx;
	}
	.micro-goodsOne-box .left-items {
		width: 50%;
		padding: 0 26rpx;
		box-sizing: border-box;
	}
	.micro-goodsOne-box .right-items {
		width: 50%;
		padding: 0 26rpx;
		box-sizing: border-box;
	}
</style>
