<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j">
    <view class="container">
      <view v-if="!isMemberMessage" class="recent-news">
        <!-- 分销公告 -->
        <block v-for="(item, index) in distNews" :key="index">
          <view
            class="news-item"
            :data-id="item.msgId"
            data-type="dist"
            @tap="toNewsDetail"
          >
            <view class="news-item-title">{{ item.msgTitle }}</view>
            <view class="news-item-date">
              {{ item.startTime }}
            </view>
          </view>
        </block>
        <!-- 普通公告 -->
        <block v-for="(item, index) in news" :key="index">
          <view class="news-item" :data-id="item.id" @tap="toNewsDetail">
            <view class="news-item-title">{{ item.title }}</view>
            <view class="news-item-date">
              {{ item.publishTime }}
            </view>
          </view>
        </block>
        <!-- <view
          v-if="!distNews.length && !messageList.length && !news.length"
          class="empty"
        >
          <view class="empty-icon">
            <image src="/static/images/icon/empty.png" />
          </view>
          <view class="empty-text">{{ i18n.noData }}</view>
        </view> -->
        <!-- 空列表或加载全部提示 -->
        <EmptyAllTips
          v-if="isLoaded"
          :isEmpty="!distNews.length && !news.length"
        />
      </view>
      <!-- 会员消息展示 -->
      <view v-if="isMemberMessage" class="recent-news member-message-container">
        <view class="tab">
          <text
            :class="'tab-item ' + (status == 0 ? 'active' : '')"
            @tap="changeTab(0)"
          >{{ i18n.unread }}</text>
          <text
            :class="'tab-item ' + (status == 1 ? 'active' : '')"
            @tap="changeTab(1)"
          >{{ i18n.read }}</text>
        </view>
        <!-- 消息列表 -->
        <view class="message-list">
          <block v-for="(item, msgId) in messageList" :key="msgId">
            <view class="news-item">
              <view class="message-content">{{ item.message }}</view>
              <view class="news-item-date">
                {{ item.createTime }}
              </view>
            </view>
          </block>
          <!-- 列表为空 -->
          <!-- <view v-if="!messageList.length" class="empty">
            <view class="empty-icon">
              <image src="/static/images/icon/empty.png" />
            </view>
            <view class="empty-text">{{ i18n.noData }}</view>
          </view> -->
          <EmptyAllTips
            v-if="isLoaded"
            :isEmpty="!messageList.length"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const http = require('@/utils/http.js')

export default {
  components: {},
  props: {},
  data() {
    return {
      news: [],
      disNotice: [],
      status: 0,
      // 会员消息列表: 0未读消息  1已读消息
      isMemberMessage: false,
      current: 1,
      pages: 0,
      isDist: '',
      distNews: '',
      messageList: [],
      // 店内公告
      showNews: false,
      shopId: 0, // 默认0;平台
      isLoaded: false
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
    options = { ...this.$Route.query }
    this.setData({
      isDist: options.isDist
    })
    uni.setNavigationBarTitle({
      title: options.showMessage
        ? this.i18n.myMessage
        : this.i18n.latestAnnouncement
    })

    if (options.showMessage) {
      this.setData({
        isMemberMessage: true
      })
    }

    if (options.shopId) {
      this.setData({
        shopId: options.shopId
      })
    }
    this.judgeMessageList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
  onReachBottom: function() {
    if (this.current < this.pages) {
      this.setData({
        current: this.current + 1
      })
      this.judgeMessageList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  methods: {
    // 判断是什么消息列表
    judgeMessageList() {
      this.isLoaded = false
      if (this.isMemberMessage) {
        // 获取未读消息列表
        this.getMessageList()
      } else {
        var ths = this
        if (ths.isDist == 'true') {
          // 加载分销的公告
          const params = {
            url: '/p/distribution/msg/page',
            method: 'GET',
            data: {
              current: this.current,
              size: 20
            },
            callBack: (res) => {
              this.isLoaded = true
              var list = []
              if (res.current == 1) {
                list = res.records
              } else {
                list = ths.distNews.concat(res.records)
              }
              ths.setData({
                distNews: list,
                pages: res.pages
              })
            }
          }
          http.request(params)
        } else {
          let path = '/notice/noticeList/'
          if (uni.getStorageSync('bbcToken')) {
            path = '/p/notice/noticeList/'
          }
          // 加载公告
          const params = {
            url: path + this.shopId,
            method: 'GET',
            data: {
              current: this.current,
              size: 20
            },
            callBack: (res) => {
              this.isLoaded = true
              var list = []
              if (res.current == 1) {
                list = res.records
              } else {
                list = ths.news.concat(res.records)
              }
              ths.setData({
                news: list,
                pages: res.pages
              })
            }
          }
          http.request(params)
        }
      }
    },
    // 跳转公告详情页
    toNewsDetail: function(e) {
      // var id = e.currentTarget.dataset.id
      var type = e.currentTarget.dataset.type

      if (type == 'dist') {
        wx.navigateTo({
          url:
            '/package-user/pages/news-detail/news-detail?id=' +
            e.currentTarget.dataset.id +
            '&type=' +
            type
        })
      } else {
        wx.navigateTo({
          url:
            '/package-user/pages/news-detail/news-detail?id=' +
            e.currentTarget.dataset.id
        })
      }
    },

    /**
     *  获取消息列表
     */
    getMessageList() {
      if (!this.status) {
        // 新消息接口每请求一次都会使总page减一所以需要让它默认当前页
        this.current = 1
      }
      const params = {
        url: '/p/myNotifyLog/unReadCountList',
        method: 'GET',
        data: {
          current: this.current,
          size: 10,
          status: this.status
        },
        callBack: (res) => {
          this.isLoaded = true
          var list = []

          if (res.current == 1 && this.messageList.length == 0) {
            list = res.records
          } else {
            list = this.messageList.concat(res.records)
          }
          if (!res.records.length) {
            list = []
          }
          this.setData({
            messageList: list,
            current: res.current,
            pages: res.pages
          })
        }
      }
      http.request(params)
    },

    /**
     * 切换消息类型
     * @param {Number} type 消息类型: 0未读  1已读
     */
    changeTab(type) {
      if (this.status === type) {
        return
      }
      this.setData({
        status: type,
        current: 1,
        messageList: []
      })
      this.getMessageList()
    }
  }
}
</script>
<style>
@import "./recent-news.css";
</style>
