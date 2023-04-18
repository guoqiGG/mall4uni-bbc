/*
 * Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.
 *
 * https://www.mall4j.com/
 *
 * 未经允许，不可做商业用途！
 *
 * 版权所有，侵权必究！
 */

// 小程序处理base64小程序码
function base64src(base64data) {
  const fsm = wx.getFileSystemManager()
  const FILE_BASE_NAME = 'tmp_base64src' + Math.random() * 1000000000000
  return new Promise((resolve, reject) => {
    // const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || []
    const format = 'jpg'
    const bodyData = base64data
    if (!format) {
      reject(new Error('ERROR_BASE64SRC_PARSE'))
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`
    const buffer = uni.base64ToArrayBuffer(bodyData)
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        resolve(filePath)
      },
      fail() {
        reject(new Error('ERROR_BASE64SRC_WRITE'))
      }
    })
  })
}

export default {
  async drawPosters(that) {
    // 默认图片
    const defImg = {
      path: '/static/images/icon/shareDef.png',
      width: 10000,
      height: 10000
    }
    // 获取主图宽高
    var goodsImg = {}
    if (!that.sharePic) {
      that.sharePic = defImg.path
      goodsImg = defImg
    } else {
      await uni.getImageInfo({
        src: that.sharePic,
        success: function(image) {
          goodsImg = image
        },
        fail: function(err) {
          console.log(err)
          that.sharePic = defImg.path
          goodsImg = defImg
        }
      })
    }
    var shareWxCode = that.shareWxCode
    // #ifdef MP-WEIXIN
    await base64src(that.shareWxCode).then(res => {
      shareWxCode = res
    })
    // #endif

    uni.showToast({
      icon: 'loading',
      mask: true,
      duration: 10000,
      title: that.i18n.posterInDrawing
    })

    setTimeout(() => {
      if (that.sharePic && that.systemInfo.errMsg == 'getSystemInfo:ok' && Object.keys(goodsImg).length > 0) {
        console.log('ok')
        // 商品信息基础值
        const infoX = that.canvasW * 0.05 // 边距
        // 主图最大宽高
        const imgWMax = that.canvasW - infoX * 2
        const imgHMax = that.canvasHMax - infoX * 2 - that.canvasW * 0.25 - that.canvasW * 0.15 - 15
        // 计算主图宽高
        let imgW = 0
        let imgH = 0
        if (goodsImg.width >= goodsImg.height) {
          imgW = imgWMax
          if (imgW / goodsImg.width * goodsImg.height > imgHMax) {
            imgH = imgHMax
            imgW = imgH / goodsImg.height * goodsImg.width
          } else {
            imgH = imgW / goodsImg.width * goodsImg.height
          }
        } else {
          imgH = imgHMax
          if (imgH / goodsImg.height * goodsImg.width > imgWMax) {
            imgW = imgWMax
            imgH = imgW / goodsImg.width * goodsImg.height
          } else {
            imgW = imgH / goodsImg.height * goodsImg.width
          }
        }
        // 底部信息基础y值
        const infoY = infoX + imgH + that.canvasW * 0.10

        // 画布高度 = 边距 + 主图高度 + 间距 + 二维码高度 + 文字
        const canvasHtest = infoX + imgH + that.canvasW * 0.15 + that.canvasW * 0.25 + infoX + 15
        that.canvasH = Math.min(canvasHtest, that.canvasHMax)

        setTimeout(() => {
          // 创建画布

          // 小程序新接口 start
          // wx.createSelectorQuery()
          //   .select('#myCanvas') // 在 WXML 中填入的 id
          //   .fields({ node: true, size: true })
          //   .exec((res) => {
          //   // Canvas 对象
          //     const canvas = res[0].node
          //     // Canvas 画布的实际绘制宽高
          //     // Canvas 绘制上下文
          //     const ctx = canvas.getContext('2d')

          //     // 初始化画布大小
          //     canvas.width = that.canvasW
          //     canvas.height = that.canvasH

          //     // 填充背景色，白色
          //     ctx.fillStyle = '#fff' // 默认白色
          //     ctx.fillRect(0, 0, that.canvasW, that.canvasH) // fillRect(x,y,宽度，高度)

          //     // 绘制商品主图，二维码
          //     // ctx.drawImage(goodsImg.path, (that.canvasW - imgW) / 2, infoX, imgW, imgH) // drawImage(图片路径,x,y,绘制图像的宽度，绘制图像的高度)
          //     // ctx.drawImage(shareWxCode, that.canvasW * 0.7, infoY, that.canvasW * 0.25, that.canvasW * 0.25) // drawImage(图片路径,x,y,绘制图像的宽度，绘制图像的高度,二维码的宽,高)
          //     // 绘制商品主图
          //     const image1 = canvas.createImage()
          //     image1.onload = () => {
          //       ctx.drawImage(
          //         image1,
          //         (that.canvasW - imgW) / 2,
          //         infoX,
          //         imgW,
          //         imgH
          //       )
          //     }
          //     image1.src = goodsImg.path
          //     // 绘制二维码
          //     const image2 = canvas.createImage()
          //     image2.onload = () => {
          //       ctx.drawImage(
          //         image2,
          //         that.canvasW * 0.7,
          //         infoY,
          //         that.canvasW * 0.25,
          //         that.canvasW * 0.25
          //       )
          //     }
          //     image2.src = shareWxCode

          //     // 商品价格
          //     ctx.fontSize = 14 // 字号
          //     ctx.fillStyle = '#e31d1a' // 颜色
          //     ctx.fillText('￥', infoX + ctx.measureText(that.parsePrice(that.sharePrice)[0][0]).width * 0.3, infoY + 20) // （文字，x，y）
          //     ctx.textAlign = 'left'
          //     ctx.fontSize = 20 // 字号
          //     ctx.fillStyle = '#e31d1a' // 颜色
          //     ctx.fillText(that.parsePrice(that.sharePrice)[0], infoX + 14, infoY + 20) // （文字，x，y）
          //     ctx.textAlign = 'left'
          //     ctx.fontSize = 14 // 字号
          //     ctx.fillStyle = '#e31d1a' // 颜色
          //     let decimalX = infoX + ctx.measureText('￥').width
          //     // let decimalX = infoX + ctx.measureText('￥').width
          //     for (let i = 0; i < that.parsePrice(that.sharePrice)[0].length; i++) {
          //       decimalX += ctx.measureText(that.parsePrice(that.sharePrice)[0][i]).width * 1.45
          //     }
          //     ctx.fillText('.' + that.parsePrice(that.sharePrice)[1], decimalX, infoY + 20) // （文字，x，y）
          //     ctx.textAlign = 'left'

          //     // 绘制商品标题，多余文字自动换行
          //     ctx.fontSize = 14 // fontSize() 设置字体字号
          //     ctx.fillStyle = '#333' // fillStyle() 设置字体颜色
          //     /* str canvas不能自动换行，需要自行计算 */
          //     let _strlineW = 0
          //     let _strLastIndex = 0 // 每次开始截取的字符串的索引
          //     let _strHeight = infoY + 40 // 绘制字体距离canvas顶部的初始高度
          //     let _num = 1
          //     const lineNum = Math.floor((that.canvasH - _strHeight - infoX) / 15)
          //     for (let i = 0; i < that.shareProdName.length; i++) {
          //       _strlineW += ctx.measureText(that.shareProdName[i]).width
          //       if (_strlineW > that.canvasW * 0.53) {
          //         if (_num == lineNum && lineNum) {
          //           // 文字换行数量大于二进行省略号处理
          //           ctx.fillText(that.shareProdName.substring(_strLastIndex, i - 3).trim() + '...', infoX, _strHeight)
          //           ctx.textAlign = 'left'
          //           _strlineW = 0
          //           _strLastIndex = i
          //           _num++
          //           break
          //         } else {
          //           ctx.fillText(that.shareProdName.substring(_strLastIndex, i).trim(), infoX, _strHeight)
          //           ctx.textAlign = 'left'
          //           _strlineW = 0
          //           _strHeight += 20
          //           _strLastIndex = i
          //           _num++
          //         }
          //       } else if (i == that.shareProdName.length - 1) {
          //         ctx.fillText(that.shareProdName.substring(_strLastIndex, i + 1).trim(), infoX, _strHeight)
          //         ctx.textAlign = 'left'
          //         _strlineW = 0
          //       }
          //     }
          //     /* end */

          //     // 间隔线
          //     ctx.rect(that.canvasW * 0.65, infoY, 1, that.canvasH - infoY - infoX)
          //     ctx.fillStyle = '#E9E9EA'
          //     ctx.fill()

          //     // 长按识别查看
          //     ctx.fontSize = 10
          //     ctx.fillStyle = '#666666'
          //     ctx.textAlign = 'center'
          //     ctx.fillText(that.i18n.pressToView, that.canvasW * 0.7 + (that.canvasW * 0.25 / 2), infoY + that.canvasW * 0.25 + 13)

          //     // ctx.draw(false, () => {
          //     // 这里绘制完成
          //     console.log('draw done')
          //     setTimeout(() => {
          //       wx.canvasToTempFilePath({ // 保存canvas为图片
          //         canvas: canvas,
          //         quality: 0.5,
          //         fileType: 'png',
          //         destWidth: that.canvasW,
          //         destHeight: that.canvasH,
          //         complete: function(res) {
          //           // 在H5平台下，tempFilePath 为 base64, // 图片提示跨域 H5保存base64失败，APP端正常输出临时路径
          //           that.shareImgUrl = res.tempFilePath
          //           // #ifndef H5
          //           that.completeDraw()
          //           // #endif
          //           uni.hideToast()
          //         }
          //       }, that)
          //     }, 1000)
          //     // })
          //   })
          // 小程序新接口 end

          var ctx = uni.createCanvasContext('myCanvas', that)

          // 填充背景色，白色
          ctx.setFillStyle('#fff') // 默认白色
          ctx.fillRect(0, 0, that.canvasW, that.canvasH) // fillRect(x,y,宽度，高度)

          // 绘制商品主图，二维码
          ctx.drawImage(goodsImg.path, (that.canvasW - imgW) / 2, infoX, imgW, imgH) // drawImage(图片路径,x,y,绘制图像的宽度，绘制图像的高度)
          ctx.drawImage(shareWxCode, that.canvasW * 0.7, infoY, that.canvasW * 0.25, that.canvasW * 0.25) // drawImage(图片路径,x,y,绘制图像的宽度，绘制图像的高度,二维码的宽,高)

          // 商品价格
          ctx.setFontSize(14) // 字号
          ctx.setFillStyle('#e31d1a') // 颜色
          ctx.fillText('￥', infoX + ctx.measureText(that.parsePrice(that.sharePrice)[0][0]).width * 0.3, infoY + 20) // （文字，x，y）
          ctx.setTextAlign('left')
          ctx.setFontSize(20) // 字号
          ctx.setFillStyle('#e31d1a') // 颜色
          ctx.fillText(that.parsePrice(that.sharePrice)[0], infoX + 14, infoY + 20) // （文字，x，y）
          ctx.setTextAlign('left')
          ctx.setFontSize(14) // 字号
          ctx.setFillStyle('#e31d1a') // 颜色
          let decimalX = infoX + ctx.measureText('￥').width
          // let decimalX = infoX + ctx.measureText('￥').width
          for (let i = 0; i < that.parsePrice(that.sharePrice)[0].length; i++) {
            decimalX += ctx.measureText(that.parsePrice(that.sharePrice)[0][i]).width * 1.45
          }
          ctx.fillText('.' + that.parsePrice(that.sharePrice)[1], decimalX, infoY + 20) // （文字，x，y）
          ctx.setTextAlign('left')

          // 绘制商品标题，多余文字自动换行
          ctx.setFontSize(14) // setFontSize() 设置字体字号
          ctx.setFillStyle('#333') // setFillStyle() 设置字体颜色
          /* str canvas不能自动换行，需要自行计算 */
          let _strlineW = 0
          let _strLastIndex = 0 // 每次开始截取的字符串的索引
          let _strHeight = infoY + 40 // 绘制字体距离canvas顶部的初始高度
          let _num = 1
          const lineNum = Math.floor((that.canvasH - _strHeight - infoX) / 15)
          for (let i = 0; i < that.shareProdName.length; i++) {
            _strlineW += ctx.measureText(that.shareProdName[i]).width
            if (_strlineW > that.canvasW * 0.53) {
              if (_num == lineNum && lineNum) {
              // 文字换行数量大于二进行省略号处理
                ctx.fillText(that.shareProdName.substring(_strLastIndex, i - 3).trim() + '...', infoX, _strHeight)
                ctx.setTextAlign('left')
                _strlineW = 0
                _strLastIndex = i
                _num++
                break
              } else {
                ctx.fillText(that.shareProdName.substring(_strLastIndex, i).trim(), infoX, _strHeight)
                ctx.setTextAlign('left')
                _strlineW = 0
                _strHeight += 20
                _strLastIndex = i
                _num++
              }
            } else if (i == that.shareProdName.length - 1) {
              ctx.fillText(that.shareProdName.substring(_strLastIndex, i + 1).trim(), infoX, _strHeight)
              ctx.setTextAlign('left')
              _strlineW = 0
            }
          }
          /* end */

          // 间隔线
          ctx.rect(that.canvasW * 0.65, infoY, 1, that.canvasH - infoY - infoX)
          ctx.setFillStyle('#E9E9EA')
          ctx.fill()

          // 长按识别查看
          ctx.setFontSize(10)
          ctx.setFillStyle('#666666')
          ctx.setTextAlign('center')
          ctx.fillText(that.i18n.pressToView, that.canvasW * 0.7 + (that.canvasW * 0.25 / 2), infoY + that.canvasW * 0.25 + 13)

          // 绘制图片
          ctx.draw(false, () => {
            setTimeout(() => {
              uni.canvasToTempFilePath({ // 保存canvas为图片
                canvasId: 'myCanvas',
                quality: 0.5,
                fileType: 'png',
                destWidth: that.canvasW * 2,
                destHeight: that.canvasH * 2,
                complete: function(res) {
                  // 在H5平台下，tempFilePath 为 base64, // 图片提示跨域 H5保存base64失败，APP端正常输出临时路径
                  that.shareImgUrl = res.tempFilePath
                  // #ifndef H5
                  that.completeDraw()
                  // #endif
                  uni.hideToast()
                }
              }, that)
            }, 1000)
          })
        }, 500)
      } else {
        console.log('err')
        uni.showToast({
          icon: 'none',
          mask: true,
          duration: 1500,
          title: that.i18n.posterDrawingFailed
        })
        that.shareShow = false
      }
    }, 1000)
  }

}
