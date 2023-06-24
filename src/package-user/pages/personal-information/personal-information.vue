<!-- 个人资料 -->
<!-- images/personal-information/personal-information.wxml -->
<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j personal-information">
    <view class="item-wrap">
      <view class="cloumn-item" @tap="getUploadImg">
        <view class="txt-wrap">{{ i18n.avatar }}</view>
        <view class="infor-right-wrap">
          <image
            class="avatar-picture"
            :src="
              photoFiles
                ? photoFiles
                : pic
                  ? pic
                  : '/static/images/icon/head04.png'
            "
            mode="scaleToFill"
          />
          <image
            class="right-img"
            src="/static/images/icon/arrow-right.png"
            mode="scaleToFill"
          />
        </view>
      </view>
    </view>
    <view class="item-wrap">
      <view v-if="username" class="cloumn-item">
        <view class="txt-wrap">{{ i18n.userName }}</view>
        <view class="right-wrap">
          <input
            type="text"
            class="txt-infor"
            :value="username"
            disabled
          >
          <!-- <image
            class="right-img"
            src="/static/images/icon/arrow-right.png"
            mode="scaleToFill"
          /> -->
        </view>
      </view>
      <view class="cloumn-item" @tap="none">
        <view class="txt-wrap">{{ i18n.nickname }}</view>
        <view class="right-wrap">
          <input
            type="text"
            class="txt-infor"
            :value="nickName"
            :placeholder="i18n.maximumCharacters"
            maxlength="15"
            @input="getNickNameInt"
          >
          <image
            class="right-img"
            src="/static/images/icon/arrow-right.png"
            mode="scaleToFill"
          />
        </view>
      </view>
      <view class="cloumn-item" @tap="translate">
        <view class="txt-wrap">{{ i18n.gender }}</view>
        <view class="right-wrap">
          <view v-if="sex==1 || sex==0" class="txt-infor">{{ genderArray[sex] }}</view>
          <view v-else class="txt-infor" />
          <image
            class="right-img"
            src="/static/images/icon/arrow-right.png"
            mode="scaleToFill"
          />
        </view>
      </view>
      <picker class="birthday-picker birthday-wrap" mode="date" :value="date" fields="day" :end="endDate" @change="bindDateChange">
        <view class="txt-wrap">{{ i18n.birthday }}</view>
        <view class="right-wrap">
          <view v-if="date" class="choose-value">{{ date }}</view>
          <view v-else class="choose-value" />
          <image
            class="right-img"
            src="/static/images/icon/arrow-right.png"
            mode="scaleToFill"
          />
        </view>
      </picker>
    </view>
    <!-- 确认按钮 -->
    <view v-if="isSexChange || isChange" class="confirm" @tap="setUserInfo">{{
      i18n.confirm
    }}</view>
    <!-- 确认按钮 end -->

    <!-- 性别选择 弹框 -->
    <template v-if="showPicker">
      <view
        class="animation-element-wrapper"
        :animation="animation"
        :style="'visibility:' + (show ? 'visible' : 'hidden')"
        @tap.stop="hiddenFloatView"
      >
        <view class="animation-element" @tap.stop="nono">
          <text class="right-bt" @tap.stop="hiddenFloatView">{{
            i18n.confirm
          }}</text>
          <view class="line" />
          <picker-view
            indicator-style="height: 50px;"
            @change="bindChange"
            @tap.stop="nono"
          >
            <picker-view-column>
              <view v-for="(item, index) in genderArray" :key="index">{{
                item
              }}</view>
            </picker-view-column>
          </picker-view>
        </view>
      </view>
    </template>
    <!-- 性别选择 end -->
    <hCompress ref="hCompress" />
  </view>
</template>

<script>
// index.js
// 获取应用实例
const http = require('@/utils/http.js')

var t = 0
var show = false
var moveY = 200
import hCompress from '@/components/helang-compress/helang-compress'
export default {
  components: {
    hCompress
  },
  props: {},
  data() {
    return {
      photoFiles: '',
      // genderArray: ['男', '女'],
      // genderArray: [this.i18n.female, this.i18n.male],
      // 不能直接这样的，要读取后保存进来
      genderArray: [],
      genderIndex: 0,
      date: '', // 用户生日
      dateIndex: 0,

      // birthDate: '',   //用户生日
      nickName: '', // 用户昵称
      score: 0, // 氢春豆
      sex: '', // 性别
      oldSex: '', // 原先性别
      sexNumber: 0, // 判断有无滑动
      phoneNumber: '', // 手机号
      countryCode: '', // 区号
      pic: '',
      isChange: false, // 是否修改用户信息
      isSexChange: false, // 是否修改性别
      animation: '',
      show: '',
      showPicker: false,
      username: ''
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    },
    endDate() {
      return this.getDate()
    }
  },

  onLoad: function() {
    // 加载会员信息
    this.genderArray.push(this.i18n.male)
    this.genderArray.push(this.i18n.female)
    this.queryUserInfo()
  },
  onShow: function() {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.personalInfor
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
  methods: {
    /**
     * none
     */
    none() {

    },
    getDate() {
      const date = new Date()
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      month = month > 9 ? month : '0' + month
      day = day > 9 ? day : '0' + day
      return `${year}-${month}-${day}`
    },
    /**
     * 用户名点击事件
     */
    handleUserNameClick() {
      uni.showToast({
        title: this.i18n.userNameCannotChange,
        icon: 'none'
      })
    },
    /**
     * 上传图片
     */
    getUploadImg: function() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: (res) => {
          var tempFilePaths = res.tempFilePaths
          const params = {
            url: '/p/file/upload',
            filePath: tempFilePaths[0],
            name: 'file',
            callBack: (res2) => {
              this.photoFiles = res2.resourcesUrl + res2.filePath
              this._photoFiles = res2.filePath
              this.isChange = true
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
        },
        fail: (failMsg) => {
          console.log(failMsg)
        }
      })
    },

    // 获取用户信息
    queryUserInfo: function() {
      const params = {
        url: '/p/user/userInfo',
        method: 'GET',
        data: {},
        callBack: (res) => {
          this.date = res.birthDate// 用户生日
          this.nickName = res.nickName// 用户昵称
          this.score = res.score// 氢春豆
          if (res.sex === '1' || res.sex === '0') {
            this.sex = Number(res.sex)
            this.oldSex = Number(res.sex) // 原本的性别
          }
          this.phoneNumber = res.userMobile // 用户手机号
          this.pic = res.pic
          this.username = res.username
          // 设置默认日期
          // if (!res.birthDate) {
          //   // 获取当前日期并改变日期展示格式
          //   var curDate = new Date()
          //   var seperator1 = '-'
          //   var month =
          //     curDate.getMonth() + 1 < 10
          //       ? '0' + (curDate.getMonth() + 1)
          //       : curDate.getMonth() + 1 // 截取月份
          //   var strDate =
          //     curDate.getDate() < 10
          //       ? '0' + curDate.getDate()
          //       : curDate.getDate() // 截取日期
          //   this.date =
          //     curDate.getFullYear() + seperator1 + month + seperator1 + strDate // 将年月日用'-'拼接起来
          //   console.log(this.date)
          // }
        }
      }
      http.request(params)
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
    },

    // 隐藏弹窗浮层
    hiddenFloatView(e) {
      // console.log(e);
      if (!this.sexNumber) {
        this.setData({
          sex: 0
        })
        if (this.sex !== this.oldSex) {
          this.isSexChange = true
        }
      }
      moveY = 200
      show = true
      t = 0
      this.animationEvents(this, moveY, show)
    },

    // 动画事件
    animationEvents: function(that, moveY, show) {
      // console.log("moveY:" + moveY + "\nshow:" + show);
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

    // 用户昵称
    getNickNameInt: function(e) {
      this.nickName = e.detail.value
      this.isChange = true
    },

    // 选择性别
    bindChange: function(e) {
      console.log('e', e)
      this.sex = e.detail.value[0]
      console.log(this.sex)
      this.setData({
        sexNumber: (this.sexNumber += 1)
      })
      if (this.sex !== this.oldSex) {
        this.isSexChange = true
      } else {
        this.isSexChange = false
      }
    },

    // 选择日期
    bindDateChange: function(e) {
      this.date = e.detail.value
      this.isChange = true
    },

    /**
     * 设置用户信息
     */
    setUserInfo() {
      if (!this.nickName || !this.nickName.trim()) {
        uni.showToast({
          title: this.i18n.nicknameEmptyTips,
          icon: 'none'
        })
        return
      }

      if (this.isChange || this.isSexChange) {
        const params = {
          url: '/p/user/setUserInfo',
          method: 'PUT',
          data: {
            avatarUrl: this.photoFiles,
            birthDate: this.date,
            sex: this.sex,
            nickName: this.nickName
          },
          callBack: (res) => {
            uni.showToast({
              title: this.i18n.successfullyModified,
              icon: 'none',
              duration: 1000
            })
            setTimeout(() => {
              this.queryUserInfo()
              // uni.switchTab({
              //   url: '/pages/user/user'
              // })
              this.$Router.pushTab('/pages/user/user')
            }, 1000)
          }
        }
        http.request(params)
      }
    },

    nono() {}
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  onPullDownRefresh: function() {},
  onShareAppMessage: function(e) {
    return {}
  }
}
</script>
<style>
@import "./personal-information.css";
</style>
