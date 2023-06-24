<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 幸运抽奖 -->
  <view class="Mall4j lucky">
    <image
      class="lucky-bg"
      src="../../static/images/icon/xingyunchoujiang-bg.png"
    />
    <!-- 中奖记录 -->
    <!-- <view class="lucky-record">中奖记录</view> -->
    <!-- 图片标题 -->
    <image
      class="lucky-tit"
      src="../../static/images/icon/dabiaoti@2x.png"
      mode="widthFix"
    />
    <!-- 转盘 -->
    <view class="lucky-con">
      <raffleWheel
        id="zhuanpan"
        :size="size"
        @myData="getData"
        @startZhuan="startZhuan"
      >
        <!-- <raffleWheel id='zhuanpan' bind:myData='getData' bind:myAwards="getAwards" bind:startZhuan="startZhuan" size='{{size}}'   awardsConfig='{{awardsConfig}}'> -->
      </raffleWheel>
    </view>
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
import raffleWheel from '../../components/raffle-wheel/index.vue'

export default {
  components: {
    raffleWheel
  },
  props: {},
  data() {
    return {
      size: 555,
      // 转盘大小,
      s_awards: '',
      // 结果
      // 更改数据可以更改这属性，格式要像下面这样写才行
      awardsConfig: {
        option: '',
        // 转盘的标题名称
        awards: []
      },
      userAddrList: [],
      option: '',
      zhuanflg: '',
      musicflg: '',
      repeat: '',
      fastJuedin: '',
      probability: '',
      currentScore: ''
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
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 实例化组件对象，这样有需要时就能调用组件内的方法
    this.zhuanpan = this.selectComponent('#zhuanpan')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getScore()
    this.getUserAddr()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  methods: {
    // 接收当前转盘初始化时传来的参数
    getData(e) {
      this.setData({
        option: e.detail.option
      })
    },

    // 接收当前转盘结束后的答案选项
    getAwards(e) {
      console.log(e)
      this.setData({
        s_awards: e.detail
      })
    },

    // 开始转动或者结束转动
    startZhuan(e) {
      this.setData({
        zhuanflg: !!e.detail
      })
    },

    // 切换转盘选项
    switchZhuanpan(e) {
      // 当转盘停止时才执行切换转盘
      if (!this.zhuanflg) {
        var idx = e.currentTarget.dataset.idx
        var zhuanpanArr = this.zhuanpanArr
        var obj = {}

        for (const i in zhuanpanArr) {
          if (
            this.option != zhuanpanArr[i].option &&
            zhuanpanArr[i].id == idx
          ) {
            obj.option = zhuanpanArr[i].option
            obj.awards = zhuanpanArr[i].awards
            this.setData({
              awardsConfig: obj // 其实默认要更改当前转盘的数据要传个这个对象，才有效果
            })
            break
          }
        }
      }
    },

    // 转盘声音
    switch1Change1(e) {
      var value = e.detail.value

      if (this.zhuanflg) {
        uni.showToast({
          title: this.i18n.luckyDraw1,
          icon: 'none'
        })
        return
      } else {
        this.setData({
          musicflg: value
        })
      }
    },

    // 不重复抽取
    switch1Change2(e) {
      var value = e.detail.value

      if (this.zhuanflg) {
        uni.showToast({
          title: this.i18n.luckyDraw1,
          icon: 'none'
        })
        return
      } else {
        this.setData({
          repeat: value
        })
      }
    },

    // 快速决定
    switch1Change3(e) {
      var value = e.detail.value

      if (this.zhuanflg) {
        uni.showToast({
          title: this.i18n.luckyDraw1,
          icon: 'none'
        })
        return
      } else {
        this.setData({
          fastJuedin: value
        })
      }
    },

    // 概率 == 如果不重复抽取开启的话 概率是无效的
    switch1Change4(e) {
      var value = e.detail.value

      if (this.zhuanflg) {
        uni.showToast({
          title: this.i18n.luckyDraw1,
          icon: 'none'
        })
        return
      } else {
        this.setData({
          probability: value
        })
      }
    },

    // 获取用户氢春豆
    getScore() {
      const params = {
        url: '/p/score/scoreInfo',
        method: 'GET',
        callBack: (res) => {
          this.setData({
            currentScore: res.score
          })

          if (res.score < 300) {
            uni.showModal({
              title: this.i18n.tips,
              content: this.i18n.luckyDraw2,
              showCancel: false,
              cancelText: this.i18n.cancel,
              confirmText: this.i18n.confirm,
              success(res) {
                if (res.confirm) {
                  uni.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          }
        }
      }
      http.request(params)
    },

    // 获取用户地址
    getUserAddr() {
      const params = {
        url: '/p/address/list',
        method: 'GET',
        data: {},
        callBack: (res) => {
          this.setData({
            userAddrList: res
          })

          if (!res.length) {
            uni.showModal({
              title: this.i18n.tips,
              content: this.i18n.addAddressFirst,
              showCancel: false,
              cancelText: this.i18n.cancel,
              confirmText: this.i18n.confirm,

              success(res) {
                if (res.confirm) {
                  uni.navigateTo({
                    url: '/package-user/pages/delivery-address/delivery-address'
                  })
                }
              }
            })
          }
        }
      }
      http.request(params)
    }
  }
}
</script>
<style>
@import "./lucky-draw.css";
</style>
