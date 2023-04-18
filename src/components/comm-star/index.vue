<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view :class="'Mall4j stars ' + type">
    <image
      v-for="(item, key) in value"
      :key="key"
      src="/static/images/icon/star-red.png"
      :data-val="key + 1"
      @tap="changeVal"
    />
    <image
      v-for="(item, key) in 5 - value"
      :key="key + 'star-empty'"
      src="/static/images/icon/star-empty.png"
      :data-val="value + key + 1"
      @tap="changeVal"
    />
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    value: Number,
    type: String,
    index: Number
  },
  data() {
    return {}
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  methods: {
    changeVal(e) {
      if (this.type) {
        var value = e.currentTarget.dataset.val
        this.$emit('onStarChange', {
          val: Number(value),
          idx: this.index
        })
      }
    }
  }
}
</script>
<style>
@import './index.css';
</style>
