<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j">
    <swiper
      class="swiper"
      :indicator-dots="indicatorDots"
      :autoplay="autoplay"
      circular="true"
      :vertical="vertical"
      :interval="interval"
      :duration="duration"
      :previous-margin="previousMargin + 'px'"
      :next-margin="nextMargin + 'px'"
      @change="swiperChange"
    >
      <block v-for="(item, index) in swiperData" :key="index">
        <swiper-item
          class="swiper-item"
          :data-roomid="item.roomId"
          @tap="toLivePage"
        >
          <!-- <view class="swiper-img-item"> -->
          <ImgShow :src="item.feedsImg" :classList="['slide-image',index == currentSwiper ? 'active' : 'quiet']" imgMode="scaleToFill" />
          <!-- <image :class="['living-icon', index == currentSwiper ? 'active-living-icon' : '' ]" src="/static/images/liveBroadcast/living02.png"></image> -->
          <!-- 节奏跳动组件 -->
          <view
            :class="[
              'living-icon',
              index == currentSwiper ? 'active-living-icon' : '',
            ]"
          >
            <rhythm-beat />
          </view>
          <view
            :class="[
              'item-content',
              index == currentSwiper ? 'active-content' : '',
            ]"
          >
            <view class="lt">
              <view class="anchor">{{ item.anchorName }}</view>
              <view class="live-tit">{{ item.name }}</view>
            </view>
            <image
              class="rt"
              src="/static/images/liveBroadcast/like-heart.png"
            />
          </view>
          <!-- </view> -->
        </swiper-item>
      </block>
    </swiper>
    <!--  实现点击选中样式  -->
    <view class="dots">
      <block v-for="(item, idx) in swiperData" :key="idx">
        <view :class="['dot', idx == currentSwiper ? ' active' : '']" />
      </block>
    </view>
  </view>
</template>

<script>
const util = require('../../utils/util.js')
import rhythmBeat from 'components/rhythm-beat/index.vue'
export default {
  components: {
    rhythmBeat
  },

  props: {
    swiperData: Array, // 列表
    isWechat: Boolean // 判断当前是否微信环境
  },
  /**
   * 组件的属性列表
   */
  // properties: {
  //   swiperData: {
  //     type: Object,
  //     value: {}
  //   },
  //   swiperOptions: {
  //     type: Object,
  //     value: {}
  //   }
  // },
  /**
   * 组件的初始数据
   */
  data() {
    return {
      // options: {},
      indicatorDots: false, //  是否显示面板指示点
      autoplay: true, // 是否自动切换
      circular: true, // 是否采用衔接滑动
      vertical: false, // 是否垂直衔接滑动
      interval: 4000, // 自动切换时间间隔
      duration: 200, // 滑动动画时长
      previousMargin: 20,
      nextMargin: 0,
      displayMultipleItems: 3,
      currentSwiper: ''
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  // attached: function () {
  //   this.setData({
  //     options: Object.assign({}, {
  //       autoplay: false,
  //       circular: true,
  //       interval: 3000,
  //       duration: 100,
  //       previousMargin: 60,
  //       nextMargin: 0,
  //       displayMultipleItems: 3,
  //       currentSwiper: ''
  //     }, this.data.swiperOptions)
  //   })
  // },

  /**
   * 组件的方法列表
   */
  methods: {
    swiperChange: function(e) {
      this.currentSwiper = e.detail.current
    },

    /**
     * 前往直播页面
     */
    toLivePage: function(e) {
      console.log(e)
      this.roomId = e.currentTarget.dataset.roomid // 填写具体的房间号
      this.url = e.currentTarget.dataset.url
      util.checkAuthInfo(this.toLivePlayer)
    },
    toLivePlayer: function() {
      console.log('isWechat:', this.isWechat)
      const roomId = this.roomId
      const url = this.url
      console.log('roomId:', roomId, '，', 'url:', url)
      if (this.isWechat) {
        // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取
        const customParams = encodeURIComponent(JSON.stringify({ path: url }))
        wx.navigateTo({
          url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
        }) // 其中wx2b03c6e691cd7370是直播组件appid不能修改
      } else {
        uni.showToast({
          title: this.i18n.pleaseOpenInWechat,
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style>
@import "./index.css";
</style>
