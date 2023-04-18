<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <view class="lang-list">
      <view v-for="(item, index) in langList" :key="index" class="lang-item" @tap="selectLang(item)">
        <view class="lang-name">{{ item.name }}</view>
        <view :class="[language===item.language?'check-style':'']" />
      </view>
    </view>
    <view class="pop-foot">
      <view class="foot-btn" @tap="confirmLang">{{ i18n.finish }}</view>
    </view>
  </view>
</template>

<script>
const http = require('@/utils/http.js')
const { getUniWebConfig } = require('@/utils/util.js')
export default {
  data() {
    return {
      langList: [],
      language: ''
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  onLoad: function(options) {
    this.getLangList()
  },
  onShow() {
    uni.setNavigationBarTitle({
      title: this.i18n.setLanguages
    })
  },
  methods: {
    selectLang(item) {
      this.language = item.language
    },
    confirmLang() {
      this._i18n.locale = this.language
      uni.setStorageSync('bbcLang', this.language)
      // uni.setLocale(locale === 'en' ? locale : 'zh-Hans')
      uni.setLocale(this.language)
      // 重新获取网站配置信息
      getUniWebConfig()
      uni.reLaunch({
        url: '/pages/user/user'
      })
    },
    // 获取国际化语言列表
    getLangList() {
      const param = {
        url: '/sys/config/lang',
        method: 'GET',
        callBack: (res) => {
          console.log('语言列表', res)
          const { language, langItemList } = res
          const langList = langItemList.filter(f => !f.hide) // 过滤掉隐藏的语言
          const bbcLang = uni.getStorageSync('bbcLang')
          // 当前语言存在语言列表中
          let isExist = false
          if (bbcLang) {
            for (const it of langList) {
              if (it.language === bbcLang) {
                this.language = it.language
                isExist = true
                break
              }
            }
          }
          // 当前无缓存语言或当前缓存语言不在语言列表时
          if (!bbcLang || !isExist) {
            this.language = language
            uni.setStorageSync('bbcLang', language)
          }
          this.langList = langList
        }
      }
      http.request(param)
    }
  }
}
</script>

<style>
@import "./lang.css";
</style>
