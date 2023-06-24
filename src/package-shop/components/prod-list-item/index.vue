<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j prod-items" @tap="toProdPage(prod.prodId)">
    <view class="hot-imagecont">
      <image v-if="prod.pic&&isCanShow" :src="prod.pic" class="hotsaleimg" @error="handlePicError" /></image>
      <image v-else src="@/static/images/icon/def.png" class="hotsaleimg" />
    </view>
    <view class="hot-text">
      <view class="hotprod-text">
        <view v-if="prod.activityInProgress && prod.prodType != 0" class="activity-box">
          <view class="activity">
            {{ prodTypeArr[prod.prodType] }}
          </view>
        </view>
        {{ prod.prodName }}
      </view>
      <view :class="['prod-info']">{{
        prod.brief === null ? "" : prod.brief
      }}</view>
      <view class="prod-text-info">
        <view class="price">
          <text class="symbol">￥</text>
          <text class="big-num">{{ prod.price }}</text>
        </view>
        <image src="/static/images/tabbar/basket-sel.png" class="basket-img" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    prod: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isCanShow: true // 图片是否正确显示
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    },
    prodTypeArr() {
      return [
        this.i18n.prodType1,
        this.i18n.prodType2,
        this.i18n.prodType3,
        this.i18n.prodType4
      ]
    }
  },
  methods: {
    toProdPage: function(prodId) {
      this.$Router.push({
        path: '/package-prod/pages/prod/prod',
        query: { prodId }
      })
    },
    handlePicError() {
      this.isCanShow = false
    }
  }
}
</script>
<style>
@import "./index.css";
</style>
