import React, { useState } from 'react';
import { Col } from 'antd';
import ProdList from './ProdList';
import CartInfo from './CartInfo';
import LockReason from './LockReason';
import CartsOneDay from './CartsOneDay';
import ExchangeLog from './ExchangeLog';
import ProcAdjustList from './ProcAdjustList';

import * as R from 'ramda';
export default function SearchPage({ onRefresh, ...params }) {
  const [cartInfo, setCartInfo] = useState({});
  const { cart } = params;
  const updateCartInfo = cartInfo => {
    if (R.isNil(cartInfo.CartNumber)) {
      return;
    }
    setCartInfo(cartInfo);

    // 车号变更时向父组件更新
    if (cart !== cartInfo.CartNumber) {
      // 传至父组件
      onRefresh({
        type: 'cart',
        cart: cartInfo.CartNumber,
      });
    }
  };
  return (
    <>
      <Col span={16} lg={16} md={24} sm={24} xs={24}>
        <ProdList {...params} onRefresh={updateCartInfo} />
        <ProcAdjustList cart={cart} />
      </Col>
      <Col span={8} lg={8} md={24} sm={24} xs={24}>
        <CartInfo cartInfo={cartInfo} />
        <LockReason cart={cart} />
        <ExchangeLog cart={cart} />
        <CartsOneDay cart={cart} />
      </Col>
    </>
  );
}
