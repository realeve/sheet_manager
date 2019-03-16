import React, { useState, useEffect } from 'react';
import { Col, Card, Tabs } from 'antd';
import * as db from '../../db';
import SimpleTable from '../SimpleTable';
const TabPane = Tabs.TabPane;

export default function OnlineCount({ cart }) {
  const [state, setState] = useState({ rows: 0 });
  const [loading, setLoading] = useState(false);

  let loadData = async () => {
    setLoading(true);
    let res = await db.getQmRectifyMaster(cart);
    setState(res);
    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, [cart]);

  const [showSilk, setShowSilk] = useState(false);
  useEffect(() => {
    // 显示丝印
    setShowSilk(cart[2] === '8');
  }, [cart]);

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
