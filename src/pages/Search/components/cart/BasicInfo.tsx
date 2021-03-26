import React, { useState } from 'react';
import { Col, Tabs, Card } from 'antd';
import ProdList from './ProdList';
import CartInfo from './CartInfo';
import LockReason from './LockReason';
import CartsOneDay from './CartsOneDay';
import ProcAdjustList from './ProcAdjustList';
import * as lib from '../../utils/lib';
import * as R from 'ramda';
import StorageLog from './StorageLog';
import CountLog from './CountLog';
import ReelInfo from './ReelInfo/index';

const TabPane = Tabs.TabPane;

export default function SearchPage({ onRefresh, ...params }) {
  const [cartInfo, setCartInfo] = useState({});
  const { cart, type } = params;
  const updateCartInfo = cartInfo => {
    if (R.isNil(cartInfo.CartNumber)) {
      return;
    }
    setCartInfo(cartInfo);
    onRefresh({
      type: 'cart',
      cart: cartInfo.CartNumber,
      codeInfo: lib.convertCodeInfo(cartInfo.GzNumber),
      prod: cartInfo.ProductName,
    });
  };
  let visible = type == 'cart';

  return (
    <>
      <Col span={16} lg={16} md={24} sm={24} xs={24}>
        <Card
          hoverable
          bodyStyle={{
            padding: '10px 20px',
          }}
          style={{ marginBottom: 10 }}
        >
          <Tabs defaultActiveKey="1" animated={false}>
            <TabPane tab="生产原始记录" key="1">
              <ProdList {...params} onRefresh={updateCartInfo} />
            </TabPane>
            <TabPane tab="产品物流记录" key="2">
              <StorageLog cart={cart} />
            </TabPane>
            <TabPane tab="大张过数记录" key="3">
              <CountLog cart={cart} />
            </TabPane>
            <TabPane tab="成品装箱记录" key="4">
              <ReelInfo cart={cart} />
            </TabPane>
          </Tabs>
        </Card>
        {visible && <ProcAdjustList cart={cart} />}
      </Col>
      <Col span={8} lg={8} md={24} sm={24} xs={24}>
        <CartInfo cartInfo={cartInfo} cart={cart} />
        {visible && (
          <>
            <LockReason cart={cart} />
            <CartsOneDay cart={cart} />
          </>
        )}
      </Col>
    </>
  );
}
