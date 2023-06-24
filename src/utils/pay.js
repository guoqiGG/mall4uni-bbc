/*
 * Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.
 *
 * https://www.mall4j.com/
 *
 * 未经允许，不可做商业用途！
 *
 * 版权所有，侵权必究！
 */

const http = require('./http.js')
const util = require('./util.js')
const config = require('./config.js')
var Constant = require('./constant.js')
import Wechat from './wechat.js'

import i18n from '../main.js'

export default {

  /**
     * 订单支付
     * @param {Number} payType 支付类型;见util/constant.js
     * @param {String} orderNumbers 订单编号
     * @param {Boolean} isPurePoints 是否纯氢春豆订单(氢春豆+钱订单与普通订单一致)
     * @param {Boolean} dvyType // 配送类型 1:快递 2:自提 3：无需快递 4:同城配送
     * @param {Number/String} vipId 要购买的会员等级id
     * @param {Number/String} balance 余额充值
     * @param {Number/String} orderType 订单类型 0普通 1团购 2秒杀 3氢春豆
     * @param {Number/String} ordermold 1虚拟商品
     */
  toOrderPay(payType, orderNumbers, isPurePoints, dvyType, vipId, balance, orderType, ordermold) {
    const balanceId = balance ? balance.balanceId : null
    const customRechargeAmount = balance ? balance.customRechargeAmount : null
    let redirectUrl = '/package-user/pages/my-wallet/my-wallet'
    // #ifdef H5
    if (balanceId) {
      redirectUrl = config.domainAddress + '/package-user/pages/my-wallet/my-wallet'
    } else if (vipId) {
      redirectUrl = config.domainAddress + '/package-member-integral/pages/buy-vip/buy-vip'
    } else {
      redirectUrl = config.domainAddress + '/pages/order-list/order-list?sts=0'
    }
    // #endif
    // 常规订单请求参数
    const commonOrderData = {
      payType: payType,
      orderNumbers: orderNumbers,
      returnUrl: redirectUrl
    }
    // 购买vip订单请求参数
    const buyVipOrderData = {
      id: vipId,
      scene: '',
      payType: payType,
      returnUrl: redirectUrl
    }
    // 充值余额
    const rechargeBalanceData = {
      payType: payType,
      returnUrl: redirectUrl,
      id: balanceId,
      customRechargeAmount: customRechargeAmount,
      scene: ''
    }
    const params = {
      url: vipId ? '/p/level/payLevel' : balanceId ? '/p/balance/pay' : '/p/order/pay',
      method: 'POST',
      data: vipId ? buyVipOrderData : balanceId ? rechargeBalanceData : commonOrderData,
      callBack: (res) => {
        const _this = this
        // 氢春豆订单: 纯氢春豆 isPurePoints=1 或者 纯氢春豆支付
        if (isPurePoints == 1 || payType == 0) {
          uni.redirectTo({
            url: '/package-pay/pages/pay-result/pay-result?sts=1&orderNumbers=' + orderNumbers + '&orderType=' + orderType
          })
        } else {
          // 微信h5支付
          if (Constant.PayType.WECHATPAY_H5 == payType) {
            var url = encodeURIComponent(redirectUrl)
            window.location.replace(res + '&redirect_url=' + url)
            return
          } else if (Constant.PayType.WECHATPAY_MP == payType) { // 微信公众号支付
            Wechat.callWexinPay(res, () => {
              // 支付成功
              _this.routeToAfterPay(true, dvyType, vipId, balanceId, orderNumbers, payType, orderType, ordermold)
            }, () => {
              // 支付失败
              _this.routeToAfterPay(false, dvyType, vipId, balanceId, orderNumbers, payType, orderType, ordermold)
            })
          } else if (Constant.PayType.ALIPAY_H5 == payType) { // 支付宝支付
            const div = document.createElement('div')
            div.innerHTML = res
            document.body.appendChild(div)
            document.forms[0].submit()
            div.remove()
          } else if (Constant.PayType.BALANCEPAY == payType && !vipId) { // 余额支付
            // type 1支付成功 2用户信息异常 3余额不足
            if (res.type == 1) {
              _this.routeToAfterPay(true, dvyType, vipId, balanceId, orderNumbers, payType, orderType, ordermold)
            } else {
              uni.showToast({
                title: res.message,
                icon: 'none',
                duration: 1500
              })
            }
          } else if (Constant.PayType.PAYPAL == payType) { // PayPal支付
            console.log('paypal支付')
            // console.log('res', res)
            window.location.replace(res)
          } else if (Constant.PayType.BALANCEPAY == payType && vipId) { // 余额购买会员
            // type 1支付成功 2用户信息异常 3余额不足
            if (res.type == 1) {
              uni.showToast({
                title: i18n.t('index.purchaseSuccessful'),
                icon: 'none',
                duration: 1000
              })
              setTimeout(() => {
                uni.redirectTo({
                  url: '/package-member-integral/pages/buy-vip/buy-vip'
                })
              }, 1000)
            } else {
              uni.showToast({
                title: res.message,
                icon: 'none',
                duration: 1500
              })
            }
          } else {
            // #ifdef APP-PLUS
            var wxAppPayInfo = {}
            if (payType == Constant.PayType.WECHATPAY_APP) {
              wxAppPayInfo = {
                'sign': res.sign,
                'prepayid': res.prepayId,
                'partnerid': res.partnerId,
                'appid': res.appId || res.appid,
                'timestamp': res.timeStamp || res.timestamp,
                'noncestr': res.nonceStr || res.noncestr,
                'package': res.packageValue
              }
            }
            uni.getProvider({
              service: 'payment',
              success: res1 => {
                uni.requestPayment({
                  provider: payType == Constant.PayType.WECHATPAY_APP ? 'wxpay' : 'alipay',
                  orderInfo: payType == Constant.PayType.WECHATPAY_APP ? wxAppPayInfo : res,
                  success: payMentSuss => {
                    _this.routeToAfterPay(true, dvyType, vipId, balanceId, orderNumbers, payType, orderType, ordermold)
                  },
                  fail: (paymentFail) => {
                    _this.routeToAfterPay(false, dvyType, vipId, balanceId, orderNumbers, payType, orderType, ordermold)
                  }
                })
              },
              fail: (failRes) => {
                console.log('fail')
              }
            })
            // #endif
            // #ifdef MP-WEIXIN
            wx.requestPayment({
              timeStamp: res.timeStamp,
              nonceStr: res.nonceStr,
              package: res.packageValue,
              signType: res.signType,
              paySign: res.paySign,
              success: e => {
                _this.routeToAfterPay(true, dvyType, vipId, balanceId, orderNumbers, payType, orderType, ordermold)
              },
              fail: () => {
                _this.routeToAfterPay(false, dvyType, vipId, balanceId, orderNumbers, payType, orderType, ordermold)
              }
            })
            // #endif
          }
        }
      },
      errCallBack: err => {
        uni.showModal({
          title: i18n.t('index.tips'),
          content: err.msg,
          confirmText: i18n.t('index.confirm'),
          showCancel: false,
          success: errModSucc => {
            if (errModSucc.confirm) {
              this.routeToAfterPay(false, dvyType, vipId, balanceId, orderNumbers, payType, orderType, ordermold)
              // 支付失败时将强制刷新支付类型
              util.getSysPaySwitch(true)
            }
          }
        })
      }
    }
    http.request(params)
  },

  /**
     * 支付成功或失败后的统一跳转
     * @param {Boolean} isSuccess 是否支付成功
     * @param {Number} dvyType 配送类型
     * @param {Number} vipId 购买会员id
     * @param {Number} balanceId 余额充值id
     * @param {String} orderNumbers 订单编号
     * @param {Number/String} payType 支付类型
     * @param {String} orderType 订单类型
     */
  routeToAfterPay(isSuccess, dvyType, vipId, balanceId, orderNumbers, payType, orderType, ordermold) {
    // 购买vip 成功与否都跳转同一个链接
    if (vipId) {
      uni.redirectTo({
        url: '/package-member-integral/pages/buy-vip/buy-vip'
      })
      return
    }
    let url = ''
    if (isSuccess) {
      // 支付成功后的跳转
      url = balanceId ? '/package-user/pages/my-wallet/my-wallet' : dvyType == 2 ? '/package-pay/pages/pay-success/pay-success?sts=1&orderNumbers=' + orderNumbers + '&dvyType=' + dvyType : '/package-pay/pages/pay-result/pay-result?sts=1&orderNumbers=' + orderNumbers + '&payType=' + payType + '&orderType=' + orderType + '&ordermold=' + ordermold
    } else {
      // 支付失败的跳转
      url = balanceId ? '/package-user/pages/recharge-balance/recharge-balance' : '/package-pay/pages/pay-result/pay-result?sts=0&orderNumbers=' + orderNumbers + '&payType=' + payType + '&ordermold=' + ordermold
    }
    uni.redirectTo({
      url: url
    })
  },

  /**
     * 唤起支付
     * @param {Object} paydata 支付需要的参数
     * @param {Object} cb 成功回调
     * @param {Object} errorCb 失败回调
     */
  toPay({
    payType,
    redirectPage,
    paydata,
    cb,
    errorCb
  }) {
    if (Constant.PayType.WECHATPAY_H5 == payType) {
      var redirectUrl = ''
      if (!redirectPage) {
        redirectUrl = window.location.href
      } else {
        var {
          protocol,
          host
        } = window.location
        redirectUrl = `${protocol}//${host}` + redirectPage
      }

      var url = encodeURIComponent(redirectUrl)
      window.location.replace(paydata + '&redirect_url=' + url)
    } else if (Constant.PayType.WECHATPAY_MP == payType) { // 微信公众号支付
      Wechat.callWexinPay(paydata, cb, errorCb)
    }
  }
}
