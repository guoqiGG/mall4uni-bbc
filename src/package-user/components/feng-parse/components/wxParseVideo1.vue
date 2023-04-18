<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 这个模板用来渲染原生video -->
  <!--增加video标签支持，并循环添加-->
  <view style="max-width: 100%;">
    <video
      v-if="playState"
      :autoplay="playState"
      :class="node.classStr"
      :style="node.styleStr"
      class="video-video"
      :src="node.attr.src"
    />
  </view>
</template>

<script>
export default {
  name: 'WxParseVideo',
  props: {
    node: {}
  }
}
</script>
<style>
	.video-video{z-index: 1;}
</style>
