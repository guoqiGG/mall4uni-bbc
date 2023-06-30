<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j sku-selected-con">
    <!-- 已选规格 -->
    <view v-if="pageType" class="sku" @tap="showSku">
      <view class="sku-tit">{{ i18n.selected }}</view>
      <view class="sku-con">
        <block v-for="(skuItem,index) in selectedPropShowList" :key="index">
          <text decode="true">{{ index < selectedPropShowList.length-1 ? skuItem +'，' : skuItem + '&nbsp; &nbsp;' }}</text>
        </block>
        <text>{{ prodNum }}{{ i18n.piece }}</text>
      </view>
      <view class="more">...</view>
    </view>
    <!-- 已选规格end -->

    <!-- 规格弹窗 -->
    <view v-if="skuShow || (!skuShow && !pageType)" class="pup-sku" @tap="closePopup">
      <view class="pup-sku-main" @tap.stop>
        <view class="pup-sku-header">
          <view class="close" @tap="closePopup" />
          <view class="pup-sku-img">
            <image v-if="setPicURL(defaultSku.pic, pic) && !isPicError" :src="setPicURL(defaultSku.pic, pic)" mode="aspectFit" @error="handlePicError" />
            <image v-else src="/static/images/icon/def.png" mode="aspectFit" />
          </view>
          <view class="pup-sku-prod">
            <!-- 秒杀商品价格 -->
            <view v-if="findSku && prodType === 2 && activityInfo.activityStatus === 2" class="pup-sku-price">￥
              <text class="pup-sku-price-int">{{ parsePrice(defaultSku.seckillPrice)[0] }}</text>
              .{{ parsePrice(defaultSku.seckillPrice)[1] }}
            </view>
            <!-- 商品价格 -->
            <view
              v-if="findSku && skuShowType === 0 && prodType === 0 || prodType === 3 || (prodType === 1 && skuShowType === 0 ) || (prodType === 2 && activityInfo.activityStatus === 1 || activityInfo.activityStatus === undefined)"
              class="pup-sku-price"
            >
              <block v-if="prodType!==3 || defaultSku.matchingPrice || defaultSku.price">
                <text v-if="defaultSku.matchingPrice || defaultSku.price" class="pup-sku-price-int">￥{{ parsePrice(defaultSku.matchingPrice || defaultSku.price)[0] }}</text>
                <text v-else-if="findSku" class="pup-sku-price-int">￥0</text>
                <text v-if="defaultSku.matchingPrice || defaultSku.price">.{{ parsePrice(defaultSku.matchingPrice || defaultSku.price)[1] }}</text>
                <text v-else-if="findSku">.00</text>
              </block>
              <text v-if="(defaultSku.matchingPrice || defaultSku.price) && defaultSku.skuScore">+</text>
              <text v-if="defaultSku.skuScore && prodType===3" class="pup-sku-price-int">{{ defaultSku.skuScore }}{{ i18n.integral }}</text>
            </view>
            <!-- 拼团商品价格 -->
            <view v-if="prodType === 1 && findSku && skuShowType === 1" class="pup-sku-price">￥
              <text class="pup-sku-price-int">{{ parsePrice(defaultGroupSku.actPrice || defaultSku.actPrice)[0] }}</text>
              .{{ parsePrice(defaultGroupSku.actPrice || defaultSku.actPrice)[1] }}
            </view>
            <view v-if="!findSku" class="pup-sku-price">{{ i18n.outOfStock }}</view>
            <view class="pup-sku-prop">
              <view>
                <text>{{ i18n.selected }}</text>
                <text decode="true">
                  <text v-if="defaultSku.skuName">{{ '&nbsp;' + defaultSku.skuName }}</text>
                  <text v-else>
                    {{ '&nbsp;' + selectedPropShowList.join('，') }}
                  </text>
                  <text v-if="leastNum && comboId">{{ '&nbsp;'+leastNum+'&nbsp;' }}{{ i18n.piece }}</text>
                  <text v-else>{{ '&nbsp;' + prodNum }}{{ i18n.piece }}</text>
                </text>
              </view>
              <view v-if="findSku">
                <text>{{ i18n.inventory }}</text>
                <text decode="true">{{ '&nbsp;'+ (prodType === 2 && (defaultSku.seckillStocks === 0 || defaultSku.seckillStocks) ? defaultSku.seckillStocks : defaultSku.stocks) }}</text>
                <text v-if="(prodType === 2 || prodType === 1) && activityInfo.maxNum >= 1 && skuShowType === 1" style="margin-left: 20rpx;">{{ i18n.purchaseLimit }}</text>
                <text v-if="(prodType === 2 || prodType === 1) && activityInfo.maxNum >= 1 && skuShowType === 1" decode="true">{{ '&nbsp;'+ activityInfo.maxNum }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="pup-sku-body">
          <view v-if="isInputing" class="input-mask" @tap="handleSetVirtualInputInfo" />
          <!-- 说明（虚拟商品） -->
          <view v-if="mold === 1 && (virtualInfo.writeOffNum !== 0 || (virtualInfo.writeOffNum === 0 && virtualInfo.isRefund === 0))" class="virtual-goods-tips">
            <text class="vi-t">{{ i18n.usageInstructions }}：</text>
            <!-- writeOffNum 0无需核销 1单次核销 -1多次核销 -->
            <block v-if="virtualInfo.writeOffNum !== 0">
              <!-- writeOffTime核销有效期 -1.长期有效 0.自定义 x.x天内有效 -->
              <text v-if="virtualInfo.writeOffTime === -1">{{ i18n.longTermValidity }}</text>
              <text v-else-if="virtualInfo.writeOffTime === 0">{{ i18n.afterPurchase }} {{ virtualInfo.writeOffStart }} {{ i18n.to }} {{ virtualInfo.writeOffEnd }} <text v-if="!isEn">{{ i18n.effective }}</text></text>
              <text v-else-if="virtualInfo.writeOffTime === 1">{{ i18n.validOnTheSameDay }}</text>
              <text v-else>{{ i18n.purchase }}{{ virtualInfo.writeOffTime }}{{ i18n.validDay }}</text>
            </block>
            <!-- isRefund 0不支持退款 1支持退款 -->
            <text v-if="virtualInfo.isRefund === 0"><text v-if="virtualInfo.writeOffNum !== 0 ">，</text>{{ i18n.refundsAreNotAllowed }}</text>
          </view>

          <!-- 规格 -->
          <view class="pup-sku-area">
            <view v-if="skuList.length" class="sku-box">
              <view v-for="(skuGroupItem, skuGroupItemIndex) in skuGroupList" :key="skuGroupItemIndex">
                <view v-for="(skuLine, key) in skuGroupItem" :key="key" class="items sku-text">
                  <text class="sku-kind">{{ key }}</text>
                  <view class="con">
                    <text
                      v-for="skuLineItem in skuLine"
                      :key="skuLineItem"
                      class="sku-choose-item"
                      :class="['item-item',selectedPropList.indexOf(key + ':' + skuLineItem) !== -1?'active':'',
                               isSkuLineItemNotOptional(allProperties,selectedPropObj,key,skuLineItem,propKeys)? 'dashed' : '']"
                      @click="toChooseItem(skuGroupItemIndex, skuLineItem, key)"
                    >{{ skuLineItem }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <!-- 数量 -->
          <view v-if="pageType || isJionGroup" class="pup-sku-count">
            <view class="num-wrap">
              <view class="minus" @tap="onCountMinus">
                <text class="row" />
              </view>
              <view class="text-wrap">
                <input ref="prodNumSelf" :key="prodNumSelfKey" type="number" :value="prodNumSelf" @input="changeNUm" @blur="prodNumInp()"></input>
              </view>
              <view class="plus" @tap="onCountPlus">
                <text class="row" />
                <text class="col" />
              </view>
            </view>
            <view class="count-name">{{ i18n.quantity }}</view>
          </view>
        </view>
        <!-- 底部按钮: 普通/秒杀/拼团  -->
        <view v-if="(pageType || isJionGroup) && pageType != 3" :class="'pup-sku-footer ' + ( isJionGroup ? '' : findSku && !prodNumBiggerThanStock() ? '':'gray')">
          <!-- 秒杀按钮 -->
          <view v-if="prodType===2 && activityInfo.activityStatus === 2" class="btn buy" @tap="handleBuyNow(2)">{{ i18n.immediatelyBuy }}</view>
          <!-- 非秒杀、非预售商品 -->
          <block v-else-if="skuShowType==0 && preSellStatus != 1">
            <!-- <view v-if="skuShowType == 0 && mold !== 1" class="btn cart" @tap="handleAddToCart">{{ i18n.addShoppingCart }}</view> -->
            <view v-if="skuShowType==0" class="btn buy" @tap="handleBuyNow(0)">{{ i18n.buyNow }}</view>
          </block>
          <!-- 预售 -->
          <view v-if="preSellStatus == 1 && !(prodType===2 && activityInfo.activityStatus === 2)" class="btn pre-sale-buy" @tap="handleBuyNow(0)">{{ i18n.buyNow }}</view>
          <!-- 开团按钮 -->
          <view
            v-if="skuShowType==1 && !isJionGroup && prodType === 1"
            :class="['btn', activityInfo.activityStatus === 1 ? 'gray-btn' : 'buy']"
            @tap="handleBuyNow(1)"
          >{{ i18n.startAGroup }}
          </view>
          <!-- 参团按钮 -->
          <view
            v-if="isJionGroup"
            class="btn"
            :class="[defaultSku.stocks === 0 ? 'gray-btn' : 'buy']"
            @tap="handleJionGroup"
          >
            {{ i18n.JoinGroupNow }}
          </view>
        </view>
        <!-- 青春豆商品: 兑换按钮 -->
        <view v-if="prodType == 3" :class="'pup-sku-footer ' + (findSku && !prodNumBiggerThanStock() ? '':'gray')">
          <view class="btn buy" @tap="handleBuyNow(3)">
            {{ i18n.redeemNow }}
          </view>
        </view>
        <!-- 活动商品: 仅作为套餐(附属商品)或赠品 不可单独购买 -->
        <view v-if="prodType == 5 && pageType" class="pup-sku-footer gray">
          <view class="btn buy">{{ i18n.notAvailableForPurchase }}</view>
        </view>
        <!-- 购物车: 切换sku弹窗 -->
        <view v-if="!pageType && !isJionGroup" class="pup-sku-footer" :class="{gray: !findSku || prodNumBiggerThanStock()}">
          <view class="btn buy" @tap="submit">{{ i18n.confirm }}</view>
        </view>
      </view>
    </view>
    <!-- 规格弹窗 end -->
  </view>
</template>

<script>
import config from '@/utils/config'
export default {
  props: {
    pic: {
      type: String,
      default: ''
    },
    isMain: {
      type: Boolean,
      default: false
    },
    leastNum: {
      type: Number,
      default: 0
    },
    skuName: {
      type: String,
      default: ''
    },
    skuList: {
      type: Array,
      default() {
        return []
      }
    },
    skuId: {
      type: Number,
      default: 0
    },
    comboId: {
      type: Number,
      default: 0
    },
    defaultPrice: {
      type: Number,
      default: 0
    },
    mold: {
      type: [Number, String],
      default: 0
    },
    virtualInfo: {
      type: Object,
      default: () => {}
    },
    // sku的显示类型 0普通sku 1拼团sku
    skuShowType: {
      type: Number,
      default: 0
    },
    prodType: {
      type: Number,
      default: 0
    },
    preSellStatus: {
      type: Number,
      default: 0
    },
    prodNum: {
      type: Number,
      default: 1
    },
    // 团购/秒杀  活动信息
    activityInfo: {
      type: Object,
      default: () => {}
    },
    // 页面类型: 0非商品详情页(套餐/购物车/团购详情:参团页面)  1普通商品(团购)  2秒杀商品  3青春豆商品  5活动商品
    pageType: {
      type: Number,
      default: 0
    },
    skuShow: {
      type: Boolean,
      default: false
    },
    // 参团页面
    isJionGroup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 是否为英文
      isEn: uni.getStorageSync('bbcLang') == 'en',
      defaultSku: '',
      num: '',
      prodNumSelfKey: 1,

      propKeys: [],
      selectedPropObj: {},
      skuGroup: {},
      allProperties: [],
      findSku: false,

      skuGroupList: [],
      selectedPropObjList: [],
      selectedProperties: '',
      selectedPropList: [],
      selectedPropShowList: [],
      isInputing: false,

      // 团购sku
      defaultGroupSku: {},
      resourceUrl: config.domain,
      isPicError: false
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    },
    prodNumSelf: {
      get() {
        return this.prodNum
      },
      set(val) {
        this.prodNumSelfKey = Math.random() * 1000000
        this.$forceUpdate()
      }
    }
  },
  mounted() {
    this.groupSku()
  },
  methods: {
    /**
     * 图片路径处理
     */
    setPicURL(pic, pic1) {
      const url = pic || pic1
      if (url) {
        return url.indexOf('http') === -1 ? config.picDomain + url : url
      }
      return false
    },
    closePopup() {
      this.$emit('closeSkuPop')
    },
    groupSku() {
      const skuList = this.activityInfo.activityStatus == 2 && this.activityInfo.seckillId ? this.activityInfo.seckillSkuList : this.skuList
      if (skuList.length == 1 && !skuList[0].properties) {
        this.defaultSku = skuList[0]
        this.findSku = true
        if (this.pageType || this.isJionGroup) {
          this.$emit('setSku', this.defaultSku, this.findSku)
        }
        if (this.activityInfo && this.prodType === 1) {
          this.setDefaultGroupSku()
        }
        return
      }
      const skuGroupList = []
      const skuGroup = {}
      const allProperties = []
      const propKeys = []
      const selectedPropObj = {}
      const selectedPropObjList = []

      var defaultSku = null
      var arr = JSON.parse(JSON.stringify(skuList))
      arr.sort((a, b) => {
        a.seckillPrice - b.seckillPrice
      })
      for (var i = 0; i < skuList.length; i++) {
        var isDefault = false
        if ((!defaultSku && skuList[i].skuId == this.skuId)) {
        // if ((!defaultSku && skuList[i].skuId == this.skuId) ||
          // 		(!defaultSku && skuList[i].price == this.defaultPrice) ||
          // 		(!defaultSku && skuList[i].seckillPrice === this.activityInfo?.seckillPrice && skuList[i].price === this.activityInfo?.price) ||
          // 		(!defaultSku && skuList[i].actPrice === this.activityInfo?.actPrice && this.prodType === 1)) {
          defaultSku = skuList[i]
          isDefault = true
        }
        if (defaultSku === null && (i === skuList.length - 1)) {
          defaultSku = arr[0]
          isDefault = true
        }
        var properties = skuList[i].properties // 版本:公开版;颜色:金色;内存:64GB
        allProperties.push(properties)
        var propList = properties.split(';') // ["版本:公开版","颜色:金色","内存:64GB"]

        for (var j = 0; j < propList.length; j++) {
          var index = propList[j].indexOf(':')
          var propval = [propList[j].slice(0, index), propList[j].substring(index + 1)] // ["版本","公开版"]
          var props = skuGroup[propval[0]] // 先取出 版本对应的值数组

          // 如果当前是默认选中的sku，把对应的属性值 组装到selectedProp
          if (isDefault) {
            propKeys.push(propval[0])
            selectedPropObj[propval[0]] = propval[1]
            const selectedPropObjItem = {}
            selectedPropObjItem[propval[0]] = propval[1]
            selectedPropObjList.push(selectedPropObjItem)
          }

          if (props == undefined) {
            props = [] // 假设还没有版本，新建个新的空数组
            props.push(propval[1]) // 把 "公开版" 放进空数组
          } else {
            if (props.indexOf(propval[1]) === -1) { // 如果数组里面没有"公开版"
              props.push(propval[1]) // 把 "公开版" 放进数组
            }
          }
          skuGroup[propval[0]] = props // 最后把数据 放回版本对应的值
          const propListItem = {}
          propListItem[propval[0]] = props
          skuGroupList.push(propListItem)
        }
      }
      this.defaultSku = defaultSku || {}
      this.propKeys = propKeys
      this.selectedPropObj = selectedPropObj
      this.skuGroup = skuGroup
      this.selectedPropObjList = selectedPropObjList
      this.skuGroupList = this.unique(skuGroupList)
      this.allProperties = allProperties
      this.parseSelectedObjToVals(skuList)
      this.$forceUpdate()
      if (this.activityInfo && this.prodType === 1) {
        this.setDefaultGroupSku()
      }
    },

    /**
		 * 将已选的 {key:val,key2:val2}转换成 [val,val2]
		 */
    parseSelectedObjToVals: function(skuList) {
      const selectedPropObjList = this.selectedPropObjList
      let selectedProperties = ''
      const selectedPropList = []
      const selectedPropShowList = []
      for (let i = 0; i < selectedPropObjList.length; i++) {
        const selectedPropObjItem = selectedPropObjList[i]
        for (const key in selectedPropObjItem) {
          if (Object.hasOwnProperty.call(selectedPropObjItem, key)) {
            selectedPropList.push(key + ':' + selectedPropObjItem[key])
            selectedPropShowList.push(selectedPropObjItem[key])
            selectedProperties += key + ':' + selectedPropObjItem[key] + ';'
          }
        }
      }
      selectedProperties = selectedProperties.substring(0, selectedProperties.length - 1)
      this.selectedPropList = selectedPropList
      this.selectedPropShowList = selectedPropShowList
      this.selectedProperties = selectedProperties
      this.selectedPropObjList = selectedPropObjList
      var findSku = false
      for (var i = 0; i < skuList.length; i++) {
        if (skuList[i].properties == selectedProperties) {
          findSku = true
          this.defaultSku = skuList[i]
          break
        }
      }
      if (findSku === false) {
        this.defaultSku = {
          pic: this.setSkuImg() || this.defaultSku.pic
        }
      }
      this.findSku = findSku
      if (this.pageType || this.isJionGroup) {
        this.$emit('setSku', this.defaultSku, this.findSku)
      }
      if (this.activityInfo && this.prodType === 1) {
        this.setDefaultGroupSku()
      }
    },

    setSkuImg() {
      for (let i = 0; i < this.skuList.length; i++) {
        const skuObj = this.skuList[i].properties.split(';')[0]
        const index = skuObj.indexOf(':')
        if (skuObj.substring(index + 1) === this.selectedPropObjList[0][skuObj.slice(0, index)]) {
          return this.skuList[i].pic
        }
      }
    },

    showSku() {
      this.$emit('showSku')
    },

    /**
		 * 判断当前的规格值 是否可以选
		 */
    isSkuLineItemNotOptional(allProperties, propObj, key, item, propKeys) {
      var selectedPropObj = Object.assign({}, propObj)
      var properties = ''
      selectedPropObj[key] = item
      for (let j = 0; j < propKeys.length; j++) {
        properties += propKeys[j] + ':' + selectedPropObj[propKeys[j]] + ';'
      }
      properties = properties.substring(0, properties.length - 1)
      for (let i = 0; i < allProperties.length; i++) {
        if (properties == allProperties[i]) {
          return false
        }
      }
      for (let i = 0; i < allProperties.length; i++) {
        if (allProperties[i].indexOf(item) >= 0) {
          return true
        }
      }
      return false
    },

    /**
		 * 规格点击事件
		 */
    toChooseItem(skuGroupItemIndex, skuLineItem, key) {
      this.selectedPropObjList[skuGroupItemIndex] = this.selectedPropObjList[skuGroupItemIndex] || {}

      this.selectedPropObjList[skuGroupItemIndex][key] = skuLineItem
      this.selectedPropObj[key] = skuLineItem
      this.$emit('setProdNum', 1)
      const skuList = this.activityInfo?.activityStatus == 2 && this.activityInfo.seckillId ? this.activityInfo.seckillSkuList : this.skuList
      this.parseSelectedObjToVals(skuList)
      if (this.pageType || this.isJionGroup) {
        this.$emit('setSku', this.defaultSku, this.findSku)
      }
      if (this.activityInfo && this.prodType === 1) {
        this.setDefaultGroupSku()
      }
    },

    /**
		 * 设置选中的拼团sku
		 */
    setDefaultGroupSku() {
      const groupSkuList = this.activityInfo.groupSkuList || this.activityInfo.seckillSkuList
      if (groupSkuList) {
        if (groupSkuList.length === 1 && !groupSkuList[0].properties) {
          this.defaultGroupSku = groupSkuList[0]
          this.$emit('setSku', this.defaultGroupSku, this.findSku)
          return
        }
        for (var i = 0; i < groupSkuList.length; i++) {
          if (groupSkuList[i].properties == this.selectedProperties) {
            this.defaultGroupSku = groupSkuList[i]
            this.$emit('setSku', this.defaultGroupSku, this.findSku)
            break
          }
        }
      }
    },

    /**
		 * 去重
		 */
    unique(arr) {
      const map = {}
      arr.forEach(item => {
        const obj = {}
        Object.keys(item).sort().map(key => {
          obj[key] = item[key]
        })
        map[JSON.stringify(obj)] = item
      })
      return Object.keys(map).map(key => JSON.parse(key))
    },

    /**
		 * 减数量
		 */
    onCountMinus: function() {
      var prodNum = this.prodNumSelf
      if (prodNum > 1) {
        prodNum = prodNum - 1
      }
      this.$emit('setProdNum', prodNum)
    },

    /**
		 * 加数量
		 */
    onCountPlus: function() {
      // 商品数量
      let prodNum = parseInt(this.prodNumSelf)
      // 默认库存数量
      const defaultSkuStock = parseInt(this.prodType === 2 && (this.defaultSku.seckillStocks === 0 || this.defaultSku.seckillStocks) ? this.defaultSku.seckillStocks : this.defaultSku.stocks)
      // 是否限购
      const isRestriction = this.activityInfo.maxNum && this.activityInfo.maxNum !== -1 && this.skuShowType === 1 && this.activityInfo.maxNum <= defaultSkuStock
      // limit 最大可购买数量: 活动商品不限购则为当前sku库存；活动商品限购时，当库存大于限购数量则为限购数量，否则为库存数量
      const limit = !isRestriction ? defaultSkuStock : defaultSkuStock > this.activityInfo.maxNum ? this.activityInfo.maxNum : defaultSkuStock
      if (isRestriction) {
        if (prodNum >= limit) {
          uni.showToast({
            title: isRestriction && limit ? `${this.i18n.purchaseLimit} ${this.activityInfo.maxNum} ${this.i18n.piece}` : this.i18n.insufficientStock,
            icon: 'none'
          })
        }
        prodNum = (prodNum >= limit ? limit : prodNum + 1) || 1
      } else {
        if (prodNum >= defaultSkuStock) {
          uni.showToast({
            title: this.i18n.insufficientStock,
            icon: 'none'
          })
          prodNum = defaultSkuStock || 1
        } else {
          prodNum += 1
        }
      }
      this.$emit('setProdNum', prodNum)
    },

    /**
		 * 加购
		 */
    handleAddToCart() {
      if (!this.findSku || this.prodNumBiggerThanStock()) {
        return
      }
      this.$emit('addToCart')
    },

    /**
		 * 立即购买
     * @param {Number} orderType 订单类型  0普通 1团购 2秒杀 3青春豆
		 */
    handleBuyNow(orderType) {
      if (!this.findSku || this.prodNumBiggerThanStock()) {
        return
      }
      this.$emit('buyNow', orderType)
    },

    /**
		 * 参团
		 */
    handleJionGroup() {
      if (!this.findSku || this.prodNumBiggerThanStock()) {
        return
      }
      this.$emit('groupConfirmOrder')
    },

    /**
		 * 库存校验
		 * @return {Boolean} 购买数量大于库存
		 */
    prodNumBiggerThanStock() {
      if (!this.defaultSku) return true
      const defaultSkuStock = this.pageType == 2 ? this.defaultSku.seckillStocks : this.defaultSku.stocks
      return this.defaultSku.stocks === 0 ? true : (defaultSkuStock === 0 ? true : this.prodNumSelf > defaultSkuStock)
    },

    /**
		 * 输入框聚焦
		 */
    inputFocus() {
      this.isInputing = true
    },

    /**
		 * 设置虚拟商品留言
		 */
    handleSetVirtualInputInfo() {
      this.isInputing = false
      this.$emit('setVirtualInputInfo', this.virtualInfo.virtualRemarks)
    },

    /**
		 * 输入商品数量
		 */
    prodNumInp() {
      let num = Number(this.num.replace(/[^\d]/g, ''))
      const max = this.prodType === 2 && (this.defaultSku.seckillStocks === 0 || this.defaultSku.seckillStocks) ? this.defaultSku.seckillStocks : this.defaultSku.stocks
      if (num > max) {
        num = max
      } else if (num < 1) {
        num = 1
      }
      // this.$refs.prodNumSelf.valueSync = num
      this.$emit('setProdNum', num)
      this.prodNumSelf = this.prodNum
    },
    changeNUm(e) {
      this.num = e.detail.value
    },

    submit() {
      if (this.findSku && !this.prodNumBiggerThanStock()) {
        this.$emit('setSku', this.defaultSku, this.isMain, this.findSku)
      }
    },
    /**
     * 图片加载失败时显示默认图片
     */
    handlePicError() {
      this.isPicError = true
    }
  }
}
</script>

<style scoped>

/* 已选 */
.sku {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  padding: 20rpx;
  background: #fff;
  padding: 30rpx 20rpx;
  margin-top: 20rpx;
}

.sku-tit {
  font-size: 22rpx;
  color: #999;
  margin-right: 20rpx;
}

.sku-con {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 28rpx;
  font-weight: bold;
  max-width: 77%;
}

.more {
  position: absolute;
  right: 20rpx;
  width: 60rpx;
  top: 16rpx;
  text-align: right;
  font-size: 40rpx;
  color: #999;
  letter-spacing: 1px;
}

/* 已选 end */

/** 规格弹窗**/

.pup-sku {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.3);
}

.pup-sku-main {
  position: absolute;
  bottom: 0;
  width: 100%;
  min-height: 375px;
  max-height: 500px;
  background-color: #fff;
	border-radius: 20rpx 20rpx 0 0;
}

.close {
  color: #aaa;
  border-radius: 12px;
  line-height: 20px;
  text-align: center;
  height: 20px;
  width: 20px;
  font-size: 18px;
  padding: 1px;
  top: 10px;
  right: 10px;
  position: absolute;
}

.close::before {
  content: '\2716';
}

.pup-sku-header {
  position: relative;
  font-size: 16px;
  color: #333;
  padding: 20rpx 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #f2f2f2;
  padding-top: 35rpx;
	border-radius: 20rpx 20rpx 0 0;
}

.pup-sku-img {
  display: inline-block;
  width: 27%;
  height: 180rpx;
  vertical-align: middle;
  border-radius: 10rpx;
}
.pup-sku-img image {
  display: block;
  width: 180rpx;
  height: 100%;
}

.pup-sku-prod {
  display: inline-block;
  width: 70%;
  vertical-align: middle;
  padding-left: 10rpx;
}

.prod-title {
  font-size: 28rpx;
  display: -webkit-box;
  -webkit-line-clamp: 1; /*设定显示行数*/
  -webkit-box-orient: vertical;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  margin: 15rpx 0;
}

.pup-sku-price {
  display: inline-block;
  height: 1.5em;
  line-height: 1.5em;
  color: #F81A1A;
  font-size: 26rpx;
}
.group-sku-pri {
  display: flex;
  align-items: center;
}

.pup-sku-price-int {
  font-size: 34rpx;
}

.pup-sku-prop {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  font-size: 26rpx;
  color: #333;
  line-height: 1.4em;
  padding-right: 10px;
  margin-top: 16rpx;
	overflow: unset;
}

.sel-sku {
  display: inline-block;
  max-width: 340rpx;
  display: -webkit-box;
  -webkit-line-clamp: 1; /*设定显示行数*/
  -webkit-box-orient: vertical;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 5px;
}

.pup-sku-prop text:first-child {
  color: #999;
}

.pup-sku-body {
  padding-bottom: calc(110rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(110rpx + env(safe-area-inset-bottom));
  /* overflow: auto; */
}

.pup-sku-main {
  max-height: 750px;
}

.pup-sku-area {
  max-height: 245px;
  overflow-y: scroll;
}
.pup-sku-area .sku-box{
  max-height: 245px;
  overflow-y: scroll;
}

.pup-sku-area .sku-kind {
  font-size: 12px;
  color: #999;
  margin: 0 10px;
  height: 40px;
  line-height: 40px;
}
.pup-sku-area .con {
	padding-right: 20rpx;
}

.pup-sku-area .sku-choose {
  overflow: hidden;
  margin-bottom: 3px;
}

.sku-choose-item {
  display: inline-block;
  min-width: 100rpx;
  max-width: 540rpx;
  padding: 0 10rpx;
  overflow: hidden;
  height: 50rpx;
  line-height: 50rpx;
  text-align: center;
  margin-left: 10px;
  margin-bottom: 10px;
  border-radius: 30rpx;
  color: #333;
  background-color: #f7f7f7;
  font-size: 14px;
  border: 1px solid #aaa;
}

.sku-choose-item.active {
  background-color: #F81A1A;
  color: #fff;
  border: 1px solid #F81A1A !important;
}

.sku-choose-item.gray {
  background-color: #f9f9f9;
  color: #ddd;
}
.sku-choose-item.dashed {
  border: 1px dashed #ccc;
}

.pup-sku-count {
  padding: 0 10px 13px;
  font-size: 12px;
  margin-top: 20rpx;
}

.pup-sku-count .count-name {
  height: 31px;
  line-height: 31px;
  width: 100rpx;
  color: #000;
  font-weight: bold;
}

.pup-sku-count .num-wrap {
  position: relative;
  z-index: 0;
  width: 110px;
  float: right;
  vertical-align: middle;
  display: flex;
}

/* 留言（虚拟商品） */
.virtual-goods-tips {
  display: block;
  background: #F9F9F9;
  padding: 20rpx;
  color: #999999;
  font-size: 24rpx;
  margin-bottom: 20rpx;
  line-height: 1.5em;
}
.pup-sku-count.virtual-goods-msg {
  margin-bottom: 30rpx;
  max-height: 600rpx;
  overflow-y: auto;
}
.pup-sku-count.virtual-goods-msg .msg-item {
  display: flex;
  align-items: center;
  border-bottom: 2rpx solid #F2F2F2;
  font-size: 24rpx;
  padding-bottom: 20rpx;
}
.pup-sku-count.virtual-goods-msg .msg-item:not(:first-child) {
  margin-top: 40rpx;
}
.pup-sku-count.virtual-goods-msg .msg-item .msg-tit {
  flex-wrap: wrap;
  width: 180rpx;
  margin-right: 20rpx;
  word-break: break-word;
}
.pup-sku-count.virtual-goods-msg .msg-item .stress {
  color: #F81A1A;
  margin-right: 10rpx;
  font-size: 26rpx;
}
.pup-sku-count.virtual-goods-msg .msg-item .msg-int {
  font-size: 24rpx;
  width: 100%;
}
.pup-sku-count.virtual-goods-msg .msg-item .msg-int .uni-input-placeholder {
  color: #aaa;
}
/* 留言（虚拟商品）/ */

.num-wrap .minus,
.num-wrap .plus {
  position: relative;
  max-width: 30px;
  min-width: 30px;
  height: 30px;
  line-height: 30px;
  background: #f7f7f7;
  text-align: center;
}

.num-wrap .minus {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}

.num-wrap .plus {
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}

.num-wrap .row {
  border-radius: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -7px;
  margin-top: -1px;
  width: 14px;
  height: 2px;
  background-color: #ccc;
}

.num-wrap .col {
  border-radius: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -1px;
  margin-top: -7px;
  width: 2px;
  height: 14px;
  background-color: #999;
}

.pup-sku-count .text-wrap {
  position: relative;
  width: 45px;
  z-index: 0;
  margin: 0 1px;
}

.pup-sku-count .text-wrap input {
  height: 30px;
  width: 100%;
  color: #333;
  background: #fff;
  font-size: 12px;
  text-align: center;
  border: none;
  background: #f7f7f7;
}

.pup-sku-footer {
  position: fixed;
  bottom: 0;
  bottom: constant(safe-area-inset-bottom);
  bottom: env(safe-area-inset-bottom);
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row nowrap;
  align-items: center;
  height: 110rpx;
  z-index: 999;
  /* box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05); */
}

.pup-sku-footer .btn {
  position: relative;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  font-size: 30rpx;
  flex-flow: column;
  border-radius: 60rpx;
  height: 2.8em;
  width: 45%;
  margin: 0 15rpx;
}

.pup-sku-footer .btn.cart {
  background: #584e61;
  color: #fff;
}

.pup-sku-footer .btn.buy {
  background: #F81A1A;
  color: #fff;
}
.pup-sku-footer .btn.pre-sale-buy {
  background: #F81A1A;
  color: #fff;
}
.pup-sku-footer.gray .btn {
  background: #eee;
  color: #999;
}

.pup-sku-footer .gray-btn {
  background-color: #eeeeee;
  color: #999999;
}

/* 输入框聚焦遮罩 */
.input-mask {
	height: 100vh;
	width: 100%;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 999;
}
</style>
