<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j platform-message notice-message my-message">
    <!-- tab -->
    <view class="tab">
      <view
        class="tab-item"
        :class="{ active: currentTabType === 0 }"
        @tap="switchTab(0)"
      >{{ i18n.systemNotification }}</view>
      <view
        class="tab-item"
        :class="{ active: currentTabType === 1 }"
        @tap="switchTab(1)"
      >{{ i18n.platformAnnouncement }}</view>
      <view
        class="tab-item"
        :class="{ active: currentTabType === 2 }"
        @tap="switchTab(2)"
      >{{ i18n.messageBox }}</view>
    </view>

    <!-- 系统通知 -->
    <view v-if="currentTabType === 0" class="notices-box">

      <view
        v-for="(item, index) in msgList"
        :key="index"
        :class="['item', item.status === 0 ? 'unread' : '']"
      >
        <view class="time">{{ item.updateTime }}</view>
        <view class="item-box">
          <!-- <view class="tit">{{i18n.platformAnnouncement}}</view> -->
          <view class="text-box" style="fontsize: 14px">{{
            item.message
          }}</view>
        </view>
      </view>

      <!-- status 是否阅读 1已读 0未读 -->
      <view class="coupon-foot">
        <view :class="'coupon-btn ' + (status == 0 ? 'active' : '')" data-sts="0" @tap="changeTab">{{ i18n.unread }}</view>
        <view :class="'coupon-btn ' + (status == 1 ? 'active' : '')" data-sts="1" @tap="changeTab">{{ i18n.read }}</view>
        <!-- <view class="btn" @tap="toCouponCenter">领更多好券</view> -->
      </view>
    </view>

    <!-- 平台公告 -->
    <view v-if="currentTabType === 1" class="platform notices-box">
      <!-- isLearning 0未读 1已读 -->
      <view
        v-for="item in msgList"
        :key="item.id"
        :class="['item', item.isLearning === 0 ? 'unread' : '']"
        @tap="toMessageDetail(item.id)"
      >
        <view class="tit-box">
          <!-- type 1平台公告 2店铺公告 -->
          <view class="tit">{{ item.title }}</view>
          <view class="time">{{ item.publishTime }}</view>
        </view>
        <view class="text-box">
          <rich-text :nodes="item.content" />
        </view>
        <view class="text-arrow">{{ i18n.seeDetails }}</view>
      </view>
    </view>

    <!-- 客服消息 -->
    <view v-if="currentTabType === 2" class="service-message" :class="{'notices-box':!msgList.length}">
      <view
        v-for="(item, index) in msgList"
        :key="index"
        class="item unread"
        @tap="toChat(item.shopId, item.chatType)"
      >
        <view class="logo">
          <image
            :src="
              item.pic ? item.pic : '/static/images/icon/customer-service.png'
            "
            @error="imageError(item,'pic')"
          />
        </view>
        <view class="text-box">
          <view class="name">{{ item.friendName }}</view>
          <view class="des">{{ item.latestMsg }}</view>
        </view>
        <view class="time-box">
          <view class="time">{{ item.timeStr }}</view>
          <view v-if="item.unread" class="unread-box">
            <view class="number">{{ item.unread }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 为空 -->
    <!-- <view v-if="!msgList.length" class="empty">
      <view class="img">
        <image src="/static/images/empty-img/not-found.png" />
      </view>
      <view
        class="text"
      >{{ i18n.noneZ
      }}{{
        currentTabType === 0
          ? i18n.notification
          : currentTabType === 1
            ? i18n.announcement
            : i18n.message
      }}{{ i18n.records }}</view>
    </view> -->

    <!-- 空列表或加载全部提示 -->
    <EmptyAllTips
      v-if="isLoaded"
      :emptyImg="2"
      :isEmpty="!msgList.length"
      :emptyTips="emptyTips"
    />

  </view>
</template>

<script>
const http = require('@/utils/http.js')
import config from '../../../utils/config.js'
import util from '../../../utils/util'
import { Base64 } from '../../../js_sdk/base64/base64'
export default {
  data() {
    return {
      userInfo: null,
      pageNum: 1,
      pageSize: 10,
      msgList: [],
      pages: 0,
      total: 0,
      status: 0,

      shopId: 0, // 0平台公告
      currentTabType: 0,
      loadAll: false,
      isLoaded: false
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    },
    emptyTips() {
      const msg = this.currentTabType === 0
        ? this.i18n.notification
        : this.currentTabType === 1
          ? this.i18n.announcement
          : this.i18n.message
      return this.i18n.noneZ + msg + this.i18n.records
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    options = { ...this.$Route.query }
    this.currentTabType = Number(options.tabType) || 0
    uni.setNavigationBarTitle({
      title:
        this.currentTabType === 1
          ? this.i18n.platformAnnouncement
          : this.currentTabType === 2
            ? this.i18n.messageBox
            : this.i18n.systemNotification
    })
  },

  onShow() {
    this.loadMsgList()
    if (this.userInfo) {
      this.openWs()
    }
  },

  onReachBottom() {
    if (this.pageNum < this.pages) {
      this.pageNum = this.pageNum + 1
      this.loadMsgList()
    } else {
      this.loadAll = true
    }
  },

  methods: {
    /**
     * 获取用户信息
     */
    getUserInfo() {
      const params = {
        url: '/p/user/userInfo',
        method: 'GET',
        data: {},
        dontTrunLogin: true,
        callBack: (res) => {
          this.userInfo = res
          this.openWs()
        },
        errCallBack: (res) => {
          uni.redirectTo({
            url: '/pages/user-login/user-login'
          })
        }
      }
      http.request(params)
    },

    openWs() {
      this.imSocketTask = uni.connectSocket({
        url:
          config.imWsDomain +
          '/im/websocket/user/' +
          Base64.encode(uni.getStorageSync('bbcToken')) +
          '/' +
          this.userInfo.userId, // 仅为示例，并非真实接口地址。
        complete: () => {}
      })

      this.imSocketTask.onMessage((res) => {
        const result = JSON.parse(res.data)
        result.code = Number(result.code)
        // console.log('onMessage:' + res.data)
        //
        if (result.code == 10) {
          console.log('无法获取用户信息，跳转到登陆页面')
          return
        }
        if (result.code == 11) {
          console.log('账户已在别处登录，请刷新')
          return
        }
        if (result.code == 12) {
          console.log('对方不在线')
          return
        }
        if (!result.data) {
          return
        } else if (!result.data.content) {
          return
        }
        const msgItem = result.data
        // 消息内容
        let msgContent = ''
        // 图片消息
        if (msgItem.type === 1) {
          msgContent = '[图片]'
        } else {
          msgContent = msgItem.content
        }
        let lastMsgItem = []
        for (var i = 0; i < this.msgList.length; i++) {
          var item = this.msgList[i]
          // 更新最新消息
          if (msgItem.shopId === item.shopId) {
            item.latestMsg = msgContent
            item.timeStr = msgItem.timeStr
            lastMsgItem = item
            if (msgItem.chatType === this.currentTabType) {
              this.msgList.splice(i, 1)
            }
            break
          }
        }

        if (msgItem.chatType === this.currentTabType) {
          this.msgList.unshift({
            pic: msgItem.shopLogo,
            friendName: msgItem.shopName,
            shopId: msgItem.shopId,
            latestMsg: msgContent,
            unread: lastMsgItem.length > 0 ? lastMsgItem[0].unread + 1 : '',
            timeStr: msgItem.timeStr
          })
          this.setData({
            msgList: this.msgList
          })
        }
      })
    },

    // 判断是否为JSON格式
    isJSON(str) {
      if (typeof str === 'string') {
        try {
          JSON.parse(str)
          return true
        } catch (e) {
          return false
        }
      }
    },

    /**
     * 根据tabType类型 获取消息数据
     */
    loadMsgList() {
      let reqData = {}
      let url = ''
      if (this.currentTabType === 0) {
        url = '/p/myNotifyLog/unReadCountList'
        reqData = {
          current: this.pageNum,
          size: 10,
          status: this.status
        }
      } else if (this.currentTabType === 1) {
        let path = 'notice/noticeList/0'
        if (uni.getStorageSync('bbcToken')) {
          path = '/p/notice/noticeList/0'
        }
        url = path
        reqData = {
          current: this.pageNum,
          size: 10
        }
      } else if (this.currentTabType === 2) {
        url = '/p/user/conversations'
        reqData = {
          current: this.pageNum,
          size: 10
        }
        if (!this.userInfo) {
          this.getUserInfo()
        }
      }
      this.isLoaded = false
      const params = {
        url: url,
        method: this.currentTabType === 2 ? 'POST' : 'GET',
        data: reqData,
        callBack: (res) => {
          this.isLoaded = true
          if (this.currentTabType === 1) {
            res.records.forEach((element) => {
              if (element.content === null) {
                element.content = ''
                return
              }
              element.content = util.formatHtml(element.content)
            })
          }
          let list = []
          // if (this.currentTabType === 0) {
          if (this.pageNum === 1) {
            list = res.records
          } else {
            list = this.msgList.concat(res.records)
          }
          this.msgList = list
          this.pages = res.pages
          if (this.currentTabType === 2) {
            this.msgList = list.filter((item) => {
              const a = this.isJSON(item.latestMsg)
              if (item.chatType === 1) {
                item.friendName = this.i18n.PCS
              }
              // 店铺状态 下线由0改为2  1营业
              if (item.shopStatus === 2) {
                return false
              } else if (item.type === 1) {
                item.latestMsg = '[图片]'
                return true
              } else if (a && JSON.parse(item.latestMsg) instanceof Object) {
                item.latestMsg = '[' + this.i18n.productLinks + ']' // 商品链接
                return true
              } else {
                return true
              }
            })
          }
        },
        errCallBack: (errMsg) => {
          console.log(errMsg)
        }
      }
      if (this.currentTabType === 2) {
        params.domain = config.imDomain
      }
      http.request(params)
    },

    // 去公告详情
    toMessageDetail(id) {
      uni.navigateTo({
        url: '/package-user/pages/news-detail/news-detail?id=' + id
      })
    },

    // 去客服聊天

    toChat(shopId, chatType) {
      if (chatType === 1) {
        shopId = 0
      }
      uni.navigateTo({
        url: '/package-user/pages/chat/chat-im?shopId=' + shopId
      })
    },

    /**
     * 切换消息Tab
     * @param {Number} tabType 当前展示的消息类型
     */
    switchTab(tabType) {
      this.currentTabType = tabType
      this.msgList = []
      uni.setNavigationBarTitle({
        title:
          tabType === 1
            ? this.i18n.platformAnnouncement
            : this.currentTabType === 2
              ? this.i18n.messageBox
              : this.i18n.systemNotification
      })
      this.pageNum = 1
      this.pages = 0
      this.loadMsgList()
    },

    /**
     * 切换消息类型
     */
    changeTab(e) {
      this.setData({
        status: e.currentTarget.dataset.sts,
        pageNum: 1
      })
      this.loadMsgList()
    }
  }
}
</script>

<style>
@import "./message-platform.css";
</style>
