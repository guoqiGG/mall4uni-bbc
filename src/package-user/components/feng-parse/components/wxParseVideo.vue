<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 这个模板用来解决原生video总是浮在最上层的问题，使用view替换video，播放是再替换回，监听一个事件，用来被遮盖时做替换video -->
  <!--增加video标签支持，并循环添加-->
  <view @click="play">
    <view v-if="!playState" :class="node.classStr" :style="node.styleStr" style="display: inline-block;margin: auto;max-width: 100%;" class="video-video">
      <view style="display: flex;width: 100%;height:100%;flex-direction: row; justify-content: center;align-items: center;">
        <image src="https://gwbj.tongwenkeji.com/html/static/play.png" style="width: 20%;" mode="widthFix" />
      </view>
    </view>
    <video
      v-if="playState"
      :autoplay="false"
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
  },
  data() {
	  return {
		  playState: true,
		  videoStyle: 'width: 100%;'
	  }
  },
  mounted() {
	  // 捕获侧滑菜单的遮盖行为，隐藏video
  	uni.$on('slideMenuShow', e => {
      console.log('捕获事件：' + e)
      if (e == 'show' && this.playState) {
        // 正在播放则停止
        this.playState = false
      }
    })
  },
  methods: {
	  play() {
		  console.log('点击了video 播放')
		  // 显示播放器并播放播放器
		  this.playState = !this.playState
	  }
  }
}
</script>
<style>
	.video-video{background: #000000;}
</style>
