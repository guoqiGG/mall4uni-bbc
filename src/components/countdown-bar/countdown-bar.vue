<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 倒计时栏 -->
  <view v-if="countDownInfo || preSellTime" class="Mall4j">
    <!-- 拼团 / 秒杀 -->
    <view v-if="activityInfo.activityStatus && (prodType === 1 || prodType === 2)" class="countdown-box">
      <text class="second-kill">{{ prodType === 1 ? i18n.aGroup : i18n.spike }}</text>
      <view class="countdown-content">
        <text v-if="activityInfo.activityStatus === 1"class="countdown-tips">{{ i18n.onlyStart }}</text>
        <text v-else class="countdown-tips">{{ i18n.onlyEnd }}</text>
        <text class="countdown-time">{{ countDownInfo.day }}
          <text class="countdown-tips">{{ i18n.day }}</text>
          {{ countDownInfo.hou }}:{{ countDownInfo.min }}:{{ countDownInfo.sec }}
        </text>
      </view>
    </view>
    <!-- 拼团 / 秒杀 -->

    <!-- 预售 -->
    <view v-else-if="preSellTime" class="pre-sale">
      <view class="pre-sale-text">{{ i18n.preSale }}</view>
      <view class="send-time">
        <text class="countdown-tips">{{ i18n.expect }}</text>
        {{ preSellTime }}
        <text class="countdown-tips">{{ i18n.startDelivery }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import util from '@/utils/util'
export default {
  props: {
    // 预售时间
    preSellTime: {
      type: String,
      default: ''
    },
    // 活动结束时间
    endTime: {
      type: String,
      default: ''
    },
    // 活动开始时间
    startTime: {
      type: String,
      default: ''
    },
    // 商品类型 1团购 2秒杀
    prodType: {
      type: Number,
      default: 0
    },
    activityInfo: {
      type: Object,
      default: () => {}
    },
    prodId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      countDownInfo: '',
      endOfGroupTimer: '',
      preSellTimer: ''
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    }
  },
  mounted() {
    // console.log('preSellTime', this.preSellTime)
    if (JSON.stringify(this.activityInfo) !== '{}' && JSON.stringify(this.activityInfo) !== null) {
      this.activityCountdown()
    }
  },
  methods: {

    /**
     * 倒计时
     */
    activityCountdown() {
      const activityInfo = this.activityInfo
      let countDownInfo = {}
      const nowTime = new Date().getTime()
      // 团购
      countDownInfo = util.endOfStartTime(nowTime, util.dateToTimestamp((activityInfo.activityStatus === 1) ? activityInfo.startTime : activityInfo.endTime))
      if (countDownInfo.signs == 0) {
        clearTimeout(this.endOfGroupTimer)
        // 拼团结束，刷新当前页面
        setTimeout(() => {
          uni.redirectTo({
            url: '/pages/prod/prod?prodId=' + this.prodId
          })
        }, 100)
        return
      }
      this.countDownInfo = countDownInfo
      this.endOfGroupTimer = setTimeout(() => this.activityCountdown(activityInfo), 1000)
    }
  }
}
</script>

<style scoped>

/* 倒计时栏 */
.countdown-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: #F81A1A;
  color: #fff;
  padding: 20rpx;
  box-sizing: border-box;
}
.second-kill {
  font-size: 32rpx;
}
.countdown-content {
  font-size: 30rpx;
}
.countdown-tips {
  font-size: 26rpx;
  margin-right: 10rpx;
}

/* 预售 */
.pre-sale {
  background: #F81A1A;
  padding: 20rpx 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 30rpx;
  color: #fff;
}
.pre-icon {
  display: inline-block;
  width: 50rpx;
  height: 50rpx;
  margin-right: 20rpx;
}
.sendway-item.pre-sale-red {
  color: #F81A1A;
}

</style>
