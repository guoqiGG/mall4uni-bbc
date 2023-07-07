<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j prod-items" @tap="toProdPage">
    <view class="hot-imagecont">
      <image v-if="item.pic" :src="srcToShow" class="hotsaleimg" mode="aspectFit" @error="handlePicError" />
      <image v-else src="/static/images/icon/def.png" mode="aspectFit" class="hotsaleimg" />
    </view>
    <view class="hot-text">
      <view>
        <view class="hotprod-text">
          <!-- <view class="activity-box">
            <view v-if="item.shopId === 1" class="activity">{{ i18n.selfEmployed }}</view>
            <block v-if="item.activityInProgress && item.prodType != 0">
              <view v-if="item.prodType != 1" class="activity">
                {{ prodTypeArr[item.prodType] }}
              </view>
              <view v-else class="activity">
                {{ item.groupActivitySearchVO.groupNumber }}{{ i18n.join }}
              </view>
            </block>
          </view> -->
          {{ item.prodName }}
        </view>
      </view>
      <view v-if="sts==6" class="prod-info">
        {{ item.commentNum }}{{ i18n.evaluation }} {{ item.positiveRating }}%{{ i18n.praise }}
      </view>
      <view class="prod-text-info" :class="{'collection-row':showCancelCollect}">
        <view class="price">
          <text v-if="sts==2" class="deadline-price">{{ i18n.timeLimitedPrice }}</text>
          <text class="symbol">￥</text>
          <text class="big-num">{{ parsePrice(item.activityInProgress && item.prodType != 0 ? item.activityPrice :item.price)[0] }}</text>
          <text class="small-num">.{{ parsePrice(item.activityInProgress && item.prodType != 0 ? item.activityPrice :item.price)[1] }}</text>
          <!-- <text v-if="item.soldNum || item.soldNum === 0" class="prod-info sold-num">{{ i18n.sold }} {{ item.soldNum }}</text> -->
        </view>
        <view v-if="showCancelCollect" class="collection-btn price small-num" @tap.stop="handleCancelCollection">
          {{ i18n.cancleCollection }} </view>
      </view>
    </view>
  </view>
</template>

<script>
const http = require('../../utils/http.js')

export default {

  components: {},
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    sts: {
      type: String,
      default: ''
    },
    showCancelCollect: Boolean
  },
  data() {
    return {
      isPicError: false,
      prodTypeArr: [],
      sub: 10
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    },
    srcToShow() {
      return this.isPicError ? '../../static/images/icon/def.png' : this.item.pic
    }
  },
  /**
		 * 生命周期函数--监听页面加载
		 */
  created() {
    this.prodTypeArr = [
      this.i18n.prodType1,
      this.i18n.prodType2,
      this.i18n.prodType3,
      this.i18n.prodType4
    ]
    if (this.item.activityInProgress && this.item.prodType != 0) this.sub = 7
  },

  methods: {
    /**
     * 图片加载失败时显示默认图片
     */
    handlePicError() {
      this.isPicError = true
    },

    toProdPage() {
      this.$Router.push({
        path: '/package-prod/pages/prod/prod',
        query: {
          prodId: this.item.prodId
        }
      })
    },
    handleCancelCollection() {
      const params = {
        url: '/p/user/collection/addOrCancel',
        method: 'POST',
        data: this.item.prodId,
        callBack: (res) => {
          uni.showToast({
            title: res ? this.i18n.collectionAdded : this.i18n.collectionCancelled,
            duration: 1200,
            icon: 'none'
          })
          this.$emit('getCollectionProd')
        }
      }
      http.request(params)
    }
  }
}
</script>
<style>
	@import "./index.css";
</style>
