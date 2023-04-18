/*
 * Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.
 *
 * https://www.mall4j.com/
 *
 * 未经允许，不可做商业用途！
 *
 * 版权所有，侵权必究！
 */

// 数据分析.js
import http from '../utils/http'

/**
 * 处理页面信息
 * @param {*} to 目标路由信息
 */
function getPageInfo(to) {
  var path = to.path
  var query = to.query
  var pageInfo = {}
  if (path == '/pages/index/index' || path == '' || path == '*') {
    pageInfo.pageId = 1
  } else if (path == '/pages/prod/prod' && !query.seckillId && !query.groupActivityId) {
    pageInfo.pageId = query.bannerEnter == '1' ? 2 : 3
    pageInfo.bizType = 0
    pageInfo.bizData = query.prodId
  } else if (path == '/pages/snap-up-detail/snap-up-detail' && query.seckillId) {
    pageInfo.pageId = 4
    pageInfo.bizType = 2
    pageInfo.bizData = query.seckillId
  } else if (path == '/pages/prod/prod' && query.groupActivityId) {
    pageInfo.pageId = 5
    pageInfo.bizType = 1
    pageInfo.bizData = query.prodId
  } else if (path == '/pages/category/category') {
    pageInfo.pageId = 6
  } else if (path == '/pages/special-discount/special-discount') {
    pageInfo.pageId = 7
  } else if (path == '/pages/basket/basket') {
    pageInfo.pageId = 8
  } else if (path == '/package-user/pages/order-detail/order-detail') {
    pageInfo.pageId = 9
  } else if (path == '/pages/pay-way/pay-way') {
    pageInfo.pageId = 10
    pageInfo.bizData = query.orderNumbers
  } else if (path == '/pages/pay-result/pay-result') {
    pageInfo.pageId = 11
    pageInfo.bizData = query.orderNumbers
  }	else if (path == '/pages/user/user') {
    pageInfo.pageId = 12
  } else if (path == '/package-user/pages/order-list/order-list') {
    pageInfo.pageId = 13
  }
  return pageInfo
}
/**
 * 获取唯一值
 */
function getUuid() {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  var uuid = s.join('')
  return uuid
}

/**
 * 提交数据
 * @param {*} visitType 访问类型
 * @param {*} flowData 提交的数据内容
 */
function saveLog(flowData, visitType) {
  var flowAnalysisLogDto = Object.assign(flowData)
  flowAnalysisLogDto.visitType = visitType
  const params = {
    url: uni.getStorageSync('bbcToken') ? '/p/flowAnalysisLog' : '/flowAnalysisLog',
    dontTrunLogin: true,
    method: 'POST',
    data: flowAnalysisLogDto
  }
  http(params)
}
exports.getPageInfo = getPageInfo
exports.getUuid = getUuid
exports.saveLog = saveLog
