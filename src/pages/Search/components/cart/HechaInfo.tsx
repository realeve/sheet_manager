import React from 'react';
import { Col, Card, Tabs } from 'antd';
import CodeInfo from './CodeInfo';
import MahouInfo from './MahouInfo';

const TabPane = Tabs.TabPane;

export default function HechaInfo({ cart }) {
  return (
    <Col span={24}>
      <Card
        hoverable
        bodyStyle={{
          padding: '10px 20px',
        }}
        style={{ marginBottom: 10 }}
      >
        <Tabs defaultActiveKey="1" animated={false}>
          <TabPane tab="码后汇总" key="1">
            <MahouInfo cart={cart} />
          </TabPane>
          <TabPane tab="号码判废" key="2">
            <Col span={12}>
              <CodeInfo cart={cart} />
            </Col>
          </TabPane>
        </Tabs>
      </Card>
    </Col>
  );
}
