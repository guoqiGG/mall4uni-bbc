<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <!--input列表 -->
    <view v-if="!isMap" class="input-box">
      <view class="section">
        <text>{{ i18n.recipient }}</text>
        <input :placeholder="i18n.recipientName" type="text" maxlength="15" :value="receiver" @input="onReceiverInput"></input>
      </view>
      <view class="section">
        <text>{{ i18n.mobilePhone }}</text>
        <input :placeholder="i18n.mobileNumberLength" type="number" maxlength="11" :value="mobile" @input="onMobileInput"></input>
      </view>
      <view class="section" @tap="translate">
        <text>{{ i18n.area }}</text>
        <view v-if="areaArray.length" class="pca">{{ province }} {{ city }} {{ area }}</view>
        <view v-else class="pca placeholder-text">{{ i18n.selectProvinceCity }}</view>
        <template v-if="showPicker">
          <view class="animation-element-wrapper" :animation="animation" :style="'visibility:' + (show ? 'visible':'hidden')" @tap.stop="hiddenFloatView">
            <view class="animation-element" @tap.stop="nono">
              <text class="right-bt" @tap.stop="hiddenFloatView">{{ i18n.confirm }}</text>
              <view class="line" />
              <picker-view indicator-style="height: 70rpx;" :value="value" @change="bindChange" @tap.stop="nono">
                <!--省-->
                <picker-view-column>
                  <view v-for="(item, index) in provArray" :key="index">{{ item.areaName }}</view>
                </picker-view-column>
                <!--地级市-->
                <picker-view-column>
                  <view v-for="(item, index) in cityArray" :key="index">{{ item.areaName }}</view>
                </picker-view-column>
                <!--区县-->
                <picker-view-column>
                  <view v-for="(item, index) in areaArray" :key="index">{{ item.areaName }}</view>
                </picker-view-column>
              </picker-view>
            </view>
          </view>

        </template>
        <view class="arrow">
          <image src="/static/images/icon/more.png" />
        </view>
      </view>
      <view class="section">
        <text>{{ i18n.detailedAddress }}</text>
        <input class="addr" :placeholder="i18n.addressTips" type="text" :value="addr" maxlength="50" @input="onAddrInput"></input>
        <view class="arrow add-icon" @tap="selectLoaction">
          <image src="/static/images/icon/submit-address.png" />
        </view>
      </view>
    </view>
    <!-- end input列表 -->
    <!-- 功能按钮 -->
    <view v-if="!isMap" class="btn-box">
      <view class="keep btn" @tap="onSaveAddr">
        <text>{{ i18n.saveAddress }}</text>
      </view>

      <view v-if="addrId!=0" class="clear btn" @tap="onDeleteAddr">
        <text>{{ i18n.deleteAddress }}</text>
      </view>
    </view>
    <!-- end 功能按钮 -->

    <!-- #ifdef APP-PLUS -->
    <!-- 腾讯地图组件 -->
    <view v-if="isMap" class="map">
      <web-map v-if="isMap" @onGetLocation="onGetLocation" />
    </view>
    <!-- end 腾讯地图组件 -->
    <!--  #endif -->
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')
const config = require('../../../utils/config.js')
const locTrans = require('@/utils/locTrans.js')

var t = 0
var show = false
var moveY = 200
let index = [18, 0, 0]
console.log(index)
export default {

  components: {},
  props: {},
  data() {
    return {
      value: [0, 0, 0],
      addrInfoList: [],
      provArray: [],
      cityArray: [],
      areaArray: [],
      province: '',
      city: '',
      area: '',
      provinceId: 0,
      cityId: 0,
      areaId: 0,
      receiver: '',
      mobile: '',
      addr: '',
      addrId: 0,
      animation: '',
      show: '',
      lat: '',
      lng: '',
      showPicker: false,
      key: 'L4DBZ-VSSKJ-GCDFX-KGBVR-KHZ2J-RNF2Q',
      isMap: false,
      isPosition: false,
      isEdit: false
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  onLoad: async function(options) {
    // 获取地址列表信息
    // const addrList = await this.getAreaListInfo()
    // this.setData({
    //   provArray: addrList,
    //   addrInfoList: addrList
    // })

    this.isEdit = !!options.addrId
    console.log('this.isEdit', this.isEdit)
    console.log('options.addrId', options.addrId)
    if (options.addrId) {
      if (!options.module) {
        // 获取地址详情
        this.getAddressInfoById(options.addrId)
      } else {
        this.afterLoc(options)
      }
    }
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function() {
    // 加载导航标题
    uni.setNavigationBarTitle({
      title: this.isEdit ? this.i18n.editShippingAddress : this.i18n.addNewAddress
    })
  },
  onHide: function() {
    this.showPicker = false
  },
  onReady: function() {
    this.animation = wx.createAnimation({
      transformOrigin: '50% 50%',
      duration: 0,
      timingFunction: 'ease',
      delay: 0
    })
    this.animation.translateY(200 + 'vh').step()
    this.setData({
      animation: this.animation.export(),
      show: show
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  methods: {
    /**
     * 获取到定位后的回调
     * loc 定位信息
     */
    afterLoc(loc) {
      this.addrId = uni.getStorageSync('bbcAddrInfo').addrId
      this.mobile = uni.getStorageSync('bbcAddrInfo').mobile
      this.receiver = uni.getStorageSync('bbcAddrInfo').receiver
      if (loc && loc.module === 'locationPicker') { // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
        this.addr = loc.addr
        this.lat = loc.latng.split(',')[0]
        this.lng = loc.latng.split(',')[1]
        this.isMap = false
        util.area(loc.addr, loc.name).then(res => {
          if (!res) return
          const addrReplacrstr = res[0].name + res[1].name + res[2].name
          this.addr = this.addr.replace(addrReplacrstr, '') || loc.name
          this.setData({
            value: [res[0].index, res[1].index, res[2].index],
            province: res[0].name,
            city: res[1].name,
            area: res[2].name,
            provinceId: res[0].areaId,
            cityId: res[1].areaId,
            areaId: res[2].areaId,
            provArray: res[3],
            cityArray: res[4],
            areaArray: res[5]
          })
          index = this.value
        })
        this.isPosition = true
        this.setProvinceId(this.province)
      }
    },

    /**
     * 获取地址详情
     */
    getAddressInfoById(addrId) {
      const params = {
        url: '/p/address/addrInfo/' + addrId,
        method: 'GET',
        data: {},
        callBack: res => {
          console.log(res)
          this.setData({
            provinceId: res.provinceId,
            cityId: res.cityId,
            areaId: res.areaId,
            receiver: res.receiver,
            mobile: res.mobile,
            addr: res.addr,
            addrId: addrId,
            lat: res.lat,
            lng: res.lng
          })
          this.initCityData(this.provinceId, this.cityId, this.areaId)
        }
      }
      http.request(params)
    },
    /**
     * 确认地址
     */
    onGetLocation(loc) {
      // #ifdef H5 || APP-PLUS
      this.addr = loc.poiaddress
      this.lat = loc.latlng.lat
      this.lng = loc.latlng.lng
      this.name = loc.poiname
      this.isMap = false
      // #endif

      // #ifdef MP-WEIXIN
      this.lat = loc.latitude // 纬度
      this.lng = loc.longitude // 经度
      this.addr = loc.address // 详细地址
      this.name = loc.name // 详细地址
      // #endif

      util.area(this.addr, this.name).then(res => {
        if (!res) return
        this.addr = this.addr.replace(res[0].name + res[1].name + res[2].name, '') || res.poiname
        this.setData({
          value: [res[0].index, res[1].index, res[2].index],
          province: res[0].name,
          city: res[1].name,
          area: res[2].name,
          provinceId: res[0].areaId,
          cityId: res[1].areaId,
          areaId: res[2].areaId,
          provArray: res[3],
          cityArray: res[4],
          areaArray: res[5]
        })
      })
      const locationInfo = { latitude: this.lat, longitude: this.lng }
      let locationRes
      // #ifdef H5 || APP-PLUS
      locationRes = locTrans.gcj02tobd09(locTrans.wgs84togcj02(locationInfo))
      // #endif

      // #ifdef MP-WEIXIN
      locationRes = locTrans.gcj02tobd09(locationInfo)
      // #endif
      this.lat = locationRes.latitude
      this.lng = locationRes.longitude
    },

    // 根据地图修改省份ID
    setProvinceId(province) {
      for (let i = 0; i < this.provArray.length; i++) {
        if (this.provArray[i].areaName === province) {
          const value = this.value
          value[0] = i
          this.setData({
            provinceId: this.provArray[i].areaId,
            value: value
          })
          this.getCityArray(this.provArray[i].areaId)
        }
      }
    },
    // 根据地图修改市ID
    setCityId(city) {
      for (let i = 0; i < city.length; i++) {
        if (city[i].areaName === this.city) {
          const value = this.value
          value[1] = i
          this.setData({
            cityId: city[i].areaId,
            value: value
          })
          this.getAreaArray(this.cityId)
        }
      }
    },
    // 根据地图修改区ID
    setAreaId(area) {
      for (let i = 0; i < area.length; i++) {
        if (area[i].areaName === this.area) {
          const value = this.value
          value[2] = i
          this.setData({
            areaId: area[i].areaId,
            value: [value[0], value[1], value[2]],
            isPosition: false
          })
          return uni.hideLoading()
        }
      }
    },

    /**
     * 打开地图选择地址
     */
    selectLoaction() {
      // #ifdef H5
      uni.setStorageSync('bbcAddrInfo', { addrId: this.addrId, mobile: this.mobile, receiver: this.receiver })
      const backUrl = decodeURIComponent(config.domainAddress + this.$Route.path + '?addrId=' + this.addrId || 0)
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
        fail: () => {
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
                    this.isPosition = true
                    this.setProvinceId(this.province)
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

    // 获取地址列表
    getAreaListInfo() {
      return new Promise((resolve, reject) => {
        // const params =
        http.request({
          url: '/p/area/getAreaListInfo',
          method: 'GET',
          data: {},
          callBack: (res) => {
            console.log(res)
            resolve(res)
          }
        })
      })
    },

    // 获取当前id下的地址信息
    listAreaByParentId(pid) {
      let paramData = {}
      if (!pid) {
        paramData = { level: 1 }
      } else {
        paramData = { pid }
      }
      return new Promise((resolve, reject) => {
        const params = {
          url: '/p/area/listByPid',
          method: 'GET',
          data: paramData,
          callBack: (res) => {
            resolve(res)
          }
        }
        http.request(params)
      })
    },
    // 获取当前节点下的地址
    getCurrentAreas(curList, curId) {
      for (const item of curList) {
        if (item.areaId === curId) {
          return {
            curNode: item,
            areas: item.areas
          }
        }
      }
    },

    initCityData: async function(provinceId, cityId, areaId) {
      // 获取省列表
      if (!this.provArray.length) {
        const provArray = await this.listAreaByParentId()
        this.setData({
          provArray
        })
      }

      if (provinceId) {
        for (let i = 0, len = this.provArray.length; i < len; i++) {
          if (this.provArray[i].areaId === provinceId) {
            this.setData({
              value: [Number(i), this.value[1], this.value[2]],
              province: this.provArray[i].areaName
            })
          }
        }
      }
      this.getCityArray(provinceId || this.provArray[0].areaId, cityId, areaId)
    },

    // 滑动事件
    bindChange: function(e) {
      var ths = this
      var val = e.detail.value // 判断滑动的是第几个column

      // 若省份column做了滑动则定位到地级市和区县第一位
      if (ths.value[0] != val[0]) {
        val[1] = 0
        val[2] = 0 // 更新数据
        console.log('省份改变', ths.provArray[val[0]].areaId)
        ths.getCityArray(ths.provArray[val[0]].areaId) // 获取地级市数据
      } else {
        // 若省份column未做滑动，地级市做了滑动则定位区县第一位
        if (ths.value[1] != val[1]) {
          val[2] = 0 // 更新数据

          ths.getAreaArray(ths.cityArray[val[1]].areaId) // 获取区县数据
        }
      }

      index = val
      ths.setData({
        value: [val[0], val[1], val[2]]
      })
      ths.setData({
        province: ths.provArray[ths.value[0]].areaName,
        city: ths.cityArray[ths.value[1]].areaName,
        area: ths.areaArray[ths.value[2]].areaName,
        provinceId: ths.provArray[ths.value[0]].areaId,
        cityId: ths.cityArray[ths.value[1]].areaId,
        areaId: ths.areaArray[ths.value[2]].areaId
      })
    },

    // 移动按钮点击事件
    translate: function(e) {
      // if (t == 0) {
      moveY = 0
      show = false
      t = 1
      // } else {
      //   moveY = 200
      //   show = true
      //   t = 0
      // }
      this.initCityData(this.provinceId, this.cityId, this.areaId)
      this.setData({
        show: true,
        showPicker: true
      })

      this.animationEvents(this, moveY, show)
    },

    // 隐藏弹窗浮层
    hiddenFloatView(e) {
      // console.log(e);
      moveY = 200
      show = true
      t = 0
      this.initCityData(this.provinceId, this.cityId, this.areaId)
      this.animationEvents(this, moveY, show)
    },

    // 动画事件
    animationEvents: function(that, moveY, show) {
      that.animation = wx.createAnimation({
        transformOrigin: '50% 50%',
        duration: 400,
        timingFunction: 'ease',
        delay: 0
      })
      that.animation.translateY(moveY + 'vh').step()
      that.setData({
        animation: that.animation.export()
      })
    },

    /**
     * 根据省份ID获取 城市数据
     */
    getCityArray: async function(provinceId, cityId, areaId) {
      const { curNode, areas } = this.getCurrentAreas(this.provArray, provinceId)
      let cityArray = areas
      if (!areas) {
        console.log('请求市列表')
        cityArray = await this.listAreaByParentId(provinceId)
      }
      curNode.areas = cityArray
      this.setData({
        cityArray
      })

      // if (this.isPosition) {
      //   this.setCityId(this.cityArray)
      //   return
      // }
      if (cityId) {
        for (let i = 0, len = this.cityArray.length; i < len; i++) {
          if (this.cityArray[i].areaId === cityId) {
            this.setData({
              value: [this.value[0], i, this.value[2]],
              city: this.cityArray[i].areaName
            })
          }
        }
      }

      this.getAreaArray(cityId || this.cityArray[0].areaId, areaId)
    },

    /**
      * 根据城市ID获取 区数据
      */
    getAreaArray: async function(cityId, areaId) {
      const { curNode, areas } = this.getCurrentAreas(this.cityArray, cityId)
      let areaArray = areas
      if (!areas) {
        console.log('请求区列表')
        areaArray = await this.listAreaByParentId(cityId)
      }
      curNode.areas = areaArray
      this.setData({
        areaArray
      })

      // if (this.isPosition) {
      //   this.setAreaId(this.areaArray)
      //   return
      // }
      if (areaId) {
        for (let i = 0, len = this.areaArray.length; i < len; i++) {
          if (this.areaArray[i].areaId === areaId) {
            this.setData({
              value: [this.value[0], this.value[1], i],
              area: this.areaArray[i].areaName
            })
          }
        }

        index = this.value
        this.setData({
          province: this.province,
          city: this.city,
          area: this.area,
          provinceId: this.provinceId,
          cityId: this.cityId,
          areaId: this.areaId
        })
      } else {
        this.setData({
          province: this.provArray[this.value[0]].areaName,
          city: this.cityArray[this.value[1]].areaName,
          area: this.areaArray[this.value[2]].areaName,
          provinceId: this.provArray[this.value[0]].areaId,
          cityId: this.cityArray[this.value[1]].areaId,
          areaId: this.areaArray[this.value[2]].areaId
        })
      }
    },

    /**
     * 保存地址
     */
    onSaveAddr: function() {
      var ths = this
      var receiver = ths.receiver
      var mobile = ths.mobile
      var area = ths.area
      var addr = ths.addr
      if (!receiver) {
        uni.showToast({
          title: ths.i18n.consigneeTips,
          icon: 'none'
        })
        return
      }
      if (!mobile) {
        uni.showToast({
          title: ths.i18n.enterMobileNumber,
          icon: 'none'
        })
        return
      }
      if (!area) {
        uni.showToast({
          title: ths.i18n.selectArea,
          icon: 'none'
        })
        return
      }
      if (!util.checkPhoneNumber(mobile)) {
        uni.showToast({
          title: ths.i18n.enterCorrectPhone,
          icon: 'none'
        })
        return
      }
      if (!addr || addr.length < 5) {
        uni.showToast({
          title: ths.i18n.selectDetailedAddress,
          icon: 'none'
        })
        return
      }
      var url = '/p/address/addAddr'
      var method = 'POST'

      if (ths.addrId != 0) {
        url = '/p/address/updateAddr'
        method = 'PUT'
      } // 添加或修改地址

      const params = {
        url: url,
        method: method,
        data: {
          receiver: ths.receiver,
          mobile: ths.mobile,
          addr: ths.addr,
          province: ths.province,
          provinceId: ths.provinceId,
          city: ths.city,
          cityId: ths.cityId,
          areaId: ths.areaId,
          area: ths.area,
          userType: 0,
          addrId: ths.addrId,
          lat: ths.lat, // 经度
          lng: ths.lng // 纬度
        },
        callBack: function(res) {
          uni.navigateBack({
            delta: 1
          })
        }
      }
      http.request(params)
    },
    onReceiverInput: function(e) {
      this.setData({
        receiver: e.detail.value
      })
    },
    onMobileInput: function(e) {
      this.setData({
        mobile: e.detail.value
      })
    },
    onAddrInput: function(e) {
      this.setData({
        addr: e.detail.value
      })
    },
    // 删除配送地址
    onDeleteAddr: function(e) {
      var ths = this
      uni.showModal({
        title: '',
        content: ths.i18n.deleteAddressTips,
        cancelText: ths.i18n.cancel,
        confirmText: ths.i18n.confirm,
        confirmColor: '#eb2444',

        success(res) {
          if (res.confirm) {
            var addrId = ths.addrId
            const params = {
              url: '/p/address/deleteAddr/' + addrId,
              method: 'DELETE',
              data: {},
              callBack: function(res) {
                uni.navigateBack({
                  delta: 1
                })
              }
            }
            http.request(params)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }

      })
    },
    // 空方法
    nono() {

    }
  }
}

</script>
<style>
@import "./edit-address.css";
</style>
