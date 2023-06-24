<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <view class="main">
      <!-- 信息输入框 -->
      <view class="section">
        <input :placeholder="i18n.mobilePhone" type="number" maxlength="11" @input="onMobileInput">
      </view>
      <view v-if="needRealName" class="section">
        <input :placeholder="i18n.actualName" type="text" @input="onRealNameInput" />
      </view>
      <view v-if="needIdCardNo" class="section">
        <input :placeholder="i18n.identification" type="text" maxlength="18" @input="onIdCardNoInput" />
      </view>


      <!-- 有无实体店 -->
      <view class="station_have">
        <view :class="['station_have_item', stationHave == 1 ? 'station_have_item1' : '']" @tap="changeStationHave(1)">
          <view class="title">有实体门店</view>
          <view class="desc">如便利店、快递站点等</view>
          <image class="checked" v-if="stationHave == 1" src="/static/images/icon/checked.png"></image>
        </view>
        <view :class="['station_have_item', stationHave == 0 ? 'station_have_item1' : '']" @tap="changeStationHave(0)">
          <view class="title">无实体门店</view>
          <view class="desc">如小区、住宅等</view>
          <image class="checked" v-if="stationHave == 0" src="/static/images/icon/checked.png"></image>
        </view>
      </view>

      <view class="section" @tap="translate" v-if="stationHave == 1">
        <!-- <text>{{ i18n.area }}</text> -->
        <view v-if="areaArray.length" class="pca">{{ province }} {{ city }} {{ area }}</view>
        <view v-else class="pca placeholder-text">{{ i18n.selectArea }}</view>
        <template v-if="showPicker">
          <view class="animation-element-wrapper" :animation="animation"
            :style="'visibility:' + (show ? 'visible' : 'hidden')" @tap.stop="hiddenFloatView">
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
        <!-- <view class="arrow">
          <image src="/static/images/icon/more.png" />
        </view> -->
      </view>
      <!-- 自提点名称 -->
      <view class="section" v-if="stationHave == 1">
        <input placeholder="自提点名称" type="text" maxlength="18" @input="onStationNameInput" />
      </view>

      <view v-if="neddIdCardPic">
        <view class="upload" @tap="uploadIdCardFront">
          <image v-if="identityCardPicFrontCom" :src="identityCardPicFrontCom" @error="identityCardPicFrontCom = ''" />
          <text v-else>{{ i18n.uploadIDFront }}</text>
        </view>
        <view class="upload" @tap="uploadIdCardBack">
          <image v-if="identityCardPicBackCom" :src="identityCardPicBackCom" @error="identityCardPicBackCom = ''" />
          <text v-else>{{ i18n.uploadIDBack }}</text>
        </view>
        <view class="upload" @tap="uploadIdCardHold">
          <image v-if="identityCardPicHoldCom" :src="identityCardPicHoldCom" @error="identityCardPicHoldCom = ''" />
          <text v-else>{{ i18n.uploadIDHand }}</text>
        </view>
      </view>


      <!-- 提交申请栏 -->
      <view class="submit-btn" @tap="submitDisterApply">
        <text>{{ i18n.submitApplication }}</text>
      </view>
      <!--end 提交申请栏 -->

      <!-- 返回首页 -->
      <view v-if="showIndexBtn" class="submit-btn plain-btn" @tap="toIndex">
        <text>{{ i18n.backHomepage }}</text>
      </view>
      <!--end 返回首页  -->

      <!-- 系统判定的条件展示 -->
      <view v-if="distributionCondition.autoCheck === 1" class="system-decision">
        <view class="system-decision-title">
          {{ i18n.autoCheck }}
        </view>
        <view class="requirements">
          <view v-if="distributionCondition.expenseNumber" class="requirement-item">
            {{ i18n.consumptionTimes }} {{ distributionCondition.expenseNumber }}{{ i18n.afterConfirm }}
          </view>
          <view v-if="distributionCondition.expenseAmount" class="requirement-item">
            {{ i18n.spendingAmount }} {{ distributionCondition.expenseAmount }}{{ i18n.afterConfirm }}
          </view>
          <view v-if="distributionCondition.prodIdList && prodList.length" class="requirement-item">
            <view class="prod-title">
              {{ i18n.buyDesignatedProd }}{{ i18n.afterConfirm }}
            </view>
            <view class="prod-con">
              <block v-for="(item, key) in prodList" :key="key">
                <prod :item="item" />
              </block>
            </view>
          </view>
        </view>
      </view>
      <!-- 系统判定的条件展示 end -->
    </view>
    <hCompress ref="hCompress" />
    <hCompress ref="hCompress2" />
    <hCompress ref="hCompress3" />
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')
import prod from '../../../components/production/index.vue'
import hCompress from '@/components/helang-compress/helang-compress'
var t = 0
var show = false
var moveY = 200
let index = [18, 0, 0]
export default {

  components: {
    prod,
    hCompress
  },
  props: {},

  data() {
    return {
      identityCardNumber: '',
      identityCardPicBack: '',
      identityCardPicFront: '',
      identityCardPicHold: '',
      identityCardPicBackCom: '',
      identityCardPicFrontCom: '',
      identityCardPicHoldCom: '',
      realName: '',
      sharerCardNo: '',
      shopId: 1,
      stationName: '',
      stationHave: 1,
      userMobile: '',
      needIdCardNo: false,
      neddIdCardPic: false,
      needRealName: false,
      distributionCardNo: '',
      // 返回首页按钮显隐 (扫码进入时显示)
      showIndexBtn: false,
      // 申请分销员的条件
      distributionCondition: {},
      // 指定的商品列表
      prodList: [],
      windowHeight: 0,

      //获取地址相关信息
      value: [0, 0, 0],
      show: '',
      showPicker: false,
      province: '',
      city: '',
      area: '',
      provinceId: 0,
      cityId: 0,
      areaId: 0,
      provArray: [],
      cityArray: [],
      areaArray: [],
      animation: '',
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  onShow: function () {
    // this.upDataPage()
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.applyDistributor
    })

    this.showIndexBtn = getCurrentPages().length <= 1

    if (this.$Route.query.scene) {
      // #ifdef MP-WEIXIN || MP-TOUTIAO
      const scene = decodeURIComponent(this.$Route.query.scene)
      this.setData({
        distributionCardNo: scene
      })
      // #endif

      // #ifdef H5 || APP-PLUS
      this.distributionCardNo = this.$Route.query.scene
      // #endif

      this.distUserInfo()
    } else {
      this.getApplyInfo()
    }
  },
  onReady: function () {
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    uni.getSystemInfo({
      success(res) {
        that.windowHeight = res.windowHeight
      }
    })

    if (this.$Route.query.scene) {
      // #ifdef MP-WEIXIN || MP-TOUTIAO
      const scene = decodeURIComponent(this.$Route.query.scene)
      this.setData({
        distributionCardNo: scene
      })
      // #endif

      // #ifdef H5 || APP-PLUS
      this.distributionCardNo = this.$Route.query.scene
      // #endif

      this.distUserInfo()
    } else {
      this.getApplyInfo()
    }
  },
  onHide: function () {
    this.showPicker = false
  },
  methods: {
    /**
     * 返回首页
     */
    toIndex() {
      util.toHomePage()
    },
    // 隐藏软键盘
    hideKeyboard() {
      setTimeout(function () {
        var field = document.createElement('input')
        field.setAttribute('type', 'text')
        field.setAttribute('style', 'position:absolute; top: 0px; opacity: 0; -webkit-user-modify: read-write-plaintext-only; left:0px;')
        document.body.appendChild(field)
        field.onfocus = function () {
          setTimeout(function () {
            field.setAttribute('style', 'display:none;')
            setTimeout(function () {
              document.body.removeChild(field)
              document.body.focus()
            }, 14)
          }, 200)
        }
        field.focus()
      }, 50)
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
    initCityData: async function (provinceId, cityId, areaId) {
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
    bindChange: function (e) {
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
    translate: function (e) {
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
    animationEvents: function (that, moveY, show) {
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
    getCityArray: async function (provinceId, cityId, areaId) {
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
    getAreaArray: async function (cityId, areaId) {
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
    // 空方法
    nono() {

    },

    /**
       * 获取分销员信息
       */
    distUserInfo() {
      const that = this
      util.checkAuthInfo(() => {
        http.request({
          url: '/p/distribution/user/distributionUserInfo',
          method: 'GET',
          callBack: res => {
            if (res && res.state == 1) {
              uni.setStorageSync('bbcDistCardNo', res.cardNo)
              uni.setStorageSync('bbcDistInfo', res)
              uni.redirectTo({
                url: '/package-distribution/pages/dis-center/dis-center'
              })
            } else if (res && res.state == 0) {
              uni.showModal({
                title: '',
                content: this.i18n.applicationReview,
                confirmText: this.i18n.confirm,
                showCancel: false,
                complete: () => {
                  this.$Router.pushTab('/pages/user/user')
                }

              })
            } else if (res && res.state == 3) {
              uni.showModal({
                title: '',
                content: this.i18n.applicationFailed,
                cancelText: this.i18n.cancel,
                confirmText: this.i18n.confirm,
                confirmColor: '#eb2444',
                success(res2) {
                  if (res2.confirm) {
                    that.getApplyInfo()
                  } else if (res2.cancel) {
                    console.log('用户点击取消')
                    uni.switchTab({
                      url: '/pages/user/user'
                    })
                  }
                }

              })
            } else if (res && res.state == -1) {
              uni.showModal({
                title: '',
                content: this.i18n.distributorBanned,
                confirmColor: '#eb2444',
                confirmText: this.i18n.confirm,
                showCancel: false,
                complete: () => {
                  this.$Router.pushTab('/pages/user/user')
                }
              })
            } else if (res && res.state == 2) {
              uni.showModal({
                title: '',
                content: this.i18n.distributorCleared,
                confirmColor: '#eb2444',
                confirmText: this.i18n.confirm,
                showCancel: false,
                complete: () => {
                  this.$Router.pushTab('/pages/user/user')
                }
              })
            } else {
              that.getApplyInfo()
            }
          }
        })
      })
    },

    /**
     * 获取申请分销需要填写的信息
     */
    getApplyInfo() {
      const params = {
        url: '/p/distribution/register/condition',
        method: 'GET',
        callBack: res => {
          this.distributionCondition = res
          if (res.prodIdList && res.prodIdList.length) {
            this.getProdList(res.prodIdList)
          }
          if (res.distributionSwitch) {
            this.setData({
              needIdCardNo: res.identityCardNumber,
              neddIdCardPic: res.identityCardPic,
              needRealName: res.realName
            })
          } else {
            uni.showModal({
              content: this.i18n.distributionPromotionHasBeenClosed,
              showCancel: false,
              confirmText: this.i18n.confirm,
              success: (res) => {
                if (res.confirm) {
                  uni.switchTab({
                    url: !this.distributionCardNo ? '/pages/user/user' : '/pages/index/index'
                  })
                }
              }
            })
          }
        }
      }
      http.request(params)
    },

    /**
     * 获取商品列表
     */
    getProdList(prodIdList) {
      const params = {
        url: '/search/renovationPage',
        method: 'GET',
        data: {
          prodIds: prodIdList.toString(),
          current: 1,
          size: prodIdList.length
        },
        callBack: res => {
          // console.log(res)
          this.prodList = res.records
        }
      }
      http.request(params)
    },

    onMobileInput: function (e) {
      this.setData({
        userMobile: e.detail.value
      })
    },
    onRealNameInput: function (e) {
      this.setData({
        realName: e.detail.value
      })
    },
    onIdCardNoInput: function (e) {
      this.setData({
        identityCardNumber: e.detail.value
      })
    },
    onStationNameInput: function (e) {
      this.setData({
        stationName: e.detail.value
      })
    },
    changeStationHave: function (isHave) {
      this.setData({
        stationHave: isHave
      })
    },

    uploadIdCardFront: function () {
      uni.chooseImage({
        count: 1,
        // 默认9
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: (res) => {
          var tempFilePaths = res.tempFilePaths
          const params = {
            url: '/p/file/upload',
            filePath: tempFilePaths[0],
            name: 'file',
            callBack: (res2) => {
              this.identityCardPicFrontCom = res2.resourcesUrl + res2.filePath
              this.identityCardPicFront = res2.filePath
            }
          }
          const obj = {
            src: tempFilePaths[0],
            quality: 0.2
          }
          this.$refs.hCompress.compress(obj, res.tempFiles[0]).then(res => {
            params.filePath = res
            http.upload(params)
          })
        }
      })
    },
    uploadIdCardBack: function () {
      uni.chooseImage({
        count: 1,
        // 默认9
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: (res) => {
          var tempFilePaths = res.tempFilePaths
          const params = {
            url: '/p/file/upload',
            filePath: tempFilePaths[0],
            name: 'file',
            callBack: (res2) => {
              this.setData({
                identityCardPicBackCom: res2.resourcesUrl + res2.filePath,
                identityCardPicBack: res2.filePath
              })
            }
          }
          const obj = {
            src: tempFilePaths[0],
            quality: 0.2
          }
          this.$refs.hCompress2.compress(obj, res.tempFiles[0]).then(res => {
            params.filePath = res
            http.upload(params)
          })
        }
      })
    },
    uploadIdCardHold: function () {
      uni.chooseImage({
        count: 1,
        // 默认9
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: (res) => {
          var tempFilePaths = res.tempFilePaths
          const params = {
            url: '/p/file/upload',
            filePath: tempFilePaths[0],
            name: 'file',
            callBack: (res2) => {
              this.setData({
                identityCardPicHoldCom: res2.resourcesUrl + res2.filePath,
                identityCardPicHold: res2.filePath
              })
            }
          }
          const obj = {
            src: tempFilePaths[0],
            quality: 0.2
          }
          this.$refs.hCompress3.compress(obj, res.tempFiles[0]).then(res => {
            params.filePath = res
            http.upload(params)
          })
        }
      })
    },

    /**
     * 提交申请
     */
    submitDisterApply: function () {
      var identityCardNumber = this.identityCardNumber
      var identityCardPicBack = this.identityCardPicBack
      var identityCardPicFront = this.identityCardPicFront
      var identityCardPicHold = this.identityCardPicHold
      var distributionCardNo = this.distributionCardNo
      var realName = this.realName.trim()
      var userMobile = this.userMobile
      var needIdCardNo = this.needIdCardNo
      var neddIdCardPic = this.neddIdCardPic
      var needRealName = this.needRealName
      var areaId = this.areaId
      var stationName = this.stationName
      if (userMobile.length == 0) {
        uni.showToast({
          title: this.i18n.enterMobileNumber,
          icon: 'none'
        })
      } else if (!util.checkPhoneNumber(userMobile)) {
        uni.showToast({
          title: this.i18n.enterCorrectPhone,
          icon: 'none'
        })
      } else if (needRealName && !realName) {
        uni.showToast({
          title: this.i18n.enterRealName,
          icon: 'none'
        })
      } else if (needRealName && realName.length < 2) {
        uni.showToast({
          title: this.i18n.enterRealNameR,
          icon: 'none'
        })
      } else if (needIdCardNo && !util.checkIDCard(identityCardNumber)) {
        uni.showToast({
          title: this.i18n.identificationTips,
          icon: 'none'
        })
      } else if (neddIdCardPic && identityCardPicFront == '') {
        uni.showToast({
          title: this.i18n.uploadIDFront,
          icon: 'none'
        })
      } else if (neddIdCardPic && identityCardPicBack == '') {
        uni.showToast({
          title: this.i18n.uploadIDBack,
          icon: 'none'
        })
      } else if (neddIdCardPic && identityCardPicHold == '') {
        uni.showToast({
          title: this.i18n.uploadIDHand,
          icon: 'none'
        })
      } else if (this.stationHave == 1 && areaId == 0) {
        uni.showToast({
          title: this.i18n.areaIDNotNull,
          icon: 'none'
        })
      } else if (this.stationHave == 1 && stationName == '') {
        uni.showToast({
          title: '自提点名称不能为空',
          icon: 'none'
        })
      } else {
        // 查询地区是否有店铺
        console.log(1, '查询店铺')
        if (this.stationHave == 1) {
          const params = {
            url: '/shop/searchShopByAreaId',
            method: 'get',
            data: {
              areaId: this.areaId
            },
            callBack: res => {
              if (res == [] || res.length == 0) {
                console.log(11)
                uni.showToast({
                  title: this.i18n.noPartnersInIhisArea,
                  icon: 'none'
                })
              } else {
                this.setData({
                  shopId: res[0].shopId
                })
                console.log(1)
                const params = {
                  url: '/p/distribution/register/addDistributionUser',
                  method: 'post',
                  data: {
                    identityCardNumber: identityCardNumber,
                    identityCardPicBack: identityCardPicBack,
                    identityCardPicFront: identityCardPicFront,
                    identityCardPicHold: identityCardPicHold,
                    realName: realName,
                    sharerCardNo: distributionCardNo,
                    userMobile: userMobile,
                    shopId: this.shopId,
                    stationName: stationName,
                    stationHave: this.stationHave
                  },
                  callBack: res => {
                    uni.showModal({
                      content: this.i18n.applicationSubmitted,
                      showCancel: false,
                      cancelText: this.i18n.cancel,
                      confirmText: this.i18n.confirm,
                      complete: () => {
                        this.$Router.pushTab('/pages/user/user')
                      }
                    })
                  }
                }
                http.request(params)
              }
            }
          }
          http.request(params)
        } else {
          const params = {
            url: '/p/distribution/register/addDistributionUser',
            method: 'post',
            data: {
              identityCardNumber: identityCardNumber,
              identityCardPicBack: identityCardPicBack,
              identityCardPicFront: identityCardPicFront,
              identityCardPicHold: identityCardPicHold,
              realName: realName,
              sharerCardNo: distributionCardNo,
              userMobile: userMobile,
              shopId: this.shopId,
              stationName: stationName,
              stationHave: this.stationHave
            },
            callBack: res => {
              uni.showModal({
                content: this.i18n.applicationSubmitted,
                showCancel: false,
                cancelText: this.i18n.cancel,
                confirmText: this.i18n.confirm,
                complete: () => {
                  this.$Router.pushTab('/pages/user/user')
                }
              })
            }
          }
          http.request(params)
        }

      }
    }
  }
}
</script>
<style>
@import "./apply-dist-con.css";
</style>
