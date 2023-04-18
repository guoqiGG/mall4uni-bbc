<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 积分商品列表组件 -->
  <view class="Mall4j integral-item" @tap="toScoreProdDet(data.prodId)">
    <view class="img">
      <image v-if="data.pic" :src="data.pic" mode="aspectFit" @error="handlePicError()" />
      <image v-else src="/static/images/icon/def.png" mode="aspectFit" />
    </view>
    <view class="name">{{ data.prodName }}</view>
    <view class="price">
      <image src="/static/images/icon/integral-icon.png" class="icon" />
      <text class="red-word">{{ data.scorePrice }}{{ i18n.integral }}
        <text v-if="data.price > 0" decode="true">+￥{{ data.price }}</text>
      </text>
    </view>
    <!-- 销售价大于等于市场价 市场价不展示 -->
    <view v-if="data.oriPrice > data.price" class="old-price">{{ i18n.marketValue }}￥{{ data.oriPrice }}</view>
  </view>
  <!-- </view> -->
</template>

<script>
export default {
  components: {},
  // #ifdef MP-WEIXIN
  options: {
    // 微信小程序中 options 选项
    multipleSlots: true, //  在组件定义时的选项中启动多slot支持，默认启用
    styleIsolation: 'isolated', //  启动样式隔离。当使用页面自定义组件，希望父组件影响子组件样式时可能需要配置。具体配置选项参见：微信小程序自定义组件的样式
    addGlobalClass: true, //  表示页面样式将影响到自定义组件，但自定义组件中指定的样式不会影响页面。这个选项等价于设置 styleIsolation: apply-shared
    virtualHost: true //  将自定义节点设置成虚拟的，更加接近Vue组件的表现。我们不希望自定义组件的这个节点本身可以设置样式、响应 flex 布局等，而是希望自定义组件内部的第一层节点能够响应 flex 布局或者样式由自定义组件本身完全决定
  },
  // #endif

  props: {
    prod: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      data: this.prod
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  methods: {
    /**
     * 跳转积分商品详情
     */
    toScoreProdDet(prodId) {
      uni.navigateTo({
        url: 'pages/prod/prod?prodId=' + prodId
      })
    },
    /**
     * 图片加载失败时显示默认图片
     */
    handlePicError(item) {
      this.data.pic = ''
    }
  }
}
</script>
<style>
@import "./index.css";
</style>
