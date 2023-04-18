<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <view v-if="!isMap" class="search">
      <image src="/static/images/icon/search.png" class="img" />
      <input
        class="input"
        :placeholder="i18n.findPickUpPoints"
        @input="getInt"
        @confirm="search()"
      >
    </view>
    <view v-if="!isMap" class="select-store">
      <view v-if="stationList.length" class="store-list">
        <view class="list-tit flex-sb">
          <view>{{ i18n.recentPickUpPoint }}</view>
          <view class="flex-sb" @tap="selectLoaction">
            <image class="relocation-icon" src="/static/images/icon/location.png" mode="" />
            <text>{{ i18n.relocation }}</text>
          </view>
        </view>
        <radio-group @change="stationRadioChange">
          <view class="item">
            <radio
              class="check"
              :value="stationList[0] ? String(stationList[0].stationId) : ''"
              :checked="stationId == stationList[0].stationId"
              @tap="getStationItem(stationList[0])"
            />
            <view class="store-info">
              <view class="name">
                <view class="text">{{ stationList[0].stationName }}</view>
                <view class="distance">{{ stationList[0].distanceCont }}</view>
              </view>
              <view class="address">
                {{ i18n.address }}：{{ stationList[0].province }}{{ stationList[0].city }}{{ stationList[0].area }}{{ stationList[0].addr }}
              </view>
              <view class="time">
                {{ i18n.pickUpTime }}：{{ stationList[0].timeDate.startTime + " - " + stationList[0].timeDate.endTime }}
              </view>
            </view>
          </view>
        </radio-group>

        <view class="list-tit">{{ i18n.pickupNearby }}</view>
        <radio-group
          v-for="(item, index) in stationList"
          :key="index"
          @change="stationRadioChange"
        >
          <view v-if="index > 0" class="item">
            <radio
              class="check"
              :value="String(item.stationId)"
              :checked="stationId == item.stationId"
              @tap="getStationItem(item)"
            />
            <view class="store-info">
              <view class="name">
                <view class="text">{{ item.stationName }}</view>
                <view class="distance">{{ item.distanceCont }}</view>
              </view>
              <view class="address">{{ i18n.address }}：{{ item.province }}{{ item.city }}{{ item.area }}{{ item.addr }}</view>
              <view class="time">{{ i18n.pickUpTime }}：{{ item.timeDate.startTime + " - " + item.timeDate.endTime }}</view>
            </view>
          </view>
        </radio-group>
      </view>
      <view v-if="stationList.length" class="foot-btn">
        <view class="btn" @tap="saveAndUse">{{ i18n.saveAndUse }}</view>
      </view>
      <!-- <view v-if="!stationList.length && isLoad" class="st-empty">{{ i18n.noData }}</view> -->
      <!-- 空列表或加载全部提示 -->
      <EmptyAllTips
        v-if="isLoaded"
        :isEmpty="!stationList.length"
      />
    </view>
    <!-- #ifdef APP-PLUS -->
    <!-- 腾讯地图组件 -->
    <view v-if="isMap" class="map">
      <view class="goOut" @click="isMapReturn">{{ i18n.Back }}</view>
      <web-map v-if="isMap" @onGetLocation="onGetLocation" />
    </view>
    <!-- end 腾讯地图组件 -->
    <!-- #endif -->
  </view>
</template>

<script>
const http = require('@/utils/http.js')
const locTrans = require('@/utils/locTrans.js')
const config = require('@/utils/config.js')
var Big = require('@/utils/big.min.js')
export default {
  data() {
    return {
      lat: '', // 纬度
      lng: '', // 经度
      searchStationName: '', // 自提点名称
      stationList: [], // 自提点列表
      stationId: 0, // 选中自提点id
      current: 1,
      size: 7,
      pages: 1,
      selStationItem: {}, // 选择的自提点item
      orderEntry: 0,
      key: 'L4DBZ-VSSKJ-GCDFX-KGBVR-KHZ2J-RNF2Q',
      isMap: false,
      isLoad: false,
      isLoaded: false
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  onLoad: function(options) {
    if (options.shopId) {
      this.shopId = options.shopId
    }
    if (options.orderEntry) {
      this.orderEntry = options.orderEntry
    }
    // #ifdef H5
    if (!options.module) {
      // 获取地理位置信息
      this.getCurrentLocation()
    } else {
      this.confirmLocation({
        latitude: options.latng.split(',')[0],
        longitude: options.latng.split(',')[1]
      })
    }
    // #endif

    // #ifndef H5
    this.getCurrentLocation()
    // #endif
  },
  onShow: function() {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.selectPickUpPoint
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.current < this.pages) {
      this.current = this.current + 1
      this.getUserStation()
    }
  },
  methods: {
    /**
     * 获取当前地理位置
     */
    getCurrentLocation: function() {
      uni.showLoading()
      uni.getLocation({
        type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回国测局坐标，可用于 uni.openLocation 的坐标，app平台高德SDK仅支持返回gcj02
        altitude: true,
        isHighAccuracy: true,
        highAccuracyExpireTime: 3500,
        success: (res) => {
          uni.hideLoading()
          if (res) {
            console.log('当前位置', res)
            this.confirmLocation(res)
          }
        },
        fail: (res) => {
          uni.showToast({
            title: this.i18n.locateFailure,
            icon: 'none',
            duration: 1500
          })
        },
        complete: () => {
          uni.hideLoading()
        }
      })
      // #ifdef APP-PLUS || MP-WEIXIN
      // #endif
    },
    /**
     * 打开地图选择地址
     */
    selectLoaction() {
      // 重置当前页码
      this.current = 1
      // #ifdef H5
      const backUrl = encodeURIComponent(config.domainAddress + this.$Route.path + '?orderEntry=' + this.orderEntry + '&shopId=' + this.shopId)
      window.location.replace(`https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=${backUrl}&key=${this.key}&referer=myapp`)
      // #endif

      // #ifdef APP-PLUS
      this.isMap = true
      // #endif

      // #ifdef MP-WEIXIN
      uni.chooseLocation({
        success: (res) => {
          this.onGetLocation(res)
        },
        fail: (failMsg) => {
          uni.getSetting({
            success: (res) => {
              if (!res.authSetting['scope.userLocation']) {
                uni.authorize({
                  scope: 'scope.userLocation',
                  success: () => {
                    uni.chooseLocation({
                      success: (res) => {
                        this.onGetLocation(res)
                      }
                    })
                  },
                  fail: () => {
                    uni.showToast({
                      title: this.i18n.authorityTips,
                      icon: 'none'
                    })
                  }
                })
              }
            }
          })
        }
      })
      // #endif
    },
    /**
     * 确认地址
     */
    onGetLocation(loc) {
      // #ifdef H5 || APP-PLUS
      this.lat = loc.latlng.lat
      this.lng = loc.latlng.lng
      this.isMap = false
      // #endif

      // #ifdef MP-WEIXIN
      this.lat = loc.latitude // 纬度
      this.lng = loc.longitude // 经度
      // #endif

      this.confirmLocation({ latitude: this.lat, longitude: this.lng })
    },
    isMapReturn() {
      uni.setNavigationBarTitle({
        title: this.i18n.selectPickUpPoint
      })
      this.isMap = false
    },

    /**
     * 转换经纬度请求自提点列表
     * @param {Obj} locationRes 当前定位信息
     */
    confirmLocation(locationRes) {
      let locationObj
      // #ifdef APP-PLUS || MP-WEIXIN
      locationObj = locTrans.gcj02tobd09(locTrans.wgs84togcj02(locationRes))
      // #endif

      // #ifdef H5
      locationObj = locTrans.gcj02tobd09(locationRes)
      // #endif

      this.lat = locationObj.latitude
      this.lng = locationObj.longitude
      this.getUserStation()
    },

    /**
     * 请求自提点列表
     */
    getUserStation: function() {
      this.isLoaded = false
      const params = {
        url: '/p/station/userstation',
        method: 'GET',
        data: {
          current: this.current,
          size: this.size,
          lat: this.lat, // 纬度 '23.151021',
          lng: this.lng, // 经度 '113.326621',
          stationName: this.searchStationName,
          shopId: this.shopId
        },
        callBack: (res) => {
          this.isLoaded = true
          res.records.forEach((el) => {
            el.timeDate = JSON.parse(el.timeDate)
            el.timeDate.startTime = this.formatDuring(
              el.timeDate.shopTime[0]
            ).dateStr2 // 自提点开始时间
            el.timeDate.endTime = this.formatDuring(
              el.timeDate.shopTime[1]
            ).dateStr2 // 自提点结束时间
            if (el.stationStartTime == 1) {
              // var nowdate = this.formatDuring(new Date()).date1
            }
            if (el.distance > 1000) {
              el.distance = new Big(el.distance)
              // 保留两位小数
              Big.DP = 2
              // 向下取整
              // big.RM = 3
              el.distance = el.distance.div(1000).valueOf()
              el.distanceCont = el.distance + 'km'
            } else {
              el.distanceCont = el.distance + 'm'
            }
          })
          this.stationList = res.current == 1 ? res.records : this.stationList.concat(res.records)
          this.pages = res.pages
          this.current = res.current
          this.isLoad = true
        },
        errCallBack: (e) => {
          this.isLoad = true
          uni.showToast({
            title: this.i18n.serverWrong,
            icon: 'none'
          })
        }
      }
      http.request(params)
    },

    /**
     * 时间转换
     */
    formatDuring: function(mss) {
      var time = new Date(mss)
      var year = time.getFullYear() // getFullYear方法以四位数字返回年份
      var month = time.getMonth() + 1 // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
      var days = time.getDate() // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
      var hours = time.getHours() // getHours方法返回 Date 对象的小时 (0 ~ 23)
      var minutes = time.getMinutes() // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
      var seconds = time.getSeconds() // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
      var data = {}
      data.year = year
      data.month = month < 10 ? '0' + month : month
      data.days = days < 10 ? '0' + days : days
      data.hours = hours < 10 ? '0' + hours : hours
      data.minutes = minutes < 10 ? '0' + minutes : minutes
      data.seconds = seconds < 10 ? '0' + seconds : seconds
      return {
        date1: data.year + '-' + data.month + '-' + data.days,
        dateStr: data.hours + ':' + data.minutes + ':' + data.seconds,
        dateStr2: data.hours + ':' + data.minutes
      }
    },

    /**
     * 搜索自提点
     */
    getInt: function(e) {
      this.searchStationName = e.detail.value
    },

    search: function() {
      this.getUserStation()
    },

    /**
     * 自提点选择
     */
    stationRadioChange: function(e) {
      this.stationId = e.detail.value
    },

    /**
     * 获取当前选中的自提点item
     */
    getStationItem: function(item) {
      this.selStationItem = item
    },

    /**
     * 保存并使用
     */
    saveAndUse: function() {
      if (JSON.stringify(this.selStationItem) == '{}') {
        wx.showToast({
          title: this.i18n.selStore,
          icon: 'none',
          duration: 1500
        })
        return
      }
      uni.setStorageSync('bbcSelStationItem', this.selStationItem)
      uni.setStorageSync('bbcOrderEntry', this.orderEntry)
      uni.setStorageSync('bbcDvyType', '2')
      uni.navigateBack(1)
    }
  }
}
</script>

<style>
@import "./select-store.css";
</style>
