<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <!-- 头部搜索区 -->
    <!-- <view class="search-bar">
      <view class="search-box" @tap="toSearchPage">
        <image src="/static/images/icon/search.png" class="search-img" />
        <text class="sear-input">{{ i18n.searchGoods }}</text>
      </view>
    </view> -->
    <!-- 滚动内容区 -->
    <view class="main">
      <!-- 左侧菜单start -->
      <scroll-view scroll-y="true" class="leftmenu">
        <block v-for="(item, index) in categoryList" :key="index">
          <view :class="'menu-item ' + (selIndex == index ? 'active' : '')" :data-index="index" :data-id="item.categoryId"
            @tap="onMenuTab">
            <text class="menu-text">{{ item.categoryName }}</text>
          </view>
        </block>
      </scroll-view>
      <!-- 左侧菜单end -->

      <!-- 右侧内容start -->
      <scroll-view scroll-y="true" class="rightcontent">
        <view v-if="categoryImg" class="adver-map">
          <view class="item-a">
            <image :src="categoryImg" mode="widthFix" @error="handlePicError" />
            <!-- <image v-else src="/static/images/icon/def.png" mode="widthFix" /> -->
          </view>
        </view>

        <block v-for="(item, subCateIndex) in proSubCategoryList" :key="subCateIndex">
          <view class="sub-category">
            <view class="sub-category-con">
              <view class="sub-cate-title">
                <text class="sub-cate-text">{{ item.categoryName }}</text>
                <!-- <text
                  v-if="item.categories"
                  class="view-all"
                  data-type="all"
                  :data-subcateindex="subCateIndex"
                  :data-parentid="item.categoryId"
                  @tap="toCatePage"
                >{{ i18n.viewAll }}</text> -->
              </view>
              <view v-if="item.categories" class="th-cate-con">
                <block v-for="(thCateItem, categoryId) in item.categories" :key="categoryId">
                  <view class="sub-category-item" :data-categoryid="thCateItem.categoryId"
                    :data-parentid="item.categoryId" @tap="toCatePage">
                    <image v-if="thCateItem.imgsrcTail" :src="thCateItem.pic" mode="widthFix"
                      class="sub-category-item-pic" @error="thCateItem.pic = '../../static/images/icon/def.png'" />
                    <!-- 默认图 -->
                    <image v-else src="/static/images/icon/def.png" class="sub-category-item-pic" mode="widthFix" />
                    <text class="sub-category-item-name">{{ thCateItem.categoryName }}</text>
                  </view>
                </block>
              </view>
              <view v-else>
                <EmptyAllTips :isEmpty="true" />
              </view>
            </view>
          </view>
        </block>
      </scroll-view>
      <!-- 右侧内容end -->
    </view>
  </view>
</template>

<script>
const http = require('../../utils/http.js')
const util = require('../../utils/util.js')

export default {
  components: {},
  props: {},
  data() {
    return {
      selIndex: 0,
      categoryList: [],
      categoryImg: '',
      subCategoryList: [],
      parentId: ''
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    },
    proSubCategoryList() {
      const prepareArr = this.subCategoryList
      prepareArr.map(item => {
        if (!item.categories) return
        item.categories.map(items => {
          // 添加 判断图片路径是否有效的 标识
          items.imgsrcTail = false
          if (!items.pic) return
          const imgPic = items.pic
          // 检索路径后四位是否为null
          const imgsrcTail = imgPic.slice(imgPic.length - 4, imgPic.length)
          if (imgsrcTail !== 'null') items.imgsrcTail = true
        })
      })
      return prepareArr
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!uni.getStorageSync('bbcUserInfo')) {
      this.queryUserInfo()
    }
    this.getCategory()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 加载导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.classifiedGoods
    })

    util.transTabbar()

    http.getCartCount()

    // #ifndef H5
    var logData = uni.getStorageSync('bbcFlowAnalysisLogDto')
    uni.setStorageSync('bbcStep', uni.getStorageSync('bbcStep') / 1 + 1)
    if (logData && logData.pageId != 6) {
      logData.pageId = 6
      logData.step = uni.getStorageSync('bbcStep')
      uni.setStorageSync('bbcFlowAnalysisLogDto', logData)
      http.saveLog(logData, 1)
    }
    // #endif
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const that = this
    setTimeout(() => {
      that.getCateorgy()
      wx.stopPullDownRefresh() // 停止下拉刷新
    }, 100)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
  methods: {
    /**
    * 获取用户信息
    */
    queryUserInfo: function () {
      const params = {
        url: '/p/user/userInfo',
        method: 'GET',
        data: {},
        dontTrunLogin: true,
        callBack: (res) => {
          console.log(1)
          this.userInfo = res
          uni.setStorageSync('bbcUserInfo', res)
        }
      }
      http.request(params)
    },
    getCategory() {

      var ths = this // 加载分类列表
      const params = {
        url: '/category/categoryInfo',
        method: 'GET',
        data: {
          parentId: '',
          userId: uni.getStorageSync('bbcUserInfo') ? uni.getStorageSync('bbcUserInfo').userId : ''
        },
        callBack: function (res) {
          console.log(2)
          ths.setData({
            categoryImg: res[0].pic,
            categoryList: res
          })
          if (ths.parentId == '') {
            ths.getProdList(res[0].categoryId)
          } else {
            ths.getProdList(res[ths.selIndex].categoryId)
          }
        }
      }
      http.request(params)
    },
    /**
     * 图片加载失败时，现实默认图片
     */
    handlePicError() {
      this.categoryImg = '../../static/images/icon/def.png'
    },
    /**
     * 分类点击事件，获取子分类
     */
    onMenuTab: function (e) {
      util.tapLog(3)
      // console.log(e);
      // var id = e.currentTarget.dataset.id
      var index = e.currentTarget.dataset.index // this.getProdList(id);

      this.getProdList(this.categoryList[index].categoryId)
      this.setData({
        categoryImg: this.categoryList[index].pic,
        selIndex: index
      })
    },
    // 跳转搜索页
    toSearchPage: function () {
      util.tapLog(3)
      uni.navigateTo({
        url: '/package-search/pages/search-page/search-page'
      })
    },

    getProdList(categoryId) {
      this.setData({
        parentId: categoryId
      }) // 加载子分类列表

      const params = {
        url: '/category/categoryInfo',
        method: 'GET',
        data: {
          parentId: categoryId,
          userId: uni.getStorageSync('bbcUserInfo') ? uni.getStorageSync('bbcUserInfo').userId : ''
        },
        callBack: (res) => {
          this.setData({
            subCategoryList: res
          })
        }
      }
      http.request(params)
    },

    // 跳转子分类商品页面
    toCatePage: function (e) {
      util.tapLog(3)
      const { type, parentid, categoryid, subcateindex } =
        e.currentTarget.dataset
      uni.navigateTo({
        url: `/package-prod/pages/sub-category/sub-category?parentId=${parentid}&categoryId=${type == 'all'
          ? this.subCategoryList[subcateindex].categories[0].categoryId
          : categoryid
          }`
      })
    }
  }
}
</script>
<style>
@import "./category.css";
</style>
