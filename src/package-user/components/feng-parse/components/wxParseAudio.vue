<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- '<audio/>' 组件不再维护，建议使用能力更强的 'uni.createInnerAudioContext' 接口 有时间再改-->
  <!--增加audio标签支持-->
  <audio
    :id="node.attr.id"
    :class="node.classStr"
    :style="node.styleStr"
    :src="node.attr.src"
    :loop="node.attr.loop"
    :poster="node.attr.poster"
    :name="node.attr.name"
    :author="node.attr.author"
    controls
  />
</template>

<script>
export default {
  name: 'WxParseAudio',
  props: {
    node: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
