<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j message-play" @tap="onNewsPage">
    <image src="/static/images/icon/horn.png" class="hornpng" />
    <swiper vertical="true" autoplay="true" duration="1000" circular="true" class="swiper-cont">
      <block v-for="(item, id) in news" :key="id">
        <swiper-item class="items">{{ item.title }}</swiper-item>
      </block>
    </swiper>
    <text class="arrow" />
  </view>

</template>

<script>
import http from '../../../../utils/http.js'
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
      default: 'home' // home 首页 ，feature 微页面  传 化名ID , goods 商品详情页，传商品ID ,ad 公共广告
    }
  },
  data() {
    return {
      news: []
    }
  },

  mounted() {
    this.getNoticeList()
  },

  methods: {
    getNoticeList() {
      let path = '/notice/topNoticeList/'
      if (uni.getStorageSync('bbcToken')) {
        path = '/p/notice/topNoticeList/'
      }
      // 加载公告
      var params = {
        url: path + this.shopId,
        method: 'GET',
        data: {},
        callBack: res => {
          this.setData({
            news: res
          })
        }
      }
      http.request(params)
    },
    // 跳转公告列表页面
    onNewsPage() {
      uni.navigateTo({
        url: '/package-user/pages/recent-news/recent-news?shopId=' + this.shopId
      })
    }
  }
}
</script>
<style>
	@import "./index.css";
</style>
