<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j">
    <view class="container" :style="{ height: isMap ? '100vh' : '' }">
      <view v-if="!isMap" class="submit-order">
        <view class="bg" />
        <!-- 收货方式 -->
        <view v-if="selectDistributionWay && mold !== 1" class="distribution-mode">
          <view class="item-box">
            <view v-if="showMailHome&&!distributionUserId"  :class="[isDistribution ? 'active' : '', 'item']" @tap="changeDistribution(0)">{{ i18n.mailToHome }}</view>
            <view :class="[isDistribution ? '' : 'active', 'item']" @tap="changeDistribution(1)">{{ i18n.pickStore }}</view>
          </view>
        </view>
        <!-- 邮寄到家 -->
        <view v-if="isDistribution && mold !== 1 && showMailHome&&!distributionUserId" class="address-box">
          <view v-if="!userAddr || isEditAddr">
            <view class="tit">
              <view v-if="!addressList.length" class="text">{{ i18n.fillReceivingInformation }}</view>
              <view v-if="addressList.length" class="text">{{ i18n.historicalAddress }}</view>
              <view v-if="addressList.length" class="total" @tap="addressListPop">{{ i18n.inTotal }}{{ addressList.length }}{{ i18n.itemGe }}</view>
            </view>
            <view class="add-box">
              <view class="add-item">
                <view class="text">{{ i18n.consignee }}</view>
                <input
                  type="text"
                  class="input"
                  :value="receiver"
                  maxlength="15"
                  :placeholder="i18n.consigneeTips"
                  @input="onReceiverInput"
                  @click="hideTabbar"
                  @focus="hideTabbar"
                  @blur="showTabbar"
                >
              </view>
              <view class="add-item">
                <view class="text">{{ i18n.mobilePhone }}</view>
                <input
                  type="number"
                  class="input"
                  :value="mobile"
                  :placeholder="i18n.enterContactNumber"
                  maxlength="11"
                  @input="onMobileInput"
                  @click="hideTabbar"
                  @focus="hideTabbar"
                  @blur="showTabbar"
                >
              </view>
              <view class="add-item" @tap="translate">
                <view class="text">{{ i18n.yourRegion }}</view>
                <view class="area" @input="onMobileInput" @click="hideTabbar" @focus="hideTabbar" @blur="showTabbar">
                  <view v-if="province" class="area-content">{{ province + ' ' + city + ' ' + area }}</view>
                  <view v-if="!province || !saveEditFlag" class="placeholder-text">{{ i18n.selectProvinceCity }}</view>
                  <view
                    class="animation-element-wrapper"
                    :animation="animation"
                    :style="'visibility:' + (show ? 'visible' : 'hidden')"
                    @tap.stop="hiddenFloatViewScreenClick"
                  >
                    <view class="animation-element" @tap.stop="nono">
                      <text class="right-bt" @tap.stop="hiddenFloatView">{{ i18n.confirm }}</text>
                      <view class="line" />
                      <picker-view indicator-style="height: 70rpx;" :value="value" @change="bindChange" @tap.stop="nono">
                        <!--省-->
                        <picker-view-column>
                          <view v-for="(item, index) in provArray" :key="index">{{ item.areaName }}</view>
                        </picker-view-column>
                        <!--地级市-->
                        <picker-view-column>
                          <view v-for="(item, index) in cityArray" :key="index">{{ item.areaName }}</view>
                        </picker-view-column>
                        <!--区县-->
                        <picker-view-column>
                          <view v-for="(item, index) in areaArray" :key="index">{{ item.areaName }}</view>
                        </picker-view-column>
                      </picker-view>
                    </view>
                  </view>
                </view>
              </view>
              <view class="add-item">
                <view class="text">{{ i18n.detailedAddress }}</view>
                <input
                  type="text"
                  maxlength="50"
                  class="input"
                  :value="addr"
                  :placeholder="i18n.enteDetailedAddress"
                  @input="onAddrInput"
                  @click="hideTabbar"
                  @focus="hideTabbar"
                  @blur="showTabbar"
                >
                <image class="addres-icon" src="/static/images/icon/submit-address.png" @tap="selectLoaction" />
              </view>
              <view class="add-item">
                <view class="btn" @tap="onSaveAddr">{{ i18n.saveAndUse }}</view>
              </view>
            </view>
          </view>
          <view v-if="userAddr && !isEditAddr" class="current-address">
            <view class="c-address">{{ userAddr.province }}{{ userAddr.city }}{{ userAddr.area }}{{ userAddr.addr }}</view>
            <view class="c-user">{{ userAddr.receiver }} {{ userAddr.mobile }}</view>
            <view class="c-edit" @tap="toAddrListPage">
              <image src="/static/images/icon/revise.png" />
            </view>
          </view>
          <view v-if="canChooseSameCity && canChooseSameCity !== -2" class="choose-way" @tap="distributionPop">
            <view class="text">{{ i18n.deliveryMethod }}</view>
            <view class="go">{{ dvyType == 1 ? i18n.expressDelivery : dvyType == 4 ? i18n.sameDelivery : i18n.selectDeliveryMethod }}</view>
          </view>
        </view>
        <!-- /邮寄到家 -->

        <!-- 到店自提 -->
        <view v-if="!isDistribution && mold !== 1" class="address-box">
          <!-- 选择自提点 -->
          <view class="self-raising">
            <view class="tit">
              <view class="text">{{ i18n.pickup }}</view>
            </view>
            <view class="choose-store" @tap="goSelectStore">
              <image src="/static/images/icon/submit-address.png" class="img" />
              <view v-if="selStationItem.province" class="text">{{ selStationItem.province }}{{ selStationItem.city }}{{ selStationItem.area }}{{ selStationItem.addr }}</view>
              <view v-if="!selStationItem.province" class="text">{{ i18n.selectPickUpAddress }}</view>
            </view>
          </view>
          <!-- 历史提货人 -->
          <view class="raising-user">
            <view class="tit">
              <view v-if="false" class="text">{{ i18n.fillPersonInformation }}</view>
              <view class="text">{{ i18n.historicalPickPerson }}</view>
              <view v-if="stationUserInfo" class="total" @tap="raisingUserList">
                {{ i18n.inTotal }}{{ stationUserInfo ? stationUserInfo.length : '0' }}{{ i18n.itemGe }}
              </view>
            </view>

            <view class="user-info">
              <input
                type="text"
                class="input"
                :disabled="disabled"
                :value="stationUserName"
                :placeholder="i18n.enterNamePerson"
                maxlength="15"
                @input="getConsigneeInt"
                @click="hideTabbar"
                @focus="hideTabbar"
                @blur="showTabbar"
              >
            </view>
            <view :class="['item', errorTips ? 'error' : '']">
              <view class="user-info">
                <input
                  type="number"
                  class="input"
                  :disabled="disabled"
                  :value="stationUserMobile"
                  :placeholder="i18n.enterPhonePerson"
                  maxlength="11"
                  @input="getConMobileInt"
                  @click="hideTabbar"
                  @focus="hideTabbar"
                  @blur="showTabbar"
                >
              </view>
              <view v-if="errorTips == 1" class="error-text">
                <text class="warning-icon">!</text>
                {{ i18n.phoneWarn }}
              </view>
            </view>
          </view>
          <!-- 提货时间 -->
          <view class="choose-way" @tap="raisingTimePop">
            <view class="text">{{ i18n.takeDeliveryTime }}</view>
            <view class="go">{{ timeContent ? dateContent + ' ' + timeContent : i18n.choosePickUpTime }}</view>
          </view>
        </view>
        <!-- /到店自提 -->

        <view class="shop-item">
          <view v-for="(shopCart, index) in shopCartOrders" :key="index">
            <!-- 店铺信息 -->
            <view class="shop-box">
              <view class="shop-icon">
                <image src="/static/images/icon/shop.png" />
              </view>
              <view class="shop-name">{{ shopCart.shopName }}</view>
            </view>
            <!-- /店铺信息 -->

            <!-- 店铺商品明细 -->
            <view class="prod-item">
              <view v-for="(shopCartItem, index2) in shopCart.shopCartItemDiscounts" :key="index2">
                <view :class="[ 'prod-block', shopCartItem.chooseDiscountItemDto || shopCartItem.chooseComboItemDto ? 'discount' : '', ]">
                  <!-- 满减提示 -->
                  <view v-if=" shopCartItem.chooseDiscountItemDto" class="discount-tips" :hidden="!shopCartItem.chooseDiscountItemDto">
                    <text class="text-block">{{
                      [
                        i18n.amount,
                        i18n.pieces,
                        i18n.amountDiscount,
                        i18n.piecesDiscount,
                      ][shopCartItem.chooseDiscountItemDto.discountRule]
                    }}</text>
                    <text class="text-list">
                      {{ parseDiscountMsg( shopCartItem.chooseDiscountItemDto.discountRule, shopCartItem.chooseDiscountItemDto.needAmount, shopCartItem.chooseDiscountItemDto.discount, curLang ) }}
                    </text>
                    <text class="reduce-amount">
                      {{ i18n.haveDiscount }} ￥{{ toFixxed( shopCartItem.chooseDiscountItemDto.reduceAmount ) }}
                    </text>
                  </view>
                  <!-- 套餐提示 -->
                  <view v-if="shopCartItem.chooseComboItemDto" class="discount-tips" :hidden="!shopCartItem.chooseComboItemDto">
                    <text class="text-block">{{ i18n.packages }}</text>
                    <text class="text-list">{{ shopCartItem.chooseComboItemDto.name }}</text>
                    <text class="reduce-amount">{{ i18n.haveDiscount }} ￥{{ toFixxed( shopCartItem.chooseComboItemDto.preferentialAmount ) }}</text>
                  </view>
                  <!-- 商品信息 -->
                  <view class="item-box">
                    <view v-for="(item, prodIndex) in shopCartItem.shopCartItems" :key="prodIndex" :class="[ false ? 'pre-sell' : '', 'item-cont', ]">
                      <view class="info-row">
                        <view class="prod-pic">
                          <image v-if="item.pic && !item.isPicError" mode="aspectFit" :src="item.pic" @error="handlePicError(item)" />
                          <image v-else src="/static/images/icon/def.png" mode="aspectFit" />
                        </view>
                        <view class="prod-info">
                          <view class="prodname" :style="orderType ? '-webkit-line-clamp:1;' : '-webkit-line-clamp:2'">{{ item.prodName }}</view>
                          <view class="prod-info-cont">
                            <!-- 订单类型 -->
                            <view v-if="orderType" class="order-type-icon">
                              <!-- 订单类型(0普通订单 1团购订单 2秒杀订单) -->
                              {{ ['',i18n.aGroup,i18n.spike,i18n.integral][orderType] }}
                            </view>
                            <!-- 订单类型 end -->
                            {{ item.skuName || '' }}
                          </view>
                          <view v-if="item.preSellTime" class="prod-info-cont">{{ tsToDate(item.preSellTime) }}&nbsp;{{ $t('index.startDelivery') }}</view>
                          <view class="price-nums">
                            <view class="prodprice">
                              <text v-if="item.price" class="symbol">￥</text>
                              <text v-if="item.price" class="big-num">{{ parsePrice(item.price)[0] }}</text>
                              <text v-if="item.price" class="small-num">.{{ parsePrice(item.price)[1] }}</text>
                              <text v-if="orderType === 3 && actualTotal > transFee" class="small-num"> + </text>
                              <text v-if="orderType === 3" class="big-num">{{ item.scorePrice / item.prodCount }} {{ i18n.integral }}</text>
                            </view>
                            <view class="prodcount">×{{ item.prodCount }}</view>
                          </view>
                        </view>
                      </view>
                      <!-- 赠品信息 -->
                      <view v-if="item.giveaway" class="gift-con">
                        <view v-for="(giveawayItem, giveawayIndex) in item.giveaway .giveawayProds" :key="giveawayIndex" class="gift-item">
                          <view class="gift-name">
                            【{{ i18n.Giveaways }}】{{ giveawayItem.prodName }}
                            <text v-if="giveawayItem.skuName" class="gift-sku">{{ giveawayItem.skuName || '' }}</text>
                          </view>
                          <view class="gift-count">×{{ giveawayItem.giveawayNum }}</view>
                        </view>
                      </view>
                      <!-- 虚拟商品留言 start -->
                      <view v-if="item.virtualRemarkList && item.virtualRemarkList.length" class="virtual-goods-msg">
                        <view v-for="(msgItem, msgIndex) in item.virtualRemarkList" :key="msgIndex" class="v-msg-item">
                          <view class="v-msg-tit">{{ msgItem.name }}
                            <text v-if="msgItem.isRequired" class="stress">*</text>
                          </view>
                          <view class="v-msg-con">
                            <input
                              v-model="msgItem.value"
                              class="v-msg-input"
                              placeholder-class="ph-class"
                              :placeholder="i18n.pleaseEnter + `${msgItem.name}`"
                              maxlength="20"
                              @blur="handleInputBlur(msgItem.value, msgIndex, prodIndex, index2, index)"
                            >
                          </view>
                        </view>
                      </view>
                      <!-- 虚拟商品留言 end -->
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <!-- /店铺商品明细 -->

            <!-- 店铺优惠券和买家留言 -->
            <view class="msg-item">
              <view v-if="dvyType === 4" class="item">
                <view class="tit">{{ i18n.startDeliveryFee }}：</view>
                <view class="free-box">
                  <view class="price black">
                    <text class="symbol">￥</text>
                    <text class="small-num">{{ parsePrice(startDeliveryFee)[0] }}</text>
                    <text class="small-num">.{{ parsePrice(startDeliveryFee)[1] }}</text>
                  </view>
                </view>
              </view>
              <!-- 配送方式 -->
              <view v-if="mold !== 1 && isDistribution && !orderType" class="item">
                <view class="tit">{{ i18n.shippingCosts }}：</view>
                <view class="free-box">
                  <view class="price black">
                    <text class="symbol">￥</text>
                    <text class="small-num">{{ parsePrice(shopCart.transFee)[0] }}</text>
                    <text class="small-num">.{{ parsePrice(shopCart.transFee)[1] }}</text>
                  </view>
                </view>
              </view>
              <!-- 店铺优惠券 -->
              <view v-if="!orderType" class="item coupon" :data-index="index" @tap="showCouponPopup">
                <view class="text-box">
                  <text class="text">{{ i18n.coupon }}：</text>
                  <text v-if="!shopCart.shopCoupons.canUseLength" class="number">{{ i18n.notAvailable }}</text>
                  <text v-else class="number">{{ shopCart.shopCoupons.canUseLength }}&nbsp;{{ i18n.zhangAvailable }}</text>
                </view>
                <view v-if="shopCart.shopCoupons.couponAmount > 0" class="amount">
                  <text class="symbol">-￥</text>
                  <text class="big-num">{{ parsePrice(shopCart.shopCoupons.couponAmount)[0] }}</text>
                  <text class="small-num">.{{ parsePrice(shopCart.shopCoupons.couponAmount)[1] }}</text>
                </view>
              </view>
              <!-- / 店铺优惠券 -->
              <view class="item">
                <view class="tit">{{ i18n.OrderNotes }}：</view>
                <input
                  class="input"
                  maxlength="100"
                  :placeholder="i18n.storeNotesTips"
                  :value="shopCart.remarks"
                  :data-index="index"
                  @input="onRemarkIpt"
                  @click="hideTabbar"
                  @focus="hideTabbar"
                  @blur="showTabbar"
                >
              </view>
              <view v-if="orderType !== 3" class="item invoice">
                <view class="tit invoice-title">{{ i18n.invoice.onvoiceIssuance }}：</view>
                <view v-if=" !shopCart.invoiceDataFrom || shopCart.invoiceDataFrom.invoiceType === 2 " @tap="showInvoicePopup(shopCart.shopId)">
                  <view class="text-arrow">
                    <view class="text">{{ i18n.invoice.noInvoice }}</view>
                  </view>
                </view>
                <view v-else class="invoice-arrow" @tap=" showInvoicePopup(shopCart.shopId, shopCart.invoiceDataFrom) ">
                  <view class="text-arrow">
                    <view class="text">{{ i18n.invoice.electronic }}({{ i18n.invoice.productDetails }}-{{ shopCart.invoiceDataFrom.headerName || i18n.invoice.personal }})</view>
                  </view>
                </view>
              </view>
            </view>
            <!-- /店铺优惠券和买家留言 -->
          </view>

          <!-- 不满足当前配送方式的商品 -->
          <view v-if="filterShopItems && filterShopItems.length > 0" class="useless">
            <view class="u-reason">
              {{ i18n.productsNotSupported }}
              {{ [ '', i18n.expressDelivery, i18n.pickStore, '', i18n.sameDelivery, ][dvyType] }}，{{ i18n.chooseAnotherDelivery }}
            </view>
            <scroll-view scroll-x="true" class="u-con">
              <view class="u-box">
                <view v-for="(item, index) in filterShopItems" :key="index" class="u-prods">
                  <ImgShow :src="item.pic" />
                </view>
              </view>
            </scroll-view>
          </view>
        </view>

        <!-- 总金额计算 -->
        <view class="order-msg">
          <!-- 平台优惠券 -->
          <view v-if="!orderType" class="item bb" data-index="-1" @tap="showCouponPopup">
            <view class="text-box">
              <text class="tit">{{ i18n.platformCoupons }}：</text>
              <text v-if="!platformCoupons.canUseLength" class="number">{{ i18n.notAvailable }}</text>
              <text v-else class="number">{{ platformCoupons.canUseLength }}{{ i18n.zhangAvailable }}</text>
            </view>
            <view v-if="platformCoupons.couponAmount > 0" class="amount">
              <text class="symbol">-￥</text>
              <text class="big-num">{{ parsePrice(platformCoupons.couponAmount)[0] }}</text>
              <text class="small-num">.{{ parsePrice(platformCoupons.couponAmount)[1] }}</text>
            </view>
          </view>
          <!-- 会员氢春豆 -->
          <view v-if="maxUsableScore > 0" class="item coupon">
            <view class="member-points">
              <view class="integral-wrap">
                <view class="integral-deduction">
                  <text class="tit">{{ i18n.pointsDeduction }}： </text>
                  <view v-if="isScorePay == 1" class="integral-tips" @tap.stop="handleScorePop">
                    <text v-if="totalScoreAmount > 0 && totalUsableScore > 0" class="tips">{{ scorePlaceholder }}</text>
                    <text v-else class="tips">
                      {{ i18n.enterPoints }}
                    </text>
                    <image src="/static/images/icon/revise.png" />
                    <view class="integral-right-select">
                      <label>
                        <checkbox color="#F81A1A" value="isScorePay" :checked="isChecked" @tap.stop="useMemberPoints" />
                      </label>
                    </view>
                  </view>
                  <view v-if="isScorePay == 0" class="integral-tips">
                    <text class="tips">{{ i18n.notUsePoints }}</text>
                    <view class="integral-right-select">
                      <label>
                        <checkbox
                          color="#F81A1A"
                          value="isScorePay"
                          :checked="isChecked"
                          @tap.stop="useMemberPoints"
                        />
                      </label>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <!-- 商品总额 -->
          <view class="item">
            <view class="item-tit">{{ i18n.comTotal }}：</view>
            <view class="price black">
              <text class="symbol">￥</text>
              <text class="big-num">{{ parsePrice(total)[0] }}</text>
              <text class="small-num">.{{ parsePrice(total)[1] }}</text>
            </view>
          </view>
          <!-- 商品运费 -->
          <view v-if="mold != 1 && dvyType !== 2" class="item">
            <view class="item-tit">{{ i18n.prodTransfee }}：</view>
            <view class="price black">
              <text class="symbol">￥</text>
              <text class="big-num">{{ parsePrice(transFee)[0] }}</text>
              <text class="small-num">.{{ parsePrice(transFee)[1] }}</text>
            </view>
          </view>
          <!-- 运费减免 -->
          <view v-if="mold != 1 && dvyType !== 2 && shopFreeTransFee" class="item">
            <view class="item-tit">{{ i18n.shippingDiscount }}：</view>
            <view class="price">
              <text class="symbol">-￥</text>
              <text class="big-num">{{ parsePrice(shopFreeTransFee)[0] }}</text>
              <text class="small-num">.{{ parsePrice(shopFreeTransFee)[1] }}</text>
            </view>
          </view>
          <!-- 平台开启会员包邮(运费减免) -->
          <view v-if="freeTransFee" class="item">
            <view class="item-tit">{{ i18n.memberPackage }}：</view>
            <view class="price">
              <text class="symbol">-￥</text>
              <text class="big-num">{{ parsePrice(freeTransFee)[0] }}</text>
              <text class="small-num">.{{ parsePrice(freeTransFee)[1] }}</text>
            </view>
          </view>
          <!-- 会员等级折扣 -->
          <view v-if="totalLevelAmount" class="item">
            <view class="item-tit">{{ i18n.memberDiscountAmount }}：</view>
            <view class="price">
              <text class="symbol">-￥</text>
              <text class="big-num">{{ parsePrice(totalLevelAmount)[0] }}</text>
              <text
                class="small-num"
              >.{{ parsePrice(totalLevelAmount)[1] }}</text>
            </view>
          </view>
          <!-- 店铺优惠总额（优惠券+满减满折促销） -->
          <view v-if="orderShopReduce" class="item">
            <view class="item-tit">{{ i18n.storeDiscount }}：</view>
            <view class="price">
              <text class="symbol">-￥</text>
              <text class="big-num">{{ parsePrice(orderShopReduce)[0] }}</text>
              <text
                class="small-num"
              >.{{ parsePrice(orderShopReduce)[1] }}</text>
            </view>
          </view>
          <view v-if="orderReduce && (orderType === 1 || orderType === 2) " class="item">
            <view class="item-tit">{{ orderType === 1 ? i18n.groupPurchaseOffer : i18n.seckillReduce }}：</view>
            <view class="price">
              <text class="symbol">-￥</text>
              <text class="big-num">{{ parsePrice(orderReduce)[0] }}</text>
              <text
                class="small-num"
              >.{{ parsePrice(orderReduce)[1] }}</text>
            </view>
          </view>
        </view>
        <!-- /总金额计算 -->
      </view>
      <!-- #ifdef APP-PLUS -->
      <!-- 腾讯地图组件 -->
      <view v-if="isMap" class="map">
        <view class="goOut" @click="isMapReturn">{{ i18n.Back }}</view>
        <web-map v-if="isMap" @onGetLocation="onGetLocation" />
      </view>
      <!-- end 腾讯地图组件 -->
      <!-- #endif -->
      <!-- 底部栏 -->
      <view v-if="tabbar" class="submit-order-footer">
        <view class="sub-order">
          <view class="item-txt">{{ i18n.total }}：
            <view class="price">
              <text class="symbol">￥</text>
              <text class="big-num">{{ parsePrice(actualTotal)[0] }}</text>
              <text class="small-num">.{{ parsePrice(actualTotal)[1] }}</text>
              <text v-if="scorePrice" class="small-num"> + </text>
              <text v-if="scorePrice" class="big-num">{{ scorePrice }} {{ i18n.integral }}</text>
            </view>
          </view>
        </view>
        <view class="footer-box" :style="filterShopItems && filterShopItems.length > 0 && shopCartOrders.length === 0 ? 'background: #909399;' : 'background: #F81A1A;' " @tap.stop="toPay">
          {{ i18n.submitOrders }}
        </view>
      </view>
    </view>

    <!-- 选择优惠券弹窗 -->
    <view v-if="popupShow" class="popup-hide">
      <view class="popup-box">
        <view class="popup-tit">
          <text>{{ i18n.coupon }}</text>
          <view class="close" @tap="closePopup" />
        </view>
        <view class="coupon-tabs">
          <view :class="'coupon-tab ' + (couponSts == 1 ? 'on' : '')" data-sts="1" @tap="changeCouponSts">
            {{ i18n.availableCoupons }}({{ showCoupons.canUseCoupons.length }})
          </view>
          <view :class="'coupon-tab ' + (couponSts == 2 ? 'on' : '')" data-sts="2" @tap="changeCouponSts">
            {{ i18n.unavailableCoupons }}({{ showCoupons.unCanUseCoupons.length }})
          </view>
        </view>
        <view :class="'popup-cnt ' + (couponSts == 2 ? 'on' : '')">
          <view v-if="couponSts == 1" class="coupon-con">
            <block v-for="(item, index) in showCoupons.canUseCoupons" :key="index">
              <coupon
                :item="item"
                :order="order"
                :index="index"
                :is-shop-coupon="isShopCoupon"
                :can-use="isCanUse"
                @checkCoupon="checkCoupon"
              />
            </block>
          </view>
          <view v-if="couponSts == 2" class="coupon-con">
            <block v-for="(item, index) in showCoupons.unCanUseCoupons" :key="index">
              <coupon
                :item="item"
                :order="order"
                :can-use="!isCanUse"
                :is-shop-coupon="isShopCoupon"
              />
            </block>
          </view>
          <view v-if="couponSts == 1 && !showCoupons.canUseCoupons.length" class="botm-empty">{{ i18n.getCouponTips }}</view>
          <view v-if="couponSts == 2 && !showCoupons.unCanUseCoupons.length" class="botm-empty">{{ i18n.NoRelevantCoupons }}</view>
        </view>
        <view v-if="couponSts == 1" class="coupon-ok">
          <view class="btn" @tap="choosedCoupon">{{ i18n.confirm }}</view>
        </view>
      </view>
    </view>
    <!-- 氢春豆输入框弹窗 -->
    <view class="popup-hide" :hidden="!showScorePop">
      <view class="score-pop">
        <view class="popup-tit">
          <text>{{ i18n.modifyDeductiblePoints }}</text>
          <view class="close" @tap="closePopupHide" />
        </view>
        <view class="score-pop-con">
          <view class="score-pop-item">
            <input
              class="score-int"
              type="number"
              :value="userUseScore"
              :placeholder="i18n.enterPoints"
              maxlength="8"
              @input="handleScoreInput"
              @click="hideTabbar"
              @focus="hideTabbar"
              @blur="showTabbar"
            >
            <text class="usable-tips">{{ orderScorePlaceHolder }}</text>
            <view v-if="shopUseScore > 100" class="usable-tips">{{ i18n.multipleOf10 }}</view>
          </view>
          <view class="score-pop-item">
            <view class="confirm-btn" @tap="confirmScore">{{ i18n.confirm }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 选择配送方式弹窗 -->
    <view class="popup-hide" :hidden="!showDistributionPop">
      <view class="popup-box height-auto">
        <view class="con-tit">
          <view class="close" @tap="closePopup" />
          <view class="tit-text">{{ i18n.selectDeliveryMethod }}</view>
        </view>
        <view class="pop-con">
          <radio-group @change="disRadioChange">
            <label class="distribution-item">
              <view class="text">{{ i18n.expressDelivery }}</view>
              <radio
                color="#eb2444"
                class="check"
                value="1"
                :checked="dvyType == 1"
              />
            </label>
            <label class="distribution-item">
              <view class="text">{{ i18n.sameDelivery }}</view>
              <radio
                color="#eb2444"
                class="check"
                value="4"
                :checked="dvyType == 4"
              />
            </label>
          </radio-group>
        </view>
      </view>
      <view class="mask" @tap="showDistributionPop = false" @touchmove.stop.prevent="moveHandle" />
    </view>

    <!-- 可用地址弹窗 -->
    <view class="popup-hide" :hidden="!showAddressListPop">
      <view class="popup-box address-list">
        <view class="con-tit">
          <view class="close" @tap="closePopup" />
          <view class="tit-text">{{ i18n.optionalAddress }}</view>
        </view>
        <view class="address-box">
          <radio-group v-for="(item, index) in addressList" :key="index">
            <view class="item" @tap="selectAddr(item)">
              <view class="text-box">
                <view class="address">
                  <text v-if="item.commonAddr == 1" class="default-address">{{ i18n.default }}</text>
                  {{ item.province }}{{ item.city }}{{ item.area }}{{ item.addr }}
                </view>
                <view class="user">{{ item.receiver }} {{ item.mobile }}</view>
              </view>
              <radio
                color="#eb2444"
                class="check"
                :value="String(item.addrId)"
                :checked="addrId == item.addrId"
              />
            </view>
          </radio-group>
        </view>
      </view>
    </view>

    <!-- 历史提货人弹窗 -->
    <view class="popup-hide" :hidden="!showRaisingUserList">
      <view class="popup-box address-list history-user">
        <view class="con-tit">
          <view class="close" @tap="closePopup" />
          <view class="tit-text">{{ i18n.historicalPickPerson }}</view>
        </view>
        <view v-if="!stationUserInfo||stationUserInfo.length == 0" class="noData">{{ i18n.noData }}</view>
        <view v-if="stationUserInfo && stationUserInfo.length > 0" class="address-box">
          <radio-group v-for="(item, index) in stationUserInfo" :key="index" @change="stationRadioChange">
            <view class="item">
              <view class="text-box">
                <view class="address history-picker-user">
                  <view class="gray">{{ i18n.pickUpPerson }}：</view>
                  <view>{{ item.stationUserName }}</view>
                </view>
                <view class="address history-picker-user">
                  <view class="gray">{{ i18n.phoneNumber }}：</view>
                  <view>{{ item.stationUserMobile }}</view>
                </view>
              </view>
              <radio
                color="#eb2444"
                class="check"
                :value="String(index)"
                :checked="stationIdx == index"
                @tap="getStationItem(item)"
              />
            </view>
          </radio-group>
        </view>
      </view>
    </view>

    <!-- 选择提货时间弹窗 -->
    <view class="popup-hide" :hidden="!showRaisingTimePop">
      <view class="popup-box raising-time">
        <view class="con-tit">
          <view class="tit-text">{{ i18n.choosePickUpTime }}</view>
          <view class="close" @tap="closePopup" />
        </view>
        <view class="time-box">
          <view v-if="selStationItem && timeParams" class="day-box">
            <view
              v-for="(item, dateIdx) in timeParams"
              :key="dateIdx"
              :class="['item', dateIndex == dateIdx ? 'active' : '']"
              @tap="changeData(item, dateIdx)"
            >{{ item.dateTime }}</view>
          </view>
          <block v-if="timeParams[dateIndex]">
            <view v-if="timeParams[dateIndex].hourTimes" class="hour-box">
              <radio-group v-for="(timeItem, timeIdx) in timeParams[dateIndex].hourTimes" :key="timeIdx">
                <view class="item" @tap="changeTime(timeItem, timeIdx)">
                  <view :class="['number', timeIndex == timeIdx ? 'red-word' : '']">{{ timeItem }}</view>
                  <radio
                    v-if="timeIndex == timeIdx"
                    color="#eb2444"
                    class="check"
                    :checked="timeIndex == timeIdx"
                    :value="String(timeIdx)"
                  />
                </view>
              </radio-group>
            </view>
          </block>
        </view>
      </view>
    </view>

    <!-- 查看留言（虚拟商品） -->
    <view class="popup-hide" :hidden="!showViewMsg">
      <view class="popup-box virtual-goods-msg-pop">
        <view class="con-tit">
          <view class="tit-text">{{ i18n.viewMsg }}</view>
          <view class="close" @tap="closePopup" />
        </view>
        <view class="msg-pop-con">
          <view class="msg-list">
            <view v-for="(item, index) in virtualRemarkList" :key="index" class="msg-item">
              <view class="item-con weak">{{ item.name }}</view>
              <view class="item-con">{{ item.value }}</view>
            </view>
          </view>
          <view class="pop-foot">
            <view class="foot-btn" @tap="closePopup">{{ i18n.gotIt }}</view>
          </view>
        </view>
      </view>
    </view>

    <invoiceEdit
      v-if="isShowInvoicePopup"
      :invoice-data-from="invoiceDataFrom"
      :shop-id="invoiceShopId"
      :invoice-id="invoiceId"
      @closePopup="closePopup"
      @getInvoiceData="getInvoiceData"
    />
  </view>
</template>

<script>
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')
const locTrans = require('@/utils/locTrans.js')
const config = require('@/utils/config.js')

let t = 0
let show = false
let moveY = 200
import coupon from '../../../components/order-coupon/index.vue'
import invoiceEdit from '../../../components/invoice-edit/index.vue'
export default {

  components: {
    coupon,
    invoiceEdit
  },
  props: {},
  data() {
    return {
      popupShow: false,
      orderEntry: '0', // 订单入口 0购物车 1立即购买
      orderType: 0, // 订单类型(0普通商品 1拼团 2秒杀 3氢春豆)
      userAddr: null,
      orderItems: [],
      shopCartOrders: [],
      // 所有店铺的数据
      couponSts: 1,
      platformCoupons: {
        canUseLength: 0,
        canUseCoupons: [],
        unCanUseCoupons: []
      },
      // 平台优惠券数据
      showCoupons: {
        canUseCoupons: [],
        unCanUseCoupons: []
      },
      actualTotal: 0,
      total: 0,
      totalCount: 0,
      transFee: 0,
      shopFreeTransFee: 0,
      reduceAmount: 0, // 减免金
      couponIds: [],
      couponUserIds: [],
      userChangeCoupon: 0, // 用户有没有对优惠券进行改变
      orderReduce: 0,
      choose: true,
      totalScoreAmount: 0, // 氢春豆抵扣金额
      totalUsableScore: 0, // 整个订单可以使用的氢春豆数
      isScorePay: 0, // 用户是否选择氢春豆抵现(0不使用 1使用 默认不使用)
      isChecked: false, // 是否选择会员氢春豆抵现
      isProhibit: false, // （氢春豆抵现）checkbox是否禁止
      totalLevelAmount: 0, // 等级抵扣金额
      freeTransFee: 0, // 用户等级免运费金额
      orderShopReduce: '', // 店铺总优惠金额（满减满折+店铺优惠券）
      isCanUse: true,
      order: true,
      editorFlag: false, // 用户点击编辑按钮所在区域隐藏
      userUseScore: '', // 氢春豆数量
      userUseScoreHis: '', // 氢春豆数量
      scorePlaceholder: '', // 氢春豆抵扣的占位符
      accountCanUseScore: 0, // 用户当前可用氢春豆
      shopUseScore: '', // 氢春豆抵现比例
      maxUsableScore: '', // 最大可用氢春豆
      showScorePop: false, // 氢春豆输入弹窗显隐
      isEditAddr: false, // 编辑地址
      showDistributionPop: false, // 选择物流方式弹窗
      addressList: [], // 地址列表
      showAddressListPop: false, // 可用地址弹窗
      isDistribution: true, // 配送方式tab状态
      showRaisingUserList: false, // 选择历史提货人弹窗
      showRaisingTimePop: false, // 选择提货时间弹窗
      dvyType: 1, // 配送类型 1:快递 2:自提 3：无需快递 4:同城配送
      filterShopItems: [], // 过滤掉的商品项
      value: [0, 0, 0],
      addrInfoList: [],
      provArray: [],
      cityArray: [],
      areaArray: [],
      province: '',
      city: '',
      area: '',
      provinceId: 0,
      cityId: 0,
      areaId: 0,
      receiver: '',
      mobile: '',
      addr: '',
      addrId: 0,
      lat: '',
      lng: '',
      animation: '',
      show: '',
      saveEditFlag: false, // 弹窗确认选择地址
      region: '',
      stationUserName: '', // 提货人
      stationUserMobile: '', // 提货人手机号
      stationUserInfo: [], // 历史提货人
      stationIdx: null, // 历史提货人选中index
      selStationItem: {}, // 选中的自提点数据
      timeParams: [],
      dateIndex: 0, // 日期下标
      timeIndex: null, // 时间下标
      timeContent: '', // 选中的时间
      dateContent: '', // 选中的日期
      selectDistributionWay: false, // 选择订单发货方式
      orderScorePlaceHolder: '', // 氢春豆弹窗输入框订单可使用氢春豆提示占位符
      disabled: false, // 是否禁止输入框输入
      selStation: '', // 是否选择自提点
      errorTips: 0, // 错误提示
      tabbar: true,
      // 获取屏幕高度
      windowHeight: '',
      // 判断是否输入了地址
      boolenRes: 1, // 1地址确认状态  //0地址未确认状态
      preSellStatus: '', // 是否预售商品
      curLang: uni.getStorageSync('bbcLang'),
      storeOfferAmount: 0, // 店铺优惠
      eventOfferAmount: 0, // 活动优惠
      key: 'L4DBZ-VSSKJ-GCDFX-KGBVR-KHZ2J-RNF2Q',
      isMap: false,
      isFirst: true,
      // 是否可选同城配送(多店铺不支持)
      canChooseSameCity: true,

      invoiceId: '', // 发票id
      invoiceShopId: '',
      invoiceDataList: [],
      invoiceDataFrom: {},
      isShowInvoicePopup: false,

      // 1虚拟商品
      mold: '',
      isToPay: false,

      // 查看留言弹窗显隐
      showViewMsg: false,

      // 留言（虚拟商品）
      virtualRemarkList: [],
      allVirtualMsg: [],

      // 是否正在打开店铺优惠券弹窗
      isShopCoupon: null,

      pickUpPointSelected: false, // 是否已选自提点
      orderPath: '',
      pollingTimes: 0,
      seckillOrderStsTimer: '',
      scorePrice: 0,
      startDeliveryFee: 0,
      module: '',
      showMailHome:true,
      distributionUserId:'',// 团长ID
    }
  },

  computed: {
    i18n() {
      return this.$t('index')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取省市区列表数据
    // this.getAreaListInfo()
    if(uni.getStorageSync('bbcDvyType')==2||options.dvyType==2){
      this.showMailHome=false
    }
    const that = this
    this.dvyType = uni.getStorageSync('bbcDvyType') || options.dvyType || 1
    this.orderEntry = options.orderEntry || uni.getStorageSync('bbcOrderEntry') || 0
    this.module = options.module || ''
    this.setData({
      orderType: Number(options.orderType),
      mold: Number(options.mold),
      pickUpPointSelected: options.pickUpPointSelected || false,
      orderPath: options.orderPath
    })
    if (this.dvyType == 2 && uni.getStorageSync('bbcSelStationItem')) {
      this.selStationItem = uni.getStorageSync('bbcSelStationItem')
      this.timeParams = this.selStationItem.timeParams
      const info = uni.getStorageSync('bbcSelectedPickupinfor') || {}
      if (info) {
        this.stationUserName = info.stationUserName
        this.stationUserMobile = info.stationUserMobile
        this.stationIdx = info.stationIdx
      }
    } else {
      // 定位回跳后获取位置信息
      if (this.module === 'locationPicker') {
        // this.dvyType = 1
        this.isEditAddr = true
        this.afterLoc(options)
      }
    }

    if (this.dvyType == 1 || this.dvyType == 4) {
      // 同城 || 邮寄
      this.isDistribution = true
    } else if (this.dvyType == 2) {
      // 自提
      this.isDistribution = false
    }
    this.setData({
      provArray: this.provArray.unshift({})
    })
    this.loadAddressList().then(res => {
      that.addressList = res
    }) // 加载地址列表
    setTimeout(() => {
      that.isToPay = true
    }, 100)
    // 获取用户信息
    this.queryUserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.animation = wx.createAnimation({
      transformOrigin: '50% 50%',
      duration: 0,
      timingFunction: 'ease',
      delay: 0
    })
    this.animation.translateY(200 + 'vh').step()
    this.setData({
      animation: this.animation.export(),
      show: show
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 设置头部导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.submitOrders
    })
    const selStationItem = uni.getStorageSync('bbcSelStationItem')
    if (selStationItem) {
      this.selStationItem = selStationItem
      this.timeParams = selStationItem.timeParams
      if (selStationItem.pickUpPointSelected) {
        const info = uni.getStorageSync('bbcSelectedPickupinfor') || {}
        if (info) {
          this.stationUserName = info.stationUserName
          this.stationUserMobile = info.stationUserMobile
          this.stationIdx = info.stationIdx
        }
      }
    }
    uni.removeStorageSync('bbcMsgList')
    // 获取当前可用氢春豆
    this.getUserLevelInfo()
    this.loadOrderData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if (this.mold === 1) {
      // 清除虚拟商品留言缓存
      uni.removeStorageSync('bbcVirtualRemark')
      uni.removeStorageSync('bbcMsgList')
    }
    uni.removeStorageSync('bbcSelStationItem')
    uni.removeStorageSync('bbcOrderEntry')
    uni.removeStorageSync('bbcDvyType')
    uni.removeStorageSync('bbcAddrInfo')
    uni.removeStorageSync('bbcSelectedPickupinfors')
  },

  methods: {
    /**
      * 获取到定位后的回调
      * loc 定位信息
      */
    afterLoc(loc) {
      this.mobile = uni.getStorageSync('bbcAddrInfo').mobile
      this.receiver = uni.getStorageSync('bbcAddrInfo').receiver
      if (loc && loc.module === 'locationPicker') { // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
        this.addr = loc.addr
        this.lat = loc.latng.split(',')[0]
        this.lng = loc.latng.split(',')[1]
        this.isMap = false
        util.area(loc.addr, loc.name).then(res => {
          if (!res) return
          const addrReplacrstr = res[0].name + res[1].name + res[2].name
          this.addr = this.addr.replace(addrReplacrstr, '') || loc.name
          this.setData({
            value: [res[0].index, res[1].index, res[2].index],
            province: res[0].name,
            city: res[1].name,
            area: res[2].name,
            provinceId: res[0].areaId,
            cityId: res[1].areaId,
            areaId: res[2].areaId,
            provArray: res[3],
            cityArray: res[4],
            areaArray: res[5]
          })
        })
        this.isPosition = true
      }
    },

    /**
     * 确认地址
     */
    onGetLocation(loc) {
      // #ifdef H5 || APP-PLUS
      this.addr = loc.poiaddress
      this.lat = loc.latlng.lat
      this.lng = loc.latlng.lng
      this.name = loc.poiname
      this.isMap = false
      // #endif

      // #ifdef MP-WEIXIN
      this.lat = loc.latitude // 纬度
      this.lng = loc.longitude // 经度
      this.addr = loc.address // 详细地址
      this.name = loc.name // 详细地址
      // #endif

      util.area(this.addr, this.name).then(res => {
        if (!res) return
        this.addr = this.addr.replace(res[0].name + res[1].name + res[2].name, '') || res.poiname
        this.setData({
          value: [res[0].index, res[1].index, res[2].index],
          province: res[0].name,
          city: res[1].name,
          area: res[2].name,
          provinceId: res[0].areaId,
          cityId: res[1].areaId,
          areaId: res[2].areaId,
          provArray: res[3],
          cityArray: res[4],
          areaArray: res[5]
        })
      })
      const locationInfo = { latitude: this.lat, longitude: this.lng }
      let locationRes
      // #ifdef H5 || APP-PLUS
      locationRes = locTrans.gcj02tobd09(locTrans.wgs84togcj02(locationInfo))
      this.isMapReturn()
      // #endif

      // #ifdef MP-WEIXIN
      locationRes = locTrans.gcj02tobd09(locationInfo)
      // #endif
      this.lat = locationRes.latitude
      this.lng = locationRes.longitude
    },

    /**
     * 打开地图选择地址
     */
    selectLoaction() {
      // #ifdef H5
      this.tabbar = false
      uni.setStorageSync('bbcAddrInfo', { mobile: this.mobile, receiver: this.receiver })
      const backUrl = encodeURIComponent(config.domainAddress + this.$Route.path + '?dvyType=' + this.dvyType + '&orderEntry=' + this.orderEntry)
      window.location.replace(`https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=${backUrl}&key=${this.key}&referer=myapp`)
      // #endif

      // #ifdef APP-PLUS
      this.isMap = true
      this.tabbar = false
      // #endif

      // #ifdef MP-WEIXIN
      uni.chooseLocation({
        success: (res) => {
          this.onGetLocation(res)
        },
        fail: (failMsg) => {
          uni.getSetting({
            success: (res) => {
              if (!res.authSetting['scope.userLocation']) {
                uni.authorize({
                  scope: 'scope.userLocation',
                  success: () => {
                    uni.chooseLocation({
                      success: (res) => {
                        this.onGetLocation(res)
                      }
                    })
                  },
                  fail: () => {
                    uni.showToast({
                      title: this.i18n.authorityTips,
                      icon: 'none'
                    })
                  }
                })
              }
            }
          })
        }
      })
      // #endif
    },

    isMapReturn() {
      uni.setNavigationBarTitle({
        title: this.i18n.submitOrders
      })
      this.isMap = false
      this.tabbar = true
    },

    // 提交订单浮框的显隐
    showTabbar() {
      if (this.disabled == false) {
        this.tabbar = true
      }
    },
    hideTabbar() {
      if (this.disabled == false) {
        this.tabbar = true
      }
    },
    // 切换配送方式
    changeDistribution: function(sts) {
      // sts:  0同城/邮寄   1自提
      this.isDistribution = sts === 0
      this.dvyType = sts === 0 ? 1 : 2
      uni.setStorageSync('bbcDvyType', this.dvyType)
      this.loadOrderData()
    },

    // 选择配送方式
    disRadioChange(e) {
      this.dvyType = e.detail.value
      this.loadOrderData()
      this.showDistributionPop = false
      uni.setStorageSync('bbcDvyType', this.dvyType)
    },

    // 选择地址
    selectAddr: function(item) {
      this.addrId = item.addrId
      this.showAddressListPop = false
      this.isEditAddr = false
      this.getAddrDet()
      this.setData({
        boolenRes: 1
      })
    },

    // 选择历史提货人
    stationRadioChange(e) {
      // console.log(e)
      this.stationIdx = e.detail.value
      this.showRaisingUserList = false
      this.raisingUserList()
    },
    getStationItem: function(item) {
      this.stationUserName = item.stationUserName
      this.stationUserMobile = item.stationUserMobile
      this.showRaisingUserList = false
      // console.log(item)
      // console.log('提货人：', this.stationUserName)
      // console.log('提货人手机号：', this.stationUserMobile)
    },

    // 加载地址列表
    loadAddressList() {
      return new Promise((resolve, reject) => {
        const params = {
          url: '/p/address/list',
          method: 'GET',
          data: {},
          callBack: (res) => {
            resolve(res)
          }
        }
        http.request(params)
      })
    },
    // 根据地址id请求地址详情
    getAddrDet: function() {
      const params = {
        url: '/p/address/addrInfo/' + this.addrId,
        method: 'GET',
        data: {},
        callBack: (res) => {
          this.userAddr = res
          this.loadOrderData()
          this.addr = ''
        }
      }
      http.request(params)
    },

    /**
     * 获取会员氢春豆详情
     */
    getUserLevelInfo() {
      const params = {
        url: '/p/score/scoreInfo',
        method: 'GET',
        dontTrunLogin: true,
        data: {},
        callBack: (res) => {
          this.setData({
            accountCanUseScore: res.score
          })
        }
      }
      http.request(params)
    },

    // 会员氢春豆抵现选择
    useMemberPoints: function() {
      this.isChecked = !this.isChecked
      if (this.maxUsableScore > 0) {
        // totalUsableScore整个订单可以使用的氢春豆数
        this.setData({
          isScorePay: this.isChecked ? 1 : 0,
          userUseScore: this.isChecked ? this.maxUsableScore : 0,
          userUseScoreHis: this.isChecked ? this.maxUsableScore : 0
        })
        this.loadOrderData()
      }
    },

    /**
     * 氢春豆输入弹窗显示
     */
    handleScorePop() {
      this.setData({
        showScorePop: true
      })
    },

    /**
     * 氢春豆抵扣输入框
     */
    handleScoreInput(e) {
      this.userUseScore = Number(e.detail.value.replace(/[^\d]/g, ''))
    },

    /**
     * 修改氢春豆确定弹窗
     */
    confirmScore() {
      if (!this.userUseScore || this.userUseScore < 0) {
        uni.showToast({
          title: this.i18n.enterCorrectPoints,
          icon: 'none'
        })
        return
      }
      if (this.userUseScore > this.maxUsableScore) {
        uni.showToast({
          title:
            this.i18n.mostUserPoints + this.maxUsableScore + this.i18n.integral,
          icon: 'none'
        })
        return
      }
      if (this.userUseScore > this.accountCanUseScore) {
        uni.showToast({
          title: this.i18n.notEnough,
          icon: 'none'
        })
        return
      }
      this.userUseScoreHis = this.userUseScore
      this.loadOrderData()
      this.closePopup()
    },

    /**
     * 加载订单数据
     */
    loadOrderData: function() {
      const orderParam = uni.getStorageSync('bbcOrderItem') || {}
      const dvyType = this.dvyType
      const url = this.orderType === 3 ? '/p/score/confirm' : this.orderType === 2 ? `/p/seckill/${this.orderPath}/confirm` : this.orderType === 1 ? '/p/group/order/confirm' : '/p/order/confirm'
      const params = {
        url,
        method: 'POST',
        data: {
          addrId: this.userAddr?.addrId || 0,
          couponIds: this.couponIds,
          couponUserIds: this.couponUserIds,
          orderItem: this.orderEntry === '1' ? uni.getStorageSync('bbcOrderItem') : undefined,
          dvyType: dvyType || 1, // 配送类型 1:快递 2:自提 3：无需快递 4:同城配送
          isScorePay: this.isScorePay,
          groupSkuId: orderParam.groupSkuId,
          groupTeamId: orderParam.groupTeamId,
          seckillSkuId: orderParam.seckillSkuId,
          prodCount: orderParam.prodCount,
          userChangeCoupon: this.userChangeCoupon,
          userUseScore: this.isScorePay ? this.userUseScore : 0
        },
        callBack: (res) => {
          var shopCartOrders = res.shopCartOrders // 购物车店铺商品信息列表
          var remarksList = []
          var couponIds = []
          const couponUserIds = []
          var storeOfferAmount = 0
          var eventOfferAmount = 0
          let selectDistributionWay = false
          if (!this.isFirst) {
            this.shopCartOrders.forEach((el) => {
              remarksList.push(el.remarks)
            })
          }
          for (let i = 0; i < shopCartOrders.length; i++) {
            const shopCart = shopCartOrders[i]
            if (this.isFirst) {
              shopCart.remarks = ''
            } else {
              shopCart.remarks = remarksList[i]
            }
            shopCart.shopCoupons = this.splitCouponAndPushCouponIds(shopCart.coupons, couponIds, couponUserIds)
            // 店铺优惠券优惠金额
            storeOfferAmount += shopCart.shopCoupons.couponAmount
            eventOfferAmount += shopCart.discountReduce
            // 顶部切换配送方式显隐判断 (单店铺结算时才需要)
            if (shopCartOrders.length === 1) {
              selectDistributionWay = true
              for (let j = 0; j < shopCart.shopCartItemDiscounts.length; j++) {
                const shopCartItemDiscount = shopCart.shopCartItemDiscounts[j]
                for (let k = 0; k < shopCartItemDiscount.shopCartItems.length; k++) {
                  const prodItem = shopCartItemDiscount.shopCartItems[k]
                  if (prodItem.mold === 1) break // 虚拟订单
                  // 如果是套餐商品, 需要所有商品都包含自提才能切换
                  if (prodItem.comboId) {
                    if (!prodItem.deliveryModeVO.hasUserPickUp) {
                      selectDistributionWay = false
                      break
                    }
                  } else {
                    if (prodItem.deliveryModeVO.hasUserPickUp) {
                      selectDistributionWay = true
                      break
                    } else {
                      selectDistributionWay = false
                    }
                  }
                }
              }
            }
          }
          // 平台优惠券
          var platformCoupons = this.splitCouponAndPushCouponIds(res.coupons, couponIds, couponUserIds)
          // 商品运费
          var transFee = Math.abs((res.totalTransFee || 0) + (res.shopFreeTransFee || 0) + (res.freeTransFee || 0))
          // 运费减免
          const shopFreeTransFee = Math.abs(res.shopFreeTransFee)
          var scorePlaceholder = `${this.i18n.use} ${res.totalUsableScore} ${this.i18n.pointsDeduction} ${res.totalScoreAmount} ${this.i18n.yuan}`
          var orderScorePlaceHolder = `${this.i18n.accountSurplus} ${this.accountCanUseScore} ${this.i18n.accountSurplus2} ${res.maxUsableScore}`
          this.setData({
            selectDistributionWay: selectDistributionWay,
            canChooseSameCity: res.shopCityStatus, // shopCityStatus: 1可用 -1不在范围内 -2商家没有配置同城配送信息 -3起送费不够
            dvyType: res.dvyType,
            platformCoupons: platformCoupons, // 整个订单可以使用的优惠券列表
            shopCartOrders: shopCartOrders, // 所有的店铺的购物车信息
            actualTotal: res.actualTotal, // 实际总值
            total: res.total, // 商品总值
            totalCount: res.totalCount, // 商品总数
            userAddr: res.userAddr, // 地址Dto
            transFee: transFee, // 总运费
            shopFreeTransFee: shopFreeTransFee, // 运费减免
            orderReduce: res.orderReduce, // 订单优惠金额(所有店铺优惠金额和使用氢春豆抵现相加)
            totalScoreAmount: res.totalScoreAmount, // 氢春豆抵扣金额
            totalUsableScore: res.totalUsableScore, // 使用的氢春豆数量
            isScorePay: res.isScorePay, // 用户是否选择氢春豆抵现(0不使用 1使用 默认不使用)
            totalLevelAmount: res.totalLevelAmount, // 等级抵扣金额
            freeTransFee: res.freeTransFee, // 用户等级免运费金额
            couponIds: couponIds,
            couponUserIds: couponUserIds,
            maxUsableScore: res.maxUsableScore, // 整个订单可以使用的氢春豆数
            scorePlaceholder: scorePlaceholder,
            orderScorePlaceHolder: orderScorePlaceHolder,
            shopUseScore: res.shopUseScore, // 氢春豆抵现比例;
            filterShopItems: res.filterShopItems, // 过滤掉的商品项
            preSellStatus: res.preSellStatus, // 是否预售商品
            storeOfferAmount: storeOfferAmount, // 店铺优惠券优惠
            eventOfferAmount: eventOfferAmount, // 活动优惠
            orderShopReduce: res.orderShopReduce, // 店铺总优惠金额（促销满减+店铺优惠券）
            isFirst: false,
            // 氢春豆金额
            scorePrice: res.orderType === 'SCORE' ? shopCartOrders[0].shopCartItemDiscounts[0].shopCartItems[0].scorePrice : res.scorePrice,
            // 使用的氢春豆数量
            userUseScore: res.totalUsableScore,
            userUseScoreHis: res.totalUsableScore,
            // 起送费 (同城配送)
            startDeliveryFee: res.startDeliveryFee
          })

          // 虚拟商品留言
          this.handleAllVirtualMsg()

          this.disabledInput() // 是否禁止提货人输入框输入
          if (this.dvyType == 2) {
            this.getStationUserInfo() // 历史提货人
          }
          if (res.dvyType != dvyType) {
            this.loadOrderData()
          }
          this.setOrderInvoice()
        },
        errCallBack: (errMsg) => {
          if (errMsg.code === 'A03001' || errMsg.code === 'A03002') {
            uni.showModal({
              title: this.i18n.tips,
              content: errMsg.code === 'A03001' ? this.i18n.deliveryNotSupported : this.i18n.duplicateErrorTips,
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                  uni.navigateBack()
                }
              }
            })
          } else {
            uni.showModal({
              title: this.i18n.tips,
              content: errMsg.msg,
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                  uni.navigateBack()
                }
              }
            })
          }
        }
      }
      http.request(params)
    },

    /**
     * 分割优惠券成
     * 1. canUseCoupons 可使用优惠券列表
     * 2. unCanUseCoupons 不可使用优惠券列表
     * 3. couponAmount 选中的优惠券可优惠金额
     * 4. 将选中的优惠券ids保存起来
     * @param {*} coupons 优惠券列表
     * @param {*} couponIds 选中的优惠券id
     * @param {*} couponUserIds 选中的优惠券的使用id
     */
    splitCouponAndPushCouponIds(coupons, couponIds, couponUserIds) {
      if (!coupons || !coupons.length) {
        return {
          canUseLength: 0,
          couponAmount: 0,
          canUseCoupons: [],
          unCanUseCoupons: []
        }
      }

      const canUseCoupons = []
      const unCanUseCoupons = []
      let couponAmount = 0
      coupons.forEach((coupon) => {
        if (coupon.canUse) {
          canUseCoupons.push(coupon)
        } else {
          unCanUseCoupons.push(coupon)
        }

        if (coupon.choose) {
          couponIds.push(coupon.couponId)
          couponUserIds.push(coupon.couponUserId)
          couponAmount = coupon.reduceAmount
        }
      })
      return {
        canUseLength: canUseCoupons.length,
        couponAmount: couponAmount,
        canUseCoupons: canUseCoupons,
        unCanUseCoupons: unCanUseCoupons
      }
    },

    /**
     * 虚拟商品留言
     */
    handleAllVirtualMsg() {
      this.allVirtualMsg = this.getValueOfArr(this.shopCartOrders)
      if (uni.getStorageSync('bbcMsgList')) {
        const list = JSON.parse(uni.getStorageSync('bbcMsgList'))
        this.allVirtualMsg.forEach((msgItem, index) => {
          if (list[index].id === msgItem.id && !msgItem.value) {
            msgItem.value = list[index].value
          }
        })
      }
    },
    getValueOfArr(data) {
      const layers = ['shopCartItemDiscounts', 'shopCartItems', 'virtualRemarkList']
      const deepGet = (item, index) => {
        return item.map(la => {
          const children = la[layers[index]]
          if (Array.isArray(children)) {
            if (layers.length === index + 1) {
              return children.map((ch, idx) => {
                ch.id = la.prodId + '_' + idx
                return ch
              })
            }
            return deepGet(children, index + 1)
          }
          return []
        }).flat(Infinity)
      }
      return deepGet(data, 0)
    },

    /**
		 * 虚拟商品留言输入框失焦
		 */
    handleInputBlur(value, msgIndex, prodIndex, discIndex, shopIndex) {
      if (!value) {
        return
      }
      const currentItem = this.shopCartOrders[shopIndex].shopCartItemDiscounts[discIndex].shopCartItems[prodIndex].virtualRemarkList[msgIndex]
      this.allVirtualMsg.forEach(msgItem => {
        if (currentItem.id === msgItem.id) {
          msgItem.value = value
        }
      })
      uni.setStorageSync('bbcMsgList', JSON.stringify(this.allVirtualMsg))
    },

    /**
     * 提交订单校验
     */
    toPay: function() {
      if (!this.isToPay) return
      if (this.dvyType != 2) {
        if (!this.userAddr && this.mold != 1) {
          uni.showToast({
            title: this.i18n.saveAndUseTips,
            icon: 'none'
          })
          return
        }
        if (!this.shopCartOrders.length) {
          var title = this.dvyType == 1 ? this.i18n.expressDelivery : this.dvyType == 4 ? this.i18n.sameDelivery : ''
          uni.showToast({
            title: this.i18n.productNotSupported + title,
            icon: 'none'
          })
          return
        }
        if (this.dvyType == 4 && (!this.userAddr.lat || !this.userAddr.lng)) {
          uni.showModal({
            title: this.i18n.tips,
            content: this.i18n.cityAddressPrompt,
            showCancel: false,
            confirmText: this.i18n.confirm,
            success: (res) => {
              if (res.confirm) {
                uni.navigateTo({
                  url: '/package-user/pages/edit-address/edit-address?addrId=' + this.userAddr.addrId
                })
              }
            }
          })
          return
        }
      } else if (this.dvyType == 2) {
        var reg = /^\s+$/g
        if (!this.shopCartOrders.length) {
          uni.showToast({
            title: this.i18n.productNotSupportedStop,
            icon: 'none'
          })
          return
        }
        if (!this.selStationItem.province) {
          uni.showToast({
            title: this.i18n.selectPickPoint,
            icon: 'none'
          })
          return
        }
        if (reg.test(this.stationUserName) || reg.test(this.stationUserMobile)) {
          uni.showToast({
            title: this.i18n.inputAllSpace,
            icon: 'none'
          })
          return
        }
        if (!this.stationUserName || !this.stationUserMobile) {
          uni.showToast({
            title: this.i18n.fillDeliveryPersonInformation,
            icon: 'none'
          })
          return
        }
        if (!util.checkPhoneNumber(this.stationUserMobile)) {
          uni.showToast({
            title: this.i18n.enterCorrectPhone,
            icon: 'none'
          })
          return
        }
        if (!this.dateContent || !this.timeContent) {
          uni.showToast({
            title: this.i18n.selectPickUpTime,
            icon: 'none'
          })
          return
        }
      }

      // 点击地址判断
      if ((!this.boolenRes || this.addressList[0] === undefined) && this.dvyType != 2 && this.mold != 1) {
        uni.showToast({
          title: this.i18n.saveAndUseTips,
          icon: 'none'
        })
        return
      }

      // 氢春豆按钮选择判断
      if (this.isScorePay == 1 && this.userUseScore <= 0 && this.orderType !== 3) {
        uni.showToast({
          title: this.i18n.enterPoints,
          icon: 'none'
        })
        return
      }
      // 虚拟商品留言校验
      if (this.allVirtualMsg.length &&
          this.allVirtualMsg.find(el => el.value && !el.value.trim())) {
        uni.showToast({
          title: this.i18n.msgCannotBeAllSpaces,
          icon: 'none'
        })
        return
      }
      if (this.allVirtualMsg.length &&
          this.allVirtualMsg.find(el => el.isRequired && !el.value)) {
        uni.showToast({
          title: this.i18n.requiredMessage,
          icon: 'none'
        })
        return
      }

      this.submitOrder()
    },

    // 提交订单
    submitOrder: function() {
      var isPurePoints = this.actualTotal > 0 ? '' : 1 // 是否纯氢春豆: 1是
      var shopCartOrders = this.shopCartOrders
      var reg = /^\s+$/g
      var orderShopParam = []
      shopCartOrders.forEach((shopCart) => {
        orderShopParam.push({
          remarks: shopCart.remarks.trim() ? shopCart.remarks : '',
          shopId: shopCart.shopId
        })
      })

      const remarksFlag = orderShopParam.some((item) => {
        return reg.test(item.remarks)
      })

      if (remarksFlag) {
        uni.showToast({
          title: this.i18n.inputAllSpace,
          icon: 'none'
        })
        return
      }
      var orderSelfStationDto = {
        stationId: this.selStationItem.stationId,
        stationTime: this.dateContent + ' ' + this.timeContent,
        stationUserMobile: this.stationUserMobile,
        stationUserName: this.stationUserName
      }
      let orderInvoiceList = [] // invoiceDataFrom
      shopCartOrders.forEach((item) => {
        if (item.invoiceDataFrom && item.invoiceDataFrom.invoiceType === 1) {
          orderInvoiceList.push(item.invoiceDataFrom)
        }
      })
      if (orderInvoiceList.length === 0) {
        orderInvoiceList = null
      }

      this.allVirtualMsg.forEach(el => {
        el.id = undefined
      })
      var obj = {
        coupons: this.coupons,
        isScorePay: this.isScorePay,
        orderSelfStationDto: orderSelfStationDto,
        orderInvoiceList: orderInvoiceList,
        virtualRemarkList: this.allVirtualMsg,
        groupTeamId: uni.getStorageSync('bbcOrderItem').groupTeamId
      }
      // if (this.orderType === 1 || this.orderType === 2) {
      //   obj['orderShopParam'] = orderShopParam
      // } else {
      obj['orderShopParams'] = orderShopParam
      // }
      uni.removeStorageSync('bbcMsgList')
      const params = {
        url: this.orderType === 1 ? '/p/group/order/submit' : this.orderType === 2 ? `/p/seckill/${this.orderPath}/submit` : '/p/order/submit',
        method: 'POST',
        selfLoading: this.orderType === 2,
        data: obj,
        callBack: (res) => {
          // 秒杀订单处理
          if (this.orderType === 2) {
            uni.showLoading({
              title: this.i18n.desperatelyBuying,
              mask: true
            })
            setTimeout(() => {
              this.checkSeckillOrderSubmitStatus(res.orderNumbers)
            }, 3000)
          } else {
            if (res.duplicateError != null && res.duplicateError == 1) {
              uni.showModal({
                title: this.i18n.tips,
                content: this.i18n.duplicateErrorTips,
                confirmText: this.i18n.confirm,
                showCancel: false,
                success: (res) => {
                  if (res.confirm) {
                    uni.navigateBack()
                  }
                }
              })
            } else {
              const query = {
                orderNumbers: res.orderNumbers,
                dvyType: this.dvyType,
                isPurePoints: isPurePoints,
                orderType: this.orderType || 0,
                ordermold: this.mold || 0
              }
              // 套餐规则修改
              if (this.dvyType === 2 && this.shopCartOrders.some((e) => {
                return e.shopCartItemDiscounts.some(value => {
                  return value.chooseComboItemDto && value.shopCartItems.some(item => item.mold === 1)
                })
              })) {
                query.dvyType = 1
              }
              this.$Router.replace({ path: '/package-pay/pages/pay-way/pay-way', query })
            }
          }
        },
        errCallBack: (errMsg) => {
          if (errMsg.code === 'A00001' || errMsg.code === 'A03002' || errMsg.code === 'A07001') {
            if (errMsg.code === 'A07001') {
              this.shopCartOrders.forEach((shopCart) => {
                shopCart.shopCartItemDiscounts.forEach((shopCartItemDiscount) => {
                  shopCartItemDiscount.shopCartItems.forEach((prodItem) => {
                    if (!prodItem.isDelivery) {
                      errMsg.msg += prodItem.prodName + '、'
                    }
                  })
                })
              })
              errMsg.msg = errMsg.msg.substring(0, errMsg.msg.length - 1)
            }
            uni.showModal({
              title: this.i18n.tips,
              showCancel: false,
              content: errMsg.msg,
              confirmText: this.i18n.confirm,
              success: (res) => {
                if (res.confirm) {
                  uni.navigateBack()
                }
              }
            })
          }
        }
      }
      http.request(params)
    },

    /**
     * 检查秒杀订单提交状态
     */
    checkSeckillOrderSubmitStatus(seckillOrderNumber) {
      if (this.pollingTimes < 10) {
        const params = {
          url: '/p/seckill/createOrderStatus',
          method: 'GET',
          data: {
            orderNumber: seckillOrderNumber
          },
          callBack: res => {
            if (res) {
              uni.hideLoading()
              clearTimeout(this.seckillOrderStsTimer)
              this.$Router.replace({ path: '/package-pay/pages/pay-way/pay-way?orderNumbers=' + seckillOrderNumber })
            } else {
              this.pollingTimes++
              this.seckillOrderStsTimer = setTimeout(this.checkSeckillOrderSubmitStatus(seckillOrderNumber), 3000)
            }
          }
        }
        http.request(params)
      } else {
        uni.hideLoading()
        clearTimeout(this.seckillOrderStsTimer)
        uni.showToast({
          title: this.i18n.secFailTips,
          icon: 'none',
          mask: true
        })
      }
    },

    // 店铺切换可用/不可用优惠券列表
    changeCouponSts: function(e) {
      this.setData({
        couponSts: e.currentTarget.dataset.sts
      })
    },
    // 店铺优惠券弹框
    showCouponPopup: function(e) {
      var index = Number(e.currentTarget.dataset.index)
      var shopCartOrders = this.shopCartOrders
      this.setData({
        showCoupons:
          index + '' === '-1'
            ? this.platformCoupons
            : shopCartOrders[index].shopCoupons,
        popupShow: true
      })
      this.showCoupons.canUseCoupons.forEach((item) => {
        if (this.couponUserIds.indexOf(item.couponUserId) !== -1) {
          item.choose = true
        } else {
          item.choose = false
        }
      })
      this.isShopCoupon = index !== -1
    },
    // 查看留言弹窗
    showViewMsgPopup: function() {
      this.showViewMsg = true
    },
    closePopup: function() {
      this.setData({
        popupShow: false,
        showScorePop: false,
        showDistributionPop: false,
        showAddressListPop: false,
        showRaisingUserList: false,
        showRaisingTimePop: false,
        isShowInvoicePopup: false,
        showViewMsg: false
      })
    },
    closePopupHide() {
      this.userUseScore = this.userUseScoreHis
      this.closePopup()
    },
    // 发票信息弹窗
    showInvoicePopup(shopId, invoiceDataFrom) {
      // console.log(shopId, invoiceDataFrom)
      this.invoiceDataFrom = invoiceDataFrom || {}
      this.invoiceShopId = shopId
      this.isShowInvoicePopup = true
    },
    getInvoiceData(data) {
      // invoiceDataFrom
      let flag = false
      for (let i = 0; i < this.invoiceDataList.length; i++) {
        if (this.invoiceDataList[i].shopId === data.shopId) {
          flag = true
          if (data) {
            this.invoiceDataList[i] = data
          }
          break
        }
      }
      if (!flag && data) {
        this.invoiceDataList.push(data)
      }

      this.shopCartOrders.forEach((item) => {
        if (item.shopId === data.shopId) {
          item.invoiceDataFrom = data
        }
      })
    },
    setOrderInvoice() {
      this.invoiceDataList.forEach((invoice) => {
        this.shopCartOrders.forEach((item) => {
          if (item.shopId === invoice.shopId) {
            item.invoiceDataFrom = invoice
          }
        })
      })
    },
    /**
     * 去地址页面
     */
    toAddrListPage: function() {
      // uni.navigateTo({
      // 	url: '/package-user/pages/delivery-address/delivery-address?order=0'
      // });
      this.isEditAddr = true
      this.setData({
        boolenRes: 0,
        addrId: '',
        editorFlag: false,
        province: null,
        city: null,
        area: null
      })
    },

    /**
     * 确定选择好的优惠券
     */
    choosedCoupon: function() {
      var couponIds = this.couponIds // 店铺优惠券单选操作
      var couponUserIds = this.couponUserIds
      if (!this.showCoupons) {
        this.setData({
          popupShow: false
        })
        return
      }
      var canUseCoupons = this.showCoupons.canUseCoupons
      var checkedCouponId = ''
      var checkedCouponId1 = ''
      for (var canUseCouponIndex in canUseCoupons) {
        var coupon = canUseCoupons[canUseCouponIndex]
        // 增加优惠券条件判断，防止couponId相同而couponUserId不同导致所选券混乱
        const couponIdIndex = couponIds.indexOf(coupon.couponId)
        const couponUserIdIndex = couponUserIds.indexOf(coupon.couponUserId)
        if (!coupon.choose && couponIdIndex !== -1 && couponUserIdIndex !== -1) {
          couponIds.splice(couponIdIndex, 1)
          couponUserIds.splice(couponUserIdIndex, 1)
        }
        if (coupon.choose) {
          checkedCouponId = coupon.couponId
          checkedCouponId1 = coupon.couponUserId
        }
      }
      couponIds.push(checkedCouponId)
      couponUserIds.push(checkedCouponId1)
      this.setData({
        couponIds: couponIds,
        couponUserIds: couponUserIds,
        popupShow: false
      })
      this.loadOrderData()
    },

    /**
     * 优惠券子组件发过来
     */
    checkCoupon: function(e) {
      // console.log(e)
      var showCoupons = this.showCoupons // 店铺优惠券单选操作

      var canUseCoupons = showCoupons.canUseCoupons

      for (var canUseCouponIndex in canUseCoupons) {
        if (
          e.couponUserId == canUseCoupons[canUseCouponIndex].couponUserId &&
          canUseCouponIndex == e.index
        ) {
          canUseCoupons[canUseCouponIndex].choose =
            !canUseCoupons[canUseCouponIndex].choose
        } else {
          canUseCoupons[canUseCouponIndex].choose = false
        }
      }
      this.showCoupons = showCoupons
      this.userChangeCoupon = 1
    },

    /**
     * 输入备注
     */
    onRemarkIpt: function(e) {
      var index = e.currentTarget.dataset.index
      var shopCartOrders = this.shopCartOrders
      shopCartOrders[index].remarks = e.detail.value
      this.setData({
        shopCartOrders: shopCartOrders
      })
    },

    /**
     * 物流选择弹窗显示
     */
    distributionPop() {
      this.showDistributionPop = true
    },

    /**
     * 可用地址弹窗显示
     */
    addressListPop() {
      if (this.addressList.length) {
        this.showAddressListPop = true
      }
    },

    /**
     * 历史提货人弹窗显示
     */
    raisingUserList() {
      if (this.dvyType == 2 && !this.shopCartOrders.length) {
        uni.showToast({
          title: this.i18n.productNotSupportedStop,
          icon: 'none'
        })
        return
      }
      this.setData({
        showRaisingUserList: true
      })
    },

    /**
     * 选择提货时间弹窗显示
     */
    raisingTimePop() {
      if (!this.selStationItem.province) {
        uni.showToast({
          title: this.i18n.selectPickPoint,
          icon: 'none'
        })
      } else {
        this.setData({
          showRaisingTimePop: true
        })
        const a = this.timeParams[0].dateTime.split('-')
        this.dateContent =
          a[0] + this.i18n.virtualMonth + a[1] + this.i18n.dayOfAMonth
      }
    },

    /**
     * 选择自提点
     */
    goSelectStore() {
      if (!this.shopCartOrders.length) {
        uni.showToast({
          title: this.i18n.productNotSupportedStop,
          icon: 'none'
        })
        return
      }
      // 选择与重新选择自提点时时间
      this.setData({
        dateIndex: 0, // 日期下标
        timeIndex: null, // 时间下标
        timeContent: '', // 选中的时间
        dateContent: '' // 选中的日期
      })
      // 将已选择/已填写的历史提货人信息保存起来
      if (this.stationUserName || this.stationUserMobile || this.stationIdx) {
        const selectedPickupinfor = {
          stationUserName: this.stationUserName,
          stationUserMobile: this.stationUserMobile,
          stationIdx: this.stationIdx
        }
        uni.setStorageSync('bbcSelectedPickupinfor', selectedPickupinfor)
      }
      uni.navigateTo({
        url:
          '/package-user/pages/select-store/select-store?shopId=' +
          this.shopCartOrders[0].shopId +
          '&orderEntry=' +
          this.orderEntry
      })
    },

    /**
     * 禁止输入提货人信息
     */
    disabledInput: function() {
      if (this.dvyType == 2 && !this.shopCartOrders.length) {
        this.disabled = true
      } else {
        this.disabled = false
      }
    },

    /**
     * 获取历史提货人列表
     */
    getStationUserInfo: function() {
      const params = {
        url: '/p/orderSelfStation/getStationUserInfo',
        method: 'GET',
        data: {},
        callBack: (res) => {
          this.stationUserInfo = res
        }
      }
      http.request(params)
    },

    getConsigneeInt: function(e) {
      this.stationUserName = e.detail.value
    },
    getConMobileInt: function(e) {
      this.stationUserMobile = e.detail.value
    },

    /**
     * 改变预约自提日期选择
     */
    changeData: function(item, dateIdx) {
      this.dateIndex = dateIdx
      // console.log(this.dateIndex, this.timeParams[this.dateIndex].hourTimes)

      // 点击日期时默认选中第一个时间段
      this.timeIndex = 0 // 时间下标
      this.timeContent = this.timeParams[this.dateIndex].hourTimes[0]

      const a = item.dateTime.split('-')

      this.dateContent = a[0] + '-' + a[1]
    },

    /**
     * 改变预约自提时间选择
     */
    changeTime: function(timeItem, timeIdx) {
      this.timeIndex = timeIdx
      this.showRaisingTimePop = false
      this.timeContent = timeItem
    },

    /**
     * 获取当前日期零点的时间戳
     * @param date
     */
    getStartTimestampOfDay: function() {
      const d = new Date()
      // let c = d.toISOString()
      // let b= c.replace(/\d{2}:\d{2}:\d{2}\.\d{3}/g, "00:00:00.000")
      const n = d.getTime()
      return n
    },

    /**
     * 处理当前日期与指定日期之间的关系
     * @param date
     */
    getWeekDayMappingOfCurrent: function() {
      const current = this.getStartTimestampOfDay()
      if (current) {
        return {
          [current - 2 * 86400000]: this.i18n.beforeYesterday,
          [current - 1 * 86400000]: this.i18n.yesterday,
          [current]: this.i18n.today,
          [current + 1 * 86400000]: this.i18n.tomorrow,
          [current + 2 * 86400000]: this.i18n.afterTomorrow
        }
      }
      return {}
    },

    // 获取地址列表
    getAreaListInfo() {
      http.request({
        url: '/p/area/getAreaListInfo',
        method: 'GET',
        data: {},
        callBack: (res) => {
          this.setData({
            provArray: res,
            addrInfoList: res
          })
        }
      })
    },

    // 获取当前id下的地址信息
    listAreaByParentId(pid) {
      let paramData = {}
      if (!pid) {
        paramData = { level: 1 }
      } else {
        paramData = { pid }
      }
      return new Promise((resolve, reject) => {
        const params = {
          url: '/p/area/listByPid',
          method: 'GET',
          data: paramData,
          callBack: (res) => {
            resolve(res)
          }
        }
        http.request(params)
      })
    },
    // 获取当前节点下的地址
    getCurrentAreas(curList, curId) {
      for (const item of curList) {
        if (item.areaId === curId) {
          return {
            curNode: item,
            areas: item.areas
          }
        }
      }
    },

    /**
     * 获取全部省份
     */
    initCityData: async function(provinceId, cityId, areaId) {
      // 获取省列表
      if (!this.provArray.length) {
        const provArray = await this.listAreaByParentId()
        this.setData({
          provArray
        })
      }

      if (provinceId) {
        for (let i = 0; i < this.provArray.length; i++) {
          if (this.provArray[i].areaId === provinceId) {
            this.setData({
              value: [i, this.value[1], this.value[2]]
            })
          }
        }
      }
      this.getCityArray(provinceId || this.provArray[0].areaId, cityId, areaId)
    },

    /**
     * 根据省份ID获取 城市数据
     */
    getCityArray: async function(provinceId, cityId, areaId) {
      const { curNode, areas } = this.getCurrentAreas(this.provArray, provinceId)
      let cityArray = areas
      if (!areas) {
        console.log('请求市列表')
        cityArray = await this.listAreaByParentId(provinceId)
      }
      curNode.areas = cityArray
      this.setData({
        cityArray
      })

      if (cityId) {
        for (let i = 0; i < cityArray.length; i++) {
          if (cityArray[i].areaId === cityId) {
            this.setData({
              value: [this.value[0], i, this.value[2]]
            })
          }
        }
      }

      this.getAreaArray(cityId || cityArray[0].areaId, areaId)
    },

    /**
     * 根据城市ID获取 区数据
     */
    getAreaArray: async function(cityId, areaId) {
      const { curNode, areas } = this.getCurrentAreas(this.cityArray, cityId)
      let areaArray = areas
      if (!areas) {
        console.log('请求区列表')
        areaArray = await this.listAreaByParentId(cityId)
        if (areaArray.length === 0) {
          this.cityArray.forEach((item, index) => {
            if (item.areaId === cityId) {
              this.cityArray.splice(index, 1)
              this.getAreaArray(this.cityArray[index].areaId, areaId)
            }
          })
        }
      }
      curNode.areas = areaArray
      this.setData({
        areaArray
      })

      if (areaId) {
        for (let i = 0; i < areaArray.length; i++) {
          if (areaArray[i].areaId === areaId) {
            this.setData({
              value: [this.value[0], this.value[1], i]
            })
          }
        }

        this.setData({
          province: this.province,
          city: this.city,
          area: this.area,
          provinceId: this.provinceId,
          cityId: this.cityId,
          areaId: this.areaId
        })
      } else {
        this.setData({
          province: this.provArray[this.value[0]].areaName,
          city: this.cityArray[this.value[1]].areaName,
          area: this.areaArray[this.value[2]].areaName,
          provinceId: this.provArray[this.value[0]].areaId,
          cityId: this.cityArray[this.value[1]].areaId,
          areaId: this.areaArray[this.value[2]].areaId
        })
      }
    },

    bindRegionChange: function(e) {
      // console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        region: e.detail.value
      })
    },

    onReceiverInput: function(e) {
      this.setData({
        receiver: e.detail.value
      })
    },
    onMobileInput: function(e) {
      this.setData({
        mobile: e.detail.value
      })
    },
    onAddrInput: function(e) {
      this.setData({
        addr: e.detail.value
      })
    },

    /**
     * 保存地址
     */
    onSaveAddr: function() {
      var receiver = this.receiver
      var mobile = this.mobile
      var addr = this.addr
      var reg = /^\s+$/g
      const that = this
      if (this.addressList.length == 10) {
        uni.showToast({
          title: this.i18n.newAddressesLimit,
          icon: 'none',
          duration: 1500
        })
        return
      }
      if (!receiver) {
        uni.showToast({
          title: this.i18n.consigneeTips,
          icon: 'none'
        })
        return
      }
      if (!mobile) {
        uni.showToast({
          title: this.i18n.enterMobileNumber,
          icon: 'none'
        })
        return
      }
      if (!util.checkPhoneNumber(mobile)) {
        uni.showToast({
          title: this.i18n.enterCorrectPhone,
          icon: 'none'
        })
        return
      }
      if (!this.province || !this.city || !this.area) {
        uni.showToast({
          title: this.i18n.selectProvinceCity,
          icon: 'none'
        })
        return
      }
      if (reg.test(addr)) {
        uni.showToast({
          title: this.i18n.inputAllSpace,
          icon: 'none'
        })
        return
      }
      if (!addr || addr.length < 5) {
        uni.showToast({
          title: this.i18n.selectDetailedAddress,
          icon: 'none'
        })
        return
      }
      if (this.dvyType == 4) {
        // 同城配送
        if (!this.lat || !this.lng || this.lat == '' || this.lng == '') {
          uni.showModal({
            title: this.i18n.tips,
            content: this.i18n.selectCoordinates,
            showCancel: false,
            success: (res) => {
              uni.navigateTo({
                url:
                  '/package-user/pages/edit-address/edit-address?addrId=' +
                  this.userAddr.addrId
              })
            }
          })
        }
      }
      var url = '/p/address/addAddr'
      var method = 'POST'
      // 添加或修改地址
      const params = {
        url: url,
        method: method,
        data: {
          receiver: this.receiver,
          mobile: this.mobile,
          addr: this.addr,
          province: this.province,
          provinceId: this.provinceId,
          city: this.city,
          cityId: this.cityId,
          areaId: this.areaId,
          area: this.area,
          userType: 0,
          // addrId: this.addrId,
          lat: this.lat, // 纬度
          lng: this.lng // 经度
        },
        callBack: (res) => {
          this.loadAddressList().then(res => {
            that.addressList = res
            uni.showToast({
              title: that.i18n.savedSuccessfully,
              icon: 'none',
              duration: 1000
            })
            that.addr = ''
            that.receiver = ''
            that.mobile = ''
            that.province = ''
            that.city = ''
            that.area = ''
            that.isEditAddr = false
            if (that.addressList.length > 1) {
              setTimeout(() => {
                that.addrId = that.addressList[1].addrId
              }, 100)
            } else {
              setTimeout(() => {
                that.addrId = that.addressList[0].addrId
              }, 100)
            }

            that.setData({
              province: that.provArray[that.value[0]].areaName,
              city: that.cityArray[that.value[1]].areaName,
              area: that.areaArray[that.value[2]].areaName,
              provinceId: that.provArray[that.value[0]].areaId,
              cityId: that.cityArray[that.value[1]].areaId,
              areaId: that.areaArray[that.value[2]].areaId,
              boolenRes: 1
            })
            // that.showAddressListPop = true
            setTimeout(() => {
              that.getAddrDet()
            }, 200)
          })
        }
      }
      http.request(params)
    },

    // 滑动事件
    bindChange: function(e) {
      const val = e.detail.value // 判断滑动的是第几个column
      // 若省份column做了滑动则定位到地级市和区县第一位
      if (this.value[0] != val[0]) {
        val[1] = 0
        val[2] = 0 // 更新数据
        this.getCityArray(this.provArray[val[0]].areaId) // 获取地级市数据
      } else {
        // 若省份column未做滑动，地级市做了滑动则定位区县第一位
        if (this.value[1] != val[1]) {
          val[2] = 0 // 更新数据
          this.getAreaArray(this.cityArray[val[1]].areaId) // 获取区县数据
        }
      }

      this.setData({
        value: [val[0], val[1], val[2]]
      })
      if (this.province) {
        this.setData({
          province: this.provArray[this.value[0]].areaName,
          city: this.cityArray[this.value[1]].areaName,
          area: this.areaArray[this.value[2]].areaName,
          provinceId: this.provArray[this.value[0]].areaId,
          cityId: this.cityArray[this.value[1]].areaId,
          areaId: this.areaArray[this.value[2]].areaId
        })
      }
    },

    // 移动按钮点击事件
    translate: function(e) {
      if (t == 0) {
        moveY = 0
        show = false
        t = 1
      } else {
        moveY = 200
        show = true
        t = 0
      }

      this.setData({
        show: true
      }) // this.animation.translate(arr[0], arr[1]).step();
      this.initCityData(this.provinceId, this.cityId, this.areaId)
      this.animationEvents(this, moveY, show)
    },

    // 隐藏弹窗浮层
    hiddenFloatView(e) {
      moveY = 200
      show = true
      t = 0
      this.animationEvents(this, moveY, show)
      this.setData({
        saveEditFlag: true
      })

      this.setData({
        province: this.provArray[this.value[0]].areaName,
        city: this.cityArray[this.value[1]].areaName,
        area: this.areaArray[this.value[2]].areaName,
        provinceId: this.provArray[this.value[0]].areaId,
        cityId: this.cityArray[this.value[1]].areaId,
        areaId: this.areaArray[this.value[2]].areaId
      })
    },

    // 点击屏幕外事件
    hiddenFloatViewScreenClick(e) {
      moveY = 200
      show = true
      t = 0
      this.animationEvents(this, moveY, show)
    },

    // 动画事件
    animationEvents: function(that, moveY, show) {
      // console.log("moveY:" + moveY + "\nshow:" + show);
      that.animation = wx.createAnimation({
        transformOrigin: '50% 50%',
        duration: 400,
        timingFunction: 'ease',
        delay: 0
      })
      that.animation.translateY(moveY + 'vh').step()
      that.setData({
        animation: that.animation.export()
      })
    },

    // 空方法
    nono() {},

    /**
     * 满减信息处理
     */
    parseDiscountMsg(discountRule, needAmount, discount, lang) {
      if (discountRule == 0) {
        return lang == 'zh_CN'
          ? '购满' + needAmount + '元减' + discount + '元'
          : 'Over ' + needAmount + ' minus ' + discount
      } else if (discountRule == 1) {
        return lang == 'zh_CN'
          ? '购满' + needAmount + '件减' + discount + '元'
          : discount + ' less for ' + needAmount + ' pieces'
      } else if (discountRule == 2) {
        return lang == 'zh_CN'
          ? '购满' + needAmount + '元打' + discount + '折'
          : discount + '% off over ' + needAmount
      } else if (discountRule == 3) {
        return lang == 'zh_CN'
          ? '购满' + needAmount + '件打' + discount + '折'
          : discount + '% off over ' + needAmount + ' pieces'
      } else {
        return ''
      }
    },
    /**
     * 图片加载失败时显示默认图片
     */
    handlePicError(prod) {
      this.$set(prod, 'isPicError', true)
    },
    // 格式化时间
    tsToDate(data) {
      return util.tsToDate(data.replace(/\-/g, '/'), 'Y-M-D')
    },
    moveHandle() {

    },
        /**
     * 获取用户信息
     */
     queryUserInfo: function () {
      const params = {
        url: '/p/user/userInfo',
        method: 'GET',
        data: {},
        callBack: (res) => {
          this.setData({
            distributionUserId: res.distributionUserId
          })
          if(res.distributionUserId){
            this.isDistribution=false
          }
        }
      }
      http.request(params)
    },
  }
}
</script>
<style>
@import './submit-order.css';
</style>
