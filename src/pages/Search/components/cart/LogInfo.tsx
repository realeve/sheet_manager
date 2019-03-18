import React from 'react';
import { Col, Card, Tabs } from 'antd';
import { useFetch } from '@/pages/Search/utils/useFetch';
import VTable from '@/components/Table';
const TabPane = Tabs.TabPane;

export default function LogInfo({ cart }) {
  const res1 = useFetch({ params: cart, api: 'getQfmWipJobsMahouSrc', init: [cart] });
  const res2 = useFetch({ params: cart, api: 'getQfmWipJobsCodeFake', init: [cart] });
  const res3 = useFetch({ params: cart, api: 'getWipJobsCodeSrc', init: [cart] });
  const res4 = useFetch({ params: cart, api: 'getOcrContrastResult', init: [cart] });
  const res5 = useFetch({ params: cart, api: 'getQfmWipJobsLeak', init: [cart] });
  const res6 = useFetch({ params: cart, api: 'getQfmWipJobsSilk', init: [cart] });
  const res7 = useFetch({ params: cart, api: 'getQfmWipJobsUncheck', init: [cart] });

  let showSilk = cart && cart[2] === '8';

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
          <TabPane tab="大张未检查询" key="7">
            <VTable dataSrc={res7} loading={res7.loading} {...defaultTableSetting} />
          </TabPane>
          <TabPane tab="人工漏判" key="1">
            <VTable dataSrc={res5} loading={res5.loading} {...defaultTableSetting} />
          </TabPane>
          <TabPane tab="票面原始记录" key="2">
            <VTable dataSrc={res1} loading={res1.loading} {...defaultTableSetting} />
          </TabPane>
          <TabPane tab="印码大张废" key="3">
            <VTable dataSrc={res2} loading={res2.loading} {...defaultTableSetting} />
          </TabPane>
          <TabPane tab="号码三合一" key="4">
            <VTable dataSrc={res3} loading={res3.loading} {...defaultTableSetting} />
          </TabPane>
          <TabPane tab="OCR识码原始记录" key="5">
            <VTable dataSrc={res4} loading={res4.loading} {...defaultTableSetting} />
          </TabPane>
          {showSilk && (
            <TabPane tab="丝印判废" key="6">
              <VTable dataSrc={res6} loading={res6.loading} {...defaultTableSetting} />
            </TabPane>
          )}
        </Tabs>
      </Card>
    </Col>
  );
}
