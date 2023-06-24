<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 申请退款 -->
  <view class="Mall4j page">
    <view>
      <!-- 头部商品信息 -->
      <view class="top-box">
        <text class="order-number">{{ i18n.orderNumber }}：{{ orderNumber }}</text>
      </view>
      <view v-if="refundItem.status >=2 && refundItem.orderItemDtos" class="goods-msg-box">
        <block v-for="(item, prodId) in orderItemDtos" :key="prodId">
          <view class="item-cont" :data-prodid="item.prodId">
            <view class="prod-pic">
              <ImgShow :src="item.pic" />
            </view>
            <view class="prod-info">
              <view class="prodname">{{ item.prodName }}</view>
              <view class="prod-info-cont">
                <text class="number sku-name">{{ item.skuName || '' }}</text>
              </view>
              <view class="price-nums clearfix">
                <text class="prodprice"><text class="symbol">￥</text>
                  <text class="big-num">{{ parsePrice(item.price)[0] }}</text>
                  <text class="small-num">.{{ parsePrice(item.price)[1] }}</text></text>
                <text class="number prod-num">&nbsp;&nbsp;&nbsp;{{ item.prodCount }}{{ i18n.piece }}</text>
              </view>
              <!-- 赠品 @tap="toProdDetail(prod.prodId)"-->
              <view class="gift-prods">
                <view
                  v-for="prod in item.giveawayList"
                  :key="prod.orderItemId"
                  class="gift-item"
                >
                  <text class="name">{{ '【' + i18n.gift + '】' }}{{ prod.prodName }}</text>
                  <text class="sku-name">{{ prod.skuName || '' }}</text>
                  <text class="num">×{{ prod.prodCount }}</text>
                </view>
              </view>
            </view>
          </view>
        </block>
      </view>

      <!-- 单个商品项 -->
      <view v-if="!refundItem.orderItemDtos" class="goods-info">
        <view class="goods-msg-box">
          <view class="item-cont">
            <view class="img-box">
              <ImgShow :src="refundItem.pic" />
            </view>
            <view class="goods-msg">
              <view class="goods-title">{{ refundItem.prodName }}</view>
              <view class="goods-quantity">
                <text class="number sku-name">{{ refundItem.skuName || '' }}</text>
                <text class="number prod-num">×{{ refundItem.prodCount }}</text>
              </view>
            </view>
          </view>
          <!-- 赠品 -->
          <!-- @tap="toProdDetail(prod.prodId)" -->
          <view v-for="(prod,index) in refundItem.giveawayList" :key="prod.orderItemId" class="item-cont">
            <view class="img-box">
              <ImgShow :src="prod.pic" />
            </view>
            <view class="goods-msg">
              <view class="goods-title">{{ prod.prodName }}</view>
              <view class="goods-quantity">
                <text class="gift-icon">{{ i18n.gift }}</text>
                <text class="number sku-name">{{ prod.skuName || '' }}</text>
                <text class="number prod-num">×{{ prod.prodCount }}</text>
              </view>
              <view class="gift-price-info">
                <view class="price">￥{{ prod.giveawayAmount }}</view>
                <view v-if="refundItem.status!==2" class="remove-btn" @tap="removeGiftItem(index)">{{ i18n.removeGiftBtn }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 退款方式 -->
      <view class="picker-box">
        <view class="select-show clearfix">
          <text class="select-text">{{ i18n.refundMethod }}</text>
          <!-- 仅退款/退货退款 -->
          <text class="select-results">{{ ['', i18n.refund01, i18n.refund02][applyType] }}</text>
        </view>
      </view>
      <!-- 货物状态【已发货状态下且用户选择仅退款】 -->
      <!-- 订单状态 1:待付款 2:待发货 3:待收货 4:待评价 5:成功 6:失败 -->
      <!-- 虚拟商品（需要核销）-货物状态：默认未收到货，可选 -->
      <view v-if="orderMold === 1 && needWriteOffs" class="vir-picker-box">
        <picker
          v-if="refundItem.status >= 3 && refundItem.status!=6 && applyType==1"
          class="picker-box"
          mode="selector"
          :value="isReceiver"
          :range="goodsStateArray"
          @change="goodsStateArrayFun"
        >
          <view class="select-show select-box clearfix">
            <text class="select-text">{{ i18n.cargoStatus }}</text>
            <text class="select-results select-reason">{{ goodsStateArray[isReceiver] }}</text>
            <view class="right-arrow">
              <image src="/static/images/icon/more.png" />
            </view>
          </view>
        </picker>
      </view>
      <view v-else>
        <picker
          v-if="refundItem.status >= 3 && refundItem.status!=6 && applyType==1"
          class="picker-box"
          mode="selector"
          :value="isReceiver"
          :range="goodsStateArray"
          @change="goodsStateArrayFun"
        >
          <view class="select-show select-box clearfix">
            <text class="select-text">{{ i18n.cargoStatus }}</text>
            <text class="select-results select-reason">{{ goodsStateArray[isReceiver] }}</text>
            <view class="right-arrow">
              <image src="/static/images/icon/more.png" />
            </view>
          </view>
        </picker>
      </view>
      <!-- isReceiver: 0, //货物状态(1:已收到货 0:未收到货) -->
      <!-- 退款原因（已发货 || 已完成）&& 已收到货 -->
      <picker
        v-if="refundItem.status != 2 && isReceiver == 1"
        class="picker-box picker-reason"
        mode="selector"
        :value="refundProdReasonArray[buyerReason]"
        :range="refundProdReasonArray"
        @change="refundReasonChange"
      >
        <view class="select-show select-box clearfix">
          <text class="select-text">{{ i18n.refundReason }}</text>
          <text class="select-results select-reason">{{ refundProdReasonArray[buyerReason] }}</text>
          <view class="right-arrow">
            <image src="/static/images/icon/more.png" />
          </view>
        </view>
      </picker>
      <!-- 退款原因（未发货 && 未收到货）|| (已发货 && 未收货) -->
      <picker
        v-if="(refundItem.status == 2 || refundItem.status != 2) && isReceiver == 0"
        class="picker-box picker-reason"
        mode="selector"
        :value="refundPriReasonArray[buyerReason]"
        :range="refundPriReasonArray"
        @change="refundReasonChange"
      >
        <view class="select-show select-box clearfix">
          <text class="select-text">{{ i18n.refundReason }}</text>
          <text class="select-results select-reason">{{ refundPriReasonArray[buyerReason] }}</text>
          <view class="right-arrow">
            <image src="/static/images/icon/more.png" />
          </view>
        </view>
      </picker>

      <!-- 退货数量：(退货退款 && 单个商品退款 && 没有使用氢春豆) || (无需核销的虚拟商品允许选择数量) -->
      <view
        v-if="(applyType == 2 && refundType == 2 && !orderScore) || orderMold === 1"
        class="refund-quantity clearfix"
      >
        <text class="qua-text">{{ i18n.returnquantity }}</text>
        <view v-if="orderMold === 1 && needWriteOffs && maxRefundPieces" class="quantity-choose">
          <!-- 虚拟商品-需要核销时展示最大可退款件数，不允许选择 -->
          <text class="pieces">{{ maxRefundPieces }} 件</text>
        </view>
        <view v-else class="quantity-choose">
          <text
            class="reduce"
            @tap="changePordNum(-1)"
          >-</text>
          <input
            class="show-num"
            :value="goodsNum"
            disabled="true"
          ></input>
          <text
            class="add"
            @tap="changePordNum(+1)"
          >+</text>
        </view>
      </view>

      <!-- 退款金额 -->
      <view class="refund-sum-box" @click="voidClick">
        <view class="refund-sum">
          <label class="refund-sum-tit">{{ i18n.refundAmount }}</label>
          <!-- 如果是(使用了平台分摊的优惠金额)或(有氢春豆的情况)或整单退，则不允许修改退款金额（输入框不可输入） -->
          <text v-if="(refundItem.platformShareReduce > 0 || orderScore > 0 || refundType == 1) && orderMold !== 1" class="refund-sum-num">{{ intShowStr }}</text>
          <!-- 否则，允许修改退款金额（输入框可以输入） -->
          <input
            v-else
            class="refund-sum-num"
            type="digit"
            :placeholder="i18n.refundAmounts"
            :value="refundAmount"
            @input="onRefInput"
          ></input>
        </view>
        <!-- 最多可退 -->
        <view class="refund-sum-tips">
          {{ i18n.maxAmount }}：<text>{{ tipShowStr }}</text>
        </view>
      </view>

      <!-- 退货信息 -->
      <view class="refund-message">
        <!-- 手机 -->
        <view class="item-num">
          <label class="item-num-tit">{{ i18n.mobilePhone }}</label>
          <input
            class="item-num-num"
            type="number"
            :placeholder="orderMold === 1 ? i18n.enterMobileNumber : i18n.enterMobilePhone"
            maxlength="11"
            :value="buyerMobile"
            @input="onMobileInput"
          ></input>
        </view>
        <!-- 说明 -->
        <view class="item-num">
          <label class="item-num-tit">{{ i18n.refundDescription }}</label>
          <input
            class="item-num-num refund-explain"
            :placeholder="i18n.descriptionLength"
            maxlength="50"
            :value="buyerDesc"
            @input="onDescInput"
          ></input>
        </view>

        <!-- 上传照片 -->
        <view class="item-num">
          <label class="item-num-tit upload-tit">{{ i18n.uploadCertificate }}</label>
          <view class="upload-img">
            <view class="upload-tips">{{ i18n.uploadPics }}</view>
            <!-- 预览缩略图 -->
            <block
              v-for="(imgItem, idx) in photoFiles"
              :key="idx"
            >
              <view class="q-image-wrap">
                <!-- 图片缩略图  -->
                <ImgShow :src="imgItem.url" :classList="['q-image']" imgMode="aspectFill" @handleTap="()=>refundPicPreView(imgItem.url)" />
                <!-- 移除图片的按钮  -->
                <view
                  class="q-image-remover"
                  :data-idx="idx"
                  @tap="removeImage"
                >
                  <image src="/static/images/icon/close2.png" />
                </view>
              </view>
            </block>
            <!-- 添加图片按钮 -->
            <view
              v-if="photoFiles.length < 5"
              class="upload-btn"
              @tap="getUploadImg"
            >+</view>
          </view>
        </view>
      </view>
    <!-- 退货信息end -->
    </view>

    <!-- 提交btn -->
    <view class="submit-btn" @tap="applyRefund">{{ i18n.submit }}</view>

    <hCompress ref="hCompress" />
  </view>
</template>

<script>
const http = require('@/utils/http.js')
const util = require('@/utils/util.js')
const Big = require('@/utils/big.min.js')
import config from '@/utils/config.js'
import hCompress from '@/components/helang-compress/helang-compress'
export default {

  components: {
    hCompress
  },
  props: {},
  data() {
    return {
      picDomain: config.picDomain, // 图片前缀

      refundType: 2, // 退款类型 1整单  2单个物品
      goodsStateArray: [], // 货物状态
      isReceiver: 0, // 货物状态(1:已收到货 0:未收到货)
      refundProdReasonArray: [], // 退款原因（已收到货）
      refundPriReasonArray: [], // 退款原因（未收到货）
      buyerReason: 0, // 退款原因
      refundItem: {}, // 订单项数据
      orderItemId: '', // 订单项ID（单个物品退款时使用）
      orderNumber: '', // 订单编号
      applyType: 1, // 退款方式(1:仅退款 2退款退货)
      goodsNum: 1, // 退货数量（0或不传值则为全部数量）
      refundAmount: 0, // 实际退款金额
      buyerMobile: '', // 手机号码（默认当前订单手机号码）
      buyerDesc: '', // 退款说明
      photoFiles: [], // 凭证图片列表
      orderItemDtos: '',
      actualTotal: 0, // 总额
      isLastProd: false, // 是否最后一个订单项
      prodPrice: 0, // 商品单价
      isOnlyProd: false, // 是否仅一件商品
      orderScore: 0, // 氢春豆
      tipShowStr: '', // 最多可退提示
      intShowStr: '', // 输入框金额展示
      totalPrice: 0, // 用于判断的总额

      orderType: 0, // 订单类型 0普通 1团购 2秒杀 3氢春豆
      orderMold: 0, // 订单模式 1虚拟商品订单
      needWriteOffs: false, // 是否需要核销
      maxRefundPieces: 0, // 最大可退款件数（虚拟商品：需要核销时展示）

      // 已被移除的赠品总价
      priceOfRemovedGiveaways: 0,

      // 正在提交申请
      submitting: false
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
    // 订单类型 0普通 1团购 2秒杀 3氢春豆
    this.orderType = options.orderType ? Number(options.orderType) : 0
    // 订单模式 1虚拟商品订单
    this.orderMold = options.orderMold ? Number(options.orderMold) : 0
    // data数据引入
    this.goodsStateArray.push(this.i18n.goodsNotReceived, this.i18n.goodsReceived) // ['未收到货','已收到货']
    // ['拍错/多拍/不喜欢','协商一致退款','商品破损/少件','商品与描述不符','卖家发错货','质量问题','其他']
    this.refundProdReasonArray.push(this.i18n.wrongShot, this.i18n.refundConsensus, this.i18n.damagedGoods, this.i18n.productNot, this.i18n.sellerSendsWrong, this.i18n.qualityProblem, this.i18n.other)
    // ['拍错/多拍/不喜欢','协商一致退款','其他'],
    this.refundPriReasonArray.push(this.i18n.wrongShot, this.i18n.refundConsensus, this.i18n.other)
    // 拿到上一页的参数type（判断退款方式）
    if (options.type) {
      this.setData({
        applyType: Number(options.type) // 1仅退款 2退货退款
      })
    }
    if (this.applyType == 2) {
      this.isReceiver = 1 // 已收到货
    }
    this.setData({
      refundType: Number(options.refundType) // 退款类型 1整单  2单个物品
    })

    this.getRefundProdInfo() // 获取退款商品信息
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.requestRefund
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() { },

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
     * 无效点击，用于解决h5端点击退款金额上面部分会弹出退款原因问题
     */
    voidClick() {
      return
    },
    /**
     * 货物状态picker选择
     * isReceiver: 货物状态(1:已收到货 0:未收到货)
     */
    goodsStateArrayFun: function(e) {
      this.isReceiver = e.detail.value
      this.buyerReason = 0
    },

    /**
     * 退款原因picker选择
     */
    refundReasonChange: function(e) {
      const buyerReasonValue = e.detail.value
      if (!buyerReasonValue) {
        this.buyerReason = 0
      } else {
        this.buyerReason = e.detail.value
      }
    },

    /**
     * 获取退款商品信息
     */
    getRefundProdInfo: function() {
      const refundType = this.refundType // 退款类型 1整单  2单个物品
      this.giveawayItemIds = [] // 赠品ids
      // 拿到缓存里的订单项数据
      var refundItem = uni.getStorageSync('bbcRefundItem')
      console.log(refundItem)
      this.setData({
        buyerMobile: refundItem.buyerMobile,
        refundItem: refundItem,
        orderNumber: refundItem.orderNumber,
        goodsNum: refundItem.prodCount, // 商品总数
        actualTotal: refundItem.actualTotal, // 总额
        isLastProd: refundItem.isLastProd, // 是否最后一样商品
        isOnlyProd: refundItem.isOnlyProd, // 只有一件商品可以退运费
        orderScore: refundItem.useScore // 单个退氢春豆
      })
      // 单个
      if (refundType == 2) {
        // 赠品ids
        this.giveawayItemIds = refundItem.giveawayList?.map(el => el && el.orderItemId)
        // 虚拟商品
        if (this.orderMold === 1) {
          // needWriteOffs是否需要核销
          this.needWriteOffs = refundItem.needWriteOffs
          // 商品数量（无需核销的虚拟商品才需要商品数量）
          if (!this.needWriteOffs) {
            this.goodsNum = refundItem.prodCount
          }
          // 最大可退件数（需要核销）
          if (this.needWriteOffs) {
            this.goodsStateArray.shift() // 核销不存在未收到货
            this.isReceiver = 0
            this.maxRefundPieces = refundItem.maxRefundPieces ? Number(refundItem.maxRefundPieces) : 0
          }
        }
      }
      if (refundType == 1) { // 整单退款
        this.setData({
          orderItemDtos: refundItem.orderItemDtos, // 商品列表
          orderScore: refundItem.orderScore // 整单氢春豆
        })
        this.orderItemDtos.forEach(el => {
          if (el.giveawayList && el.giveawayList.length) {
            // 赠品ids
            this.giveawayItemIds = this.giveawayItemIds.concat(el.giveawayList.map(el => el && el.orderItemId))
          }
        })
      }
      // const actualTotal = this.actualTotal // 总额
      // const prodCount = refundItem.prodCount // 商品总数
      // if (refundType == 2) {  //单个退
      //   //计算商品单价
      //   if(prodCount > 0) {
      //     var x = new Big(actualTotal)
      //     var y = new Big(prodCount)
      //     // 保留两位小数
      //     Big.DP = 2
      //     // 向下取整
      //     Big.RM = 1
      //     let prodPrice = x.div(y).valueOf()  //商品单价
      //     this.setData({
      //       prodPrice
      //     })
      //   }
      // }

      this.getRefundAmount() // 退款金额计算
    },

    /**
     * 退款金额计算
     */
    getRefundAmount: function() {
      Big.DP = 2
      Big.RM = 0
      const actualTotal = new Big(this.actualTotal) // 商品总额（不含运费）
      const refundItem = this.refundItem // 订单项item
      const refundType = this.refundType // 退款类型 1整单  2单个物品
      const freeTransfee = new Big(refundItem.freeTransfee) // 运费减免
      // 可退金额
      const canRefundAmount = new Big(refundItem.canRefundAmount)
      // 运费
      console.log(refundItem)
      const transfee = refundItem.isLastProd ? refundItem.canRefundAmount - this.actualTotal > refundItem.transfee ? new Big(refundItem.transfee) : canRefundAmount.minus(actualTotal).valueOf() : new Big(refundItem.transfee)
     
      // 虚拟商品&需要核销：根据最多可退件数，计算最大可退金额
      if (this.orderMold === 1 && this.needWriteOffs) {
        const prodCount = refundItem.prodCount
        this.refundAmount = actualTotal.times(this.maxRefundPieces).div(prodCount).valueOf()
        this.totalPrice = this.refundAmount
        this.showNumber() // 退款金额展示
        return
      }

      if (refundItem.status == 2) { // 待发货状态
        if (refundType == 2) { // 单个退,
          // if ((refundItem.isLastProd && freeTransfee == 0) || (this.isOnlyProd && freeTransfee == 0) ) {  //如果是“最后一个”或“只有一个商品”，（且运费不减免时）可退运费（actualTotal不包含运费）
          //   this.setData({
          //     refundAmount: actualTotal.plus(transfee).valueOf(), // refundAmount
          //   });
          // } else { //否则不退
          //   this.setData({
          //     refundAmount: this.actualTotal,
          //   });
          // }
          this.setData({
            refundAmount: this.actualTotal
          })
        } else if (refundType == 1) { // 整单退，退实际总（actualTotal总额包含运费）
          this.setData({
            refundAmount: this.actualTotal
          })
        }
      } else if (refundItem.status != 2) { // 已发货订单（都不退运费）
        if (refundType == 1 && freeTransfee == 0) { // 整单（总额含运费且运费不减免）
          this.setData({
            refundAmount: actualTotal.minus(transfee).valueOf()
          })
        } else { // 单个（金额不含运费）
          this.setData({
            refundAmount: this.actualTotal
          })
        }
      }
      this.totalPrice = this.refundAmount
      this.showNumber() // 退款金额展示
    },

    /**
     * 改变商品数量重新计算价格（数量加减）
     */
    changePordNum(changeNum) {
      const actualTotal = this.refundItem.actualTotal // 商品总额（不含运费）
      var goodsNum = this.goodsNum + changeNum // 展示的商品总数
      var prodCount = this.refundItem.prodCount // 商品总数
      // 被移除的赠品总数
      const priceOfRemovedGiveaways = this.priceOfRemovedGiveaways || 0
      // var prodCount = 0
      // if (this.orderMold === 1) {
      //   // 虚拟商品且无需核销
      //   prodCount = this.orderItemDtos[0].prodCount
      // } else {
      //   prodCount = this.refundItem.prodCount
      // }

      if (goodsNum < 1) {
        uni.showToast({
          title: this.i18n.returnQuantityTips1,
          icon: 'none'
        })
        return
      }
      if (goodsNum > prodCount) {
        uni.showToast({
          title: this.i18n.returnQuantityTips2,
          icon: 'none'
        })
        return
      }
      Big.DP = 2
      // 当前最大可退款金额 = 实际总额/商品总数*当前退款数量-已被移除的赠品总价
      const amount = new Big(actualTotal).times(goodsNum).div(prodCount).minus(priceOfRemovedGiveaways).valueOf()
      if (amount <= 0) {
        uni.showToast({
          title: '当前数量不可减少',
          icon: 'none',
          duration: 3000
        })
        return
      }

      this.goodsNum = goodsNum
      this.refundAmount = amount
      // 最多可退
      this.totalPrice = this.refundAmount

      this.showNumber() // 退款金额展示
    },

    /**
     * 金额展示
     */
    showNumber: function() {
      Big.DP = 2
      Big.RM = 0
      var refundItem = this.refundItem // 订单(项)item
      var refundAmount = new Big(this.refundAmount).valueOf() // 实际退款金额
      var refundType = this.refundType // 退款单类型（1:整单退款,2:单个退款）
      var actualTotal = new Big(this.actualTotal).valueOf() // 总额
      var orderScore = this.orderScore // 氢春豆
      var isLastProd = this.isLastProd // 是否最后一个订单项item
      // 可退金额
      const canRefundAmount = new Big(refundItem.canRefundAmount)
      // 运费
      const transfee = refundItem.isLastProd ? refundItem.canRefundAmount - this.actualTotal > refundItem.transfee ? new Big(refundItem.transfee) : canRefundAmount.minus(actualTotal).valueOf() : new Big(refundItem.transfee)
      // var freeTransfee = new Big(refundItem.freeTransfee).valueOf() // 运费减免
      var tipShow = [] // 最多可退提示——格式：单件退（金额+运费+氢春豆） 整单退（金额(含运费) + 氢春豆）
      var intShow = [] // 输入框——格式： 金额（含运费）+ 氢春豆

      // 金额
      if (actualTotal && actualTotal > 0) {
        const refAmo = this.i18n.currencySymbol + refundAmount
        tipShow.push(refAmo)
        intShow.push(refAmo)
      }

      // 有运费且运费不减免
      if (refundItem.status == 2 && // 待发货
        transfee && (transfee - refundItem.freeTransfee) > 0 && // 有运费
        ((refundType == 2 && // 单个退
          (isLastProd || this.isOnlyProd)) || // 最后一件或仅有一件商品
          refundType == 1) // 或整单退
      ) {
        tipShow = []
        const refAmo = this.i18n.currencySymbol + refundAmount
        // var transfees = this.i18n.shipping + this.i18n.currencySymbol + transfee
        // var transfees = this.isLastProd && transfee ? '（' + this.i18n.shipping + this.i18n.currencySymbol + transfee + this.i18n.autoReturn + '）' : ''
        if (refundType == 1) { // 整单
          var transfee2 = refAmo + '（' + this.i18n.includingFreight + transfee + '）'
          tipShow.push(transfee2)
        } else if (refundType == 2) { // 单个
          if (actualTotal && actualTotal > 0) { // 商品实付金额（除运费外）大于0
            var act = this.i18n.currencySymbol + actualTotal
            tipShow.push(act)
          } else {
            intShow.push(refAmo)
          }
          // tipShow.push(transfees)
        }
      }

      // 已发货 && 金额为0
      if (refundItem.status != 2 && refundAmount == 0) {
        tipShow = []
        intShow = []
      }

      // 氢春豆
      if (orderScore && orderScore > 0) {
        var score = orderScore + this.i18n.integral
        tipShow.push(score)
        intShow.push(score)
      }

      this.tipShowStr = tipShow.join('+') // 最多可退
      this.intShowStr = intShow.join('+') // 输入框
    },

    /**
     * 移除赠品
     */
    removeGiftItem(index) {
      // plus+ minus- times* div/
      // 赠品价值
      const giveawayAmount = this.refundItem.giveawayList[index].giveawayAmount
      uni.showModal({
        title: this.i18n.tips,
        // 移除赠品后退款金额将减去赠品价格xxx
        content: `${this.i18n.removeGiftTip1 + giveawayAmount + this.i18n.removeGiftTip2}`,
        confirmText: this.i18n.confirm,
        cancelText: this.i18n.cancel,
        success: (successRes) => {
          if (successRes.confirm) {
            // 订单实际总额
            const actualTotal = new Big(this.refundItem.actualTotal)
            // 商品总件数
            const prodCount = this.refundItem.prodCount
            // 当前退款件数
            const goodsNum = this.goodsNum
            // 已被移除的赠品总价
            const priceOfRemovedGiveaways = this.priceOfRemovedGiveaways || 0
            // 当前最大可退款金额 = 订单实际总额/商品总件数*当前退款件数-已被移除的赠品总价
            const curRefundAmount = actualTotal.div(prodCount).times(goodsNum).minus(priceOfRemovedGiveaways)

            // 可退金额 = 当前最大可退款金额 - 当前点击移除的赠品价值
            const totalAmount = Number.parseFloat(curRefundAmount.minus(giveawayAmount).valueOf())

            // 当减去当前要移除的赠品价格所得值<=0时，不允许移除
            if (giveawayAmount > 0 && totalAmount <= 0) {
              uni.showToast({
                title: this.i18n.removeGiftTip3,
                icon: 'none',
                duration: 3000
              })
              return
            }

            // 已被移除的赠品总价
            this.priceOfRemovedGiveaways = new Big(giveawayAmount).plus(this.priceOfRemovedGiveaways).valueOf() || 0

            // 移除
            this.refundItem.giveawayList.splice(index, 1)
            this.giveawayItemIds.splice(index, 1)

            // 计算退款金额
            this.actualTotal = totalAmount
            this.getRefundAmount()
          }
        }
      })
    },

    /**
     * 上传图片
     */
    getUploadImg: function() {
      uni.chooseImage({
        count: 5 - this.photoFiles.length,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: (res) => {
          var tempFilePaths = res.tempFilePaths
          this.compression(tempFilePaths, res.tempFiles, 0)
        }
      })
    },
    compression(tempFilePaths, tempFiles, index) {
      if (index === tempFilePaths.length) return
      var params = {
        url: '/p/file/upload',
        filePath: '',
        name: 'file',
        callBack: (res2) => {
          var img = {}
          img.path = res2.filePath
          img.url = res2.resourcesUrl + res2.filePath
          this.photoFiles.push(img)
        }
      }
      const obj = {
        src: tempFilePaths[index],
        quality: 0.2
      }
      this.$refs.hCompress.compress(obj, tempFiles[index]).then(res => {
        params.filePath = res
        http.upload(params)
        index += 1
        if (index === tempFilePaths.length) {
          return
        } else {
          this.compression(tempFilePaths, tempFiles, index)
        }
      }, (e) => {
        console.log(e)
        index += 1
        if (index === tempFilePaths.length) {
          return
        } else {
          this.compression(tempFilePaths, tempFiles, index)
        }
      })
    },

    /**
     * 申请退款图片点击预览
     */
    refundPicPreView(current) {
      var urls = []
      this.photoFiles.forEach(el => {
        urls.push(el.url)
      })
      uni.previewImage({
        current: current,
        urls: urls
      })
    },

    /**
     * 删除图片
     */
    removeImage: function(e) {
      var idx = e.currentTarget.dataset.idx
      var photoFiles = this.photoFiles
      photoFiles.splice(idx, 1)
      this.setData({
        photoFiles: photoFiles
      })
    },

    /**
     * 申请退款
     */
    applyRefund: function() {
      var pics = ''
      this.photoFiles.forEach(function(item) {
        pics += item.path + ','
      })
      if (pics != '') {
        pics = pics.substring(0, pics.length - 1)
      }
      if (!this.orderScore && this.refundAmount < 0.01) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.fillCorrectAmount,
          duration: 2500
        })
        return
      }
      // 输入框金额大于订单最多可退总额（金额+运费）
      if (Number(this.refundAmount) > Number(this.totalPrice)) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.refundAmountTips,
          duration: 2000
        })
        return
      }
      if (this.buyerMobile.length == 0) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.enterMobileNumber
        })
        return
      }
      if (this.buyerMobile.length !== 11 || !util.checkPhoneNumber(this.buyerMobile)) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.enterCorrectPhone
        })
        return
      }
      if (!this.buyerDesc || !this.buyerDesc.trim()) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.fillRefundDescription
        })
        return
      }
      if (this.buyerDesc.length > 50) {
        uni.showToast({
          icon: 'none',
          title: this.i18n.fillRefundDescriptionTips
        })
        return
      }

      if (this.submitting) {
        return
      }
      this.submitting = true

      // var refundReasonArray = []
      var buyerReason = this.buyerReason
      if (this.isReceiver == 0) { // 未收货
        // refundReasonArray = this.refundPriReasonArray
        // 未收到货需要转换一下原因
        buyerReason == 2 ? buyerReason = 6 : 0
      } else if (this.isReceiver == 1) { // 已收货
        // refundReasonArray = this.refundProdReasonArray
      }
      let goodsNum = this.goodsNum
      if (this.orderMold === 1 && this.needWriteOffs) {
        goodsNum = this.maxRefundPieces
      }
      const params = {
        url: '/p/orderRefund/apply',
        method: 'POST',
        data: {
          orderNumber: this.orderNumber, // 订单编号
          applyType: this.applyType, // 退款方式(1:仅退款 2退款退货)
          isReceiver: Number(this.isReceiver), // 货物状态(1:已收到货 0:未收到货)
          buyerReason: buyerReason, // 退款原因
          goodsNum: goodsNum, // 退款数量（0或不传值则为全部数量）
          refundAmount: this.refundAmount, // 退款金额
          buyerMobile: this.buyerMobile, // 手机号码（默认当前订单手机号码）
          buyerDesc: this.buyerDesc, // 备注说明
          photoFiles: pics, // 凭证图片列表
          refundType: this.refundType, // 退款单类型（1:整单退款,2:单个物品退款）
          orderItemId: this.refundItem.orderItemId,
          giveawayItemIds: this.giveawayItemIds // 赠品ids
        },
        callBack: (res) => {
          this.submitting = false
          // 去到我的退款订单页面
          uni.redirectTo({
            url: '/package-refund/pages/after-sales/after-sales'
          })
        },
        errCallBack: res => {
          http.request({
            url: '/p/myOrder/orderDetail',
            method: 'GET',
            data: {
              orderNumber: this.orderNumber
            },
            callBack: orderRes => {
              if (orderRes.status !== this.refundItem.status) {
                uni.showModal({
                  showCancel: false,
                  title: this.i18n.tips,
                  content: this.i18n.orderChangeTips,
                  confirmText: this.i18n.confirm,
                  success: (modalRes) => {
                    if (modalRes.confirm) {
                      uni.navigateBack({
                        delta: 1
                      })
                    }
                  }
                })
              } else {
                uni.showToast({
                  title: res.msg,
                  icon: 'none'
                })
              }
            }
          })
          this.submitting = false
        }
      }
      http.request(params)
    },

    /**
     * 将获取到的input内容放进数据里
     */
    onDescInput: function(e) {
      this.setData({
        buyerDesc: e.detail.value
      })
    },
    onRefInput: function(e) {
      this.setData({
        refundAmount: e.detail.value
      })
    },
    onMobileInput: function(e) {
      this.setData({
        buyerMobile: e.detail.value
      })
    },

    /**
     * 跳转商品详情
     */
    toProdDetail(prodId) {
      this.$Router.push({ path: '/package-prod/pages/prod/prod', query: { prodId: prodId }})
    }

  }
}
</script>
<style>
@import "./apply-refund.css";
</style>
