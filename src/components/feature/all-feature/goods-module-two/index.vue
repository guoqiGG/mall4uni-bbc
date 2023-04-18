<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j micro-goodsTwo-box">
    <module-component :config="dataField" :shopId="shopId" />
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
    },
    shopId: {
      type: [Number, String],
      default: 0
    }
  }
}
</script>

<style scoped>
.micro-goodsTwo-box {
	width: calc(100% - 48rpx);
	overflow: hidden;
	margin: 24rpx 24rpx 0rpx 24rpx;
	background: #fff;
	box-sizing: border-box;
	border-radius: 8rpx;
}
</style>
