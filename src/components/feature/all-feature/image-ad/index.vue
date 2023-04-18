<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view v-if="dataField.imageList.length" class="Mall4j image_ad" style="margin-top:-2rpx">
    <!--一行一个-->
    <view v-if="dataField.indicator === 1">
      <view v-for="(item, index) in dataField.imageList" :key="index" class="one-line" :style="{height: dataField.imgHeight + 'px'}" @tap.stop="adFun(item)">
        <image v-if="showErrorImgList[index] !== 1" :style="{height: dataField.imgHeight + 'px', width: '100vw'}" mode="scaleToFill" :src="item.url" @error="errImg(index)" />
        <image v-if="showErrorImgList[index] === 1" :style="{height: dataField.imgHeight + 'px', width: '100vw'}" mode="scaleToFill" src="/static/images/icon/def.png" />
      </view>
    </view>
    <!--轮播海报-->
    <view v-if="dataField.indicator === 2" class="swiper-box">
      <view :style="{height: dataField.imgHeight + 'px',width: '100vw', overflow: 'hidden'}">
        <image v-if="showErrorImgList[swiperCurrent] !== 1" :src="dataField.imageList[swiperCurrent].url" mode="scaleToFill" style="width:100vw;opacity: 0" />
        <image v-if="showErrorImgList[swiperCurrent] === 1" src="/static/images/icon/def.png" mode="scaleToFill" style="width:100vw;opacity: 0" />
      </view>

      <swiper
        :autoplay="autoPlay"
        :interval="interval"
        :circular="circular"
        :duration="duration"
        @change="swiperEnd"
      >
        <block v-for="(item, index) in dataField.imageList" :key="index">
          <swiper-item>
            <view :style="{height: dataField.imgHeight + 'px',width: '100vw', overflow: 'hidden'}">
              <image v-if="showErrorImgList[index] !== 1" id="swiper-image" :style="{height: dataField.imgHeight + 'px', width: '100vw'}" :src="item.url" mode="scaleToFill" class="swiper-image" @error="errImg(index)" @tap.stop="adFun(item)" />
              <image v-if="showErrorImgList[index] === 1" id="swiper-image" :style="{height: dataField.imgHeight + 'px', width: '100vw'}" src="/static/images/icon/def.png" mode="scaleToFill" class="swiper-image" @tap.stop="adFun(item)" />
            </view>

            <!-- 宽高铺满 -->
            <!-- <image style="width:750rpx;" @tap.stop="adFun(item)" :src="item.url" class="swiper-image"></image> -->
          </swiper-item>
        </block>
      </swiper>

      <!-- 轮播图指示点 -->
      <view v-if="dataField.swiperOption.indicatorDots" class="dots" :style="{bottom: 'calc(' + (dataField.swiperOption.indicatorBottom || 10) + 'px + 10rpx)'}">
        <block v-for="(item, idx) in dataField.imageList" :key="idx">
          <view class="dot" :style="{'background-color': idx == swiperCurrent ? dataField.swiperOption.indicatorActiveColor : dataField.swiperOption.indicatorColor, }" />
        </block>
      </view>
    </view>
    <!--小图横向滑动-->
    <view v-if="dataField.indicator === 3">
      <scroll-view scroll-x class="ad-scroll">
        <view v-for="(item, index) in dataField.imageList" :key="index" class="ad-scroll-item" :style="{height: dataField.imgHeight + 'px'}">
          <image v-if="showErrorImgList[index] !== 1" style="width:100vw; height: 100%;" mode="scaleToFill" :src="item.url" class="sli-image" @error="errImg(index)" @tap.stop="adFun(item)" />
          <image v-else style="width:100vw; height: 100%;" mode="scaleToFill" src="/static/images/icon/def.png" class="sli-image" @tap.stop="adFun(item)" />
        </view>
      </scroll-view>
    </view>

    <!--热区-->
    <view v-if="dataField.indicator === 4">
      <view v-for="(item, index) in dataField.imageList" :key="index" class="hot-area-4">
        <image style="width:100vw;" mode="widthFix" :src="item.url" />
        <!--wx:if="{{boxItem.link}}"-->
        <view
          v-for="(boxItem, boxIndex) in item.activeBoxs"
          :key="boxIndex"
          class="hot-area-one"
          :style="'width:' + (boxItem.width*dpr) + 'px;height:' + (boxItem.height*dpr) + 'px;transform: translateX(' + (boxItem.translateX*dpr) + 'px) translateY(' + (boxItem.translateY*dpr) + 'px);'"
          @tap.stop="handleRedirect(boxItem)"
        />
      </view>
    </view>

  </view>
</template>

<script>
import util from '../../../../utils/util.js'
export default {

  components: {},
  props: {
    indicatorDots: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    circular: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    },
    duration: {
      type: Number,
      default: 500
    },
    dataField: {
      type: Object,
      default: () => ({
        indicator: 0,
        imageList: []
      })
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
      dpr: 375 / 491,
      swiperCurrent: 0,
      showErrorImgList: []
    }
  },

  mounted() {
    uni.getSystemInfo({
      success: res => {
        this.setData({
          dpr: res.screenWidth / 491
        })
      }
    })
    this.showErrorImgList = this.dataField.imageList.map(x => { return 0 })
  },

  methods: {
    /**
			 * 点击事件
			 */
    adFun(item) {
      util.toRedirectLink(item.path.type, item.path.link, this.shopId)
      // util.featureRoute(item)
    },
    // 热区跳转
    handleRedirect(item) {
      util.toRedirectLink(item.type, item.link, this.shopId)
    },
    /** 轮播Index*/
    swiperEnd(ev) {
      this.setData({
        swiperCurrent: ev.detail.current || 0
      })
    },
    errImg(index) {
      this.showErrorImgList[index] = 1
      this.$set(this.showErrorImgList, index, 1)
    }

  }
}
</script>
<style>
	@import "./index.css";
</style>
