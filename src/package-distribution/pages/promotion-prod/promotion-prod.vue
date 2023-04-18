<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j">
    <view class="promotionProd">
      <!-- 搜索框 -->
      <view class="pd-seach">
        <input type="text" :placeholder="i18n.enterProductName" confirm-type="search" @input="onProdNameInput" @confirm="onProdNameSearch"></input>
        <view class="pd-seach-icon">
          <image src="../../static/images/icon/sousuo.png" />
        </view>
      </view>

      <!--头部导航tab -->
      <view class="pd-tab">
        <view class="pd-tab-list">
          <!-- <view class="tab-item {{sort==0 && (orderBy==1?'down':'up')}}" bindtap='onTabTouch' data-sort='0'>佣金</view> -->
          <view :class="'tab-item ' + (sort==1 && (orderBy==1?'down':'up'))" data-sort="1" @tap="onTabTouch">{{ i18n.newest }}</view>
          <view :class="'tab-item ' + (sort==2 && (orderBy==1?'down':'up'))" data-sort="2" @tap="onTabTouch">{{ i18n.sales }}</view>
          <view :class="'tab-item ' + (sort==3 && (orderBy==1?'down':'up'))" data-sort="3" @tap="onTabTouch">{{ i18n.price }}</view>
        </view>
      </view>

      <view class="pd-main">
        <!-- 商品项 -->
        <view v-for="(item, index) in records" :key="index" class="pd-item">
          <view class="pd-item-top">
            <view class="pd-item-left">
              <image :src="item.pic" @error="imgErr(index)" />
            </view>
            <view class="pd-item-right">
              <view class="pd-item-tit">{{ item.prodName }}</view>
              <view class="pd-item-price">
                <text>￥</text>{{ toPrice(item.price) }}</view>
              <view class="pd-item-info">
                <text class="rate">{{ i18n.expectedEarn }} {{ item.awardNumber }}{{ item.awardProportion==0?'%':i18n.yuan }}</text>
                <view class="pd-item-btm">
                  <view class="btn" @tap="onShowShare(item)">{{ i18n.shareIt }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 商品项 end -->
      </view>
      <!-- <view v-if="records.length==0" class="empty">{{ emptyMsg }}</view>
      <view v-if="totalPage>1" class="loading">{{ loadingMsg }}</view> -->
      <!-- 空列表或加载全部提示 -->
      <EmptyAllTips
        v-if="isLoaded"
        :isEmpty="records.length == 0"
        :emptyTips="emptyMsg"
        :isAll="totalPage > 1"
        :allTips="loadingMsg"
      />
    </view>

    <!-- 分享弹窗 -->
    <view v-if="shareShow" class="promo-share">
      <view style="position:relative;display:block">
        <canvas
          :style="{ width: canvasW + 'px',
                    height: canvasH + 'px',
                    'margin-top': marginTopCanvas + 'px',
                    position: 'fixed',
                    top: '1000000px' }"
          canvas-id="myCanvas"
        />
      </view>
      <image v-if="showCanvasImg" :src="shareImgUrl" :style="{ width: canvasW + 'px', height: canvasH + 'px', 'margin-top': marginTopCanvas + 'px' }" class="share-img" />
      <view v-if="showShareBtn" class="promo-main">
        <!-- #ifndef H5  -->
        <view class="promo-tit">
          <title>{{ i18n.shareImgTo }}</title>
        </view>
        <!-- #endif -->
        <!-- #ifdef H5  -->
        <view v-if="isWechat" class="promo-tit">
          <title>{{ i18n.shareImgTo }}</title>
        </view>
        <!-- #endif -->
        <view class="promo-icons">
          <!-- #ifdef H5  -->
          <view v-if="isWechat" class="promo-img1" @tap="onShareWay">
            <view class="promo-img1-icon"><image src="../../../static/images/icon/wetchat.png" mode="aspectFit" /></view>{{ i18n.shareIt }}
          </view>
          <view v-if="!isWechat" class="promo-tit1">
            {{ i18n.saveImgH5 }}
          </view>
          <!-- #endif -->
          <!-- #ifndef H5  -->
          <view class="promo-img1" @tap="saveImg">
            <view class="promo-img1-icon"><image src="../../../static/images/icon/export.png" mode="aspectFit" /></view>{{ i18n.saveImg }}
          </view>
          <!-- #endif -->
        </view>
        <view class="promo-close" @tap="closeEarn">
          {{ i18n.cancel }}
        </view>
      </view>
    </view>
    <!-- 分享弹窗 end -->

    <!-- 二维码弹窗 -->
    <view v-if="wxCodeShow" class="code-popup">
      <view class="code-main">
        <view class="close-v" @tap.stop="closeCodePopup">
          <image src="../../../static/images/icon/close.png" class="close-png" />
        </view>
        <view class="code-v">
          <image :src="shareWxCode" class="wx-code" />
        </view>
        <!-- #ifndef H5 -->
        <view class="code-txt" @tap="downloadImg">{{ i18n.saveAlbum }}</view>
        <!-- #endif -->
      </view>
    </view>
    <!-- 二维码弹窗 end -->

    <!-- 引导分享蒙版 -->
    <view v-if="guideShare" class="guide-share-mask">
      <view class="mask" />
      <view class="guide-content">
        <view class="close" @tap="guideShare=false">
          <image src="../../../static/images/icon/close.png" />
        </view>
        <view class="share-img">
          <image src="../../../static/images/icon/shareIcon.png" />
        </view>
        <view class="share-word">
          <view class="big-word">{{ i18n.shareFriendsNow }}</view>
          <view class="small-word">{{ i18n.shareFriendsTips2 }}</view>
        </view>
      </view>
    </view>
    <!-- 引导分享蒙版 end -->
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
const config = require('../../../utils/config.js')
var Qr = require('../../../utils/wxqrcode.js')
import Wechat from '../../../utils/wechat.js'
// import html2canvas from 'html2canvas'
import dp from './drawPosters.js'
export default {

  components: {},
  props: {},
  data() {
    return {
      isWechat: false, // 是否为微信环境
      records: [],
      shareShow: false,
      showShareBtn: false, // 分享栏
      showCanvasImg: true, // 海报图片（小程序不显示）
      wxCodeShow: false,
      shareProdId: 0,
      shareProdName: '',
      sharePic: '',
      sharePrice: '',
      shareWxCode: '',
      // 分享商品微信二维码
      // loadingMsg: "正在加载..",
      loadingMsg: '',
      emptyMsg: '',
      totalPage: 1,
      pageNum: 1,
      prodName: '',
      // 搜索的名称
      orderBy: 1,
      // 排序(0升序 1降序) 默认1
      sort: 1, // 排序(0 佣金排序 1时间排序 2销量排序 3价格排序) 默认1
      path: '', // 链接
      guideShare: false, // 引导蒙版

      canvasW: 0, // 画布宽
      canvasH: 0, // 画布高
      canvasHMax: 0, // 画布最大高
      systemInfo: {},
      shareImgUrl: '',
      marginTopCanvas: 0,
      isLoaded: false
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  onShow: function() {
    // 头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.promoteGoods
    })

    this.loadingMsg = this.i18n.loading
    this.getDisInfo()
  },

  /**
		 * 生命周期函数--监听页面加载
		 */
  onLoad: function(options) {
    // #ifdef H5
    this.isWechat = Wechat.isWechat()
    // #endif
    // #ifdef APP-PLUS
    this.isWechat = false
    // #endif
    // #ifdef MP-WEIXIN
    this.isWechat = true
    // #endif
    this.loadPageData(1)
    this.getShareLink()
  },

  /**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
  onPullDownRefresh: function() {
    this.loadPageData(1)
  },

  /**
		 * 页面上拉触底事件的处理函数
		 */
  onReachBottom: function() {
    if (this.pageNum < this.totalPage) {
      this.loadPageData(this.pageNum + 1)
    }
  },

  methods: {
    // 加载分页数据
    loadPageData: function(pageNum) {
      this.isLoaded = false
      var ths = this
      http.request({
        url: '/p/distribution/prod/page',
        method: 'GET',
        data: {
          // shopId: 1,
          current: pageNum,
          orderBy: this.orderBy,
          prodName: this.prodName,
          size: 20,
          sort: this.sort
        },
        callBack: res => {
          this.isLoaded = true
          var records = []
          if (res.current == 1) {
            records = res.records
          } else {
            records = this.records.concat(res.records)
          }
          var loadingMsg = this.loadingMsg
          if (pageNum == res.pages) {
            loadingMsg = ths.i18n.noMore
          }
          ths.setData({
            records: records,
            totalPage: res.pages,
            pageNum: pageNum,
            loadingMsg: loadingMsg,
            emptyMsg: ths.i18n.noPromotionProduct
          })
        }
      })
    },

    /**
			 * 点击导航菜单
			 */
    onTabTouch: function(e) {
      var sort = e.currentTarget.dataset.sort

      if (sort == this.sort) {
        this.setData({
          orderBy: this.orderBy == 0 ? 1 : 0
        })
        this.loadPageData(1)
      } else {
        this.setData({
          sort: sort,
          orderBy: 1
        })
        this.loadPageData(1)
      }
    },

    /**
			 * 名称输入
			 */
    onProdNameInput: function(e) {
      this.setData({
        prodName: e.detail.value.trim()
      })
    },

    /**
			 * 搜索
			 */
    onProdNameSearch: function() {
      this.loadPageData(1)
    },

    /**
			 * 获取分销员信息
			 */
    getDisInfo() {
      http.request({
        url: '/p/distribution/user/distributionUserInfo',
        method: 'GET',
        data: {
          shopId: 1
        },
        callBack: res => {
          if (res.state === -1) {
            this.setData({
              shareShow: false
            })
            uni.showModal({
              title: '',
              showCancel: false,
              content: this.i18n.distributorBanned,
              confirmText: this.i18n.confirm,
              confirmColor: '#eb2444',
              success(res) {
                if (res.confirm) {
                  uni.switchTab({
                    url: '/pages/user/user'
                  })
                }
              }
            })
          }

          if (res.state === 2) {
            this.setData({
              shareShow: false
            })
            uni.showToast({
              title: this.i18n.distributorCleared,
              icon: 'none',
              // #ifndef MP-TOUTIAO
              mask: true
              // #endif
            })
            uni.showModal({
              title: '',
              content: this.i18n.distributorCleared,
              confirmText: this.i18n.confirm,
              confirmColor: '#eb2444',
              showCancel: false,
              success(res) {
              }
            })
          }
        }
      })
    },

    /**
			 * 生成复制分享链接
			 */
    getShareLink: function() {
      // 从缓存获取分销员卡号，如果没有则去接口获取，以备转发时使用
      var cardno = wx.getStorageSync('bbcDistCardNo')
      if (!cardno) {
        http.request({
          url: '/p/distribution/user/distributionUserInfo',
          method: 'GET',
          callBack: res => {
            wx.setStorageSync('bbcDistCardNo', res.cardNo)
          }
        })
      }
      this.path = '/pages/prod/prod?prodId=' + this.shareProdId + '&cardno=' + cardno
    },

    // 海报绘制完成
    completeDraw() {
      const that = this
      // #ifdef MP-WEIXIN
      wx.showShareImageMenu({
        path: this.shareImgUrl,
        success: res => {
          that.shareShow = false
        },
        fail: err => {
          that.shareShow = false
          console.log(err)
        }
      })
      // #endif

      // #ifdef APP-PLUS
      // uni.downloadFile({
      //   url: this.shareImgUrl,
      //   success: (res) => {
      //     plus.share.sendWithSystem({ type: 'image', pictures: res.tempFilePath }, function() {
      //       uni.showToast({
      //         icon: 'none',
      //         mask: true,
      //         title: this.i18n.shareSuccess
      //       })
      //     }, function(e) {
      //       uni.showToast({
      //         icon: 'none',
      //         mask: true,
      //         title: this.i18n.ShareFailed
      //       })
      //     })
      //   },
      //   fail: () => {
      //     that.shareShow = false
      //   }
      // })
      // #endif
    },

    // 商品图片加载失败
    imgErr(index) {
      this.records[index].pic = '/static/images/icon/def.png'
    },

    /**
			 * 显示分享弹窗
			 */
    onShowShare(item) {
      const that = this
      this.getDisInfo()
      this.shareImgUrl = ''
      this.shareShow = true
      // #ifndef MP-WEIXIN
      this.showShareBtn = true
      // #endif
      // #ifdef MP-WEIXIN
      this.showCanvasImg = false
      // #endif
      this.shareProdId = item.prodId
      this.shareProdName = item.prodName
      this.sharePic = item.pic
      this.sharePrice = item.price
      uni.getSystemInfo({
        success: function(res) {
          that.systemInfo = res
          that.canvasW = res.windowWidth * 0.8
          that.canvasHMax = (res.windowHeight - (400 * res.windowWidth / 750)) * 0.9
          that.marginTopCanvas = (res.windowHeight - (400 * res.windowWidth / 750)) * 0.1 * 0.7
        }
      })
      this.getShareLink()
      // 从缓存获取分销员卡号，如果没有则去接口获取，以备转发时使用
      var cardno = wx.getStorageSync('bbcDistCardNo')
      if (!cardno) {
        http.request({
          url: '/p/distribution/user/distributionUserInfo',
          method: 'GET',
          selfLoading: true,
          callBack: res => {
            wx.setStorageSync('bbcDistCardNo', res.cardNo)
            this.genWeixinCode()
          }
        })
      } else {
        this.genWeixinCode()
      }
    },

    /**
			 * 关闭分享弹窗
			 */
    closeEarn: function() {
      this.setData({
        shareShow: false,
        shareImgUrl: ''
      })
    },

    /**
			 * 用户点击分享到微信小程序
			 * @param {Object} sharedata 支付需要的参数
			 * @param {Object} cb 成功回调
			 * @param {Object} errorCb 失败回调
			 */
    onShareWay(scene) {
      if (this.isWechat) {
        var cardno = wx.getStorageSync('bbcDistCardNo')
        var sharedata = {
          title: this.shareProdName, // 分享标题
          imgUrl: this.sharePic, // 分享图标
          link: config.domainAddress + '/pages/prod/prod?prodId=' + this.shareProdId + '&cardno=' + cardno, // 分享链接
          desc: this.i18n.shartTips // 分享描述
        }
        Wechat.callWexinShare(sharedata, () => {
          this.shareShow = false
          this.guideShare = true
        }, (failMsg) => {
          console.log('shareFailMsg', failMsg)
        })
      }

      // #ifdef APP-PLUS
      // uni.downloadFile({
      //   url: this.shareImgUrl,
      //   success: (res) => {
      //     plus.share.sendWithSystem({ type: 'image', pictures: res.tempFilePath }, function() {
      //       uni.showToast({
      //         icon: 'none',
      //         mask: true,
      //         title: this.i18n.shareSuccess
      //       })
      //     }, function(e) {
      //       uni.showToast({
      //         icon: 'none',
      //         mask: true,
      //         title: this.i18n.ShareFailed
      //       })
      //     })
      //   }
      // })
      // #endif
    },

    /**
			 * 用户点击转发
			 */
    onShareAppMessage: function(res) {
      if (res.from === 'button') {
        var cardno = uni.getStorageSync('bbcDistCardNo')
        return {
          title: this.shareProdName,
          path: '/pages/prod/prod?prodId=' + this.shareProdId + '&cardno=' + cardno + '&type=' + this.shareType,
          imageUrl: this.sharePic,
          success: function(res) {
            // 转发成功
          },
          fail: function(res) {
            // 转发失败
          }
        }
      }
    },

    /**
			 * 生成小程序二维码
			 */
    genWeixinCode() {
      var cardNo = wx.getStorageSync('bbcDistCardNo')
      var content = JSON.stringify({
        shareProdId: this.shareProdId,
        cardNo: cardNo
      })

      // #ifdef H5 || APP-PLUS
      const code = `${config.domainAddress}/pages/prod/prod?prodId=${this.shareProdId}&cardno=${cardNo}`
      this.shareWxCode = Qr.createQrCodeImg(code, { size: 250 })
      // this.wxCodeShow = true
      // this.shareShow = false
      dp.drawPosters(this)
      // #endif

      const params = {
        url: '/qrcodeTicket/miniQrCode',
        method: 'GET',
        responseType: 'arraybuffer',
        data: {
          content: content,
          type: 2
        },
        callBack: res => {
          // 微信小程序
          this.setData({
            // wxCodeShow: true,
            // shareShow: false,
            shareWxCode: uni.arrayBufferToBase64(res)
          })
          dp.drawPosters(this)
        }
      }

      // #ifdef MP-WEIXIN
      http.request(params)
      // #endif
    },

    /* 保存图片 */
    saveImg() {
      const that = this

      // #ifdef H5
      // var a = document.createElement('a') // 创建a 标签
      // a.href = this.shareImgUrl // 把图片路径赋到a标签的href上
      // a.download = this.shareImgUrl.replace(/(.*\/)*([^.]+.*)/gi, '$2').split('?')[0] // 图片文件名
      // // 创建鼠标事件并初始化
      // var e = new MouseEvent('click', (true, false, window))
      // // 执行保存到本地
      // a.dispatchEvent(e)
      // if (this.shareImgUrl) {
      //   uni.showToast({
      //     icon: 'none',
      //     mask: true,
      //     title: that.i18n.savedSuccessfully
      //   })
      // } else {
      //   uni.showToast({
      //     icon: 'none',
      //     mask: true,
      //     title: that.i18n.savedFailfully
      //   })
      // }
      // #endif

      // #ifndef H5
      uni.saveImageToPhotosAlbum({
        filePath: this.shareImgUrl,
        success: function() {
          uni.showToast({
            icon: 'none',
            mask: true,
            title: that.i18n.savedSuccessfully
          })
        },
        fail: function(err) {
          console.log('图片保存失败：' + err)
          uni.showToast({
            icon: 'none',
            mask: true,
            title: that.i18n.savedFailfully
          })
        }
      })
      // #endif
    },
    /**
			 * 关闭 弹窗
			 */
    closeCodePopup() {
      this.setData({
        wxCodeShow: false
      })
    },

    /**
			 * 保存图片至相册
			 */
    downloadImg() {
      // #ifdef APP-PLUS
      const bitmap = new plus.nativeObj.Bitmap('test')
      bitmap.loadBase64Data(
        this.shareWxCode,
        () => {
          const url = '_doc/' + new Date() + '.png' // url建议用时间戳命名方式
          bitmap.save(
            url,
            {
              overwrite: true
            },
            i => {
              uni.saveImageToPhotosAlbum({
                filePath: url,
                success: () => {
                  this.wxCodeShow = false
                  uni.showToast({
                    title: this.i18n.downloadComplete
                  })
                  bitmap.clear()
                }
              })
            },
            e => {
              // alert('保存失败1111', JSON.stringify(e))
              bitmap.clear()
            }
          )
        },
        e => {
          // alert('保存失败2222', JSON.stringify(e))
          bitmap.clear()
        }
      )
      // #endif
      // #ifdef MP-WEIXIN
      var cardno = wx.getStorageSync('bbcDistCardNo')
      wx.downloadFile({
        header: {
          'Authorization': wx.getStorageSync('bbcToken')
        },
        url: config.domain + '/p/distribution/qrCode/invitation?page=pages/prod/prod&scene=' + this.shareProdId + ',' +
						cardno,
        success: (res) => {
          // 图片保存到本地
          wx.getSetting({
            success: settingData => {
              const flag = settingData.authSetting['scope.writePhotosAlbum']
              if (flag === true || flag === undefined) {
                uni.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: data => {
                    this.wxCodeShow = false
                    uni.showToast({
                      title: this.i18n.downloadComplete,
                      icon: 'success',
                      duration: 2000
                    })
                  },
                  fail: () => {
                    uni.showToast({
                      title: this.i18n.failedSaveTips,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                })
              } else {
                wx.openSetting({
                  success: settingData => {
                    if (settingData.authSetting['scope.writePhotosAlbum']) {
                      uni.showToast({
                        title: this.i18n.failedSave,
                        icon: 'none',
                        duration: 2000
                      })
                    } else {
                      uni.showToast({
                        title: this.i18n.failedSaveTips,
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  }
                })
              }
            }
          })
        }
      })
      // #endif
    }
  }
}
</script>
<style>
	@import "./promotion-prod.css";
</style>
