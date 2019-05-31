import React from 'react';
import SimpleTable from '../SimpleTable';
import { Card, Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import { useFetch } from '@/pages/Search/utils/useFetch';

export default function ExchangeLog({ cart }) {
  const state = useFetch({ params: cart, api: 'getUdtPsExchange', init: [cart] });
  // 检封工序
  const packageInfo = useFetch({ params: cart, api: 'getQmRectifyMasterChange', init: [cart] });

  return (
    <Card
      hoverable
      bodyStyle={{
        padding: '10px 20px',
      }}
      style={{ marginBottom: 10 }}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="胶凹工序大张兑换记录" key="1">
          <div style={{ height: 240, overflowY: 'auto' }}>
            <SimpleTable data={packageInfo} loading={packageInfo.loading} />
          </div>
        </TabPane>
        <TabPane tab="印码大张及检封小开兑换记录" key="2">
          <div style={{ height: 240, overflowY: 'auto' }}>
            <SimpleTable data={state} loading={state.loading} />
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
} 