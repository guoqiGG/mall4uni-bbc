<!--
  Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

  https://www.mall4j.com/

  未经允许，不可做商业用途！

  版权所有，侵权必究！
-->

<template>
  <view class="Mall4j container">
    <view class="order-detail">
      <!-- 订单状态 -->
      <view class="order-status">
        <view class="status-bg">
          <image src="/static/images/icon/status-bg.png" />
        </view>
        <view class="status-text">{{ ['',i18n.waitingBuyerPay,i18n.waitingForDelivery,i18n.waitingBuyerReceipt,i18n.orderCompleted,i18n.orderCompleted,i18n.orderCancelled,i18n.itInaGroup][status] }}</view>
        <view class="step">
          <view :class="['item',status==2||status==3||status==4||status==5||status==7||(status == 6 && orderItemDtos[0].refundSn)?'active':'']">
            <view class="select" />
            <!-- 买家付款 -->
            <view class="des">{{ i18n.buyerPayment }}</view>
          </view>
          <!-- 自提没有这一项 -->
          <view v-if="(dvyType == 1 || dvyType == 4)" :class="['item',(dvyType == 1 || dvyType == 4) && (status==3||status==4||status==5) ?'active':'']">
            <view class="select" />
            <!-- 商家发货 -->
            <view class="des">{{ i18n.merchantShipment }}</view>
          </view>
          <!-- 快递没有这一项 -->
          <view v-if="dvyType == 2" :class="['item',status==3 || status==5?'active':'']">
            <view class="select" />
            <!-- 买家提货 -->
            <view class="des">{{ i18n.buyerPickUp }}</view>
          </view>
          <!-- 虚拟商品(orderMold:1)没有这一项 -->
          <view v-if="dvyType == 3 && orderMold !== 1" :class="['item',status>=3 ?'active':'']">
            <view class="select" />
            <!-- 商家配送 -->
            <view class="des">{{ i18n.merchantDelivery }}</view>
          </view>
          <view :class="['item',status==4||status==5?'active':'']">
            <view class="select" />
            <!-- 交易完成 -->
            <view class="des">{{ i18n.transactionComplete }}</view>
          </view>
        </view>
      </view>

      <!-- 配送地址(虚拟商品不展示) -->
      <view v-if="dvyType !== 2 && userAddrDto && orderMold !== 1" class="address-box">
        <view class="img">
          <image src="/static/images/icon/addr.png" />
        </view>
        <view class="user-info">
          <view class="name">{{ userAddrDto.receiver }}</view>
          <view class="phone">{{ userAddrDto.mobile }}</view>
        </view>
        <view class="address-detail">{{ userAddrDto.province }}{{ userAddrDto.city }}{{ userAddrDto.area }}{{ userAddrDto.addr }}</view>
      </view>

      <!-- 自提地址(虚拟商品不展示) -->
      <view v-if="dvyType == 2" class="delivery-certificate">
        <view class="tit"><text v-if="status == 2 ">{{ i18n.deliveryVoucher }}</text><text v-if="status > 2">{{ i18n.pickup }}</text></view>
        <view class="address">
          <view class="text">{{ stationAddress }}</view>
          <view class="icon-box">
            <view class="icon" @tap="callStation">
              <image src="/static/images/icon/phone.png" />
            </view>
            <view class="icon bl" @tap="openMap">
              <image src="/static/images/icon/addr.png" />
            </view>
          </view>
        </view>
        <!-- 没付款时 -->
        <view v-if="status == 1" class="code-box no-code">
          <view class="text-box">
            <view class="item">
              <view class="i-lable">{{ i18n.picker }}：</view>
              <view class="i-text">
                <text>{{ stationUserName }}</text>
                <text>{{ stationUserMobile }}</text>
              </view>
            </view>
          </view>
        </view>
        <!-- 已付款时 -->
        <view v-if="status == 2" class="code-box code-det" @tap="viewCertificate">
          <view class="code">
            <image :src="stationQrCode" />
            <!-- <canvas class="qrcode-img" canvas-id="orderQrcode"></canvas> -->
          </view>
          <view class="text-box">
            <view class="item">
              <view class="i-lable">{{ i18n.pickingCode }}：</view>
              <view class="i-text fw">{{ stationCode }}</view>
            </view>
            <view class="item">
              <view class="i-lable">{{ i18n.picker }}：</view>
              <view class="i-text">
                <text>{{ stationUserName }}</text>
                <text>{{ stationUserMobile }}</text>
              </view>
            </view>
            <view class="item">
              <view class="i-lable">{{ i18n.appointmentTime }}：</view>
              <view class="i-text">{{ stationTime }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 商品信息 -->
      <view class="prod-item">
        <!-- 店铺 -->
        <!-- <view class="shop-box">
          <view class="shop-icon">
            <image src="/static/images/icon/shop.png" />
          </view>
          <view class="shop-name">{{ shopName }}</view>
        </view> -->
        <!-- /店铺 -->
        <view v-for="(item, prodIndex) in orderItemDtos" :key="prodIndex" class="prod-box">
          <view class="item-cont" @tap="toProdDetail(item.prodId)">
            <view class="prod-pic">
              <image v-if="item.pic && !item.isPicError" mode="aspectFit" :src="item.pic" @error="handlePicError(item)" />
              <image v-else src="/static/images/icon/def.png" mode="aspectFit" />
            </view>
            <!-- 拼团商品展示icon -->
            <view class="prod-info">
              <view>
                <view class="prodname">
                  <view class="text">{{ item.prodName }}</view>
                </view>
                <view class="suk-con sku-info">
                  <view v-if="orderType && orderMold !== 1" class="a-icon">{{ ['',i18n.aGroup,i18n.spike,i18n.integral][orderType] }}</view>
                  <view class="sku-name">{{ item.skuName || '' }}</view>
                </view>
                <view v-if="preSaleTime" class="suk-con">
                  <view class="sku-name">{{ tsToDate(preSaleTime) }}&nbsp;{{ $t('index.startDelivery') }} </view>
                </view>
              </view>
              <!-- 价格 -->
              <view class="price-nums">
                <view class="prodprice"><text v-if="item.price" class="symbol">￥</text>
                  <text v-if="item.price" class="big-num">{{ parsePrice(item.price)[0] }}</text>
                  <text v-if="item.price" class="small-num">.{{ parsePrice(item.price)[1] }}</text>
                  <text v-if="item.price && orderType==3" class="small-num">{{ `&nbsp;+&nbsp;` }}</text>
                  <text v-if="orderType==3" class="small-num">{{ item.useScore / item.prodCount }} {{ i18n.integral }}</text>
                </view>
                <view class="number">{{ item.prodCount }}{{ i18n.piece }}</view>
              </view>
            </view>
            <!--
              申请退款：
                1、orderMold==1虚拟商品(支持买家申请退款时)
                1.1 需要核销且还有未核销的券码
                1.2 无需核销
                2、金额为0且无使用青春豆时不显示
            -->
            <view
              v-if="!item.refundSn && canRefund && orderType !== 3 &&
                (item.actualTotal || (!item.actualTotal && item.useScore)) &&
                (orderMold !=1 ||
                  (orderMold == 1 && ((writeOffNum != 0 && unusedCount) || writeOffNum == 0)))"
              class="apply-refund-btn"
              @tap.stop="applyRefund(item,2)"
            >{{ i18n.requestRefund }}</view>
            <view v-if="item.refundSn && item.returnMoneySts != -1" class="apply-refund-btn" :data-refundsn="item.refundSn" @tap.stop="viewRefund">{{ i18n.checkRefund }}</view>
            <!-- 申请退款btn -->
          </view>
          <!-- 赠品：多个商品时展示 -->
          <view v-if="orderItemDtos.length > 1 && item.giveawayList && item.giveawayList.length" class="gift-prods">
            <view
              v-for="giftItem in item.giveawayList"
              :key="giftItem.orderItemId"
              class="gift-item"
              @tap="toProdDetail(giftItem.prodId)"
            >
              <text class="name">{{ '【' + i18n.gift + '】' }}{{ giftItem.prodName }}</text>
              <text class="sku-name">{{ giftItem.skuName || '' }} </text>
              <text class="num">×{{ giftItem.prodCount }}</text>
            </view>
          </view>
        </view>
        <!-- 赠品：单个商品时展示 -->
        <block v-if="orderItemDtos.length === 1 && orderItemDtos[0].giveawayList && orderItemDtos[0].giveawayList.length">
          <view v-for="(item) in orderItemDtos[0].giveawayList" :key="item.orderItemId" class="prod-box giveaway-list">
            <view class="item-cont" @tap="toProdDetail(item.prodId)">
              <view class="prod-pic">
                <image v-if="item.pic && !item.isPicError" mode="aspectFit" :src="item.pic.indexOf('http') === -1 ? picDomain + item.pic : item.pic" @error="handlePicError(item)" />
                <image v-else src="/static/images/icon/def.png" mode="aspectFit" />
              </view>
              <view class="prod-info">
                <view>
                  <view class="prodname">
                    <view class="text">{{ item.prodName }}</view>
                  </view>
                  <view class="suk-con">
                    <view v-if="orderType && orderMold !== 1" class="a-icon">{{ ['',i18n.aGroup,i18n.spike,i18n.integral][orderType] }}</view>
                    <view class="sku-name">
                      <text class="gift-icon">{{ i18n.gift }}</text>
                      <text>{{ item.skuName || '' }}</text>
                    </view>
                  </view>
                </view>
                <view class="price-nums">
                  <view v-if="!item.giveawayOrderItemId" class="prodprice"><text v-if="item.price" class="symbol">￥</text>
                    <text v-if="item.price" class="big-num">{{ parsePrice(item.price)[0] }}</text>
                    <text v-if="item.price" class="small-num">.{{ parsePrice(item.price)[1] }}</text>
                    <text v-if="item.price && orderType==3" class="small-num">+</text>
                    <text v-if="orderType==3" class="small-num">{{ item.useScore }} {{ i18n.integral }}</text>
                  </view>
                  <view class="number">{{ item.prodCount }}{{ i18n.piece }}</view>
                </view>
              </view>
            </view>
          </view>
        </block>
        <!-- / 赠品 -->
      </view>

      <!-- 订单信息 -->
      <view class="order-msg">
        <view class="msg-item">
          <view class="item">
            <text class="item-tit">{{ i18n.orderNumber }}：</text>
            <text class="item-txt">{{ orderNumber }}</text>
            <text class="copy-btn" @tap="copyText(orderNumber)">{{ i18n.copy }}</text>
          </view>
          <view class="item">
            <text class="item-tit">{{ i18n.orderTime }}：</text>
            <text class="item-txt">{{ createTime }}</text>
          </view>
        </view>
        <view v-if="(status>1&&status!=6) || orderMold !== 1 || (orderMold === 1 && virtualRemarkList)" class="msg-item">
          <!-- 支付方式 -->
          <view v-if="status>1&&status!=6" class="item">
            <text class="item-tit">{{ i18n.paymentMethod }}：</text>
            <text class="item-txt">{{ [i18n.integralPayment,i18n.payWithWeChat,i18n.PayWithAli,i18n.payWithWeChat,i18n.payWithWeChat,i18n.payWithWeChat,i18n.PayWithAli,i18n.PayWithAli,i18n.payWithWeChat,i18n.balancePay,i18n.paypalPay][payType] }}</text>
          </view>
          <!-- 配送方式（虚拟商品不展示） -->
          <view v-if="orderMold !== 1" class="item">
            <text class="item-tit">{{ i18n.deliveryMethod }}：</text>
            <!-- 1卖家配送 2到店自提 3无需快递 4同城配送 -->
            <text class="item-txt">{{ ['',i18n.sellerDelivery,i18n.pickStore,i18n.noNeedDelivery,i18n.sameDelivery][dvyType] }}</text>
          </view>
          <!-- 全部留言：虚拟商品 && 留言不为空时显示 -->
          <view v-if="orderMold === 1 && virtualRemarkList.length > 0" class="item all-msg" @tap="showViewMsgPopup">
            <view class="item-tit">{{ i18n.allMsg }}：</view>
            <view class="item-txt" :class="{'pd': isExtraLong}"><span v-for="(item, index) in virtualRemarkList" :key="index">{{ item[0] }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item[1] }}</span></view>
            <view v-if="isExtraLong" class="more-msg" />
          </view>
        </view>
        <!-- 订单备注 -->
        <view v-if="remarks" class="msg-item">
          <view class="item">
            <text class="item-tit">{{ i18n.OrderNotes }}：</text>
            <text class="item-txt">{{ remarks?remarks:'' }}</text>
          </view>
        </view>
      </view>

      <!--
        虚拟商品-券码列表显隐：
        1、订单状态为status==1“待支付” 时隐藏
        2、订单状态为status==6“已取消”时
          2.1 含有退款编号（即退款成功）时显示
          2.2 不含退款编号（即取消支付）时隐藏
        3、订单状态为status==7“拼团中” 时隐藏
        4、writeOffNum!==0 需要核销的虚拟商品 显示
      -->
      <view
        v-if="orderMold === 1 &&
          status != 1 &&
          status != 7 &&
          ((status == 6 && orderItemDtos[0].refundSn) || status != 6) &&
          writeOffNum !== 0"
        class="order-msg voucher-code-con"
      >
        <view class="msg-item">
          <view class="item" @tap="toViewVoucherCodePage">
            <view class="item-left">
              <!-- 待使用/未使用 (unusedCount待使用的核销券) -->
              <view
                v-if="unusedCount && status != 6"
                class="txt strong"
              >{{ (isExpired?i18n.expired:i18n.toBeUsed) + '（' + unusedCount + i18n.sheets + '）' }}</view>
              <!-- 确认收货(已完成) & 没有待核销的券码 -->
              <view
                v-if="status == 5 && !unusedCount"
                class="txt strong"
              >{{ i18n.used + '（' + orderItemDtos[0].prodCount + i18n.sheets + '）' }}</view>
              <!-- 退款成功 -->
              <view
                v-if="status == 6 && orderItemDtos[0].refundSn"
                class="txt strong"
              >{{ i18n.used + '（' + (orderItemDtos[0].prodCount - unusedCount) + i18n.sheets + '）' }}</view>
              <!-- 有效期限 -->
              <view class="txt weak flex-item">
                <view class="lf">{{ i18n.expirationDate }}：</view>
                <view class="rg">
                  <text v-if="writeOffStart && !writeOffEnd">{{ i18n.longTermValidity }}</text>
                  <text v-if="writeOffStart && writeOffEnd">{{ writeOffStart + i18n.to + writeOffEnd }}</text>
                </view>
              </view>
              <!-- 核销次数 -->
              <view class="txt weak flex-item">
                <view class="lf">{{ i18n.numberOfWriteOffs }}：</view>
                <view class="rg">
                  <text v-if="writeOffNum === -1">{{ i18n.multipleWriteOffs }}</text>
                  <text v-if="writeOffNum === 1">{{ i18n.singleWriteOffs }}</text>
                  <text v-if="writeOffNum === 0">{{ i18n.noWriteOffRequired }}</text>
                </view>
              </view>
            </view>
            <!-- 核销码条码/二维码： 非取消状态 && 仍有待使用的核销券码时显示icon -->
            <view v-if="status != 6 && unusedCount" class="item-right">
              <image src="/static/images/icon/write-off-code.png" />
            </view>
          </view>
        </view>
        <!-- 券码列表 -->
        <view v-if="virtualInfoList && virtualInfoList.length" class="msg-item voucher-code-list">
          <view
            v-for="(item, index) in virtualInfoList"
            :key="index"
            class="item"
            :class="{'used': item.isWriteOff === 1 || status == 6}"
          >
            <view class="code-row">
              <text>{{ i18n.voucherCode }}</text>
              <text v-if="virtualInfoList && virtualInfoList.length > 1">{{ index+1 }}</text>：
              <text class="code">{{ item.writeOffCode }}
              </text>
            </view>
            <view v-if="item.isWriteOff === 1" class="tips">{{ i18n.used }}</view>
            <view v-if="item.isWriteOff === 0 && status == 6 && orderItemDtos[0].refundSn" class="tips">{{ i18n.refunded }}</view>
            <view v-if="item.isWriteOff === 0 && status != 6" class="copy-btn2" @tap="copyText(item.writeOffCode)">{{ i18n.copy }}</view>
          </view>
        </view>
      </view>

      <!-- 商品总额与优惠明细 -->
      <view class="order-msg payment">
        <view class="msg-item">
          <!-- 商品总额 -->
          <view class="item">
            <view class="item-tit">{{ i18n.comTotal }}：</view>
            <view class="item-txt">￥{{ parsePrice(productTotalAmount)[0] }}.{{ parsePrice(productTotalAmount)[1] }}</view>
          </view>
          <!-- 商品运费(虚拟商品不展示) -->
          <view v-if="orderMold !== 1" class="item">
            <view class="item-tit">{{ i18n.prodTransfee }}：
            </view>
            <view class="transfee-tips" style="display: flex;">
              <view class="item-txt">
                <view v-if="transfee && status === 2 && isRefunding" class="item-txt gray-tips-con" @tap="showTransfeeTips=true">
                  <icon type="info" color="#666" size="14" class="info-tips" />
                  <text v-if="showTransfeeTips" class="mask" @tap.stop="showTransfeeTips=false" />
                  <text v-if="showTransfeeTips" class="tips">{{ i18n.refundBeforeShippingTips }}</text>
                </view>
                ￥{{ parsePrice(transfee)[0] }}.{{ parsePrice(transfee)[1] }}</view>
            </view>
          </view>
          <!-- 运费减免 -->
          <view v-if="freeTransfee" class="item">
            <view class="item-tit">{{ i18n.shippingDiscount }}：</view>
            <view class="item-txt gray">-￥{{ parsePrice(freeTransfee)[0] }}.{{ parsePrice(freeTransfee)[1] }}</view>
          </view>
          <!-- 平台优惠券 -->
          <view v-if="platformCouponAmount" class="item">
            <view class="item-tit">{{ i18n.platformCoupons }}：</view>
            <view class="item-txt gray">-￥{{ parsePrice(platformCouponAmount)[0] }}.{{ parsePrice(platformCouponAmount)[1] }}</view>
          </view>
          <!-- 青春豆抵扣 -->
          <view v-if="scoreAmount" class="item">
            <view class="item-tit">{{ i18n.pointsDeduction }}：</view>
            <view class="item-txt gray">-￥{{ parsePrice(scoreAmount)[0] }}.{{ parsePrice(scoreAmount)[1] }}</view>
          </view>
          <!-- 会员折扣 -->
          <view v-if="memberAmount" class="item">
            <view class="item-tit">{{ i18n.memberDiscountAmount }}：</view>
            <view class="item-txt gray">-￥{{ parsePrice(memberAmount)[0] }}.{{ parsePrice(memberAmount)[1] }}</view>
          </view>
          <!-- 店铺优惠券 -->
          <view v-if="shopCouponMoney" class="item">
            <view class="item-tit">{{ i18n.storeCoupons }}：</view>
            <view class="item-txt gray">-￥{{ parsePrice(shopCouponMoney)[0] }}.{{ parsePrice(shopCouponMoney)[1] }}</view>
          </view>
          <!-- 促销满减 -->
          <view v-if="discountMoney" class="item">
            <view class="item-tit">{{ i18n.promotionOffer }}：</view>
            <view class="item-txt gray">-￥{{ parsePrice(discountMoney)[0] }}.{{ parsePrice(discountMoney)[1] }}</view>
          </view>
          <!-- 套餐优惠 -->
          <view v-if="shopComboAmount" class="item">
            <view class="item-tit">{{ i18n.packageOffer }}：</view>
            <view class="item-txt gray">-￥{{ parsePrice(shopComboAmount)[0] }}.{{ parsePrice(shopComboAmount)[1] }}</view>
          </view>
          <!-- 团购/秒杀优惠 -->
          <view v-if="(orderType == 1 || orderType == 2) && shopAmount" class="item">
            <view class="item-tit">{{ orderType === 1 ? i18n.aGroup : i18n.spike }}{{ i18n.preferential }}：</view>
            <view class="item-txt gray">-￥{{ parsePrice(shopAmount)[0] }}.{{ parsePrice(shopAmount)[1] }}</view>
          </view>
          <!-- 商家改价(只允许减价) -->
          <view v-if="shopChangeFreeAmount" class="item">
            <view class="item-tit">{{ i18n.merchantsModifyPrices }}：</view>
            <view class="item-txt gray"> -￥{{ parsePrice(Math.abs(shopChangeFreeAmount))[0] }}.{{ parsePrice(Math.abs(shopChangeFreeAmount))[1] }}</view>
          </view>
          <!-- 订单总额 -->
          <view class="item price">
            <view class="item-txt">
              <text class="gray">{{ i18n.orderTotal }}：</text>
              <text v-if="actualTotal && actualTotal > 0" class="symbol">￥</text>
              <text v-if="actualTotal && actualTotal > 0" class="big-num">{{ parsePrice(actualTotal)[0] }}</text>
              <text v-if="actualTotal && actualTotal > 0 || actualTotal > 0" class="small-num">.{{ parsePrice(actualTotal)[1] }}</text>
              <text v-if="(actualTotal && actualTotal > 0) && (orderType==3 || orderScore > 0)" class="small-num">+</text>
              <text v-if="orderType==3 || orderScore > 0" class="big-num">{{ orderScore }}<text class="small-num">{{ i18n.integral }}</text></text>
            </view>
          </view>
        </view>
      </view>
      <!-- 商品总额与优惠明细 end -->

      <!-- 底部栏 -->
      <!-- v-if="canAllRefund && orderType!=3" -->
    </view>
    <view class="order-detail-footer">
      <view style="display: flex;align-items: center;"><view v-if="isShowMore" class="more-text" @tap="handleMore">{{ i18n.more }}</view></view>
      <view class="footer-btn-box">
        <!-- <view v-if="!isShowMore" class="group-det" @tap="handleCustomService">{{ i18n.contactCustomerService1 }}</view> -->
        <view
          v-if="isViewInvoice&&!isShowMore&&(!refundStatus || refundStatus === 4)"
          class="group-det"
          @tap="viewIinvoice(orderNumber,orderInvoiceId)"
        >{{ i18n.invoice.viewInvoice }}</view>
        <!-- <view
          v-if="isInvoice&&!isShowMore&&(!refundStatus || refundStatus === 4)"
          class="group-det"
          @tap="showInvoicePopup(shopId ,orderNumber)"
        >{{ i18n.invoice.InvoicingRequest }}</view> -->
        <!-- 申请退款 -->
        <!-- 金额为0且无使用青春豆时不显示 -->
        <view
          v-if="canAllRefund && orderType!=3 && orderMold !=1 && ((orderScore && !actualTotal) || actualTotal)"
          class="refund-full"
          data-refundtype="1"
          @tap.stop="applyRefund(null,1)"
        >
          <text>{{ i18n.wholeOrderRefund }}</text>
          <!-- <text>{{ orderType < 1 ? i18n.wholeOrderRefund : i18n.requestRefund }}</text> -->
        </view>
        <view v-if="orderType==1&& status>1 && status !== 6" class="group-det" @tap="toGroupDetails">{{ i18n.viewGroupDetails }}</view>
      </view>
    </view>
    <view v-if="showMore" class="popup" :class="{ show: showMore }">
      <view class="more-popup-mask" @tap="closePopup" />
      <view class="more-box">
        <!-- <view class="more-box-mark" /> -->
        <!-- <view class="more-popup-text" @tap="handleCustomService">{{ i18n.contactCustomerService1 }}</view> -->
        <view
          v-if="isViewInvoice&&(!refundStatus || refundStatus === 4)"
          class="more-popup-text"
          @tap="viewIinvoice(orderNumber,orderInvoiceId)"
        >{{ i18n.invoice.viewInvoice }}</view>
        <!-- <view
          v-if="isInvoice&&(!refundStatus || refundStatus === 4)"
          class="more-popup-text"
          @tap="showInvoicePopup(shopId ,orderNumber)"
        >{{ i18n.invoice.InvoicingRequest }}</view> -->
      </view>
    </view>
    <invoiceEdit v-if="isShowInvoicePopup" :shop-id="invoiceShopId" :order-number="invoiceOrderNumber" @closePopup="closePopup" @getData="getOrderDataList" />

    <!-- 查看留言弹窗（虚拟商品） -->
    <view class="popup-hide" :hidden="!showViewMsg">
      <view class="popup-box virtual-goods-msg-pop">
        <view class="con-tit">
          <view class="tit-text">{{ i18n.viewMsg }}</view>
          <view class="close" @tap="closeMsgPopup" />
        </view>
        <view class="msg-pop-con">
          <view class="msg-list">
            <view v-for="(item, index) in virtualRemark" :key="index" class="msg-item">
              <view class="item-con weak">{{ item.name }}</view>
              <view class="item-con">{{ item.value }}</view>
            </view>
          </view>
          <view class="pop-foot">
            <view class="foot-btn" @tap="closeMsgPopup">{{ i18n.gotIt }}</view>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
const http = require('../../../utils/http.js')
var Qr = require('../../../utils/wxqrcode')
const util = require('../../../utils/util.js')
import invoiceEdit from '../../../components/invoice-edit/index.vue'
import config from '../../../utils/config.js'
import uniCopy from '@/js_sdk/copy/uni-copy.js'

export default {

  components: { invoiceEdit },
  props: {},
  data() {
    return {
      // 图片地址
      picDomain: config.picDomain,
      orderItemDtos: [],
      remarks: '',
      actualTotal: 0,
      userAddrDto: null,
      shopId: '', // 店铺id
      orderNumber: '',
      createTime: '',
      // 订单状态status 1:待付款 2:待发货 3:待收货 4:待评价 5:成功 6:失败 7:待成团
      status: 0,
      productTotalAmount: '', // 商品总额
      transfee: '', // 运费
      freeTransfee: '', // 运费减免
      reduceAmount: '', // 总优惠
      prodId: '',
      orderType: 0,
      shopName: '', // 店铺名称
      canRefund: false, // 能否退款
      canAllRefund: false, // 能否整单退款
      isLastProd: false, // 最后一款商品
      irrevocable: false, // 不可撤销
      sum: [], // 本单已申请单个退款的商品数组
      dvyType: 1, // 配送类型 1:快递 2:自提 3：无需快递

      id: 0, // 自提信息id
      stationAddress: '', // 自提点的地址
      stationCode: '', // 提货码
      stationId: 0, // 自提点id
      stationPhone: '', // 自提点的联系电话
      stationTime: '', // 自提时间(用户下单时选择)
      stationUserMobile: '', // 自提人的手机
      stationUserName: '', // 自提人的名字
      stationQrCode: '', // 提货码二维码
      stationName: '', // 自提点名称

      payType: '', // 订单支付类型
      orderScore: 0, // 整单使用青春豆
      lat: '', // 经度
      lng: '', // 纬度
      // 当前订单可退金额
      canRefundAmount: 0,
      seckillId: '', orderInvoiceId: '',
      invoiceShopId: '',
      isShowInvoicePopup: false,
      invoiceOrderNumber: '', // 当前选择发票的id
      refundStatus: null,

      // 优惠明细
      platformCouponAmount: 0, // 平台优惠券优惠金额
      scoreAmount: 0, // 青春豆抵扣
      memberAmount: 0, // 会员折扣
      shopCouponMoney: 0, // 店铺优惠券
      discountMoney: 0, // 促销满减
      shopComboAmount: 0, // 套餐优惠
      shopAmount: 0, // 店铺优惠总额(包括秒杀/团购优惠)
      shopChangeFreeAmount: 0, // 商家改价
      showMore: false,
      // 虚拟商品
      orderMold: null, // 订单类型 1虚拟商品
      virtualRemark: [], // 留言
      virtualRemarkList: [],
      virtualInfoList: [], // 券码
      writeOffNum: 0,
      writeOffStart: null,
      writeOffEnd: null,
      isExpired: null, // 判断有无超过有效时间
      unusedCount: 0, // 待使用的核销券

      // 虚拟商品留言是否超长
      isExtraLong: false,
      // 查看全部留言弹窗
      showViewMsg: false,
      // 是否有订单项正在退款
      isRefunding: false,
      showTransfeeTips: false,
      preSaleTime: ''
    }
  },
  computed: {
    i18n() {
      return this.$t('index')
    },
    isViewInvoice() {
      return ((this.orderInvoiceId && this.status !== 6) ||
			(this.orderInvoiceId && (this.status === 6 && this.refundStatus))) && this.status !== 1 && this.orderType !== 3
    },
    isInvoice() {
      return !this.orderInvoiceId && this.status !== 6 && this.status !== 1 && this.orderType !== 3
    },
    isShowMore() {
      return (this.isViewInvoice || this.isInvoice) && this.canAllRefund && this.orderType != 3 && this.orderType == 1 && this.status > 1 && this.status !== 6
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.orderNum) {
      this.orderNumber = options.orderNum
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 加载导航标题
    uni.setNavigationBarTitle({
      title: this.i18n.orderDetails
    })
    this.loadOrderDetail(this.orderNumber) // 请求订单详情数据

    this.setData({
      isLastProd: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() { },
  methods: {
    handleMore() {
      this.showMore = true
    },
    showInvoicePopup(shopId, invoiceOrderNumber) {
      this.invoiceShopId = shopId
      this.invoiceOrderNumber = invoiceOrderNumber
      this.isShowInvoicePopup = true
      this.showMore = false
    },
    // 关闭弹窗
    closePopup() {
      this.isShowInvoicePopup = false
      this.showMore = false
    },
    getOrderDataList() {
      this.loadOrderDetail(this.orderNumber)
    },
    // 查看发票
    viewIinvoice(orderNumber, orderInvoiceId) {
      uni.navigateTo({
        url: `/package-user/pages/invoice-detail/invoice-detail?orderNumber=${orderNumber}&orderInvoiceId=${orderInvoiceId}`
      })
    },
    // 跳转商品详情页
    toProdDetail(prodId) {
      this.$Router.push({ path: '/package-prod/pages/prod/prod', query: { prodId }})
    },

    /**
   * 是否最后一个商品在执行单个商品退款事件
   */
    lastProdApplyRefund: function() {
      this.isLastProd = false
      if (this.status == 2) { // 待发货状态下
        // 遍历商品list
        if (this.orderItemDtos.length > 1) { // 如果商品列表长度大于1
          const sum = []
          this.orderItemDtos.forEach((el, index) => {
            if (el.refundSn) { // 如果拥有退款单号
              sum.push(el)
            }
          })
          if (sum.length == this.orderItemDtos.length - 1) {
            // 如果拥有退款单号的item等于商品列表数据长度-1，那么点击的这件商品就是最后一件商品
            this.setData({
              isLastProd: true
            })
          } else if (sum.length == this.orderItemDtos.length) {
            // 如果拥有退款单号的item等于商品列表数据长度，那么不可撤销申请
            this.setData({
              irrevocable: true // 不可撤销
            })
          }
        }
        if (this.orderItemDtos.length === 1) {
          this.isLastProd = true
        }
      }
    },

    /**
     * 申请退款
     */
    applyRefund: util.debounce(function(item, refundtype) {
      util.tapLog(3)
      // refundType 退款类型 1整单  2单个物品
      const status = this.status
      var type = this.status == 2 ? '1' : '2'
      this.loadOrderDetail(this.orderNumber) // 请求订单详情数据
      if (refundtype == 1) { // 整单退款
        var items = {}
        items.orderNumber = this.orderNumber
        items.actualTotal = this.actualTotal // 订单总额
        items.transfee = this.transfee // 订单运费
        items.freeTransfee = this.freeTransfee // 运费减免
        items.status = this.status // 订单状态
        items.orderItemDtos = this.orderItemDtos
        items.orderScore = this.orderScore // 整单青春豆
        items.canRefundAmount = this.canRefundAmount
        items.buyerMobile = this.dvyType === 2 ? this.stationUserMobile : this.userAddrDto ? this.userAddrDto.mobile : ''
        // 将数据存储到本地
        wx.setStorageSync('bbcRefundItem', items)
      } else if (refundtype == 2) { // 单个商品退款
        this.lastProdApplyRefund() // 是否最后一个商品执行单个商品退款
        if (this.orderItemDtos.length == 1) { // 是否只有一件商品
          item.isOnlyProd = true
        } else {
          item.isOnlyProd = false
        }
        // 将数据存储到本地
        item.orderNumber = this.orderNumber
        item.transfee = this.transfee // 本单运费
        item.freeTransfee = this.freeTransfee // 运费减免
        item.status = this.status // 订单状态
        item.isLastProd = this.isLastProd // 是否最后一款商品
        item.canRefundAmount = this.canRefundAmount
        // 虚拟商品
        if (this.orderMold === 1) {
          // 1.无需核销：允许用户选择退款数量（writeOffNum 0无需核销 -1多次核销 1单次核销）
          item.needWriteOffs = this.writeOffNum !== 0
          // 2.需要核销：展示最大可退款件数，不允许选择（最大可退款件数 = 待使用的核销券数）
          item.maxRefundPieces = this.unusedCount
        }
        item.buyerMobile = this.dvyType === 2 ? this.stationUserMobile : this.userAddrDto ? this.userAddrDto.mobile : ''
        // 拿到存储在本地的订单项数据
        wx.setStorageSync('bbcRefundItem', item)
      }
      /**  判断跳转页面（根据订单是否已发货）*/
      if (status == 2) {
        // 待发货，跳转到申请退款页面
        uni.navigateTo({
          url: `/package-refund/pages/apply-refund/apply-refund?type=${type}&refundType=${refundtype}`
        })
      } else { // 已发货，跳转到选择退货方式页
        // orderMold: 1虚拟商品订单（下单成功后订单状态status=3待收货）
        // 虚拟商品，直接跳转到申请页，不需要选择退货方式（默认为仅退款（type:1））
        const url = this.orderMold == 1
          ? `/package-refund/pages/apply-refund/apply-refund?type=1&refundType=${refundtype}&orderMold=${this.orderMold}`
          : `/package-refund/pages/choose-refund-way/choose-refund-way?refundType=${refundtype}`
        uni.navigateTo({
          // url: '/package-refund/pages/choose-refund-way/choose-refund-way?refundType=' + refundtype
          url: url
        })
      }
    }, 600),

    /**
     * 查看退款
     */
    viewRefund: function(e) {
      util.tapLog(3)
      var refundSn = e.currentTarget.dataset.refundsn
      this.lastProdApplyRefund() // 是否最后一个商品执行单个商品退款
      uni.navigateTo({
        url: '/package-refund/pages/details-of-refund/details-of-refund?refundSn=' + refundSn + '&irrevocable=' + this.irrevocable
      })
    },

    /**
     * 加载订单数据
     */
    loadOrderDetail: function(orderNum) {
      var ths = this
      const params = {
        url: '/p/myOrder/orderDetail',
        method: 'GET',
        data: {
          orderNumber: orderNum
        },
        callBack: function(res) {
          console.log(res)
          const isRefunding = res.orderItemDtos.findIndex(el => el.refundSn && el.returnMoneySts && el.returnMoneySts != 5) > -1
          ths.setData({
            isRefunding: isRefunding,
            shopId: res.shopId,
            orderNumber: orderNum,
            actualTotal: res.actualTotal,
            // 实际支付总额（商品总额+运费)
            userAddrDto: res.userAddrDto,
            remarks: res.remarks,
            orderItemDtos: res.orderItemDtos,
            createTime: res.createTime,
            status: res.status,
            productTotalAmount: res.total, // 商品总额
            transfee: res.transfee, // 运费
            // freeTransfee: res.freeTransfee,//运费减免
            reduceAmount: res.reduceAmount, // 总优惠
            orderType: Number(res.orderType),
            shopName: res.shopName,
            canRefund: res.canRefund,
            canAllRefund: res.canAllRefund,
            payType: res.payType,
            dvyType: res.dvyType, // 配送类型 1:快递 2:自提 3：无需快递
            orderScore: res.orderScore, // 整单使用青春豆
            // 当前订单可退款金额
            canRefundAmount: res.canRefundAmount,
            seckillId: res.seckillId,
            orderInvoiceId: res.orderInvoiceId,
            refundStatus: res.refundStatus,
            preSaleTime: res.preSaleTime, // 预售时间
            // 优惠明细
            freeTransfee: Math.abs(res.freeTransfee) || res.platformFreeFreightAmount, // 运费减免
            platformCouponAmount: res.platformCouponAmount, // 平台优惠券优惠金额
            scoreAmount: res.scoreAmount, // 青春豆抵扣
            memberAmount: res.memberAmount, // 会员折扣
            shopCouponMoney: res.shopCouponMoney, // 店铺优惠券
            discountMoney: res.discountMoney, // 促销满减
            shopComboAmount: res.shopComboAmount, // 套餐优惠
            shopAmount: res.shopAmount, // 店铺优惠总额
            shopChangeFreeAmount: res.shopChangeFreeAmount, // 商家改价

            orderMold: res.orderMold, // 1虚拟商品
            virtualInfoList: res.virtualInfoList, // 券码
            virtualRemark: res.virtualRemark ? JSON.parse(res.virtualRemark) : [], // 留言
            writeOffNum: res.writeOffNum, // 核销次数 -1多次 0无需核销 1单次核销
            writeOffStart: res.writeOffStart, // 核销有效期开始时间
            writeOffEnd: res.writeOffEnd // 核销有效期结束时间（仅有开始时间没有结束时间标识长期有效）
          })
          if (res.writeOffEnd) {
            const writeOffEndTime = new Date(res.writeOffEnd).getTime()
            const nowTime = new Date().getTime()
            if (nowTime > writeOffEndTime) { ths.isExpired = true }
          }
          if (res.dvyType == 2) {
            ths.loadStationDetail(orderNum)
          }

          // 虚拟商品-待使用的券总数
          ths.handleUnusedVirtualCode(res.virtualInfoList)

          // 虚拟商品留言处理
          ths.handlevirtualRemark()
        }
      }
      http.request(params)
    },

    // 虚拟商品-待使用的券总数
    handleUnusedVirtualCode(list) {
      if (list && list.length) {
        let unusedCount = 0
        list.forEach(el => {
          if (el.isWriteOff === 0) {
            unusedCount = unusedCount + 1
          }
        })
        this.unusedCount = unusedCount
      }
    },

    // 虚拟商品-留言列表处理
    handlevirtualRemark() {
      if (this.virtualRemark && this.virtualRemark.length) {
        // 过滤掉没有填写的留言
        this.virtualRemark = this.virtualRemark.filter(el => el.value)
        var virtualRemarkList = []
        let virtualRemarks = []
        // 如果留言总数大于3条，先展示前一条（完整留言在弹窗中展示）
        if (this.virtualRemark.length > 3) {
          const list = JSON.parse(JSON.stringify(this.virtualRemark))
          virtualRemarks = list.splice(0, 1)
          this.isExtraLong = true
        } else {
          virtualRemarks = this.virtualRemark
          this.isExtraLong = false
        }
        // 全部留言拼接
        virtualRemarks.forEach((el) => {
          virtualRemarkList.push([el.name, el.value])
        })
        if (this.isExtraLong) {
          this.virtualRemarkList = virtualRemarkList.push('......')
        } else {
          this.virtualRemarkList = virtualRemarkList
        }
      }
    },

    // 查看留言弹窗
    showViewMsgPopup: function() {
      if (this.isExtraLong) {
        this.showViewMsg = true
      }
    },
    closeMsgPopup: function() {
      this.showViewMsg = false
    },

    /**
     * 加载订单详情自提信息
     */
    loadStationDetail: function(orderNum) {
      const params = {
        url: '/p/myStationOrder/stationDetail',
        method: 'GET',
        data: {
          orderNumber: orderNum
        },
        callBack: (res) => {
          this.id = res.id // 自提信息id
          this.stationAddress = res.stationAddress // 自提点的地址
          this.stationCode = res.stationCode // 提货码
          this.stationId = res.stationId // 自提点id
          this.stationPhone = res.stationPhone // 自提点的联系电话
          this.stationTime = res.stationTime // 自提时间(用户下单时选择)
          this.stationUserMobile = res.stationUserMobile // 自提人的手机
          this.stationUserName = res.stationUserName // 自提人的名字
          this.stationName = res.stationName // 自提点名称
          this.lat = this.bMapTransQQMap(res.lng, res.lat).lat // 纬度
          this.lng = this.bMapTransQQMap(res.lng, res.lat).lng // 经度
          // console.log(this.lat, this.lng, 'sda')
          this.getQrcode(this.stationCode)
        }
      }
      http.request(params)
    },

    /**
     * 拨打自提点电话
     */
    callStation: function() {
      util.tapLog(3)
      uni.makePhoneCall({
        // 手机号
        phoneNumber: this.stationPhone,
        // 成功回调
        success: (res) => {
        },
        // 失败回调
        fail: (res) => {
        }
      })
    },

    // 将百度地图经纬度转换为腾讯/高德地图经纬度
    bMapTransQQMap: function(lng, lat) {
      const x_pi = 3.14159265358979324 * 3000.0 / 180.0
      const x = lng - 0.0065
      const y = lat - 0.006
      const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
      const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
      const lngs = z * Math.cos(theta)
      const lats = z * Math.sin(theta)
      return {
        lng: lngs,
        lat: lats
      }
    },

    /**
     * 打开地图
     */
    openMap: function() {
      util.tapLog(3)
      var ths = this
      // console.log('success', ths.lat, ths.lng)
      uni.openLocation({
        latitude: Number(ths.lat),
        longitude: Number(ths.lng),
        success: function() {
        }
      })
    },

    /**
     * 生成二维码
     */
    getQrcode: function(stationCode) {
      this.stationQrCode = Qr.createQrCodeImg(stationCode)
    },

    /**
     * 一键复制事件
     */
    copyText(text) {
      uniCopy({
        content: text,
        success: (res) => {
          uni.showToast({
            title: res,
            icon: 'none'
          })
        },
        error: (e) => {
          uni.showToast({
            title: e,
            icon: 'none',
            duration: 3000
          })
        }
      })
    },

    // 查看提货凭证
    viewCertificate() {
      util.tapLog(3)
      var cont = {
        stationCode: this.stationCode, // 提货码
        stationAddress: this.stationAddress, // 自提点的地址
        stationPhone: this.stationPhone, // 自提点的联系电话
        stationTime: this.stationTime, // 自提时间(用户下单时选择)
        orderNumber: this.orderNumber, // 订单编号
        stationName: this.stationName
      }
      uni.setStorageSync('bbcStationCont', cont)
      uni.navigateTo({
        url: '/package-user/pages/delivery-certificate/delivery-certificate?orderNumber=' + this.orderNumber
      })
    },
    /**
     * 查看团购详情
     */
    toGroupDetails() {
      util.tapLog(3)
      uni.navigateTo({
        url: '/package-activities/pages/spell-group-details/spell-group-details?orderNumber=' + this.orderNumber
      })
    },

    /**
     * 咨询客服
     */
    handleCustomService() {
      // console.log(this.shopId)
      util.checkAuthInfo(() => {
        uni.navigateTo({
          url: '/package-user/pages/chat/chat-im?shopId=' + (this.shopId ? this.shopId : '0') + '&orderNumber=' + this.orderNumber
        })
      })
    },

    /**
     * 查看券码（虚拟商品）
     */
    toViewVoucherCodePage() {
      if (this.isExpired) {
        uni.showToast({
          title: this.i18n.voucherCode + this.i18n.expired,
          icon: 'none'
        })
        return
      }
      if (!this.unusedCount) {
        uni.showToast({
          title: this.i18n.voucherCode + this.i18n.hasBeenUsed,
          icon: 'none'
        })
        return
      }
      const voucherCodeInfo = {
        // 订单编号
        orderNumber: this.orderNumber,
        // 商品信息
        orderItemDtos: this.orderItemDtos,
        // 实付金额
        actualTotal: this.actualTotal,
        // 虚拟商品-券码列表
        virtualInfoList: this.virtualInfoList,
        // 虚拟商品-有效期
        writeOffStart: this.writeOffStart,
        writeOffEnd: this.writeOffEnd
      }
      uni.setStorageSync('bbcVoucherCodeInfo', voucherCodeInfo)
      uni.navigateTo({
        url: '/package-user/pages/voucher-code/voucher-code'
      })
    },
    /**
     * 图片加载失败时显示默认图片
     */
    handlePicError(item) {
      this.$set(item, 'isPicError', true)
    },
    // 格式化时间
    tsToDate(data) {
      return util.tsToDate(data.replace(/\-/g, '/'), 'Y-M-D')
    }
  }
}
</script>
<style>
@import "./order-detail.css";
</style>
