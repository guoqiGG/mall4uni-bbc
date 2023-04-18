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
        <input :placeholder="i18n.mobilePhone" type="number" maxlength="11" @input="onMobileInput"></input>
      </view>
      <view v-if="needRealName" class="section">
        <input :placeholder="i18n.actualName" type="text" @input="onRealNameInput"></input>
      </view>
      <view v-if="needIdCardNo" class="section">
        <input :placeholder="i18n.identification" type="text" maxlength="18" @input="onIdCardNoInput"></input>
      </view>
      <view v-if="neddIdCardPic">
        <view class="upload" @tap="uploadIdCardFront">
          <image v-if="identityCardPicFrontCom" :src="identityCardPicFrontCom" @error="identityCardPicFrontCom=''" />
          <text v-else>{{ i18n.uploadIDFront }}</text>
        </view>
        <view class="upload" @tap="uploadIdCardBack">
          <image v-if="identityCardPicBackCom" :src="identityCardPicBackCom" @error="identityCardPicBackCom=''" />
          <text v-else>{{ i18n.uploadIDBack }}</text>
        </view>
        <view class="upload" @tap="uploadIdCardHold">
          <image v-if="identityCardPicHoldCom" :src="identityCardPicHoldCom" @error="identityCardPicHoldCom=''" />
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
      // shopId: 1,
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
      windowHeight: 0
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  onShow: function() {
    this.upDataPage()
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    uni.getSystemInfo({
      success(res) {
        that.windowHeight = res.windowHeight
      }
    })

    // if (this.$Route.query.scene) {
    //   // #ifdef MP-WEIXIN || MP-TOUTIAO
    //   const scene = decodeURIComponent(this.$Route.query.scene)
    //   this.setData({
    //     distributionCardNo: scene
    //   })
    //   // #endif

    //   // #ifdef H5 || APP-PLUS
    //   this.distributionCardNo = this.$Route.query.scene
    //   // #endif

    //   this.distUserInfo()
    // } else {
    //   this.getApplyInfo()
    // }
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
      setTimeout(function() {
        var field = document.createElement('input')
        field.setAttribute('type', 'text')
        field.setAttribute('style', 'position:absolute; top: 0px; opacity: 0; -webkit-user-modify: read-write-plaintext-only; left:0px;')
        document.body.appendChild(field)
        field.onfocus = function() {
          setTimeout(function() {
            field.setAttribute('style', 'display:none;')
            setTimeout(function() {
              document.body.removeChild(field)
              document.body.focus()
            }, 14)
          }, 200)
        }
        field.focus()
      }, 50)
    },
    upDataPage() {
      const that = this
      uni.getSystemInfo({
        success(res) {
          // uni.showToast({
          //   title: that.windowHeight + ',' + res.windowHeight,
          //   icon: 'none'
          // })
          if (res.windowHeight !== that.windowHeight || res.windowHeight < 400) {
            that.hideKeyboard()
          }
        }
      })
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

    onMobileInput: function(e) {
      this.setData({
        userMobile: e.detail.value
      })
    },
    onRealNameInput: function(e) {
      this.setData({
        realName: e.detail.value
      })
    },
    onIdCardNoInput: function(e) {
      this.setData({
        identityCardNumber: e.detail.value
      })
    },
    uploadIdCardFront: function() {
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
    uploadIdCardBack: function() {
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
    uploadIdCardHold: function() {
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
    submitDisterApply: function() {
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
            userMobile: userMobile
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
</script>
<style>
@import "./apply-dist-con.css";
</style>
