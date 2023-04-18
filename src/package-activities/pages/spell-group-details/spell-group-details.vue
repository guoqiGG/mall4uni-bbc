<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j">
    <!-- 拼团详情 -->
    <view v-if="groupTempInfo.groupTeam" class="top-box" :style="!isZh ? 'height: unset' : ''">
      <view class="top-bg" />
      <!-- 商品内容盒子 -->
      <view class="goods-content">
        <view class="goods-img-box">
          <ImgShow :src="groupTempInfo.productVO.pic" :classList="['goods-img']" />
        </view>
        <!-- 商品信息信息 -->
        <view v-if="groupTempInfo.productVO.prodName" class="goods-msg">
          <text class="goods-title">{{ groupTempInfo.productVO.prodName }}</text>
          <view v-if="groupTempInfo.productVO.activityPrice" class="goods-price">
            <text v-if="groupTempInfo.productVO.activityPrice" class="spell-group-price">￥{{ groupTempInfo.productVO.activityPrice }}</text>
            <text v-if="groupTempInfo.productVO.price" class="original-price">￥{{ groupTempInfo.productVO.price }}</text>
          </view>
        </view>
      </view>
      <!-- 商品内容盒子 end -->
      <!-- 规则 -->
      <view class="tips-text clearfix" :style="i18n.changeLangs != '切换为简体中文' ? 'font-size:13px;bottom:1.7em' : '' ">
        <image src="/static/images/icon/thumb.png" class="thumb-icon" />
        <text class="tips-text-cnt">{{ i18n.groupJoiningRules1 }} {{ joinNum }} {{ i18n.groupJoiningRules2 }}</text>
      </view>
    </view>
    <!-- 下 -->
    <view v-if="groupTempInfo.groupTeam" class="condition">
      <!-- 剩余时间 -->
      <view class="time-remaining">
        <text class="line-left" />
        <text v-if="groupTempInfo.groupTeam.status == 1 && !isEnd" class="time-text">{{ i18n.groupJoinTime }}</text>
        <text v-if="groupTempInfo.groupTeam.status == 2" class="time-text">{{ i18n.groupJoiningSuccess }}</text>
        <text v-if="groupTempInfo.groupTeam.status == 3 || isEnd" class="time-text">{{ i18n.groupJoiningFailure }}</text>
        <text class="line-right" />
      </view>
      <view v-if="groupTempInfo.groupTeam.status == 1 && !isEnd" class="countdown">
        <text class="time-number">{{ countDownObj.hou }}</text>：
        <text class="time-number">{{ countDownObj.min }}</text>：
        <text class="time-number">{{ countDownObj.sec }}</text>
      </view>

      <!-- 人员 -->
      <view class="member" :style="'padding-left:' + (groupUserList.length > 5 ? '40px;' : (groupUserList.length - 2) * 10 + 'px')">
        <block v-for="(groupUser, index) in groupUserList" :key="index">
          <view v-if="groupUser.identityType == 1" class="captain">
            <image class="captain-img" :src="groupUser.pic ? groupUser.pic : '/static/images/icon/head04.png'" @error="imageError(groupUser,'pic')" />
            <text class="status">{{ i18n.teamLeader }}</text>
          </view>
          <view v-else-if="groupUser.identityType == 0 && index < 5" class="group-member" :style="'z-index:' + (-index + 99) + '; left:' + -index * 10 + 'px'">
            <image class="group-member-img" :src=" groupUser.pic ? groupUser.pic : '../../../static/images/icon/head04.png'" @error="imageError(groupUser,'pic')" />
          </view>
          <view v-else-if="index < 5" class="group-member" :style="'z-index:' + (-index + 99) + '; left:' + -index * 10 + 'px'">
            <image class="group-member-img" src="../../../static/images/icon/head04.png" />
          </view>
        </block>
      </view>
      <view v-if="groupTempInfo.groupTeam.groupNumber > 5" class="more-ellipsis">
        <text decode="true">·&nbsp;·&nbsp;·</text>
      </view>

      <!-- 查看全部团员btn -->
      <view class="view-all display">{{ i18n.viewAllMembers }}</view>
      <view v-if="groupTempInfo.groupTeam.status == 1 && !isEnd" class="invite-text">{{ i18n.onlyLeft }}
        <text>{{ groupTempInfo.groupTeam.groupNumber - groupTempInfo.groupTeam.joinNum }}</text>
        {{ i18n.peopleJoinGroup }}
      </view>
      <view class="invite-text display">
        {{ i18n.lack }}
        <text>{{ groupTempInfo.groupTeam.groupNumber - groupTempInfo.groupTeam.joinNum }}</text>
        {{ i18n.peopleGroupSuccess }}
      </view>
      <!-- 邀请好友参团 -->
      <!-- #ifdef H5 -->
      <view v-if="groupTempInfo.groupTeam.status == 1 && !isEnd" class="join-now" @tap="h5Share">{{ i18n.inviteFriendsJoin }}</view>
      <!-- #endif -->
      <!-- #ifdef MP -->
      <button v-if="groupTempInfo.groupTeam.status == 1 && !isEnd" class="join-now" open-type="share"> {{ i18n.inviteFriendsJoin }} </button>
      <!-- #endif -->
      <view v-if=" !groupTempInfo.orderNumber && groupTempInfo.groupTeam.status == 1 && !isEnd " class="join-now" @tap="showSku">
        {{ i18n.JoinGroupNow }}
      </view>
      <!-- 查看团队 -->
      <view class="join-now" @tap="toGroupTempInfoPage(groupTempInfo.groupTeam.groupTeamId)"> {{ i18n.viewTeam }} </view>
      <!-- 查看详情btn -->
      <view v-if="groupTempInfo.orderNumber" class="check-order" @tap="toOrderDetailPage(groupTempInfo.orderNumber)">{{ i18n.viewOrderDetails }}</view>
    </view>

    <!-- 规格弹窗 -->
    <prod-sku-select
      v-if="skuShow"
      :mold="mold"
      :pic="groupTempInfo.productVO.pic"
      :sku-list="groupActivityVO.groupSkuList"
      :default-price="groupTempInfo.productVO.activityPrice"
      :virtual-info="virtualInfo"
      :sku-show-type="1"
      :prod-type="1"
      :prod-num="prodNum"
      :page-type="0"
      :sku-show="skuShow"
      :is-jion-group="true"
      :activity-info="groupActivityVO"
      @groupConfirmOrder="groupConfirmOrder"
      @setSku="setSku"
      @closeSkuPop="closePopup"
      @setVirtualInputInfo="setVirtualInputInfo"
      @setProdNum="setProdNum"
    />
    <!-- 规格弹窗 end -->
    <!-- 引导分享蒙版 -->
    <guide-share
      v-if="showGuideShare"
      :is-wechat="isWechat"
      :qr-link="qrLink"
      @hideGuideShare="hideGuideShare"
    />
    <!-- 引导分享蒙版 end -->
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
const config = require('../../../utils/config.js')
const util = require('../../../utils/util.js')
import Wechat from '../../../utils/wechat.js'
import guideShare from '../../components/guide-share/index.vue'
import prodSkuSelect from '../../../components/prod-sku-select/index.vue'
export default {
  components: {
    guideShare,
    prodSkuSelect
  },

  props: {},
  data() {
    return {
      reqComplete: false,
      hideModal: true,
      groupTempInfo: {
        productVO: {},
        groupTeam: {}
      },
      groupUserList: [],
      countDownObj: {},
      nowTime: new Date().getTime(),
      skuShow: false,
      prodNum: 1,
      skuList: [],
      skuGroup: {},
      findSku: true,
      defaultSku: undefined,
      detaultGroupSku: undefined,
      selectedProp: [],
      selectedPropObj: {},
      selectedProperties: '',
      propKeys: [],
      allProperties: [],
      groupTeamId: '',
      groupSkuId: 0,
      orderNumber: 0,
      isAuthInfo: true,
      countDownObjTimer: '',
      joinNum: '',

      isEnd: false, // 当前拼团是否已经结束
      isZh: uni.getStorageSync('bbcLang') === 'zh_CN', // 是否为中文
      showGuideShare: false, // 分享引导显隐
      isWechat: false, // 是否微信环境
      showQr: false, // H5 二维码显隐
      qrLink: '', // H5二维码地址
      // 是否显示商城页按钮
      showIndexBtn: false,

      // 虚拟商品
      mold: '', // 1虚拟商品
      virtualRemarks: [], // 留言
      isRefund: null, // 0不支持退款 1支持退款
      writeOffTime: null, // 核销有效期 -1.长期有效 0.自定义 x.x天内有效
      writeOffNum: null, // 核销次数 -1.多次核销 0.无需核销 1.单次核销
      writeOffStart: null, // 核销有效期开始时间
      writeOffEnd: null, // 核销有效期结束时间

      isLoading: false,
      virtualInfo: {},
      groupActivityVO: {}
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
    // #ifdef H5
    this.isWechat = Wechat.isWechat()
    // #endif
    const groupTeamId = this.$Route.query.groupTeamId || ''
    const orderNumber = this.$Route.query.orderNumber || ''
    this.getGroupTeamInfo(groupTeamId, orderNumber)
    this.isLoading = true
    this.setData({
      orderNumber: orderNumber,
      groupTeamId: groupTeamId
    })
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
      title: this.i18n.groupDetails
    })
    const pages = getCurrentPages()
    this.showIndexBtn = pages.length <= 1
    if ((this.groupTeamId || this.orderNumber) && !this.isLoading) {
      this.getGroupTeamInfo(this.groupTeamId, this.orderNumber)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.isLoading = false
    clearTimeout(this.countDownObjTimer)
    this.closePopup()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearTimeout(this.countDownObjTimer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 小程序: 邀请好友参团
   */
  onShareAppMessage: function(res) {
    return {
      title: this.groupTempInfo.productVO.prodName,
      path:
        '/package-activities/pages/spell-group-details/spell-group-details?groupTeamId=' +
        this.groupTeamId,
      imageUrl: this.groupTempInfo.productVO.prodPic
    }
  },
  methods: {
    /**
     * 设置虚拟商品信息
     */
    setVirtualInputInfo(virtualRemarkList) {
      this.virtualRemarks = virtualRemarkList
    },

    /**
     * 修改商品的sku
     */
    setSku(sku, findSku) {
      this.findSku = findSku
      this.defaultSku = sku
    },

    /**
     * 修改商品数量
     */
    setProdNum(prodNum) {
      this.prodNum = prodNum
    },

    /**
     * 返回首页
     */
    toIndex() {
      util.toHomePage()
    },

    /**
     * 输入商品数量
     */
    prodNumInp(e) {
      const num = Number(e.detail.value.replace(/[^\d]/g, ''))
      this.prodNum = num
    },
    /**
     * H5: 邀请好友参团
     */
    h5Share() {
      if (this.isWechat) {
        // 微信内部浏览器
        var sharedata = {
          title: this.groupTempInfo.productVO.prodName, // 分享标题
          imgUrl: this.groupTempInfo.productVO.pic, // 分享图标
          // imgUrl: this.groupTempInfo.productVO.prodPic, // 分享图标
          link:
            config.domainAddress +
            '/package-activities/pages/spell-group-details/spell-group-details?groupTeamId=' +
            this.groupTeamId,
          desc: this.i18n.shartTips, // 分享描述
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '' // 如果type是music或video，则要提供数据链接，默认为空
        }
        Wechat.callWexinShare(
          sharedata,
          () => {
            this.showGuideShare = true
          },
          (failMsg) => {
            console.log(failMsg)
          }
        )
      } else {
        // 普通H5浏览器: 显示生成的二维码
        this.qrLink =
          config.domainAddress +
          '/package-activities/pages/spell-group-details/spell-group-details?groupTeamId=' +
          this.groupTeamId
        this.showGuideShare = true
      }
    },
    /**
     * 关闭分享引导
     */
    hideGuideShare(e) {
      this.showGuideShare = e
    },

    /**
     * 参团
     */
    groupConfirmOrder: function() {
      if (!this.findSku) {
        return
      }
      if (this.prodNum < 1) {
        uni.showToast({
          title: this.i18n.leastTips,
          icon: 'none'
        })
        this.prodNum = 1
        return
      }
      // 虚拟商品
      if (this.mold === 1) {
        const remarks = []
        this.virtualRemarks.forEach((el) => {
          if (el.value) {
            remarks.push(el)
          }
        })
        uni.setStorageSync('bbcVirtualRemark', JSON.stringify(remarks))
      }
      const orderItem = {
        prodId: this.groupTempInfo.productVO.prodId,
        skuId: this.defaultSku.skuId,
        prodCount: this.prodNum,
        shopId: this.groupTempInfo.productVO.shopId,
        groupSkuId: this.defaultSku.groupSkuId,
        groupTeamId: this.groupTeamId
      }
      uni.setStorageSync('bbcOrderItem', Object.assign({}, orderItem))
      uni.navigateTo({
        url: `/pages/submit-order/submit-order?orderEntry=1&orderType=1&mold=${this.mold}`
      })
    },
    showSku: function() {
      var ths = this // 查看是否授权

      util.checkAuthInfo(ths.showSkuFun)
    },
    showSkuFun: function() {
      this.setData({
        skuShow: true
      })
    },
    closePopup: function() {
      this.setData({
        skuShow: false
      })
    },

    /**
     * 加载拼团团队详情
     */
    getGroupTeamInfo(groupTeamId, orderNumber) {
      this.isLoading = true
      http.request({
        url: '/p/groupTeam/info',
        method: 'GET',
        data: {
          groupTeamId: groupTeamId,
          orderNumber: orderNumber
        },
        callBack: (res) => {
          this.setData({
            skuList: res.groupSkuList,
            groupTempInfo: res,
            groupUserList: res.apiGroupUserList,
            nowTime: util.dateToTimestamp(res.groupTeam.nowTime),
            joinNum: res.groupTeam.groupNumber - 1,
            groupTeamId: res.groupTeam.groupTeamId
          })

          const groupUserCount =
            this.groupUserList.length > 5 ? 5 : this.groupUserList.length
          const groupNumber =
            this.groupTempInfo.groupTeam.groupNumber > 5
              ? 5
              : this.groupTempInfo.groupTeam.groupNumber
          const unGroupNumber = groupNumber - groupUserCount
          let groupUserList = this.groupUserList
          if (unGroupNumber > 0) {
            for (let i = 0; i < unGroupNumber; i++) {
              groupUserList = groupUserList.concat({})
            }
          }

          this.setData({
            groupUserList: groupUserList
          })
          if (res.groupTeam.status == 2) {
            // 拼团已经结束
            return
          }

          this.countdown()

          // 虚拟商品
          this.mold = res.productVO.mold
          this.isRefund = res.productVO.isRefund // 0不支持退款 1支持退款
          this.writeOffTime = res.productVO.writeOffTime // 核销有效期 -1.长期有效 0.自定义 x.x天内有效
          this.writeOffNum = res.productVO.writeOffNum // 核销次数 -1.多次核销 0.无需核销 1.单次核销
          this.writeOffStart = res.productVO.writeOffStart // 核销有效期开始时间
          this.writeOffEnd = res.productVO.writeOffEnd // 核销有效期结束时间
          this.virtualRemarks = res.productVO.virtualRemark
            ? JSON.parse(res.productVO.virtualRemark)
            : [] // 留言
          // 虚拟商品
          if (this.virtualRemarks && this.virtualRemarks.length) {
            this.virtualRemarks.forEach((el) => {
              el.value = ''
            })
          }
          if (res.productVO.mold === 1) {
            this.virtualInfo = {
              virtualRemarks: res.productVO.virtualRemark
                ? JSON.parse(res.productVO.virtualRemark)
                : [], // 留言
              isRefund: res.productVO.isRefund, // 0不支持退款 1支持退款
              writeOffTime: res.productVO.writeOffTime, // 核销有效期 -1.长期有效 0.自定义 x.x天内有效
              writeOffNum: res.productVO.writeOffNum, // 核销次数 -1.多次核销 0.无需核销 1.单次核销
              writeOffStart: res.productVO.writeOffStart, // 核销有效期开始时间
              writeOffEnd: res.productVO.writeOffEnd, // 核销有效期结束时间
              prodParameterList: res.productVO.prodParameterList
            }
          }
          // 获取团购详情
          this.getProdInfo(res.productVO.prodId)
        }
      })
    },

    /**
     * 获取团购详情
     */
    getProdInfo(prodId) {
      const params = {
        url: '/prod/prodInfo',
        method: 'GET',
        data: {
          prodId
        },
        callBack: res => {
          this.groupActivityVO = res.groupActivityVO
        },
        errCallBack: errMsg => {
          console.log(errMsg)
        }
      }
      http.request(params)
    },

    // 倒计时
    countdown() {
      // 获取当前时间，同时得到活动结束时间数组
      const nowTime = this.nowTime
      const endTime = util.dateToTimestamp(
        this.groupTempInfo.groupTeam.endTime
      )
      let countDownObj = {} // 对结束时间进行处理渲染到页

      if (endTime - nowTime > 0) {
        // 如果活动未结束，对时间进行处理
        const time = (endTime - nowTime) / 1000 // 获取天、时、分、秒

        const day = parseInt(time / (60 * 60 * 24))
        const hou = parseInt((time % (60 * 60 * 24)) / 3600)
        const min = parseInt(((time % (60 * 60 * 24)) % 3600) / 60)
        const sec = parseInt(((time % (60 * 60 * 24)) % 3600) % 60)
        countDownObj = {
          day: `${this.timeFormat(day)}`,
          hou: `${this.timeFormat(hou)}`,
          min: `${this.timeFormat(min)}`,
          sec: `${this.timeFormat(sec)}`
        }
      } else {
        countDownObj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00'
        }
        this.isEnd = true
      } // 渲染，然后每隔一秒执行一次倒计时函数

      this.setData({
        nowTime: nowTime + 1000,
        countDownObj: countDownObj,
        countDownObjTimer: setTimeout(this.countdown, 1000)
      })
    },

    // 小于10的格式化函数
    timeFormat(times) {
      return times < 10 ? '0' + times : times
    },

    /**
     * 查看订单详情
     */
    toOrderDetailPage(orderNum) {
      this.$Router.push({
        path: '/package-user/pages/order-detail/order-detail',
        query: {
          orderNum
        }
      })
    },

    /**
     * 查看拼团团队
     */
    toGroupTempInfoPage(groupTeamId) {
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: `/package-activities/pages/spell-members-details/spell-members-details?groupTeamId=${groupTeamId}`
        })
      })
    }
  }
}
</script>
<style scoped>
@import "./spell-group-details.css";
</style>
