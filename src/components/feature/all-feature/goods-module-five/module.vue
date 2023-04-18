<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j module-five-component">
    <template v-if="currentForm">
      <view class="goods-top">
        <image src="" />
        <image src="" />
      </view>
      <view class="goods-bottom">
        <template v-for="(item, index) in newArr">
          <view :key="index" class="bottom-items">
            <image src="" />
            <view class="name">商品名称</view>
            <view class="real-price">
              <text>￥</text>
              <text>价格</text>
              <text />
            </view>
          </view>
        </template>

      </view>
    </template>
    <template v-else>
      <view class="goods-top">
        <image v-if="moduleForm.leftMessage.img" :src="moduleForm.leftMessage.img" @tap="handleTap1(moduleForm.leftMessage.path)" />
        <image v-else src="/static/images/icon/def.png" mode="aspectFill" />
        <image v-if="moduleForm.rightMessage.img" :src="moduleForm.rightMessage.img" @tap="handleTap1(moduleForm.rightMessage.path)" />
        <image v-else src="/static/images/icon/def.png" mode="aspectFill" />
      </view>
      <view class="goods-bottom">
        <template v-for="(item, index) in moduleForm.goodsList">
          <view :key="index" class="bottom-items" @tap="handleItems(item)">
            <view class="bottom-items-imgs">
              <image v-if="item.imgs" :src="item.imgs" @error="errorImg(index)" />
              <image v-else src="/static/images/icon/def.png" mode="aspectFill" />
              <view v-if="item.status != 1" class="imgs_shelves">
                <image mode="aspectFit" src="../../../../static/images/icon/been_shelves.png" />
              </view>
            </view>
            <view class="name">{{ item.name }}</view>
            <view class="real-price">
              <text>￥</text>
              <text>{{ getPrice(item.price, 'left') }}.{{ getPrice(item.price, 'right') }}</text>
            </view>
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
    config: {
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
      newArr: new Array(4),
      moduleForm: {}
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
    // 点击图片
    handleTap1(item) {
      util.toRedirectLink(item.type, item.link, this.shopId)
    },
    // 点击商品
    handleItems(item) {
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
	.module-five-component {
		width: 100%;
	}
	.module-five-component .goods-top {
		display: flex;
	}
	.module-five-component .goods-top image {
		width: calc((100% - 18rpx) / 2);
		height: 196rpx;
		margin-right: 18rpx;
		display: flex;
		align-items: center;
		background: rgba(235, 237, 240, 0.39);
		justify-content: center;
		border-radius: 8rpx;
		overflow: hidden;
	}
	.module-five-component .goods-top image:last-child {
		margin-right: 0;
	}
	.module-five-component .goods-bottom {
		width: 100%;
		margin-top: 20rpx;
		display: flex;
		flex-wrap: wrap;
	}
	.module-five-component .goods-bottom .bottom-items {
		width: calc((100% - 54rpx) / 4);
		margin-right: 18rpx;
		height: 240rpx;
		background: #fff;
		border-radius: 8rpx;
		padding: 18rpx 16rpx;
		margin-bottom: 18rpx;
		box-sizing: border-box;
	}
	.goods-bottom .bottom-items .bottom-items-imgs {
		position: relative;
	}
	.goods-bottom .bottom-items .bottom-items-imgs .imgs_shelves {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.module-five-component .goods-bottom .bottom-items:nth-child(4n) {
		margin-right: 0;
	}
	.module-five-component .goods-bottom .bottom-items image {
		width: 100%;
		height: 122rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(243, 245, 247, 0.39);
		border-radius: 4rpx;
		overflow: hidden;
	}
	.module-five-component .goods-bottom .bottom-items .name {
		width: 100%;
		text-align: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		/* padding: 0 16rpx; */
		font-size: 24rpx;
		color: #333;
		font-family: PingFang SC;
		margin: 14rpx 0 8rpx 0;
	}
	.goods-bottom .bottom-items .real-price {
		color: #F81A1A;
		font-weight: bold;
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
	.goods-bottom .bottom-items .real-price text {
		font-size: 24rpx
	}
	.goods-bottom .bottom-items .real-price text:nth-child(1) {
		padding-bottom: 2rpx;
	}
	.goods-bottom .bottom-items .real-price text:nth-child(2) {
		font-size: 26rpx;
		max-width: 80%;
		overflow: hidden;
		white-space: nowrap;
		word-break: break-all;  /* break-all(允许在单词内换行。) */
		text-overflow: ellipsis;  /* 超出部分省略号 */
		display: block; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 1; /** 显示的行数 **/
	}
</style>
