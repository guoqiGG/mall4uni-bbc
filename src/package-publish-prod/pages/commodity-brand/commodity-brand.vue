
<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j commodity-brand">
    <!-- <pord-title :prodTitle="'商品品牌'" :isOpen="isOpen" @close="close" /> -->
    <view class="title">
      <!-- <uni-search-bar class="uni-mt-10" radius="100" placeholder="搜索品牌名称" clearButton="none" cancelButton="none" @confirm="search" /> -->
      <search-bar
        :key-word="name"
        :placeholder="'搜索品牌名称'"
        @handleSearch="search"
      />
    </view>

    <!-- <view class="body">
      <view v-for="(item,index) in brandList" :key="index" class="list" @tap="brandType(item)">
        <view>{{ item.name }}</view><view class="initial">{{ item.firstLetter }}</view>
      </view>
    </view>

    <view v-show="brandList.length!==0" class="footer">
      <uni-pagination title="" :total="total" :pageSize="size" :value="current" @change="dataChange" />
    </view> -->
    <!-- <view v-for="(val,key,i) in arr" :key="i">{{ key }}</view> -->
    <empty-tips v-show="isLoaded && Object.getOwnPropertyNames(brandList).length===1" :tips-list="['暂无数据']" />

    <view class="conter">
      <view v-for="(val,key,i) in brandList" :key="i">
        <view class="caption">{{ key }}</view>
        <view class="body">
          <view v-for="(item,index) in val" :key="index" :class="['list',dataForm.brandId===item.brandId?'active':'']" @tap="brandType(item)">
            <text class="text">{{ item.name }}</text><text class="iconfont">&#xe659;</text>
          </view>
        <!-- <view class="list active">
          <text>宝卡里</text><text class="iconfont">&#xe659;</text>
        </view> -->
        </view>
      </view>
      <view v-if="!falg && Object.getOwnPropertyNames(brandList).length!==1" class="hint">没有更多数据了</view>
      <view class="delivery">
        <button type="primary" @tap="toProd">确定</button>
      </view>
    </view>

  </view>
</template>

<script>
const http = require('@/utils/http.js')
import SearchBar from '../../components/SearchBar/index.vue'

export default {
  components: {
    SearchBar
  },

  data() {
    return {
      isLoaded: false, // 列表是否加载完毕
      name: '',
      current: 1,
      size: 20,
      total: 0,
      brandList: {},
      falg: true

    }
  },
  computed: {
    dataForm: {
      get() { return this.$store.state.prod.dataForm },
      set(val) { this.$store.commit('prod/updateDataForm', val) }

    },
    selected: {
      get() { return this.$store.state.prod.selected },
      set(val) { this.$store.commit('prod/updateSelected', val) }
    }
  },
  mounted() {
    this.getDataList()
  },

  onReachBottom() {
    console.log('888')
    if (!this.falg) {
      return
    }
    this.current++
    this.getDataList({ current: this.current })
  },
  methods: {

    getDataList({ current = 1, brandName = '' } = {}) {
      console.log(current)
      uni.showLoading({
        title: ''
      })
      this.isLoaded = false
      const params = {
        url: `/p/prod/listAvailableByCategoryAndName`,
        method: 'GET',
        data: {
          categoryId: this.dataForm.categoryId,
          size: this.size,
          current,
          brandName
        },
        callBack: res => {
          this.isLoaded = true
          if (res.records.length === 0) {
            this.falg = false
          }
          for (var i = 0; i < res.records.length; i++) {
            var index = true
            for (var key in this.brandList) {
              if (res.records[i].firstLetter === key) {
                this.brandList[key].push(res.records[i])
                index = false
              }
            }
            if (index) {
              // this.arr[res.records[i].firstLetter] = []
              this.$set(this.brandList, res.records[i].firstLetter, [])
              i--
            }
          }
          uni.hideLoading()
          // console.log(res)
          this.current = res.current
          this.total = res.total
          // this.dataList = res.records.sort((a, b) => {
          //   return a.firstLetter.localeCompare(b.firstLetter)
          // })
          // this.dataList = res.records
          // this.brandList = this.dataList
        }
      }
      http.request(params)
    },
    // 搜索框
    search(name) {
      this.brandList = {}
      this.getDataList({ brandName: name })
    },
    dataChange(value) {
      this.getDataList({ current: value.current })
    },
    toProd() {
      // uni.redirectTo({
      //   url: '/package-publish-prod/pages/publish-prod/publish-prod'
      // })
      uni.navigateBack()
    },
    // 选择品牌
    brandType(index) {
      // console.log(index)
      // if (index) {
      //   this.brandId = index.brandId
      //   this.brandName = index.name
      // } else {
      //   this.brandId = null
      //   this.brandName = ''
      // }
      if (this.dataForm.brandId === index.brandId) {
        this.$set(this.dataForm, 'brandId', null)
        this.dataForm.brandName = ''
      } else {
        this.$set(this.dataForm, 'brandId', index.brandId)
        this.dataForm.brandName = index.name
      }
    }
  }
}
</script>

<style lang="scss" scoped>
 .commodity-brand{
   display: flex;
   flex-direction: column;
   width: 100%;
    // position: fixed;
    // overflow: auto;
    top: 0;
    left: 0;
    // min-height: 100vh;
    font-size: 28rpx;
    background-color: #f8f8f8;
    height: 100vh;
    color: #333;
    font-family: PingFang SC;

    .conter{
      // overflow: auto;
      padding-bottom: 110rpx;
    }

    .title{
      padding: 20rpx 30rpx 32rpx;
      background-color: #fff;
      border-radius:0 0 10rpx 10rpx;

      input{
        background-color: #F7F8FA;
        height: 64rpx;
        border-radius: 32rpx;
        padding-left: 30rpx;
        font-size: 24rpx;
      }
      .uni-searchbar{
        padding: 0;
      }
    }
    .caption{
      // width: 100%;
      height: 60rpx;
      line-height: 60rpx;
      background-color: #f2f3f7;
      padding: 0 30rpx;
    }

    .body{
      border-radius: 10rpx;
      padding: 0 30rpx;
      background-color: #fff;

      .list{
        height: 90rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom:2rpx solid #F2F2F2 ;

        .iconfont{
          font-size: 34rpx;
          color: #fff;
        }
        .text{
        max-width: 600rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow:ellipsis
        }
      }

      .active{
          color: #082BA6;

          .iconfont{
           color: #082BA6;
        }

      }

    }
    .delivery{
      background-color: #fff;
      width: 700rpx;
      position: fixed;
      left: 0;
      bottom: 0;
      padding: 20rpx 30rpx;

      button{
      background-color:#F81A1A ;

      }
    }
    .hint{
      font-size: 24rpx;
      color: #999;
      text-align: center;
      background-color: #f2f3f7;
    }

    // .body{
    //   background-color: #fff;
    //   padding: 0 30rpx;
    //   .list{
    //     line-height: 90rpx;
    //     height:90rpx ;
    //     display: flex;
    //     justify-content: space-between;
    //     border-bottom: 2rpx solid #F2F2F2;

    //     view{
    //       max-width: 600rpx;
    //       white-space: nowrap;
    //       overflow: hidden;
    //       text-overflow:ellipsis
    //     }
    //     .initial{
    //       width: 30rpx;
    //       text-align: center;
    //     }
    //   }
    // }
    // .footer{
    //   background-color: #fff;
    //   padding:30rpx;

    // }
  }
</style>
