import React from 'react';
import { Col, Card } from 'antd';
import Reel2Cart from '../cart/ReelInfo/Reel2Cart';
import Cart from './chart';

export default function PackageInfo({ reel }) {
  return (
    <Col span={24}>
      <Card
        title={`成品装箱记录`}
        bodyStyle={{
          padding: '10px 20px',
        }}
        hoverable
        style={{ marginBottom: 10 }}
      >
        <Cart reel={reel} />
        <Reel2Cart reel={reel} />
      </Card>
    </Col>
  );
}
