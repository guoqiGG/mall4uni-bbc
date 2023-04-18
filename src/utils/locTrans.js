/*
 * Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.
 *
 * https://www.mall4j.com/
 *
 * 未经允许，不可做商业用途！
 *
 * 版权所有，侵权必究！
 */

// 定位坐标系换算
// 定义一些常量
var x_PI = 3.14159265358979324 * 3000.0 / 180.0
var PI = 3.1415926535897932384626
var a = 6378245.0
var ee = 0.00669342162296594323

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德、腾讯 转 百度
 */
const gcj02tobd09 = (locationRes) => {
  var lat = locationRes.latitude
  var lng = locationRes.longitude
  var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI)
  var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI)
  var bd_lng = z * Math.cos(theta) + 0.0065
  var bd_lat = z * Math.sin(theta) + 0.006
  return {
    latitude: bd_lat,
    longitude: bd_lng
  }
}

/**
 * WGS84转GCj02
 * GPS 坐标转国标
 */
const wgs84togcj02 = (locationRes) => {
  var lat = locationRes.latitude
  var lng = locationRes.longitude
  var dlat = transformlat(lng - 105.0, lat - 35.0)
  var dlng = transformlng(lng - 105.0, lat - 35.0)
  var radlat = lat / 180.0 * PI
  var magic = Math.sin(radlat)
  magic = 1 - ee * magic * magic
  var sqrtmagic = Math.sqrt(magic)
  dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
  dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
  var mglat = lat + dlat
  var mglng = lng + dlng
  return {
    latitude: mglat,
    longitude: mglng
  }
}

const transformlat = (lng, lat) => {
  var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0
  return ret
}
const transformlng = (lng, lat) => {
  var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0
  return ret
}

export const locTrans = {
  gcj02tobd09,
  wgs84togcj02
}
module.exports = locTrans
