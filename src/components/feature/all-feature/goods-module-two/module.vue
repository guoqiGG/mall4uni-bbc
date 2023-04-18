<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j module-two-component">
    <!-- 当为空的时候显示默认 start -->
    <template v-if="currentForm">
      <view class="module-left">
        <view class="module-left-header">
          <view class="header-top">
            <view class="main-title">主标题</view>
            <view class="sub-title">副标题</view>
          </view>
          <view class="header-bottom">
            <text>立即抢购</text>
            <image src="../../../../static/images/icon/more.png" />
          </view>
        </view>
        <view class="module-left-content">
          <image src="" />
        </view>
      </view>
      <view class="module-right">
        <view class="module-right-top">
          <view class="right-top-left">
            <view class="header-title">
              <view class="main-title">主标题</view>
              <view class="sub-title">副标题</view>
            </view>
            <view class="show-redirect">
              <text>立即抢购</text>
              <image src="../../../../static/images/icon/more.png" />
            </view>
          </view>
          <view class="right-top-right">
            <image src="" />
          </view>
        </view>
        <view class="module-right-bottom">
          <view class="right-top-left">
            <view class="header-title">
              <view class="main-title">主标题</view>
              <view class="sub-title">副标题</view>
            </view>
            <view class="show-redirect">
              <text>立即抢购</text>
              <image src="../../../../static/images/icon/more.png" />
            </view>
          </view>
          <view class="right-top-right">
            <image src="" />
          </view>
        </view>
      </view>
    </template>
    <!-- 当为空的时候显示默认 end -->
    <!-- 当不为空的时候显示内容 start -->
    <template v-else>
      <view class="module-left">
        <view class="module-left-header">
          <view class="header-top">
            <view
              class="main-title"
              :style="{
                'color': moduleForm.leftConfig.mainTitleColor,
                'font-size': moduleForm.leftConfig.mainTitleSize * 2 + 'rpx'
              }"
            >{{ moduleForm.leftConfig.mainTitle }}</view>
            <view
              class="sub-title"
              :style="{
                'color': moduleForm.leftConfig.subTitleColor,
                'font-size': moduleForm.leftConfig.subTitleSize * 2 + 'rpx'
              }"
            >{{ moduleForm.leftConfig.subTitle }}</view>
          </view>
          <view class="header-bottom" @tap="handleSnapp(moduleForm.leftConfig.path)">
            <text>立即抢购</text>
            <image src="../../../../static/images/icon/more.png" />
          </view>
        </view>
        <view class="module-left-content">
          <image v-if="moduleForm.leftConfig.imgMessage.img" :src="moduleForm.leftConfig.imgMessage.img" @tap="handleSnapp(moduleForm.leftConfig.imgMessage.path)" />
		  <image v-else src="/static/images/icon/def.png" @tap="handleSnapp(moduleForm.leftConfig.imgMessage.path)" />
        </view>
      </view>
      <view class="module-right">
        <view class="module-right-top">
          <view class="right-top-left">
            <view class="header-title">
              <view
                class="main-title"
                :style="{
                  'color': moduleForm.topConfig.mainTitleColor,
                  'font-size': moduleForm.topConfig.mainTitleSize * 2 + 'rpx'
                }"
              >{{ moduleForm.topConfig.mainTitle }}</view>
              <view
                class="sub-title"
                :style="{
                  'color': moduleForm.topConfig.subTitleColor,
                  'font-size': moduleForm.topConfig.subTitleSize * 2 + 'rpx'
                }"
              >{{ moduleForm.topConfig.subTitle }}</view>
            </view>
            <view class="show-redirect" @tap="handleSnapp(moduleForm.topConfig.path)">
              <text>立即抢购</text>
              <image src="../../../../static/images/icon/more.png" />
            </view>
          </view>
          <view class="right-top-right" @tap="handleSnapp(moduleForm.topConfig.imgMessage.path)">
            <image v-if="moduleForm.topConfig.imgMessage.img" :src="moduleForm.topConfig.imgMessage.img" />
			<image v-else src="/static/images/icon/def.png" />
          </view>
        </view>
        <view class="module-right-bottom">
          <view class="right-top-left">
            <view class="header-title">
              <view
                class="main-title"
                :style="{
                  'color': moduleForm.bottomConfig.mainTitleColor,
                  'font-size': moduleForm.bottomConfig.mainTitleSize * 2 + 'rpx'
                }"
              >{{ moduleForm.bottomConfig.mainTitle }}</view>
              <view
                class="sub-title"
                :style="{
                  'color': moduleForm.bottomConfig.subTitleColor,
                  'font-size': moduleForm.bottomConfig.subTitleSize * 2 + 'rpx'
                }"
              >{{ moduleForm.bottomConfig.subTitle }}</view>
            </view>
            <view class="show-redirect" @tap="handleSnapp(moduleForm.bottomConfig.path)">
              <text>立即抢购</text>
              <image src="../../../../static/images/icon/more.png" />
            </view>
          </view>
          <view class="right-top-right" @tap="handleSnapp(moduleForm.bottomConfig.imgMessage.path)">
            <image v-if="moduleForm.bottomConfig.imgMessage.img" :src="moduleForm.bottomConfig.imgMessage.img" />
			<image v-else src="/static/images/icon/def.png" />
          </view>
        </view>
      </view>
    </template>
    <!-- 当不为空的时候显示内容 end -->
  </view>
</template>

<script>
import util from '../../../../utils/util.js'
export default {
  props: {
    config: { // 配置信息
      type: Object,
      default: () => {}
    },
    shopId: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      moduleForm: {} // 模块信息
    }
  },
  computed: {
    currentForm() { // 当前模块的信息是否为空
      return JSON.stringify(this.moduleForm) === '{}'
    },
    getPrice() { // 得到价格
      return (price, type) => {
        if (!price) return
        const point = price.toString().indexOf('.') // 如果为-1则表示没找到
        let leftPrice = ''
        let rightPrice = ''
        if (point === -1) { // 当前是整数
          leftPrice = price
          rightPrice = '00'
        } else {
          leftPrice = price.toString().slice(0, point)
          rightPrice = price.toString().slice(point + 1)
        }
        switch (type) {
          case 'left':
            return leftPrice
          case 'right':
            return rightPrice
          default:
            break
        }
      }
    }
  },
  watch: {
    config: {
      handler(newVal, oldVal) {
        this.moduleForm = {
          ...newVal
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 立即抢购
    handleSnapp(item) {
      util.toRedirectLink(item.type, item.link, this.shopId)
    }
  }
}
</script>

<style scoped>
.module-two-component {
	width: 100%;
	display: flex;
	overflow: hidden;
}
/* 左边样式信息 */
.module-two-component .module-left {
	width: 50%;
	height: 100%;
}
.module-two-component .module-left .module-left-header {
	overflow: hidden;
}
.module-left .module-left-header .header-top {
	margin: 24rpx 0 8rpx 24rpx;
	display: flex;
	align-items: center;
	line-height: 1;
}
.module-left .module-left-header .header-top .main-title {
	font-family: PingFang SC;
	font-weight: bold;
	font-size: 30rpx;
	white-space: nowrap;
	max-width: calc(50% - 5px);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	word-break: break-all;
}
.module-left .module-left-header .header-top .sub-title {
	font-size: 24rpx;
	margin-left: 16rpx;
	white-space: nowrap;
	max-width: calc(50% - 5px);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	word-break: break-all;
}
.module-left .module-left-header .header-bottom {
	margin: 6rpx 0 0 24rpx;
	display: flex;
	align-items: center;
}
.module-left .module-left-header .header-bottom text {
	color: #999;
	font-size: 22rpx;
	font-family: PingFang SC;
	display: inline-block;
}
.module-left .module-left-header .header-bottom image {
	width: 18.8rpx;
	height: 18.8rpx;
	margin-left: 2rpx;
}
.module-left .module-left-content {
	margin-left: 48rpx;
	margin-top: 34rpx;
}
.module-left .module-left-content image {
	width: 232rpx;
	height: 220rpx;
	background: rgba(243, 245, 247, 0.39);
	display: flex;
	align-items: center;
	justify-content: center;
}
/* 右边样式信息 */
.module-right {
	width: 50%;
	border-left: 2rpx solid #F9F9FB;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
}
.module-right .module-right-top {
	width: 100%;
	overflow: hidden;
	border-bottom: 1px solid #F9F9FB;
	display: flex;
}
.module-right .module-right-top .right-top-left {
	width: 50%;
	padding-left: 14rpx;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.module-right .module-right-top .right-top-left .header-title {
	margin-top: 24rpx;
}
.module-right .module-right-top .right-top-left .main-title {
	font-family: PingFang SC;
	font-weight: bold;
	white-space: nowrap;
	font-size: 30rpx;
	text-overflow: ellipsis;
	overflow: hidden;
}
.module-right .module-right-top .right-top-left .sub-title {
	margin-top: 4rpx;
	white-space: nowrap;
	font-size: 22rpx;
	text-overflow: ellipsis;
	overflow: hidden;
}
.module-right .module-right-top .right-top-left .show-redirect {
	margin-bottom: 22rpx;
	margin-top: 36rpx;
	display: flex;
	align-items: center;
}
.module-right .module-right-top .right-top-left .show-redirect text {
	font-size: 24rpx;
	color: #999;
}
.module-right .module-right-top .right-top-left .show-redirect image {
	width: 18.8rpx;
	height: 18.8rpx;
	color: #999;
	margin-left: 2rpx;
}

.module-right .module-right-top .right-top-right {
	width: 50%;
	padding: 50rpx 0 0 7.5rpx;
}
.module-right .module-right-top .right-top-right image {
	width: 128rpx;
	height: 128rpx;
	background: rgba(243, 245, 247, 0.39);
	display: flex;
	align-items: center;
	justify-content: center;
}
.module-right .module-right-bottom {
	width: 100%;
	overflow: hidden;
	display: flex;
}
.module-right .module-right-bottom .right-top-left {
	width: 50%;
	padding-left: 14rpx;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.module-right .module-right-bottom .right-top-left .header-title {
	margin-top: 24rpx;
}
.module-right .module-right-bottom .right-top-left .header-title .main-title {
	font-size: 30rpx;
	font-family: PingFang SC;
	font-weight: bold;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
.module-right .module-right-bottom .right-top-left .header-title .sub-title {
	font-size: 22rpx;
	margin-top: 4rpx;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
.module-right .module-right-bottom .right-top-left .show-redirect {
	margin-bottom: 22rpx;
	margin-top: 36rpx;
	display: flex;
	align-items: center;
}
.module-right .module-right-bottom .right-top-left .show-redirect text {
	font-size: 24rpx;
	color: #999;
}
.module-right .module-right-bottom .right-top-left .show-redirect image {
	width: 18.8rpx;
	height: 18.8rpx;
	margin-left: 2rpx;
	color: #999;
}
.module-right .module-right-bottom .right-top-right {
	width: 50%;
	padding: 40rpx 0 0 7.5rpx;
}
.module-right .module-right-bottom .right-top-right image {
	width: 128rpx;
	height: 128rpx;
	background: rgba(243, 245, 247, 0.39);
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
