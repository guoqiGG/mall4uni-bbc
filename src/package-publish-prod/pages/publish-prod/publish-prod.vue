<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
    <view class="Mall4j post-prod">
        <!-- <pord-title :prodTitle="'发布商品'" /> -->

        <!-- 商品名称 -->
        <view class="goods-name">
            <view class="L0">
                <text>商品名称<text class="required">*</text></text>
                <textarea v-model="dataForm.prodName" type="text" :maxlength="60" placeholder-style="color:#999"
                    placeholder="长度不超过60个字符" />
            </view>
            <view class="L1">
                <text>商品卖点</text>
                <textarea v-model="dataForm.brief" type="text" value="" :maxlength="100" placeholder-style="color:#999"
                    placeholder="长度不超过100个字符" />
            </view>
        </view>

        <!-- 上传图片视频 -->
        <view class="goods-img">
            <view class="L0">
                <text>商品图片<text class="required">*</text></text>
                <view id="img" class="img">
                    <htz-image-upload ref="img" v-model="dataForm.imageData" :max="9" mediaType="image" :compress="false"
                        name="file" :chooseNum="1" @chooseSuccess="ceshiChooseSuccessImges" />
                </view>

                <text class="hint">建议尺寸800*800像素，最多上传9张，首图为主图。</text>
            </view>
            <!-- <view class="L1">
                <text>商品视频</text>
                <view class="img">
                    <htz-image-upload v-model="dataForm.videoData" :max="1" :compress="false" mediaType="video" name="file"
                        :chooseNum="9" @chooseSuccess="ceshiChooseSuccessVideo" />
                </view>
                <text class="hint">主图视频建议时长9-30秒，视频宽高和商品图保持一致。</text>
            </view> -->
        </view>

        <!-- 商品类目 -->
        <view class="goods-type goods">
            <view class="list">
                <view>
                    <text>平台类目</text><text class="required">*</text>
                </view>
                <view class="right" @tap="toSelectType(1)">
                    <text :class="[selected.categoryName ? 'selected' : '', dataForm.prodId ? 'disable' : '']">{{
                        selected.categoryName ? selected.categoryName : "请选择" }}</text>
                    <view class="icon" />
                </view>
            </view>
            <view class="list">
                <view>
                    <text>店铺类目</text><text class="required">*</text>
                </view>
                <view class="right" @tap="toSelectType(2)">
                    <text :class="selected.shopCategoryName ? 'selected' : ''">{{
                        selected.shopCategoryName ? selected.shopCategoryName : "请选择" }}</text>
                    <view class="icon" />
                </view>
            </view>
            <view class="list">
                <view>
                    <text>商品类型</text><text class="required">*</text>
                </view>
                <view class="right">
                    <text :class="dataForm.mold === null || dataForm.prodId ? '' : 'selected'">{{
                        dataForm.mold === null ? "请选择" : dataForm.mold === 0 ? '实物商品' : '虚拟商品' }}</text>
                    <!-- <view class="icon" /> -->
                </view>
            </view>
            <view class="list">
                <view>
                    <text>商品品牌</text>
                </view>
                <view class="right" @tap="toCommodityBrand">
                    <text :class="dataForm.brandName ? 'selected' : ''">{{ dataForm.brandName ? dataForm.brandName : "可选填"
                    }}</text>
                    <view class="icon" />
                </view>
            </view>
            <view class="list">
                <view>
                    <text>商品排序</text>
                </view>
                <view class="right"><input v-model="dataForm.seq" type="number" value="" placeholder="可选填"
                        placeholder-style="color:#999" @blur="seqChange"></view>
            </view>
            <!-- <view v-if="(!dataForm.prodId || dataForm.prodType === 5) && dataForm.mold !== 1" class="list">
                <view>
                    <text>活动商品</text><text class="activity">(活动商品不能单独购买)</text>
                </view>
                <view class="uni-padding-wrap uni-common-mt aligning">
                    <switch color="#082BA6" :checked="dataForm.prodType == 5 ? true : false"
                        :disabled="dataForm.prodId ? true : false" @change="prodTypeChange" />
                </view>
            </view> -->
            <!-- &&(!dataForm.prodId||!dataForm.preSellTime) -->
            <!-- <view v-show="dataForm.prodType !== 5 && dataForm.mold !== 1" class="list">
                <view>
                    <text>开启预售</text>
                </view>
                <view class="uni-padding-wrap uni-common-mt aligning">
                    <switch color="#082BA6" :checked="dataForm.preSellStatus == 1 ? true : false"
                        @change="preSellStatusChange" />
                </view>
            </view> -->
            <!-- <view v-show="dataForm.preSellStatus == 1 && dataForm.prodType !== 5 && dataForm.mold !== 1" class="list">
                <view>
                    <text>预售发货时间</text><text class="required">*</text>
                </view>
                <view class="right" @tap="toPresellTime"><text :class="dataForm.preSellTime ? 'selected' : ''">{{
                    dataForm.preSellTime ? dataForm.preSellTime : '请选择' }}</text>
                    <view class="icon" />
                </view>
            </view> -->
        </view>

        <!-- 商品规格 -->
        <view class="goods-type goods">
            <!-- <view class="list">
                <view>
                    <text>多规格</text>
                </view>
                <view class="uni-padding-wrap uni-common-mt aligning">
                    <switch color="#082BA6" :checked="dataForm.specifications ? true : false"
                        @change="dataForm.specifications = !dataForm.specifications" />
                </view>
            </view> -->
            <view v-show="!dataForm.specifications">
                <view class="list">
                    <view>
                        <text>销售价格</text><text class="required">*</text>
                    </view>
                    <view class="right"><input v-model="dataForm.price" type="number" value="" placeholder="请填写"
                            placeholder-style="color:#999"
                            @blur="handleInputValue(dataForm.price, 'price', 0.01, 100000000)">
                    </view>
                </view>
                <view class="list">
                    <view>
                        <text>市场价格</text>
                    </view>
                    <view class="right"><input v-model="dataForm.oriPrice" type="number" value="" placeholder="划线价"
                            placeholder-style="color:#999"
                            @blur="handleInputValue(dataForm.oriPrice, 'oriPrice', 0, 100000000)"></view>
                </view>
                <view class="list">
                    <view>
                        <text>商品库存</text><text class="required">*</text>
                    </view>
                    <view class="right"><input v-model="dataForm.totalStocks" type="number" value="" placeholder="请填写"
                            placeholder-style="color:#999"
                            @blur="numHandleInputValue(dataForm.totalStocks, 'totalStocks', 0, 9999999)"></view>
                </view>
                <view v-if="dataForm.mold !== 1" class="list">
                    <view>
                        <text>体积(m³)</text>
                    </view>
                    <view class="right"><input v-model="dataForm.volume" type="number" placeholder="可选填"
                            placeholder-style="color:#999"
                            @blur="handleInputValue(dataForm.volume, 'volume', 0, 100000000)">
                    </view>
                </view>
                <view v-if="dataForm.mold !== 1" class="list">
                    <view>
                        <text>重量(kg)</text>
                    </view>
                    <view class="right"><input v-model="dataForm.weight" type="number" placeholder="可选填"
                            placeholder-style="color:#999"
                            @blur="handleInputValue(dataForm.weight, 'weight', 0, 100000000)"></view>
                </view>
                <view class="list">
                    <view>
                        <text>商品编码</text>
                    </view>
                    <view class="right"><input v-model="dataForm.partyCode" type="text" placeholder="如无编码将自动生成"
                            placeholder-style="color:#999" @blur="validatePartyCode(dataForm.partyCode)"></view>
                </view>
            </view>
            <view v-show="dataForm.specifications">
                <view class="list">
                    <view>
                        <text>商品规格</text><text class="required">*</text>
                    </view>
                    <view class="right" @tap="toSpecificationManagement">
                        <text :class="dataForm.skuList.length > 0 ? 'selected' : ''">{{ dataForm.skuList.length > 0 ? '已设置'
                            : "请选择"
                        }}</text>
                        <view class="icon" />
                    </view>
                </view>
                <view v-show="dataForm.skuList.length > 0" class="list">
                    <view>
                        <text>规格明细</text><text class="required">*</text>
                    </view>
                    <view class="right" @tap="toSpecificationBreakdown">
                        <text :class="dataForm.skuList.length > 0 ? 'selected' : ''">{{
                            dataForm.skuList.length > 0 ? '共' + dataForm.skuList.length + '项' : "请选择规格" }}</text>
                        <view class="icon" />
                    </view>
                </view>
            </view>
        </view>

        <!-- 配送 -->
        <view v-show="dataForm.prodType !== 5 && dataForm.mold !== 1" class="goods-delivery goods">
            <view class="list">
                <view>
                    <text>配送方式</text><text class="required">*</text>
                </view>
                <view class="right">
                    <text
                        :class="dataForm.deliveryModeVo.hasUserPickUp || dataForm.deliveryModeVo.hasShopDelivery || dataForm.deliveryModeVo.hasCityDelivery ? 'selected' : ''">{{
                            !dataForm.deliveryModeVo.hasUserPickUp && !dataForm.deliveryModeVo.hasShopDelivery &&
                            !dataForm.deliveryModeVo.hasCityDelivery ? '请选择' : ''
                        }}{{ dataForm.deliveryModeVo.hasShopDelivery ? '快递配送' : '' }}{{
    dataForm.deliveryModeVo.hasUserPickUp ? '用户自提' : '' }}{{
        dataForm.deliveryModeVo.hasCityDelivery ? '同城配送' : '' }}</text>
                    <!-- <view class="icon" /> -->
                </view>
            </view>
            <view class="list">
                <view>
                    <text>运费设置</text><text class="required">*</text>
                </view>
                <view class="right">
                    <text class="selected">{{
                        dataForm.deliveryTemplateName }}</text>
                    <!-- <view class="icon" /> -->
                </view>
            </view>
        </view>

        <!-- 参数 -->
        <!-- <view class="goods">
            <view class="list">
                <view>
                    <text>参数设置</text>
                </view>
                <view class="right" @tap="toParameter">
                    <text :class="dataForm.prodParameterList.length > 0 ? 'selected' : ''">{{
                        dataForm.prodParameterList.length > 0 ? '共' + dataForm.prodParameterList.length + '组' : '请添加'
                    }}</text>
                    <view class="icon" />
                </view>
            </view>

        </view> -->

        <!-- 核销 -->
        <view v-show="dataForm.mold === 1" class="goods">
            <view class="list">
                <view>
                    <text>核销次数</text>
                </view>
                <view class="right" @tap="toWriteOff">
                    <text :class="dataForm.writeOffNum !== null ? 'selected' : ''">{{ dataForm.writeOffNum === 1 ? '单次核销' :
                        null }}{{
        dataForm.writeOffNum === 0 ? '无需核销' : null }}{{ dataForm.writeOffNum === -1 ? '多次核销' : null }} {{
        dataForm.writeOffNum === null ? '请选择' : null }}</text>
                    <view class="icon" />
                </view>
            </view>
            <!-- <view class="list">
                <view>
                    <text>用户留言</text>
                </view>
                <view class="right" @tap="toMessage">
                    <text :class="dataForm.virtualRemark.length > 0 ? 'selected' : ''">{{
                        dataForm.virtualRemark.length > 0 ? '共' + dataForm.virtualRemark.length + '组' : '请添加' }}</text>
                    <view class="icon" />
                </view>
            </view> -->
            <view class="list">
                <view>
                    <text>售后服务</text>
                </view>
                <view class="right" @tap="aftersalesOpen">
                    <text :class="dataForm.isRefund === 1 || dataForm.isRefund === 0 ? 'selected' : ''">{{
                        dataForm.isRefund !== null ? dataForm.isRefund === 1 ? '支持买家申请退款' : '不支持买家申请退款' : '请选择' }}</text>
                    <view class="icon" />
                </view>
            </view>
        </view>

        <!-- 商品详情 -->
        <view class="goods-details goods">
            <view class="list">
                <view>
                    <text>商品详情</text>
                </view>
                <view class="right" @tap="toCommodityDetails"><text :class="dataForm.content ? 'selected' : ''">{{
                    dataForm.content ? "已添加" : "请添加" }}</text>
                    <view class="icon" />
                </view>
            </view>
        </view>

        <!-- 上架 -->
        <view class="grounding">
            <button type="primary" @tap="submit">{{ dataForm.prodId ? '保存' : '上架出售' }}</button>
        </view>

        <!-- 选择商品类型 -->
        <uni-popup ref="moldPopup" type="bottom">
            <view class="optionType">
                <view class="title">
                    <text>选择商品类型</text>
                    <view class="close iconfont" @tap="moldClose(1)">
                        &#xe60e;
                    </view>
                </view>
                <view :class="dataForm.mold === 0 ? 'active list' : 'list'" @tap="dataForm.mold = 0">
                    <view class="left">
                        <text>实物商品</text><text class="hint">(物流发货)</text>
                    </view>
                    <view class="right iconfont">
                        &#xe659;
                    </view>
                </view>
                <!-- <view :class="dataForm.mold === 1 ? 'active list' : 'list'" @tap="dataForm.mold = 1">
                    <view class="left">
                        <text>虚拟商品</text><text class="hint">(无需物流)</text>
                    </view>
                    <view class="right iconfont">
                        &#xe659;
                    </view>
                </view> -->
                <view class="">
                    <button type="primary" @tap="moldClose">确定</button>
                </view>
            </view>
        </uni-popup>

        <!-- 选择配送方式 -->
        <uni-popup ref="deliveryModePopup" type="bottom">
            <view class="optionType">
                <view class="title">
                    <text>选择配送方式</text>
                    <view class="close iconfont" @tap="deliveryModeClose(1)">
                        &#xe60e;
                    </view>
                </view>
                <view class="list active">
                    <view class="left">
                        <text>快递配送</text>
                    </view>
                    <view class="right iconfont">
                        &#xe659;
                    </view>
                </view>
                <view :class="dataForm.deliveryModeVo.hasUserPickUp ? 'list active' : 'list'"
                    @tap="dataForm.deliveryModeVo.hasUserPickUp = !dataForm.deliveryModeVo.hasUserPickUp">
                    <view class="left">
                        <text>用户自提</text>
                    </view>
                    <view class="right iconfont">
                        &#xe659;
                    </view>
                </view>
                <view :class="[dataForm.deliveryModeVo.hasCityDelivery ? 'active' : '', 'list']"
                    @tap="deliveryModeVoChange">
                    <view class="left">
                        <text :class="sameCityStatus !== 1 ? 'disable' : ''">同城配送</text><text
                            class="hint">(需在PC配送管理设置后生效)</text>
                    </view>
                    <view class="right iconfont">
                        &#xe659;
                    </view>
                </view>
                <view class="delivery">
                    <button type="primary" @tap="$refs.deliveryModePopup.close()">确定</button>
                </view>
            </view>
        </uni-popup>

        <!-- 售后服务 -->
        <uni-popup ref="aftersalesPopup" type="bottom">
            <view class="optionType">
                <view class="title">
                    <text>售后服务</text>
                    <view class="close iconfont" @tap="aftersalesClose(1)">
                        &#xe60e;
                    </view>
                </view>
                <view :class="dataForm.isRefund === 1 ? 'list active' : 'list'" @tap="dataForm.isRefund = 1">
                    <view class="left">
                        <text>支持买家申请退款</text>
                    </view>
                    <view class="right iconfont">
                        &#xe659;
                    </view>
                </view>
                <view :class="[dataForm.isRefund === 0 ? 'active' : '', 'list']" @tap="dataForm.isRefund = 0">
                    <view class="left">
                        <text>不支持买家申请退款</text>
                    </view>
                    <view class="right iconfont">
                        &#xe659;
                    </view>
                </view>
                <view v-if="dataForm.isRefund === 0" class="text">提示：选择“不支持买家申请退款”，商品详情页将展示“不支持申请退款”的说明，买家如需退款只能主动联系商家处理
                </view>
                <view class="delivery">
                    <button type="primary" @tap="$refs.aftersalesPopup.close()">确定</button>
                </view>
            </view>
        </uni-popup>
        <hCompress ref="hCompress" />
    </view>
</template>
  
<script>
import { validNoEmptySpace } from '@/utils/validate'

const http = require('@/utils/http.js')
const util = require('@/utils/util.js')

import htzImageUpload from '../htz-image-upload/htz-image-upload.vue'
import hCompress from '@/components/helang-compress/helang-compress'
export default {
    components: {
        htzImageUpload,
        hCompress
    },
    data() {
        return {
            sameCityStatus: null,
            isSubmit: true,
            masterLang: null
        }
    },
    computed: {
        i18n() {
            return this.$t('index')
        },
        deliveryIndex: {
            get() { return this.$store.state.prod.deliveryIndex },
            set(val) { this.$store.commit('prod/updateDeliveryIndex', val) }
        },

        dataForm: {
            get() { return this.$store.state.prod.dataForm },
            set(val) { this.$store.commit('prod/updateDataForm', val) }

        },
        selected: {
            get() { return this.$store.state.prod.selected },
            set(val) { this.$store.commit('prod/updateSelected', val) }
        },
        scroll: {
            get() { return this.$store.state.prod.scroll },
            set(val) { this.$store.commit('prod/updateScroll', val) }
        }
    },
    onShow() {
        // 头部导航标题
        uni.setNavigationBarTitle({
            title: this.i18n.publishProduct
        })
    },
    onHide() {

    },

    onLoad(options) {
        this.dataForm.distributionUserId=uni.getStorageSync('distributionUserId')
        this.getSameCityDetail()
        this.getProdInfo(options.prodId)
    },
    methods: {
        getLangList() {
            const params = {
                url: `/sys/config/lang`,
                method: 'GET',
                data: {
                },
                callBack: res => {
                    // console.log('国际化语言列表', res)
                    if (!this.dataForm.prodId) {
                        this.masterLang = res.lang
                        this.dataForm.prodLangList = [{
                            prodId: 0,
                            lang: res.lang,
                            prodName: '',
                            brief: '',
                            content: ''
                        }]
                    } else {
                        for (const item of this.dataForm.prodLangList) {
                            if (item.prodName === this.dataForm.prodName) {
                                this.masterLang = item.lang
                                break
                            }
                        }
                    }
                }
            }
            http.request(params)
        },
        // #region
        // 数据反显
        getProdInfo(prodId) {
            if (prodId) {
                const params = {
                    url: `/prod/prod/info/${prodId}`,
                    method: 'GET',
                    data: {
                    },
                    callBack: res => {
                        res.deliveryModeVo = JSON.parse(res.deliveryMode)
                        res.deliveryMode = JSON.parse(res.deliveryMode)
                        res.virtualRemark = res.virtualRemark ? JSON.parse(res.virtualRemark) : []
                        this.dataForm = {
                            ...this.dataForm,
                            ...res,
                            changeStock: res.totalStocks
                        }
                        this.dataForm.skuList.forEach(x => {
                            x.changeStock = 0
                        })
                        if (!this.dataForm.preSellTime) {
                            this.dataForm.preSellTime = ''
                        }
                        if (this.dataForm.skuList.length === 1 && this.dataForm.skuList[0].properties === '') { // 单规格处理
                            this.dataForm.specifications = false
                            this.dataForm.volume = this.dataForm.skuList[0].volume
                            this.dataForm.partyCode = this.dataForm.skuList[0].partyCode
                            this.dataForm.weight = this.dataForm.skuList[0].weight
                            this.dataForm.skuId = this.dataForm.skuList[0].skuId
                        } else { // 多规格处理
                            this.dataForm.specifications = true
                        }
                        this.dataForm.imgs ? this.dataForm.imageData = this.dataForm.imgs.split(',') : null
                        this.dataForm.video ? this.dataForm.videoData = this.dataForm.video.split(',') : null
                        this.dataForm.brand ? this.dataForm.brandName = this.dataForm.brand.name : null
                        // this.dataForm.skuList.length <= 1 ? this.$set(this.dataForm, 'skuList', []) : null

                        // 运费反显
                        // 统一包邮
                        if (this.dataForm.deliveryTemplateId === 0) {
                            this.dataForm.deliveryTemplateName = '统一包邮'
                            this.deliveryIndex.index = 1
                        }
                        // 统一运费
                        if (this.dataForm.deliveryTemplateId === -1) {
                            this.dataForm.deliveryTemplateName = this.dataForm.deliveryAmount + '元'
                            this.deliveryIndex.pic = this.dataForm.deliveryAmount
                            this.deliveryIndex.index = 2
                        }
                        // 运费模板
                        if (this.dataForm.deliveryTemplateId > 0) {
                            this.deliveryIndex.id = this.dataForm.deliveryTemplateId
                            this.deliveryIndex.index = 3
                            this.getdeliveryTemplateName()
                        }
                        this.getCategoryName()
                        this.getLangList()
                    }
                }
                http.request(params)
            } else {
                this.getLangList()
            }
        },
        /**
         * 只允许输入正数和小数(保留小数点后两位)
         */
        checkInput(num) {
            if (num) {
                var tmpVal = String(num).replace(/[^\d^\\.]/g, '')
                var reg = /^(0|([1-9]\d*))(\.\d{1,2})?$/ // 最多允许后输入两位小数
                if (!reg.test(tmpVal)) {
                    tmpVal = tmpVal + ''
                    tmpVal = tmpVal.substring(0, tmpVal.indexOf('.') + 3)
                    var n = (tmpVal.split('.')).length - 1
                    if (n > 1) {
                        tmpVal = tmpVal.substring(0, tmpVal.indexOf('.'))
                    }
                }
                return tmpVal
            } else {
                return ''
            }
        },
        // 获取分类名称
        getCategoryName() {
            const params = {
                url: `/prod/category/listAvailableSigningCategory`,
                method: 'GET',
                data: {

                },
                callBack: res => {
                    this.dataForm.classifyName[2] = (res.filter(item => item.categoryId === this.dataForm.categoryId))[0]
                    this.dataForm.classifyName[1] = (res.filter(item => item.categoryId === this.dataForm.classifyName[2].parentId))[0]
                    this.dataForm.classifyName[0] = (res.filter(item => item.categoryId === this.dataForm.classifyName[1].parentId))[0]
                    // console.log(this.dataForm.classifyName)
                    this.selected.categoryName = this.dataForm.classifyName[0].categoryName + '/' + this.dataForm.classifyName[1].categoryName + '/' + this.dataForm.classifyName[2].categoryName
                    this.getShopTypeName()
                }
            }
            http.request(params)
        },
        // 获取运费模板名称
        getdeliveryTemplateName() {
            if (!this.dataForm.deliveryTemplateId) {
                return
            }
            const params = {
                url: `/shop/transport/info/${this.dataForm.deliveryTemplateId}`,
                method: 'GET',
                data: {},
                callBack: res => {
                    this.dataForm.deliveryTemplateName = res.transName
                    this.deliveryIndex.name = res.transName
                }
            }
            http.request(params)
        },
        // 获取店铺同城配送的配置
        getSameCityDetail() {
            const params = {
                url: '/p/prod/getSameCityInfo',
                method: 'GET',
                data: {},
                callBack: res => {
                    if (res) {
                        this.sameCityStatus = res.status
                    }
                }
            }
            http.request(params)
        },
        // 获取店铺类目名称
        getShopTypeName() {
            const params = {
                url: `/prod/category/listCategory`,
                method: 'GET',
                data: {
                    status: 1
                },
                callBack: res => {
                    this.$set(this.selected, 'shopCategoryName', (res.filter(item => item.categoryId === this.dataForm.shopCategoryId))[0].categoryName)
                    uni.setStorageSync('bbcProdDataFrom', this.$store.state)
                }
            }
            http.request(params)
        },
        // 商品排序
        seqChange(e) {
            if (e.detail.value) {
                this.$set(this.dataForm, 'seq', Math.floor(e.detail.value))
                if (this.dataForm.seq > 32767) {
                    this.$set(this.dataForm, 'seq', 32767)
                }
            }
        },
        /**
         * 处理输入框数据
         * @param data
         * @param dataFields
         * @param min 最小值
         * @param max 最大值
         */
        handleInputValue(data, dataFields, min, max) {
            if (dataFields !== 'totalStocks') {
                data = parseFloat(data)
            }
            this.$set(this.dataForm, dataFields, this.checkInput(data))
            if (data || data === 0) {
                // 保留两位小数
                if (data > max) {
                    this.$set(this.dataForm, dataFields, max)
                }
                if (data <= min) {
                    this.$set(this.dataForm, dataFields, min)
                }
            }
            if (isNaN(data)) {
                this.$set(this.dataForm, dataFields, 0)
            }
        },
        // 整数
        numHandleInputValue(data, dataFields, min, max) {
            this.handleInputValue(Math.floor(data), dataFields, min, max)
        },
        deliveryModeVoChange() {
            if (this.sameCityStatus === 1) {
                this.dataForm.deliveryModeVo.hasCityDelivery = !this.dataForm.deliveryModeVo.hasCityDelivery
            }
        },

        /**
         * 编码输入框校验
         */
        validatePartyCode(partyCode) {
            // 纯空格校验
            if (validNoEmptySpace(partyCode)) {
                this.$set(this.dataForm, 'partyCode', '')
                return
            }
        },

        verifySubmot() {
            if (!this.dataForm.prodName) {
                uni.showToast({
                    title: '请输入商品名称',
                    icon: 'none'
                })
                return true
            }

            if (this.dataForm.imageData.length < 1) {
                uni.showToast({
                    title: '请选择商品图片',
                    icon: 'none'
                })
                return true
            }
            // if (!this.dataForm.categoryId || !this.dataForm.shopCategoryId) {
            //   // 请选择商品分类
            //   uni.showToast({
            //     title: '请选择商品类目',
            //     icon: 'none'
            //   })
            //   return
            // }
            if (this.dataForm.categoryId == null) {
                uni.showToast({
                    title: '请选择平台类目',
                    icon: 'none'
                })
                return true
            }
            if (this.dataForm.shopCategoryId == null) {
                uni.showToast({
                    title: '请选择店铺类目',
                    icon: 'none'
                })
                return true
            }
            if (this.dataForm.mold === null) {
                // 请选择商品分类
                uni.showToast({
                    title: '请选择商品类型',
                    icon: 'none'
                })
                return true
            }

            if (this.dataForm.preSellStatus === 1 && !this.dataForm.preSellTime) {
                // 请选择商品分类
                uni.showToast({
                    title: '请选择预售发货时间',
                    icon: 'none'
                })
                return true
            }

            // 单规格效验
            if (!this.dataForm.specifications) {
                if (!this.dataForm.price) {
                    uni.showToast({
                        title: '请输入销售价格',
                        icon: 'none'
                    })
                    return true
                }
                if (this.dataForm.totalStocks === '') {
                    uni.showToast({
                        title: '请输入商品库存',
                        icon: 'none'
                    })
                    return true
                }
            } else { // 多规格效验
                if (this.dataForm.skuList.length < 1) {
                    uni.showToast({
                        title: '请选择商品规格',
                        icon: 'none'
                    })
                    return true
                }
            }
            // if (this.dataForm.deliveryTemplateId === null && this.dataForm.prodType !== 5 && this.dataForm.mold !== 1) {
            //     uni.showToast({
            //         title: '请选择运费',
            //         icon: 'none'
            //     })
            //     return true
            // }

            let isStatusLen = 0
            this.dataForm.skuList.forEach(item => {
                if (item.status === 0) {
                    isStatusLen++
                }
            })
            if (isStatusLen === this.dataForm.skuList.length && this.dataForm.specifications) {
                uni.showToast({
                    title: '至少要启用一种商品规格',
                    icon: 'none'
                })
                return true
            }
            return false
        },
        // #endregion
        // 提交发布或修改
        submit() {
            if (this.verifySubmot() || !this.isSubmit) {
                return
            }
            // console.log(this.dataForm.deliveryTemplateId, '运费id')
            const that = this

            let isNullLen = 0
            // 图片视频格式处理
            this.dataForm.deliveryMode = null
            this.dataForm.imgs = this.dataForm.imageData.join(',')
            this.dataForm.video = this.dataForm.videoData.join(',')
            this.dataForm.pic = this.dataForm.imageData[0]

            //当前商品语言列表信息是否存在主语言
            const isExistMasterLang = this.dataForm.prodLangList.find(f => this.masterLang === f.lang)
            // 多语言名称处理
            this.dataForm.prodLangList.forEach((prodLang, prodInx) => {
                prodLang.prodId = this.dataForm.prodId || 0
                if ((isExistMasterLang && this.masterLang === prodLang.lang) || (!isExistMasterLang && prodInx === 0)) {
                    prodLang.prodName = this.dataForm.prodName
                    prodLang.brief = this.dataForm.brief
                    prodLang.content = this.dataForm.content
                } else {
                    prodLang.prodName = prodLang.prodName || this.dataForm.prodName
                    prodLang.brief = prodLang.brief || this.dataForm.brief
                    prodLang.content = prodLang.content || this.dataForm.content
                }
            })

            if (this.dataForm.specifications) { // 多规格处理
                this.dataForm.price = ''
                this.dataForm.skuList.forEach((item, index) => {
                    const skuLangList = []
                    this.dataForm.prodLangList.forEach((prodLang, prodInx) => {
                        const findR = item.skuLangList.find(f => f.lang === prodLang.lang) || {}
                        if ((isExistMasterLang && this.masterLang === prodLang.lang) || (!isExistMasterLang && prodInx === 0)) {
                            skuLangList.push({
                                skuId: item.skuId || 0,
                                lang: prodLang.lang,
                                properties: item.properties,
                                skuName: item.skuName,
                                prodName: item.prodName
                            })
                        } else {
                            skuLangList.push({
                                skuId: item.skuId || 0,
                                lang: findR.lang || prodLang.lang,
                                properties: findR.properties || item.properties,
                                skuName: findR.skuName || item.skuName,
                                prodName: findR.prodName || item.prodName
                            })
                        }
                    })
                    item.skuLangList = skuLangList
                    if (!this.dataForm.price && item.status === 1) {
                        this.dataForm.price = item.price
                    }
                    // if (index === 0 || this.dataForm.price > item.price) {
                    //   this.dataForm.price = item.price
                    // }

                    if (index === 0 || this.dataForm.oriPrice < item.oriPrice) {
                        this.dataForm.oriPrice = item.oriPrice
                    }

                    if (index === 0) {
                        this.dataForm.totalStocks = item.stocks
                    } else {
                        this.dataForm.totalStocks += item.stocks
                    }

                    if (item.stocks === 0) {
                        isNullLen++
                    }
                })
            } else { // 单规格处理
                this.dataForm.oriPrice ? '' : this.dataForm.oriPrice = 0
                this.dataForm.skuList = []
                const skuLangList = []
                this.dataForm.prodLangList?.forEach(prodLang => {
                    skuLangList.push({
                        skuId: this.dataForm.skuId || 0,
                        lang: prodLang.lang,
                        properties: '',
                        skuName: '',
                        prodName: this.dataForm.prodName
                    })
                })
                this.dataForm.skuList[0] = {
                    changeStock: this.dataForm.totalStocks - this.dataForm.changeStock,
                    oriPrice: this.dataForm.oriPrice,
                    partyCode: this.dataForm.partyCode,
                    price: this.dataForm.price,
                    prodName: this.dataForm.prodName,
                    skuId: this.dataForm.skuId,
                    properties: '',
                    skuName: '',
                    status: 1,
                    stocks: this.dataForm.totalStocks,
                    volume: this.dataForm.volume,
                    weight: this.dataForm.weight,
                    skuLangList
                }
            }

            // 如果sku没有商品名称，则使用商品的商品名称
            if (this.dataForm.skuList.length === 1 && !this.dataForm.skuList[0].skuName) {
                this.dataForm.skuList[0].prodName = this.dataForm.prodName
            }

            // 多语言参数设置
            this.dataForm.prodParameterList.forEach(parame => {
                parame.prodParameterId = parame.prodParameterId || 0
                parame.prodId = this.dataForm.prodId || 0
                const prodParameterLangList = []
                this.dataForm.prodLangList?.forEach((prodLang, prodInx) => {
                    const findR = parame.prodParameterLangList?.find(f => f.lang === prodLang.lang) || {}
                    if ((isExistMasterLang && this.masterLang === prodLang.lang) || (!isExistMasterLang && prodInx === 0)) {
                        prodParameterLangList.push({
                            prodParameterId: findR.prodParameterId || parame.prodParameterId || 0,
                            lang: prodLang.lang,
                            parameterKey: parame.parameterKey,
                            parameterValue: parame.parameterValue
                        })
                    } else {
                        prodParameterLangList.push({
                            prodParameterId: findR.prodParameterId || parame.prodParameterId || 0,
                            lang: prodLang.lang,
                            parameterKey: findR.parameterKey || parame.parameterKey,
                            parameterValue: findR.parameterValue || parame.parameterValue
                        })
                    }
                })
                parame.prodParameterLangList = prodParameterLangList
            })

            var data = JSON.parse(JSON.stringify(this.dataForm))

            // 虚拟商品
            if (data.mold === 1) {
                // 选择"无需核销"，没有核销有效期
                if (data.writeOffNum === 0) { data.writeOffTime = null }
                // 自定义核销有效天数
                // if (data.writeOffNum !== 0 && data.writeOffTime === 2) {
                //   data.writeOffTime = parseInt(this.validDays)
                // }
                data.virtualRemark = JSON.stringify(data.virtualRemark)
                // 取消活动商品，预售，配送方式,运费模板
                data.prodType = 0
                data.preSellStatus = 0
                data.preSellTime = ''
                data.deliveryModeVo.hasUserPickUp = true
                data.deliveryModeVo.hasShopDelivery = false
                data.deliveryModeVo.hasCityDelivery = false
                data.deliveryTemplateId = 0
                data.deliveryTemplateName = ''
                data.weight = null
                data.volume = null
            }
            if (data.mold !== 1) {
                // 普通商品，清空虚拟商品信息
                data = {
                    ...data,
                    virtualRemark: null,
                    writeOffNum: null,
                    writeOffTime: null,
                    writeOffStart: null,
                    writeOffEnd: null,
                    isRefund: null
                }
                // 活动商品
                if (data.prodType === 5) {
                    // 取消预售，配送
                    data.preSellStatus = 0
                    data.preSellTime = ''
                    data.deliveryModeVo.hasUserPickUp = true
                    data.deliveryModeVo.hasShopDelivery = false
                    data.deliveryModeVo.hasCityDelivery = false
                    data.deliveryTemplateId = 0
                    data.deliveryTemplateName = ''
                }
            }

            if ((!this.dataForm.specifications && this.dataForm.totalStocks === 0) || (this.dataForm.specifications && isNullLen === this.dataForm.skuList.length)) {
                uni.showModal({
                    content: '该商品库存为0，确认保存？',
                    icon: 'none',
                    cancelText: '取消',
                    confirmText: '确定',
                    success: (res) => {
                        if (res.confirm) {
                            this.isSubmit = false
                            const params = {
                                url: `/p/prod/save`,
                                method: this.dataForm.prodId ? 'PUT' : 'POST',
                                data: data,
                                callBack: res => {
                                    uni.showToast({
                                        title: this.dataForm.prodId ? '修改成功' : '发布成功',
                                        icon: 'success'
                                    })
                                    setTimeout(() => {
                                        this.resetForm()
                                        uni.reLaunch({
                                            url: '/pages/index/index'
                                        })
                                    }, 1500)
                                }
                            }
                            http.request(params)
                            setTimeout(() => {
                                that.isSubmit = true
                            }, 2000)
                        } else {
                            return
                        }
                    }
                })
            } else {
                console.log(111,data)
                this.isSubmit = false
                const params = {
                    url: `/p/prod/save`,
                    method: this.dataForm.prodId ? 'PUT' : 'POST',
                    data: data,
                    callBack: res => {
                        uni.showToast({
                            title: this.dataForm.prodId ? '修改成功' : '发布成功',
                            icon: 'success'
                        })
                        setTimeout(() => {
                            this.resetForm()
                            uni.reLaunch({
                                url: '/pages/index/index'
                            })
                        }, 1500)
                    }
                }
                http.request(params)
                setTimeout(() => {
                    that.isSubmit = true
                }, 2000)
            }
        },

        // 重置表单
        resetForm() {
            this.dataForm = {
                imageData: [],
                videoData: [],

                // 未配置的 活动，多规格，重量
                pic: '', // 商品主图
                imgs: '', // 商品图片
                video: '', // 商品视频
                prodType: 0, // 商品类型(0普通商品 1拼团 2秒杀 3积分 5活动商品)
                mold: null, // 商品类别 0.实物商品 1. 虚拟商品
                prodName: '', // 商品名称
                brief: '', // 商品卖点
                brandId: null, // 商品品牌
                brandName: null, // 商品品牌
                categoryId: null, // 商品分类
                shopCategoryId: null, // 本店商品分类
                seq: null, // 商品排序
                preSellStatus: 0, // 预售状态 1：开启 0：未开启
                preSellTime: '', // 预售发货时间
                price: 0.01, // 商品价格
                oriPrice: 0.01, // 商品原价
                totalStocks: 0, // 库存
                volume: 0, // 体积
                weight: 0,
                prodId: 0,
                partyCode: '', // 编码
                skuList: [], // sku列表字符串
                deliveryModeVo: { // 配送方式
                    hasUserPickUp: true, // 同城
                    hasShopDelivery: false, // 店铺
                    hasCityDelivery: false // 自提
                },
                deliveryAmount: null, // 统一运费的金额
                deliveryTemplateId: 0, // 运费模板id
                deliveryTemplateName: 0, // 运费模板名称
                content: '', // 商品详情
                specifications: false, // 多规格

                useLang: 0, // 语言0中文，1中英文
                selectedType: 1,
                prodParameterList: [], // 参数

                // 选择类目面包屑导航
                classifyName: [
                    { categoryName: '', categoryId: null },
                    { categoryName: '', categoryId: null },
                    { categoryName: '', categoryId: null }
                ],
                virtualRemark: [], // 虚拟商品的留言备注

                isRefund: 0, // 售后服务
                writeOffStart: '', // 核销开始时间
                writeOffEnd: '', // 核销结束时间
                writeOffNum: 0, // 核销次数 -1.多次核销 0.无需核销 1.单次核销
                writeOffTime: 2, // 核销有效期 -1.长期有效 0.自定义 x.x天内有效
                writeOffMultipleCount: -1 // 核销有效次数 -1.无限次

            }
            this.deliveryIndex = {
                index: 2, // 运费选项索引
                pic: 0.01, // 统一运费价格
                id: null, // 运费模板id
                name: '' // 运费模板名称
            }
            this.selected = {
                categoryName: '',
                brandName: '',
                preSellTimeName: '',
                deliveryModeName: '',
                deliveryName: ''
            }
        },

        ceshiChooseSuccessImges(tempFilePaths, e) { // 选择图片返回
            // console.log(tempFilePaths,e)
            var arr = e.tempFiles[0].path.split('.')
            var str = arr[arr.length - 1]
            // console.log(str)
            if (str !== 'png' && str !== 'jpg' && str !== 'gif' && str !== 'jpeg') {
                uni.showToast({
                    title: '图片格式仅支持jpg/png/gif/jpeg',
                    icon: 'none'
                })
                return
            }
            // if (e.tempFiles[0].size > 2097152) {
            //   uni.showToast({
            //     title: '图片大小不能超过2M',
            //     icon: 'none'
            //   })
            //   return
            // }
            // 图片的本地临时文件路径列表
            // console.log(tempFilePaths, '666')
            uni.showLoading({
                mask: true
            })
            var params = {
                url: '/p/file/upload',
                filePath: tempFilePaths[tempFilePaths.length - 1],
                name: 'file',
                callBack: (res1) => {
                    this.imgUpload(res1, 1)
                }
            }
            const obj = {
                fileType: str,
                src: tempFilePaths[tempFilePaths.length - 1],
                quality: 0.2
            }
            this.$refs.hCompress.compress(obj, tempFilePaths[0]).then(res => {

                params.filePath = res
                http.upload(params)
            })
        },
        // ceshiChooseSuccessVideo(tempFilePaths, e) { // 选择视频返回
        //     console.log(tempFilePaths, e)
        //     var arr = e.tempFilePath.split('.')
        //     var str = arr[arr.length - 1]
        //     if (str !== 'mp4' && str !== 'mov' && str !== 'webm') {
        //         uni.showToast({
        //             title: '图片格式仅支持mp4/mov/webm',
        //             icon: 'none'
        //         })
        //         return
        //     }
        //     if (e.size > 20971520) {
        //         uni.showToast({
        //             title: '视频大小不能超过20M',
        //             icon: 'none'
        //         })
        //         return
        //     }
        //     if (util.lessThan2M(tempFilePaths)) {
        //         // 图片的本地临时文件路径列表
        //         console.log(222,tempFilePaths)
        //         uni.showLoading({
        //             mask: true
        //         })
        //         var params = {
        //             url: '/p/file/upload',
        //             filePath: tempFilePaths[tempFilePaths.length - 1],
        //             name: 'file',
        //             callBack: (res1) => {
        //                 console.log(res1, '123')
        //                 this.imgUpload(res1.data, 2)
        //             }
        //         }
        //         http.upload(params)
        //     }
        // },

        imgUpload(data, index) {
            uni.showLoading({
                title: '上传中'
            })
            if (index === 1) {
                this.dataForm.imageData.push(data.resourcesUrl + data.filePath)
                // console.log(this.dataForm.imageData)
            } else if (index === 2) {
                this.dataForm.videoData.push(data.resourcesUrl + data.filePath)
            }
            uni.hideLoading()
            // const params1 = {
            //     url: '/p/file/upload',
            //     method: 'get',
            //     data: {
            //         fileId: data.resourcesUrl+data.filePath,
            //         current: 1,
            //         size: 1,
            //         type: index
            //     },
            //     callBack: (res2) => {
            //         if (index === 1) {
            //             this.dataForm.imageData.push(res2.records[0].filePath)
            //             // console.log(this.dataForm.imageData)
            //         } else if (index === 2) {
            //             this.dataForm.videoData.push(res2.records[0].filePath)
            //         }
            //         uni.hideLoading()

            // 添加图片后滚动条滑到到最后
            // setTimeout(() => {
            //     const img = document.getElementById('img')
            //     img.scrollLeft = img.scrollWidth - img.offsetWidth
            // }, 0)
            //     }
            // }
            // console.log(params1.data, '4564')
            // http.request(params1)
        },
        // 是否预售
        preSellStatusChange(e) {
            e.detail.value ? this.dataForm.preSellStatus = 1 : this.dataForm.preSellStatus = 0
        },
        // 是否活动商品
        prodTypeChange(e) {
            e.detail.value ? this.dataForm.prodType = 5 : this.dataForm.prodType = 0
        },
        // 选择核销次数
        writeChange(num) {
            this.$set(this.dataForm, 'writeOffNum', num)
        },

        // 商品类型弹出层
        moldOpen() {
            if (this.dataForm.prodId) {
                uni.showToast({
                    title: '已发布的商品不允许修改商品类型',
                    icon: 'none'
                })
                return
            }
            this.cacheMold = this.dataForm.mold
            this.$refs.moldPopup.open('share')
        },
        // 商品类型弹出层
        messageOpen() {
            this.$refs.message.open()
        },
        // type 1为取消这次选择
        moldClose(type) {
            if (type === 1) {
                this.dataForm.mold = this.cacheMold
            }
            if (this.dataForm.mold === 1) {
                this.dataForm.preSellStatus = 0
            }
            this.$refs.moldPopup.close()
        },
        // 打开配送方式弹出层
        deliveryModeOpen() {
            this.cacheDeliveryMode = JSON.parse(JSON.stringify(this.dataForm.deliveryModeVo))
            this.$refs.deliveryModePopup.open('share')
        },
        // 关闭配送方式弹出层
        deliveryModeClose(type) {
            if (type === 1) {
                this.dataForm.deliveryModeVo = this.cacheDeliveryMode
            }
            this.$refs.deliveryModePopup.close()
        },
        // 打开售后服务弹出层
        aftersalesOpen() {
            this.isRefund = JSON.parse(JSON.stringify(this.dataForm.isRefund))
            this.$refs.aftersalesPopup.open('share')
        },
        // 关闭售后服务弹出层
        aftersalesClose(type) {
            if (type === 1) {
                this.dataForm.isRefund = this.isRefund
            }
            this.$refs.aftersalesPopup.close()
        },

        // 选择商品类目
        toSelectType(value) {
            if (value === 1 && this.dataForm.prodId) {
                uni.showToast({
                    title: '已发布的商品不允许修改平台分类',
                    icon: 'none'
                })
                return
            }
            this.dataForm.selectType = value
            uni.navigateTo({
                url: '/package-publish-prod/pages/select-type/select-type'
            })
        },
        // 选择品牌
        toCommodityBrand() {
            if (!this.dataForm.categoryId) {
                uni.showToast({
                    title: '请先选择商品类目',
                    icon: 'none'
                })
                return
            }
            uni.navigateTo({
                url: '/package-publish-prod/pages/commodity-brand/commodity-brand'
            })
        },
        // 选择预售时间
        toPresellTime() {
            uni.navigateTo({
                url: './presell-time'
            })
        },
        // 选择规格
        toSpecificationManagement() {
            uni.navigateTo({
                url: '../specification-management/specification-management'
            })
        },
        // 规格明细
        toSpecificationBreakdown() {
            uni.navigateTo({
                url: '../specification-breakdown/specification-breakdown'
            })
        },
        // 运费模板
        toTableRate() {
            uni.navigateTo({
                url: './table-rate'
            })
        },
        // 商品详情
        toCommodityDetails() {
            uni.navigateTo({
                url: '/package-publish-prod/pages/commodity-details/commodity-details'
            })
        },
        // 参数设置
        toParameter() {
            uni.navigateTo({
                url: './prod-parameter'
            })
        },
        // 用户留言
        toMessage() {
            uni.navigateTo({
                url: './prod-message'
            })
        },
        // 用户留言
        toWriteOff() {
            uni.navigateTo({
                url: './prod-write-off'
            })
        }

    }
}
</script>
  
<style lang="scss" scoped>
@import "./publish-prod.scss";
</style>
  