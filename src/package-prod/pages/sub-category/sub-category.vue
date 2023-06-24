<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <!-- 顶部子分类tab -->
    <scroll-view scroll-x="true" class="category-tit" :scroll-into-view="intoView" :scroll-with-animation="true">
      <block v-for="(item, index) in subCategoryList" :key="index">
        <view :id="'sw' + item.categoryId" :class="'category-item ' + (item.categoryId==categoryId? 'on':'')" :data-id="item.categoryId" @tap="onSubCategoryTap">{{ item.categoryName }}</view>
      </block>
    </scroll-view>
    <!-- 商品列表 -->
    <view class="prod-item">
      <block v-for="(item, key) in prodList" :key="key">
        <prod :item="item" />
      </block>
    </view>
    <!-- 空 || 加载完毕 -->
    <!-- <view v-if="!prodList.length || current == pages" class="empty all">
      <view v-if="!prodList.length" class="empty-icon">
        <image src="/static/images/icon/empty.png" />
      </view>
      <view class="empty-text">{{ !prodList.length?i18n.noCommodity:i18n.endTips }}</view>
    </view> -->
    <!-- 空列表或加载全部提示 -->
    <EmptyAllTips
      v-if="isLoaded"
      :isEmpty="!prodList.length"
      :emptyTips="i18n.noCommodity"
      :isAll="current == pages"
    />
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
import prod from '../../../components/production/index.vue'

export default {

  components: {
    prod
  },
  props: {},
  data() {
    return {
      subCategoryList: [],
      categoryId: 0,
      prodList: [],
      parentId: '',
      current: 1,
      pages: 0,
      intoView: '',
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
    this.setData({
      parentId: options.parentId,
      categoryId: options.categoryId
    })
    this.getSubCategory()
    this.getProdList()
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
      this.current = this.current + 1
      this.getProdList()
    }
  },

  /**
		 * 用户点击右上角分享
		 */
  onShareAppMessage: function() {},
  methods: {
    /**
			 * 获取顶栏子分类数据
			 */
    getSubCategory() {
      const params = {
        url: '/category/categoryInfo',
        method: 'GET',
        data: {
          parentId: this.parentId,
          userId:uni.getStorageSync('bbcUserInfo')?uni.getStorageSync('bbcUserInfo').userId:''
        },
        callBack: res => {
          this.setData({
            subCategoryList: res
          })
          this.$nextTick(() => {
            this.intoView = 'sw' + this.categoryId
          })
        }
      }
      http.request(params)
    },

    /**
			 * 根据分类id获取商品列表数据
			 */
    getProdList() {
      this.isLoaded = false
      const params = {
        // url: "/search/searchProdPage",
        url: '/search/page',
        method: 'GET',
        data: {
          categoryId: this.categoryId,
          current: this.current,
          size: 10,
          sort: 0,
          isAllProdType: true,
          isActive: 1, // 过滤掉活动商品
          userId:uni.getStorageSync('bbcUserInfo')?uni.getStorageSync('bbcUserInfo').userId:''
        },
        callBack: res => {
          this.isLoaded = true
          const reg = /^[a-z0-9]+$/ // 数字小写字母
          const reg2 = /^[A-Z]+$/ // 大写字母
          const reg3 = /[%&',.;=?_$\x22]+/ // 特殊字符
          const size = (item, sub, index) => {
            let count = 0
            let num = 0
            if (index > item.prodName.lenght) return count
            for (let i = sub; i < index; i++) {
              if (reg.test(item.prodName[i]) || reg3.test(item.prodName[i]) || item.prodName[i] === ' ') {
                num += 1.2
              } else if (reg2.test(item.prodName[i])) {
                num += 0.9
              }
            }
            const floor = Math.floor(num / 2)
            count += floor
            if (floor !== 0) {
              count += size(item, index, index + sub)
              return count
            } else {
              return count
            }
          }
          res.records[0].products.forEach(item => {
            item.sub = size(item, 0, 10)
          })
          this.setData({
            prodList: params.data.current == 1 ? res.records[0].products : this.prodList.concat(res.records[0].products),
            // current: res.current,
            pages: res.pages
          })
        }
      }
      http.request(params)
    },

    /**
			 * 切换顶部分类
			 */
    onSubCategoryTap(e) {
      this.setData({
        categoryId: e.currentTarget.dataset.id,
        current: 1,
        pages: 1,
        intoView: 'sw' + e.currentTarget.dataset.id
      })
      this.getProdList()
    }
  }
}
</script>
<style>
	@import "./sub-category.css";
</style>
