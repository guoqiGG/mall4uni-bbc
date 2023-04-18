/*
 * Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.
 *
 * https://www.mall4j.com/
 *
 * 未经允许，不可做商业用途！
 *
 * 版权所有，侵权必究！
 */

import Vue from 'vue'
import App from './App'
import wechat from './utils/wechat.js'
import { router, RouterMount } from './router/index.js'
// 国际化模块
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
Vue.use(router)

// #ifdef H5
if (wechat.isWechat()) {
  Vue.prototype.$wechat = wechat
}
// #endif
Vue.config.productionTip = false

Vue.mixin({
  methods: {
    setData: function(obj, callback) {
      const that = this
      let keys = []
      let val, data
      Object.keys(obj).forEach(function(key) {
        keys = key.split('.')
        val = obj[key]
        data = that.$data
        keys.forEach(function(key2, index) {
          if (index + 1 == keys.length) {
            that.$set(data, key2, val)
          } else {
            if (!data[key2]) {
              that.$set(data, key2, {})
            }
          }
          data = data[key2]
        })
      })
      callback && callback()
    },
    // 图片出错处理
    imageError(target, attr) {
      target[attr] = ''
    }
  }
})

if (!uni.getStorageSync('bbcLang')) {
  // 设置默认语言
  uni.getSystemInfo({
    success: (res) => {
      uni.setStorageSync('bbcLang', (res.language.indexOf('zh') != -1) ? 'zh_CN' : 'en')
    }
  })
}

const i18n = new VueI18n({
  locale: uni.getStorageSync('bbcLang') || 'zh_CN', // 默认使用中文
  messages: {
    'en': require('utils/lang/en.js'), // 英文语言包
    'zh_CN': require('utils/lang/zh.js') // 中文简体语言包
  }
})

// 导出国际化
export default i18n

Vue.prototype._i18n = i18n

Vue.prototype.$i18nMsg = function() {
  return i18n.messages[i18n.locale]
}

Vue.prototype.parsePrice = function(val) {
  if (!val) {
    val = 0
  }
  return val.toFixed(2).split('.')
}
Vue.prototype.toPrice = function(val) {
  if (!val) {
    val = 0
  }
  return val.toFixed(2)
}

/**
 * 解决四舍五入精度问题
 * @param {*} d 保留位数
 * @param {*} value 值
 * @returns
 */
const toFixxed = function(d, value) {
  let s = value + ''
  if (!d)d = 0
  if (s.indexOf('.') == -1)s += '.'
  s += new Array(d + 1).join('0')
  if (new RegExp('^(-|\\+)?(\\d+(\\.\\d{0,' + (d + 1) + '})?)\\d*$').test(s)) {
    s = '0' + RegExp.$2; var pm = RegExp.$1; var a = RegExp.$3.length; var b = true
    if (a == d + 2) {
      a = s.match(/\d/g)
      if (parseInt(a[a.length - 1]) > 4) {
        for (var i = a.length - 2; i >= 0; i--) {
          a[i] = parseInt(a[i]) + 1
          if (a[i] == 10) {
            a[i] = 0
            b = i != 1
          } else break
        }
      }
      s = a.join('').replace(new RegExp('(\\d+)(\\d{' + d + '})\\d$'), '$1.$2')
    } if (b)s = s.substr(1)
    return (pm + s).replace(/\.$/, '')
  } return value + ''
}

Vue.prototype.toFixxed = val => {
  if (!val) {
    val = 0
  }
  return toFixxed(2, val)
}

App.mpType = 'app'

const app = new Vue({
  i18n, // 国际化
  ...App
})

// v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app, router, '#app')
// #endif

// #ifndef H5
app.$mount() // 为了兼容小程序及app端必须这样写才有效果
// #endif
