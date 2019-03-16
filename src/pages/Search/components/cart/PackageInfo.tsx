import React, { useState, useEffect } from 'react';
import { Col, Card, Tabs } from 'antd';
import * as db from '../../db';
import SimpleTable from '../SimpleTable';
import VTable from '@/components/Table';

const TabPane = Tabs.TabPane;

export default function HechaInfo({ cart }) {
  const [state, setState] = useState({ rows: 0 });
  const [loading, setLoading] = useState(false);
  let loadData = async () => {
    setLoading(true);
    let res = await db.getViewPrintOcr(cart);
    setState(res);
    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, [cart]);

  const [ananyData, setAnanyData] = useState({ data: [], rows: [] });
  let loadAnayData = async () => {
    setLoading(true);
    let res = await db.getNoteaysdata(cart);
    setAnanyData(res);
    setLoading(false);
  };
  useEffect(() => {
    loadAnayData();
  }, [cart]);

  const beforeRender = option =>
    option.map(item => {
      Reflect.deleteProperty(item, 'sorter');
      Reflect.deleteProperty(item, 'filters');
      Reflect.deleteProperty(item, 'filteredValue');
      return item;
    });

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
          <TabPane tab="OCR汇总" key="1">
            <SimpleTable data={state} loading={loading} />
          </TabPane>
          <TabPane tab="特抽信息" key="2">
            <VTable
              dataSrc={ananyData}
              loading={loading}
              beforeRender={beforeRender}
              simple={true}
              pagesize={5}
            />
          </TabPane>
          <TabPane tab="装箱记录" key="3" />
        </Tabs>
      </Card>
    </Col>
  );
}
