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
                            <view class=" th">等级</view>
                            <view class=" th">图标</view>
                            <view class=" th">名称</view>
                        </view>
                        <view class="tr" v-for="item in gradeInfo" :key="item.level">
                            <view class="td">{{ item.level }}</view>
                            <view class="td">
                                <image :src="item.img" />
                            </view>
                            <view class="td">{{ item.levelName }}</view>
                        </view>

                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        gradeInfo: {
            type: Array,
        },
    },
    data() {
        return {
            showPop: false
        }
    },
    methods: {
        // 显示会员等级 弹框
        showLevelPop: function () {
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