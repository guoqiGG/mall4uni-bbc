<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 轮播图 & 商品视频-->
  <view class="Mall4j swiper-con">
    <view v-if="video && isPlaying" class="video-container">
      <video
        id="myVideo"
        :autoplay="true"
        enable-progress-gesture="false"
        :src="video"
        controls
        @ended="playEnd"
      />
    </view>
    <view v-if="video" class="play-btn" @tap="videoOper">
      <image
        v-if="!isPlaying"
        class="play-icon"
        src="/static/images/icon/play-red.png"
      />
      <text
        v-if="isPlaying"
        :class="'play-text ' + (isPlaying ? 'video-stop' : 'video-play')"
      >{{ isPlaying ? i18n.quitPlaying : "" }}</text>
    </view>
    <swiper
      v-if="!isPlaying"
      :circular="true"
      :indicator-dots="indicatorDots"
      :autoplay="video"
      :indicator-color="indicatorColor"
      :interval="interval"
      :current="currentPicIndex"
      :duration="duration"
      :indicator-active-color="indicatorActiveColor"
    >
      <block v-if="imgsList.length">
        <block v-for="(item, imgIndex) in imgsList" :key="imgIndex">
          <swiper-item>
            <image v-if="item" mode="aspectFit" :src="item" @error="handlePicError($event, imgIndex)" />
            <image
              v-else
              src="/static/images/icon/def.png"
              mode="aspectFit"
            />
          </swiper-item>
        </block>
      </block>
      <!-- <block v-else>
        <swiper-item>
          <image src="/static/images/icon/def.png" mode="aspectFit" />
        </swiper-item>
      </block> -->
    </swiper>
  </view>
  <!-- 轮播图 & 商品视频end -->
</template>

<script>
export default {
  props: {
    imgs: {
      type: String,
      default: ''
    },
    video: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      indicatorDots: true,
      indicatorColor: '#f2f2f2',
      indicatorActiveColor: '#eb2444',
      isAuthInfo: true,
      autoplay: true,
      interval: 3000,
      duration: 1000,
      isPlaying: false,
      // 当前显示商品图像的索引
      currentPicIndex: 0,
      videoContext: '',
      imgsList: []
    }
  },
  computed: {
    // imgsList: {
    //   get() {
    //     return this.imgs.split(',')
    //   },
    //   set() {

    //   }
    // },
    i18n() {
      return this.$t('index')
    }
  },
  watch: {
    imgs: {
      handler: function(val, oldVal) {
        console.log(val)
        this.imgsList = val ? val.split(',') : ['']
      },
      immediate: true
    }
  },

  methods: {
    /**
     * 图片错误显示默认图片
     */
    handlePicError(event, index) {
      // 替换默认图
      this.imgsList = this.imgsList.map((item, idx) => idx == index ? null : item)

      // 切换至有效图
      this.activeIndex = this.imgsList.findIndex(item => item != null)
    },

    /**
     * 视频的方法
     */
    videoOper() {
      if (this.isPlaying) {
        this.stopPlay()
      } else {
        this.startPlay()
      }
    },

    /**
     * 播放结束
     */
    playEnd() {
      this.stopPlay()
    },

    /**
     * 开始播放
     */
    startPlay() {
      this.isPlaying = true
      this.$emit('videoSts', this.isPlaying)

      if (!this.videoContext) {
        this.videoContext = uni.createVideoContext('myVideo')
      }
      setTimeout(() => {
        this.videoContext.seek(0)
        this.videoContext.play()
      }, 200)
    },

    /**
     * 停止播放
     */
    stopPlay() {
      this.isPlaying = false
      this.$emit('videoSts', this.isPlaying)
      setTimeout(() => {
        this.videoContext.seek(0)
        this.videoContext.stop()
      }, 200)
    }
  }
}
</script>

<style scoped>
swiper {
  height: 750rpx;
  width: 100%;
}

swiper image {
  height: 750rpx;
  width: 100%;
}

/* 商品视频 */
.swiper-con {
  position: relative;
}

.video-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 750rpx;
  justify-content: center;
  align-items: center;
  background: #000;
  z-index: 10;
}
.video-container video {
  display: block;
  width: 100%;
  height: 100%;
}

.play-btn {
  position: absolute;
  left: 50%;
  bottom: 12%;
  padding: 2rpx;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 50rpx;
  color: #000;
  font-size: 24rpx;
  text-align: center;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 15;
}

.play-icon {
  width: 50rpx;
  height: 50rpx;
}

.play-text {
  padding-right: 10rpx;
  margin: 0 10rpx;
}

.video-stop {
  padding: 2rpx 8rpx;
}
</style>
