<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!--  -->
  <view
    id="input-height"
    class="chat-container"
    :class="{ chatad: modelType }"
    :style="{ position: modelType || fixedFlag ? 'static' : 'fixed' }"
  >
    <view class="content">
      <!-- #ifdef H5 -->
      <view class="shop-info" @touchmove.stop.prevent="discard">
        <image
          class="back-icon"
          src="/static/images/icon/down-arrow.png"
          mode=""
          @tap="backToPre"
        />
        <view
          v-if="shopInfo"
          class="shop-tit"
        >{{ shopInfo.shopName }}
          <text :class="['shop-status', isOnline ? 'in' : 'out']">{{
            isOnline ? i18n.onLine : i18n.offLine
          }}</text>
        </view>
        <view
          v-else
          class="shop-tit"
        >{{ i18n.PCS }}
          <text :class="['shop-status', isOnline ? 'in' : 'out']">{{
            isOnline ? i18n.onLine : i18n.offLine
          }}</text>
        </view>
      </view>
      <!-- #endif -->
      <scroll-view
        id="input-text"
        class="msg-list"
        scroll-y="true"
        :style="{ height: screenHeight + 'px' }"
        :scroll-with-animation="scrollAnimation"
        :scroll-top="chatScrollTop"
        @scrolltoupper="changeScollY"
        @scroll="bindscroll"
        @touchstart="hideKeyboard"
        @touchmove="touchMove"
        @touchend="touchEnd"
      >
        <view v-if="showRefresh" style="width: 100%; position: relative; padding: 60rpx 0">
          <view class="text-gray" style="position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);">
            <view class="flex">
              <view class="lzy-loading" />
            </view>
          </view>
        </view>
        <view v-for="(row, index) in msgItems" id="index" :key="index" class="row" @touchmove="touchMove">
          <!-- 用户消息 -->
          <block>
            <view class="topTime">{{ row.timeStr }}</view>
            <!-- 自己发出的消息 -->
            <view v-if="row.source == 2" class="my">
              <!-- 左-消息 -->
              <view class="left">
                <!-- 文字消息 -->
                <view v-show="row.employeeUnread" class="unread">{{ i18n.read }}</view>
                <view v-show="!row.employeeUnread" class="unread">{{ i18n.unRead }}</view>
                <view v-if="row.type == 0 && !row.prodInfo" class="bubble">
                  <rich-text :nodes="row.content" />
                </view>
                <!-- 图片消息 -->
                <view v-if="row.type == 1 && !row.prodInfo" class="bubble" @tap="showPic(row.content)">
                  <ImgShow :src="row.content" :classList="['longimage']" imgMode="widthFix" @load="loadImgTop" />
                </view>
                <!-- 商品链接 -->
                <view v-if="row.prodInfo" class="prod-link" @tap=" toProdDetail(row.prodInfo, row.prodInfo.orderFlag ? 1 : 0)">
                  <view v-if="row.prodInfo.orderFlag" class="prod-number">{{ i18n.orderNumber }}：{{ row.prodInfo.orderNumber }}</view>
                  <view class="link-prod prod-no">
                    <img :src="row.prodInfo.imgs" alt="">
                    <view class="link-detail">
                      <view class="prod-name">
                        {{ row.prodInfo.prodName }}
                      </view>
                      <view class="prod-price">
                        <text>
                          {{ row.prodInfo.actualTotal ? "￥" : "" }}{{ row.prodInfo.actualTotal ? row.prodInfo.actualTotal : "" }}
                          {{ row.prodInfo.actualTotal && row.prodInfo.useScore ? "+" : "" }}
                          <text v-if="row.prodInfo.useScore">{{ row.prodInfo.useScore }} {{ i18n.integral }}</text>
                        </text>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
              <!-- 右-头像 -->
              <view class="right">
                <image v-if="!row.userHeadUrl" src="/package-user/static/images/chat/userImg.jpg" />
                <image v-else :src="row.userHeadUrl" @error="imageError(row,'userHeadUrl')" />
              </view>
            </view>
            <!-- 别人发出的消息 -->
            <view v-if=" (row.source == 0 || row.source == 1) && row.forwardCode != 1 " class="other">
              <!-- 左-头像 -->
              <view class="left">
                <image :src=" shopInfo && shopInfo.shopLogo ? shopInfo.shopLogo : '../../static/images/chat/customer-service.png'" @error="imageError(shopInfo,'shopLogo')" />
              </view>
              <!-- 右-用户名称-时间-消息 -->
              <view class="right">
                <!-- 文字消息 -->
                <view v-if="row.type == 0" class="bubble">
                  <text>{{ row.content }}</text>
                  <!-- <rich-text :nodes="row.content" /> -->
                </view>
                <!-- 图片消息 -->
                <view v-if="row.type == 1" class="bubble" @tap="showPic(row.content)">
                  <ImgShow :src="row.content" :classList="['longimage']" imgMode="widthFix" @load="loadImgTop" />
                </view>
              </view>
            </view>

            <!-- 发送链接 -->
            <view v-if="row.source == 3" class="link-box">
              <view v-if="row.prodInfo.orderFlag" class="prod-number">
                {{ i18n.orderNumber }}：{{ row.prodInfo.orderNumber }}
              </view>
              <view class="link-prod" @tap=" toProdDetail( row.prodInfo, row.prodInfo.orderFlag ? row.prodInfo.orderFlag : '' )">
                <img :src="row.prodInfo.imgs" alt="">
                <view class="link-detail">
                  <view class="prod-name">
                    {{ row.prodInfo.prodName }}
                  </view>
                  <view class="prod-price">
                    <text>{{ row.prodInfo.price ? "￥" : "" }}{{ row.prodInfo.price ? row.prodInfo.price : "" }}
                      {{ row.prodInfo.price && row.prodInfo.useScore ? "+" : "" }}
                      <text v-if="row.prodInfo.useScore">{{ row.prodInfo.useScore }} {{ i18n.integral }}</text>
                    </text>
                  </view>
                </view>
              </view>
              <view class="link-send" @click="sendText(2)">{{ i18n.sendLink }}
                <i class="link-send-right" />
              </view>
            </view>

            <!-- 系统提示: 客服接入/转接、客户离线、用户状态异常-->
            <view v-if="(row.source == -1 && row.tipsType) || row.type == 2" class="sys-tips">
              <text v-if="row.type == 2" class="tips-content">{{ row.content }}</text>
              <text v-else class="tips-content">
                {{ row.tipsType == 1 ? i18n.customerOffline : row.tipsType == 2 ? i18n.loginOtherSide : i18n.reLogin }}
              </text>
            </view>
          </block>
        </view>
      </scroll-view>
    </view>
    <!-- 底部输入栏 -->
    <view :class="['input-box', footPd ? 'input-box-pad' : '']" @touchmove.stop.prevent="discard">
      <view class="textbox">
        <view class="text-mode" @tap="chatFocus">
          <view class="box">
            <input
              v-model="textMsg"
              type="text"
              confirm-type="send"
              style="width: 100%"
              cursor-spacing="15"
              @confirm="sendText(1)"
              @blur="listeningfocus"
            >
          </view>
        </view>
      </view>
      <view class="more" @tap="showMore">
        <image class="icon add" src="../../static/images/chat/add.png" />
      </view>
      <view class="send" @tap="sendText(1)">
        <view class="btn">{{ i18n.send }}</view>
      </view>
    </view>

    <!-- 抽屉栏 -->
    <view class="popup-layer" @touchmove.stop.prevent="discard">
      <!-- 更多功能 相册-拍照-红包 -->
      <view class="more-layer" :class="{ hidden: hideMore }">
        <view class="list">
          <view class="box" @tap="chooseImage">
            <view class="icon tupian2" />
          </view>
          <view class="box" @tap="camera">
            <view class="icon paizhao" />
          </view>
        </view>
      </view>
    </view>
    <hCompress ref="hCompress" />
  </view>
</template>
<script module="wxs" lang="wxs" src="../../../wxs/number.wxs"></script>

<script>
import { mapState, mapMutations } from "vuex";
import http from "../../../utils/http.js";
import config from "../../../utils/config.js";
import util from "../../../utils/util.js";
import { Base64 } from "../../../js_sdk/base64/base64";
import hCompress from "@/components/helang-compress/helang-compress"
export default {
  data() {
    return {
      prodInfo: null, //商品链接
      shopId: null,
      //文字消息
      textMsg: "",
      scrollAnimation: false,
      myuid: 0,
      current: 1, //聊天记录页数
      isOnline: false, //判断有无在线
      pages: "",//聊天记录页码数
      // 抽屉参数
      popupLayerClass: "",
      // more参数
      hideMore: true,
      user: uni.getStorageSync("bbcUser"),
      msgItems: [],
      imSocketTask: null,
      userInfo: null,
      shopInfo: null,
      loginOtherSide: false, //判断用户是否在别处登录
      chatScrollTop: 0,
      screenHeight: 712, // 消息内容盒子默认高度
      actualHeight: 712, // 手机屏幕实际高度
      sendType: 1, // 发送消息类型(客服类型)  1平台  2商家  默认平台
      lastTime: "",
      times: 0, // 次数 显示
      totalUserUnread: 0, // 有多少条未读新消息
      messageInfo: {}, // 商家发送的文本消息
      userSend: false, //是否是用户发送的消息判断
      userRead: true, // 用户的已读未读判断
      lockReconnect: false,
      tabbar: true,
      windowHeight: "",
      softKeyboards: false,
      oldScreenHeight: null,
      screenOnce: 0,
      modelType: null,
      footPd: null,
      fixedFlag: null,
      curSpacing: null,

      openBox: false,
      triggered: true, //自定义下拉刷新
      _freshing: false, //是否处在刷新状态下
      freshStatus: "more", // 当前刷新的状态
      showRefresh: false, // 是否显示下拉刷新组件
      scollTopTag: "",
      startY: "",
      sensitiveWords:''
    };
  },
  components: {
    hCompress
  },
  computed: {
    i18n() {
      return this.$t("index");
    },
  },
  watch: {
    hideMore(newVal, oldVal) {
      console.log("hideMore变化了", newVal, oldVal);
    }
  },
  onLoad(option) {
    this.getSysInfo();
    this.getUserInfo();
    this.getSensitiveWords()
    this.shopId = option.shopId;
    this.prodId = option.prodId;
    if (option.shopId != 0) {
      // 店铺客服消息
      this.getShopInfo();
      this.sendType = 2;
    } else {
      uni.setNavigationBarTitle({
        title: uni.getStorageSync('bbcAppType') != 4 ? this.i18n.PCS + ` ${this.isOnline ? this.i18n.onLine : this.i18n.offLine}` : this.i18n.PCS
      });
      this.shopId = 1;
    }
  },
  onUnload: function () {
    this.closeWs();
  },
  // 下拉加载刷新页面
  // onPullDownRefresh() {
  // 	this.current +=1;
  // 	if (this.loginOtherSide) {
  // 		wx.stopPullDownRefresh()
  // 		wx.showToast({
  // 			title: this.i18n.loginOtherSide,
  // 			icon: 'none',
  // 		})
  // 	}
  // 	else if(this.current<=this.pages){
  // 		this.getMsgItems()
  // 	}else{
  // 		wx.stopPullDownRefresh()
  // 		wx.showToast({
  // 			title: this.i18n.allLoaded,
  // 			icon: 'none',
  // 		})
  // 	}
  // },
  methods: {
    // 兼容小程序
    ...mapState(["baseUrl"]),
    changeScollY() {
      this.scollTopTag = 0;
    },
    /**
     * 获取屏幕高度
     */
    getSysInfo() {
      uni.getSystemInfo({
        success: (sysInfo) => {
          // console.log(sysInfo.windowHeight);
          // #ifdef H5
          // this.screenHeight = sysInfo.windowHeight - 55
          // this.actualHeight = sysInfo.windowHeight - 55
          if (sysInfo.platform === "ios") {
            this.modelType = true;
          } else {
            // #ifndef H5
            this.footPd = true;
            // #endif
          }
          if (this.softKeyboards) {
            // let kebodyHeight = screen.height - window.innerHeight
            this.screenHeight = this.oldScreenHeight;
          } else {
            this.screenHeight = sysInfo.windowHeight - 55;
            this.actualHeight = sysInfo.windowHeight - 55;
            if (!this.screenOnce) {
              this.oldScreenHeight = this.screenHeight;
            }
          }
          // #endif
          // #ifdef MP-WEIXIN
          this.screenHeight =
            sysInfo.screenHeight - 105 - sysInfo.statusBarHeight;
          this.actualHeight =
            sysInfo.screenHeight - 105 - sysInfo.statusBarHeight;
          // console.log(this.screenHeight);
          this.oldScreenHeight = this.screenHeight;
          uni.showToast({
            title: this.oldScreenHeight,
          });
          // #endif
          // #ifdef APP-PLUS
          this.screenHeight = sysInfo.windowHeight - 50;
          this.actualHeight = sysInfo.windowHeight - 50;

          this.oldScreenHeight = this.screenHeight;
          // #endif
        },
      });
    },

    /**
     * 点击外面盒子获取焦点
     */
    chatFocus() {
      this.textareaFocus();
    },

    /**
     * 打电话给商家
     */
    callShop() {
      uni.makePhoneCall({
        phoneNumber: this.shopInfo.tel,
      });
    },
    /**
     * 返回上一页
     */
    backToPre() {
      if (this.prodId) {
        this.$Router.replace({
          path: "/pages/prod/prod",
          query: { prodId: this.prodId },
        });
      } else {
        if (this.shopId == 0) {
          uni.navigateBack({
            delta: 1,
          });
        } else {
          uni.navigateBack({
            url: "/package-user/pages/chat/chat",
          });
        }
      }
    },
    /**
     * 获取店铺信息
     */
    getShopInfo() {
      const params = {
        url: "/shop/headInfo",
        method: "GET",
        data: {
          shopId: this.shopId,
        },
        callBack: (res) => {
          if (!res.shopStatus) {
            res.shopName = this.i18n.storeStatusTips3;
          }
          this.setData({
            shopInfo: res,
          });
          uni.setNavigationBarTitle({
            title: uni.getStorageSync('bbcAppType') != 4 ? res.shopName + ` ${this.isOnline ? this.i18n.onLine : this.i18n.offLine}` : res.shopName
          });
        },
      };
      http.request(params);
    },

    //判断是否为JSON格式
    isJSON(str) {
      if (typeof str == "string") {
        try {
          JSON.parse(str);
          return true;
        } catch (e) {
          return false;
        }
      }
    },

    /**
     * 获取聊天记录
     */
    getMsgItems() {
      let messageInfo = {
        history: 1,
        current: this.current,
        size: 10,
        sendType: this.sendType,
        toId: this.shopId,
      };
      this.imSocketTask.send({
        data: JSON.stringify(messageInfo),
      });
    },

    // 获取当前商家在线离线状态
    getOnlineStatus() {
      let status = {
        onlineOrOffline: true,
        sendType: this.sendType,
        toId: this.shopId,
      };
      try {
        this.imSocketTask.send({ data: JSON.stringify(status) });
      } catch (error) {
        this.$message({
          message: "连接已断开请刷新一下页面",
          type: "error",
          duration: 1000,
        });
      }
    },

    /**
     * 获取用户信息
     */
    getUserInfo() {
      const params = {
        url: "/p/user/userInfo",
        method: "GET",
        data: {},
        dontTrunLogin: true,
        callBack: (res) => {
          this.userInfo = res;
          this.openWs();
        },
        errCallBack: (res) => {
          uni.redirectTo({
            url: "/pages/user-login/user-login",
          });
        },
      };
      http.request(params);
    },

    /**
     * 获取商品或订单信息并生成相应的链接
     */

    getProdInfo(id, type) {
      // type 1 = 商品链接  type 2 = 订单链接
      let data = type == 1 ? { prodId: id } : { orderNumber: id };
      const params = {
        url: type == 1 ? "/prod/prodInfo" : "/p/myOrder/orderDetail",
        method: "GET",
        data,
        callBack: (res) => {
          // console.log(res, "res");
          let prodInfo = null;
          if (type == 1) {
            prodInfo = {
              imgs: res.pic,
              prodId: res.prodId,
              prodName: res.prodName,
              skuName: res.skuName,
              price: res.price,
              orderType: res.orderType,
              actualTotal: res.price,
            };
          } else {
            let orderItem = res.orderItemDtos[0];
            prodInfo = {
              imgs: orderItem.pic,
              prodId: orderItem.prodId,
              orderNumber: this.$Route.query.orderNumber,
              skuName: orderItem.skuName,
              prodName: orderItem.prodName,
              price: res.actualTotal,
              actualTotal: res.actualTotal,
              useScore: res.orderScore,
              status: res.status,
              orderType: res.orderType,
              orderFlag: true, // 订单判断
            };
          }
          this.setData({
            prodInfo,
          });

          let msgItem = {
            source: 3, //表示产品链接
            timestamp: new Date().getTime(),
            toId: this.shopId,
            prodInfo, //产品链接详情
            msgType: 0,
            sendType: this.sendType, // 1发给平台   2发给商家
          };

          // let timeFlag = this.timeBeApart(this.msgItems[this.msgItems.length - 1].timestamp, new Date().getTime())
          // if (timeFlag) {
          // 	delete msgItem.timeStr
          // }
          msgItem.timeStr = util.tsToDate(new Date().getTime(), "M月D日 h:m");
          this.msgItems.push(msgItem);
          this.setData({
            msgItems: this.msgItems,
          });
          this.$nextTick(function () {
            this.chatScrollTop =
              this.chatScrollTop + 1000 * this.msgItems.length;
          });
        },
      };
      http.request(params);
    },

    /**
     * 创建ws
     */

    openWs() {
      var ths = this;
      this.imSocketTask = uni.connectSocket({
        url:
          config.imWsDomain +
          "/im/websocket/user/" +
          Base64.encode(uni.getStorageSync("bbcToken")) +
          "/" +
          this.userInfo.userId, //仅为示例，并非真实接口地址。
        complete: () => {},
      });

      this.imSocketTask.onOpen((openRes) => {
        heartCheck.reset().start(); // 成功建立连接后，重置心跳检测
        this.lockReconnect = true;
        // 发送信息获取聊天记录
        this.getMsgItems();
        this.getOnlineStatus();
      });
      this.imSocketTask.onMessage((res) => {
        //code 1 是新消息 code 2 是聊天记录 code 3 是转接客服
        //code 10~12是错误信息
        heartCheck.reset().start(); // 成功建立连接后，重置心跳检测
        let result = JSON.parse(res.data);
        if (result.code !== "00000") {
          result.code = Number(result.code);
        }

        if (result.code == 10 || result.code == 11 || result.code == 12) {
          // source: -1  系统提示;    tipsType: 1客服不在线    2用户在别处登陆    3无法获取用户信息
          var tipsItem = {
            source: -1,
            tipsType: result.code == 12 ? 1 : result.code == 11 ? 2 : 3,
          };
          this.imSocketTask.close();

          let flag = false;
          let delIndex = 0;
          this.msgItems.forEach((item, index) => {
            if (item.tipsType == tipsItem.tipsType) {
              flag = true;
              delIndex = index;
            }
          });
          if (flag) {
            this.msgItems.splice(delIndex, 1);
          }
          this.msgItems.push(tipsItem);
          this.setData({
            msgItems: this.msgItems,
            loginOtherSide: true,
          });
          return;
        }

        if (!result.data) {
          return;
        }

        /**
         * 新的聊天信息
         */
        if (result.code === "00000" || result.code === 4) {
          // 时间转换
          if (this.msgItems.length) {
            // 时间转换
            let prevTime = util.tsToDate(
              this.msgItems[this.msgItems.length - 1].timestamp,
              "M月D日 h:m"
            );
            let nowTime = util.tsToDate(result.data.timestamp, "M月D日 h:m");
            if (
              prevTime.slice(0, prevTime.indexOf(" ")) ===
              nowTime.slice(0, nowTime.indexOf(" "))
            ) {
              result.data.timeStr = util.tsToDate(new Date().getTime(), "h:m");
            } else {
              result.data.timeStr = util.tsToDate(
                new Date().getTime(),
                "M月D日 h:m"
              );
            }
            let timeFlag = util.timeBeApart(
              this.msgItems[this.msgItems.length - 1].timestamp,
              new Date().getTime()
            );
            if (timeFlag) {
              delete result.data.timeStr;
            }
          }

          let readed = {
            read: 1,
            msgIds: [result.data.itemId],
            toId: this.shopId,
            sendType: this.sendType,
            readNoticeEmployeeId: result.data.employeeId,
          };
          this.imSocketTask.send({
            data: JSON.stringify(readed),
          });

          //接受新传过来的消息，加入到聊天栏
          let msgItem = result.data;
          if (msgItem.type == 1) {
            msgItem.content = config.picDomain + msgItem.content;
          }
          if (this.sendType === msgItem.chatType) {
            this.msgItems.push(msgItem);
          }
          this.setData({
            isOnline: true,
            msgItems: this.msgItems,
            shopId: msgItem.shopId,
          });

          this.$nextTick(function () {
            this.chatScrollTop =
              this.chatScrollTop + 1000 * this.msgItems.length;
          });
        }
        /**
         * 聊天记录
         */
        if (result.code === 2) {
          let msgIds = [];

          if (!result.data.pages) {
            // 进行商品链接或订单的判断
            if (ths.$Route.query.prodId && ths.current == 1) {
              ths.getProdInfo(ths.$Route.query.prodId, 1);
            }
            if (ths.$Route.query.orderNumber && ths.current == 1) {
              ths.getProdInfo(ths.$Route.query.orderNumber, 2);
            }
            return;
          }

          if (result && result.data.pages) {
            result.data.records = result.data.records.reverse();

            // 进行是否是商品链接的判断
            result.data.records.forEach((item) => {
              let a = this.isJSON(item.content);

              if (a && JSON.parse(item.content) instanceof Object) {
                item.prodInfo = JSON.parse(item.content);
              }

              item.timeStr = util.tsToDate(item.timestamp, "M月D日 h:m");

              if (item.type === 1 && !a) {
                item.content =
                  item.content.indexOf(config.picDomain) === 0
                    ? item.content
                    : config.picDomain + item.content;
              }

              // 往已读列表添加
              if (!item.userUnread) {
                msgIds.push(item.itemId);
                this.totalUserUnread = this.totalUserUnrea - 1;
              }
            });

            result.data.records.reduce((prev, cur) => {
              // 将时间更换为某某月某某日 要是是当天即去掉月日
              let now = util.tsToDate(prev.timestamp, "M月D日 h:m");
              let next = util.tsToDate(cur.timestamp, "M月D日 h:m");
              if (
                now.slice(0, now.indexOf(" ")) ==
                next.slice(0, next.indexOf(" "))
              ) {
                cur.timeStr = util.tsToDate(cur.timestamp, "h:m");
              }

              // 历史记录进行时间段显示判断
              if (result.data.records.length > 2) {
                let timeFlag = util.timeBeApart(prev.timestamp, cur.timestamp);
                if (timeFlag) {
                  delete cur.timeStr;
                }
              }
              return cur;
            });
            this.totalUserUnread = result.data.totalUserUnread;
          }

          // 将消息变更为已读
          let readed = {
            read: 1,
            msgIds,
            toId: this.shopId,
            sendType: this.sendType,
          };
          this.imSocketTask.send({
            data: JSON.stringify(readed),
          });

          if (this.current == 1) {
            this.msgItems = result.data.records;
            this.setData({
              msgItems: result.data.records,
              pages: result.data.pages,
            });
            // console.log(this.msgItems);

            this.$nextTick(function () {
              setTimeout(() => {
                this.chatScrollTop =
                  this.chatScrollTop + 1200 * result.data.records.length;
              }, 1);
            });
          }

          if (this.current != 1) {
            result.data.records = result.data.records.reverse();
            // 数组反转拼接
            result.data.records.forEach((item) => {
              this.msgItems.unshift(item);
            });
            this.setData({
              msgItems: this.msgItems,
            });
          }

          // 进行商品链接或订单的判断
          if (ths.$Route.query.prodId && ths.current == 1) {
            ths.getProdInfo(ths.$Route.query.prodId, 1);
          }
          if (ths.$Route.query.orderNumber && ths.current == 1) {
            ths.getProdInfo(ths.$Route.query.orderNumber, 2);
          }

          uni.stopPullDownRefresh();
          this.showRefresh = false;
        }

        /**
         * 未读信息转成已读
         */
        if (result.code === 5) {
          // if(ths.userSend){
          // 	ths.userRead = false
          // 	ths.userSend = false
          // 	ths.msgItems.push(ths.messageInfo)
          // }
          ths.msgItems.forEach((item) => {
            item.employeeUnread = 1;
          });
          ths.setData({
            msgItems: ths.msgItems,
          });
          this.$nextTick(function () {
            this.chatScrollTop =
              this.chatScrollTop + 1000 * this.msgItems.length;
          });
        }

        /**
         * 未读信息转成已读
         */
        if (result.code === 16) {
          this.isOnline = result.data.onlineOrOffline;
          const shopName = this.shopInfo ? this.shopInfo.shopName : this.i18n.PCS
          uni.setNavigationBarTitle({
            title: uni.getStorageSync('bbcAppType') != 4 ? shopName + ` ${this.isOnline ? this.i18n.onLine : this.i18n.offLine}` : shopName
          })
        }

        this.setData({
          loginOtherSide: false,
        });
      });

      var ths = this;
      // 心跳检测, 每隔一段时间检测连接状态，如果处于连接中，就向server端主动发送消息，来重置server端与客户端的最大连接时间，如果已经断开了，发起重连。
      var heartCheck = {
        timeout: 19000, // 50s发一次心跳，比server端设置的连接时间稍微小一点，在接近断开的情况下以通信的方式去重置连接时间。
        serverTimeoutObj: null,
        reset: function () {
          clearTimeout(this.serverTimeoutObj);
          return this;
        },
        start: function () {
          this.serverTimeoutObj = setTimeout(function () {
            if (!ths.imSocketTask) {
              return;
            }
            if (
              ths.imSocketTask.readyState == 1 ||
              ths.imSocketTask._webSocket.readyState == 1
            ) {
              console.log("连接状态，发送消息保持连接");
              ths.imSocketTask.send({
                data: JSON.stringify({
                  sendType: ths.sendType,
                  content: "HEART_BEAT",
                  msgType: 0,
                  toId: ths.shopId,
                }),
              });
              ths.getOnlineStatus();
              heartCheck.reset().start(); // 如果获取到消息，说明连接是正常的，重置心跳检测
            } else {
              console.log(ths.imSocketTask, "ths.imSocketTask");
              ths.imSocketTask.close();
              // ths.imSocketTask = null
              ths.lockReconnect = false;
              ths.openWs();
              console.log("断开状态，尝试重连");
            }
          }, this.timeout);
        },
      };

      this.imSocketTask.onclose = (res) => {
        console.log("这是错误原因" + res);
        ths.reconnect();
      };
    },
    /**
     * ws关闭
     */
    closeWs() {
      this.imSocketTask.close();
      this.imSocketTask = null;
    },

    // websock断线重连
    reconnect() {
      let ths = this;
      if (this.lockReconnect) return;
      this.lockReconnect = true;
      console.log("为啥会出错");
      setTimeout(() => {
        //没连接上会一直重连，设置延迟避免请求过多
        ths.openWs();
        ths.lockReconnect = false;
      }, 2000);
    },
    /**
     * 发送信息
     */
    sendText(type) {
      // type 1 = 发送消息  type 2 = 发送商品链接

      // source 0 是平台  1 是商家  2 是顾客

      if (type === 1) {
        if (this.textMsg === "" || this.textMsg.match(/^\s+$/)) {
          return;
        }
      }
      if(this.sensitiveWords){
        try{
        const rep = new RegExp(this.sensitiveWords,'g')
        this.textMsg=this.textMsg.replaceAll(rep,'**')
        }catch(e){
          console.log(e)
        }
      }
      let messageInfo = {
        toId: this.shopId,
        content: type == 1 ? this.textMsg : JSON.stringify(this.prodInfo),
        msgType: 0,
        sendType: this.sendType, // 0发给平台   1发给商家
      };
      this.addMessage(messageInfo);
      this.textMsg = "";
    },
    /**
     * @param {Object} messageInfo
     * 将新发送的消息添加至页面
     */
    addMessage(messageInfo) {
      this.userRead = true;
      this.userSend = true;
      this.imSocketTask.send({
        data: JSON.stringify(messageInfo),
      });

      if (messageInfo.msgType === 1) {
        messageInfo.content = config.picDomain + messageInfo.content;
      }

      // 发送商品链接需要由JSON格式转换为对象
      let a = this.isJSON(messageInfo.content);

      if (a && JSON.parse(messageInfo.content) instanceof Object) {
        messageInfo.prodInfo = JSON.parse(messageInfo.content);
      }

      let userInfo = this.userInfo;
      let msgItem = {
        userName: userInfo.nickName,
        userHeadUrl: userInfo.pic,
        employeeUnread: 0,
        type: messageInfo.msgType,
        source: 2,
        timestamp: new Date().getTime(),
        content: messageInfo.content,
        prodInfo: messageInfo.prodInfo,
      };

      if (!this.msgItems.length) {
        msgItem.timeStr = util.tsToDate(new Date().getTime(), "M月D日 h:m");
      } else {
        let prevTime = util.tsToDate(
          this.msgItems[this.msgItems.length - 1].timestamp,
          "M月D日 h:m"
        );

        let nowTime = util.tsToDate(new Date().getTime(), "M月D日 h:m");
        if (
          prevTime.slice(0, prevTime.indexOf(" ")) ==
          nowTime.slice(0, nowTime.indexOf(" "))
        ) {
          msgItem.timeStr = util.tsToDate(new Date().getTime(), "h:m");
        } else {
          msgItem.timeStr = util.tsToDate(new Date().getTime(), "M月D日 h:m");
        }

        let timeFlag = util.timeBeApart(
          this.msgItems[this.msgItems.length - 1].timestamp,
          new Date().getTime()
        );
        if (timeFlag) {
          delete msgItem.timeStr;
        }
      }

      this.messageInfo = msgItem; // 发送的信息存储起来，用于已读未读
      msgItem.timestamp = new Date().getTime();

      this.msgItems.push(msgItem);
      this.setData({
        msgItems: this.msgItems,
      });

      this.$nextTick(function () {
        this.chatScrollTop = this.chatScrollTop + 1000 * this.msgItems.length;
      });
    },
    /**
     * 更多功能(点击+弹出)
     */
    showMore() {
      if (this.hideMore) {
        this.openDrawer();
      } else {
        this.hideDrawer();
      }
    },
    /**
     * 打开抽屉
     */
    openDrawer() {
      this.hideMore = false;
      this.$nextTick(() => {
        this.screenHeight = this.oldScreenHeight - 90;
        this.chatScrollTop += 1;
      });
    },
    /**
     * 隐藏抽屉
     */
    hideDrawer(wxNeedSub, noSliding) {
      // #ifdef H5
      this.$nextTick(() => {
        this.screenHeight = this.oldScreenHeight;
      });
      // #endif

      // #ifdef MP-WEIXIN || APP-PLUS
      this.$nextTick(() => {
        if (wxNeedSub) {
          this.screenHeight = this.oldScreenHeight - 90;
        } else {
          this.screenHeight = this.oldScreenHeight;
        }
      });
      // #endif
      this.hideMore = true;

      //  防止滑动时页面触底
      if (!noSliding) {
        this.$nextTick(() => {
          this.chatScrollTop += 1;
        });
      }
    },

    // 图片加载向下滚动
    loadImgTop(data) {
      this.chatScrollTop = this.chatScrollTop + data.height + 100
    },

    /**
     * 获取焦点，如果不是选表情ing,则关闭抽屉
     */
    textareaFocus(e) {
      // #ifdef H5
      this.fixedFlag = true;
      this.popupLayerClass = "";
      // #endif

      // #ifndef H5
      //键盘留出些空白
      this.curSpacing = 1;
      // #endif

      this.hideDrawer(!this.hideMore);
    },

    // 失去焦点软键盘变回原样
    // :style="{position:fixedFlag?'static':'fixed'}"
    listeningfocus() {
      this.fixedFlag = null;
      this.curSpacing = 1;
      this.hideDrawer(false);
    },
    /**
     * 选择图片发送
     */
    chooseImage() {
      this.getImage("album");
    },
    /**
     * 拍照发送
     */
    camera() {
      this.getImage("camera");
    },

    // 触摸开始
    hideKeyboard(e) {
      uni.hideKeyboard();
      this.hideDrawer(false, true);
      this.curSpacing = 1;
      this.startY = e.changedTouches[0].pageY;
      this.freshStatus = "more";
    },
    // 触摸结束
    touchEnd() {
      if (this.freshStatus == "end") {
        // 延迟 500 毫秒，显示 “刷新中”，防止请求速度过快不显示
        this.current += 1;
        if (this.loginOtherSide) {
          uni.stopPullDownRefresh();
          uni.showToast({
            title: this.i18n.loginOtherSide,
            icon: "none",
          });
          this.showRefresh = false;
        } else if (this.current <= this.pages) {
          this.freshStatus == "fresh";
          this.getMsgItems();
        } else {
          uni.stopPullDownRefresh();
          uni.showToast({
            title: this.i18n.allLoaded,
            icon: "none",
          });
          this.showRefresh = false;
        }
      } else {
        this.showRefresh = false;
      }
    },
    // 滚轮移动
    bindscroll(e) {
      this.$nextTick(() => {
        this.scollTopTag = e.detail.scrollTop;
      });
    },
    // 触摸移动
    touchMove(e) {
      if (this.scollTopTag !== 0) {
        const query = uni.createSelectorQuery();
        query.select("#input-text").scrollOffset();
        query.exec((res) => {
          this.scollTopTag = res[0].scrollTop;
        });
      }
      if (this.scollTopTag > 0) {
        return;
      }
      e.preventDefault();
      let endY = e.changedTouches[0].pageY;
      let startY = this.startY;
      let dis = endY - startY;
      // 判断是否下拉
      if (dis <= 0) {
        return;
      }
      let offsetTop = e.currentTarget.offsetTop;
      if (dis > 20) {
        this.showRefresh = true;
        // this.freshStatus = 'end'
        if (dis > 50) {
          this.freshStatus = "end";
        } else {
          this.freshStatus = "more";
        }
      } else {
        this.showRefresh = false;
      }
    },
    /**
     * @param {Object} type
     * 选照片 or 拍照
     */
    getImage(type) {
      this.hideDrawer();
      uni.chooseImage({
        sourceType: [type],
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        success: (res) => {
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            uni.getImageInfo({
              src: res.tempFilePaths[i],
              success: image => {
                var params = {
                  url: "/p/file/uploadImFile",
                  filePath: res.tempFilePaths[i],
                  name: 'file',
                  callBack: (res) => {
                    let messageInfo = {
                      toId: this.shopId,
                      content: res.filePath,
                      sendType: this.sendType,
                      msgType: 1,
                    };
                    this.addMessage(messageInfo);
                  }
                };
                const obj = {
                  src: res.tempFilePaths[i],
                  quality: 0.2
                }
                this.$refs.hCompress.compress(obj,res.tempFiles[i]).then(res =>{
                  params.filePath = res
                  http.upload(params);
                })
              }
            });
          }
        },
      });
    },

    /**
     * @param {Object} msg
     * 预览图片
     */
    showPic(msg) {
      var list = [];
      list.push(msg);
      uni.previewImage({
        indicator: "none",
        current: 0,
        urls: list,
      });
    },
    /**
     * 用于阻止滚动的空方法
     */
    discard() {},

    /**
     * 链接点击去往商品详情
     */
    toProdDetail(prodInfo, type) {
      if (type) {
        uni.navigateTo({
          url:
            "/package-user/pages/order-detail/order-detail?orderNum=" + prodInfo.orderNumber,
        });
      } else {
        uni.navigateTo({
          url: "/pages/prod/prod?prodId=" + prodInfo.prodId,
        });
      }
    },
    getSensitiveWords(){
      const params = {
        url: "/webConfig/info/SENSITIVE_WORDS",
        method: "GET",
        callBack: (res) => {
          res = JSON.parse(res)
          if(res?.sensitiveWord){
            this.sensitiveWords=res.sensitiveWord.replaceAll('，','|')
          }
        },
      };
      http.request(params);
    }
  },
};
</script>

<style>
page {
  background-color: #f5f6fa;
  /* max-height: 100%; */
  overflow: hidden;
}

@font-face {
  font-family: "HMfont-home";
  src: url("data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAn8AAsAAAAAE1wAAAmvAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCFDAqWYJI9ATYCJANACyIABCAFhFUHgV8bThBRlFFWNdkXBXbDsSFQq221McNWrxUbYqGhiTju98MTeXqNh/9fo90388cEMe0bwSOJRIjavZIgESqnE5J5JqQVDZH/XdNfoHSAjqKqRsA+Tf/Ruya33E/bkdHsJtycY2XWAGbM5oenzf173A3lHrEilsmMbu74Y5VmYtxpgza9DMxkWL0gfjGbGRE54AL2f2ut3h2u8Q7RaZRCjDPLIv8cfAUR30MtEUWbSReVJkk0RB4lWWkNg7WVA1sBKmIUdr0uzibQOmxA4vrWwQXkJUweKHPfdwXkA+FSik2o1aVizyTegEKdvWINwGv59bEGY9GeTJFjW95pswIrzz3LYi//0O4JEaDrY3DZjxwXgUR8V3IfIeXARaloVRXT3mK/tsi3LubcJfese8l96Xbd1l1ve2z7eJp5lv3zB7URSdJNYd3Dfm7UUxxkGu0sLFcbVEa5pP3D6/QmokQw3OGzfJp/2kBkLJYQDYuziJbFJUSweIkoWXQRNYuEGFi0BLzFOhAjS4+InKUPRGI5I2a+kg7VSWUGoXoos2BNmGIWexwFroD8IUD6C1A9lYp8F3ClwsFgcgPdNpN08v1czkEOJ4aeieaC3QyVfb9PX2kbn9/0CwTeNAm79H1Kc2x3i9C7LcEZtMSLfE6T4aM+YWOm06dZ5cm9I+xoYw+rqGlScKKlHytu9h6Dw0E5nXK7nbTZknT1jFldR9cuzNMz9Srf7FydqpYW5mRr6Dq1OC9HqzYzoiw1cjohV2tX1Ji1K9bSdVkEbaxS1xQwpmpVpUFheyyzPyGdbXKHexkByib+vtgeK1X75xKqWl+grUNIbRZDXT31tBMiPZAyF0KmniCQhSgACkh5+gIxtvTS/si+VjbAuY6SMdCzbqInzwkjk5ENzMCkNv+ghQQ0qSSAUGmAMQoBozoAIrUe6qpzM+tma1T1jDgvVzdBWcIcLT170njGQU3cCpnUTSdkHH3ltwPHpKotTIP6HH12Lvd4czCWgbJYhY1U5ddlTCICSs1is0in8tXExk7VVRuMQhIQGgOtFcolPmMkIqDVduTGEOn1jI4gFERmSUsv3rGmoKUEQLITLUyzqpFukq8T6U+omVQsT8XHxsnipPEyBAlKNmkNMlMJgOT5Tpsoo2RGP3lOTQyk5GRBgJKw2WQsarWzSa1aLF/+UBk2PkA3wEkBM/RwOLJ0ORWiVCR3YYAAFyIlAdaNqEnmh0sTqOsAq97R85Jt+HGHrNKWgDHmxOPxumKmRGzudayPtogu9D2Zx688C3D6XJSgpgF6MJbomdtyOYBgcXOGSgMAPXqy+F11pMYHlFLCkkKM0S1T+U5SN0Ynh39SxcxmTPNHrTFIuieyxYgZXSDUAPpLLT2ZciVvihOh05k+JIAjoL7HtNsVFc5Rl+1hgAAIlNqGX3GEK0llMm0nZUdmhQzymg3Q9j6yO4FQsmqtQbXmZ+z+sOynUrt3nmbeXu3MYW9f8y38128LpWAVeyLMz4cTORbEDPYKHU19Oyx0OF12GIhfEx+/RRIm2RzPeIPE2yYRM7HBWBx+GvANWXAlMYcmWriz1/Tt2bk+jq7CdOzMu5zsn3zZXwg2Gu14YCBuh3NggN0DI8BbJpCXZb2I4xh+kdAmbU0IA6HYquya81nqYSk87Xgi35ur4HnxZWEvnoLrzbOEjHmJiY2JjV6I8c4ynSEsJTKcHxuWYPRFFleV2Sbi0Dsk4XmDSToXTMnUnW/PW9J9W4UCgP+h0rTi9tiJd6qQgk2lPI/KKeybAPx+c7vZHdimbruzyCP9iZvd0VuBuIniuXirHQ8oG2IThFIUI8QOhjfNMg86GH4Bv4ixLlr4BDi2wDDwXTYYTgfnBJur1nAw2yGngw96JhQo+48cMWVE8kWwcA55ZuzwkSP/mpp9D6wFm2e1Bc8cPVraL2Ng7y6KfSNHqQfTYByYMmbT73WNmwZs6m8sBR54XCndTHwvu6v+8N+Jze9/jeGd8bpoHePtMv0/9U6e78bTtf+aly55P40cNtJ3PH3U6xQ9DkRNos+Chp2TpNwX4lZOwkTa4nOLPxpMLc8Sm0srSwD6Y1KW7ftPZ68x3DWS8d4cJbAKE6QJEfRrhAafMLV0RoCRLhKdBaJzNtzPD7dxLIgZ7Al4006exyHEYXMewjqApFokPRIu9FvLiPf96uWlpuZmRZKiH1i0OCNj1ar7zSDqYiRbCQsMrKUXZswxBkQEbCmv2RJgKK82+UcGbpk+0woVSxekQrYCzp4Hk30E3oHhAh+4fLcOPCfzOVu3cvKkHAWzNAVyjAyOQsrJix47n0OZpbTUDKdJp8CZs+BkAKfMnDkF+kJmmrcN4OSZs8CRuwZ+N76gampCxtj83XWO5X1GYc7hIypq+N32eTe6Wr/GfXW5GukBLnvJ1gEPhlmsuUHzg3Osp/vJCZ4flGsFf27fjV18spjdTfQUuVANcgldRA3hKhSUutCGgGhDaMo0tXMHwiUq3gG5entO2xmnECa3H53AjRpKFFYIK7qrHjMJ75sEC91BPlGc0TlZY9qlsdcuZaXy0D3hfz4cmLd2WzbK3Xhhdw7c2VLCxtxsFCMEo8bArEww9ruOrc5joK9g1xp85MghQ4wyuPV71+/tMVxAMmzA1lSt+WmbjFkwL/lV6az7APzZ5qvVmmy7b1bJGrTDhmRfMBYbWMZmNOu3bJdPlLL/5WOR2XZCTJpmU4mx8lv9Fg76T8NagO4vUacJ+n/Sr0b/LYb8+1z5QCb935a0m6WWYXzwh4DO2Sa9g2jEnJ6tYwTU5jp7N2RmaHkn/gjEb/fXpmpXbkpAGaAv7pnKAfdc6bg4GZx1L3QuQ8lVC3BvXbC8f2eHQEqkBuc9aO6h9849M3oPucrgAyQY/HEv7PYJJQy23Ft3/R+xczqmsHWDgrDCyzfcl1o5ehKxnUOr5Bm6NhTGR4u1rtDEvlZ8dGgklLeNCk3ZbeKaO0bkcMfoKt+6ng/DUPPI6AAlDXlE0dzwsKPadkjqKjDXGEgg4b2CK7vx65M0xSlPmNsOA58/g1xWSDDKeq/KV5AR89+zc6OGjKSKtxUqR4NtF47VuMZemcTBDQxGqzqqrXIMCnm2xkXq1QJIIkO8EpmROcOkIyevYmhUqurWBmgCe4U5WJFHiiLKqKKOJtrooo8hxphihl6g5bGv3MAXkfBvPaFbVq6ga4Uq+wWdEfo6NVTmr1oVkYoye2NvfCWLmYQx0sjozFSxszhZ4Ctjb7QtavLQDNa0L5HRZQYJYxrNLbJR4QhZvOV46Fm/lqB428nsrJSx/OwbEgYA")
    format("woff2");
}
.icon {
  font-family: "HMfont-home" !important;
  font-size: 56upx;
  font-style: normal;
  color: #333;
}

.chat-container {
  position: static;
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
}

.chatad {
  position: fixed;
}

.icon.tupian2:before {
  content: "";
}

.icon.paizhao:before {
  content: "";
}

.hidden {
  display: none !important;
}

.popup-layer {
  width: 96%;
  padding: 0 2%;
  padding-bottom: 0;
}

.popup-layer.showLayer {
  transform: translate3d(0, -180rpx, 0);
}

.popup-layer .more-layer {
  width: 100%;
  height: 180rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.popup-layer .more-layer .list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.popup-layer .more-layer .list .box {
  width: 18vw;
  height: 18vw;
  border-radius: 20upx;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2vw 3vw 2vw 3vw;
}

.popup-layer .more-layer .list .box .icon {
  font-size: 70upx;
}

.input-box {
  width: 98%;
  padding: 0 2%;
  background-color: #fff;
  display: flex;
  z-index: 20;
  border-bottom: solid 1upx #ddd;
}
.input-box-pad {
  padding: 14rpx 2%;
}
.input-box.showLayer {
  transform: translate3d(0, -180rpx, 0);
}

.input-box .more {
  flex-shrink: 0;
  width: 90upx;
  height: 90rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-box .send {
  margin-left: 20rpx;
  margin-right: 20rpx;
  padding-bottom: 10rpx;
  flex-shrink: 0;
  width: 100upx;
  height: 86rpx;
  display: flex;
  align-items: center;
}

.input-box .send .btn {
  width: 101rpx;
  height: 58rpx;
  background: #F81A1A;
  opacity: 1;
  border-radius: 16px;
  font-size: 13px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 58rpx;
  color: #ffffff;
  opacity: 1;
  text-align: center;
}

.input-box .textbox {
  width: 100%;
  min-height: 58rpx;
  margin-top: 15upx;
}

.input-box .textbox .text-mode {
  width: 100%;
  min-height: 56rpx;
  display: flex;
  background-color: #fff;
  border-radius: 40upx;
}

.input-box .textbox .text-mode .box {
  width: 100%;
  padding-left: 30upx;
  padding-right: 30upx;
  min-height: 58rpx;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #dddddd;
  opacity: 1;
  border-radius: 16px;
}
.input-box .textbox .text-mode .box textarea {
  width: 100%;
}

.input-box .textbox .text-mode .em {
  flex-shrink: 0;
  width: 80upx;
  padding-left: 10upx;
  height: 70upx;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes volatility {
  0% {
    background-position: 0% 130%;
  }

  20% {
    background-position: 0% 150%;
  }

  30% {
    background-position: 0% 155%;
  }

  40% {
    background-position: 0% 150%;
  }

  50% {
    background-position: 0% 145%;
  }

  70% {
    background-position: 0% 150%;
  }

  80% {
    background-position: 0% 155%;
  }

  90% {
    background-position: 0% 140%;
  }

  100% {
    background-position: 0% 135%;
  }
}

.content {
  width: 100%;
  padding-top: 100rpx;
  box-sizing: border-box;
}

/* #ifdef MP-WEIXIN || APP-PLUS */
.content {
  padding-top: 0;
}

/* #endif */
.content .msg-list {
  width: 100%;
}

.content .msg-list .loading {
  display: flex;
  justify-content: center;
}

@keyframes stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.6);
  }

  20% {
    transform: scaleY(1);
  }
}

.content .msg-list .row {
  padding: 30rpx;
}

.content .msg-list .row:first-child {
  margin-top: 20upx;
}

.content .msg-list .row .my .left,
.content .msg-list .row .other .right {
  width: 100%;
  display: flex;
  align-items: center;
}

.content .msg-list .row .my .left .bubble,
.content .msg-list .row .other .right .bubble {
  max-width: 70%;
  min-height: 50upx;
  border-radius: 10upx;
  padding: 15upx 20upx;
  display: flex;
  align-items: center;
  font-size: 32upx;
  word-break: break-word;
}

.content .msg-list .row .my .left .bubble .longimage,
.content .msg-list .row .other .right .bubble .longimage {
  width: 300rpx;
  height: auto;
}

.content .msg-list .row .my .right,
.content .msg-list .row .other .left {
  flex-shrink: 0;
  width: 80upx;
  height: 80upx;
}

.content .msg-list .row .my .right image,
.content .msg-list .row .other .left image {
  width: 80upx;
  height: 80upx;
  border-radius: 10upx;
}

.content .msg-list .row .my {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.content .msg-list .row .my .left {
  min-height: 80upx;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.content .msg-list .row .my .left .bubble {
  background-color: #f95251;
  color: #fff;
  opacity: 1;
  border-radius: 8px 0px 8px 8px;
}

.content .msg-list .row .other .right .bubble {
  opacity: 1;
  border-radius: 0px 8px 8px 8px;
}

.content .msg-list .row .my .left .no-bg {
  background-color: none;
}

@keyframes my-play {
  0% {
    transform: translateX(80%);
  }

  100% {
    transform: translateX(0%);
  }
}

.content .msg-list .row .my .left .bubble.play .icon:after {
  border-left: solid 10upx rgba(240, 108, 122, 0.5);
  animation: my-play 1s linear infinite;
}

.phone-icon {
  width: 60rpx;
  height: 60rpx;
}

.content .msg-list .row .my .right {
  margin-left: 15upx;
}

.content .msg-list .row .other {
  width: 100%;
  display: flex;
}

.content .msg-list .row .other .left {
  margin-right: 15upx;
}

.content .msg-list .row .other .right {
  flex-wrap: wrap;
}

.content .msg-list .row .other .right .bubble {
  background-color: #fff;
  color: #333;
}

@keyframes other-play {
  0% {
    transform: translateX(-80%);
  }

  100% {
    transform: translateX(0%);
  }
}

.content .msg-list .row .other .right .bubble.play .icon:after {
  border-right: solid 10upx rgba(255, 255, 255, 0.8);
  animation: other-play 1s linear infinite;
}

/* 店铺信息 */
.shop-info {
  width: 100%;
  height: 100rpx;
  position: fixed;
  top: 0;
  background-color: #ffffff;
  line-height: 100rpx;
  text-align: center;
  z-index: 999;
  display: flex;
  align-items: center;
  font-size: 32rpx;
  box-shadow: 2rpx 4rpx 8rpx 0rpx #ddd;
}

.flex-wrap {
  flex: auto;
}

/* 返回图标 */
.back-icon {
  position: absolute;
  left: 0;
  top: 36rpx;
  width: 50rpx;
  height: 30rpx;
  transform: rotate(90deg);
}

.shop-tit {
  text-align: center;
  max-width: 80%;
  margin: 0 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.shop-tit .shop-status {
  font-size: 28rpx;
  margin-left: 10rpx;
}

.shop-tit .in {
  color: #6190e8;
}

.shop-tit .out {
  color: #999;
}

/* 系统提示 */
.sys-tips {
  display: flex;
  justify-content: center;
}

.tips-content {
  color: #999999;
  font-size: 28rpx;
}

/* +图标 */
.add {
  width: 66rpx;
  height: 66rpx;
}

/* 中间时间样式 */
.topTime {
  text-align: center;
  margin-bottom: 15px;
  height: 28rpx;
  font-size: 10px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 28rpx;
  color: #aaaaaa;
  opacity: 1;
}

/* 发送链接样式 */
.link-box {
  padding: 16rpx 16rpx 0 16rpx;
  margin: 0 32rpx 0rpx 32rpx;
  /* height: 210rpx; */
  background: #ffffff;
  border: 1px solid #e5e7eb;
  opacity: 1;
}
.link-prod {
  display: flex;
  padding-bottom: 18rpx;
  border-bottom: 1px solid #eeeeee;
}
.link-prod img {
  width: 100rpx;
  height: 100rpx;
}
.link-prod .link-detail {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 2rpx;
  margin: 0 15rpx;
}
.link-detail .prod-name {
  font-size: 10px;
  font-family: PingFang SC;
  padding: 0 10rpx;
  font-weight: 400;
  color: #333333;
  opacity: 1;
  word-break: break-word;
}
.link-prod .prod-price {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-family: PingFang SC;
  padding: 10rpx 0;
  font-weight: 400;
  color: #999999;
  opacity: 1;
}
.link-send {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 40rpx;
  padding-top: 20rpx;
  text-align: center;
  color: #F81A1A;
}
.link-send-right {
  width: 10rpx;
  height: 17rpx;
  margin-left: 14rpx;
  display: inline-block;
  background: url("../../static/images/icon/link-send.png");
}

/* 商品链接样式 */
.prod-link {
  width: 80%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  margin-top: 6px;
  padding: 25rpx 0 25rpx 12px;
}
.link-box {
  width: 85%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  margin-top: 6px;
  padding: 25rpx 0 25rpx 12px;
}
.prod-number {
  margin-top: -14rpx;
  margin-bottom: 20rpx;
  font-size: 20rpx;
}
.prod-no {
  padding: none;
  border-bottom: none;
}
.unread {
  font-size: 24rpx;
  color: #aaaaaa;
  margin-right: 18rpx;
}

.lzy-loading {
  margin-right: 20rpx;
  float: left;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 1px solid #f0f0f0;
  border-left: 1px solid #6190e8;
  animation: load 1s linear infinite;
  -webkit-animation: load 1s linear infinite;
}
@-webkit-keyframes load {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes load {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
