import React from 'react';
import { Col, Card, Tabs } from 'antd';
import SimpleTable from '../SimpleTable';
import { useFetch } from '@/pages/Search/utils/useFetch';
const TabPane = Tabs.TabPane;

export default function OnlineCount({ cart }) {
  const { loading, ...state } = useFetch({ params: cart, api: 'getQmRectifyMaster' });
  let showSilk = cart[2] === '8';

  return (
    <Col span={24}>
      <Card
        hoverable
        bodyStyle={{
          padding: '10px 20px',
        }}
        style={{ marginBottom: 10 }}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="在线清数情况" key="1">
            <SimpleTable data={state} loading={loading} />
          </TabPane>
          <TabPane tab="印码识码原始记录" key="2" />
          {showSilk && <TabPane tab="丝印识码原始记录" key="3" />}
        </Tabs>
      </Card>
    </Col>
  );
}
