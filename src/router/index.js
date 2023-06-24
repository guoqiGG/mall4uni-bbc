/*
 * Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.
 *
 * https://www.mall4j.com/
 *
 * 未经允许，不可做商业用途！
 *
 * 版权所有，侵权必究！
 */

import { RouterMount, createRouter, runtimeQuit } from 'uni-simple-router'
import flow from '../utils/flow.js'
import http from '../utils/http.js'
var systemType = ''
// #ifdef H5
systemType = 2
// #endif
// #ifdef MP-WEIXIN
systemType = 3
// #endif
// #ifdef APP-PLUS
systemType = uni.getSystemInfoSync().platform == 'android' ? 4 : 5
// #endif
uni.setStorageSync('bbcSystemType', systemType)

const router = createRouter({
  platform: process.env.VUE_APP_PLATFORM,
  routerErrorEach: (error, router) => {
    if (error.type === 3) {
      router.$lockStatus = false
      // #ifdef APP-PLUS
      runtimeQuit()
      // #endif
    }
  },
  routes: [
    ...ROUTES,
    {
      path: '*',
      redirect: (to) => {
        return { path: '/' }
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  // 初始化log数据
  if (!uni.getStorageSync('bbcInitLog')) {
    uni.setStorageSync('bbcInitLog', 'initLog')
    uni.setStorageSync('bbcUuid', flow.getUuid())
    uni.setStorageSync('bbcUuidSession', flow.getUuid())
    uni.setStorageSync('bbcStep', 0)
    uni.setStorageSync('bbcSessionTimeStamp', new Date().getTime())
    uni.setStorageSync('bbcSystemType', systemType)
  }
  // 操作间隔时间大于30分钟则更新 uuidSession(会话uuid),重置 step
  if ((new Date().getTime() - uni.getStorageSync('bbcSessionTimeStamp')) / 1000 / 60 > 30) {
    uni.setStorageSync('bbcUuidSession', flow.getUuid())
    uni.setStorageSync('bbcStep', 0)
    uni.removeStorageSync('bbcFlowAnalysisLogDto')
  }
  var step = uni.getStorageSync('bbcStep') * 1

  // 获取页面信息
  var pageInfo = flow.getPageInfo(to)
  var flowAnalysisLogDto = {
    pageId: pageInfo.pageId,
    bizData: pageInfo.bizData,
    bizType: pageInfo.bizType,
    step: step,
    systemType: uni.getStorageSync('bbcSystemType'),
    uuid: uni.getStorageSync('bbcUuid'),
    uuidSession: uni.getStorageSync('bbcUuidSession'),
    visitType: 1,
    prevPageId: uni.getStorageSync('bbcFlowAnalysisLogDto').pageId || undefined
  }
  uni.setStorageSync('bbcFlowAnalysisLogDto', flowAnalysisLogDto)
  if (pageInfo.pageId && to.path != from.path) {
    step += 1
    flowAnalysisLogDto.step = step
    uni.setStorageSync('bbcStep', step)
    uni.setStorageSync('bbcFlowAnalysisLogDto', flowAnalysisLogDto)
    uni.setStorageSync('bbcSessionTimeStamp', new Date().getTime()) // 更新会话时间
    if (to.path != '/package-pay/pages/pay-result/pay-result') {
      http.saveLog(flowAnalysisLogDto, 1)
    }
  }
  next()
})
router.afterEach((to, from) => {

})

export {
  router,
  RouterMount
}

