<template>
  <view class="personal-recommend">
    <view class="recommend-con">
      <view class="recommend-set">
        <view class="recommend-til">{{ i18n.personRec }}</view>
        <switch class="switch-btn" style="transform:scale(0.7)" :checked="isOpen===1" color="#F81A1A" @change="recomChange" />
      </view>
      <view class="recommend-tips">{{ i18n.personRecTips }}</view>
    </view>
    <view class="confirm-box">
      <view class="confirm-btn" @tap="confirm">{{ i18n.confirmChanges }}</view>
    </view>
  </view>
</template>

<script>
import http from '@/utils/http.js'
import { debounce } from '@/utils/util.js'
export default {
  data() {
    return {
      isOpen: 0
    }
  },
  onLoad() {
    uni.setNavigationBarTitle({
      title: this.i18n.personRec
    })
    this.queryUserInfo()
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  methods: {
    // 获取用户信息
    queryUserInfo: function() {
      const params = {
        url: '/p/user/userInfo',
        method: 'GET',
        data: {},
        callBack: (res) => {
          this.isOpen = res.prodRecommendation
          // uni.setStorageSync('bbcUserInfo', res)
        }
      }
      http.request(params)
    },
    confirm: debounce(function() {
      const params = {
        url: '/p/user/setProdRecommendation',
        method: 'PUT',
        data: {
          prodRecommendation: this.isOpen
        },
        callBack: res => {
          uni.showToast({
            title: this.i18n.successfullyModified,
            icon: 'none',
            duration: 1000,
            mask: true
          })
          setTimeout(() => {
            uni.navigateBack(1)
          }, 1000)
        }
      }
      http.request(params)
    }),
    recomChange(e) {
      this.isOpen = e.detail.value ? 1 : 0
    }
  }
}
</script>

<style>
  @import "./personal-recommend.css"
</style>
