<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j micro-box">
    <view v-for="(item, index) in list" :key="index">
      <searchBar v-if="item.type === 'search'" :dataField="item.dataField" :shopId="shopId" :pageScorllTop="pageScorllTop" />
      <image-ad v-if="item.type === 'imageAd' || item.type === 'hotArea'" :dataField="item.dataField" :shopId="shopId" />
      <goods v-if="item.type === 'goods'" :dataField="item.dataField" :shopId="shopId" />
      <notice v-if="item.type === 'notice'" :dataField="item.dataField" :shopId="shopId" />
      <navigationClassification v-if="item.type === 'tabNav'" :dataField="item.dataField" :shopId="shopId" />
      <titleText v-if="item.type === 'titleText'" :dataField="item.dataField" :shopId="shopId" />
      <promotionalActivities v-if="item.type === 'promotionalActivities'" :dataField="item.dataField" :shopId="shopId" />
      <goods-module-one v-if="item.type==='goodsModule1'" :dataField="item.dataField" :shopId="shopId" />
      <goods-module-two v-if="item.type==='goodsModule2'" :dataField="item.dataField" :shopId="shopId" />
      <goods-module-three v-if="item.type==='goodsModule3'" :dataField="item.dataField" :shopId="shopId" />
      <goods-module-four v-if="item.type==='goodsModule4'" :dataField="item.dataField" :shopId="shopId" />
      <goods-module-five v-if="item.type==='goodsModule5'" :dataField="item.dataField" :shopId="shopId" />
      <goods-waterfall v-if="item.type==='goodsWaterfall'" :isBottom="isBottom" :dataField="item.dataField" :shopId="shopId" />
    </view>
  </view>
</template>

<script>
const http = require('@/utils/http.js')
import imageAd from '../all-feature/image-ad/index.vue'
import goods from '../all-feature/goods/index.vue'
import notice from '../all-feature/notice/index.vue'
import navigationClassification from '../all-feature/navigation-classification/index.vue'
import titleText from '../all-feature/title-text/index.vue'
import promotionalActivities from '../all-feature/promotional-activities/index.vue'
import searchBar from '../all-feature/search-bar/index.vue'
import goodsModuleOne from '../all-feature/goods-module-one/index.vue'
import goodsModuleTwo from '../all-feature/goods-module-two/index.vue'
import goodsModuleThree from '../all-feature/goods-module-three/index.vue'
import goodsModuleFour from '../all-feature/goods-module-four/index.vue'
import goodsModuleFive from '../all-feature/goods-module-five/index.vue'
import goodsWaterfall from '../all-feature/goods-waterfall/index.vue'
import { picDomain } from '@/utils/config'
export default {
  components: {
    imageAd,
    goods,
    notice,
    navigationClassification,
    titleText,
    promotionalActivities,
    searchBar,
    goodsModuleOne,
    goodsModuleTwo,
    goodsModuleThree,
    goodsModuleFour,
    goodsModuleFive,
    goodsWaterfall
  },
  props: {
    isShowMicro: {
      type: Boolean,
      default: true
    },
    wid: {
      // ID
      type: String,
      default: ''
    },
    pageLoad: {
      type: Boolean,
      default: false
    },
    pageId: {
      type: [Number, String],
      default: ''
    },
    shopId: {
      type: [Number, String],
      default: ''
    },
    pageScorllTop: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      list: [],
      locking: false,
      isBottom: false
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getPageInfoById()
    })
  },
  methods: {
    /**
			 * 请求页面数据
			 */
    getPageInfoById() {
      this.list = []
      // shopId、pageId  在进入店铺主页时获取
      const params = {
        url: '/shopRenovation/info',
        method: 'GET',
        data: {
          renovationId: this.pageId,
          shopId: this.shopId
        },
        callBack: async(res) => {
          this.locking = false
          if (!res) {
            // 没获取到数据，可能是对应id的页面被删了
            uni.showToast({
              title: this.i18n.pageGone,
              icon: 'none',
              duration: 1200
            })
            setTimeout(() => {
              uni.navigateBack({
                delta: 1
              })
            }, 1500)
            return
          }
          const pageData = await this.matchproducts(JSON.parse((res.content)))
          this.list = pageData
          this.$emit('pageLoaded', {
            detail: {
              homeStatus: res.homeStatus,
              code: 0,
              data: '已获取数据',
              title: pageData[0].dataField.title,
              bgImg: pageData[0].dataField.bgImg ? picDomain + pageData[0].dataField.bgImg : '',
              textColor: pageData[0].dataField.textColor,
              bgType: pageData[0].dataField.bgType,
              bgColor: pageData[0].dataField.bgColor
            }
          })
        }
      }
      if (this.pageId && this.shopId >= 0 && !this.locking) {
        this.locking = true
        http.request(params)
      }
    },
    // 匹配商品
    async matchproducts(arr) {
      const res = await this.searchGoodsMessage(arr)
      arr.forEach(item => {
        if (item.type === 'goods') { // 商品列表(这里是进行一个筛选)
          const goodsParams = {
            prodName: 'prodName',
            status: 'status',
            price: 'price',
            pic: 'pic',
            brief: 'brief'
          }
          item.dataField.goods = this.handleScreenGoods(item.dataField.goods, res, 'prodId', goodsParams)
        } else if (item.type === 'promotionalActivities') { // 促销活动
          const promoParams = {
            prodName: 'prodName',
            prodType: 'prodType',
            status: 'status',
            price: 'price',
            pic: 'pic',
            brief: 'brief',
            oriPrice: 'oriPrice',
            activityPrice: 'activityPrice',
            groupNumber: 'groupNumber'
          }
          item.dataField.prodIds = this.handleScreenGoods(item.dataField.prodIds, res, 'prodId', promoParams)
        } else if (item.type === 'goodsModule1') { // 商品模块1
          item.dataField.leftConfig.goodsList = this.handleScreenGoods(item.dataField.leftConfig.goodsList, res, 'id')
          item.dataField.rightConfig.goodsList = this.handleScreenGoods(item.dataField.rightConfig.goodsList, res, 'id')
        } else if (item.type === 'goodsModule3' || item.type === 'goodsModule4' || item.type === 'goodsModule5') { // 商品模块3 4 5
          item.dataField.goodsList = this.handleScreenGoods(item.dataField.goodsList, res, 'id')
        }
      })
      return arr
    },
    // 查询商品信息
    searchGoodsMessage(arr) {
      let goodsArr = []
      arr.forEach(item => {
        if (item.type === 'goods') { // 商品信息
          item.dataField.goods.forEach(v => {
            goodsArr.push(v.prodId)
          })
        } else if (item.type === 'promotionalActivities') { // 促销和活动
          item.dataField.prodIds.forEach(v => {
            goodsArr.push(v.prodId)
          })
        } else if (item.type === 'goodsModule1') { // 商品模块1
          item.dataField.leftConfig.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
          item.dataField.rightConfig.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        } else if (item.type === 'goodsModule3') { // 商品模块3
          item.dataField.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        } else if (item.type === 'goodsModule4') { // 商品模块4
          item.dataField.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        } else if (item.type === 'goodsModule5') { // 商品模块5
          item.dataField.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        }
      })
      // const that = this
      goodsArr = Array.from(new Set(goodsArr))
      if (!goodsArr.length) return
      return new Promise((resolve, reject) => {
        http.request({
          url: '/search/renovationPage',
          method: 'GET',
          data: {
            prodIds: uni.getStorageSync('bbcAppType') === 1 ? goodsArr.toString() : goodsArr,
            current: 1,
            size: goodsArr.length,
            getDelete: true
          },
          callBack: (res) => {
            res.records.forEach(item => {
              if (item.groupActivitySearchVO) {
                item.groupNumber = item.groupActivitySearchVO.groupNumber
              }
            })
            resolve(res.records)
          }
        })
      })
    },
    // 筛选商品回显 currentArr: 表示当前装修的商品，backReturnArr: 表示根据现有id查询后端返回的商品
    handleScreenGoods(currentArr, backReturnArr, type, otherParams) {
      let params = {}
      if (otherParams) {
        params = {
          ...otherParams
        }
      } else {
        params = {
          name: 'prodName', // 商品名称
          prodType: 'prodType', // 商品类型
          status: 'status', // 商品状态
          price: 'price', // 商品价格
          imgs: 'pic', // 商品图片
          orignPrice: 'oriPrice', // 商品原价
          description: 'brief' // 商品描述
        }
      }
      const arr = []
      for (let i = 0; i < currentArr.length; i++) {
        for (let j = 0; j < backReturnArr.length; j++) {
          if (currentArr[i][type] == backReturnArr[j].prodId) {
            for (const key in params) {
              currentArr[i][key] = backReturnArr[j][params[key]]
            }
            currentArr[i].orignPrice ? currentArr[i].orignPrice = backReturnArr[j].oriPrice : ''
            arr.push(currentArr[i])
          }
        }
      }
      return arr
    },
    // 下拉页面触底
    getNextPage() {
      const that = this
      this.isBottom = true
      setTimeout(() => {
        that.isBottom = false
      }, 100)
    }

  }
}
</script>
<style>
	@import "./index.css";
</style>
