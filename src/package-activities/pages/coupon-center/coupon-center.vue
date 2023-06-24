<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <view class="coupons">
      <view class="banner">
        <view
          class="bg"
        ><image
          src="../../static/images/icon/coupon-bg.png"
        /></view>
        <view
          class="img"
        ><image
          src="../../static/images/icon/coupon-banner.png"
        /></view>
      </view>
      <view class="con-box">
        <view v-if="couponList.length" class="c-tit">{{
          i18n.universalCoupon
        }}</view>
        <scroll-view
          v-if="couponList.length"
          scroll-x="true"
          class="general-box"
        >
          <view class="general">
            <view
              v-for="(item, index) in couponList"
              :key="item.couponId"
              class="item"
            >
              <view
                :class="
                  'item-box ' +
                    (item.canGoUse ? 'received' : !item.stocks ? 'robbed' : '')
                "
              >
                <view class="item-con">
                  <view v-if="item.couponType == 1" class="number">
                    <view class="symbol">￥</view>
                    <view class="text">
                      <text>{{ parsePrice(item.reduceAmount)[0] }}</text>
                      <text class="small">.{{ parsePrice(item.reduceAmount)[1] }}</text>
                    </view>
                  </view>
                  <view v-if="item.couponType == 2" class="number">
                    <view class="text">{{ item.couponDiscount }}</view>
                    <view class="symbol">{{ i18n.discount }}</view>
                  </view>
                  <view
                    class="condition"
                  >{{ i18n.available }}{{ item.cashCondition
                  }}{{ i18n.availableUse }}</view>
                  <view v-if="item.suitableProdType == 0" class="scope">{{
                    i18n.universalAll
                  }}</view>
                  <view v-if="item.suitableProdType != 0" class="scope">{{
                    i18n.universalOnly
                  }}</view>
                  <view class="progress-box">
                    <view v-if="item.stocks == 0" class="text">{{
                      i18n.nocoupons
                    }}</view>
                    <view
                      v-if="item.stocks != 0"
                      class="text"
                    >{{ i18n.haveCoupons
                    }}{{
                      parseInt(
                        ((item.sourceStock - item.stocks) * 100) /
                          item.sourceStock
                      )
                    }}%</view>
                    <view
                      class="progress"
                      :style="
                        'width: ' +
                          parseInt(
                            ((item.sourceStock - item.stocks) * 100) /
                              item.sourceStock
                          ) +
                          '%'
                      "
                    />
                  </view>
                </view>
                <view
                  v-if="!item.canGoUse && item.stocks"
                  class="item-btn"
                  :data-couponid="item.couponId"
                  data-coupontype="1"
                  :data-couponindex="index"
                  @tap="receiveCoupon"
                >{{ i18n.getIt }}</view>
                <view
                  v-if="item.canGoUse"
                  class="item-btn"
                  :data-couponid="item.couponId"
                  @tap="useCoupon"
                >{{ i18n.toUse }}</view>
                <view v-if="!item.canGoUse && !item.stocks" class="item-btn">{{
                  i18n.nocoupons1
                }}</view>
                <view v-if="item.canGoUse" class="icon">
                  <image
                    :src="
                      isEn
                        ? '../../static/images/icon/coupon-received-en.png'
                        : '../../static/images/icon/coupon-received.png'
                    "
                  />
                </view>
                <view v-if="!item.canGoUse && !item.stocks" class="icon">
                  <image
                    :src="
                      isEn
                        ? '../../static/images/icon/coupon-robbed-en.png'
                        : '../../static/images/icon/coupon-robbed.png'
                    "
                  />
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
        <view v-if="prodCouponList.length" class="c-tit">{{
          i18n.recommendCoupons
        }}</view>
        <view v-if="prodCouponList.length" class="special">
          <view
            v-for="(item, index) in prodCouponList"
            :key="item.couponId"
            class="item"
          >
            <view
              :class="
                'item-box ' +
                  (item.canGoUse ? 'received' : !item.stocks ? 'robbed' : '')
              "
            >
              <!-- 多商品券 -->
              <view v-if="item.prods && item.prods.length > 1" class="item-con">
                <view class="shop-msg">
                  <view class="logo">
                    <ImgShow :src="item.shopLogo" />
                  </view>
                  <view class="name">{{ item.shopName }}</view>
                </view>
                <view class="prod-msg">
                  <view
                    v-for="(prod, prodIndex) in item.prods"
                    :key="prodIndex"
                    class="p-item"
                    @tap="toProd(prod)"
                  >
                    <view class="img">
                      <image v-if="prod.pic && !prod.isPicError" :src="prod.pic" class="a111" mode="aspectFit" @error="handlePicError(prod)" />
                      <image
                        v-else
                        src="/static/images/icon/def.png"
                        mode="aspectFit"
                        class="a222"
                      />
                    </view>
                    <view class="price">￥{{ prod.price }}</view>
                  </view>
                </view>
              </view>
              <view v-if="item.prods.length > 1" class="item-btn">
                <view class="btn-box">
                  <view v-if="item.couponType == 1" class="number">
                    <view class="symbol">￥</view>
                    <view class="text">
                      <text>{{ parsePrice(item.reduceAmount)[0] }}</text>
                      <text class="small">.{{ parsePrice(item.reduceAmount)[1] }}</text>
                    </view>
                  </view>
                  <view v-if="item.couponType == 2" class="number">
                    <view class="text">{{ item.couponDiscount }}</view>
                    <view class="symbol">{{ i18n.discount }}</view>
                  </view>
                  <view
                    class="condition"
                  >{{ i18n.available }}{{ item.cashCondition
                  }}{{ i18n.availableUse }}</view>
                  <view class="progress-box">
                    <view v-if="item.stocks == 0" class="text">{{
                      i18n.nocoupons
                    }}</view>
                    <view
                      v-if="item.stocks != 0"
                      class="text"
                    >{{ i18n.haveCoupons
                    }}{{
                      parseInt(
                        ((item.sourceStock - item.stocks) * 100) /
                          item.sourceStock
                      )
                    }}%</view>
                    <view
                      class="progress"
                      :style="
                        'width: ' +
                          parseInt(
                            ((item.sourceStock - item.stocks) * 100) /
                              item.sourceStock
                          ) +
                          '%'
                      "
                    />
                  </view>
                  <view
                    v-if="!item.canGoUse && item.stocks"
                    class="btn"
                    :data-couponid="item.couponId"
                    data-coupontype="2"
                    :data-couponindex="index"
                    @tap="receiveCoupon"
                  >{{ i18n.getIt }}</view>
                  <view
                    v-if="item.canGoUse"
                    class="btn"
                    :data-couponid="item.couponId"
                    :data-prodlist="item.prods"
                    @tap="useCoupon"
                  >{{ i18n.toUse }}</view>
                  <view v-if="!item.canGoUse && !item.stocks" class="btn">{{
                    i18n.nocoupons
                  }}</view>
                </view>
              </view>
              <!-- /多商品券 -->
              <!-- 单商品券 -->
              <view v-if="item.prods && item.prods.length == 1" class="left">
                <view class="img">
                  <ImgShow :src="item.prods[0].pic" imgMode="aspectFit" />
                </view>
                <view class="text-box">
                  <view class="goods-name">{{ item.prods[0].prodName }}</view>
                  <view class="coupon-number">
                    <view v-if="item.couponType == 1" class="number">
                      <view class="symbol">￥</view>
                      <view class="text">{{ item.reduceAmount }}</view>
                    </view>
                    <view v-if="item.couponType == 2" class="number">
                      <view class="text">{{ item.couponDiscount }}</view>
                      <view class="symbol">{{ i18n.discount }}</view>
                    </view>
                  </view>
                  <view
                    class="condition"
                  >{{ i18n.available }}{{ item.cashCondition
                  }}{{ i18n.availableUse }}</view>
                </view>
              </view>
              <view v-if="item.prods.length == 1" class="right">
                <view class="btn-box">
                  <view v-if="item.stocks == 0" class="progress-text">{{
                    i18n.nocoupons
                  }}</view>
                  <view
                    v-if="item.stocks != 0"
                    class="progress-text"
                  >{{ i18n.haveCoupons
                  }}{{
                    parseInt(
                      ((item.sourceStock - item.stocks) * 100) /
                        item.sourceStock
                    )
                  }}%</view>
                  <view class="progress-box">
                    <view
                      class="progress"
                      :style="
                        'width: ' +
                          parseInt(
                            ((item.sourceStock - item.stocks) * 100) /
                              item.sourceStock
                          ) +
                          '%'
                      "
                    />
                  </view>
                  <view
                    v-if="!item.canGoUse && item.stocks"
                    class="btn"
                    :data-couponid="item.couponId"
                    data-coupontype="2"
                    :data-couponindex="index"
                    @tap="receiveCoupon"
                  >{{ i18n.getIt }}</view>
                  <view
                    v-if="item.canGoUse"
                    class="btn"
                    :data-couponid="item.couponId"
                    :data-prodlist="item.prods"
                    @tap="useCoupon"
                  >{{ i18n.toUse }}</view>
                  <view v-if="!item.canGoUse && !item.stocks" class="btn">{{
                    i18n.nocoupons
                  }}</view>
                </view>
              </view>
              <!-- /单商品券 -->
              <!-- 已领取 -->
              <view
                v-if="item.canGoUse || item.userHasCount !== 0"
                class="icon"
              >
                <image
                  :src="
                    isEn
                      ? '../../static/images/icon/coupon-received-en.png'
                      : '../../static/images/icon/coupon-received.png'
                  "
                />
              </view>
              <view v-else>
                <view v-if="!item.canGoUse && !item.stocks" class="icon">
                  <image
                    :src="
                      isEn
                        ? '../../static/images/icon/coupon-robbed-en.png'
                        : '../../static/images/icon/coupon-robbed.png'
                    "
                  />
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空列表或加载全部提示 -->
      <EmptyAllTips
        v-if="isLoaded"
        :isEmpty="!prodCouponList.length"
        :emptyTips="i18n.merchantCoupon"
        :isAll="loadAll"
      />
    </view>
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')

export default {
  components: {},
  props: {},
  data() {
    return {
      couponList: [],
      // 通用券列表
      prodCouponList: [],
      // 商品券列表
      selectedCouponId: 0,
      // 要领取的优惠券id
      current: 1,
      isLogin: !!uni.getStorageSync('bbcToken'),
      size: 20,
      // 当前页数
      pages: 1, // 总页数
      loadAll: false, // 已加载全部
      isEn: uni.getStorageSync('bbcLang') == 'en', // 是否为英文
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
    // 获取通用列表
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.couponCenter
    })

    this.getCouponList()
    this.getProdCouponList(1)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.current < this.pages) {
      this.getProdCouponList(this.current + 1)
    } else {
      this.setData({
        loadAll: true
      })
    }
  },
  methods: {
    // 去商品页面
    toProd(prod) {
      this.$Router.push({
        path: '/package-prod/pages/prod/prod',
        query: { prodId: prod.prodId }
      })
    },
    /**
     * 调整金额格式
     */
    parsePrice(val) {
      if (!val) {
        val = 0
      }
      return val.toFixed(2).split('.')
    },
    /**
     * 获取通用列表
     */
    getCouponList() {
      const url = this.isLogin
        ? '/p/myCoupon/generalCouponList'
        : '/coupon/generalCouponList'
      const params = {
        url: url,
        method: 'GET',
        callBack: (res) => {
          this.initCouponCanGoUseFlag(res)
          this.setData({
            couponList: res
          })
        }
      }
      http.request(params)
    },

    /**
     * 获取指定商品券
     */
    getProdCouponList(cur) {
      this.isLoaded = false
      const url = this.isLogin
        ? '/p/myCoupon/getCouponPage'
        : '/coupon/getCouponPage'
      const params = {
        url: url,
        method: 'GET',
        data: {
          current: cur,
          size: this.size
        },
        callBack: (res) => {
          this.isLoaded = true
          res.records = res.records.filter(
            (el) => el.prods && el.prods.length > 0
          )
          this.initCouponCanGoUseFlag(res.records)
          let list = []

          if (res.current == 1) {
            list = res.records
          } else {
            list = this.prodCouponList
            list = list.concat(res.records)
          }

          this.setData({
            prodCouponList: list,
            pages: res.pages,
            current: res.current
          })
        }
      }
      http.request(params)
    },

    /**
     * 初始化优惠券去可以使用的标记
     */
    initCouponCanGoUseFlag(couponList) {
      couponList.forEach((coupon) => {
        coupon.canGoUse = coupon.curUserReceiveCount >= coupon.limitNum
        // coupon.canGoUse = coupon.curUserReceiveCount >= coupon.limitNum && coupon.userHasCount > 0;
      })
    },

    /**
     * 设置优惠券去可以使用的标记
     */
    setCouponCanGoUseFlag(index, couponType) {
      if (couponType == 1) {
        const tempCouponList = this.couponList
        tempCouponList[index].canGoUse = true
        tempCouponList[index].stocks -= 1
        this.setData({
          couponList: tempCouponList
        })
      } else if (couponType == 2) {
        const tempCouponList = this.prodCouponList
        tempCouponList[index].canGoUse = true
        tempCouponList[index].stocks -= 1
        this.setData({
          prodCouponList: tempCouponList
        })
      }
    },

    /**
     * 立即领取
     */
    receiveCoupon(e) {
      this.setData({
        selectedCouponId: e.currentTarget.dataset.couponid
      })
      util.checkAuthInfo(() => {
        var ths = this

        if (ths.selectedCouponId) {
          http.request({
            url: '/p/myCoupon/receive',
            method: 'POST',
            data: ths.selectedCouponId,
            callBack: (data) => {
              uni.showToast({
                title: ths.i18n.successfullyReceived,
                icon: 'success',
                duration: 2000
              })
              this.setCouponCanGoUseFlag(
                e.currentTarget.dataset.couponindex,
                e.currentTarget.dataset.coupontype
              )
            }
          })
        }
      })
    },

    /**
     * 立即使用
     */
    useCoupon(e) {
      let url = '/package-prod/pages/prod-classify/prod-classify?sts=4'
      const couponId = e.currentTarget.dataset.couponid
      var title = this.i18n.couponEventGoods
      var prodList = e.currentTarget.dataset.prodlist

      if (prodList && prodList.length == 1) {
        this.$Router.push({
          path: '/package-prod/pages/prod/prod',
          query: { prodId: prodList[0].prodId }
        })
      } else {
        if (couponId) {
          url += '&tagid=' + couponId + '&title=' + title
        }

        uni.navigateTo({
          url: url
        })
      }
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
@import "./coupon-center.css";
</style>
