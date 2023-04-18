<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j micro-goodsThree-box">
    <module-component :config="dataField" />
  </view>
</template>

<script>
import moduleComponent from './module.vue'
export default {
  components: {
    moduleComponent
  },
  props: {
    dataField: { // 配置信息
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
	.micro-goodsThree-box {
		width: calc(100% - 48rpx);
		background: #fff;
		margin: 24rpx 24rpx 0 24rpx;
		overflow: hidden;
		box-sizing: border-box;
		border-radius: 12rpx;
	}
</style>
