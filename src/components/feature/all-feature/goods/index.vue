<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view v-if="dataField.size!=1" class="Mall4j goods-box">
    <view v-for="(item, index) in nGoods" :key="index" class="goods-box-item">
      <view v-for="(goodsItem, goodsIndex) in item" :key="goodsIndex" class="goods-item" @tap.stop="goodsFun(goodsItem, goodsItem.prodId)">
        <view class="goods-item-content" :class="{'goods-item-three':dataField.size==3}">

          <view
            class="goods-img"
            :class="{'goods-img-three':dataField.size==3}"
            :style="{width: dataField.size===3 ? 218 + 'rpx' : 305 + 'rpx', height: dataField.size===3 ? 218 + 'rpx' : 305 + 'rpx'}"
          >
            <ImgShow :src="goodsItem.pic" imgMode="aspectFit" :imgStyle="{width:'100%',height:'100%'}" />
            <view v-if="goodsItem.status != 1" class="imgs_shelves">
              <image mode="aspectFit" src="../../../../static/images/icon/been_shelves.png" />
            </view>
          </view>
          <view class="goods-box-info" :class="{'goods-box-info-three':dataField.size==3}">
            <view v-if="state.productName" class="goods-info-title" :class="{'goods-info-title-three':dataField.size==3}">
              {{ goodsItem.prodName }}
            </view>
            <view v-if="state.sellingPoint" class="goods-info-desc">
              <text>{{ goodsItem.brief || '' }}</text>
            </view>
            <view v-if="state.price || state.buyBtn" class="goods-info-price  goods-cell-3" :class="{'goods-info-price-three':dataField.size==3}">
              <view v-if="state.price" class="price-info">
                <text class="symbol">￥</text>
                <text class="big-num">{{ parsePrice(goodsItem.price)[0] }}</text>
                <text class="small-num">.{{ parsePrice(goodsItem.price)[1] }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
  <!-- 一列 -->
  <view v-else class="goods-box-one">
    <view v-for="(goodsItem, index) in nGoods[0]" :key="index" class="goods-one-column-item" @tap.stop="goodsFun(goodsItem, goodsItem.prodId)">
      <view class="goods-img-one">
        <ImgShow :src="goodsItem.pic" />
        <view v-if="goodsItem.status != 1" class="imgs_shelves">
          <image mode="aspectFit" src="../../../../static/images/icon/been_shelves.png" />
        </view>
      </view>
      <view class="goods-info-one">
        <view v-if="state.productName" class="goods-name-one">
          {{ goodsItem.prodName }}
        </view>
        <view v-if="state.sellingPoint" class="goods-brief-one">
          {{ goodsItem.brief || '' }}
        </view>
        <view v-if="state.price" class="goods-price-one">
          <text class="symbol">¥ </text>
          <text class="big-num">{{ parsePrice(goodsItem.price)[0] }}</text>
          <text class="small-num">.{{ parsePrice(goodsItem.price)[1] }}</text>
        </view>
      </view>
    </view>
  </view>

</template>

<script>
// import http from '@/utils/http.js'
export default {

  components: {
    // vanTag
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
      goods: [],
      nGoods: [],
      state: {
        // 显示状态
        productName: false,
        // 1
        sellingPoint: false,
        // 2
        price: false,
        // 3
        buyBtn: false // 4
      },
      locking: false
    }
  },

  mounted() {
    const data = this.dataField
    console.log('shagnp', data)
    // const goodsId = []
    this.setData({
      state: {
        // 显示状态
        productName: data.showContent.find(x => x * 1 === 1),
        // 1
        sellingPoint: data.showContent.find(x => x * 1 === 2),
        // 2
        price: data.showContent.find(x => x * 1 === 3),
        // 3
        buyBtn: data.showContent.find(x => x * 1 === 4) // 4
      }
    })
    this.goods = this.sortList(data.goods)
    this.carding()
    // if (this.dataField.goods && !this.locking) {
    //   data.goods.forEach(item => {
    //     goodsId.push(item.prodId)
    //   })
    //   this.locking = true
    //   http.request({
    //     url: '/search/renovationPage',
    //     method: 'GET',
    //     data: {
    //       prodIds: goodsId.toString(), // this.dataField.goods.toString(),
    //       current: 1,
    //       size: goodsId.length,
    //       getDelete: true
    //     },
    //     callBack: res => {
    //       this.locking = false
    //       this.goods = this.sortList(res.records)
    //       this.carding()
    //     }
    //   })
    // }
  },

  methods: {
    /** 梳理数据*/
    carding() {
      const dataField = this.dataField
      // 单独一列
      if (dataField.size == 1) {
        this.nGoods.push(this.goods)
        return
      }
      // 两列或三列
      const columnNum = dataField.size || 2
      let cur = 1
      const cell_1 = []
      const cell_2 = []
      const cell_3 = []
      this.goods.map((li, index) => {
        if (cur === 1) {
          cell_1.push(li)
        } else if (cur === 2) {
          cell_2.push(li)
        } else if (cur === 3) {
          cell_3.push(li)
        }
        cur++
        if (cur > columnNum) {
          cur = 1
        }
        if (index === this.goods.length - 1) {
          this.nGoods.push(cell_1, cell_2)
          if (cell_3.length) {
            this.nGoods.push(cell_3)
          }
          this.setData({
            nGoods: this.nGoods
          })
        }
      })
    },

    /**
			 * 点击商品事件
			 * */
    goodsFun(item, id) {
      if (item.status != 1) {
        uni.showToast({
          title: '当前商品已下架',
          icon: 'error'
        })
        return
      }
      uni.navigateTo({
        url: '/pages/prod/prod?prodId=' + id
      })
    },

    /**
			 * 按照装修的id排序
			 */
    sortList(goodsList) {
      const showArr = this.dataField.goods
      const result = goodsList.sort(function(a, b) {
        return showArr.map(s => s.prodId).indexOf(a.prodId) < showArr.map(s => s.prodId).indexOf(b.prodId) ? -1 : 1
      })
      return result
    }
  }
}
</script>
<style>
	@import "./index.css";
</style>
