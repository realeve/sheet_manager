import React, { useState, useEffect } from 'react';
import { Col, Card, Tabs } from 'antd';
import * as db from '../../db';
import VTable from '@/components/Table';
const TabPane = Tabs.TabPane;

export default function OffineCheck({ cart }) {
  const [offset, setOffset] = useState({});
  const [intag, setIntag] = useState({});
  const [loading, setLoading] = useState(false);
  let loadData = async () => {
    setLoading(true);
    let res2 = await db.getViewScoreIntaglio(cart);
    setOffset(res2);
    let res1 = await db.getViewScoreOffset(cart);
    setIntag(res1);
    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, [cart]);

  return (
    <Col span={24}>
      <Card
        hoverable
        bodyStyle={{
          padding: '20px 20px 10px 20px',
        }}
        style={{ marginBottom: 10 }}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="胶印离线检测" key="1">
            <VTable dataSrc={offset} loading={loading} simple={true} pagesize={5} />
          </TabPane>
          <TabPane tab="凹印离线检测" key="2">
            <VTable dataSrc={intag} loading={loading} simple={true} pagesize={5} />
          </TabPane>
        </Tabs>
      </Card>
    </Col>
  );
}
