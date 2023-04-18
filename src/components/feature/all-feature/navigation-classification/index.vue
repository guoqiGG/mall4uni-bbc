<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 分类导航 -->
  <view class="Mall4j fature-cate-item">
    <view
      v-for="(navItem, index) in dataField.nav"
      :key="navItem.title + index"
      :class="['item', dataField.size==4 ? 'column-four': 'column-five']"
      @tap="toClassifyPage(index)"
    >
      <image v-if="dataField.set.type==2 || dataField.set.type==1" class="nav-img" :src="navItem.img" />
      <text v-if="dataField.set.type==2 || dataField.set.type==3" class="nav-title" @tap.stop="toClassifyPage(index)">{{ navItem.title }}</text>
    </view>
    <block v-if="dataField.nav.length % dataField.size !=0">
      <view
        v-for="(navItem, index) in dataField.size - (dataField.nav.length % dataField.size)"
        :key="index"
        style="visibility: hidden;"
        :class="['item', dataField.size==4 ? 'column-four': 'column-five']"
      >
        <image v-if="dataField.set.type==2 || dataField.set.type==1" class="nav-img" :src="navItem.img" />
        <text v-if="dataField.set.type==2 || dataField.set.type==3" class="nav-title" @tap.stop="toClassifyPageM(index)">{{ navItem.title }}</text>
      </view>
    </block>
  </view>
</template>

<script>
import util from '../../../../utils/util.js'
export default {

  components: {

  },
  props: {
    dataField: {
      type: Object,
      default: () => ({})
    },
    shopId: {
      type: [Number, String],
      default: 0
    },
    will: {
      // 需要获取的类型 默认首页
      type: String,
      default: 'home'
    }
  },
  data() {
    return {}
  },

  mounted() {

  },

  methods: {
    /**
	 * 导航项目点击事件
	 * @param {Object} item
	 * item.img		图文/图片导航 的图片链接
	 * item.link		商品id/自定义路径/微页面id
	 * item.linkType		1商品 2购物车 3个人中心 4自定义路径 5指定微页面
	 * item.title		图文/文字导航 的标题
	 */
    toClassifyPage(index) {
      const item = this.dataField.nav[index]
      util.toRedirectLink(item.path.type, item.path.link, this.shopId)
    },
    toClassifyPageM(index) {
      const item = this.dataField.nav[index + Math.ceil(this.dataField.nav.length / this.dataField.size)]
      util.toRedirectLink(item.path.type, item.path.link, this.shopId)
    }
  }
}
</script>

<style>
	@import url("./index.css");
</style>
