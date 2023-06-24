<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view v-if="loaded" class="Mall4j combo-detail">
    <view class="main-prod">
      <view class="combo-prod-item">
        <view class="prod-info">
          <view class="info-row">
            <view class="btn">
              <label>
                <checkbox
                  :checked="mainProd.type===1 || mainProd.checked"
                  :disabled="mainProd.type===1"
                  :color="mainProd.type===1 ? '#E89F9B' : '#F81A1A'"
                />
              </label>
            </view>
            <view class="pic">
              <ImgShow :src="mainProd.defaultSku.pic || mainProd.pic" imgMode="aspectFit" />
            </view>
            <view class="opt">
              <view class="prod-name">{{ mainProd.prodName }}</view>
              <view class="prod-sku-con">
                <text :class="['prod-sku-text', mainProd.defaultSku.skuName ? 'arrow' : '' ]" @tap.stop="handleShowSkuPop(mainProd)">{{ mainProd.defaultSku.skuName || '' }}</text>
              </view>
              <view class="price-count">
                <view class="price">
                  <text class="symbol">￥</text>
                  <text class="big-num">{{ parsePrice(mainProd.defaultSku.matchingPrice)[0] }}</text>
                  <text class="small-num">.{{ parsePrice(mainProd.defaultSku.matchingPrice)[1] }}</text>
                </view>
                <!-- 套装内的商品的数量 -->
                <view class="combo-count"> x {{ mainProd.leastNum * comboNum }}</view>
              </view>
            </view>
          </view>
          <!-- 赠品展示 -->
          <!-- <view v-if="prod.giveaway" class="gift-con">
            <view v-for="(giveawayItem, giveawayIndex) in prod.giveaway.giveawayProds" class="gift-item" @tap.stop="toProdPage(giveawayItem.prodId)">
              <view class="gift-name">【赠品】{{ giveawayItem.prodName }}</view>
              <view class="gift-count">x {{ giveawayItem.giveawayNum }} </view>
            </view>
          </view> -->
        </view>
      </view>
    </view>

    <view class="match-prod-con">
      <view v-for="(matchingProd, matchingProdIndex) in comboInfo.matchingProds" :key="matchingProdIndex" class="combo-prod-item">
        <view class="prod-info">
          <view class="info-row">
            <view class="btn">
              <label>
                <checkbox
                  :value="toString(matchingProd.prodId)"
                  :checked="matchingProd.checked || matchingProd.required===1"
                  :disabled="matchingProd.required===1"
                  :color="matchingProd.type===1 ? '#E89F9B' : '#F81A1A'"
                  @tap.stop="handleCheckProdItem(matchingProd, matchingProdIndex)"
                />
              </label>
            </view>
            <view v-if="matchingProd" class="pic">
              <ImgShow :src="matchingProd.defaultSku.pic || matchingProd.pic" imgMode="aspectFit" />
            </view>
            <view class="opt">
              <view class="prod-name">{{ matchingProd.prodName }}</view>
              <view class="prod-sku-con">
                <text :class="['prod-sku-text', matchingProd.defaultSku.skuName ? 'arrow' : '' ]" @tap.stop="handleShowSkuPop(matchingProd)">{{ matchingProd.defaultSku.skuName || '' }}</text>
              </view>
              <view class="price-count">
                <view class="price">
                  <text class="symbol">￥</text>
                  <text class="big-num">{{ parsePrice(matchingProd.defaultSku.matchingPrice)[0] }}</text>
                  <text class="small-num">.{{ parsePrice(matchingProd.defaultSku.matchingPrice)[1] }}</text>
                </view>
                <!-- 套装内的商品的数量 -->
                <view class="combo-count"> x {{ matchingProd.leastNum * comboNum }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="combo-footer">
      <view class="combo-price-reduce">
        <view class="combo-price">
          <text class="combo-price-title">{{ i18n.packagePrice }}: </text>
          <text class="price" decode="true">￥
            <text class="big">{{ parsePrice(comboAmountInfo.matchingPrice)[0] }}.</text>
            {{ parsePrice(comboAmountInfo.matchingPrice)[1] }}
          </text>
        </view>
        <view v-if="comboAmountInfo.reduceAmount > 0" class="combo-reduce">
          {{ i18n.savesYou }}: ￥{{ parsePrice(comboAmountInfo.reduceAmount)[0] }}.{{ parsePrice(comboAmountInfo.reduceAmount)[1] }}
        </view>
      </view>
      <view class="btn-con">
        <view class="btn add-cart" @tap="handleShowComboInfo(0)">{{ i18n.addShoppingCart }}</view>
        <view class="btn buy-now" @tap="handleShowComboInfo(1)">{{ i18n.buyNow }}</view>
      </view>
    </view>

    <!-- 套餐整体信息弹窗 -->
    <view v-if="showComboInfo" class="pup-sku">
      <view class="pup-sku-main">
        <view class="pup-sku-header">
          <view class="close" @tap="handleHideComboInfo" />
        </view>
        <view class="pup-sku-body">
          <!-- 商品 -->
          <scroll-view class="combo-prod-list" scroll-x :show-scrollbar="false">
            <view v-if="mainProd" class="pup-combo-item">
              <view class="pup-combo-pic">
                <ImgShow :src="mainProd.defaultSku.pic || mainProd.pic" imgMode="aspectFit" />
              </view>
              <view class="pup-combo-name">{{ mainProd.prodName }}</view>
              <view class="pup-combo-sku" @tap.stop="handleShowSkuPop(mainProd)">
                <view class="pup-combo-sku-text">{{ mainProd.defaultSku.skuName }}</view>
              </view>
            </view>
            <block v-for="(prodItem, prodIndex) in matchingProdsList" :key="prodIndex">
              <view v-if="prodItem.checked" class="pup-combo-item">
                <ImgShow :src="prodItem.defaultSku.pic || prodItem.pic" :classList="['pup-combo-pic']" imgMode="aspectFit" />
                <view class="pup-combo-name">{{ prodItem.prodName }}</view>
                <view class="pup-combo-sku" @tap.stop="handleShowSkuPop(prodItem)">
                  <view class="pup-combo-sku-text">{{ prodItem.defaultSku.skuName || '' }}</view>
                </view>
              </view>
            </block>
          </scroll-view>
          <!-- 数量 -->
          <view class="pup-sku-count">
            <view class="num-wrap">
              <view class="minus" @tap="onCountMinus">
                <text class="row" />
              </view>
              <view class="text-wrap">
                <input v-model="comboNum" type="number"></input>
              </view>
              <view class="plus" @tap="onCountPlus">
                <text class="row" />
                <text class="col" />
              </view>
            </view>
            <view class="count-name">{{ i18n.numberOfPackages }}</view>
          </view>
        </view>
        <view class="pup-sku-footer">
          <view class="btn buy" @tap="handleComboInfoPopComfirm">{{ i18n.confirm }}</view>
        </view>
      </view>
    </view>

    <!-- 套餐sku弹窗 -->
    <prod-sku-select
      v-if="showSkuPop && currentProdItem"
      :pic="currentProdItem.pic"
      :least-num="currentProdItem.leastNum"
      :sku-id="currentProdItem.defaultSku.skuId"
      :sku-name="currentProdItem.defaultSku.skuName"
      :activity-info="currentProdItem"
      :sku-list="currentProdItem.skuList"
      :is-main="currentProdItem.type===1"
      @setSku="handleSetSku"
      @closeSkuPop="handleCloseSkuPop"
    />
  </view>
</template>

<script>
import prodSkuSelect from '../../../components/prod-sku-select/index.vue'
import util from '../../../utils/util'
import http from '../../../utils/http'
const Big = require('../../../utils/big.min.js')

export default {
  components: { prodSkuSelect },
  data() {
    return {
      loaded: false,
      shopId: 0,
      // 套装的数量
      comboNum: 1,
      // sku弹窗显隐
      showSkuPop: false,
      // 套装信息
      comboInfo: {},
      // 套装主商品
      mainProd: {},

      // 套装商品列表
      matchingProdsList: [],

      // 当前操作的商品项
      currentProdItem: {},
      // 请求套餐价格的数据
      comboAmountParam: {},
      // 套餐的价格信息
      comboAmountInfo: {},
      // 套餐整体信息弹窗显隐
      showComboInfo: false,
      // 套餐购买方式: 0加入购物车 1立即购买
      comboBuyType: 0
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  onLoad(options) {
    this.shopId = options.shopId
    this.comboId = options.comboId
    this.getComboDetailById()
  },
  onShow() {
    uni.setNavigationBarTitle({
      title: this.i18n.discountPackage
    })
  },
  methods: {
    /**
     * 获取套餐详情
     */
    getComboDetailById() {
      const params = {
        url: '/combo/getComboByComboId',
        data: {
          comboId: this.comboId
        },
        method: 'GET',
        callBack: res => {
          this.comboInfo = res
          res.mainProd.defaultSku = this.setDefaulProdSku(res.mainProd.skuList, res.mainProd.comboPrice)
          this.mainProd = res.mainProd
          res.matchingProds.forEach(matchingPordItem => {
            matchingPordItem.checked = matchingPordItem.required === 1
            matchingPordItem.defaultSku = this.setDefaulProdSku(matchingPordItem.skuList, matchingPordItem.comboPrice)
          })
          this.matchingProdsList = res.matchingProds
          this.loaded = true
          this.setComboParam()
        },
        errCallBack: err => {
          if (err.code === 'A00001') {
            uni.showToast({
              title: err.msg,
              icon: 'none'
            })
            setTimeout(() => {
              uni.navigateBack()
            }, 1500)
          }
        }
      }
      http.request(params)
    },

    /**
     * 初始化商品的默认sku
     */
    setDefaulProdSku(skuList, comboPrice, isMainProd) {
      if (isMainProd) {
        for (let i = 0; i < skuList.length; i++) {
          if (skuList[i].matchingPrice === comboPrice) {
            return skuList[i]
          }
        }
      } else {
        let defaultSku = null
        let flag = false
        for (let i = 0; i < skuList.length; i++) {
          if (comboPrice === skuList[i].matchingPrice && skuList[i].stocks) {
            defaultSku = skuList[i]
            flag = true
            break
          }
        }
        if (!flag && skuList.length) {
          defaultSku = skuList[0]
        }
        return defaultSku
      }
    },

    /**
     * 修改后重设商品的sku
     */
    handleSetSku(sku, isMain) {
      if (isMain) {
        this.mainProd.defaultSku = sku
        this.$forceUpdate()
      } else {
        const matchingProds = this.matchingProdsList
        for (let i = 0; i < matchingProds.length; i++) {
          if (matchingProds[i].comboProdId === sku.comboProdId) {
            matchingProds[i].defaultSku = sku
            this.$forceUpdate()
            break
          }
        }
      }
      this.handleCloseSkuPop()
      this.setComboParam()
    },

    /**
     * 勾选/取选套装的商品
     */
    handleCheckProdItem(matchingProd, matchingProdIndex) {
      if (matchingProd.required) return
      const checked = matchingProd.checked
      const matchingProdsList = this.matchingProdsList
      matchingProdsList[matchingProdIndex].checked = !checked
      this.setComboParam()
    },

    /**
     * 生成请求套餐金额的参数
     */
    setComboParam() {
      const matchingSkuIds = []
      this.matchingProdsList.forEach(matchingProd => {
        if (matchingProd.checked) {
          matchingSkuIds.push(matchingProd.defaultSku.skuId)
        }
      })

      const comboAmountParam = {
        comboId: this.comboId,
        comboNum: this.comboNum,
        matchingSkuIds,
        prodId: this.mainProd.prodId,
        skuId: this.mainProd.defaultSku.skuId
      }
      this.comboAmountParam = comboAmountParam
      this.getComboAmount(comboAmountParam)
    },

    /**
     * 展示套装信息弹窗
     * @param {Number} openType: 0加入购物车  1立即购买
     */
    handleShowComboInfo(openType) {
      this.showComboInfo = true
      this.comboBuyType = openType
    },

    /**
     * 关闭套装信息弹窗
     */
    handleHideComboInfo() {
      this.showComboInfo = false
    },

    /**
     * 减数量
     */
    onCountMinus() {
      util.tapLog(3)
      const comboNum = this.comboNum
      if (comboNum > 1) {
        this.comboNum = this.comboNum - 1
      }
      this.setComboParam()
    },

    /**
     * 加数量
     */
    onCountPlus() {
      const comboNum = Number(this.comboNum)
      // 最小库存的商品
      if (comboNum < this.getMinStocksProd().defaultSku.stocks) {
        this.comboNum = comboNum + 1
      } else {
        uni.showToast({
          title: this.getMinStocksProd().prodName + this.i18n.insufficientStock,
          icon: 'none',
          duration: 1000
        })
      }
      this.setComboParam()
    },

    /**
     * 最小库存的商品
     */
    getMinStocksProd() {
      const matchingProdsList = this.matchingProdsList.filter(el => el.checked)
      // 套餐内是否只有一个主商品
      const isOnlyMain = !matchingProdsList.length
      let minStocksProd = {}
      if (isOnlyMain) {
        minStocksProd = this.mainProd
      } else {
        minStocksProd = matchingProdsList[0]
        matchingProdsList.forEach(el => {
          if (el.defaultSku.stocks < minStocksProd.defaultSku.stocks) {
            minStocksProd = el
          }
        })
      }
      if (!isOnlyMain && this.mainProd.defaultSku.stocks < minStocksProd.defaultSku.stocks) {
        minStocksProd = this.mainProd
      }
      return minStocksProd
    },

    /**
     * 套装信息弹窗确认按钮
     */
    handleComboInfoPopComfirm() {
      if (this.comboNum < 1) {
        uni.showToast({
          title: this.i18n.leastTips,
          icon: 'none'
        })
        this.comboNum = 1
        return
      }
      if (this.comboBuyType) {
        // console.log('立即购买');
        util.checkAuthInfo(this.buyNow)
      } else {
        // console.log('加入购物车');
        util.checkAuthInfo(this.addToCart)
      }
    },

    /**
     * 加入购物车
     */
    addToCart() {
      const paramData = {
        ...this.comboAmountParam,
        basketId: 0,
        shopId: this.shopId,
        count: this.comboNum
      }
      const params = {
        url: '/p/shopCart/changeItem',
        method: 'POST',
        data: paramData,
        callBack: res => {
          uni.showToast({
            title: this.i18n.successfullyAddedCart,
            icon: 'none'
          })
          this.handleHideComboInfo()
          uni.switchTab({
            url: '/pages/basket/basket'
          })
        },
        errCallBack: errMsg => {
          uni.showToast({
            title: errMsg.data || errMsg.msg,
            icon: 'none'
          })
          this.handleHideComboInfo()
        }
      }
      http.request(params)
    },

    /**
     * 立即购买
     */
    buyNow() {
      // 最小库存的商品
      if (Number(this.comboNum) <= this.getMinStocksProd().defaultSku.stocks) {
        const paramData = {
          ...this.comboAmountParam,
          basketId: 0,
          shopId: this.shopId,
          prodCount: this.comboNum
        }
        uni.setStorageSync('bbcOrderItem', Object.assign({}, paramData))
        uni.redirectTo({
          url: '/package-prod/pages/submit-order/submit-order?orderEntry=1&mold=' + ''
        })
      } else {
        uni.showToast({
          title: this.getMinStocksProd().prodName + this.i18n.insufficientStock,
          icon: 'none',
          duration: 1000
        })
      }
    },

    /**
     * 计算套餐金额
     */
    getComboAmount() {
      const comboAmountInfo = {
        matchingPrice: 0,
        price: 0,
        reduceAmount: 0
      }
      // 套餐总金额
      let comboTotal = new Big(0)
      // 套餐优惠总金额
      let comboReduceTotal = new Big(0)
      for (let i = 0; i < this.matchingProdsList.length; i++) {
        const matchingProdItem = this.matchingProdsList[i]
        if (matchingProdItem.checked) {
          comboTotal = comboTotal.plus(this.getTotalOrReduce(matchingProdItem, 'total'))
          comboReduceTotal = comboReduceTotal.plus(this.getTotalOrReduce(matchingProdItem, 'reduce'))
        }
      }
      comboTotal = comboTotal.plus(this.getTotalOrReduce(this.mainProd, 'total'))
      comboReduceTotal = comboReduceTotal.plus(this.getTotalOrReduce(this.mainProd, 'reduce'))

      comboAmountInfo.matchingPrice = Number(comboTotal.valueOf())
      comboAmountInfo.reduceAmount = Number(comboReduceTotal.valueOf())
      this.comboAmountInfo = comboAmountInfo
    },

    getTotalOrReduce(item, type) {
      if (type === 'total') {
        return new Big(item.defaultSku.matchingPrice).times(item.leastNum)
      } else {
        return (new Big(item.defaultSku.price).minus(new Big(item.defaultSku.matchingPrice))).times(item.leastNum).valueOf()
      }
    },

    /**
     * 显示sku弹窗
     */
    handleShowSkuPop(item) {
      this.currentProdItem = item
      this.showSkuPop = true
    },

    /**
     * 隐藏sku弹窗
     */
    handleCloseSkuPop() {
      this.showSkuPop = false
    }

  }
}
</script>

<style>
 @import './discount-package-detail.css';
</style>
