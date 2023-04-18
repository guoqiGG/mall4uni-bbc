<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j bottom-tips-con">
    <!-- 加载完成 -->
    <view v-if="isAll && current" class="load-all">{{ i18n.endTips }}</view>
    <!-- 列表为空 -->
    <view v-if="empty" class="empty">
      <view class="empty-icon">
        <image src="/static/images/icon/empty.png" />
      </view>
      <view class="empty-text">{{ i18n.noData }}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    isAll: Boolean,
    current: Boolean,
    empty: Boolean
  },
  data() {
    return {

    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  }
}
</script>

<style>
	@import url("./index.css");
</style>
