<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j bar-sticky" :style="[
    isBgImg
      ? { backgroundImage: navigationBarStyle.backgroundImage }
      : { background: navigationBarStyle.background },
  ]">
    <!-- <image v-if="isMinePage" class="top-bg-img" src="/static/images/icon/mine-bg.png" mode="top" /> -->
    <view class="content-wrap">
      <view class="status-line" :style="{
        height: lineHeight,
      }" />
      <view class="bar-line">
        <view class="bar-line container-in">
          <view v-if="!custom" class="bar-font bar-content" :class="{ 'left-text': isLeft }">
            <!-- <view
            class="icon-fanhui bar-back rt_pos"
            :style="{ 'border-color': navigationBarStyle.iconColor || normal.iconColor }"
            @click="$turnPage('1', 'navigateBack')"
            v-if="showBack"
          >
          </view> -->
            <image v-if="showBack && isWhiteBack" class="back-img" src="../../static/images/icon/back-white.png" mode=""
              @click="$turnPage('1', 'navigateBack')" />
            <image v-if="showBack && !isWhiteBack" class="back-img" src="../../static/images/icon/back.png" mode=""
              @click="$turnPage('1', 'navigateBack')" />
            <view v-if="showTitle" class="bar-title" :style="{ color: navigationBarStyle.fontColor || normal.fontColor }">
              {{ title }}
            </view>
          </view>
          <view v-else class="bar-font container-in">
            <slot />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    custom: {
      type: Boolean,
      default: false
    }, // 自定义头部，否则沿用原生的头部样式
    navigationBarStyle: {
      type: Object,
      default: function () {
        return {
          background: '#005AFF',
          fontColor: '#000000',
          iconColor: '#000000'
        }
      }
    }, // 原生头部自定义样式
    showBack: {
      type: Boolean,
      default: false
    }, // 是否显示回退图标，默认显示
    isBgImg: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    url: {
      type: String,
      default: ''
    },
    isLeft: {
      type: Boolean,
      default: false
    },
    isWhiteBack: {
      type: Boolean,
      default: false
    },
    // 是否是我的页面
    isMinePage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      normal: {
        backgroundImage: ``,
        background: '#005AFF',
        fontColor: '#000000',
        iconColor: '#000000'
      }, // 公用样式,个性化样式可通过传值实现
      lineHeight: '', // 状态栏高度
      bgStyle: {}
    }
  },
  mounted() {
    this.lineHeight = this.$system.ktxStatusHeight + 'rpx'
  },
  methods: {
    $turnPage(x, y) {
      if (this.url) {
        this.$Router.push({
          path: this.url
        })
      } else {
        uni.navigateBack(-1)
      }
    }
  }
}
</script>

<style scoped>
/*正中*/
.bar-content {
  width: 100%;
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  justify-content: center;
}

/* 导航栏吸顶效果 */
.bar-sticky {
  top: 0;
  z-index: 101;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

.left-text {
  justify-content: flex-start;
  margin-left: 30rpx;
}

/*垂直居中*/
.container-in {
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  width: 100%;
  height: 44px;
}

.bar-line {
  height: 44px;
  /* 导航栏高度 */
}

.bar-line .bar-back {
  font-size: 52rpx !important;
  position: absolute;
  left: 30rpx;
}

.bar-line .bar-title {
  font-size: 30rpx;
  font-weight: bold;
  line-height: 44rpx;
}

/*
.rt_pos {
  position: absolute;
  right: 50rpx;
  top: 150rpx;
  content: "";
  display: inline-block;
  height: 20rpx;
  width: 20rpx;
  border-width: 0 0 2px 2px;
  border-color: #fff;
  border-style: solid;
  transform: matrix(0.71, 0.71, -.71, 0.71, 0, 0);
  -webkit-transform: matrix(0.71, 0.71, -.71, 0.71, 0, 0);
} */
.back-img {
  width: 34rpx;
  height: 34rpx;
  position: absolute;
  left: 30rpx;
}

.top-bg-img {
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
}

.content-wrap {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
