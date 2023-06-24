/*
 * Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.
 *
 * https://www.mall4j.com/
 *
 * 未经允许，不可做商业用途！
 *
 * 版权所有，侵权必究！
 */

import Vue from 'vue'
import Vuex from 'vuex'
import prod from '@/store/modules/prod'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    prod
  },
  mutations: {

  },
  strict: false
})
