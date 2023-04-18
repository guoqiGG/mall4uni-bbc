<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 填写退货物流 -->
  <view class="Mall4j page">
    <view class="picker-box">
      <view class="select-show select-box clearfix" @tap="translate">
        <text class="select-text">{{ i18n.logisticsCompany }}</text>
        <view class="select-results select-reason">{{ expressName }}</view>

        <!-- 底部选择弹窗 -->
        <template v-if="showPicker">
          <view
            class="animation-element-wrapper"
            :animation="animation"
            :style="'visibility:' + (show ? 'visible':'hidden')"
            @tap.stop="hiddenFloatView"
          >
            <view class="animation-element" @tap.stop="nono">
              <text class="right-bt" @tap.stop="submitFloatView">{{ i18n.confirm }}</text>
              <view class="line" />
              <picker-view indicator-style="height: 50px;" @change="chooseLogisticsCompany" @tap.stop="nono">
                <picker-view-column>
                  <view v-for="(item, index) in deliveryList" :key="index">{{ item.dvyName }}</view>
                </picker-view-column>
              </picker-view>
            </view>
          </view>
        </template>
        <!-- 底部选择弹窗ENd -->

        <view class="right-arrow">
          <image src="/static/images/icon/more.png" />
        </view>
      </view>
    </view>

    <!-- 退货信息 -->
    <view class="write-msg">
      <!-- 单号 -->
      <view class="item-num">
        <label class="item-num-tit">{{ i18n.logisticsOrderNo }}</label>
        <input class="item-num-num" maxlength="20" :placeholder="i18n.logisticsOrderNoTips" :value="expressNo" @input="onExpressNoInput"></input>
      </view>
      <!-- 说明 -->
      <view class="item-num">
        <label class="item-num-tit">{{ i18n.remarks }}</label>
        <input class="item-num-num refund-explain" :placeholder="i18n.optional200Words" maxlength="200" :value="senderRemarks" @input="onSenderRemarksInput"></input>
      </view>

      <!-- 上传照片 -->
      <view class="item-num">
        <label class="item-num-tit upload-tit">{{ i18n.logisticsVouchers }}</label>
        <view class="upload-img">
          <view class="upload-tips">{{ i18n.uploadPics }}</view>
          <!-- 预览缩略图 -->
          <block v-for="(imgItem, idx) in imgs" :key="idx">
            <view class="q-image-wrap">
              <!-- 图片缩略图  -->
              <image class="q-image" :src="imgItem.url" mode="aspectFill" :data-idx="idx" />
              <!-- 移除图片的按钮  -->
              <view class="q-image-remover" :data-idx="idx" @tap="removeImage"><image src="/static/images/icon/close2.png" /></view>
            </view>
          </block>
          <!-- 添加图片按钮 -->
          <view v-if="imgs.length < 5" class="upload-btn" @tap="getUploadImg">+</view>
        </view>
      </view>
    <!-- 上传照片end -->
    </view>
    <!-- 退货信息end -->

    <!-- 提交btn -->
    <view class="submit-btn" @tap="writeLogisticsMsg">{{ i18n.submit }}</view>
    <hCompress ref="hCompress" />
  </view>
</template>

<script>
import { picDomain } from '@/utils/config.js'
import util from '@/utils/util'
import hCompress from '@/components/helang-compress/helang-compress'
const http = require('@/utils/http.js')
var t = 0
var show = false
var moveY = 200

export default {

  components: {
    hCompress
  },
  props: {},
  data() {
    return {
      // 物流公司选择
      deliveryList: [],
      expressId: 0,
      // 物流公司id
      expressName: '',
      // 物流公司名称
      expressNo: '',
      // 物流单号
      imgs: [],
      // 图片凭证
      mobile: '',
      // 手机号码
      refundSn: '',
      // 退款编号名称
      senderRemarks: '', // 备注信息
      animation: '',
      show: '',
      showPicker: false,
      // 是否为修改物流: 0否(填写物流); 1是(修改物流)
      isModify: 0,
      deliveryListValue: {
        expressId: 0,
        expressName: ''
      }

    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  onHide: function() {
    this.showPicker = false
  },
  onReady: function() {
    this.animation = uni.createAnimation({
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
  onLoad: function(options) {
    this.setData({
      refundSn: options.refundSn,
      isModify: parseInt(options.isModify)
    })
    // 物流公司列表
    this.loadDeliveryData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.fillInReturn
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() { },
  methods: {
    /**
     * 获取物流信息(用于修改物流时回显)
     */
    getReturnLogistics() {
      const params = {
        url: '/p/orderRefund/info',
        method: 'GET',
        data: {
          refundSn: this.refundSn
        },
        callBack: res => {
          this.expressName = res.refundDelivery.deyName
          this.expressNo = res.refundDelivery.deyNu
          this.mobile = res.refundDelivery.mobile
          this.senderRemarks = res.refundDelivery.senderRemarks
          for (let i = 0; i < this.deliveryList.length; i++) {
            const element = this.deliveryList[i]
            if (element.dvyId === res.refundDelivery.deyId) {
              this.expressId = element.dvyId
              break
            }
          }
          const imgs = []
          if (res.refundDelivery.imgs) {
            const tempImgs = res.refundDelivery.imgs.split(',')
            for (let i = 0; i < tempImgs.length; i++) {
              const element = tempImgs[i]
              imgs.push({
                url: picDomain + element,
                path: element
              })
            }
          }
          this.imgs = imgs
        },
        errCallBack: errMsg => {
          console.log(errMsg)
        }
      }
      http.request(params)
    },

    /**
     * 选择物流公司
     */
    chooseLogisticsCompany: function(e) {
      this.setData({
        deliveryListValue: {
          expressId: this.deliveryList[e.detail.value].dvyId,
          expressName: this.deliveryList[e.detail.value].dvyName
        }
      })
      // this.setData({
      //   expressId: this.deliveryList[e.detail.value].dvyId,
      //   expressName: this.deliveryList[e.detail.value].dvyName
      // })
    },

    onExpressNoInput: function(e) {
      this.setData({
        expressNo: e.detail.value
      })
    },

    onSenderRemarksInput: function(e) {
      this.setData({
        senderRemarks: e.detail.value
      })
    },

    /**
     * 填写&提交物流信息
     */
    writeLogisticsMsg: function(e) {
      var reg = /^\s+$/g
      var r = /^[0-9a-zA-Z]+$/
      const pattern = new RegExp('[\u4E00-\u9FA5]+')

      if (reg.test(this.expressNo) || reg.test(this.senderRemarks)) {
        uni.showToast({
          title: this.i18n.inputAllSpace,
          icon: 'none'
        })
        return
      }

      if (!this.expressName) {
        uni.showToast({
          title: this.i18n.logisticsCompanyNullTips,
          icon: 'none'
        })
        return
      }

      if (!r.test(this.expressNo) || pattern.test(this.expressNo)) {
        uni.showToast({
          title: this.i18n.logisticsOrderNoSucced,
          icon: 'none'
        })
        return
      }

      if (this.expressNo.length == 0) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.logisticsOrderNoTips
        })
      } else {
        var pics = ''
        this.imgs.forEach(function(item) {
          pics += item.path + ','
        })

        if (pics != '') {
          pics = pics.substring(0, pics.length - 1)
        }
        var parmas = {
          url: this.isModify ? '/p/orderRefund/reSubmitExpress' : '/p/orderRefund/submitExpress',
          method: this.isModify ? 'PUT' : 'POST',
          data: {
            expressId: this.expressId,
            // 物流公司id
            expressName: this.expressName,
            // 物流公司名称
            expressNo: this.expressNo,
            // 物流单号
            imgs: pics,
            // 图片凭证
            mobile: this.mobile,
            // 手机号码
            refundSn: this.refundSn,
            // 退款编号名称
            senderRemarks: this.senderRemarks // 备注信息

          },
          callBack: res => {
            uni.navigateBack({
              delta: 1
            })
          }
        }
        http.request(parmas)
      }
    },

    /**
     * 上传图片
     */
    getUploadImg: function() {
      uni.chooseImage({
        count: 5 - this.imgs.length,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: (res) => {
          var tempFilePaths = res.tempFilePaths
          tempFilePaths.forEach((item, index) => {
            var params = {
              url: '/p/file/upload',
              filePath: item,
              name: 'file',
              callBack: (res2) => {
                var img = {}
                img.path = res2.filePath
                img.url = res2.resourcesUrl + res2.filePath
                this.imgs.push(img)
              }
            }
            const obj = {
              src: item,
              quality: 0.2
            }
            this.$refs.hCompress.compress(obj, res.tempFiles[index]).then(res => {
              params.filePath = res
              http.upload(params)
            })
          })
        }
      })
    },

    /**
     * 删除图片
     */
    removeImage: function(e) {
      // const index = e.target.dataset.index
      // const idx = e.target.dataset.idx;
      var idx = e.currentTarget.dataset.idx
      var imgs = this.imgs
      imgs.splice(idx, 1)
      this.setData({
        imgs: imgs
      })
    },

    /**
     * 获取物流列表信息
     */

    loadDeliveryData() {
      http.request({
        url: '/p/delivery/list',
        method: 'get',
        data: {},
        callBack: res => {
          this.setData({
            deliveryList: res
          })
          if (this.isModify) {
            this.getReturnLogistics()
          }
        }
      })
    },

    // 移动按钮点击事件
    translate: function(e) {
      if (t == 0) {
        moveY = 0
        show = false
        t = 1
      } else {
        moveY = 200
        show = true
        t = 0
      }
      this.setData({
        show: true,
        showPicker: true
      }) // this.animation.translate(arr[0], arr[1]).step();
      this.animationEvents(this, moveY, show)
      if (!this.expressId) {
        const dvy = {
          detail: {
            value: [0]
          }
        }
        this.chooseLogisticsCompany(dvy)
      }
    },

    // 隐藏弹窗浮层
    hiddenFloatView(e) {
      // console.log(e);
      moveY = 200
      show = true
      t = 0
      this.animationEvents(this, moveY, show)
    },
    // 确定选中物流公司
    submitFloatView() {
      const { expressId, expressName } = this.deliveryListValue
      this.setData({
        expressId,
        expressName
      })
      this.hiddenFloatView()
    },

    // 动画事件
    animationEvents: function(that, moveY, show) {
      // console.log("moveY:" + moveY + "\nshow:" + show);
      that.animation = uni.createAnimation({
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

    nono() {}

  }
}
</script>
<style>
@import "./write-return-logistics.css";
</style>
