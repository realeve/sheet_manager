import React from 'react';
import { Col, Card, Tabs } from 'antd';
import { useFetch } from '@/pages/Search/utils/useFetch';
import VTable from '@/components/Table';
const TabPane = Tabs.TabPane;

export default function OffineCheck({ cart }) {
  const { loading, ...offset } = useFetch({ params: cart, api: 'getViewScoreOffset' });
  const { loading: loading2, ...intag } = useFetch({ params: cart, api: 'getViewScoreIntaglio' });

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
          <TabPane tab="胶印离线检测" key="1">
            <VTable dataSrc={offset} loading={loading} simple={true} pagesize={5} />
          </TabPane>
          <TabPane tab="凹印离线检测" key="2">
            <VTable dataSrc={intag} loading={loading2} simple={true} pagesize={5} />
          </TabPane>
        </Tabs>
      </Card>
    </Col>
  );
}
