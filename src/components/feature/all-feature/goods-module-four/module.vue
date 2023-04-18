<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j module-four-component">
    <template v-if="currentForm">
      <view class="top-image">
        <image src="" />
      </view>
      <view class="bottom-content">
        <template v-for="(item, index) in newArr">
          <view :key="index" class="bottom-items">
            <image src="" />
            <view class="goods-description">商品名称</view>
            <view class="bottom-actions">
              <view class="real-price">
                <text>￥</text>
                <text>价格</text>
                <text />
              </view>
              <view class="add-carts">
                <text>+</text>
              </view>
            </view>
          </view>
        </template>
      </view>
    </template>
    <template v-else>
      <view class="top-image" @tap="handleImg(moduleForm.path)">
        <image v-if="moduleForm.topImg" :src="moduleForm.topImg" />
        <image v-else src="/static/images/icon/def.png" />
      </view>
      <view class="bottom-content">
        <template v-for="(item, index) in moduleForm.goodsList">
          <view :key="index" class="bottom-items" @tap.stop="handleItems(item)">
            <view class="bottom-items-imgs">
              <image v-if="item.imgs" :src="item.imgs" @error="errorImg(index)" />
              <image v-else src="/static/images/icon/def.png" mode="aspectFill" />
              <view v-if="item.status != 1" class="imgs_shelves">
                <image mode="aspectFit" src="../../../../static/images/icon/been_shelves.png" />
              </view>
            </view>
            <view class="goods-description">{{ item.name }}</view>
            <view class="bottom-actions">
              <view class="real-price">
                <text>￥</text>
                <text>{{ getPrice(item.price, 'left') }}.{{ getPrice(item.price, 'right') }}</text>
              </view>
              <view class="add-carts" @tap.stop="handleAdd(item)">
                <text>+</text>
              </view>
            </view>
          </view>
        </template>
      </view>
    </template>
  </view>
</template>

<script>
const http = require('../../../../utils/http.js')
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
      newArr: new Array(3), // 数组占比
      moduleForm: {}, // 模块信息
      prodInfo: {}
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    },
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
    handleImg(item) {
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
    // 添加到购物车
    handleAdd(item) {
      if (item.status != 1) {
        uni.showToast({
          title: '当前商品已下架',
          icon: 'error'
        })
        return
      }
      this.prodInfo = item
      util.checkAuthInfo(this.getProdInfo)
    },
    getProdInfo() {
      http.request({
        url: '/prod/prodInfo',
        method: 'GET',
        data: {
          prodId: this.prodInfo.id
        },
        callBack: (res) => {
          this.callChangeItem(res)
        }
      })
    },
    errorImg(index) {
      this.moduleForm.goodsList[index].imgs = ''
    },
    callChangeItem(data) {
      const that = this
      http.request({
        url: '/p/shopCart/changeItem',
        method: 'POST',
        data: {
          basketId: 0,
          count: 1,
          prodId: data.prodId,
          shopId: data.shopId,
          shopName: data.shopName,
          skuId: data.skuList[0].skuId,
          distributionCardNo: ''
        },
        callBack: (res) => {
          util.tapLog(4, null, null, 1)
          http.getCartCount()
          uni.showToast({
            title: that.i18n.successfullyAddedCart,
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
	.module-four-component {
		width: 100%;
		height: 100%;
		min-height: 572rpx;
		position: relative;
		overflow: hidden;
	}
	.module-four-component .top-image {
		width: 100%;
		height: 196rpx;
		border-radius: 12rpx 12rpx 0 0;
		overflow: hidden;
	}
	.module-four-component .top-image image {
		width: 100%;
		height: 100%;
		background: rgba(235, 237, 240, 0.39);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.module-four-component .bottom-content {
		min-height: 396rpx;
		background-color: #fff;
		display: flex;
		flex-wrap: wrap;
		border-radius: 20rpx;
		padding: 20rpx 16rpx;
		position: relative;
		margin-top: -20rpx;
	}
	.module-four-component .bottom-content .bottom-items {
		width: calc((100% - 28rpx) / 3);
		margin-right: 14rpx;
		margin-bottom: 14rpx;
	}
	.bottom-content .bottom-items .bottom-items-imgs {
		position: relative;
	}
	.bottom-content .bottom-items .bottom-items-imgs .imgs_shelves {
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
	.module-four-component .bottom-content .bottom-items:nth-child(3n) {
		margin-right: 0;
	}

	.module-four-component .bottom-content .bottom-items image {
		width: 214rpx;
		height: 200rpx;
		background: rgba(243, 245, 247, 0.39);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.module-four-component .bottom-content .bottom-items .goods-description {
		font-size: 24rpx;
		height: 68rpx;
		line-height: 34rpx;
		padding: 0 16rpx;
		text-align: center;
		color: #333333;
		font-family: PingFang SC;
		margin: 20rpx 0 8rpx 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
	}
	.module-four-component .bottom-content .bottom-items .bottom-actions {
		display: flex;
		justify-content: space-between;
		padding: 0 16rpx;
		align-items: center;
	}
	.bottom-content .bottom-items .bottom-actions .real-price {
		color: #F81A1A;
		width: calc(100% - 44rpx);
		display: flex;
		font-weight: bold;
		justify-content: center;
		align-items: flex-end;
	}
	.bottom-content .bottom-items .bottom-actions .real-price text {
		font-size: 20rpx;
		font-family: bold;
		font-family: PingFang SC;
	}
	.bottom-content .bottom-items .bottom-actions .real-price text:nth-child(1) {
		padding-bottom: 2rpx;
	}
	.bottom-content .bottom-items .bottom-actions .real-price text:nth-child(2) {
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
	.bottom-content .bottom-items .bottom-actions .add-carts {
		width: 36rpx;
		height: 36rpx;
		line-height: 36rpx;
		border-radius: 50%;
		text-align: center;
		color: #fff;
		font-size: 36rpx;
		background: linear-gradient(180deg, #FF6A37 0%, #FF302A 100%);
		position: relative;
	}
	.bottom-content .bottom-items .bottom-actions .add-carts text {
		position: absolute;
		left: 50%;
		top: 42%;
		transform: translate(-50%, -50%);
	}
</style>
