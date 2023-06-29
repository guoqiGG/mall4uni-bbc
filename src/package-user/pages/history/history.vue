<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j history">
    <view v-for="(item, index) in browseLogData" :key="index" class="history-item">
      <view class="date">{{ item.time.substr(0,10) }}</view>
      <view class="line-prods">
        <view
          v-for="(prodItem, prodIndex) in item.list"
          :key="prodIndex"
          class="item"
          @tap="toProdDetail(prodItem.prodId)"
        >
          <view class="img">
            <image
              v-if="prodItem.pic && !prodItem.isPicError"
              style="height: 180rpx;"
              mode="aspectFit"
              :src="prodItem.pic.indexOf('http')===-1?picDomain+'shop/' + prodItem.pic:prodItem.pic"
              @error="handlePicError(prodItem)"
            />
            <image v-else mode="aspectFit" src="/static/images/icon/def.png" style="height: 180rpx;" />
          </view>
          <view class="text-box">
            <view class="name">{{ prodItem.prodName }}</view>
            <!-- <view class="sku">{{ prodItem.sellingPoint }}</view> -->
            <view class="price-box">
              <!-- <view v-if="prodItem.spuType === 3" class="price">
                <view class="big">{{ prodItem.scoreFee }}青春豆</view>
                <view v-if="prodItem.priceFee" class="symbol">+￥</view>
                <view v-if="prodItem.priceFee" class="big">{{ wxs.parsePrice(prodItem.priceFee)[0] }}</view>
                <view v-if="prodItem.priceFee" class="symbol">.{{ wxs.parsePrice(prodItem.priceFee)[1] }}</view>
              </view> -->
              <view class="price">
                <view class="symbol">￥</view>
                <view class="big">{{ prodItem.price }}</view>
              </view>
              <view class="btn" @tap.stop="deleteBrowseLogId(prodItem.prodBrowseLogId)">{{ i18n.deleteHistory }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空列表或加载全部提示 -->
    <EmptyAllTips
      v-if="isLoaded"
      :isEmpty="total===0"
      :emptyTips="i18n.historyEmpty"
      :isAll="isLoadAll"
    />

  </view>
</template>
<!-- <script module="wxs" lang="wxs" src="../../wxs/index.wxs"></script> -->

<script>
const http = require('@/utils/http.js')
const config = require('@/utils/config.js')
export default {
  data() {
    return {
      pageNum: 1, // 当前页
      browseLogList: [],
      pages: 0,
      total: 0,
      browseLogData: [], // 按时间分割后的商品游览记录列表
      isLoadAll: false,
      isShowPopup: false, // 弹窗显隐
      selectedId: '',
      picDomain: '',
      isLoaded: false
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  // 监听页面加载
  onLoad() {
    this.getBrowseLogList()
    this.picDomain = config.picDomain
  },
  onShow() {
    uni.setNavigationBarTitle({
      title: this.i18n.history
    })
  },

  // 页面上拉触底事件的处理函数
  onReachBottom() {
    if (this.pageNum < this.pages) {
      this.pageNum = this.pageNum + 1
      this.getBrowseLogList()
    } else {
      this.isLoadAll = true
    }
  },

  methods: {
    // 获取商品游览记录列表
    getBrowseLogList() {
      this.isLoaded = false
      const param = {
        url: '/p/prodBrowseLog/page',
        method: 'GET',
        data: {
          current: this.pageNum,
          size: 10
        },
        callBack: res => {
          this.isLoaded = true
          let list = []
          if (this.pageNum === 1) {
            list = res.records
          } else {
            list = this.browseLogList
            list = list.concat(res.records)
          }
          if (this.pageNum === res.pages) {
            this.isLoadAll = true
          }

          // 游览记录列表转换
          if (list.length) {
            this.convertBrowseLogList(list)
          } else {
            this.browseLogData = []
          }

          this.browseLogList = list
          this.pages = res.pages
          this.total = res.total
        }
      }
      http.request(param)
    },

    /**
			 * 商品游览记录按时间来划分商品列表
			 * 格式:[{time:time1,spuList:[]}, {time:time2,spuList:[]}]
			 * @param {Array} list 商品列表
			 */
    convertBrowseLogList(list) {
      let currentTime = list[0].browseTime
      let tempSpuList = []
      const browseLogData = []
      console.log(list[0].browseTime)
      for (let i = 0; i < list.length; i++) {
        if (currentTime === list[i].browseTime) {
          tempSpuList.push(list[i])
          if ((i + 1) === list.length) {
            const browseLogItem = {
              time: list[i].browseTime,
              list: tempSpuList
            }
            browseLogData.push(browseLogItem)
          }
        } else {
          currentTime = list[i].browseTime
          const browseLogItem = {
            time: list[i - 1].browseTime,
            list: tempSpuList
          }
          browseLogData.push(browseLogItem)
          tempSpuList = []
          tempSpuList.push(list[i])
          if ((i + 1) === list.length) {
            const browseLogItem = {
              time: list[i].browseTime,
              list: tempSpuList
            }
            browseLogData.push(browseLogItem)
          }
        }
      }
      this.browseLogData = browseLogData
    },

    // 删除游览记录
    deleteBrowseLogId(spuBrowseLogId) {
      const _that = this
      uni.showModal({
        title: this.i18n.prompt,
        content: this.i18n.deleteHistoryTips,
        success: function(res) {
          if (res.confirm) {
            const param = {
              url: '/p/prodBrowseLog',
              method: 'DELETE',
              data: [spuBrowseLogId],
              callBack: res => {
                // this.pageNum = 1
                _that.pageNum = 1
                _that.getBrowseLogList()
              }
            }
            http.request(param)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    toProdDetail(prodId) {
      uni.navigateTo({
        url: '/package-prod/pages/prod/prod?prodId=' + prodId
      })
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
	@import "./history.css";
</style>
