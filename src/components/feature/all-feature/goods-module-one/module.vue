<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j module-one-component">
    <template v-if="currentForm">
      <view class="main-title" style="font-size: 16rpx;color: #333;">主标题</view>
      <view class="sub-title" style="font-size: 12rpx;color: #E6432D;">副标题</view>
      <view class="module-one-goodsList">
        <view class="goods-items">
          <image src="" />
          <view class="real-price">
            <text>￥</text>
            <text>价格</text>
            <text />
          </view>
          <view class="del-price">原价</view>
        </view>
        <view class="goods-items">
          <image src="" />
          <view class="real-price">
            <text>￥</text>
            <text>价格</text>
            <text />
          </view>
          <view class="del-price">原价</view>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="module-one-header" :style="{height: (moduleForm.titleHeight ? (moduleForm.titleHeight + 25) * 2 + 'rpx' : 'auto')}">
        <view
          class="main-title"
          :style="{'color': moduleForm.mainTitleColor, 'font-size': moduleForm.mainTitleSize * 2 + 'rpx', 'line-height': moduleForm.mainTitleSize * 2.3 + 'rpx'}"
        >
          {{ moduleForm.mainTitle }}
        </view>
        <view
          class="sub-title"
          :style="{'color': moduleForm.subTitleColor, 'font-size': moduleForm.subTitleSize * 2 + 'rpx', 'line-height': moduleForm.subTitleSize * 2.3 + 'rpx'}"
        >
          {{ moduleForm.subTitle }}
        </view>
      </view>
      <view class="module-one-goodsList">
        <template v-for="(item, index) in moduleForm.goodsList">
          <view :key="index" class="goods-items" @tap="handleModule(item)">
            <view class="goods-items-imgs">
              <image v-if="item.imgs" :src="item.imgs" mode="aspectFit" @error="errorImg(index)" />
              <image v-else src="/static/images/icon/def.png" mode="aspectFit" />
              <view v-if="item.status != 1" class="imgs_shelves">
                <image mode="aspectFit" src="../../../../static/images/icon/been_shelves.png" />
              </view>
            </view>

            <view class="real-price">
              <text>￥</text>
              <text class="big">
                {{ getPrice(item.price, 'left') }}.
              </text>
              <text>
                {{ getPrice(item.price, 'right') }}
              </text>

            </view>
            <view class="del-price">￥{{ item.orignPrice }}</view>
          </view>
        </template>
      </view>
    </template>
  </view>
</template>

<script>
import util from '../../../../utils/util.js'
export default {
  props: {
    config: { // 配置信息
      type: Object,
      default: () => {}
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
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 点击事件
    handleModule(item) {
      if (item.status != 1) {
        uni.showToast({
          title: '当前商品已下架',
          icon: 'error'
        })
        return
      }
      util.toRedirectLink('1', item.id)
    },
    errorImg(index) {
      this.moduleForm.goodsList[index].imgs = ''
    }
  }
}
</script>

<style scoped>
	.module-one-component {
		width: 100%;
	}
	.module-one-component .module-one-header {
		overflow: hidden;
		margin-bottom: 30rpx;
	}
	.module-one-header .main-title {
		font-family: PingFang SC;
		font-weight: bold;
		margin: 24rpx 0 4rpx 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.module-one-header .sub-title {
		width: 100%;
		font-family: PingFang SC;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.module-one-component .module-one-goodsList {
		width: 100%;
		display: flex;
		overflow: hidden;
		margin-bottom: 36rpx;
	}
	.module-one-goodsList .goods-items {
		width: 50%;
		overflow: hidden;
	}
	.module-one-goodsList .goods-items:nth-child(1) {
		margin-right: 56rpx;
	}
	.module-one-goodsList .goods-items .goods-items-imgs {
		position: relative;
	}
	.module-one-goodsList .goods-items .goods-items-imgs .imgs_shelves {
		position: absolute;
		width: 120rpx;
		height: 120rpx;
		left: 0;
		top: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.module-one-goodsList .goods-items image {
		width: 120rpx;
		height: 120rpx;
		background-color: rgba(243, 245, 247, 0.39);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.module-one-goodsList .goods-items .real-price {
		/* width: 120rpx; */
		color: #E1251B;
		text-align: center;
		margin-top: 16rpx;
		font-family: Microsoft YaHei;
		box-sizing: border-box;
		padding: 0 5rpx;
		display: flex;
		align-items: baseline;
    justify-content: center;
	}
	.goods-items .real-price text {
		font-size: 20rpx;
	}
	.goods-items .real-price .big {
		font-size: 24rpx;
	}
	.goods-items .real-price text:nth-child(1) {
		padding-bottom: 2rpx;
	}
	.goods-items .real-price text:nth-child(2) {
		font-size: 26rpx;
		max-width: 90%;
		overflow: hidden;
		white-space: nowrap;
		word-break: break-all;  /* break-all(允许在单词内换行。) */
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: block; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 1; /** 显示的行数 **/
	}
	.goods-items .del-price {
		font-family: PingFange SC;
		font-weight: bold;
		text-align: center;
		color: #AAAAAA;
		font-size: 22rpx;
		text-decoration: line-through;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-break: break-all;
	}
</style>
