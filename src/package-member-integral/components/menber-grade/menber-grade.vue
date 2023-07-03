<template>
    <view v-if="showPop" class="score-strategy">
        <view class="mask" />
        <view class="explain-card">
            <view class="content-wrap">
                <view class="cont-title">会员等级</view>
                <image class="close-icon" src="/static/images/icon/close.png" @tap="hideLevelPop" />
                <view class="cont-det">
                    <view class="value-table">
                        <view class="tr">
                            <view class="td-right th">图标</view>
                            <view class="td-left th">等级</view>
                        </view>
                        <view class="tr">
                            <view class="td-left">
                                <image src="/static/images/icon/normal-icon.png" />
                            </view>
                            <view class="td-right">普通会员</view>
                        </view>
                        <view class="tr">
                            <view class="td-left">
                                <image src="/static/images/icon/silver-menber.png" />
                            </view>
                            <view class="td-right">白银会员</view>
                        </view>
                        <view class="tr">
                            <view class="td-left">
                                <image src="/static/images/icon/gold-menber.png" />
                            </view>
                            <view class="td-right">黄金会员</view>
                        </view>
                        <view class="tr">
                            <view class="td-left">
                                <image src="/static/images/icon/diamond-menber.png" />
                            </view>
                            <view class="td-right">白金会员</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            showPop:false
        }
    },
    methods: {
        // 显示会员等级 弹框
        showLevelPop: function () {
            console.log(1)
            this.showPop = true
        },
        // 隐藏会员等级 弹框
        hideLevelPop: function () {
            this.showPop = false
        },
    },
}
</script>
<style>
@import "./menber-grade.css";
</style>