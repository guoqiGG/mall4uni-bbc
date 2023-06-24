/*
 * Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.
 *
 * https://www.mall4j.com/
 *
 * 未经允许，不可做商业用途！
 *
 * 版权所有，侵权必究！
 */

const PayType = {
  SCOREPAY: 0, // 氢春豆支付
  WECHATPAY: 1, // 小程序支付
  ALIPAY: 2, // 支付宝支付
  WECHATPAY_SWEEP_CODE: 3, // 微信扫码支付
  WECHATPAY_H5: 4, // 微信H5支付
  WECHATPAY_MP: 5, // 微信公众号支付
  ALIPAY_H5: 6, // 支付宝H5支付
  ALIPAY_APP: 7, // 支付宝APP支付
  WECHATPAY_APP: 8, // 微信APP支付
  BALANCEPAY: 9, // 余额支付
  PAYPAL: 10 // paypal支付
}

const AppType = {
  MINI: 1, // 微信小程序
  MP: 2, // 微信公众号
  PC: 3, // pc
  H5: 4, // h5
  ANDROID: 5, // 安卓
  IOS: 6, // 苹果
  ALI: 7, // 支付宝H5
  ALIMINI: 8, // 支付宝小程序
  TTMINI: 9 // 字节小程序
}

module.exports = {
  PayType,
  AppType
}
