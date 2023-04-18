<template>
  <view :style="imgStyle" :class="classs" @tap="handleTap">
    <image v-if="!isError" :src="imgPath" :mode="imgMode" @error="imgError" @load="imgLoad" />
    <image v-if="isError && !loading" src="@/static/images/icon/def.png" :mode="isSync?imgMode:defImgMode" />
  </view>
</template>

<script>
const config = require('@/utils/config.js')
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    imgMode: {
      type: String,
      default: 'scaleToFill'
    },
    defImgMode: {
      type: String,
      default: 'scaleToFill'
    },
    // 是否与imgMode模式相同
    isSync: {
      type: Boolean,
      default: false
    },
    classList: {
      type: Array,
      default: () => {
        return []
      }
    },
    imgStyle: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      // 展示的图片路径
      imgPath: '',
      // 图片是否加载错误，如果是，则显示错误占位图
      isError: false,
      // 初始化组件时，默认为加载中状态
      loading: false,
      // 图片域名
      picDomain: config.picDomain
    }
  },
  computed: {
    classs() {
      const cls = [...this.classList, 'img-show-box']
      return cls
    }
  },
  watch: {
    src: {
      immediate: true,
      handler(path) {
        if (!path) {
          // 如果传入null或者''，或者false，或者undefined，标记为错误状态
          this.isError = true
          this.loading = false
        } else {
          this.isError = false
          this.loading = true
          if (/^https?:\/\//.test(path)) {
            this.imgPath = path
          } else {
            this.imgPath = this.picDomain + path
          }
        }
      }
    }
  },
  methods: {
    imgError() {
      this.isError = true
      this.loading = false
      this.$emit('imgError')
    },
    imgLoad(e) {
      console.log('加载完成')
      this.loading = false
      this.isError = false
      this.$emit('load', e.detail)
    },
    handleTap() {
      this.$emit('handleTap')
    }
  }
}
</script>

<style scoped>
image{
  width: 100%;
  height: 100%;
}
</style>
