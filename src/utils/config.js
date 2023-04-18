/*
 * Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.
 *
 * https://www.mall4j.com/
 *
 * 未经允许，不可做商业用途！
 *
 * 版权所有，侵权必究！
 */

// 配置文件
let domain, imDomain, imWsDomain, domainAddress, merchantPlatformUrl, picDomain

// 微信公众号的appId;  小程序appId配置在 manifest.json ->  mp-weixin -> appid
const mpAppId = 'wxb5bc0e9ca9209ca5'

// ===============生产环境===============
if (process.env.NODE_ENV === 'production') {
  // 统一接口域名
  domain = 'https://b2b2c-api.mall4j.com'
  // 客服api
  imDomain = 'https://b2b2c-im.mall4j.com'
  // 客服ws
  imWsDomain = 'wss://b2b2c-im.mall4j.com'
  // 移动端域名地址配置-用于分享时跳转链接
  domainAddress = 'https://h5.mall4j.com'
  // 商家管理后台地址
  merchantPlatformUrl = 'https://b2b2c-multishop.mall4j.com'
  // 图片域名
  picDomain = 'http://img.zzqct.com/'
}

// =============== 开发环境 ===============
if (process.env.NODE_ENV === 'development') {
  domain = 'https://b2b2c-api.mall4j.com'
  imDomain = 'https://b2b2c-im.mall4j.com'
  imWsDomain = 'wss://b2b2c-im.mall4j.com'
  domainAddress = 'https://h5.mall4j.com'
  picDomain = 'http://img.zzqct.com/'
  merchantPlatformUrl = 'https://b2b2c-multishop.mall4j.com'
}

// =============== 自定义测试环境 ===============
if (process.env.VUE_APP_CUSTOM_ENV === 'test') {
  domain = 'http://192.168.1.17:8086'
  imDomain = 'http://192.168.1.17:8089'
  imWsDomain = 'ws://192.168.1.17:8089'
  domainAddress = 'http://192.168.1.6'
  picDomain = 'http://img.zzqct.com/'
  merchantPlatformUrl = 'https://b2b2c-multishop.mall4j.com'
}

exports.mpAppId = mpAppId
exports.picDomain = picDomain
exports.domain = domain
exports.imDomain = imDomain
exports.imWsDomain = imWsDomain
exports.domainAddress = domainAddress
exports.merchantPlatformUrl = merchantPlatformUrl
