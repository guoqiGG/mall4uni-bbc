<template>
  <view>
    <!-- 列表为空 -->
    <view v-if="isEmpty" class="empty">
      <view v-if="emptyImg===1" class="empty-icon">
        <image src="@/static/images/icon/empty.png" />
      </view>
      <view v-if="emptyImg===2" class="not-found">
        <image class="not-found-img" src="@/static/images/empty-img/not-found.png" />
      </view>
      <view v-if="emptyImg===3" class="empty-icon">
        <image src="@/static/images/icon/empty-dot.png" />
      </view>
      <view v-if="emptyImg===4" class="empty-icon">
        <image src="@/static/images/icon/empty-com.png" />
      </view>
      <view class="empty-text">{{ emptyTips || i18n.noData }}</view>
    </view>
    <!-- 已加载全部数据 -->
    <view v-if="!isEmpty && isAll" :class="['load-all',m0?'m0':'']">{{ allTips || i18n.endTips }}</view>
  </view>
</template>

<script>
export default {
  props: {
    isEmpty: {
      type: Boolean,
      default: false
    },
    m0: {
      type: Boolean,
      default: false
    },
    emptyTips: {
      type: String,
      default: ''
    },
    isAll: {
      type: Boolean,
      default: false
    },
    allTips: {
      type: String,
      default: ''
    },
    emptyImg: {
      type: Number,
      default: 1
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  watch: {
    isEmpty(val) {
      console.log('isEmpty', val)
    }
  }
}
</script>

<style scoped>
/* 列表为空 */
.empty {
  text-align: cneter;
  padding-top: 100rpx;
}
.empty-icon {
  display: block;
  width: 80rpx;
  height: 80rpx;
  margin: 0 auto;
  margin-bottom: 20rpx;
}
.empty-icon > image {
  width: 100%;
  height: 100%;
}

.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.not-found-img {
  width: 260rpx;
  height: 260rpx;
}

.empty-text {
  font-size: 28rpx;
  text-align: center;
  color: #999;
  line-height: 2em;
}

/* 加载完成 */
.load-all {
  margin-top: 40rpx;
  line-height: 2em;
  font-size: 28rpx;
  color: #aaa;
  text-align: center;
}
.m0{
  margin-top: 0;
  padding-bottom: 20rpx;
}

</style>
