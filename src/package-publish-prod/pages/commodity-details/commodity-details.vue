<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j">
    <view class="selfAdaption">
      <view class="body">
        <mp-html
          ref="article"
          container-style="padding:20px;height:100%;box-sizing: border-box;overflow: auto;"
          domain=""
          :content="dataForm.content"
          :editable="editable"
          @remove="remove"
        />
      </view>
      <view class="options">
        <view class="editor_toolbox">
          <i class="iconfont icon-undo" data-method="undo" @tap="edit" />
          <i class="iconfont icon-redo" data-method="redo" @tap="edit" />
          <i class="iconfont icon-img" data-method="insertImg" @tap="edit" />
          <i class="iconfont icon-video" data-method="insertVideo" @tap="edit" />
          <i class="iconfont icon-link" data-method="insertLink" @tap="edit" />
          <i class="iconfont icon-text" data-method="insertText" @tap="edit" />
          <i class="iconfont icon-clear" @tap="clear" />
        <!-- <i class="iconfont icon-save" @tap="save" /> -->
        </view>
        <view class="footer">
          <button type="primary" @tap="submit">确定</button>
        </view>
      </view>
    </view>
    <block v-if="modal">
      <view class="mask" />
      <view class="modal">
        <view class="modal_title">{{ modal.title }}</view>
        <input class="modal_input" :value="modal.value" maxlength="-1" auto-focus @input="modalInput">
        <view class="modal_foot">
          <view class="modal_button" @tap="modalCancel">取消</view>
          <view
            class="modal_button"
            style="color:#F81A1A;border-left:1px solid rgba(0,0,0,.1)"
            @tap="modalConfirm"
          >确定</view>
        </view>
      </view>
    </block>
    <hCompress ref="hCompress" />
  </view>
</template>

<script>
import { picDomain } from '@/utils/config.js'

const http = require('@/utils/http.js')
const util = require('@/utils/util.js')

import mpHtml from '../../components/mp-html/mp-html'
import hCompress from '@/components/helang-compress/helang-compress'
// 删除图片方法
function remove(src) {
  // console.log('删除图片：', src)
  // 实际使用时，删除线上资源
}
export default {
  components: {
    mpHtml,
    hCompress
  },
  data() {
    return {
      modal: null,
      editable: true,
      picDomain
    }
  },
  computed: {
    dataForm: {
      get() { return this.$store.state.prod.dataForm },
      set(val) { this.$store.commit('prod/updateDataForm', val) }

    }
  },
  onReady() {
    /**
			 * @description 设置获取链接的方法
			 * @param {String} type 链接的类型（img/video/audio/link）
			 * @param {String} value 修改链接时，这里会传入旧值
			 * @returns {Promise} 返回线上地址
			 *   type 为音视频时可以返回一个数组作为源地址
			 *   type 为 audio 时，可以返回一个 object，包含 src、name、author、poster 等字段
			 */
    this.$refs.article.getSrc = (type, value) => {
      return new Promise((resolve, reject) => {
        if (type === 'img') {
          uni.showActionSheet({
            itemList: ['本地选取', '远程链接'],
            success: res => {
              if (res.tapIndex === 0) {
                // 本地选取
                uni.chooseImage({
                  count: value === undefined ? 9 : 1, // 2.2.0 版本起插入图片时支持多张（修改图片链接时仅限一张）
                  success: res => {
                    // #ifdef MP-WEIXIN
                    if (res.tempFilePaths.length === 1 && wx.editImage) {
                      // 单张图片时进行编辑
                      wx.editImage({
                        src: res.tempFilePaths[0],
                        complete: res2 => {
                          uni.showLoading({
                            title: '上传中'
                          })
                          this.upload(res2.tempFilePath || res.tempFilePaths[0]).then(res => {
                            uni.hideLoading()
                            resolve(res)
                          })
                        }
                      })
                    } else {
                      // #endif
                      uni.showLoading({
                        title: '上传中'
                      });
                      (async() => {
                        const arr = []
                        for (const item of res.tempFilePaths) {
                          // 依次上传
                          const src = await this.upload(item)
                          arr.push(src)
                        }
                        return arr
                      })().then(res => {
                        uni.hideLoading()
                        resolve(res)
                      })
                      // #ifdef MP-WEIXIN
                    }
                    // #endif
                  },
                  fail: reject
                })
              } else {
                // 远程链接
                this.callback = {
                  resolve,
                  reject
                }
                this.$set(this, 'modal', {
                  title: '图片链接',
                  value
                })
              }
            }
          })
        } else {
          this.callback = {
            resolve,
            reject
          }
          let title
          if (type === 'video') {
            title = '视频链接'
          } else if (type === 'audio') {
            title = '音频链接'
          } else if (type === 'link') {
            title = '链接地址'
          }
          this.$set(this, 'modal', {
            title,
            value
          })
        }
      })
    }
  },
  methods: {
    // 上传图片方法
    upload(src) {
      return new Promise((resolve, reject) => {
        // console.log(src)
        /*
          // 实际使用时，上传到服务器
          wx.uploadFile({
            url: 'xxx', // 接口地址
            filePath: src,
            name: 'xxx',
            success(res) {
              resolve(res.data.path) // 返回线上地址
            },
            fail: reject
          })
          */
        // 图片的本地临时文件路径列表
        // console.log(src, '666')
        uni.showLoading({
          mask: true
        })
        var params = {
          url: '/p/file/upload/img',
          filePath: src,
          name: 'file',
          callBack: (res1) => {
            uni.showLoading({
              title: '上传中'
            })
            const params1 = {
              url: '/p/file/attachFilePage',
              method: 'get',
              data: {
                fileId: res1,
                current: 1,
                size: 1,
                type: 1
              },
              callBack: (res2) => {
                // console.log(res2)
                uni.hideLoading()
                // console.log(domain + res2.records[0].filePath)
                resolve(picDomain+'/shop/' + res2.records[0].filePath)
              }
            }
            // console.log(params1.data, '4564')
            http.request(params1)
          }
        }
        console.log(111,src)
        const obj = {
          fileType: src.split('.')[src.split('.').length-1],
          src: src,
          quality: 0.2
        }
        this.$refs.hCompress.compress(obj, src[0]).then(res => {
          params.filePath = res
          http.upload(params)
        })
      })
    },
    imgUpload(data) {

    },
    // 删除图片/视频/音频标签事件
    remove(e) {
      // 删除线上资源
      remove(e.src)
    },
    // 处理模态框
    modalInput(e) {
      this.value = e.detail.value
    },
    modalConfirm() {
      this.callback.resolve(this.value || this.modal.value || '')
      this.$set(this, 'modal', null)
    },
    modalCancel() {
      this.callback.reject()
      this.$set(this, 'modal', null)
    },
    // 调用编辑器接口
    edit(e) {
      this.$refs.article[e.currentTarget.dataset.method]()
    },
    // 清空编辑器内容
    clear() {
      uni.showModal({
        title: '确认',
        content: '确定清空内容吗？',
        success: res => {
          if (res.confirm) { this.$refs.article.clear() }
        }
      })
    },
    // 保存编辑器内容
    save() {
      setTimeout(() => {
        var content = this.$refs.article.getContent()
        uni.showModal({
          title: '保存',
          content,
          confirmText: '完成',
          success: res => {
            if (res.confirm) {
              // 复制到剪贴板
              uni.setClipboardData({
                data: content
              })
              // 结束编辑
              this.editable = false
            }
          }
        })
      }, 50)
    },
    submit() {
      this.dataForm.content = this.$refs.article.getContent() === '<p></p>' ? '' : this.$refs.article.getContent()
      uni.redirectTo({ url: '/package-publish-prod/pages/publish-prod/publish-prod' })
      // console.log(this.dataForm.content)
    }
  }
}
</script>

<style>
  .selfAdaption{
    /* overflow: auto; */
    height: 100vh;
    display: flex;
    flex-direction:column;
  }
  .body{
    overflow: auto;
    flex: 1;
  }
  .options{
    /* position: fixed;
		bottom: 0;
		width: 100%;
		z-index: 999; */
		background-color: #EDEDED;

  }
	.editor_toolbox {

		background-color: #EDEDED;
		display: flex;
		padding: 5px;
		box-sizing: border-box;
		line-height: 1.6;
	}

	@font-face {
		font-family: "iconfont";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');
	}

	.iconfont {
		flex: 1;
		text-align: center;
		font-family: "iconfont" !important;
		font-size: 22px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-undo:before {
		content: "\e607";
	}

	.icon-redo:before {
		content: "\e606";
	}

	.icon-img:before {
		content: "\e6e2";
	}

	.icon-video:before {
		content: "\e798";
	}

	.icon-link:before {
		content: "\e60d";
	}

	.icon-text:before {
		content: "\e6ce";
	}

	.icon-clear:before {
		content: "\e637";
	}

	.icon-save:before {
		content: "\e501";
	}

	/* 模态框 */
	.modal {

		position: fixed;
		top: 50%;
		left: 16px;
		right: 16px;
		background-color: #fff;
		border-radius: 12px;
		transform: translateY(-50%);
	}

	.modal_title {
		padding: 32px 24px 16px;
		font-size: 17px;
		font-weight: 700;
		text-align: center;
	}

	.modal_input {
		display: block;
		padding: 5px;
		margin: 0 24px 32px 24px;
		font-size: 14px;
		border: 1px solid #dfe2e5;
	}

	.modal_foot {
		display: flex;
		line-height: 56px;
		font-weight: 700;
		border-top: 1px solid rgba(0, 0, 0, .1);
	}

	.modal_button {
		flex: 1;
		text-align: center;
	}

	/* 蒙版 */
	.mask {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: black;
		opacity: 0.5;
	}
  .footer{
      padding: 10rpx 30rpx 30rpx;

  }
  .footer button{
        background-color:#F81A1A;
  }
</style>
