<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 抽奖转盘组件 -->
  <view class="Mall4j canvas-container">
    <image
      src="../../static/images/icon/zhuanpan@2x.png"
      class="pan-bg"
      mode="widthFix"
    />
    <view
      :animation="animationData"
      class="gb-wheel-content"
      :style="'width:' + (size + 2) + 'rpx;height:' + size + 'rpx;'"
    >
      <!-- 扇形颜色背景 当选项长度等于2或者3时做了特殊处理 -->
      <view class="canvas-list">
        <view
          v-for="(item, key) in awardsConfig.awards"
          :key="key"
          class="canvas-item2"
          :style="
            'transform: rotate(' +
              item.item2Deg +
              ');background-color:' +
              (awardsConfig.awards.length == 2 ? item.color : '') +
              ';opacity:' +
              (awardsConfig.awards.length == 2
                ? item.opacity
                : awardsConfig.awards.length == 3
                  ? item.opacity
                  : '') +
              ';width:' +
              size +
              'rpx;height:' +
              (size / 2 - 2) +
              'rpx;transform-origin:' +
              size / 2 +
              'rpx ' +
              size / 2 +
              'rpx'
          "
        >
          <view
            class="canvas-item2-after"
            :style="
              'background-color:' +
                item.color +
                ';transform: rotate(' +
                item.afterDeg +
                ');opacity:' +
                (awardsConfig.awards.length == 3 ? '' : item.opacity) +
                ';width:' +
                size / 2 +
                'rpx;height:' +
                size / 2 +
                'rpx;transform-origin: ' +
                size / 2 +
                'rpx ' +
                size / 2 +
                'rpx'
            "
          />
          <view
            v-if="awardsConfig.awards.length == 3"
            class="canvas-item2-after"
            :style="
              'background-color:' +
                item.color +
                ';width:' +
                size / 2 +
                'rpx;height:' +
                size / 2 +
                'rpx;transform-origin: ' +
                size / 2 +
                'rpx ' +
                size / 2 +
                'rpx'
            "
          />
        </view>
      </view>

      <!-- 选项内容 -->
      <view class="gb-wheel-list">
        <view
          v-for="(item, key) in awardsConfig.awards"
          :key="key"
          class="gb-wheel-item"
          :data-index="index"
        >
          <view
            class="gb-wheel-icontent"
            :style="
              'width:170rpx;overflow:hidden;font-size:26rpx;line-height:26rpx;padding-top:5%;transform: rotate(' +
                index * turnNum +
                'turn);transform-origin: 50% ' +
                (size / 2 - 1) +
                'rpx'
            "
          >
            <view class="item-text">{{ item.prizeName }}</view>
            <view class="item-img">
              <image
                v-if="item.prizeType == 3"
                src="../../static/images/icon/youhuiq@2x.png"
                :data-type="i18n.coupon"
                style="width:102rpxmargin-top:20rpx"
                mode="widthFix"
              />
              <image
                v-if="item.prizeType == 0"
                src="../../static/images/icon/nanguo@2x.png"
                :data-type="i18n.thankYourPatronage"
                style="width:46rpxmargin-top:20rpx"
                mode="widthFix"
              />
              <!-- <image  wx:if="{{item.index%2!==0}}"src="../../images/icon/nanguo_h@2x.png" data-type="谢谢惠顾-黄" style="width:46rpx;margin-top:20rpx;" mode="widthFix"></image> -->
              <image
                v-if="item.prizeType == 1"
                src="../../static/images/icon/jinbi@2x.png"
                :data-type="i18n.integral"
                style="width:46rpxmargin-top:20rpx"
                mode="widthFix"
              />
              <image
                v-if="item.prizeType == 2"
                :src="item.pic"
                :data-type="i18n.goods"
                style="width:65rpxmargin-top:20rpx"
                mode="widthFix"
              />
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="img-container" :style="'width:100%;height:' + size + 'rpx;'">
      <!-- 转盘中间的按钮 -->
      <image
        src="../../static/images/icon/dianjichoujiang@2x.png"
        :style="'width:' + size / 3.5 + 'rpx;'"
        mode="widthFix"
      />
      <view v-if="!zhuanflg" class="btn-text" @tap="zhuanFun">{{
        i18n.clickLottery
      }}</view>
      <!-- <image src='../../images/icon/dianjichoujiang@2x.png' style='width:{{size/3.5}}rpx;display:{{block2}};' mode='widthFix'></image> -->
      <!-- <image bindtap="reset" src='../../images/icon/dianjichoujiang@2x.png' style='width:{{size/3.5}}rpx;display:{{block3}};' mode='widthFix'></image> -->
      <!-- <image src='../../images/icon/dianjichoujiang@2x.png' style='width:{{size/3.5}}rpx;display:{{block4}};' mode='widthFix'></image> -->
    </view>
    <!-- 装饰图片 -->
    <image
      class="lucky-decorate"
      src="../../static/images/icon/people.png"
      mode="widthFix"
    />
    <!-- 抽奖说明 -->
    <view class="desc">
      <text class="orange-text">{{ i18n.threePoints }}</text>{{ i18n.drawPrize }}</view>
  </view>
</template>

<script>
// components/raffleWheel/raffleWheel.js
// 创建并返回内部 audio 上下文 innerAudioContext 对象
const start = wx.createInnerAudioContext()
const mid = wx.createInnerAudioContext()
const stop = wx.createInnerAudioContext()
const http = require('../../../utils/http.js')

export default {
  components: {},
  props: {
    myProperty: {
      // 属性名        myProperty2: String, 简化的定义方式
      type: String,
      // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      default: ''
    },
    size: {
      type: Number,
      // 转盘大小，传入宽度即可
      default: 600
    }
  },
  data() {
    return {
      awardsConfig: {
        option: '',
        // 转盘的标题名称
        awards: []
      },
      animationData: {},
      // 转盘动画
      zhuanflg: false,
      // 转盘是否可以点击切换的标志位
      // fastTime: 7600,    // 转盘快速转动的时间
      fastTime: 3900,
      // 转盘快速转动的时间
      slowTime: 3900,
      // 转盘慢速转动的时间
      runDegs: 0,
      // 转盘旋转了多少圈
      timer: null,
      // 清除转盘的时间clearTimeout(timer)
      block1: 'block',
      // 控制显示或隐藏转盘中心的图片
      block2: 'none',
      block3: 'none',
      block4: 'none',
      turnNum: '',
      s_awards: ''
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  watch: {
    myProperty: function(newVal, oldVal, changedPath) {
      // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
      // 通常 newVal 就是新设置的数据， oldVal 是旧数据
    }
  },
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  // 组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
  created: function() {},
  // 组件生命周期函数，在组件实例进入页面节点树时执行
  beforeMount: function() {
    this.getScoreLuckPrizes()
  },
  methods: {
    /*
     * 公有方法
     */
    // 判断值是否为空
    isNull(str) {
      if (str == null || str == undefined || str == '') {
        return true
      } else {
        return false
      }
    },

    // 初始化数据
    initAdards() {
      var that = this
      var awardsConfig = that.awardsConfig
      var t = awardsConfig.awards.length // 选项长度

      var e = 1 / t
      var i = 360 / t
      var r = i - 90

      for (var g = 0; g < t; g++) {
        awardsConfig.awards[g].item2Deg = g * i + 90 - i / 2 + 'deg' // 当前下标 * 360/长度 + 90 - 360/长度/2

        awardsConfig.awards[g].afterDeg = r + 'deg'
        awardsConfig.awards[g].opacity = '1'
      }

      that.setData({
        turnNum: e,
        // 页面的单位是turn
        awardsConfig: awardsConfig
      })
      that.changeFun() // 向父组件传出当前转盘的初始数据
    },

    // 重置转盘
    reset() {
      var that = this
      var awardsConfig = that.awardsConfig
      var animation = wx.createAnimation({
        duration: 1,
        timingFunction: 'ease'
      })
      that.animation = animation
      animation.rotate(0).step()
      that.runDegs = 0
      that.setData({
        animationData: animation.export(),
        block3: 'none',
        block4: 'block'
      })

      for (const x in awardsConfig.awards) {
        awardsConfig.awards[x].opacity = '1'
      }

      setTimeout(function() {
        that.setData({
          block1: 'block',
          block4: 'none',
          awardsConfig: awardsConfig
        })
      }, 300)
    },

    // 父组件需要切换当前转盘的选项
    // 如果有需要切换不同转盘的选项时，可以调用这方法
    // data: 转盘的数据
    // flag: 当转盘在转动过程中如果你想停止的话，可以传个true值，默认可不传
    switchZhuanpan(data, flag) {
      this.setData({
        awardsConfig: data,
        block1: 'block',
        block2: 'none',
        block3: 'none',
        block4: 'none',
        zhuanflg: false
      })
      this.initAdards()

      if (flag) {
        this.reset()
        clearTimeout(this.timer)
        start.stop()
        mid.stop()
        stop.stop()
      }
    },

    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件,过triggerEvent来给父组件传递信息的
     * 写法： this.triggerEvent('cancelEvent', { num: 1 })  // 可以将num通过参数的形式传递给父组件
     */
    // GO转盘开始转动
    zhuanFun() {
      var that = this
      var awardsConfig = that.awardsConfig
      var runDegs = that.runDegs // >>> 是无符号移位运算符

      var r = (Math.random() * awardsConfig.awards.length) >>> 0
      setTimeout(function() {
        // 要转多少度deg
        runDegs = runDegs || 0
        runDegs =
            runDegs +
            (360 - (runDegs % 360)) +
            (2160 - r * (360 / awardsConfig.awards.length))
        var animation = wx.createAnimation({
          duration: that.fastJuedin ? that.slowTime : that.fastTime,
          timingFunction: 'ease'
        })
        that.animation = animation // 这动画执行的是差值
        // 如果第一次写rotate（360） 那么第二次再写rotate（360）将不起效果

        animation.rotate(runDegs).step()
        r == 0 && (runDegs = 0)
        that.setData({
          animationData: animation.export(),
          block1: 'none',
          block2: 'block',
          zhuanflg: true
        })
        that.setatZhuanFun(true)
      }, 100)
      that.setData({
        timer: setTimeout(
          function() {
            that.setData({
              animationData: {},
              s_awards: awardsConfig.awards[r].prizeName,
              // 最终选中的结果
              awardsConfig: awardsConfig,
              block2: 'none',
              block3: 'block',
              zhuanflg: false
            })
            that.myAwardsFun()
          },
          that.fastJuedin ? that.slowTime : that.fastTime
        )
      })
    },

    // 初始化数据时向外传的参
    changeFun() {
      this.$emit('myData', this.awardsConfig) // 向父组件传出当前转盘的数组数据
    },

    // 当前转盘的结果
    myAwardsFun() {
      this.$emit('myAwards', this.s_awards)
    },

    // 转盘开始转动或者结速转动后的要传的值
    setatZhuanFun(e) {
      console.log(e)
      const params = {
        url: '/p/scoreLuck/raffle',
        method: 'GET',
        data: {
          addId: 0
        },
        callBack: (res) => {
          setTimeout(() => {
            if (res.stock) {
              uni.showModal({
                title: this.i18n.goodLuck,
                showCancel: false,
                content: res.prizeName,
                cancelText: this.i18n.cancel,
                confirmText: this.i18n.confirm,
                success: () => {
                  this.reset()
                }
              })
            } else {
              uni.showModal({
                title: this.i18n.thankParticipation,
                showCancel: false,
                content: this.i18n.luckNextTime,
                cancelText: this.i18n.cancel,
                confirmText: this.i18n.confirm,
                success: () => {
                  this.reset()
                }
              })
            }
          }, 2400)
        },
        errCallBack: (err) => {
          console.log(err)
          uni.showModal({
            title: this.i18n.error,
            showCancel: false,
            content: this.i18n.wrongServer,
            cancelText: this.i18n.cancel,
            confirmText: this.i18n.confirm,
            success: () => {
              this.reset()
            }
          })
        }
      }
      http.request(params)
    },

    // 获取抽奖奖品列表
    getScoreLuckPrizes() {
      const params = {
        url: '/p/scoreLuck/getScoreLuckPrizes',
        method: 'GET',
        data: {
          consumeType: 1
        },
        callBack: (res) => {
          res.forEach((el, index) => {
            if (index % 2 === 0) {
              el['color'] = '#FEFAEA'
            } else {
              el['color'] = '#FFE358'
            }
          })
          this.setData({
            'awardsConfig.awards': res
          })
          this.initAdards()
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
