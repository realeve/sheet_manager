import React from 'react';
import { Col, Card, Tabs } from 'antd';
import SimpleTable from '../SimpleTable';
import VTable from '@/components/Table';
import { useFetch } from '@/pages/Search/utils/useFetch';

const TabPane = Tabs.TabPane;

export default function PackageInfo({ cart }) {
  const { loading, ...state } = useFetch({ params: cart, api: 'getViewPrintOcr', init: [cart] });
  const { loading: loading2, ...ananyData } = useFetch({
    params: cart,
    api: 'getNoteaysdata',
    init: [cart],
  });

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
              loading={loading2}
              beforeRender={beforeRender}
              simple={true}
              pagesize={5}
            />
          </TabPane>
          {/* <TabPane tab="装箱记录" key="3" /> */}
        </Tabs>
      </Card>
    </Col>
  );
}
