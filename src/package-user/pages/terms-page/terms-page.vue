<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j terms-container">
    <!-- 服务条款/隐私协议 -->
    <!-- <view v-html="serviceTerms">
		</view> -->
    <rich-text :nodes="content" />
  </view>
</template>

<script>
const http = require('@/utils/http.js')
const util = require('@/utils/util.js')
export default {
  data() {
    return {
      content: '',
      sts: ''
    }
  },
  onLoad: function(options) {
    this.ServiceTermsConfig(options.sts)
    this.sts = options.sts
  },
  onShow() {
    uni.setNavigationBarTitle({
      title: this.sts === 'serviceTerms' ? this.i18n.termsOfService : this.i18n.privacyPolicy
    })
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  methods: {
    /*
			key = 'service-terms'代表服务条款，key = 'service-policy'代表隐私策略
			*/
    ServiceTermsConfig(key) {
      const params = {
        url: '/sys/config/info/' + key,
        method: 'GET',
        callBack: res => {
          this.setData({
            content: util.formatHtml(JSON.parse(res).content)
          })
        }
      }
      http.request(params)
    }
  }
}
</script>

<style>
@import url("./terms-page.css");
</style>
