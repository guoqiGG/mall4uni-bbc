<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <!-- 商品详情 -->
  <view :class="['Mall4j contenta', popupShowHiden ? 'page-hidden' : '']">
    <view v-show="!commentShow" :class="['container', skuShow || commentShow ? 'overflow' : '']">
      <!-- 轮播图 & 商品视频-->
      <prod-imgs-video ref="media" :imgs="prodInfo.imgs" :video="prodInfo.video" @videoSts="videoSts" />
      <!-- 轮播图 & 商品视频end -->
      <!-- 倒计时栏、预售 -->
      <countdown-bar v-if="((activityInfo.activityStatus && prodType === 1 || prodType === 2) || preSellStatus) && prodInfo"
        :preSellTime="preSellTime" :prodType="prodType" :prodId="prodId" :activityInfo="activityInfo" />
      <!-- 倒计时栏 -->

      <!-- 商品信息 -->
      <view class="prod-info">
        <view class="tit-wrap">
          <view class="prod-tit">{{ prodName }}</view>
          <!-- <view v-if="prodType != 3" class="col" @tap="addOrCannelCollection">
            <image v-if="!isCollection" src="/static/images/icon/prod-col.png" />
            <image v-if="isCollection" src="/static/images/icon/prod-col-red.png" />{{ i18n.collection }}
          </view> -->
        </view>
        <view class="sales-p">{{ brief }}</view>
        <!-- 秒杀商品价格 -->
        <view v-if="prodType == 2 && defaultSku.seckillPrice" class="prod-price">
          <text class="price">￥
            <text class="price-num">{{ parsePrice(defaultSku.seckillPrice)[0] }}</text>
            .{{ parsePrice(defaultSku.seckillPrice)[1] }}
          </text>
          <text v-if="defaultSku.price > defaultSku.seckillPrice" class="original-price">￥{{
            parsePrice(defaultSku.price)[0] }}.{{ parsePrice(defaultSku.price)[1] }}</text>
        </view>
        <!-- 拼团商品价格 -->
        <view v-else-if="prodType == 1 && defaultActivitySku.actPrice" class="goods-price">
          <view class="current-price">
            <text class="current-price">
              <text class="sub">￥{{ defaultActivitySku.actPrice }}</text>
            </text>
            <text class="condition">{{ activityInfo.groupNumber }}{{ i18n.groupPrice }}</text>
          </view>
          <view v-if="defaultActivitySku.price > defaultActivitySku.actPrice" class="original">
            {{ i18n.originalPrice }}
            <text class="original-price">￥{{ parsePrice(defaultActivitySku.price)[0] }}.{{
              parsePrice(defaultActivitySku.price)[1] }}</text>
          </view>
        </view>
        <!-- 普通商品价格 -->
        <view v-else class="prod-price">
          <text v-if="defaultSku.price" class="price">￥
            <text class="price-num">{{ parsePrice(defaultSku.price)[0] }}</text>.{{ parsePrice(defaultSku.price)[1] }}
          </text>
          <text v-if="prodType == 3 && defaultSku.price" class="plus">+</text>
          <text v-if="prodType == 3" class="price">
            <text class="price-num">{{ parsePrice(defaultSku.skuScore)[0] }}</text> {{ i18n.integral }}
          </text>
          <text v-if="preSellStatus == 1" class="condition">{{ i18n.preSale }}</text>
        </view>
      </view>
      <!-- 商品信息end -->
      <!-- 拼团/秒杀 + 预售商品 -->
      <view v-if="preSellStatus == 1" class="sendway">
        <view class="coupon-tit">{{ i18n.preSale }}</view>
        <view class="sendway-item pre-sale-red">
          <text decode="true">{{ i18n.expect }} &nbsp; {{ preSellTime }} &nbsp;{{ i18n.startDelivery }}</text>
        </view>
      </view>
      <!-- 预购信息end -->
      <!-- 配送方式 -->
      <view v-if="deliveryModeVO && mold !== 1 && prodType != 5" class="sendway">
        <view class="coupon-tit">{{ i18n.delivery }}</view>
        <view class="coupon-con">
          <view v-if="deliveryModeVO.hasShopDelivery&&!distributionUserId" class="sendway-item">
            <image src="/static/images/icon/allow.png" />{{ i18n.expressDelivery }}
          </view>
          <view v-if="deliveryModeVO.hasCityDelivery&&!distributionUserId" class="sendway-item">
            <image src="/static/images/icon/allow.png" />{{ i18n.sameDelivery }}
          </view>
          <view v-if="deliveryModeVO.hasUserPickUp" class="sendway-item">
            <image src="/static/images/icon/allow.png" />{{ i18n.pickStore }}
          </view>
        </view>
      </view>
      <!-- 虚拟商品（无需快递） -->
      <view v-if="mold === 1 && prodType != 5" class="sendway">
        <view class="coupon-tit">{{ i18n.delivery }}</view>
        <view class="coupon-con">
          <view class="sendway-item">
            <image src="/static/images/icon/allow.png" />{{ i18n.noNeedDelivery }}
          </view>
        </view>
      </view>
      <!-- 配送方式end -->

      <!-- 满减折 || 赠品 -->
      <view
        v-if="(prodDiscountList.length && preSellStatus != 1 && (!activityInfo || Object.keys(activityInfo).length === 0)) || giveawayList.length || (prodType == 2 && activityInfo.activityStatus == 1 && (prodDiscountList.length || giveawayList.length))"
        class="discount" @tap="clickDiscount">
        <view class="coupon-tit">{{ i18n.promotion }}</view>
        <!-- 满减折 -->
        <view
          v-if="prodDiscountList.length && preSellStatus != 1 && (!activityInfo || Object.keys(activityInfo).length === 0) || (prodType == 2 && activityInfo.activityStatus == 1)"
          class="coupon-con discount-con">
          <block v-for="(item, index) in prodDiscountList" :key="index">
            <block v-if="index < 1">
              <view class="discount-item">
                <view class="discount-tag">{{
                  [
                    i18n.amount,
                    i18n.pieces,
                    i18n.amountDiscount,
                    i18n.piecesDiscount,
                  ][item.discountRule]
                }}</view>
                <text class="discount-content">
                  <text v-if="item.discountType">{{ i18n.every }}</text>
                  {{ item.discountName }}，{{ i18n.maximumDiscount }}{{ item.maxReduceAmount }}{{ i18n.yuan }}
                </text>
              </view>
            </block>
          </block>
        </view>
        <!-- 赠品 -->
        <view v-if="giveawayList.length && !prodDiscountList.length" class="coupon-con discount-con">
          <block v-for="(item, index) in giveawayList" :key="index">
            <block v-if="index < 1">
              <view class="discount-item">
                <view class="discount-tag">{{ i18n.Giveaways }}</view>
                <text class="discount-content">
                  {{ item.prodName }}
                  <text v-if="item.skuName" decode>{{ "&nbsp;&nbsp;" + item.skuName }}</text>
                </text>
              </view>
            </block>
          </block>
        </view>
        <view class="more">...</view>
      </view>
      <!-- 满减折end -->

      <!-- 领券 -->
      <view
        v-if="couponList.length && prodType != 5 && prodType != 2 && prodType != 3 || (prodType == 2 && activityInfo.activityStatus == 1 && couponList.length)"
        class="coupon" @tap="showPopup">
        <view class="coupon-tit">{{ i18n.coupons }}</view>
        <view :class="['coupon-con', curLang == 'en' ? 'coupon-con-en' : '']">
          <block v-for="(item, index) in couponList" :key="index">
            <text v-if="index < 2" class="item">
              <block v-if="item.couponType == 1">
                {{ parseDiscountProd(item.couponType, item.cashCondition, item.reduceAmount) }}
              </block>
              <block v-if="item.couponType == 2">
                {{ parseDiscountProd(item.couponType, item.cashCondition, item.couponDiscount) }}
              </block>
            </text>
          </block>
        </view>
        <view class="num">{{ i18n.inTotal }}{{ couponList.length }}{{ i18n.piecesZ }}</view>
        <view class="more">...</view>
      </view>
      <!-- 领券end -->

      <!-- 拼团信息 -->
      <view v-if="joinGroupList.length" class="spell-infor">
        <view class="spell-infor-title">{{ i18n.joinAGroup }}</view>
        <view v-for="(item, groupTeamId) in joinGroupList" :key="groupTeamId" class="spell-infor-content">
          <!-- 头像 -->
          <view class="head-img">
            <image :src="item.sharePic ? item.sharePic : '/static/images/icon/head01.png'"
              @error="imageError(item, 'sharePic')" />
          </view>
          <!-- 信息 -->
          <view class="spell-msg">
            <view class="username">{{ item.shareNickName }}</view>
            <view class="spell-text">{{ i18n.lack }}
              <text class="red-font">{{ item.groupNumber - item.joinNum }}</text>
              {{ i18n.lack1 }} {{ item.endOfGroupTime.hou }}{{ i18n.time }}{{ item.endOfGroupTime.min }}{{ i18n.minute
              }}{{ item.endOfGroupTime.sec }}{{ i18n.second }}
            </view>
          </view>
          <!-- 凑团按钮 -->
          <view class="join-group" :data-groupteamid="item.groupTeamId" @tap="toSpellGroupDetail">{{ i18n.toGatherGroup }}
          </view>
        </view>
        <!-- 详情 -->
        <view class="rules clearfix">
          <text class="rules-text01">{{ i18n.groupInvitation }}{{ activityInfo.groupNumber }}{{ i18n.groupInvitationTips
          }}</text>
        </view>
      </view>

      <!-- 拼团信息end -->

      <!-- 已选规格 -->
      <!-- sku弹窗组件 -->
      <prod-sku-select v-if="skuLoad" :mold="mold" :pic="pic" :sku-list="skuList" :sku-id="skuId"
        :default-price="defaultPrice" :virtual-info="virtualInfo" :sku-show-type="skuShowType" :prod-type="prodType"
        :pre-sell-status="preSellStatus" :prod-num="prodNum" :activity-info="activityInfo"
        :page-type="prodType === 2 ? 2 : 1" :sku-show="skuShow" @setSku="setSku" @showSku="showSku"
        @closeSkuPop="closeSkuPop" @setVirtualInputInfo="setVirtualInputInfo" @addToCart="addToCart" @buyNow="buyNow"
        @setProdNum="setProdNum" />
      <!-- 已选规格end -->

      <!-- 优惠套装列表 -->
      <view v-if="comboList.length" class="discount-package">
        <view class="discount-package-title">{{ i18n.discountPackage }}
          <text class="discount-package-title-fu">（{{ i18n.inTotal }}{{ comboList.length }}{{ i18n.itemGe }}）</text>
        </view>
        <view class="discount-package-concent">
          <scroll-view scroll-x>
            <view class="discount-package-scroll">
              <view v-for="(item, index) in comboList" :key="index" class="discount-package-item"
                @tap="toDiscountPackageDetail(item.comboId)">
                <view v-if="item.mainProd" class="main-image">
                  <ImgShow imgMode="aspectFit" :src="item.mainProd.pic" :classList="['main-image']" />
                </view>
                <view v-if="item.matchingProds.length" class="addFu"> + </view>
                <view v-if="item.matchingProds.length" class="fu-prod">
                  <ImgShow imgMode="aspectFit" :src="item.matchingProds[0].pic" :classList="['main-image']" />
                </view>
                <view class="discountPackageProd-detail">
                  <text>{{ i18n.packages }}<text class="yuan-number">{{ index + 1 }}</text>,{{ i18n.inTotal }}{{
                    item.prodCount }}{{ i18n.piece }}</text>
                  <text class="price">￥{{ item.comboAmount }}</text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
      <!-- 优惠套装列表end -->

      <!-- 评价 -->
      <view v-if="prodCommData && prodType != 3" class="cmt-wrap box-radius">
        <view class="cmt-tit" @tap="showComment(-1)">
          <view class="cmt-t">
            {{ i18n.evaluation }}
            <text class="cmt-good" decode="true">{{ i18n.praise }}&nbsp;{{ prodCommData.positiveRating }}%</text>
          </view>
          <view class="cmt-count">
            {{ i18n.inTotal }} {{ prodCommData.number }} {{ i18n.itemTiao }}
            <text class="cmt-more" />
          </view>
        </view>
        <view class="cmt-cont">
          <view class="cmt-tag">
            <text @tap="showComment(-1)">{{ i18n.all + " " }}({{ prodCommData.number }})</text>
            <text @tap="showComment(0)">{{ i18n.praise + " " }}({{ prodCommData.praiseNumber }})</text>
            <text @tap="showComment(1)">{{ i18n.mediumEvaluation + " " }}({{ prodCommData.secondaryNumber }})</text>
            <text @tap="showComment(2)">{{ i18n.badEvaluation + " " }}({{ prodCommData.negativeNumber }})</text>
            <text @tap="showComment(3)">{{ i18n.havePictures + " " }}({{ prodCommData.picNumber }})</text>
          </view>
          <view class="cmt-items">
            <view v-for="(item, prodCommId) in littleCommPage" :key="prodCommId" class="cmt-item">
              <view class="cmt-user">
                <text class="date">{{ item.recTime }}</text>
                <view class="cmt-user-info">
                  <image class="user-img" :src="item.pic ? item.pic : '/static/images/icon/head04.png'"
                    @error="imageError(item, 'pic')" />
                  <view class="nickname">
                    <view class="name-star">
                      <view class="name">
                        {{ item.isWriteOff ? i18n.userOff : (item.isAnonymous == 1 ? i18n.anonymousEvaluation :
                          item.nickName) }}
                      </view>
                      <view>
                        <comm-star :value="item.score" />
                      </view>
                    </view>
                    <view style="color: #999">{{ item.skuName || "" }}</view>
                  </view>
                </view>
              </view>
              <view class="cmt-cnt">
                <text decode="true">{{ item.content }}</text>
              </view>
              <scroll-view v-if="item.pics && item.pics.length" class="cmt-attr" scroll-x="true">
                <image v-for="(commPic, index) in item.pics" :key="index" :src="commPic" :data-pics="item.pics"
                  :data-src="commPic" @tap="clickImg(commPic, item.pics)" />
              </scroll-view>
            </view>
          </view>
          <view v-if="prodCommPage.records.length > 2" class="cmt-more-v">
            <text @tap="showComment(-1)">{{ i18n.viewAllEvaluation }}</text>
          </view>
        </view>
      </view>
      <!-- 评价 end -->

      <!-- 店铺 -->
      <view v-if="shopInfo" class="shop-box box-radius" @tap="toShopPage">
        <!-- top -->
        <view class="shopbox-head">
          <view class="sl">
            <view class="shop-logo">
              <ImgShow :src="shopInfo.shopLogo" />
            </view>
            <view class="shop-con">
              <view class="shop-name">{{ shopInfo.shopName }}</view>
              <view class="shop-fol">
                <view v-if="shopId == 1" class="self-operate">{{ i18n.selfShop }}</view>
                <view class="fol-num">
                  {{ shopInfo.fansCount < 10000 ? shopInfo.fansCount + i18n.haveSpacePeople : shopInfo.fansCount / 10000 +
                    i18n.tenThousandPeople }}{{ i18n.follow }} </view>
                </view>
              </view>
            </view>
            <view class="sr">
              <view class="enter-shop">{{ i18n.enterShop }}</view>
            </view>
          </view>
        </view>
        <!-- 店铺end -->

        <!-- 商品详情 -->
        <view class="prod-detail">
          <view>
            <view v-for="item in prodParameterList" :key="item.prodParameterId" class="parameter-box">
              <view class="parameter-key">
                {{ item.parameterKey }}
              </view>
              <view class="parameter-vaule">
                {{ item.parameterValue }}
              </view>
            </view>
          </view>
          <view>
            <rich-text :nodes="content" />
          </view>
        </view>
        <!-- 商品详情end -->

        <!-- 底部按钮 -->
        <view class="cart-footer">
          <view class="btn icon" @tap="toHomePage">
            <image src="/static/images/tabbar/homepage.png" />{{ i18n.homepage }}
          </view>
          <!-- <view class="btn icon" @tap="handleCustomService">
            <image src="/static/images/icon/shop-customer-service.png" />
            {{ i18n.service }}
          </view> -->
          <view class="btn icon" @tap="toCartPage" v-if="prodType!=3">
            <image src="/static/images/tabbar/basket.png" />
            {{ i18n.shoppingCart }}
            <view v-if="totalCartNum > 0" class="badge">
              {{ totalCartNum > 99 ? "99+" : totalCartNum }}
            </view>
          </view>
          <!-- 普通商品按钮: 普通商品   或未启动或未开始的团购-->
          <block
            v-if="hadOnloaded && prodType === 0 || (prodType === 1 && (!activityInfo.activityStatus || activityInfo.activityStatus == 1) || (prodType === 2 && !prodInfo.seckillVO))">
            <block v-if="preSellStatus != 1">
              <view v-if="mold !== 1" class="btn cart cart-radius" @tap="addToCart">
                <text>{{ i18n.addShoppingCart }}</text>
              </view>
              <view class="btn buy cart-radius" @tap="buyNow(0)">
                <text>{{ i18n.buyNow }}</text>
              </view>
            </block>
            <view v-if="preSellStatus == 1" class="btn pre-sale-buy cart-radius" @tap="buyNow(0)">{{ i18n.buyNow }}
            </view>
          </block>
          <!-- 秒杀  或正在进行的团购 -->
          <block
            v-if="hadOnloaded && (prodType == 2 && activityInfo.activityStatus) || (prodType == 1 && activityInfo.activityStatus == 2)">
            <view v-if="activityInfo.activityStatus === 1 || prodType === 1" class="btn alone-buy cart-radius"
              @tap="showSku(1)">
              <text>{{ activityInfo.activityStatus === 1 && prodType == 2 ?
                i18n.retailPricePurchase : i18n.individualShopping }}</text>
            </view>
            <view v-if="activityInfo.activityStatus === 2"
              :class="['btn group-buy cart-radius', activityInfo.activityStatus === 1 ? 'gray-btn' : '',]"
              @tap="showGroupSku">
              <text>{{ prodType === 1 ? i18n.startAGroup : i18n.immediatelyBuy }}</text>
            </view>
          </block>
          <!-- 青春豆的按钮 -->
          <block v-if="hadOnloaded && prodType == 3">
            <view  class="btn pre-sale-buy cart-radius" style="margin-left: 250rpx;font-size: 40rpx;font-weight: 800;" @tap="showGroupSku">
              <text>{{ i18n.redeemNow }}</text>
            </view>
          </block>

          <!-- 活动商品不可购买 -->
          <block v-if="hadOnloaded && prodType == 5">
            <view class="btn buy cart-radius gray-btn" :class="{ 'en-btn': isEn }">
              <text>{{ i18n.notAvailableForPurchase }}</text>
            </view>
          </block>
        </view>
        <!-- 底部按钮 end -->

        <!-- 满减折弹窗 -->
        <view v-if="showDiscountPopup" class="popup-hide" @tap="showDiscountPopup = false; popupShowHiden = false;">
          <view class="popup-box radius" @tap.stop>
            <view class="popup-tit radius">
              <text>{{ i18n.promotion }}</text>
              <text class="close" @tap="clickDiscount" />
            </view>
            <view class="popup-cnt popup-discount">
              <view class="coupon-con discount-con">
                <block v-for="(item, index) in prodDiscountList" :key="index">
                  <view class="discount-item">
                    <view class="discount-tag">{{
                      [
                        i18n.amount,
                        i18n.pieces,
                        i18n.amountDiscount,
                        i18n.piecesDiscount,
                      ][item.discountRule]
                    }}</view>
                    <view class="giveaways-name" @tap="toDiscountList(item.discountId)">
                      <view class="discount-content">
                        <text v-if="item.discountType">{{ i18n.every }}</text>
                        <text>{{ item.discountName }}，{{ i18n.maximumDiscount }}{{ item.maxReduceAmount }}{{ i18n.yuan
                        }}</text>
                      </view>
                      <view class="giveaways-item-right" />
                    </view>
                  </view>
                </block>

                <!-- 赠品列表 -->
                <view v-if="giveawayList.length" class="giveaway-list">
                  <view class="discount-tag">{{ i18n.Giveaways }}</view>
                  <view class="giveaway-prod">
                    <block v-for="(item, index) in giveawayList" :key="index">
                      <view class="giveaways-item">
                        <view class="giveaways-content">
                          <view class="giveaways-name" @tap="toGiveawaysProd(item.prodId)">
                            <view class="discount-content">
                              {{ item.prodName }}
                              <text v-if="item.skuName" decode>{{ "&nbsp;&nbsp;" + item.skuName }}</text>
                              <text decode>{{ "&nbsp;&nbsp;x" + item.giveawayNum }}</text>
                            </view>
                            <view class="giveaways-item-right" />
                          </view>
                        </view>
                      </view>
                    </block>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 满减折弹窗 end -->

        <!-- 优惠券 -->
        <view v-if="popupShow" class="popup-hide" @tap=" popupShow = false; popupShowHiden = false;">
          <view class="popup-box radius" @tap.stop>
            <view class="popup-tit radius">
              <text>{{ i18n.coupon }}</text>
              <text class="close" @tap="closePopup" />
            </view>
            <view class="popup-cnt">
              <block v-for="(item, couponId) in couponList" :key="couponId">
                <coupon :show-time-type="1" :can-use="item.canUse" :coupon-item="item" />
              </block>
            </view>
          </view>
        </view>
        <!-- 优惠券 end -->

        <!-- 分享弹窗 -->
        <view v-if="shareShow" class="promo-share">
          <view style="position:relative;display:block">
            <canvas :style="{
              width: canvasW + 'px',
              height: canvasH + 'px',
              'margin-top': marginTopCanvas + 'px',
              position: 'fixed',
              top: '1000000px'
            }" canvas-id="myCanvas" />
          </view>
          <image v-if="showCanvasImg" :src="shareImgUrl"
            :style="{ width: canvasW + 'px', height: canvasH + 'px', 'margin-top': marginTopCanvas + 'px' }"
            class="share-img" />
          <view v-if="showShareBtn" class="promo-main">
            <!-- #ifndef H5  -->
            <view class="promo-tit">
              <title>{{ i18n.shareImgTo }}</title>
            </view>
            <!-- #endif -->
            <!-- #ifdef H5  -->
            <view v-if="isWechat" class="promo-tit">
              <title>{{ i18n.shareImgTo }}</title>
            </view>
            <!-- #endif -->

            <view class="promo-icons">
              <!-- #ifdef H5  -->
              <view v-if="isWechat" class="promo-img1" @tap="onShareWay">
                <view class="promo-img1-icon">
                  <image src="/static/images/icon/wetchat.png" mode="aspectFit" />
                </view>{{ i18n.shareIt }}
              </view>
              <view v-if="!isWechat" class="promo-tit1">
                {{ i18n.saveImgH5 }}
              </view>
              <!-- #endif -->
              <!-- #ifndef H5  -->
              <view class="promo-img1" @tap="saveImg">
                <view class="promo-img1-icon">
                  <image src="/static/images/icon/export.png" mode="aspectFit" />
                </view>{{ i18n.saveImg }}
              </view>
              <!-- #endif -->
            </view>
            <view class="promo-btn" @tap="toDistCenterPage">{{ i18n.myDistributorCenter }}</view>
            <view class="promo-close" @tap="closeEarn">
              {{ i18n.cancel }}
            </view>
          </view>
        </view>
        <!-- 分享弹窗 end -->

        <!-- 二维码弹窗 -->
        <view v-if="wxCodeShow" class="code-popup" @tap=" wxCodeShow = false; popupShowHiden = false;">
          <view class="code-main" @tap.stop>
            <view class="close-v" @tap.stop="closeCodePopup">
              <image src="/static/images/icon/close.png" class="close-png" />
            </view>
            <view class="code-v">
              <image :src="shareWxCode" class="wx-code" />
            </view>
            <!-- #ifndef H5 -->
            <view class="code-txt" @tap="downloadImg">{{ i18n.saveAlbum }}</view>
            <!-- #endif -->
          </view>
        </view>
        <!-- 二维码弹窗 end -->

        <!-- 引导分享蒙版 -->
        <view v-if="guideShare" class="guide-share-mask">
          <view class="mask" />
          <view class="guide-share-close" @tap="guideShare = false">
            <image src="/static/images/icon/close.png" mode="" />
          </view>
          <view class="guide-content">
            <view class="share-img">
              <image src="/static/images/icon/shareIcon.png" />
            </view>
            <view class="share-word">
              <view class="big-word">{{ i18n.shareFriendsNow }}</view>
              <view class="small-word">{{ i18n.shareFriendsTips2 }}</view>
            </view>
          </view>
        </view>
        <!-- 引导分享蒙版 end -->

        <!-- 直播悬浮按钮 -->
        <!-- #ifdef MP-WEIXIN -->
        <view v-if="liveRoomParams && liveRoomParams.length && liveRoomParams[0].liveStatus === 101" class="live"
          :data-roomid="liveRoomParams[0].roomId" :data-url="liveRoomParams[0].url" @tap="toLivePage">
          <rhythm-beat />
          <view class="live-txt">{{ i18n.inLive }}</view>
        </view>
        <!-- #endif -->

        <!-- 回到顶部 && 普通分享 -->
        <view class="promo-con">
          <!-- #ifdef MP-WEIXIN -->
          <!-- <button v-if="!(isDist && isDistProd)" class="suspension-btn btn-type" open-type="share">
            <image src="/static/images/icon/share-prod.png" />
          </button> -->
          <!-- #endif -->

          <!-- 赚字浮层 -->
          <view v-if="isDist && isDistProd" class="earn" @tap="onShowShare">{{ i18n.earn }}</view>
          <!-- 赚字浮层 end -->
          <view v-if="showBacktop" class="suspension-btn" @tap="handleScorllTop">
            <image src="/static/images/icon/back-to-top.png" />
          </view>
        </view>
        <!-- 回到顶部 && 分享 end-->
      </view>

      <!-- 评价弹窗 -->
      <view v-if="commentShow" :class="prodCommData.number ? 'cmt-popup' : 'cmt-no-popup'">
        <view class="cmt-tit">
          <view class="cmt-t">{{ i18n.productEvaluation }}
            <text class="cmt-good">{{ i18n.rating }}{{ prodCommData.positiveRating }}%</text>
          </view>
          <text class="close" @tap="closePopup" />
        </view>
        <view class="cmt-cont">
          <view class="cmt-tag">
            <text :class="evaluate == -1 ? 'selected' : ''" @tap="getProdCommPage(-1)">{{ i18n.all + " " }}({{
              prodCommData.number }})</text>
            <text :class="evaluate == 0 ? 'selected' : ''" @tap="getProdCommPage(0)">{{ i18n.praise + " " }}({{
              prodCommData.praiseNumber }})</text>
            <text :class="evaluate == 1 ? 'selected' : ''" @tap="getProdCommPage(1)">{{ i18n.mediumEvaluation + " " }}({{
              prodCommData.secondaryNumber }})</text>
            <text :class="evaluate == 2 ? 'selected' : ''" @tap="getProdCommPage(2)">{{ i18n.badEvaluation + " " }}({{
              prodCommData.negativeNumber }})</text>
            <text :class="evaluate == 3 ? 'selected' : ''" @tap="getProdCommPage(3)">{{ i18n.havePictures + " " }}({{
              prodCommData.picNumber }})</text>
          </view>
          <view class="cmt-items">
            <view v-for="(item, prodCommId) in prodCommPage.records" :key="prodCommId" class="cmt-item">
              <view class="cmt-user">
                <text class="date">{{ item.recTime }}</text>
                <view class="cmt-user-info">
                  <!-- 匿名头像图片-->
                  <image class="user-img" :src="item.pic ? item.pic : '/static/images/icon/head04.png'"
                    @error="imageError(item, 'pic')" />
                  <view class="nickname">
                    <view class="name-star">
                      <view class="name">{{ item.isWriteOff ? i18n.userOff : (item.isAnonymous == 1 ?
                        i18n.anonymousEvaluation : item.nickName) }}</view>
                      <view>
                        <comm-star :value="item.score" />
                      </view>
                    </view>
                    <view style="color: #999">{{ item.skuName || "" }}</view>
                  </view>
                </view>
              </view>
              <view class="cmt-cnt">
                <text decode="true">{{ item.content }}</text>
              </view>
              <scroll-view v-if="item.pics && item.pics.length" class="cmt-attr" scroll-x="true">
                <ImgShow v-for="(commPic, index) in item.pics" :key="index" :class="['cmt-attr-img']" :src="commPic"
                  @handleTap="() => clickImg(commPic, item.pics)" />
              </scroll-view>
              <view v-if="item.replyContent" class="cmt-reply">
                <text class="reply-tit">{{ i18n.shopReply }}：</text>
                <text class="reply-content">{{ item.replyContent }}</text>
              </view>
            </view>
          </view>
          <!-- 列表空 -->
          <!-- <view v-if="!prodCommPage.records.length" class="empty">
          <view class="empty-icon">
            <image src="/static/images/icon/empty-com.png" />
          </view>
          <view class="empty-text">{{ i18n.noProductReviewsTips }}</view>
        </view> -->
          <!-- 空列表或加载全部提示 -->
          <EmptyAllTips v-if="isLoaded" :emptyImg="4" :isEmpty="!prodCommPage.records.length"
            :emptyTips="i18n.noProductReviewsTips" />
          <!-- /列表空 -->
          <view v-if="prodCommPage.pages > prodCommPage.current" class="load-more">
            <text @tap="getMoreCommPage">{{ i18n.clickLoadMore }}</text>
          </view>
        </view>
      </view>
    </view>
</template>

<script>
const http = require('../../../utils/http.js')
const config = require('../../../utils/config.js')
const util = require('../../../utils/util.js')
var Qr = require('../../../utils/wxqrcode.js')
import coupon from '@/components/coupon/index.vue'
import commStar from '@/components/comm-star/index.vue'
import rhythmBeat from '@/components/rhythm-beat/index.vue'
import prodSkuSelect from '@/components/prod-sku-select/index.vue'
// import Pay from '../../utils/pay.js'
import dp from '../../../package-distribution/pages/promotion-prod/drawPosters.js'

// #ifdef H5
import Wechat from '../../../utils/wechat.js'
// #endif
export default {
  components: {
    coupon,
    commStar,
    rhythmBeat,
    prodSkuSelect
  },
  props: {},
  data() {
    return {
      virtualInfo: {},
      defaultPrice: 0,
      isEn: uni.getStorageSync('bbcLang') == 'en', // 是否为英文
      seckillVO: null, // 秒杀信息
      groupActivityVO: null, // 团购信息

      isWechat: false, // 是否为微信环境
      shopId: 1,
      shopInfo: '', // 店铺信息

      comboList: [], // 优惠套餐列表
      mainDiscountPackageData: [], // 套餐主商品信息
      giveawayList: [], // 赠品列表
      picDomain: config.picDomain,
      prodNum: 1,
      totalCartNum: 0,
      groupActivityId: 0,
      discountId: null, // 满减折活动id
      pic: '',
      imgs: '',
      prodName: '',
      price: 0,
      actPrice: 0,
      content: '',
      prodId: 0,
      brief: '',
      skuId: 0,
      popupShow: false,
      // 是否获取过用户领取过的优惠券id
      loadCouponIds: false,
      skuShow: false,
      skuGroupShow: false,
      commentShow: false,
      couponList: [],
      skuList: [],
      skuLoad: false,
      findSku: true,
      defaultSku: {},
      defaultActivitySku: '',
      prodCommData: '',
      prodCommPage: {
        current: 0,
        pages: 0,
        records: []
      },
      littleCommPage: [],
      evaluate: -1,
      isCollection: false,
      shareShow: false,
      // 是否分销员
      isDist: false,
      // 是否分销商品
      isDistProd: false,
      // 分销员卡号
      distributionCardNo: '',
      // 是否显示二维码弹层
      wxCodeShow: false,
      // 分享二维码图片路径
      shareWxCode: '',
      // 团购活动
      activityInfo: {},
      // 距离团购活动结束还剩多久
      endOfGroupTime: {},
      // 可加入的团列表
      joinGroupList: [],
      // sku的显示类型 0普通sku 1拼团sku
      skuShowType: 0,
      // 活动剩余库存
      totalStocks: 0,
      joinGroupListTimer: '',
      endOfGroupTimer: '',
      scene: '',
      prodDiscountList: [], // 商品促销活动列表
      prodType: 0, // 商品类型(0普通商品 1拼团 2秒杀 3青春豆 5活动商品)
      showDiscountPopup: false, // 促销弹窗显隐
      popupShowHiden: false, // 所有弹窗的显隐判断

      guideShare: false, // 引导蒙版

      deliveryModeVO: null, // 配送方式

      isPlaying: false,
      showBacktop: false,
      liveRoomParams: [], // 直播列表

      // 预售
      preSellStatus: 0, // 预售状态 1：开启 0：未开启
      preSellTime: '', // 预售发货时间

      scrollTop: -1, // 滚动监听
      curLang: uni.getStorageSync('bbcLang'),

      // 虚拟商品
      mold: '', // 1虚拟商品
      virtualRemarks: [], // 留言
      isRefund: null, // 0不支持退款 1支持退款
      writeOffTime: null, // 核销有效期 -1.长期有效 0.自定义 x.x天内有效
      writeOffNum: null, // 核销次数 -1.多次核销 0.无需核销 1.单次核销
      writeOffStart: null, // 核销有效期开始时间
      writeOffEnd: null, // 核销有效期结束时间
      prodParameterList: [], // 商品参数
      // 是否已请求过商品详情
      hadOnloaded: false,
      prodInfo: {},

      // 分销海报
      showShareBtn: false, // 分享栏
      showCanvasImg: true, // 海报图片（小程序不显示）
      canvasW: 0, // 画布宽
      canvasH: 0, // 画布高
      canvasHMax: 0, // 画布最大高
      systemInfo: {},
      shareImgUrl: '',
      marginTopCanvas: 0,
      shareProdId: 0,
      shareProdName: '',
      sharePic: '',
      sharePrice: '',
      isLoaded: false,
      distributionUserId:'',//团长ID
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
  onLoad: function (options) {
    // #ifdef H5
    this.isWechat = Wechat.isWechat()
    // #endif
    // #ifdef APP-PLUS
    this.isWechat = false
    // #endif
    // #ifdef MP-WEIXIN
    this.isWechat = true
    // #endif
    // console.log(1111,this.$Route.query.cardno)
    this.setData({
      prodId: this.$Route.query.prodId,
      distributionCardNo: this.$Route.query.cardno || ''
    })
    // 普通的跳转
    if (this.$Route.query.prodId) {
      this.executionFunction()
    }
    // 扫码进入 (小程序)
    if (this.$Route.query.scene) {
      const scene = decodeURIComponent(this.$Route.query.scene)
      // 如果是微信小程序中下载保存的二维码
      if (scene.indexOf(',') !== -1) {
        this.setData({
          prodId: scene.split(',')[0],
          distributionCardNo: scene.split(',')[1]
        })
        this.saveShareLog()
        this.executionFunction()
      } else {
        this.setData({
          scene: scene
        })
        // 根据Ticket获取保存的内容
        this.getContent()
      }
    }
    if (this.$Route.query.cardno || this.$Route.query.isShare) {
      this.saveShareLog()
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(this.joinGroupListTimer)
    clearTimeout(this.endOfGroupTimer)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    uni.setNavigationBarTitle({
      title: this.i18n.commodityDetails
    })
    if (this.prodId) {
      // 加载购物车数字
      this.getCartCount()
      // 加载评论数据
      this.getProdCommData()
      // 加载评论分页
      this.getProdCommPage('', 1)
      if (this.hadOnloaded) {
        this.getProdInfo()
      }
      // 获取用户信息
      this.queryUserInfo()
    }
    this.skuLoad = false
    this.skuShowType = 0 // 重置sku类型
  },

  /**
   * 页面相关事件处理函数--监听页面隐藏
   */
  onHide: function () {
    this.skuShow = false
    this.popupShowHiden = false
    if (this.isPlaying) {
      this.$refs.media.stopPlay()
    }
    clearTimeout(this.joinGroupListTimer)
    clearTimeout(this.endOfGroupTimer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 页面滚动事件
   */
  onPageScroll: function (e) {
    this.scrollTop = e.scrollTop
    if (this.scrollTop > 1500) {
      this.setData({
        showBacktop: true
      })
    } else if (this.scrollTop < 1500) {
      this.setData({
        showBacktop: false
      })
    }
  },
  /**
   * 用户点击转发
   */
  onShareAppMessage: function (res) {
    var cardno = uni.getStorageSync('bbcDistCardNo')
    return {
      title: this.prodName,
      path: '/package-prod/pages/prod/prod?prodId=' + this.prodId + '&isShare=1' + (res.from === 'button' ? '&cardno=' + cardno : ''),
      imageUrl: this.pic,
      desc: this.brief
    }
  },
  watch: {
    skuShow(nv) {
      if (nv && this.isPlaying) {
        this.$refs.media.stopPlay()
      }
    },
    commentShow(nv) {
      if (nv && this.isPlaying) {
        this.$refs.media.stopPlay()
      }
    },
    showDiscountPopup(nv) {
      if (nv && this.isPlaying) {
        this.$refs.media.stopPlay()
      }
    },
    popupShow(nv) {
      if (nv && this.isPlaying) {
        this.$refs.media.stopPlay()
      }
    }
  },

  methods: {
    /**
     * videoSts
     */
    videoSts(sts) {
      this.isPlaying = sts
    },
    /**
     * 设置虚拟商品信息
     */
    setVirtualInputInfo(virtualRemarkList) {
      this.virtualRemarks = virtualRemarkList
    },
    /**
     * 隐藏sku弹窗
     */
    closeSkuPop() {
      this.closePopup()
    },

    /**
     * 修改商品的sku
     */
    setSku(sku, findSku) {
      this.findSku = findSku
      // 团购的sku
      if (this.prodType === 1) {
        this.defaultActivitySku = sku
      }
      this.defaultSku = sku || {}
    },

    /**
     * 修改商品数量
     */
    setProdNum(prodNum) {
      this.prodNum = prodNum
    },

    /**
     * 获取购物车
     */
    getCartCount() {
      const params = {
        url: '/p/shopCart/prodCount',
        method: 'GET',
        dontTrunLogin: true,
        callBack: (res) => {
          this.totalCartNum = res
        }
      }
      http.request(params)
    },
    /**
     * 咨询客服
     */
    handleCustomService() {
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-user/pages/chat/chat-im?shopId=' + this.shopId + '&prodId=' + this.prodId
        })
      })
    },

    /**
     * 执行函数
     */
    executionFunction: function () {
      // 加载商品数据
      this.getProdInfo()
      // 获取商品是否被收藏信息
      this.getCollection()
      // 查询分销开关是否开启
      this.getDistInfo()
      // 获取商品所有促销活动
      this.getPordDiscountList()
    },

    /**
     * 根据Ticket获取保存的内容
     */
    getContent: function () {
      http.request({
        url: '/qrcodeTicket/getContent',
        method: 'GET',
        data: {
          ticket: this.scene
        },
        callBack: (res) => {
          var content = JSON.parse(res.content)
          var ids = JSON.parse(content.content)
          if (res.type == 1) {
            // pc团购二维码跳转
            this.setData({
              prodId: ids.prodId,
              groupActivityId: ids.groupActivityId
            })
          } else if (res.type == 2) {
            // 分销员二维码跳转
            this.setData({
              prodId: ids.shareProdId,
              distributionCardNo: ids.cardNo
            })
          }
          this.executionFunction() // 所有需要加载的函数
          this.saveShareLog()
        }
      })
    },

    /**
     * 查询分销相关信息
     */
    getDistInfo() {
      // 查询分销开关是否开启
      http.request({
        url: '/p/distribution/distributionBasicSet/canDistribution',
        method: 'GET',
        dontTrunLogin: true,
        callBack: (res) => {
          if (res == 1) {
            this.getIsDistInfo()
          }
        }
      })
    },

    /**
     * 查询用户 是否为分销员
     */
    getIsDistInfo() {
      http.request({
        url: '/p/distribution/user/distributionUserInfo',
        method: 'GET',
        callBack: (res) => {
          if (res && res.state == 1) {
            this.setData({
              isDist: true
            })
            this.getIsDistProd()
            wx.setStorageSync('bbcDistCardNo', res.cardNo)
          }
        }
      })
    },

    /**
     * 查询是否为分销商品
     */
    getIsDistProd() {
      http.request({
        url: '/p/distribution/prod/isStateByProdId',
        method: 'GET',
        data: {
          prodId: this.prodId,
          state: 1
        },
        callBack: (res) => {
          if (res) {
            this.setData({
              isDistProd: true
            })
          }
        }
      })
    },

    /**
     * 获取商品是否被收藏信息
     */
    getCollection() {
      const params = {
        url: '/p/user/collection/isCollection',
        method: 'GET',
        dontTrunLogin: true,
        data: {
          prodId: this.prodId
        },
        callBack: (res) => {
          this.setData({
            isCollection: res
          })
        }
      }
      http.request(params)
    },

    /**
     * 去往优惠套餐详情
     */
    toDiscountPackageDetail(id) {
      uni.navigateTo({
        url: '/package-prod/pages/discount-package-detail/discount-package-detail?comboId=' + id + '&shopId=' + this.shopId
      })
    },

    /**
     * 添加或者取消收藏商品
     */
    addOrCannelCollection() {
      util.tapLog(3)
      util.checkAuthInfo(() => {
        const params = {
          url: '/p/user/collection/addOrCancel',
          method: 'POST',
          data: this.prodId,
          callBack: (res) => {
            this.setData({
              isCollection: !this.isCollection
            })
            uni.showToast({
              title: res ? this.i18n.collectionAdded : this.i18n.collectionCancelled,
              duration: 1200,
              icon: 'none'
            })
          }
        }
        http.request(params)
      })
    },
    // 保存浏览记录
    prodBrowseLog() {
      http.request({
        url: '/p/prodBrowseLog',
        method: 'POST',
        data: {
          prodId: this.prodId
        }
      })
    },
    // 获取商品信息
    getProdInfo() {
      this.activityInfo = {}
      let userId = null
      if (uni.getStorageSync('bbcToken') && uni.getStorageSync('bbcUserInfo')) {
        userId = uni.getStorageSync('bbcUserInfo').userId
      }
      const params = {
        url: '/prod/prodInfo',
        method: 'GET',
        data: {
          prodId: this.prodId,
          userId
        },
        callBack: (res) => {

          this.prodInfo = res
          var imgStrs = res.imgs
          var imgs = imgStrs ? imgStrs.split(',') : []
          if (!imgs) {
            imgs = ['/static/images/icon/def.png']
          }
          var content = util.formatHtml(res.content)
          const lowPrice = Math.min.apply(Math, res.skuList.map(item => item.price))
          const skuId = res.skuList.find(item => lowPrice === item.price).skuId
          let prodType = res.prodType
          // 拼团平台下架判断
          if (prodType === 1 && !res.groupActivityVO) {
            prodType = 0
          }
          this.setData({
            imgs: imgs,
            content: content,
            price: res.price,
            prodName: res.prodName,
            prodId: res.prodId,
            brief: res.brief,
            totalStocks: res.totalStocks,
            // skuList: res.prodType === 2 && res.seckillVO ? res.seckillVO.seckillSkuList : res.prodType === 1 && res.groupActivityVO ? res.groupActivityVO.groupSkuList : res.skuList,
            skuList: res.skuList,
            skuId: skuId,
            skuLoad: true,
            pic: res.pic,
            shopId: res.shopId,
            prodType: prodType, // 商品类型(0普通商品 1拼团 2秒杀 3青春豆 5活动商品)
            mold: res.mold, // 1虚拟商品
            deliveryModeVO: res.deliveryModeVO, // 配送方式
            liveRoomParams: res.liveRoomParams, // 直播列表
            preSellStatus: res.preSellStatus, // 预售状态 1：开启 0：未开启
            giveawayList: res.giveaway ? res.giveaway.giveawayProds : [], // 赠品商品栏
            comboList: res.comboList || [], // 套装商品列表
            preSellTime: res.preSellTime, // 预售发货时间
            isRefund: res.isRefund, // 0不支持退款 1支持退款
            writeOffTime: res.writeOffTime, // 核销有效期 -1.长期有效 0.自定义 x.x天内有效
            writeOffNum: res.writeOffNum, // 核销次数 -1.多次核销 0.无需核销 1.单次核销
            writeOffStart: res.writeOffStart, // 核销有效期开始时间
            writeOffEnd: res.writeOffEnd, // 核销有效期结束时间
            prodParameterList: res.prodParameterList,
            defaultPrice: res.price
          })
          if (res.mold === 1) {
            this.virtualInfo = {
              virtualRemarks: res.virtualRemark ? JSON.parse(res.virtualRemark) : [], // 留言
              isRefund: res.isRefund, // 0不支持退款 1支持退款
              writeOffTime: res.writeOffTime, // 核销有效期 -1.长期有效 0.自定义 x.x天内有效
              writeOffNum: res.writeOffNum, // 核销次数 -1.多次核销 0.无需核销 1.单次核销
              writeOffStart: res.writeOffStart, // 核销有效期开始时间
              writeOffEnd: res.writeOffEnd, // 核销有效期结束时间
              prodParameterList: res.prodParameterList
            }
          }

          this.preSellTime = res.preSellTime
          // 初始化视频
          if (res.video) {
            this.$nextTick(() => {
              this.videoContext = uni.createVideoContext('myVideo', this)
            })
          }
          // 团购商品
          if (res.prodType === 1 && res.groupActivityVO) {
            if (res.groupActivityVO.activityStatus <= 2) {
              this.setData({
                activityInfo: res.groupActivityVO,
                groupActivityId: res.groupActivityVO.groupActivityId
              })
              if (res.groupActivityVO.hasGroupTip) {
                this.getJoinGroupList()
              }
            }
          }
          if (res.prodType === 2 && res.seckillVO) {
            const nTime = new Date().getTime()
            const sTime = new Date(res.seckillVO.startTime.replace(/-/g, '/')).getTime()
            const eTime = new Date(res.seckillVO.endTime.replace(/-/g, '/')).getTime()
            res.seckillVO.activityStatus = nTime < sTime ? 1 : nTime < eTime ? 2 : 3
            this.activityInfo = res.seckillVO
          }

          if (!this.popupShow) {
            // 获取优惠券
            this.getCouponList()
          }
          if (res.prodType !== 3) {
            // 获取店铺信息
            this.getShopInfo()
          }
          // 把访问的商品分类写进缓存,用作推荐列表的参数
          uni.setStorageSync('bbcBrowseCategoryId', res.categoryId)

          if (uni.getStorageSync('bbcToken') && res.prodType !== 3) {
            this.prodBrowseLog()
          }
          this.hadOnloaded = true

          // #ifdef H5
          if (this.isWechat) {
            this.onShareWay(false)
          }
          // #endif
        },
        errCallBack: (err) => {
          if (err.code === 'A00001') {
            uni.showModal({
              title: this.i18n.tips,
              content: err.msg,
              showCancel: false,
              cancelText: this.i18n.cancel,
              confirmText: this.i18n.confirm,
              success: (res) => {
                if (res.confirm) {
                  getCurrentPages().length > 1 ? uni.navigateBack() : util.toHomePage()
                }
              }
            })
          }
          this.hadOnloaded = true
        }
      }
      http.request(params)
    },

    /**
     * 获取店铺信息
     */
    getShopInfo() {
      http.request({
        url: '/shop/headInfo',
        method: 'GET',
        data: {
          shopId: this.shopId
        },
        callBack: (res) => {
          this.setData({
            shopInfo: res
          })
          uni.setStorageSync('bbcShopInfo', res)
        }
      })
    },

    getProdCommData() {
      http.request({
        url: '/prod/prodCommData',
        method: 'GET',
        data: {
          prodId: this.prodId
        },
        callBack: (res) => {
          this.setData({
            prodCommData: res
          })
        }
      })
    },

    // 获取部分评论
    getLittleProdComm() {
      if (this.prodCommPage.records.length) {
        return
      }
      this.getProdCommPage()
    },

    getMoreCommPage(e) {
      this.getProdCommPage()
    },

    /**
     * 获取分页获取评论
     */
    getProdCommPage(evaluate, current) {
      if (evaluate || evaluate === 0) {
        if (evaluate === this.evaluate) {
          return
        }
        util.tapLog(3)

        this.setData({
          prodCommPage: {
            current: 0,
            pages: 0,
            records: []
          },
          evaluate: evaluate
        })
      }
      this.isLoaded = false
      http.request({
        url: '/prod/prodCommPageByProd',
        method: 'GET',
        data: {
          prodId: this.prodId,
          size: 10,
          current: current || this.prodCommPage.current + 1,
          evaluate: this.evaluate
        },
        callBack: (res) => {
          this.isLoaded = true
          res.records.forEach((item) => {
            if (item.pics) {
              item.pics = item.pics.split(',')
            }
          })
          let records = this.prodCommPage.records
          records =
            res.current === 1 ? res.records : records.concat(res.records)
          this.setData({
            prodCommPage: {
              current: res.current,
              pages: res.pages,
              records: records
            },
            littleCommPage: this.littleCommPage.length > 0 ? this.littleCommPage : records.filter((el, index) => {
              return index < 2
            })
          })
        }
      })
    },

    /**
     * 评论小图点击事件(点击图片显示大图)
     */
    clickImg: function (current, pics) {
      uni.previewImage({
        current: current,
        urls: pics
      })
    },

    getCouponList() {
      http.request({
        url: '/coupon/listByProdId',
        method: 'GET',
        data: {
          prodId: this.prodId,
          shopId: this.shopId
        },
        callBack: (res) => {
          this.setData({
            couponList: res
          })
        }
      })
    },

    // 可加入的拼团列表
    getJoinGroupList() {
      http.request({
        url: '/group/joinGroupList',
        method: 'GET',
        data: {
          groupActivityId: this.groupActivityId,
          showSize: 3
        },
        callBack: (res) => {
          this.setData({
            joinGroupList: res
          })
          this.joinGroupListCountdown(res)
        }
      })
    },

    joinGroupListCountdown(joinGroupList) {
      joinGroupList.forEach((item) => {
        item.endOfGroupTime = Object.assign({}, util.endOfStartTime(new Date().getTime(), util.dateToTimestamp(item.endTime)))
        if (!item.endOfGroupTime.signs) {
          uni.redirectTo({
            url: '/package-prod/pages/prod/prod?prodId=' + this.prodId
          })
          return
        }
      })
      this.joinGroupList = []
      this.joinGroupList = joinGroupList
      this.joinGroupListTimer = setTimeout(() => this.joinGroupListCountdown(joinGroupList), 1000)
    },

    /**
     * 去凑团
     */
    toSpellGroupDetail(e) {
      util.tapLog(3)
      const groupTeamId = e.currentTarget.dataset.groupteamid
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-activities/pages/spell-group-details/spell-group-details?groupTeamId=' + groupTeamId
        })
      })
    },

    /**
     * 跳转到首页
     */
    toHomePage: function () {
      util.tapLog(3)
      util.toHomePage()
    },

    /**
     * 跳转到满折
     */
    toDiscountList(id) {
      uni.navigateTo({
        url: '/package-activities/pages/discount-detail/discount-detail?discountId=' + id
      })
    },

    /**
     * 跳转到赠品详情
     */
    toGiveawaysProd(id) {
      uni.navigateTo({
        url: '/package-prod/pages/prod/prod?prodId=' + id
      })
    },
    /**
     * 跳转到购物车
     */
    toCartPage: function () {
      util.tapLog(3)
      this.$Router.pushTab('/pages/basket/basket')
    },

    /**
     * 加入购物车
     */
    addToCart: function (event) {
      if (!this.skuShow) {
        this.skuShow = true
        this.popupShowHiden = true
        return
      }
      if (!this.findSku) {
        return
      }
      // 查看是否授权
      util.checkAuthInfo(this.callChangeItem)
    },

    callChangeItem() {
      if (this.prodNum < 1) {
        uni.showToast({
          title: this.i18n.leastTips,
          icon: 'none'
        })
        this.prodNum = 1
        return
      }
      console.log(1111,this.distributionCardNo)
      http.request({
        url: '/p/shopCart/changeItem',
        method: 'POST',
        data: {
          basketId: 0,
          count: this.prodNum,
          prodId: this.prodId,
          shopId: this.shopId,
          shopName: this.shopName,
          skuId: this.defaultSku.skuId,
          distributionCardNo: this.distributionCardNo
        },
        callBack: (res) => {
          util.tapLog(4, null, null, this.prodNum)
          this.totalCartNum = +this.totalCartNum + +this.prodNum
          this.skuShow = false
          this.popupShowHiden = false
          uni.showToast({
            title: this.i18n.successfullyAddedCart,
            icon: 'none'
          })
        }
      })
    },

    /**
     * 立即购买
     * @param {Number} orderType 订单类型  0普通 1团购 2秒杀 3青春豆
     */
    buyNow(orderType) {
      util.tapLog(3)
      if (!this.skuShow) {
        this.skuShow = true
        this.popupShowHiden = true
        return
      }
      // 查看是否授权
      util.checkAuthInfo(() => {
        if (this.prodNum < 1) {
          return
        }

        const orderItem = {
          prodId: this.prodId,
          skuId: this.defaultSku.skuId,
          prodCount: this.prodNum,
          shopId: this.shopId,
          distributionCardNo: this.distributionCardNo
        }
        if (this.deliveryModeVO?.hasUserPickUp && !this.deliveryModeVO?.hasShopDelivery) {
          uni.setStorageSync('bbcDvyType', 2)
        }
        let url = `/package-prod/pages/submit-order/submit-order?orderEntry=1&orderType=${orderType}&mold=${this.mold}`
        if (orderType === 3) {
          url += '&dvyType=1'
        }
        if (orderType == 1) {
          // 团购订单
          orderItem.groupSkuId = this.defaultActivitySku.groupSkuId
          orderItem.groupTeamId = 0
        } else if (orderType == 2) {
          // 秒杀订单
          orderItem.seckillSkuId = this.defaultSku.seckillSkuId
          // 请求秒杀订单路径
          const params = {
            url: '/p/seckill/orderPath',
            method: 'GET',
            data: {
              prodId: this.prodId
            },
            callBack: res => {
              url = `/package-prod/pages/submit-order/submit-order?orderEntry=1&orderType=${orderType}&orderPath=${res}&mold=${this.mold}`
              this.toSubmitOrder(orderItem, url)
            }
          }
          http.request(params)
          return
        }
        // else if (orderType == 3 && !this.defaultSku.price) {
        //   uni.setStorageSync('bbcOrderItem', Object.assign({}, orderItem))
        //   // 纯青春豆商品直接支付
        //   return this.scorePay()
        // }
        // 青春豆商品需跳转支付页面
        this.toSubmitOrder(orderItem, url)
      })
    },
    scorePay() {
      const orderParam = uni.getStorageSync('bbcOrderItem') || {}
      // 获取订单信息
      const params = {
        url: '/p/score/confirm',
        method: 'POST',
        data: {
          addrId: 0,
          couponIds: [],
          couponUserIds: [],
          orderItem: uni.getStorageSync('bbcOrderItem'),
          skuId: this.defaultSku.skuId,
          dvyType: 1, // 配送类型 1:快递 2:自提 3：无需快递 4:同城配送
          isScorePay: 0,
          prodCount: orderParam.prodCount,
          userChangeCoupon: 0,
          userUseScore: 0
        },
        callBack: (res) => {
          // 如果有金额说明是有运费等, 走普通订单流程;否则弹窗直接支付
          if (res.actualTotal) {
            const url = `/package-prod/pages/submit-order/submit-order?orderEntry=1&orderType=3&mold=${this.mold}`
            this.toSubmitOrder(orderParam, url)
            return
          }
          this.submitScoreOrder(res)
        },
        errCallBack: (errMsg) => {
          if (errMsg.code === 'A03001' || errMsg.code === 'A03002') {
            uni.showModal({
              title: this.i18n.tips,
              content: errMsg.code === 'A03001' ? this.i18n.deliveryNotSupported : this.i18n.duplicateErrorTips,
              showCancel: false
            })
          }
        }
      }
      http.request(params)
    },

    /* 保存图片 */
    saveImg() {
      const that = this

      // #ifdef H5
      // var a = document.createElement('a') // 创建a 标签
      // a.href = this.shareImgUrl // 把图片路径赋到a标签的href上
      // a.download = this.shareImgUrl.replace(/(.*\/)*([^.]+.*)/gi, '$2').split('?')[0] // 图片文件名
      // // 创建鼠标事件并初始化
      // var e = new MouseEvent('click', (true, false, window))
      // // 执行保存到本地
      // a.dispatchEvent(e)
      // if (this.shareImgUrl) {
      //   uni.showToast({
      //     icon: 'none',
      //     mask: true,
      //     title: that.i18n.savedSuccessfully
      //   })
      // } else {
      //   uni.showToast({
      //     icon: 'none',
      //     mask: true,
      //     title: that.i18n.savedFailfully
      //   })
      // }
      // #endif

      // #ifndef H5
      uni.saveImageToPhotosAlbum({
        filePath: this.shareImgUrl,
        success: function () {
          uni.showToast({
            icon: 'none',
            mask: true,
            title: that.i18n.savedSuccessfully
          })
        },
        fail: function (err) {
          console.log('图片保存失败：' + err)
          uni.showToast({
            icon: 'none',
            mask: true,
            title: that.i18n.savedFailfully
          })
        }
      })
      // #endif
    },

    /**
     * 提交青春豆订单
     */
    submitScoreOrder(confirmOrderRes) {
      const orderShopParam = []
      const orderInvoiceList = []
      confirmOrderRes.shopCartOrders.forEach((shopCart) => {
        orderShopParam.push({
          remarks: shopCart.remarks || '',
          shopId: shopCart.shopId
        })
        if (shopCart.invoiceDataFrom && shopCart.invoiceDataFrom.invoiceType === 1) {
          orderInvoiceList.push(shopCart.invoiceDataFrom)
        }
      })
      // 根据订单信息创建订单
      const params = {
        url: '/p/order/submit',
        method: 'POST',
        selfLoading: false,
        data: {
          orderShopParams: orderShopParam,
          isScorePay: confirmOrderRes.isScorePay,
          orderSelfStationDto: {
            stationTime: ' ',
            stationUserMobile: '',
            stationUserName: ''
          },
          orderInvoiceList: orderInvoiceList,
          virtualRemarkList: []
        },
        callBack: (submitOrderRes) => {
          uni.showModal({
            content: this.i18n.isPay,
            confirmColor: '#3e62ad',
            cancelColor: '#3e62ad',
            cancelText: this.i18n.no,
            confirmText: this.i18n.yes,
            success: res => {
              if (res.confirm) {
                // 支付
                // Pay.toOrderPay(0, submitOrderRes.orderNumbers, 1, 1, '', '', 3, this.mold || 0)
              }
            }
          })
        },
        errCallBack: (errMsg) => {
          uni.hideLoading()
          if (errMsg.code === 'A00001') {
            uni.showModal({
              title: this.i18n.tips,
              showCancel: false,
              content: errMsg.msg,
              confirmText: this.i18n.confirm
            })
          }
        }
      }
      http.request(params)
    },

    /**
     * 跳转提交订单页
     */
    toSubmitOrder(orderItem, url) {
      uni.setStorageSync('bbcOrderItem', Object.assign({}, orderItem))
      uni.navigateTo({
        url
      })
    },

    /**
     * 优惠券
     */
    showPopup: function () {
      util.tapLog(3)
      const params = {
        url: '/p/myCoupon/listCouponIds',
        method: 'GET',
        callBack: (myCouponList) => {
          var couponList = this.couponList
          couponList.forEach((coupon) => {
            if (myCouponList && myCouponList.length) {
              // 领取该优惠券数量
              var couponLimit = 0
              // 改用户是否有可以使用的优惠券
              var isMyUseCoupon = false
              myCouponList.forEach((myCouponItem) => {
                if (myCouponItem.couponId == coupon.couponId) {
                  couponLimit = couponLimit + myCouponItem.curUserReceiveCount
                  if (myCouponItem.status == 1 && myCouponItem.curUserReceiveCount > 0) {
                    isMyUseCoupon = true
                  }
                }
              })
              // 判断用户是否到达领取优惠券上限
              if (couponLimit >= coupon.limitNum || coupon.stocks == 0) {
                coupon.canReceive = false
                // 判断领取优惠券到达上限后,该种优惠券如果没有可用优惠券,则不可领取和使用
                if (isMyUseCoupon == false) {
                  coupon.canUse = false
                } else {
                  coupon.canUse = true
                }
              } else {
                coupon.canUse = true
                coupon.canReceive = true
              }
            } else {
              coupon.canUse = coupon.stocks !== 0
              coupon.canReceive = true
            }
          })
          couponList.sort((a, b) => b.canUse - a.canUse)
          this.setData({
            couponList: couponList,
            popupShow: true,
            popupShowHiden: true,
            loadCouponIds: true
          })
        }
      }
      util.checkAuthInfo(() => {
        http.request(params)
      })
    },

    showSku: function (alonebuy) {
      util.tapLog(3)
      this.skuShow = true
      this.popupShowHiden = true
      this.skuShowType = alonebuy == 1 ? 0 : ((this.groupActivityId && this.activityInfo.activityStatus === 2) || (this.prodType === 2 && this.activityInfo.activityStatus === 2)) ? 1 : 0
    },
    showGroupSku: function () {
      util.tapLog(3)
      if (this.activityInfo.activityStatus === 1) {
        uni.showToast({
          title: this.i18n.actNotBegin,
          icon: 'none'
        })
        return
      }
      this.setData({
        skuShow: true,
        popupShowHiden: true,
        skuShowType: 1
      })
    },
    showComment: function (e) {
      util.tapLog(3)
      this.setData({
        commentShow: true,
        evaluate: e,
        prodCommPage: {
          current: 0,
          pages: 0,
          records: []
        }
      })
      this.getProdCommPage()
    },
    closePopup: function () {
      util.tapLog(3)
      this.setData({
        popupShow: false,
        skuShow: false,
        commentShow: false,
        popupShowHiden: false
      })
    },
    onShowShare: function () {
      // util.tapLog(3)
      const that = this
      this.shareImgUrl = ''
      this.shareShow = true
      this.setData({
        shareShow: true,
        popupShowHiden: true
      })
      // #ifndef MP-WEIXIN
      this.showShareBtn = true
      // #endif
      // #ifdef MP-WEIXIN
      this.showCanvasImg = false
      // #endif
      this.shareProdId = this.prodId
      this.shareProdName = this.prodName
      this.sharePic = this.pic
      this.sharePrice = this.price
      uni.getSystemInfo({
        success: function (res) {
          that.systemInfo = res
          that.canvasW = res.windowWidth * 0.8
          that.canvasHMax = (res.windowHeight - (400 * res.windowWidth / 750)) * 0.9
          that.marginTopCanvas = (res.windowHeight - (400 * res.windowWidth / 750)) * 0.1 * 0.7
        }
      })
      // 从缓存获取分销员卡号，如果没有则去接口获取，以备转发时使用
      var cardno = wx.getStorageSync('bbcDistCardNo')
      if (!cardno) {
        http.request({
          url: '/p/distribution/user/distributionUserInfo',
          method: 'GET',
          selfLoading: true,
          callBack: res => {
            wx.setStorageSync('bbcDistCardNo', res.cardNo)
            this.getShareQRCode()
          }
        })
      } else {
        this.getShareQRCode()
      }
    },
    closeEarn: function () {
      util.tapLog(3)
      this.setData({
        shareShow: false,
        popupShowHiden: false
      })
    },
    toDistCenterPage: function () {
      uni.navigateTo({
        url: '/package-distribution/pages/dis-center/dis-center'
      })
    },

    /**
     * 生成分销商品二维码
     * 小程序端 生成小程序菊花码  否则生成普通二维码
     */
    getShareQRCode() {
      const cardNo = wx.getStorageSync('bbcDistCardNo')
      // #ifdef H5 || APP-PLUS
      const code = `${config.domainAddress}/package-prod/pages/prod/prod?prodId=${this.prodId}&cardno=${cardNo}`
      this.shareWxCode = Qr.createQrCodeImg(code, { size: 250 })
      dp.drawPosters(this)
      // this.wxCodeShow = true
      // this.popupShowHiden = true
      // this.shareShow = false
      // #endif

      // #ifdef MP-WEIXIN
      var content = JSON.stringify({
        shareProdId: this.prodId,
        cardNo: cardNo
      })
      const params = {
        url: '/qrcodeTicket/miniQrCode',
        method: 'GET',
        responseType: 'arraybuffer',
        data: {
          content: content,
          type: 2
        },
        callBack: (res) => {
          // 微信小程序
          this.setData({
            // wxCodeShow: true,
            // popupShowHiden: true,
            // shareShow: false,
            shareWxCode: uni.arrayBufferToBase64(res)
          })
          dp.drawPosters(this)
        }
      }
      http.request(params)
      // #endif
    },

    // 海报绘制完成
    completeDraw() {
      const that = this
      // #ifdef MP-WEIXIN
      wx.showShareImageMenu({
        path: this.shareImgUrl,
        success: res => {
          that.shareShow = false
        },
        fail: err => {
          that.shareShow = false
          console.log(err)
        }
      })
      // #endif
    },

    /**
     * 关闭二维码弹窗
     */
    closeCodePopup() {
      util.tapLog(3)
      this.setData({
        wxCodeShow: false,
        popupShowHiden: false
      })
    },

    /**
     * 判断图片是否存在
     */
    imgCanUse(path) {
      const imgObj = new Image()
      imgObj.src = path
      if (imgObj.fileSize > 0 || (imgObj.width > 0 && imgObj.height > 0)) {
        return true
      }
      return false
    },

    /**
     * 保存图片至相册
     */
    downloadImg() {
      util.tapLog(3)
      uni.showLoading({
        // #ifndef MP-TOUTIAO
        mask: true
        // #endif
      })
      // #ifdef APP-PLUS
      const bitmap = new plus.nativeObj.Bitmap('test')
      bitmap.loadBase64Data(
        this.shareWxCode,
        () => {
          const url = '_doc/' + new Date() + '.png' // url建议用时间戳命名方式
          bitmap.save(
            url,
            {
              overwrite: true
            },
            (i) => {
              uni.saveImageToPhotosAlbum({
                filePath: url,
                success: () => {
                  uni.hideLoading()
                  this.wxCodeShow = false
                  this.popupShowHiden = false
                  uni.showToast({
                    title: this.i18n.downloadComplete
                  })
                  bitmap.clear()
                }
              })
            },
            (e) => {
              uni.hideLoading()
              // alert('保存失败1111', JSON.stringify(e))
              bitmap.clear()
            }
          )
        },
        (e) => {
          // alert('保存失败2222', JSON.stringify(e))
          uni.hideLoading()
          bitmap.clear()
        }
      )
      // #endif
      // #ifdef MP-WEIXIN
      var cardno = wx.getStorageSync('bbcDistCardNo')
      wx.downloadFile({
        header: {
          Authorization: wx.getStorageSync('bbcToken')
        },
        url:
          config.domain +
          '/p/distribution/qrCode/invitation?page=package-prod/pages/prod/prod&scene=' +
          this.prodId +
          ',' +
          cardno,
        success: (res) => {
          uni.hideLoading()
          // 图片保存到本地
          wx.getSetting({
            success: (settingData) => {
              const flag = settingData.authSetting['scope.writePhotosAlbum']
              if (flag === true || flag === undefined) {
                uni.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: (data) => {
                    this.wxCodeShow = false
                    this.popupShowHiden = false
                    uni.showToast({
                      title: this.i18n.downloadComplete,
                      icon: 'success',
                      duration: 2000
                    })
                  },
                  fail: () => {
                    uni.showToast({
                      title: this.i18n.failedSaveTips,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                })
              } else {
                wx.openSetting({
                  success: (settingData) => {
                    if (settingData.authSetting['scope.writePhotosAlbum']) {
                      uni.showToast({
                        title: this.i18n.failedSave,
                        icon: 'none',
                        duration: 2000
                      })
                    } else {
                      uni.showToast({
                        title: this.i18n.failedSaveTips,
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  }
                })
              }
            }
          })
        }
      })
      // #endif
    },

    /**
     * 用户点击分享到微信小程序
     * @param {Object} sharedata 支付需要的参数
     * @param {Object} cb 成功回调
     * @param {Object} errorCb 失败回调
     */
    onShareWay(isShow = true) {
      var cardno = wx.getStorageSync('bbcDistCardNo')
      var sharedata = {
        title: this.prodName, // 分享标题
        imgUrl: this.imgs[0], // 分享图标
        link:
          config.domainAddress +
          '/package-prod/pages/prod/prod?prodId=' +
          this.prodId +
          '&cardno=' +
          cardno, // 分享链接
        desc: this.brief ? this.brief : this.i18n.shartTips, // 分享描述
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '' // 如果type是music或video，则要提供数据链接，默认为空
      }
      Wechat.callWexinShare(
        sharedata,
        () => {
          if (isShow) {
            this.shareShow = false
            this.guideShare = true
          }
        },
        (failMsg) => {
          console.log(failMsg)
        }
      )
    },

    /**
     * 跳转到店铺页
     */
    toShopPage: function () {
      util.tapLog(3)
      let url = ''
      if (this.shopInfo.renovationId) {
        url = '/package-shop/pages/feature-index/feature-index0?shopId=' + this.shopInfo.shopId + '&renovationId=' + this.shopInfo.renovationId
      } else {
        url = '/package-shop/pages/shop-page/shop-page?shopId=' + this.shopInfo.shopId
      }
      uni.navigateTo({
        url
      })
    },

    /**
     * 通过商品id获取商品所有促销活动
     */
    getPordDiscountList() {
      http.request({
        url: '/marking/discount/getDiscountByProdId',
        method: 'GET',
        data: {
          prodId: this.prodId
        },
        callBack: (res) => {
          this.setData({
            prodDiscountList: res
          })
        }
      })
    },
    /**
     * 促销活动弹窗
     */
    clickDiscount: function () {
      this.showDiscountPopup = !this.showDiscountPopup
      this.popupShowHiden = this.showDiscountPopup
    },

    /**
     * 回到页面顶部
     */
    handleScorllTop() {
      uni.pageScrollTo({
        duration: 100,
        scrollTop: 0
      })
    },

    /**
     * 前往直播页面
     */
    toLivePage: function (e) {
      this.roomId = e.currentTarget.dataset.roomid // 填写具体的房间号
      this.url = e.currentTarget.dataset.url
      util.checkAuthInfo(this.toLivePlayer)
    },
    toLivePlayer: function () {
      const roomId = this.roomId
      const url = this.url
      if (this.isWechat) {
        if (this.liveRoomParams.length == 1) {
          // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取
          const customParams = encodeURIComponent(
            JSON.stringify({
              path: url
            })
          )
          // console.log('customParams:', customParams)
          wx.navigateTo({
            url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
          }) // 其中wx2b03c6e691cd7370是直播组件appid不能修改
        } else {
          wx.navigateTo({
            url: '/pages/live-broadcast/live-broadcast?prodId=' + this.prodId
          })
        }
      } else {
        uni.showToast({
          title: this.i18n.pleaseOpenInWechat,
          icon: 'none'
        })
      }
    },

    /**
     * 满减信息处理
     */
    parseDiscountProd(discountRule, needAmount, discount) {
      if (discountRule == 1) {
        return this.curLang.includes('zh_CN') ? '满￥' + needAmount + '减' + '￥' + discount : '￥' + discount + ' off on ' + '￥' + needAmount
      } else if (discountRule == 2) {
        return this.curLang.includes('zh_CN') ? '满￥' + needAmount + '打' + discount + '折' : 100 - discount * 10 + '% off on ' + '￥' + needAmount
      } else {
        return ''
      }
    },

    /**
     * 通过分享进入
     */
    saveShareLog() {
      const flowAnalysisLogDto = uni.getStorageSync('bbcFlowAnalysisLogDto')
      flowAnalysisLogDto.bizData = this.prodId
      http.saveLog(flowAnalysisLogDto, 2)
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
        }
      }
      http.request(params)
    },
  }
}
</script>
<style>@import "./prod.css";</style>
