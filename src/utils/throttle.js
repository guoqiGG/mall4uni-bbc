/*
* Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.
*
* https://www.mall4j.com/
*
* 未经允许，不可做商业用途！
*
* 版权所有，侵权必究！
*/
// 节流 防止触发次数过多
export const throttle = (fn, delay = 300) => {
  let pre = 0
  return function(...args) {
    const now = new Date().getTime()
    if (now - pre > delay) {
      fn.apply(this, args)
      pre = now
    }
  }
}
