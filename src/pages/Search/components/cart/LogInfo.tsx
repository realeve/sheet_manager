import React, { useState, useEffect } from 'react';
import { Col, Card, Tabs } from 'antd';
import * as db from '../../db';
import VTable from '@/components/Table';
const TabPane = Tabs.TabPane;

export default function OnlineCount({ cart }) {
  const [state, setState] = useState({ rows: 0 });
  const [loading, setLoading] = useState(false);

  // let loadData = async () => {
  //   setLoading(true);
  //   let res = await db.getQmRectifyMaster(cart);
  //   setState(res);
  //   setLoading(false);
  // };
  // useEffect(() => {
  //   loadData();
  // }, [cart]);

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
          <TabPane tab="漏废记录分析" key="1">
            1
          </TabPane>
          <TabPane tab="1.票面判废" key="2">
            2
          </TabPane>
          <TabPane tab="2.印码大张废" key="3">
            3
          </TabPane>
          <TabPane tab="3.号码三合一" key="4">
            4
          </TabPane>
          <TabPane tab="4.OCR识码原始记录" key="5">
            5
          </TabPane>
          {showSilk && <TabPane tab="5.丝印判废" key="6" />}
        </Tabs>
      </Card>
    </Col>
  );
}
