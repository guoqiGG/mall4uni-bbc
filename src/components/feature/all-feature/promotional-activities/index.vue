<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view v-if="goodsList.length" class="Mall4j snap-up">
    <view class="snap-up-head">
      <text class="snap-up-tit">{{ dataField.activityType==1?'团购':'秒杀' }}</text>
      <view class="more-goods" @tap="toActiveList">
        <text class="more-goods-txt">更多{{ dataField.activityType==1?'团购':'秒杀' }}</text>
        <view class="more-icon">
          <image src="/static/images/icon/more.png" />
        </view>
      </view>
    </view>

    <!-- 列表 -->
    <scroll-view class="snap-up-goods-show" scroll-x="true" :show-scrollbar="false">
      <!-- 商品盒子 -->
      <view v-for="(item, index) in goodsList" :key="index" class="snap-up-goods-box" @tap="setImgs(item, 'show') ? '' : toActiveDetails(item)">
        <view v-if="dataField.activityType==1 && item.groupNumber" class="group-number">{{ item.groupNumber }}{{ i18n.join }}</view>
        <view class="img-box">
          <image v-if="item.pic" mode="aspectFit" :src="item.pic" />
          <image v-else src="/static/images/icon/def.png" />
          <!-- 下架商品蒙版 start -->
          <!-- 限时秒活动 -->
          <view v-if="setImgs(item, 'show')" class="imgs_shelves">
            <image mode="aspectFit" :src="setImgs(item, 'src')" />
          </view>
          <!-- 下架商品蒙版 end -->
          <!-- 拼团人数 -->
          <!-- <view class="group-number" v-if="item.prodType==3 ">

					</view> -->
        </view>
        <view class="snap-up-price">
          <text class="symbol">￥</text>
          {{ toPrice(item.price) }}
        </view>
        <view class="original-price">
          <text class="symbol">￥</text>
          {{ toPrice(item.oriPrice) }}
        </view>
      </view>
      <!-- 查看更多 -->
      <view v-if="goodsList.length > 3" class="view-more" @tap="toActiveList">{{ '查看更多' }}
        <image class="view-more-icon" src="/static/images/icon/more-icon.png" />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import http from '@/utils/http.js'
export default {
  components: {

  },
  props: {
    dataField: {
      type: Object,
      default() {
        return {}
      }
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
      goodsList: [],
      show: false
    }
  },
  computed: {
    setImgs() {
      return (item, val) => {
        const params = {
          status: false,
          imgs: require('../../../../static/images/icon/been_shelves.png')
        }
        if (this.dataField.activityType === 2) { // 秒杀
          if (item.status != 1) { // 当前就显示下架图标
            params.imgs = require('../../../../static/images/icon/been_shelves.png')
            params.status = true
          } else if (item.status === 1 && item.prodType != 2) { // 显示结束图标
            params.imgs = require('../../../../static/images/icon/has_end.png')
            params.status = true
          } else {
            params.status = false
          }
        } else if (this.dataField.activityType === 1) { // 拼团
          if (item.status != 1) { // 当前就显示下架图标
            params.imgs = require('../../../../static/images/icon/been_shelves.png')
            params.status = true
          } else if (item.status === 1 && item.prodType != 1) { // 显示结束图标
            params.imgs = require('../../../../static/images/icon/has_end.png')
            params.status = true
          } else {
            params.status = false
          }
        }
        if (val === 'show') {
          return params.status
        } else if (val === 'src') {
          return params.imgs
        }
      }
    },
    i18n() {
      return this.$t('index')
    }
  },
  mounted() {
    this.goodsList = this.dataField.prodIds
    this.goodsList.reverse()
    // this.getGoodsList()
  },
  methods: {
    /**
     * 跳转活动商品
     */
    toActiveDetails(item) {
      if (item.status != 1) {
        uni.showToast({
          title: '当前商品已下架',
          icon: 'error'
        })
        return
      }
      uni.navigateTo({
        url: '/package-prod/pages/prod/prod?prodId=' + item.prodId
      })
    },
    /**
     * 跳转活动列表
     */
    toActiveList() {
      // activityType: 1团购  2秒杀
      uni.navigateTo({
        url: this.dataField.activityType == 1 ? '/package-activities/pages/a-bulk-list/a-bulk-list' : '/package-activities/pages/snap-up-list/snap-up-list'
      })
    },
    /**
     * 获取活动商品列表
     */
    getGoodsList() {
      const goodsId = []
      if (this.dataField.prodIds.length) {
        this.dataField.prodIds.forEach(item => {
          goodsId.push(item.prodId)
        })
        http.request({
          url: '/search/renovationPage',
          method: 'GET',
          data: {
            prodIds: goodsId.toString(), // this.dataField.prodIds.toString(),
            // prodType: this.dataField.activityType,
            size: 3,
            current: 1,
            getDelete: true
          },
          callBack: res => {
            this.goodsList = res.records.reverse()
          }
        })
      }
    }
  }
}
</script>

<style>
	@import url("./index.css");
</style>
