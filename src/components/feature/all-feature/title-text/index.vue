<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j text-title">
    <view class="title-row">
      <view
        class="title"
        :style="{
          textAlign: dataField.align,
          fontSize: dataField.titleSize + 'px',
          fontWeight: dataField.titleWeight,
        }"
      >
        {{ dataField.title }}
      </view>
      <view v-if="dataField.isLink" class="title-more" @tap="viewMore">
        <view v-if="dataField.linkStyle != 3" class="more-text">{{
          dataField.linkText
        }}</view>
        <view v-if="dataField.linkStyle != 1" class="more-icon">
          <image src="../../../../static/images/icon/more.png" mode="" />
        </view>
      </view>
    </view>
    <view
      v-if="dataField.desc"
      class="decs-row"
      :style="{
        width: '100%',
        textAlign: dataField.align,
        fontSize: dataField.descSize + 'px',
        fontWeight: dataField.descWeight,
      }"
    >
      {{ dataField.desc }}
    </view>
  </view>
</template>

<script>
import util from '@/utils/util'
export default {
  props: {
    dataField: {
      type: Object,
      default() {
        return {}
      }
    },
    shopId: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {}
  },
  mounted() {
    // console.log(this.dataField)
  },
  methods: {
    /**
     * 点击查看更多
     */
    viewMore() {
      if (this.dataField.path) {
        util.toRedirectLink(this.dataField.path.type, this.dataField.path.link, this.shopId)
      } else {
        util.featureRoute(this.dataField.link)
      }
    }
  }
}
</script>

<style>
@import url("./index.css");
</style>
