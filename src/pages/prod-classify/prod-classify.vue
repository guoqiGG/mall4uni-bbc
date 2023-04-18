<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <view v-if="sts==5" class="prod-classify-tit">
      <text data-sts="0" :class="stsTap==0?'on':''" @tap="onStsTap">{{ i18n.productCollection }}</text>
      <text data-sts="1" :class="stsTap==1?'on':''" @tap="onStsTap">{{ i18n.storeCollection }}</text>
    </view>

    <view :class="{'main':sts==5}">
      <block v-if="sts==5&&stsTap ==1">
        <view class="tit-background" />
        <block v-for="(item,index) in shopList" :key="index">
          <view class="Mall4j prod-items" :data-shopid="item.shopId" @tap="toShopPage">
            <view class="hot-imagecont">
              <ImgShow :src="item.shopLogo" :classList="['hotsaleimg']" imgMode="aspectFit" />
            </view>
            <view class="hot-text">
              <view>
                <view class="hotprod-text">

                  {{ item.shopName }}
                </view>
              </view>
              <view class="prod-text-info" :class="{'collection-row':showCancelCollect}">
                <view v-if="showCancelCollect" :data-shopid="item.shopId" class="collection-btn price small-num" @tap.stop="handleCancelShop">
                  {{ i18n.cancleCollection }} </view>
              </view>
            </view>
          </view>
        </block>
        <!-- 空列表或加载全部提示 -->
        <EmptyAllTips
          v-if="isLoaded"
          :isEmpty="!shopList.length"
          :isAll="shopList.length > 10 && shopLoadAll"
        />
      </block>

      <block v-else>
        <view
          v-if="sts == 4 && couponInfo.couponType === 1"
          class="coupon-condition"
        >{{ i18n.limitedTimeOffer1 }}{{ couponInfo.cashCondition }}{{ i18n.reduce
        }}{{ couponInfo.reduceAmount }}{{ i18n.coupon }}</view>
        <view
          v-if="sts == 4 && couponInfo.couponType === 2"
          class="coupon-condition"
        >{{ i18n.limitedTimeOffer1 }}{{ couponInfo.cashCondition }}{{ i18n.makeDa
        }}{{ couponInfo.couponDiscount }}{{ i18n.discount
        }}{{ i18n.coupon }}</view>
        <view class="tit-background" />
        <view>
          <block v-for="(item, key) in prodList" :key="key">
            <prod
              :item="item"
              :show-cancel-collect="showCancelCollect"
              @getCollectionProd="getCollectionProd"
            />
          </block>
        </view>
        <!-- 空列表或加载全部提示 -->
        <EmptyAllTips
          v-if="isLoaded"
          :isEmpty="!prodList.length"
          :isAll="prodList.length > 10 && loadAll"
        />
      </block>
    </view>
  </view>
</template>

<script>
const http = require('../../utils/http.js')
import prod from '../../components/production/index.vue'

export default {
  components: {
    prod
  },
  props: {},
  data() {
    return {
      sts: 0,
      prodList: [],
      title: '',
      current: 1,
      size: 20,
      pages: 0,
      tagid: 0,
      couponInfo: {}, // 单张优惠券信息
      couponId: '',
      showCancelCollect: false, // 是否展示取消收藏按钮，用于传值到商品列表页；
      loadAll: false, // 已加载全部
      stsTap: 0, // tabbar 状态  0-收藏商品   0-收藏店铺
      shopList: [], // 收藏店铺list
      shopCurrent: 1,
      shopSize: 20,
      shopPages: 0,
      shopLoadAll: false,
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
      current: 1,
      pages: 0,
      sts: options.sts,
      title: options.title ? options.title : ''
    })

    if (options.tagid) {
      this.setData({
        tagid: options.tagid,
        couponId: options.tagid
      })
    }

    if (this.sts == 0) {
      if (options.tagid == 1) {
        wx.setNavigationBarTitle({
          title: this.i18n.dailyUpdate
        })
      } else if (options.tagid == 2) {
        wx.setNavigationBarTitle({
          title: this.i18n.mallHotSale
        })
      } else if (options.tagid == 3) {
        wx.setNavigationBarTitle({
          title: this.i18n.moreBaby
        })
      }
    } else if (this.sts == 1) {
      wx.setNavigationBarTitle({
        title: this.i18n.newProduct
      })
    } else if (this.sts == 2) {
      wx.setNavigationBarTitle({
        title: this.i18n.limitedTimeOffer
      })
    } else if (this.sts == 3) {
      wx.setNavigationBarTitle({
        title: this.i18n.dailyPurchase
      })
    } else if (this.sts == 4) {
      wx.setNavigationBarTitle({
        title: this.i18n.couponEventGoods
      })
    } else if (this.sts == 5) {
      wx.setNavigationBarTitle({
        title: this.i18n.myCollection
      })
      this.showCancelCollect = true
    } else {
      wx.setNavigationBarTitle({
        title: this.title
      })
    }
    this.loadProdData(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.sts == 5 && this.stsTap == 1) {
      this.getCollectionShop()
    }
  },

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
    if (this.sts == 5 && this.stsTap == 1) { // 收藏店铺
      if (this.shopCurrent < this.shopPages) {
        this.setData({
          shopCurrent: this.shopCurrent + 1
        })
        this.getCollectionShop()
      } else {
        this.setData({
          shopLoadAll: true
        })
      }
    } else { // 收藏商品
      if (this.current < this.pages) {
        this.setData({
          current: this.current + 1
        })
        this.loadProdData()
      } else {
        this.setData({
          loadAll: true
        })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  methods: {
    /**
     * 加载商品数据
     */
    loadProdData: function(options) {
      const sts = this.sts

      if (sts == 0) {
        // 分组标签商品列表
        this.getTagProd()
      } else if (sts == 1) {
        // 新品推荐
        const url = '/search/page' // /prod/lastedProdPage
        this.getActProd(url)
      } else if (sts == 2) {
        // 限时特惠
        const url = '/marking/discount/prodList'
        this.getActProd(url)
      } else if (sts == 3) {
        // 每日疯抢
        const url = '/search/page'
        this.getActProd(url)
      } else if (sts == 4) {
        // 优惠券商品列表
        this.getProdByCouponId(this.couponId)
        this.getCouponInfo()
      } else if (sts == 5) {
        // 收藏商品列表
        this.getCollectionProd()
        this.getCollectionShop()
      }
    },
    getActProd: function(url) {
      var ths = this
      this.isLoaded = false
      const params = {
        url: url,
        method: 'GET',
        data: {
          current: ths.current,
          size: ths.size,
          sort: 21
        },
        callBack: (res) => {
          this.isLoaded = true
          let list = []
          let data = res.records
          if (url === '/search/page') {
            data = res.records[0].products
          }

          if (res.current == 1) {
            list = data
          } else {
            list = ths.prodList.concat(data)
          }
          ths.setData({
            prodList: list,
            pages: res.pages
          })
        }
      }
      http.request(params)
    },

    /**
     * 获取我的收藏商品
     */
    getCollectionProd: function() {
      var ths = this
      this.isLoaded = false
      const params = {
        url: '/p/user/collection/prods',
        method: 'GET',
        data: {
          current: ths.current,
          size: ths.size
        },
        callBack: (res) => {
          this.isLoaded = true
          let list = []

          if (res.current === 1) {
            list = (res.records && res.records[0]?.products) || []
          } else {
            list = ths.prodList
            list = list.concat((res.records && res.records[0]?.products) || [])
          }

          ths.setData({
            prodList: list,
            pages: res.pages
          })
        }
      }
      http.request(params)
    },

    /**
     * 获取标签列表
     */
    getTagProd: function(id) {
      var ths = this
      this.isLoaded = false
      var param = {
        url: '/prod/prodListByTagId',
        method: 'GET',
        data: {
          tagId: ths.tagid,
          current: ths.current,
          size: ths.size
        },
        callBack: (res) => {
          this.isLoaded = true
          let list = []

          if (res.current == 1) {
            list = res.records
          } else {
            list = ths.prodList.concat(res.records)
          }

          ths.setData({
            prodList: list,
            pages: res.pages
          })
        }
      }
      http.request(param)
    },

    /**
     * 获取优惠券商品列表
     */
    getProdByCouponId(id) {
      var ths = this
      this.isLoaded = false
      var param = {
        url: '/coupon/prodListByCouponId',
        method: 'GET',
        data: {
          couponId: id,
          current: this.current,
          size: this.size
        },
        callBack: (res) => {
          this.isLoaded = true
          let list = []

          if (res.current == 1) {
            list = res.records[0].products
          } else {
            list = ths.prodList.concat(res.records[0].products)
          }

          ths.setData({
            prodList: list,
            pages: res.pages
          })
        }
      }
      http.request(param)
    },

    // 获取一张优惠券信息
    getCouponInfo() {
      const params = {
        url: '/coupon/couponById?couponId=' + this.tagid,
        method: 'GET',
        callBack: (res) => {
          this.setData({
            couponInfo: res
          })
        }
      }
      http.request(params)
    },

    // 切换StaTap
    onStsTap(e) {
      const stsTap = e.currentTarget.dataset.sts
      this.setData({
        stsTap
      })
    },

    // 获取我的收藏店铺
    getCollectionShop() {
      this.isLoaded = false
      const params = {
        url: '/p/shop/collection/page',
        method: 'GET',
        data: {
          current: this.shopCurrent,
          size: this.shopSize
        },
        callBack: (res) => {
          this.isLoaded = true
          this.shopList = res.records
          this.shopPages = res.pages
          console.log(res)
        }

      }
      http.request(params)
    },
    // 取消收藏店铺
    handleCancelShop(e) {
      const shopId = e.currentTarget.dataset.shopid
      const params = {
        url: '/p/shop/collection/addOrCancel',
        method: 'POST',
        data: shopId,
        callBack: () => {
          this.getCollectionShop()
        }
      }
      http.request(params)
    },
    // 跳转收藏店铺
    toShopPage(e) {
      const shopId = e.currentTarget.dataset.shopid
      uni.navigateTo({
        url: '/package-shop/pages/shop-page/shop-page?shopId=' + shopId
      })
    }
  }
}
</script>
<style>
@import './prod-classify.css';
</style>
