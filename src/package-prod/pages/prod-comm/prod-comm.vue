<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <view class="comm-list">
      <view
        v-for="(item, index) in orderItemInfo"
        :key="index"
        class="comm-item"
      >
        <!-- 商品标题内容 -->
        <view class="item-top">
          <view class="top-pic">
            <ImgShow :src="item.pic" imgMode="widthFix" isSync />
          </view>
          <view class="top-tit">{{ item.prodName + (item.skuName ? ' ' + item.skuName : '') }}</view>
        </view>
        <!-- 评价星级 -->
        <view class="item-star">
          <view>{{ i18n.score }}</view>
          <comm-star
            :value="item.score ? item.score : 5"
            type="write"
            :index="index"
            @onStarChange="onStarChange"
          />
        </view>
        <!-- 内容填写 -->
        <view class="item-con">
          <textarea
            v-model="item.content"
            :placeholder="i18n.shareTips"
            maxlength="500"
            :data-index="index"
            @input="onContentInput"
          />
        </view>
        <!-- 添加图片 -->
        <view class="item-pics">
          <!-- 预览缩略图 -->
          <view class="question-images">
            <block v-for="(imgItem, idx) in item.images" :key="idx">
              <view class="q-image-wrap">
                <!-- 图片缩略图  -->
                <ImgShow :src="imgItem.url" :classList="['q-image']" imgMode="aspectFill" @handleTap="()=>comPicPreView(idx,index)" />
                <!-- 移除图片的按钮  -->
                <view
                  class="q-image-remover"
                  :data-idx="idx"
                  :data-index="index"
                  @tap="removeImage"
                >{{ i18n.delete }}</view>
              </view>
            </block>
            <!-- 添加 -->
            <view
              v-if="item.images.length < 9"
              class="add-pic"
              :data-idx="index"
              @tap="getUploadImg"
            >+</view>
          </view>
        </view>
        <!-- 提示 -->
        <view class="img-tip">({{ i18n.maxUpPic }})</view>
        <!--/提示-->
        <!-- 匿名评价 -->
        <view class="item-btm">
          <checkbox
            color="red"
            :data-index="index"
            :checked="item.isAnonymous == 1"
            @tap="onSelectedItem"
          >{{ i18n.anonymousEvaluation }}</checkbox>
        </view>
      </view>
    </view>

    <view class="comm-btn" @tap="submitComm">{{ i18n.postReview }}</view>
    <hCompress ref="hCompress" />
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')
import commStar from '../../../components/comm-star/index.vue'
import hCompress from '@/components/helang-compress/helang-compress'
export default {
  components: {
    commStar,
    hCompress
  },
  props: {},
  data() {
    return {
      orderItemInfo: [], // 订单列表页参数
      submitCommCount: 0, // 已经提交的评论数量
      content: '' // 评论内容
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
    const orderItemInfo = uni.getStorageSync('bbcOrderItemInfo')
    for (var i = 0; i < orderItemInfo.length; i++) {
      orderItemInfo[i].images = []
      orderItemInfo[i].content = ''
      orderItemInfo[i].score = 5
      orderItemInfo[i].isAnonymous = 1
      orderItemInfo[i].evaluate = 0
    }
    this.setData({
      orderItemInfo: orderItemInfo
    })
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
      title: this.i18n.productEvaluation
    })
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
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  methods: {
    /**
     * 发表评论
     */
    submitComm: function(e) {
      var orderItemInfo = this.orderItemInfo
      var allFill = true

      for (let i = 0; i < orderItemInfo.length; i++) {
        var cont = orderItemInfo[i].content.trim()

        if (cont == '') {
          uni.showToast({
            title: this.i18n.evaluationEmpty,
            icon: 'none'
          })
          allFill = false
          break
        }
      }

      if (allFill) {
        const time = util.formatTime(new Date())
        for (let i = 0; i < orderItemInfo.length; i++) {
          var pics = ''
          orderItemInfo[i].images.forEach(function(item) {
            pics += item.path + ','
          })

          if (pics != '') {
            pics = pics.substring(0, pics.length - 1)
          } // 发布评论

          const params = {
            url: '/p/prodComm',
            method: 'POST',
            data: {
              content: orderItemInfo[i].content,
              score: orderItemInfo[i].score,
              evaluate: orderItemInfo[i].evaluate,
              isAnonymous: orderItemInfo[i].isAnonymous,
              orderItemId: orderItemInfo[i].orderItemId,
              prodId: orderItemInfo[i].prodId,
              pics: pics,
              recTime: time
            },
            callBack: (res) => {
              this.setData({
                submitCommCount: this.submitCommCount + 1
              })
              if (this.submitCommCount == orderItemInfo.length) {
                uni.showModal({
                  title: '',
                  content: this.i18n.evaluationSuccessful,
                  showCancel: false,
                  cancelText: this.i18n.cancel,
                  confirmText: this.i18n.confirm,
                  success: (res) => {
                    if (res.confirm) {
                      var page = getCurrentPages().pop()
                      if (page) {
                        uni.navigateBack()
                      } else {
                        uni.redirectTo({
                          url: '/pages/order-list/order-list?sts=5',
                          success: function(e) {
                            var page = getCurrentPages().pop() // 跳转页面成功之后
                            if (!page) return
                            // console.log(page)
                            page.onLoad() // 如果页面存在，则重新刷新页面
                          }
                        })
                      }
                    }
                  }
                })
              }
            }
          }
          http.request(params)
        }
      }
    },

    /**
     * 上传图片
     */
    getUploadImg: function(e) {
      const idx = e.target.dataset.idx
      uni.chooseImage({
        count: 9 - this.orderItemInfo[idx].images.length,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: (res) => {
          console.log('当前的图片', res)
          const tempFiles = res.tempFiles
          for (const item of tempFiles) {
            let _type = item.type
            // #ifndef H5
            const _path = item.path
            _type = _path.substring(_path.lastIndexOf('.'))
            // #endif
            // 限制图片上传格式
            if (_type.indexOf('png') === -1 && _type.indexOf('jpg') === -1 && _type.indexOf('jpeg') === -1) {
              uni.showToast({
                title: this.i18n.uploadPictureFile,
                icon: 'none'
              })
              return
            }
          }

          const tempFilePaths = res.tempFilePaths
          const params = {
            url: '/p/file/upload',
            filePath: tempFilePaths[0],
            name: 'file',
            callBack: (res2) => {
              var img = {}
              img.path = res2.filePath
              img.url =
               res2.resourcesUrl + res2.filePath
              this.orderItemInfo[idx].images.push(img)
            }
          }

          tempFilePaths.forEach((item, index) => {
            const obj = {
              src: item,
              quality: 0.2
            }
            this.$refs.hCompress.compress(obj, tempFiles[index], 10).then(res => {
              params.filePath = res
              http.upload(params)
            })
          })
        }
      })
    },

    /**
      * 判断选择的图片是否小于10M
      * @param {Array} tempFiles 上传的图片临时文件数组
      * @return {Boolean} 是否小于10M
      */
    lessThan10M(tempFiles) {
      let flag = true
      for (let i = 0; i < tempFiles.length; i++) {
        const file = tempFiles[i]
        if (file.size > 1024 * 1024 * 10) {
          uni.showToast({
            title: this.i18n.lessThan10M,
            duration: 2000,
            icon: 'none'
          })
          flag = false
          break
        }
      }
      return flag
    },

    /**
     * 评价图片预览
     */
    comPicPreView(idx, index) {
      var urls = []
      this.orderItemInfo[index].images.forEach((el) => {
        urls.push(el.url)
      })
      uni.previewImage({
        current: urls[idx],
        urls: urls
      })
    },

    /**
     * 删除图片
     */
    removeImage(e) {
      const idx = e.target.dataset.idx
      const index = e.target.dataset.index
      var orderItemInfo = this.orderItemInfo
      orderItemInfo[index].images.splice(idx, 1)
      this.setData({
        orderItemInfo: orderItemInfo
      })
    },

    onContentInput: function(e) {
      const index = e.target.dataset.index
      var orderItemInfo = this.orderItemInfo
      orderItemInfo[index].content = e.detail.value
      this.setData({
        orderItemInfo: orderItemInfo
      })
    },

    /**
     * 匿名评价
     * 每一项的选择事件
     */
    onSelectedItem: function(e) {
      var index = e.target.dataset.index // 获取data- 传进来的index

      var orderItemInfo = this.orderItemInfo // 获取评论项

      var isAnonymous = orderItemInfo[index].isAnonymous // 获取当前评价的选中状态

      if (isAnonymous == 1) {
        isAnonymous = 0
      } else {
        isAnonymous = 1
      }

      orderItemInfo[index].isAnonymous = isAnonymous // 改变状态

      this.setData({
        orderItemInfo: orderItemInfo
      })
    },
    onStarChange: function(e) {
      var index = e.idx
      var val = e.val
      var evaluate = 0
      var orderItemInfo = this.orderItemInfo

      if (val < 3) {
        evaluate = 2
      } else if (val == 3) {
        evaluate = 1
      }

      orderItemInfo[index].score = val
      orderItemInfo[index].evaluate = evaluate
      this.setData({
        orderItemInfo: orderItemInfo
      })
    },
    /**
     * 使用默认图片
     */
    handlePicError(item) {
      item.isPicError = true
    }
  }
}
</script>
<style>
@import "./prod-comm.css";
</style>
