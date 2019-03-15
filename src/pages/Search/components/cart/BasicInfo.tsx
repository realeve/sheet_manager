import React, { useState } from 'react';
import { Col } from 'antd';
import ProdList from './ProdList';
import CartDetail from './CartInfo';
import LockReason from './LockReason';
import CartsOneDay from './CartsOneDay';
import ExchangeLog from './ExchangeLog';

export default function SearchPage({ cart, onRefresh }) {
  const [cartInfo, setCartInfo] = useState({});

  const updateCartInfo = cartInfo => {
    setCartInfo(cartInfo);
    // 传至父组件
    onRefresh(cartInfo.CartNumber);
  };
  return (
    <>
      <Col span={16} lg={16} md={24} sm={24} xs={24}>
        <ProdList cart={cart} onRefresh={updateCartInfo} />
        <ExchangeLog cart={cart} />
      </Col>
      <Col span={8} lg={8} md={24} sm={24} xs={24}>
        <CartDetail cartInfo={cartInfo} />
        <LockReason cart={cart} />
        <CartsOneDay cart={cart} />
      </Col>
    </>
  );
}
