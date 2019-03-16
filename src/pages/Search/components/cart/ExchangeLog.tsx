import React, { useState, useEffect } from 'react';
import * as db from '../../db';
import SimpleTable from '../SimpleTable';
import { Card, Tabs } from 'antd';
const TabPane = Tabs.TabPane;

export default function OffineCheck({ cart }) {
  const [state, setState] = useState({ rows: 0 });
  const [loading, setLoading] = useState(false);

  let loadData = async () => {
    setLoading(true);
    let res = await db.getUdtPsExchange(cart);
    setState(res);
    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, [cart]);

  // 检封工序
  const [packageInfo, setPackageInfo] = useState({ rows: 0, data: [], header: [] });
  let loadPackage = async () => {
    setLoading(true);
    let res = await db.getQmRectifyMasterChange(cart);
    setPackageInfo(res);
    setLoading(false);
  };
  useEffect(() => {
    loadPackage();
  }, [cart]);

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
            <SimpleTable data={packageInfo} loading={loading} />
          </div>
        </TabPane>
        <TabPane tab="印码大张及检封小开兑换记录" key="2">
          <div style={{ height: 240, overflowY: 'auto' }}>
            <SimpleTable data={state} loading={loading} />
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
}
