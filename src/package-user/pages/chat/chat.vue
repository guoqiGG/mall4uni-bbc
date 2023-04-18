<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j my-message">
    <!-- tab -->
    <view class="tab">
      <view class="tab-item active">{{ i18n.messageBox }}</view>
      <view class="tab-item" @tap="toMessagePlatform">{{
        i18n.platformAnnouncement
      }}</view>
      <view
        :class="['tab-item', messageCount ? 'unread-tip' : '']"
        @tap="toMessageNotice"
      >{{ i18n.systemNotification }}</view>
    </view>

    <!-- 客服消息 -->
    <view v-if="conversations.length" class="service-message">
      <view
        v-for="(item, index) in conversations"
        :key="index"
        class="item unread"
        @tap="gotochat(item.shopId, item.chatType)"
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

    <!-- <view class="item unread">
        <view class="logo">
        </view>
        <view class="text-box">
          <view class="name">商家名称</view>
          <view class="des">消息内容简介，消息内容简介，超过展示省略号</view>
        </view>
        <view class="time-box">
          <view class="time">2020/12/28</view>
          <view class="unread-box">
            <view class="number">99+</view>
          </view>
        </view>
      </view> -->

    <!-- 为空 -->
    <!-- <view v-if="!conversations.length" class="empty">
      <view class="img">
        <image src="/static/images/empty-img/not-found.png" />
      </view>
      <view class="text">{{ i18n.youHaveNoMessages }}</view>
    </view> -->
    <!-- 空列表或加载全部提示 -->
    <EmptyAllTips
      v-if="isLoaded"
      :emptyImg="2"
      :isEmpty="!conversations.length"
      :emptyTips="i18n.youHaveNoMessages"
    />
  </view>
</template>

<script>
const util = require('../../../utils/util')
import http from '@/utils/http.js'
import config from '@/utils/config.js'
import { Base64 } from '@/js_sdk/base64/base64'
export default {
  data() {
    return {
      userInfo: null,
      userlist: [],
      imSocketTask: null,
      conversations: [],
      messageCount: null,
      isLoaded: false
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  onload() {
    // this.openWs()
    // this.getMyNotifyRemind()
  },

  onShow() {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.messageBox
    })

    this.getUserInfo()
    this.getConversations()
  },
  onHide() {
    this.closeWs()
  },

  methods: {
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
        console.log('onMessage:' + res.data)
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
        for (var i = 0; i < this.conversations.length; i++) {
          var item = this.conversations[i]
          // 更新最新消息
          if (msgItem.shopId === item.shopId) {
            item.latestMsg = msgContent
            item.timeStr = msgItem.timeStr
            this.conversations.splice(i, 1)
            break
          }
        }

        this.conversations.unshift({
          pic: msgItem.shopLogo,
          friendName: msgItem.shopName,
          shopId: msgItem.shopId,
          latestMsg: msgContent,
          timeStr: msgItem.timeStr
        })
        this.setData({
          conversations: this.conversations
        })
      })
    },

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

    getConversations() {
      this.isLoaded = false
      const params = {
        domain: config.imDomain,
        url: '/p/user/conversations',
        method: 'POST',
        callBack: (res) => {
          this.isLoaded = true
          if (res && res.records.length) {
            this.conversations = res.records.filter((item) => {
              const a = this.isJSON(item.latestMsg)
              // 店铺状态 下线由0改为2  1营业
              if (item.shopStatus == 2) {
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
        }
      }
      http.request(params)
    },
    closeWs() {
      this.imSocketTask.close()
      this.imSocketTask = null
    },
    gotochat(shopId, chatType) {
      if (chatType === 1) {
        shopId = 0
      }
      uni.navigateTo({
        url: '/package-user/pages/chat/chat-im?shopId=' + shopId
      })
    },

    /**
     * 获取未读消息数量
     */
    getMyNotifyRemind() {
      const params = {
        url: '/p/myNotifyLog/unReadCount',
        method: 'GET',
        dontTrunLogin: true,
        data: {},
        callBack: (res) => {
          if (uni.getStorageSync('bbcToken')) {
            this.setData({
              messageCount: res
            })
          }
        }
      }
      http.request(params)
    },

    // 去平台公告
    toMessagePlatform() {
      uni.navigateTo({
        url: '/package-user/pages/recent-news/recent-news'
      })
    },

    // 去系统通知
    toMessageNotice() {
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-user/pages/recent-news/recent-news?showMessage=1'
        })
      })
    }
  }
}
</script>

<style>
@import "./my-message.css";
</style>
