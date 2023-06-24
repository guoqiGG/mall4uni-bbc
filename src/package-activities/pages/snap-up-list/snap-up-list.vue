<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 秒杀专场 -->
  <!-- pages/snap-up-list/snap-up-list.wxml -->
  <view class="Mall4j seckill-box">
    <view class="banner">
      <view
        class="bg"
      ><image
        src="../../static/images/icon/flash-bg.png"
      /></view>
      <view
        class="img"
      ><image
        src="../../static/images/icon/flash-banner.png"
      /></view>
    </view>
    <view class="seckill-list">
      <!-- 秒杀商品 -->
      <block v-for="(item, index) in seckillList" :key="index">
        <view
          class="item"
          @tap="toSeckillDetaile(item.prodId)"
        >
          <!-- 商品图片 -->
          <view class="img-box">
            <image v-if="item.pic" :src="item.pic" mode="aspectFit" @error="handlePicError(index)" />
            <image v-else src="/static/images/icon/def.png" mode="aspectFit" />
          </view>
          <!-- 商品信息 -->
          <view class="goods-msg">
            <!-- 秒杀在进行 -->
            <view v-if="countDownList[index].type === 1" class="countdown-box">
              <view class="tip">{{ i18n.onlyEnd }}</view>
              <view class="num">{{ countDownList[index].day }}</view>
              <view class="text">{{ i18n.day }}</view>
              <view class="num">{{ countDownList[index].hou }}</view>
              <view class="text">:</view>
              <view class="num">{{ countDownList[index].min }}</view>
              <view class="text">:</view>
              <view class="num">{{ countDownList[index].sec }}</view>
            </view>
            <!-- 秒杀未开始 -->
            <view v-if="countDownList[index].type != 1" class="countdown-box">
              <view class="tip">{{ i18n.onlyStart }}</view>
              <view class="num">{{ countDownList[index].day }}</view>
              <view class="text">{{ i18n.day }}</view>
              <view class="num">{{ countDownList[index].hou }}</view>
              <view class="text">:</view>
              <view class="num">{{ countDownList[index].min }}</view>
              <view class="text">:</view>
              <view class="num">{{ countDownList[index].sec }}</view>
            </view>
            <view class="goods-name">
              <view
                v-if="item.price > item.activityPrice"
                class="discounts"
              >{{ i18n.reduce
              }}{{
                item.price > item.activityPrice
                  ? toPrice(item.price - item.activityPrice)
                  : 0
              }}{{ i18n.yuan }}</view>
              <view class="name">{{ item.prodName }}</view>
            </view>
            <view class="progress-box">
              <view class="bg-box">
                <view
                  class="progress"
                  :style="'width: ' + item.salesRatio + '%'"
                />
              </view>
              <view
                class="text"
              >{{ i18n.haveCoupons }}{{ item.salesRatio }}%</view>
            </view>
            <view class="goods-price">
              <view class="price-box">
                <text
                  class="current-price"
                ><text class="sub">￥</text>{{ toPrice(item.activityPrice) }}</text>
                <text
                  v-if="toPrice(item.activityPrice).length < 7 && item.activityOriginalPrice > item.activityPrice"
                  class="original-price"
                >￥{{ toPrice(item.activityOriginalPrice) }}</text>
              </view>
              <view
                v-if="i18n.piece == '件'"
                class="residue"
              >{{ i18n.onlyLeft }}{{ item.seckillSearchVO.seckillTotalStocks
              }}{{ i18n.piece }}</view>
              <view
                v-else
                class="residueEn"
              >{{ i18n.onlyLeft
              }}<text>{{ item.seckillSearchVO.seckillTotalStocks }}</text><text>{{ i18n.piece }}</text></view>
            </view>
          </view>
        </view>
      </block>
      <!-- 空列表或加载全部提示 -->
      <EmptyAllTips
        v-if="isLoaded"
        :isEmpty="seckillList.length == 0"
        :emptyTips="i18n.noMoreActivities"
        :isAll="seckillList.length>10 && loadAll"
      />
    </view>
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')
export default {
  props: {},
  data() {
    return {
      seckillList: [],
      // 秒杀商品列表
      countDownList: [],
      // 秒杀倒计时列表
      countDownEndTimeList: [],
      timer: '',
      current: 1,
      pages: 0,
      loadAll: false, // 已加载全部
      isLoaded: false
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 秒杀商品列表
    this.getSecList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.spikeSpecial
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearTimeout(this.timer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.current < this.pages) {
      this.current = this.current + 1
      this.getSecList()
    } else {
      this.setData({
        loadAll: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  methods: {
    /**
     * 获取秒杀商品列表
     */
    getSecList() {
      this.isLoaded = false
      const params = {
        // url: "/seckill/pageProd",
        url: '/search/page',
        method: 'GET',
        data: {
          current: this.current,
          size: 20,
          prodType: 2,
          isActive: 1, // 过滤掉活动商品
          userId:uni.getStorageSync('bbcUserInfo')?uni.getStorageSync('bbcUserInfo').userId:''
        },
        callBack: (res) => {
          this.isLoaded = true
          const endTimeList = [] // 倒计时数组
          const result = res.records[0].products.filter(item => {
            // 筛选出需要秒杀的商品
            if (item.seckillSearchVO &&
              util.dateToTimestamp(item.seckillSearchVO.endTime) >
                new Date().getTime()) {
              const { seckillOriginStocks, seckillTotalStocks } = item.seckillSearchVO
              // 算出已抢百分比
              item.salesRatio = item.seckillSearchVO.seckillOriginStocks <= 0 ? 100
                : Math.round(
                  (item.seckillSearchVO.seckillOriginStocks - item.seckillSearchVO.seckillTotalStocks) /
                      item.seckillSearchVO.seckillOriginStocks * 100)
              if (item.salesRatio === 0 && seckillOriginStocks - seckillTotalStocks > 0) {
                item.salesRatio = Math.ceil(
                  (item.seckillSearchVO.seckillOriginStocks - item.seckillSearchVO.seckillTotalStocks) /
                      item.seckillSearchVO.seckillOriginStocks * 100)
              }
              if (item.salesRatio === 100 && seckillTotalStocks > 0) {
                item.salesRatio = item.seckillSearchVO.seckillOriginStocks <= 0 ? 100
                  : Math.floor(
                    (item.seckillSearchVO.seckillOriginStocks - item.seckillSearchVO.seckillTotalStocks) /
                      item.seckillSearchVO.seckillOriginStocks * 100)
              }
              var objs = {} // 存储秒杀时间对象
              objs.eTime = item.seckillSearchVO.endTime
              objs.sTime = item.seckillSearchVO.startTime
              objs.countType = null // 1表示秒杀活动正在进行,0表示秒杀活动未开始
              endTimeList.push(objs)
              return true
            }
          })
          this.setData({
            seckillList:
              params.data.current == 1
                ? result
                : this.seckillList.concat(result),
            pages: res.pages,
            countDownEndTimeList:
              params.data.current == 1
                ? endTimeList
                : this.countDownEndTimeList.concat(endTimeList)
          })
          if (res.total <= 4 && res.total > 0) {
            this.setData({
              loadAll: true
            })
          }
          this.countdown()
        }
      }
      http.request(params)
    },

    countdown() {
      clearTimeout(this.timer)
      // 获取当前时间，同时得到活动结束时间数组
      const newTime = new Date().getTime()
      const endTimeList = this.countDownEndTimeList
      const countDownArr = [] // 对结束时间进行处理渲染到页面

      endTimeList.forEach((o) => {
        if (newTime - util.dateToTimestamp(o.sTime) > 0) {
          const endTime = util.dateToTimestamp(o.eTime)
          let obj = null // 如果活动未结束，对时间进行处理

          if (endTime - newTime > 0) {
            const time = (endTime - newTime) / 1000 // 获取天、时、分、秒

            const day = parseInt(time / (60 * 60 * 24))
            const hou = parseInt((time % (60 * 60 * 24)) / 3600)
            const min = parseInt(((time % (60 * 60 * 24)) % 3600) / 60)
            const sec = parseInt(((time % (60 * 60 * 24)) % 3600) % 60)
            obj = {
              day: this.timeFormat(day),
              hou: `${this.timeFormat(hou)}`,
              min: `${this.timeFormat(min)}`,
              sec: `${this.timeFormat(sec)}`,
              type: 1 // 表示秒杀正在进行
            }
          } else { // 活动已结束
            obj = {
              day: '00',
              hou: '00',
              min: '00',
              sec: '00'
            }
          }

          countDownArr.push(obj)
        } else { // 活动未开始
          const startTime = util.dateToTimestamp(o.sTime)
          const time = (startTime - newTime) / 1000
          let obj = null // 获取天、时、分、秒

          const day = parseInt(time / (60 * 60 * 24))
          const hou = parseInt((time % (60 * 60 * 24)) / 3600)
          const min = parseInt(((time % (60 * 60 * 24)) % 3600) / 60)
          const sec = parseInt(((time % (60 * 60 * 24)) % 3600) % 60)
          obj = {
            day: this.timeFormat(day),
            hou: `${this.timeFormat(hou)}`,
            min: `${this.timeFormat(min)}`,
            sec: `${this.timeFormat(sec)}`,
            type: 0 // 表示秒杀还没开始
          }
          countDownArr.push(obj)
        }
      }) // 渲染，然后每隔一秒执行一次倒计时函数

      this.setData({
        countDownList: countDownArr,
        timer: setTimeout(this.countdown, 1000)
      })
    },

    // 小于10的格式化函数
    timeFormat(times) {
      return Number(times) < 10 ? '0' + times : times
    },

    // 跳转秒杀商品详情页
    toSeckillDetaile: function(prodId) {
      uni.navigateTo({
        url: '/package-prod/pages/prod/prod?prodId=' + prodId
      })
    },
    // 图片加载失败时显示默认图片
    handlePicError(index) {
      this.seckillList[index].pic = '/static/images/icon/def.png'
    }
  }
}
</script>
<style>
@import "./snap-up-list.css";
</style>
