<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j">
    <web-view :src="url" />
    <!-- <web-view src="https://uniapp.dcloud.io/static/web-view.html"></web-view> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      url: ''
    }
  },
  onLoad(e) {
    console.log('e', e)
    // 获取传递过来的链接
    this.url = e.url
  }
}
</script>
