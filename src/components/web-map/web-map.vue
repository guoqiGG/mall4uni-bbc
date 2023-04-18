<template>
  <view class="map-warp">
    <!--#ifdef H5-->
    <web-view
      :src="`https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=${key}&referer=myapp`"
      @message="onMessage"
    />
    <!--#endif-->

    <!--#ifdef APP-PLUS-->
    <web-view src="/hybrid/html/map.html" @message="onMessage" />
    <!--#endif-->

  </view>
</template>

<script>
export default {
  data() {
    return {
      key: 'L4DBZ-VSSKJ-GCDFX-KGBVR-KHZ2J-RNF2Q',
      height: uni.getSystemInfoSync().screenHeight
    }
  },
  beforeMount() {
    // #ifdef H5
    if (window.isListen) {
      // 防止多次注册addEventListener事件
      return
    }
    window.addEventListener('message', function(event) {
      var loc = event.data
      if (loc && loc.module == 'locationPicker') {
        uni.$emit('onGetLocation', loc)
      }
      window.isListen = true
      window.removeEventListener('message', function() {}, true)
    }, false)
    // #endif
  },
  methods: {
    onMessage(res) {
      this.$emit('onGetLocation', res.detail.data[0])
    }
  }
}
</script>

<style>
</style>
