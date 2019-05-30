import React, { useState } from 'react';
import { Col, Tabs, Card } from 'antd';
import ProdList from './ProdList';
import CartInfo from './CartInfo';
import LockReason from './LockReason';
import CartsOneDay from './CartsOneDay';
import ExchangeLog from './ExchangeLog';
import ProcAdjustList from './ProcAdjustList';
import * as lib from '../../utils/lib';
import * as R from 'ramda';
import StorageLog from './StorageLog'

const TabPane = Tabs.TabPane;

export default function SearchPage({ onRefresh, ...params }) {
  const [cartInfo, setCartInfo] = useState({});
  const { cart, type } = params;
  const updateCartInfo = cartInfo => {
    if (R.isNil(cartInfo.CartNumber)) {
      return;
    }
    setCartInfo(cartInfo);
    // 车号变更时向父组件更新
    // if (cart !== cartInfo.CartNumber) {
    //   // 传至父组件 
    //   onRefresh({
    //     type: 'cart',
    //     cart: cartInfo.CartNumber,
    //     codeInfo: lib.convertCodeInfo(cartInfo.GzNumber),
    //     prod: cartInfo.ProductName
    //   });
    // } 

    onRefresh({
      type: 'cart',
      cart: cartInfo.CartNumber,
      codeInfo: lib.convertCodeInfo(cartInfo.GzNumber),
      prod: cartInfo.ProductName
    });
  };
  let visible = type == 'cart';

  return (<>
    <Col span={16} lg={16} md={24} sm={24} xs={24}>
      <Card
        hoverable
        bodyStyle={{
          padding: '10px 20px',
        }}
        style={{ marginBottom: 10 }}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="生产原始记录" key="1">
            <ProdList {...params} onRefresh={updateCartInfo} />
          </TabPane>
          <TabPane tab="产品物流记录" key="2">
            <StorageLog cart={cart} />
          </TabPane>
        </Tabs>
      </Card>
      {visible && <ProcAdjustList cart={cart} />}
    </Col>
    <Col span={8} lg={8} md={24} sm={24} xs={24}>
      <CartInfo cartInfo={cartInfo} />
      {visible && (
        <>
          <LockReason cart={cart} />
          <ExchangeLog cart={cart} />
          <CartsOneDay cart={cart} />
        </>
      )}
    </Col>
  </>
  );
}
