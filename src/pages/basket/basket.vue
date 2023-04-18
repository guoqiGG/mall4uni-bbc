<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <view id="prod-list" class="prod-list" :style="prodListStyle">
      <view v-for="(shopCart, shopIndex) in shopCarts" :key="shopIndex" class="shop-item">
        <!-- 头部店铺 -->
        <view class="head-shop">
          <view class="btn choose-btn">
            <label class="check-box-label">
              <checkbox
                :checked="shopCart.checked"
                color="#F81A1A"
                @tap="handleCheckShop(shopIndex)"
              />
            </label>
          </view>
          <view class="shop-box" @tap="toShopIndex(shopCart.shopId)">
            <view class="shop-icon">
              <image src="/static/images/icon/shop.png" />
            </view>
            <view class="shop-name">{{ shopCart.shopName }}<span /></view>
          </view>
        </view>
        <!-- /头部店铺 -->

        <view v-for="(shopCartItem, shopCartItemIndex) in shopCart.shopCartItemDiscounts" :key="shopCartItemIndex" class="shop-item-detail">
          <view :class="'prod-block ' + (shopCartItem.chooseDiscountItemDto || shopCartItem.chooseComboItemDto ?'discount':'')">
            <!-- 满减提示 -->
            <view v-if="shopCartItem.chooseDiscountItemDto" class="discount-tips">
              <view class="combo-item">
                <text
                  class="text-block"
                >{{ [i18n.amount, i18n.pieces, i18n.amountDiscount, i18n.piecesDiscount][shopCartItem.chooseDiscountItemDto.discountRule] }}</text>
                <text
                  class="text-list"
                >{{ parseDiscountMsg(shopCartItem.chooseDiscountItemDto.discountRule,shopCartItem.chooseDiscountItemDto.needAmount,shopCartItem.chooseDiscountItemDto.discount,curLang) }}</text>
              </view>
              <view>
                <text
                  v-if="shopCartItem.chooseDiscountItemDto.reduceAmount >0"
                  class="text-list reduce-amount"
                >{{ i18n.haveDiscount }}￥{{ parsePrice(shopCartItem.chooseDiscountItemDto.reduceAmount)[0] }}.{{ parsePrice(shopCartItem.chooseDiscountItemDto.reduceAmount)[1] }}
                </text>
              </view>
            </view>
            <!-- 套装提示 -->
            <view v-if="shopCartItem.chooseComboItemDto" class="discount-tips">
              <view class="combo-item">
                <text class="text-block">{{ i18n.packages }}</text>
                <text class="text-list combo-name">{{ shopCartItem.chooseComboItemDto.name }}</text>
              </view>
              <view class="combo-item">
                <text class="text-list reduce-amount">{{ i18n.haveDiscount }}￥{{ parsePrice(shopCartItem.chooseComboItemDto.preferentialAmount)[0] }}.{{ parsePrice(shopCartItem.chooseComboItemDto.preferentialAmount)[1] }}</text>
              </view>
            </view>

            <!-- 商品item -->
            <view v-for="(prod, prodIndex) in shopCartItem.shopCartItems" :key="prodIndex">
              <view class="goods-item">
                <!-- 商品信息 -->
                <view class="item">
                  <view class="prodinfo" @tap="toProdPage(prod.prodId)">
                    <view class="info-row">
                      <view :class="['btn', prod.comboId && prod.parentBasketId !==0 ? 'hide' : '']">
                        <label>
                          <checkbox
                            :value="toString(prod.prodId)"
                            :checked="prod.checked"
                            color="#F81A1A"
                            class="checkbox"
                            @tap.stop="handleCheckProdItem(shopIndex, shopCartItemIndex, prodIndex)"
                          />
                        </label>
                      </view>
                      <view class="pic">
                        <image v-if="prod.pic && !prod.isPicError" :src="prod.pic" @error="handlePicError(prod)" />
                        <image v-else src="/static/images/icon/def.png" mode="aspectFit" />
                      </view>
                      <view class="opt">
                        <view class="prod-name">{{ prod.prodName }}</view>
                        <view class="prod-center-row">
                          <view :class="'prod-info-text ' + (prod.skuName?'':'empty-n')" @tap.stop="getSkuListByProdId(prod, shopCartItem)">
                            {{ prod.skuName || '' }}</view>
                          <view v-if="prod.discounts.length>0" class="prod-discount">
                            <text
                              class="prod-discount-tit"
                              @tap.stop="onChooseDiscount(prod)"
                            >
                              {{ getCurrDiscountName(prod.discountId,prod.discounts, curLang) }}
                            </text>
                          </view>
                        </view>
                        <view class="price-count">
                          <view class="price">
                            <text class="symbol">￥</text>
                            <text class="big-num">{{ parsePrice(prod.comboId ? prod.comboPrice : prod.price)[0] }}</text>
                            <text class="small-num">.{{ parsePrice(prod.comboId ? prod.comboPrice : prod.price)[1] }}</text>
                            <!-- 套装内的商品的数量 -->
                            <text v-if="prod.comboId" class="combo-count"> x {{ prod.prodCount }}</text>
                          </view>
                          <view v-if="!prod.comboId" class="m-numSelector">
                            <view class="minus" @tap.stop="updateBasket(shopCart.shopId, prod, -1)" />
                            <input type="number" :value="prod.prodCount" disabled></input>
                            <view class="plus" @tap.stop="updateBasket(shopCart.shopId, prod, 1)" />
                          </view>
                        </view>
                      </view>
                    </view>
                    <view v-if="prod.giveaway" class="gift-con">
                      <view v-for="(giveawayItem, giveawayIndex) in prod.giveaway.giveawayProds" :key="giveawayIndex" class="gift-item" @tap.stop="toProdPage(giveawayItem.prodId)">
                        <view class="gift-name">【{{ i18n.Giveaways }}】{{ giveawayItem.prodName }}<text v-if="giveawayItem.skuName" class="gift-sku">{{ giveawayItem.skuName||'' }}</text></view>
                        <view class="gift-count">
                          <view>x {{ giveawayItem.giveawayNum }}</view>
                          <image src="../../static/images/icon/more.png" mode="" />
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <!-- 套餐的数量 -->
            <view v-if="shopCartItem.chooseComboItemDto && shopCartItem.chooseComboItemDto.comboId" class="combo-oper">
              <view class="combo-price">
                <text>{{ i18n.packagePrice }}￥</text>
                <text class="combo-amount">{{ parsePrice(shopCartItem.chooseComboItemDto.comboAmount)[0] }}.</text>
                <text>{{ parsePrice(shopCartItem.chooseComboItemDto.comboAmount)[1] }}</text>
              </view>
              <view class="combo-count">
                <view class="m-numSelector">
                  <view class="minus" @tap.stop="updateBasket(shopCart.shopId, shopCartItem.shopCartItems[0], -1, null, shopCartItem.chooseComboItemDto.comboCount)" />
                  <input type="number" :value="shopCartItem.chooseComboItemDto.comboCount" disabled></input>
                  <view class="plus" @tap.stop="updateBasket(shopCart.shopId, shopCartItem.shopCartItems[0], 1, null, shopCartItem.chooseComboItemDto.comboCount)" />
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <!-- 英文时候购物车底部字体出现遮蔽 -->
    <view
      v-if="shopCarts.length>0"
      class="cart-footer"
      :style="i18n.instantReduction.length>2?'height:130rpx':''"
    >
      <view class="btn all">
        <label @tap="handleCheckAll">
          <checkbox :checked="allChecked" color="#F81A1A" />{{ i18n.selectAll }}
        </label>
      </view>
      <view class="btn del" @tap="handleDeletProd">
        <text>{{ i18n.delete }}</text>
      </view>
      <view class="btn total">
        <view class="total-con" @tap.stop="showPriDet">
          <view class="finally">
            <text class="blod">{{ i18n.total }}:</text>
            <view class="price">
              <text class="symbol">￥</text>
              <text class="big-num">{{ parsePrice(finalMoney)[0] }}</text>
              <text class="small-num">.{{ parsePrice(finalMoney)[1] }}</text>
            </view>
          </view>
          <view v-if="subtractMoney>0" class="total-msg">

            <!-- {{i18n.instantReduction}}:￥{{parsePrice(subtractMoney)[0] + '.' + parsePrice(subtractMoney)[1]}}</view> -->
            {{ i18n.instantReduction }}:￥{{ toFixxed(subtractMoney) }}</view>
          <!-- 总额:￥{{toPrice(totalMoney)}}  -->
        </view>
        <view class="arrow-icon" @tap.stop="showPriDet">
          <image v-if="hidePriModal" src="../../static/images/icon/down-arrow.png" />
          <image v-if="!hidePriModal" src="../../static/images/icon/up-arrow.png" />
        </view>
      </view>
      <view class="btn settle" @tap="toFirmOrder">
        <text>{{ i18n.settlement }}</text>
      </view>
    </view>
    <!-- end 底部按钮 -->

    <!-- 底部活动选择弹框 -->
    <view class="modals modals-bottom-dialog" :hidden="hideModal">
      <view class="modals-cancel" @tap="hideModalFun" />
      <view class="bottom-dialog-body bottom-pos radius" :animation="animationData">
        <view class="discount-title radius">{{ i18n.selectPromotion }}</view>
        <view class="radio-group">
          <radio-group v-if="reDraw" @change="radioChange">
            <label v-for="(item, index) in prodDiscounts" :key="index">
              <view class="radio-item">
                <radio
                  color="#F81A1A"
                  :value="String(item.discountId)"
                  :checked="item.discountId==discountId"
                />
                <view class="radio-text">
                  {{ item.discountName }}
                </view>
              </view>
            </label>
            <label>
              <view class="radio-item">
                <radio color="#F81A1A" value="-1" :checked="discountId==-1" />
                <view class="radio-text">
                  {{ i18n.notPromotion }}
                </view>
              </view>
            </label>
          </radio-group>
        </view>
      </view>
    </view>

    <!-- 底部金额明细弹框 -->
    <view class="pri-modal modals-bottom-dialog" :hidden="hidePriModal">
      <view class="modals-cancel" @tap="hidePriModalFun" />
      <view class="bottom-dialog-box bottom-pos radius" :animation="animationData">
        <view class="discount-title radius">{{ i18n.amountDetails }}</view>
        <view class="price-detail">
          <view class="price-detail-item">
            <view class="det-tit">{{ i18n.comTotal }}</view>
            <view class="det-num">￥{{ toPrice(totalMoney) }}</view>
          </view>
          <view v-if="freightAmount > 0" class="price-detail-item">
            <view class="det-tit">{{ i18n.freightPayable }}</view>
            <view class="det-num">￥{{ toPrice(freightAmount) }}</view>
          </view>
          <view v-if="subtractMoney > 0" class="price-detail-item">
            <view class="det-tit">{{ i18n.promotionalDiscount }}</view>
            <view class="det-num">-￥{{ toFixxed(subtractMoney) }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空列表或加载全部提示 -->
    <EmptyAllTips
      v-if="isLoaded"
      :isEmpty="!shopCarts.length"
      :emptyTips="i18n.shoppingTips"
    />

    <!-- 商品配送方式选择 -->
    <view v-if="showDeliveryWay" class="select-distribution modals-bottom-dialog">
      <view class="modals-cancel" @tap="hideDeliveryFun" />
      <view class="bottom-dialog-box bottom-pos radius" :animation="animationData">
        <view class="discount-title radius">{{ i18n.chooseCom }}</view>
        <view class="distribution-prods">
          <view class="des">{{ i18n.deliveryTips }}</view>
          <view v-if="hasShopDeliveryList.length > 0" class="p-item">
            <view class="p-tit">{{ i18n.expressDelivery }}</view>
            <view class="p-con">
              <view class="prods-item">
                <view v-for="(item,index) in hasShopDeliveryList" :key="index" class="pic">
                  <ImgShow :src="item.pic" />
                  <view class="prod-count">x{{ item.prodCount }}</view>
                </view>
              </view>
              <view class="p-btn" @tap="toSubmitOrder(1)">{{ i18n.toSettle }}</view>
            </view>
            <view class="p-total">{{ i18n.inTotal }}
              <!-- <view class="num">{{hasShopDeliveryList.length}}</view>{{i18n.piece}}，{{i18n.total}}：<view class="price">￥{{totalSdPri}}</view> -->
              <view class="num">{{ hasShopDeliveryProdCount }}</view>
              {{ i18n.items }}
            </view>
          </view>
          <view v-if="hasCityDeliveryList.length > 0" class="p-item">
            <view class="p-tit">{{ i18n.sameDelivery }}</view>
            <view class="p-con">
              <view class="prods-item">
                <view v-for="(item,index) in hasCityDeliveryList" :key="index" class="pic">
                  <ImgShow :src="item.pic" />
                  <view class="prod-count">x{{ item.prodCount }}</view>
                </view>
              </view>
              <view class="p-btn" @tap="toSubmitOrder(4)">{{ i18n.toSettle }}</view>
            </view>
            <view class="p-total">{{ i18n.inTotal }}
              <!-- <view class="num">{{hasCityDeliveryList.length}}</view>{<view class="num">{{hasCityDeliveryList.length}}</view>{{i18n.piece}}，{{i18n.total}}：<view class="price">￥{{totalCdPri}}</view> -->
              <view class="num">{{ hasCityDeliveryProdCount }}</view>{{ i18n.items }}
            </view>
          </view>
          <view v-if="hasUserPickUpList.length > 0" class="p-item">
            <view class="p-tit">{{ i18n.pickStore }}</view>
            <view class="p-con">
              <view class="prods-item">
                <view v-for="(item,index) in hasUserPickUpList" :key="index" class="pic">
                  <ImgShow :src="item.pic" />
                  <view class="prod-count">x{{ item.prodCount }}</view>
                </view>
              </view>
              <view class="p-btn" @tap="toSubmitOrder(2)">{{ i18n.toSettle }}</view>
            </view>
            <view class="p-total">{{ i18n.inTotal }}
              <!-- <view class="num">{{hasUserPickUpList.length}}</view>{{i18n.piece}}，{{i18n.total}}：<view class="price">￥{{totalPuPri}}</view> -->
              <view class="num">{{ hasUserPickUpProdCount }}</view>{{ i18n.items }}
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- sku弹窗组件 -->
    <prod-sku-select
      v-if="showSkuPop && currentProdItem.skuList"
      :pic="currentProdItem.pic"
      :least-num="currentProdItem.leastNum"
      :sku-id="currentProdItem.skuId"
      :sku-name="currentProdItem.skuName"
      :activity-info="currentProdItem"
      :sku-list="currentProdItem.skuList"
      :is-main="Boolean(currentProdItem.comboId && currentProdItem.parentBasketId===0)"
      @setSku="handleSetSku"
      @closeSkuPop="handleCloseSkuPop"
    />
  </view>
</template>

<script>
import prodSkuSelect from '../../components/prod-sku-select/index.vue'
const http = require('../../utils/http.js')
const Big = require('../../utils/big.min.js')
import util from '../../utils/util.js'
import { throttle } from '../..//utils/throttle'

export default {

  components: {
    prodSkuSelect
  },
  props: {},
  data() {
    return {
      // 所有店铺的数据
      shopCarts: [],
      finalMoney: 0,
      totalMoney: 0,
      freightAmount: 0,
      subtractMoney: 0,
      allChecked: false,
      hideModal: true, // 模态框的状态  true-隐藏  false-显示
      hidePriModal: true, // 金额明细模态框的状态  true-隐藏  false-显示
      animationData: {},
      prodDiscounts: [],
      discountId: 0, // 促销活动id
      basketId: 0,
      currentDiscounts: [], // 促销活动列表
      reDraw: true,

      showDeliveryWay: false, // 选择配送方式弹窗
      hasCityDeliveryList: [], // 同城配送
      hasShopDeliveryList: [], // 店铺配送
      hasUserPickUpList: [], // 用户自提
      totalCdPri: 0, // 同城配送总额
      totalSdPri: 0, // 店铺配送总额
      totalPuPri: 0, // 用户自提总额
      hasShopDeliveryProdCount: 0, // 店铺配送商品总数
      hasCityDeliveryProdCount: 0, // 同城配送商品总数
      hasUserPickUpProdCount: 0, // 用户自提商品总数
      dvyType: 1, // 配送类型 1:快递 2:自提 3：无需快递 4:同城配送

      basketReqData: [], // 请求购物车的数据
      curLang: uni.getStorageSync('bbcLang'),

      // 切换sku弹窗显隐
      showSkuPop: false,
      // 当前操作的项商品
      currentProdItem: {},
      // 当前操作的项
      shopCartItem: {},
      // 选择的满减id
      switchDiscountId: '',
      prodListStyle: {}, // 页面样式
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
    util.transTabbar()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.prodListStyle = {}
    uni.setNavigationBarTitle({
      title: this.i18n.shoppingCart2
    })
    // #ifndef H5
    var logData = uni.getStorageSync('bbcFlowAnalysisLogDto')
    uni.setStorageSync('bbcStep', uni.getStorageSync('bbcStep') / 1 + 1)
    if (logData && logData.pageId != 8) {
      logData.pageId = 8
      logData.step = uni.getStorageSync('bbcStep')
      uni.setStorageSync('bbcFlowAnalysisLogDto', logData)
      http.saveLog(logData, 1)
    }
    // #endif
    this.showDeliveryWay = false
    if (!uni.getStorageSync('bbcToken')) {
      this.shopCarts = []
      this.isLoaded = true
      util.removeTabBadge()
    } else {
      // 加载购物车
      this.loadBasketData(null)
    }
  },
  onHide: function() {
    this.hidePriModal = true
    this.hideModal = true
  },
  methods: {

    /**
     * 加载购物车
     */
    loadBasketData() {
      this.isLoaded = false
      const params = {
        url: '/p/shopCart/info',
        method: 'POST',
        callBack: res => {
          this.isLoaded = true
          const { shopCarts } = res
          shopCarts.forEach((shopCart) => {
            shopCart.shopCartItemDiscounts.forEach((shopCartItemDiscount) => {
              if (shopCartItemDiscount.chooseComboItemDto !== null) {
                shopCartItemDiscount.deliveryModeVO = util.initComboDelivery(shopCartItemDiscount.shopCartItems)
              }
              shopCartItemDiscount.shopCartItems.forEach((shopCartItem) => {
                shopCartItem.checked = shopCartItem.isChecked
              })
            })
          })
          this.shopCarts = shopCarts
          this.finalMoney = res.finalMoney
          this.totalMoney = res.totalMoney
          this.freightAmount = res.freightAmount
          this.subtractMoney = res.subtractMoney
          // 检查全选状态
          this.checkAllSelected()
          // 重新计算购物车总数量
          http.getCartCount()

          // 清空请求数据
          this.basketReqData = []
        }
      }
      http.request(params)
    },

    /**
     * 结算(结算按钮)
     */
    toFirmOrder: function() {
      this.setData({
        hideModal: true,
        hidePriModal: true
      })
      var shopCarts = this.shopCarts
      var basketIds = []
      var selectShopId = []
      var hasCityDeliveryList = [] // 同城配送
      var hasShopDeliveryList = [] // 店铺配送
      var hasUserPickUpList = [] // 用户自提

      var hasShopDeliveryProdCount = 0 // 店铺配送商品总数
      var hasCityDeliveryProdCount = 0 // 同城配送商品总数
      var hasUserPickUpProdCount = 0 // 用户自提商品总数
      var totalCdPri = 0
      var totalSdPri = 0
      var totalPuPri = 0

      shopCarts.forEach(shopCart => {
        var shopCartItemDiscounts = shopCart.shopCartItemDiscounts
        shopCartItemDiscounts.forEach(shopCartItemDiscount => {
          shopCartItemDiscount.shopCartItems.forEach(shopCartItem => {
            if (shopCartItem.checked) {
              if (!selectShopId.includes(shopCart.shopId)) {
                selectShopId.push(shopCart.shopId)
              }
              // 已选择的购物车id
              basketIds.push(shopCartItem.basketId)
              // 将商品item放入对应数组中
              if ((!shopCartItem.comboId && shopCartItem.deliveryModeVO.hasCityDelivery) || (shopCartItem.comboId && shopCartItemDiscount.deliveryModeVO.hasCityDelivery)) {
                hasCityDeliveryList.push(shopCartItem) // 同城配送
                const x = new Big(totalCdPri)
                const y = new Big(shopCartItem.price)
                totalCdPri = x.plus(y).valueOf()
                hasCityDeliveryProdCount += shopCartItem.prodCount
                // totalCdPri += shopCartItem.price
              }
              if ((!shopCartItem.comboId && shopCartItem.deliveryModeVO.hasShopDelivery) || (shopCartItem.comboId && shopCartItemDiscount.deliveryModeVO.hasShopDelivery)) {
                hasShopDeliveryList.push(shopCartItem) // 店铺配送
                const x = new Big(totalSdPri)
                const y = new Big(shopCartItem.price)
                totalSdPri = x.plus(y).valueOf()
                hasShopDeliveryProdCount += shopCartItem.prodCount
                // totalSdPri += shopCartItem.price
              }
              if ((!shopCartItem.comboId && shopCartItem.deliveryModeVO.hasUserPickUp) || (shopCartItem.comboId && shopCartItemDiscount.deliveryModeVO.hasUserPickUp)) {
                hasUserPickUpList.push(shopCartItem) // 用户自提
                const x = new Big(totalPuPri)
                const y = new Big(shopCartItem.price)
                totalPuPri = x.plus(y).valueOf()
                hasUserPickUpProdCount += shopCartItem.prodCount
                // totalPuPri += shopCartItem.price
              }
            }
          })
        })
      })
      if (basketIds.length > 50) {
        uni.showModal({
          title: this.i18n.tips,
          content: this.i18n.basketSelectedCount + basketIds.length + this.i18n.basketCountOver,
          confirmText: this.i18n.confirm,
          showCancel: false
        })
        return
      }

      this.totalCdPri = totalCdPri
      this.totalSdPri = totalSdPri
      this.totalPuPri = totalPuPri

      this.hasShopDeliveryProdCount = hasShopDeliveryProdCount
      this.hasUserPickUpProdCount = hasUserPickUpProdCount
      this.hasCityDeliveryProdCount = hasCityDeliveryProdCount

      this.hasShopDeliveryList = hasShopDeliveryList
      this.hasCityDeliveryList = hasCityDeliveryList
      this.hasUserPickUpList = hasUserPickUpList
      if (!basketIds.length) {
        uni.showToast({
          title: this.i18n.selectProduct,
          icon: 'none'
        })
        return
      }
      uni.setStorageSync('bbcBasketIds', JSON.stringify(basketIds))
      if (basketIds.length > 1 && selectShopId.length == 1) {
        // 单个店铺，且勾选的商品中有不同的配送方式
        if ((hasUserPickUpProdCount && hasUserPickUpProdCount != hasShopDeliveryProdCount) || (hasCityDeliveryProdCount && hasCityDeliveryProdCount != hasShopDeliveryProdCount)) {
          var animation = wx.createAnimation({
            duration: 600,
            timingFunction: 'ease'
          })
          this.animation = animation
          this.showDeliveryWay = true // 底部选择配送方式弹窗
          this.stopPageScroll(1)
          setTimeout(() => {
            this.fadeIn()
          }, 200)
        } else {
          uni.navigateTo({
            url: '/pages/submit-order/submit-order?orderEntry=0' + '&dvyType=1' // dvyType 配送类型 1:快递 2:自提 3：无需快递 4:同城配送
          })
        }
      } else {
        uni.navigateTo({
          url: '/pages/submit-order/submit-order?orderEntry=0' + '&dvyType=1' // dvyType 配送类型 1:快递 2:自提 3：无需快递 4:同城配送
        })
      }
    },

    // 页面禁止滚动 1启动；0停止
    stopPageScroll(type = 0) {
      if (type === 0) {
        let scorllVal = 0
        // #ifdef H5
        scorllVal = Math.abs(parseFloat(document.getElementById('prod-list').style.top))
        // #endif
        // #ifdef MP-WEIXIN
        const query = wx.createSelectorQuery()
        query.select('.prod-list').boundingClientRect((rect) => {
          scorllVal = rect.top
        }).exec()
        // #endif
        // #ifdef APP-PLUS
        // #endif
        this.prodListStyle = {}
        this.$nextTick(() => {
          uni.pageScrollTo({
            duration: 0,
            scrollTop: scorllVal
          })
        })
      } else {
        let scorllTop = 0
        // #ifdef H5
        scorllTop = document.documentElement.scrollTop || document.body.scrollTop
        // #endif
        // #ifdef MP-WEIXIN
        const query = wx.createSelectorQuery()
        query.select('.prod-list').boundingClientRect((rect) => {
          scorllTop = rect.top
        }).exec()
        // #endif
        // #ifdef APP-PLUS
        // #endif
        this.prodListStyle = {
          width: '100%',
          position: 'fixed',
          top: '-' + scorllTop + 'px',
          overflow: 'hidden'
        }
      }
    },

    /**
     * 单个店铺去结算
     */
    toSubmitOrder: function(dvyType) {
      util.tapLog()
      const basketIds = []
      if (dvyType == 1) { // 快递
        this.hasShopDeliveryList.forEach((el) => {
          basketIds.push(el.basketId)
        })
      } else if (dvyType == 4) { // 同城
        this.hasCityDeliveryList.forEach((el) => {
          basketIds.push(el.basketId)
        })
      } else if (dvyType == 2) { // 自提
        this.hasUserPickUpList.forEach((el) => {
          basketIds.push(el.basketId)
        })
      }
      uni.setStorageSync('bbcBasketIds', JSON.stringify(basketIds))
      uni.navigateTo({
        url: '/pages/submit-order/submit-order?orderEntry=0' + '&dvyType=' + dvyType
      })
    },

    /**
     * 关闭配送方式选择弹窗
     */
    hideDeliveryFun() {
      this.stopPageScroll(0)
      util.tapLog()
      var that = this
      var animation = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease'
      })
      this.animation = animation
      that.fadeDown()
      setTimeout(function() {
        that.setData({
          showDeliveryWay: false
        })
      }, 680)
    },

    /**
     * 每一项的选择事件
     */
    handleCheckProdItem(shopIndex, shopCartItemIndex, prodIndex) {
      const shopCarts = this.shopCarts
      const shopCartItemDiscounts = shopCarts[shopIndex].shopCartItemDiscounts // 获取购物车列表
      const prod = shopCartItemDiscounts[shopCartItemIndex].shopCartItems[prodIndex]
      util.tapLog()
      // 如果勾选的是套餐商品，需要变更该套餐下搭配商品的勾选状态
      if (prod.comboId) {
        shopCartItemDiscounts[shopCartItemIndex].shopCartItems.forEach(el => {
          this.basketReqData.push({
            basketId: el.basketId,
            isChecked: !prod.isChecked ? 1 : 0
          })
        })
      } else {
        this.basketReqData.push({
          basketId: prod.basketId,
          isChecked: !prod.isChecked ? 1 : 0
        })
      }
      this.handleShopCartSelect()
    },

    /**
     * 店铺 勾选/取选 事件
     */
    handleCheckShop(shopIndex) {
      util.tapLog()
      const shopCarts = this.shopCarts
      const checked = shopCarts[shopIndex].checked // 获取当前店铺的选中状态
      shopCarts[shopIndex].checked = !checked // 改变状态
      shopCarts[shopIndex].shopCartItemDiscounts.forEach(shopCartItem => {
        var cItems = shopCartItem.shopCartItems
        for (var j = 0; j < cItems.length; j++) {
          this.basketReqData.push({
            basketId: cItems[j].basketId, isChecked: !checked ? 1 : 0
          })
        }
      })
      this.handleShopCartSelect()
    },

    /**
     * 全选
     */
    handleCheckAll() {
      util.tapLog()
      var allChecked = this.allChecked
      allChecked = !allChecked // 改变状态
      var shopCarts = this.shopCarts
      shopCarts.forEach(shopCart => {
        shopCart.checked = allChecked
        var shopCartItemDiscounts = shopCart.shopCartItemDiscounts
        for (var i = 0; i < shopCartItemDiscounts.length; i++) {
          var cItems = shopCartItemDiscounts[i].shopCartItems
          for (var j = 0; j < cItems.length; j++) {
            cItems[j].checked = allChecked
            this.basketReqData.push({ basketId: cItems[j].basketId, isChecked: allChecked ? 1 : 0 })
          }
        }
      })
      this.handleShopCartSelect()
    },

    /**
     * 购物车 勾选/取选 事件
     */
    handleShopCartSelect() {
      const params = {
        url: '/p/shopCart/checkItems',
        method: 'POST',
        data: this.basketReqData,
        callBack: () => {
          this.loadBasketData()
        }
      }
      http.request(params)
    },

    /**
     * 检查全选状态
     */
    checkAllSelected() {
      var allChecked = true
      var shopCarts = this.shopCarts
      var flag = false
      shopCarts.forEach(shopCart => {
        var shopChecked = true
        var shopCartItemDiscounts = shopCart.shopCartItemDiscounts
        for (var i = 0; i < shopCartItemDiscounts.length; i++) {
          var cItems = shopCartItemDiscounts[i].shopCartItems
          for (var j = 0; j < cItems.length; j++) {
            if (!cItems[j].isChecked) {
              shopChecked = false
              allChecked = false
              flag = true
            }
            cItems[j].isChecked = !!cItems[j].isChecked
          }
          if (flag) {
            break
          }
        }
        shopCart.checked = shopChecked
      })
      this.allChecked = allChecked
      this.shopCarts = shopCarts
    },

    /**
     * 设置sku
     */
    handleSetSku(sku) {
      const currentProdItem = this.currentProdItem
      this.updateBasket(currentProdItem.shopId, currentProdItem, currentProdItem.prodCount, sku)
    },

    /**
     * 修改 购物车数量、sku、满减活动
     * @param {Number} shopId 店铺
     * @param {Object} prod 修改的商品项
     * @param {Number} count 商品数量增量
     * @param {Object} sku 修改的sku
     */
    updateBasket: throttle(function(shopId, prod, count, sku = null, packageNum = null) {
      // 商品数量为1 且点击 -1
      if (count === -1 && prod.prodCount === 1) {
        return
      }
      if (count === -1 && packageNum === 1) {
        return
      }
      if (sku && prod.skuId === sku.skuId) {
        this.showSkuPop = false
        return
      }
      this.currentProdItem = prod
      const matchingSkuIds = []
      if (prod.comboId) {
        const shopCarts = this.shopCarts
        const shopIndex = shopCarts.findIndex(el => el.shopId === shopId)
        const shopCartItemDiscounts = shopCarts[shopIndex].shopCartItemDiscounts
        const shopCartItemIndex = shopCartItemDiscounts.findIndex(el => el.chooseComboItemDto?.comboId === prod.comboId && prod.basketId === el.chooseComboItemDto.mainProdBasketId)
        if (!prod.parentBasketId) {
          shopCartItemDiscounts[shopCartItemIndex].shopCartItems.forEach(el => {
            if (el.parentBasketId === prod.basketId) {
              matchingSkuIds.push(el.skuId)
            }
          })
        }
      }

      if (sku && this.shopCartItem.chooseComboItemDto && this.shopCartItem.chooseComboItemDto.comboId) {
        count = this.shopCartItem.chooseComboItemDto.comboCount
      } else if (sku) {
        count = prod.prodCount
      }
      const updateBasketParam = {
        basketId: prod.basketId,
        comboId: prod.comboId || undefined,
        discountId: this.switchDiscountId || prod.discountId,
        count: count,
        oldSkuId: sku ? prod.skuId : undefined,
        matchingSkuIds: prod.comboId ? matchingSkuIds : undefined,
        prodId: prod.prodId,
        shopId: shopId,
        skuId: sku ? sku.skuId : prod.skuId
      }
      const params = {
        url: '/p/shopCart/changeItem',
        method: 'POST',
        data: updateBasketParam,
        callBack: () => {
          this.loadBasketData()
          if (updateBasketParam.count && updateBasketParam.count >= 1) {
            const flowAnalysisLogDto = uni.getStorageSync('bbcFlowAnalysisLogDto')
            flowAnalysisLogDto.bizData = updateBasketParam.prodId
            flowAnalysisLogDto.bizType = 0
            uni.setStorageSync('bbcFlowAnalysisLogDto', flowAnalysisLogDto)
            util.tapLog(4, '', '', updateBasketParam.count)
          }
          this.showSkuPop = false
          this.switchDiscountId = ''
        }
      }
      http.request(params)
    }, 200),

    /**
     * 删除购物车商品
     */
    handleDeletProd() {
      var shopCarts = this.shopCarts
      var basketIds = []
      shopCarts.forEach(shopCart => {
        var shopCartItemDiscounts = shopCart.shopCartItemDiscounts
        for (var i = 0; i < shopCartItemDiscounts.length; i++) {
          var cItems = shopCartItemDiscounts[i].shopCartItems
          for (var j = 0; j < cItems.length; j++) {
            if (cItems[j].checked) {
              basketIds.push(cItems[j].basketId)
            }
          }
        }
      })
      if (basketIds.length == 0) {
        uni.showToast({
          title: this.i18n.selectProduct,
          icon: 'none'
        })
      } else {
        this.showPriDet()
        this.hideModalFun()
        this.hidePriModal = true
        uni.showModal({
          title: '',
          content: this.i18n.deleteProductTips,
          cancelText: this.i18n.cancel,
          confirmText: this.i18n.confirm,
          confirmColor: '#eb2444',
          success: (res) => {
            if (res.confirm) {
              const params = {
                url: '/p/shopCart/deleteItem',
                method: 'PUT',
                data: basketIds,
                callBack: res2 => {
                  this.basketReqData = []
                  this.loadBasketData()
                }
              }
              http.request(params)
            }
          }
        })
      }
    },

    /**
     * 点击满减活动 弹窗
     * @param {Object} prod 当前操作的商品
     */
    onChooseDiscount(prod) {
      this.currentProdItem = prod
      util.tapLog()
      this.reDraw = false
      this.discountId = prod.discountId
      this.prodDiscounts = prod.discounts
      this.hideModal = false
      this.hidePriModal = true
      var animation = wx.createAnimation({
        duration: 600,
        timingFunction: 'ease'
      })
      this.animation = animation
      this.reDraw = true
      setTimeout(() => {
        this.fadeIn()
      }, 200)
    },

    /**
     * 修改满减活动
     */
    radioChange(e) {
      util.tapLog()
      this.switchDiscountId = +e.detail.value
      const currentProdItem = this.currentProdItem
      this.updateBasket(currentProdItem.shopId, currentProdItem, 0)
      this.fadeDown()
      setTimeout(() => {
        this.setData({
          hideModal: true
        })
      }, 500)
      this.reDraw = false
    },

    /**
     * 根据商品id获取skuList
     * @param {Object} prod 当前要修改的选项
     */
    getSkuListByProdId(prod, shopCartItem) {
      const comboList = []
      if (prod.comboId) {
        const shopCarts = this.shopCarts
        const shopIndex = shopCarts.findIndex(el => el.shopId === prod.shopId)
        const shopCartItemDiscounts = shopCarts[shopIndex].shopCartItemDiscounts
        const shopCartItemIndex = shopCartItemDiscounts.findIndex(el => el.chooseComboItemDto.comboId === prod.comboId)
        shopCartItemDiscounts[shopCartItemIndex].shopCartItems.forEach(el => {
          comboList.push({
            basketId: el.basketId,
            skuId: el.skuId,
            prodId: el.prodId
          })
        })
        prod.comboList = comboList
      }
      this.currentProdItem = prod
      this.shopCartItem = shopCartItem
      const params = {
        url: prod.comboId ? '/combo/skuList' : '/prod/skuList',
        method: 'GET',
        data: {
          comboId: prod.comboId,
          prodId: prod.prodId
        },
        callBack: res => {
          this.currentProdItem.skuList = res
          this.showSkuPop = true
        },
        errCallBack: errMsg => {
          console.log(errMsg)
        }
      }
      http.request(params)
    },

    /**
			 * 隐藏sku弹窗
			 */
    handleCloseSkuPop() {
      this.showSkuPop = false
    },

    // 隐藏底部活动选择遮罩层
    hideModalFun() {
      util.tapLog()
      this.reDraw = false
      var animation = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease'
      })
      this.animation = animation
      this.fadeDown()
      setTimeout(() => {
        this.setData({
          hideModal: true,
          hidePriModal: true
        })
      }, 720)
    },
    // 动画集
    fadeIn: function() {
      this.animation.translateY(0).step()
      this.setData({
        animationData: this.animation.export() // 动画实例的export方法导出动画数据传递给组件的animation属性

      })
    },
    fadeDown: function() {
      this.animation.translateY(300).step()
      this.setData({
        animationData: this.animation.export()
      })
    },

    /**
			 * 跳转到商品详情
			 */
    toProdPage(prodId) {
      util.tapLog()
      this.$Router.push({
        path: '/pages/prod/prod',
        query: {
          prodId: prodId
        }
      })
    },

    /**
			 * 金额明细弹窗
			 */
    showPriDet() {
      util.tapLog()
      if (this.hidePriModal == true) {
        this.setData({
          hidePriModal: false,
          hideModal: true
        })
        var animation = wx.createAnimation({
          duration: 500,
          timingFunction: 'ease'
        })
        this.animation = animation
        setTimeout(() => {
          this.fadeIn()
        }, 100)
      } else if (this.hidePriModal == false) {
        this.hidePriModalFun()
      }
    },

    hidePriModalFun() {
      util.tapLog()
      var animation = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease'
      })
      this.animation = animation
      this.fadeDown()
      setTimeout(() => {
        this.setData({
          hidePriModal: true,
          hideModal: true
        })
      }, 680)
    },

    /**
			 * 满减信息处理
			 */
    parseDiscountMsg(discountRule, needAmount, discount, lang) {
      if (discountRule == 0) {
        return lang == 'zh_CN' ? '购满' + needAmount + '元减' + discount + '元' : 'Over ' + needAmount + ' minus ' + discount
      } else if (discountRule == 1) {
        return lang == 'zh_CN' ? '购满' + needAmount + '件减' + discount + '元' : discount + ' less for ' + needAmount + ' pieces'
      } else if (discountRule == 2) {
        return lang == 'zh_CN' ? '购满' + needAmount + '元打' + discount + '折' : discount + '% off over ' + needAmount
      } else if (discountRule == 3) {
        return lang == 'zh_CN' ? '购满' + needAmount + '件打' + discount + '折' : discount + '% off over ' + needAmount + ' pieces'
      } else {
        return ''
      }
    },

    /**
     * 获取满减活动名称
     */
    getCurrDiscountName(discountId, discounts, lang) {
      for (var i = 0; i < discounts.length; i++) {
        if (discounts[i].discountId == discountId) {
          return discounts[i].discountName
        }
      }
      return lang == 'zh_CN' ? '不参与促销' : 'Not participating in promotion'
    },

    /**
     * 去到店铺首页
     */
    toShopIndex(shopId) {
      const params = {
        url: '/shop/headInfo',
        method: 'GET',
        data: {
          shopId
        },
        callBack: (res) => {
          let url = '/package-shop/pages/shop-page/shop-page?shopId=' + shopId
          if (res.renovationId) {
            url = '/package-shop/pages/feature-index/feature-index0?shopId=' + shopId +	'&renovationId=' + res.renovationId
          }
          uni.navigateTo({
            url
          })
        }
      }
      http.request(params)
    },
    /**
     * 图片加载失败时显示默认图片
     */
    handlePicError(prod) {
      this.$set(prod, 'isPicError', true)
    }
  }
}
</script>
<style>
	@import "./basket.css";
</style>
