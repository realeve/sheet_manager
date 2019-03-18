import React from 'react';
import { Col, Card, Tabs } from 'antd';
import SimpleTable from '../SimpleTable';
import { useFetch } from '@/pages/Search/utils/useFetch';
import VTable from '@/components/Table';
const TabPane = Tabs.TabPane;

export default function OnlineCount({ cart }) {
  const res1 = useFetch({ params: cart, api: 'getQmRectifyMaster', init: [cart] });
  const res2 = useFetch({ params: cart, api: 'getWipJobsRectifyCode', init: [cart] });

  const defaultTableSetting = {
    simple: true,
    pagesize: 10,
  };

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
            <SimpleTable data={res1} loading={res1.loading} />
          </TabPane>
          <TabPane tab="印码识码原始记录" key="2">
            <VTable dataSrc={res2} loading={res2.loading} {...defaultTableSetting} />
          </TabPane>
        </Tabs>
      </Card>
    </Col>
  );
}
