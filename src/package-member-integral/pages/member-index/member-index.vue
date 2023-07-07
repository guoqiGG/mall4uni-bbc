<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 会员首页 -->
  <view class="Mall4j member-index">
    <!-- 会员信息 -->
    <view class="member-msg">
      <image src="../../static/images/icon/memberIndexBg.png" class="m-bg" />
      <view class="member-info">
        <view class="head-portrait">
          <image class="head-avatar" src="/static/images/icon/user-avatar-bg.png" />
          <image class="head-avatar-bg" :src="userInfo.pic ? userInfo.pic : '/static/images/icon/head04.png'
            " @error="imageError(userInfo, 'pic')" />
        </view>
        <view class="text-box">
          <view class="name-box">
            <text class="name">{{ userInfo.nickName }}</text>
            <view class="level" @tap="showLevelPop">
              <image :src="userMemberInfo.levelType == 0
                ? '/static/images/icon/normal-icon.png'
                : '/static/images/icon/integral-icon.png'
                " class="l-bg" />
              <view v-if="userMemberInfo.userLevel" class="text">{{
                userMemberInfo.userLevel.levelName
              }}</view>
            </view>
          </view>
          <!-- <view class="date">{{
            userMemberInfo.levelType == 0
              ? i18n.notPayingMember
              : userMemberInfo.endTime + i18n.expire
          }}</view> -->
        </view>
        <!-- <view class="buy-btn" @tap="buyMember">{{ i18n.buyMembership }}</view> -->
      </view>
      <view class="grow-box">
        <view class="item">
          <view class="text">{{ i18n.currentGrowthValue }}</view>
          <view class="number-box">
            <text class="number">{{ userCenterInfo.growth }}</text>
            <!-- <view class="arr">
              <image src="/static/images/icon/white-arr.png" />
            </view> -->
          </view>
        </view>
        <view class="item">
          <view class="text">{{ i18n.currentPoints }}</view>
          <view class="number-box" @tap="toIntegralDetail">
            <text class="number">{{ userCenterInfo.score }}</text>
            <view class="arr">
              <image src="/static/images/icon/white-arr.png" />
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- /会员信息 -->
    <!-- 签到 -->
    <!-- <view class="sign-in">
      <view class="member-tit">
        <view class="text">{{ i18n.dailySignIn }}</view>
      </view>
      <view class="con-box">
        <view
          v-for="(item, index) in userCenterInfo.scoreList"
          :key="index"
          class="item"
          :data-index="index"
          @tap="getPoints"
        >
          <view
            v-if="signInItem < index + 1 && 7 > userCenterInfo.signInCount"
            class="number"
          >+{{ item }}</view>
          <view
            v-if="signInItem < index + 1 && 7 <= userCenterInfo.signInCount"
            class="number"
          >+{{ userCenterInfo.scoreList[6] }}</view>
          <view
            v-if="signInItem == index + 1 && userCenterInfo.isSignIn == 0"
            class="number active num-text"
            data-type="1"
            @tap="getPoints"
          >{{ i18n.signIn }}</view>
          <view
            v-if="
              (signInItem >= index + 1 && userCenterInfo.isSignIn == 1) ||
                (signInItem > index + 1 && userCenterInfo.isSignIn == 0)
            "
            class="number active num-text"
          >{{ i18n.signedIn }}</view>
          <view
            v-if="userCenterInfo.signInCount < 7"
            class="day"
          >{{ i18n.dayItem }}{{ index + 1 }}{{ i18n.day }}</view>
          <view
            v-if="userCenterInfo.signInCount >= 7"
            class="day"
          >{{ i18n.dayItem
          }}{{ index + 1 + (userCenterInfo.signInCount - 7 + 1)
          }}{{ i18n.day }}</view>
        </view>
      </view>
    </view> -->
    <view class="sign-in">
      <view class="member-tit">
        <view class="text">{{ i18n.dailySignIn }}</view>
      </view>
      <view class="con-box">
        <view v-for="(item, index) in sevenDay" :key="index" class="item" :data-index="index" @tap="getPoints">
          <view :class="['number', item.signNumber == 0 ? '' : 'active']">{{ item.signNumber == 0 ? i18n.noSignIn :
            item.signNumber > 100 ? '100+' : '+' + item.signNumber }}</view>
          <!-- <view
            v-if="signInItem < index + 1 && 7 <= userCenterInfo.signInCount"
            class="number"
          >+{{ userCenterInfo.scoreList[6] }}</view>
          <view
            v-if="signInItem == index + 1 && userCenterInfo.isSignIn == 0"
            class="number active num-text"
            data-type="1"
            @tap="getPoints"
          >{{ i18n.signIn }}</view> -->


          <view class="day">{{ item.time }}</view>
        </view>
      </view>
    </view>
    <!-- /签到 -->
    <!-- 青春豆活动 -->
    <!-- <view class="activity">
      <view class="member-tit">
        <view class="text">{{ i18n.integralActivity }}</view>
      </view>
      <view class="con-box">
        <view class="item" @tap="goodsListViewMore">
          <image src="../../static/images/icon/integralActBg1.png" class="bg" />
          <view class="b-text">{{ i18n.pointsMall }}</view>
          <view class="s-text">{{ i18n.exchangePointsGoods }}</view>
        </view>
        <view class="item" @tap="toLuckyDraw">
          <image src="../../static/images/icon/integralActBg2.png" class="bg" />
          <view class="b-text">{{ i18n.largeTurntable }}</view>
          <view class="s-text">{{ i18n.PointsLuckyDraw }}</view>
        </view>
      </view>
    </view> -->
    <!-- /青春豆活动 -->
    <!-- 任务 -->
    <!-- <view class="mission">
      <view class="member-tit">
        <view class="text">{{ i18n.integralTask }}</view> -->
    <!-- <view class="more">查看更多</view> -->
    <!-- </view> -->
    <!-- <view class="con-box"> -->
    <!-- <view class="item">
        <view class="mission-box">
          <view class="name">购买付费会员</view>
          <view class="mission-des">购买付费会员可获得青春豆/次</view>
        </view>
        <view class="btn" bindtap="buyMember">去购买</view>
      </view> -->
    <!-- <view class="item">
          <view class="mission-box">
            <view class="name">{{ i18n.shoppingMall }}</view>
            <view class="mission-des">{{ i18n.shoppingMallGet }}，{{ userCenterInfo.shopScore
            }}{{ i18n.itemYuan }}</view>
          </view>
          <view class="btn" @tap="toIndexPage">{{ i18n.goShopping }}</view>
        </view>
        <view class="item">
          <view class="mission-box">
            <view class="name">{{ i18n.registerNewUsers }}</view>
            <view class="mission-des">{{ i18n.registerNewUsersTips }}{{ userCenterInfo.registerScore
            }}{{ i18n.integral }}</view>
          </view>
          <view v-if="userCenterInfo.isRegister == 0" class="btn" data-type="11" @tap="getPoints">{{ i18n.toComplete }}
          </view>
          <view v-if="userCenterInfo.isRegister == 1" class="btn done">{{
            i18n.completed
          }}</view>
        </view>
      </view>
    </view> -->
    <!-- /任务 -->
    <!-- 青春豆兑换 -->
    <!-- <view v-if="scoreProdList.length" class="integral-list">
      <view class="member-tit">
        <view class="text">{{ i18n.pointsExchange }}</view>
        <view class="more" @tap="goodsListViewMore">{{ i18n.seeMore }}</view>
      </view>
      <view class="con-box">
        <block v-for="(prod, prodId) in scoreProdList" :key="prodId">
          <goodsitem :prod="prod" />
        </block>
      </view>
    </view> -->
    <!-- 青春豆兑换 -->

    <!-- 青春豆攻略 -->
    <view class="sign-in">
      <view class="member-tit member-tit2">
        <view class="text">{{ i18n.integralStrategy }}</view>
        <view class="cont-det">
          <view class="cont-det-text" v-html="scoreExplain.paramValue" />
        </view>
      </view>
    </view>
    <!-- /青春豆攻略 -->

    <!-- 成长值攻略 -->
    <view class="sign-in" style="padding-bottom: 30rpx;">
      <view class="member-tit member-tit2">
        <view class="text">成长值攻略</view>
        <view class="cont-det">
          <view class="cont-det-text" style="font-size: 14px;line-height:24px;color:#707070;">
            观看直播，观看直播超过50分钟，即可签到成功一次，获得成长值+1。</view>

        </view>
      </view>
    </view>
    <!-- /成长值攻略 -->

    <!-- 会员等级详情弹框 -->
    <memberGrade ref="menberGrade"></memberGrade>
    <!-- /会员等级详情弹框 -->
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')
// 会员等级组件
import memberGrade from '../../components/menber-grade/menber-grade'
import goodsitem from '../../components/integral-goods-list/index.vue'
import dayjs from 'dayjs'
export default {
  components: {
    goodsitem,
    memberGrade
  },
  props: {},
  data() {
    return {
      isAuthInfo: true,
      userCenterInfo: {},
      signInItem: '', // 领取青春豆签到第几个签到按钮，大于7天，一直为第六个签到按钮
      current: 1,
      size: 20,
      scoreProdList: [],
      // 青春豆商品列表
      userInfo: {},
      // 个人信息
      userMemberInfo: {}, // 用户等级信息,
      sevenDay: [],
      dateList: [],
      scoreExplain: {},// 青春豆攻略
      showPop: false,
      levelType: 0
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
  onLoad: function (options) {
    // 获取会员中心信息
    this.getMemberCenterInfo() // 请求青春豆商品列表

    this.getScoreProdList() // 获取用户信息

    this.getUserInfo() // 获取用户会员信息

    this.getUserMemberInfo()

    this.getSevenDay() // 计算最近7天的日期

    this.get7DayUserStore() //获取用户一周的签到展示

    this.getScoreExplain() // 青春豆攻略
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    // 设置头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.membershipCentre
    })
    this.setData({
      isAuthInfo: Boolean(uni.getStorageSync('bbcToken'))
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
  methods: {
    // 显示会员等级弹框
    showLevelPop: function () {
      this.$refs.menberGrade.showLevelPop()
    },

    /**
 * 青春豆攻略
 */
    getScoreExplain: function () {
      var param = {
        url: '/p/score/getScoreQuestion',
        method: 'GET',
        data: {},
        callBack: (res) => {
          this.setData({
            scoreExplain: res
          })
        }
      }
      http.request(param)
    },
    /**
     * 获取用户当前会员信息
     */
    getUserMemberInfo() {
      // 付费会员等级
      const params = {
        url: '/p/score/scoreLevel/page',
        method: 'GET',
        data: {
          levelType: 0
        },
        callBack: (res) => {
          if (res.endTime) {
            res.endTime = res.endTime.split(' ')[0]
          }
          this.getVipInternationalization(res.userLevel)
          this.setData({
            userMemberInfo: res,
            levelType: res.levelType
          })
        }
      }
      http.request(params)
    },

    /**
     * 获取用户信息
     */
    getUserInfo: function () {
      var param = {
        url: '/p/user/userInfo',
        method: 'GET',
        data: {},
        callBack: (res) => {
          this.setData({
            userInfo: res
          })
        }
      }
      http.request(param)
    },

    /**
     * 计算最近7天的日期
     * */
    getSevenDay: function () {
      const weekday = dayjs().day();
      let dateList = new Array(7).fill(0).map((el, idx) => (
        el = dayjs().day(weekday - idx).format('MM-DD')
      )).reverse()
      this.setData({
        dateList: dateList
      })

    },

    /**
     * 一周的签到展示
     */

    get7DayUserStore: function () {
      const param = {
        url: '/p/score/get7DayUserStore',
        method: 'GET',
        data: {},
        callBack: (res) => {
          let sevenDay = [{ time: '', signNumber: 0 }, { time: '', signNumber: 0 }, { time: '', signNumber: 0 }, { time: '', signNumber: 0 }, { time: '', signNumber: 0 }, { time: '', signNumber: 0 }, { time: '', signNumber: 0 }]
          this.dateList.forEach((e, index) => {
            sevenDay[index].time = e
            res.forEach(d => {
              if (d.createTime.includes(e)) {
                sevenDay[index].signNumber = d.totalNum
              }
            });
          })
          this.setData({
            sevenDay: sevenDay
          })

        }
      }
      http.request(param)
    },

    /**
     * 获取会员中心信息
     */
    getMemberCenterInfo: function () {
      const params = {
        url: '/p/score/scoreInfo',
        method: 'GET',
        data: {},
        callBack: (res) => {
          // 领取青春豆签到第几个签到按钮，大于7天，一直为第六个签到按钮
          let signInItem = ''
          if (res.signInCount >= 7) {
            signInItem = 6
          } else {
            signInItem = res.signInCount
          }
          this.setData({
            userCenterInfo: res,
            signInItem
          })
        }
      }
      http.request(params)
    },

    /**
     * 获取青春豆的方法（签到）
     */
    getPoints(e) {
      // var index = Number(e.currentTarget.dataset.index)
      // const params = {
      //   url: '/p/score/updateUserScore',
      //   method: 'GET',
      //   data: {},
      //   callBack: (res) => {
      //     uni.showToast({
      //       title: res,
      //       icon: 'none'
      //     })
      //     this.getMemberCenterInfo()
      //   }
      // }

      // if (this.userCenterInfo.isSignIn == 1 && this.signInItem == index + 1) {
      //   uni.showToast({
      //     title: this.i18n.hasAlreadySigned,
      //     icon: 'none'
      //   })
      // } else if (
      //   this.userCenterInfo.isSignIn == 0 &&
      //   this.signInItem == index + 1
      // ) {
      //   http.request(params)
      // } else if (this.signInItem > index + 1) {
      //   uni.showToast({
      //     title: this.i18n.hasAlreadySigned,
      //     icon: 'none'
      //   })
      // }
    },

    /**
     * 跳转到青春豆明细(当前青春豆)
     */
    toIntegralDetail: function () {
      uni.navigateTo({
        url: '/package-member-integral/pages/integral-detail/integral-detail'
      })
    },

    /**
     * 跳转到会员中心(当前成长值)
     */
    toMemberCenter: function () {
      uni.navigateTo({
        url: '/package-member-integral/pages/member-center/member-center'
      })
    },

    /**
     * 购买会员跳转页面
     */
    buyMember: function () {
      uni.navigateTo({
        url: '/package-member-integral/pages/buy-vip/buy-vip'
      })
    },

    /**
     * 去购物
     */
    toIndexPage: function () {
      util.toHomePage()
    },

    /**
     * 青春豆兑换 查看更多
     */
    goodsListViewMore: function () {
      uni.navigateTo({
        url: '/package-member-integral/pages/integral-index/integral-index'
      })
    },

    /**
     * 获取青春豆商品列表
     */
    getScoreProdList() {
      var param = {
        url: '/search/page',
        method: 'GET',
        data: {
          current: this.current,
          size: this.size,
          prodType: 3,
          sort: 2,
          userId: uni.getStorageSync('bbcUserInfo') ? uni.getStorageSync('bbcUserInfo').userId : ''
        },
        callBack: (res) => {
          this.setData({
            scoreProdList: res.records[0].products
          })
        }
      }
      http.request(param)
    },

    /**
     * 跳转大转盘抽奖
     */
    toLuckyDraw() {
      uni.showToast({
        title: this.i18n.comingOnlineSoon,
        icon: 'none'
      }) // uni.navigateTo({
      //   url: '/package-member-integral/pages/lucky-draw/lucky-draw',
      // })
    },
    // 国际化
    getVipInternationalization(data) {
      const lang = uni.getStorageSync('bbcLang') || 'zh_CN'
      if (!data) return
      let levelNameCn, levelNameEn
      data.userLevelLangList.map(val => {
        if (val.lang === 0) levelNameCn = val.levelName
        if (val.lang === 1) levelNameEn = val.levelName
      })
      data.levelName = lang === 'zh_CN' ? levelNameCn : levelNameEn || levelNameCn
    }
  }
}
</script>
<style>
@import "./member-index.css";
</style>
