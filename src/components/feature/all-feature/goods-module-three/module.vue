<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="module-three-component">
    <!-- 当为空的时候显示 start -->
    <template v-if="currentForm">
      <view class="goods-three-title">主标题</view>
      <view class="goods-three-items">
        <image src="" />
        <view class="right-content">
          <view class="description">商品名称</view>
          <view class="right-actions">
            <view class="left-price">
              <view class="real-price">
                <text>￥</text>
                <text>价格</text>
                <text>价格</text>
              </view>
              <view class="del-price">原价</view>
            </view>
            <view class="right-go">
              <view>去抢购</view>
            </view>
          </view>
        </view>
      </view>
    </template>
    <!-- 当为空的时候显示 end -->
    <template v-else>
      <view class="goods-three-title">{{ moduleForm.mainTitle }}</view>
      <template v-for="(item, index) in moduleForm.goodsList">
        <view :key="index" class="goods-three-items">
          <view class="goods-three-items-imgs">
            <image v-if="item.imgs" :src="item.imgs" @error="errorImg(index)" />
            <image v-else src="/static/images/icon/def.png" />
            <view v-if="item.status != 1" class="imgs_shelves">
              <image mode="aspectFit" src="../../../../static/images/icon/been_shelves.png" />
            </view>
          </view>
          <view class="right-content">
            <view class="description">{{ item.name }}</view>
            <view class="right-actions">
              <view class="left-price">
                <view class="real-price">
                  <text>￥</text>
                  <text>{{ getPrice(item.price, 'left') }}.{{ getPrice(item.price, 'right') }}</text>
                </view>
                <view class="del-price">￥{{ getPrice(item.orignPrice, 'left') }}.{{ getPrice(item.orignPrice, 'right') }}</view>
              </view>
              <view class="right-go" @tap="handleTap(item)">
                <view>去抢购</view>
              </view>
            </view>
          </view>
        </view>
      </template>
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
    handleTap(item) {
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
	.module-three-component {
		height: 100%;
		padding: 0 24rpx;
		border-radius: 12rpx;
		overflow: hidden;
	}
	.module-three-component .goods-three-title {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #333333;
		margin: 16rpx 0;
	}

	.module-three-component .goods-three-items {
		display: flex;
		margin-bottom: 24rpx;
	}
	.goods-three-items .goods-three-items-imgs {
		position: relative;
	}
	.imgs_shelves {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.module-three-component .goods-three-items image {
		width: 204rpx;
		height: 204rpx;
		background: rgba(243, 245, 247, 0.39);
		border-radius: 12rpx;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.module-three-component .goods-three-items .right-content {
		width: calc(100% - 204rpx);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-left: 20rpx;
		box-sizing: border-box;
	}
	.module-three-component .goods-three-items .right-content .description {
		width: 90%;
		font-size: 26rpx;
		color: #333;
		font-family: PingFang SC;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
	}
	.goods-three-items .right-content .right-actions {
		display: flex;
		justify-content: space-between;
	}
	.goods-three-items .right-content .right-actions .left-price .real-price text{
		font-size: 22rpx;
		font-weight: bold;
		color: #E13E2D;
		font-family: PingFang SC;
	}
	.goods-three-items .right-content .right-actions .left-price .real-price text:nth-child(2) {
		font-size: 26rpx;
	}
	.goods-three-items .right-content .right-actions .left-price .del-price {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #AAAAAA;
		text-decoration: line-through;
		margin-bottom: 6rpx;
		margin-top: 4rpx;
	}
	.goods-three-items .right-content .right-actions .right-go {
		display: flex;
		align-items: center;
	}
	.goods-three-items .right-content .right-actions .right-go view {
		width: 140rpx;
		height: 56rpx;
		background: linear-gradient(270deg, #FF6A37 0%, #FF302A 100%);
		opacity: 1;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-family: PingFang SC;
		font-size: 24rpx;
	}
</style>
