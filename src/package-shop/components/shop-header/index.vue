<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j">
    <!-- 店铺信息 -->
    <view class="shop">
      <view class="shopInfo" :data-shopid="shopId">
        <view class="sl">
          <view class="shopLogo">
            <image v-if="!isPicError" :src="shopInfo.shopLogo" @error="handlePicError" />
            <image v-else src="/static/images/icon/def.png" />
          </view>
          <view class="shopTitle">
            <view class="shopname">{{ shopInfo.shopName }}</view>
            <view :class="[isEn ? 'shopIntro-en' : 'shopIntro']">
              <view v-if="shopId == 1" class="self-operate">{{
                i18n.selfShop
              }}</view>
              <view
                v-if="shopInfo.shopStatus == 1"
                class="fol"
              >{{
                shopInfo.fansCount < 10000
                  ? shopInfo.fansCount + i18n.haveSpacePeople
                  : shopInfo.fansCount / 10000 + i18n.tenThousandPeople
              }}{{ i18n.collection }}</view>
            </view>
          </view>
        </view>
        <view
          v-if="followedLoading"
          :class="['follow-btn', isFollowed ? 'followed' : '']"
          @tap="collectShop"
        >
          <view class="fol">
            <image
              class="col-icon"
              :src="
                isFollowed
                  ? '/package-shop/static/images/icon/collected.png'
                  : '/package-shop/static/images/icon/not-collected.png'
              "
            />
            <view>{{ isFollowed ? i18n.collected : i18n.collection }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')
export default {
  props: {
    shopId: {
      default: '',
      type: [Number, String]
    }
  },
  data() {
    return {
      isFollowed: false,
      shopInfo: {}, // 店铺信息
      fansCountStr: '',
      isEn: uni.getStorageSync('bbcLang') == 'en',
      isPicError: false,
      followedLoading: false
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  mounted: function() {
    this.getShopInfo() // 获取店铺信息
    this.queryShopCollection() // 查询店铺是否已收藏
  },

  methods: {
    // 获取店铺信息
    getShopInfo() {
      const params = {
        url: '/shop/headInfo',
        method: 'GET',
        data: {
          shopId: this.shopId || uni.getStorageSync('bbcShopInfo').shopId
        },
        callBack: (res) => {
          this.setData({
            shopInfo: res
          })
          uni.setStorageSync('bbcShopInfo', res)
          // 进入页面时判断店铺状态
          this.handleShopStatus(res)
        }
      }
      http.request(params)
    },

    /**
     * 店铺状态处理
     */
    handleShopStatus(res) {
      const shopStatus = res.shopStatus
      // shopStatus店铺状态(-1:未开通 0: 停业中 1:营业中 2:平台下线 3:平台下线待审核)，可修改
      if (shopStatus === -1) {
        this.handleTipsModal(this.i18n.storeStatusTips2)
        return
      }
      if (shopStatus === 0) {
        if (shopStatus === 0) {
          this.handleTipsModal(this.i18n.storeReviewTips6)
          return
        }
      }
      if (shopStatus === 2 || shopStatus === 3) {
        this.handleTipsModal(this.i18n.storeStatusTips3)
        return
      }
    },
    handleTipsModal(tips) {
      uni.showModal({
        title: this.i18n.tips,
        content: tips,
        showCancel: false, // 是否显示取消按钮
        cancelText: this.i18n.cancel,
        confirmText: this.i18n.confirm,
        success: (res) => {
          if (res.confirm) {
            uni.navigateBack({
              delta: 1
            })
          }
        }
      })
    },

    // 查询店铺是否已收藏
    queryShopCollection() {
      this.followedLoading = false
      var shopId = this.shopId // 加载轮播图
      const params = {
        url: `/p/shop/collection/isCollection`,
        method: 'GET',
        data: {
          shopId: shopId
        },
        dontTrunLogin: true,
        callBack: (res) => {
          this.followedLoading = true
          if (res == true) {
            this.isFollowed = true
          } else {
            this.isFollowed = false
          }
        },
        errCallBack: () => {
          this.followedLoading = true
        }
      }
      http.request(params)
    },

    // 添加/取消店铺
    collectShop() {
      var shopId = this.shopId // 加载轮播图
      util.checkAuthInfo(() => {
        const params = {
          url: `/p/shop/collection/addOrCancel`,
          method: 'POST',
          data: shopId,
          callBack: (res) => {
            if (res == true) {
              this.isFollowed = true
            } else {
              this.isFollowed = false
            }
            console.log('添加/取消收藏操作后isFollowed：', this.isFollowed)
            this.getShopInfo()
            // this.$emit('queryShoInfo')
          }
        }
        http.request(params)
      })
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
@import "./index.css";
</style>
