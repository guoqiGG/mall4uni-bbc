/*
 * Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.
 *
 * https://www.mall4j.com/
 *
 * 未经允许，不可做商业用途！
 *
 * 版权所有，侵权必究！
 */

export default {
  namespaced: true,
  state: {

    dataForm: {
      imageData: [],
      videoData: [],

      // 未配置的 活动，多规格，重量
      pic: '', // 商品主图
      imgs: '', // 商品图片
      video: '', // 商品视频
      prodType: 0, // 商品类型(0普通商品 1拼团 2秒杀 3积分 5活动商品)
      mold: 0, // 商品类别 0.实物商品 1. 虚拟商品
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
      skuId: null,
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
      writeOffMultipleCount: -1, // 核销有效次数 -1.无限次
      distributionUserId:''
    },
    deliveryIndex: {
      index: 2, // 运费选项索引
      pic: 0.01, // 统一运费价格
      id: null, // 运费模板id
      name: '' // 运费模板名称
    },
    // 滚动条位置
    scroll: 0,

    // 组件显示
    selected: {
      categoryName: '',
      brandName: '',
      preSellTimeName: '',
      deliveryModeName: '',
      deliveryName: '',
      shopCategoryName: ''
    }
  },
  actions: {

  },
  mutations: {
    updateDataForm(state, dataForm) {
      state.dataForm = dataForm
    },
    updateDeliveryIndex(state, deliveryIndex) {
      state.deliveryIndex = deliveryIndex
    },
    updateSelected(state, selected) {
      state.selected = selected
    },
    updateScroll(state, val) {
      state.scroll = val
    }

  }
}
