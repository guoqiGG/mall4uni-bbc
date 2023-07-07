
<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j select-type">
    <!-- <pord-title :prodTitle="'商品类目'" :isOpen="isOpen" @close="close" /> -->
    <!-- <view class="title"> -->
      <!-- <uni-search-bar class="uni-mt-10" radius="100" placeholder="请输入搜索类目" clearButton="none" cancelButton="none" @confirm="search" /> -->
      <!-- <search-bar :key-word="typeName" :placeholder="dataForm.selectType == 1 ? '请输入三级分类' : '请输入搜索类目'" @handleSearch="search" /> -->
      <!-- <view class="type">
        <view v-if="dataForm.selectType==1" :class="dataForm.selectType==1?'active':''" @tap="type=0">
          平台类目
        </view>
        <view v-if="dataForm.selectType==2" :class="dataForm.selectType==2?'active':''" @tap="type=1">
          店铺类目
        </view>
      </view> -->
    <!-- </view> -->
    <!-- 平台类目 -->
    <empty-tips
      v-if="isLoaded && ((dataForm.selectType == 1 && firstCat.dataList.length === 0) || (dataForm.selectType == 2 && shopList.length === 0))"
      :tips-list="['暂无数据']" />

    <view v-if="dataForm.selectType == 1" class="select">
      <!-- <view v-if="firstCat.dataList[0]" class="category">
        <text v-for="(item, index) in classifyNames" :key="index" @tap="classifyChange(item, index)">{{
          item.categoryName ? index == 2 ? item.categoryName : item.categoryName + ' > ' : '' }}</text>
        <text v-show="!classifyNames[2].categoryName || !classifyNames[2].categoryId" class="active">{{
          classifyGrade[firstCat.dataList[0].grade] }}</text>
      </view> -->
      <view v-for="(item, index) in firstCat.dataList" :key="index"
        :class="item.categoryId === dataForm.categoryId ? 'active list' : 'list'" @tap="switchProdType(item)">
        <view>
          <text>{{ item.categoryName }}</text>
        </view>
        <view v-show="item.categoryId !== dataForm.categoryId" class="iconfont">&#xe775;</view>
        <view v-show="item.categoryId === dataForm.categoryId" class="iconfont pitchOn">&#xe659;</view>
      </view>
    </view>
    <!-- 店铺类目 -->
    <view v-if="dataForm.selectType == 2" class="select">
      <view v-for="(item, index) in shopList" :key="index"
        :class="item.categoryId === dataForm.shopCategoryId ? 'active list' : 'list'" @tap="shopIdChange(item)">
        <view>
          <text>{{ item.categoryName }}</text>
        </view>
        <view v-if="item.categoryId === dataForm.shopCategoryId" class="iconfont check">&#xe659;</view>
      </view>
    </view>
  </view>
</template>

<script>
import SearchBar from '../../components/SearchBar/index.vue'

const http = require('@/utils/http.js')

export default {
  components: {
    SearchBar
  },

  props: {

  },

  data() {
    return {
      isLoaded: false, // 列表是否加载完毕
      typeName: '',
      allDataList: [],
      shopDataList: [],
      shopList: [],
      shopId: null,

      classifyGrade: ['一级分类', '二级分类', '三级分类'],
      classifyNames: [
        { categoryName: '', categoryId: null },
        { categoryName: '', categoryId: null },
        { categoryName: '', categoryId: null }
      ],

      firstCat: {
        id: 0,
        categoryName: '',
        dataList: []
      },
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
  created() {
    uni.setNavigationBarTitle({ title: this.dataForm.selectType === 1 ? '平台类目' : '店铺类目' })
  },

  mounted() {
    console.log('type',this.dataForm.selectType)
    if (this.dataForm.selectType === 1) {
      this.getDataList()
    } else if (this.dataForm.selectType === 2) {
      this.getShopDataList()
    }
    if (this.dataForm.classifyName[0]?.categoryId) {
      this.classifyNames = this.dataForm.classifyName
    }
  },

  methods: {

    // 获取平台类目
    getDataList() {
      this.isLoaded = false
      const params = {
        url: `/p/prod/listAvailableSigningCategory`,
        method: 'GET',
        data: {

        },
        callBack: res => {
          this.isLoaded = true
          // console.log(res)
          this.allDataList = res
          // if (this.dataForm.classifyName[this.dataForm.classifyName.length - 1].categoryName) {
          //   // console.log('123')
          //   this.firstCat.dataList = this.allDataList.filter(item => item.parentId === this.dataForm.classifyName[this.dataForm.classifyName.length - 1].parentId)
          // } else {
            this.firstCat.dataList = this.allDataList.filter(item => item.grade === 0 && item.status)
          // }
        }
      }
      http.request(params)
    },

    // 获取店铺类目
    getShopDataList() {
      this.isLoaded = false
      const params = {
        url: `/p/prod/listCategory`,
        method: 'GET',
        data: {
          status: 1
        },
        callBack: res => {
          this.isLoaded = true
          this.shopDataList = res
          this.shopList = this.shopDataList
          if (this.shopList.length === 0) {
            uni.showToast({
              title: '请前往pc端新增店铺类目',
              mask: true,
              icon: 'none',
              duration: 1500
            })
          }
        }
      }
      http.request(params)
    },

    // 平台类目选择
    switchProdType(index) {
 
       console.log(index)
        this.firstCat.id = index.categoryId

        // const fatherClassify = this.allDataList.filter(item => item.categoryId === index.parentId)
        // this.classifyNames[fatherClassify[0].grade] = JSON.parse(JSON.stringify(fatherClassify[0]))

        // 处理直接搜索没有一二级分类
        // if (!this.classifyNames[0].categoryName || !this.classifyNames[1].categoryName) {
        //   this.classifyNames[1] = (this.allDataList.filter(item => item.categoryId === this.classifyNames[2].parentId))[0]
        //   this.classifyNames[0] = (this.allDataList.filter(item => item.categoryId === this.classifyNames[1].parentId))[0]
        // }

        // if (fatherClassify[0].grade !== 0) {
        //   const fatherClassify1 = this.allDataList.filter(item => item.categoryId === fatherClassify[0].parentId)
        //   console.log(fatherClassify[0].grade)
        //   console.log(JSON.stringify(this.dataForm.classifyName[fatherClassify1[0].grade]))

        //   this.dataForm.classifyName[fatherClassify1[0].grade] = JSON.parse(JSON.stringify(fatherClassify[0]))
        // }

        // eslint-disable-next-line vue/no-mutating-props
        this.dataForm.categoryId = index.categoryId
        // eslint-disable-next-line vue/no-mutating-props
        this.dataForm.classifyName = [{categoryName:index.categoryName,categoryId:index.categoryId}]
        this.selected.categoryName = this.dataForm.classifyName.map(item => {
          return item.categoryName
        }).join('/')

        // console.log(this.selected.categoryName)
        // uni.redirectTo({
        //   url: '/package-publish-prod/pages/publish-prod/publish-prod'
        // })
        uni.navigateBack()
      // }
    },

    // 选择店铺分类
    shopIdChange(value) {
      console.log(value)
      this.shopId = value.categoryId
      // eslint-disable-next-line vue/no-mutating-props
      this.dataForm.shopCategoryId = this.shopId
      this.selected.shopCategoryName = value.categoryName
      // uni.redirectTo({
      //   url: '/package-publish-prod/pages/publish-prod/publish-prod'
      // })
      uni.navigateBack()
    },

    // 面包屑导航
    classifyChange(val, index) {
      // console.log(index)
      this.firstCat.dataList = this.allDataList.filter(item => item.parentId === val.parentId)
      this.dataForm.classifyName.forEach((item, i) => {
        if (i >= index) {
          item.categoryName = ''
        }
      })
    },

    // 搜索框
    search(typeName) {
      console.log(this.allDataList)
      if (typeName === '') {
        this.firstCat.dataList = this.allDataList.filter(item => (item.grade === 0))
        this.reset()

        return
      }
      if (this.dataForm.selectType === 1) {
        this.firstCat.dataList = this.allDataList.filter(item => (item.categoryName.indexOf(typeName) !== -1 && !item.status))
      } else {
        this.shopList = this.shopDataList.filter(item => (item.categoryName.indexOf(typeName) !== -1))
      }
      this.reset()
    },
    // 重置面包屑导航
    reset() {
      this.classifyNames = [
        { categoryName: '', categoryId: null },
        { categoryName: '', categoryId: null },
        { categoryName: '', categoryId: null }
      ]
    }

  }
}
</script>

<style lang="scss" scoped>
@import "./select-type.scss";
</style>
