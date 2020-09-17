import React, { Suspense } from 'react';
import { Col, Row, Tabs } from 'antd';
const Print = React.lazy(() => import('./components/product_print'));
const Paper = React.lazy(() => import('./components/product_paper'));
const Pay = React.lazy(() => import('./components/pay_print'));
const Plan = React.lazy(() => import('./components/product_plan'));

const PrintComplete = React.lazy(()=>import('./components/PrintComplete'))

export default () => {
  return (
    <>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            <Plan />
          </Suspense>
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            <Pay />
          </Suspense>
        </Col>
      </Row>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Tabs defaultActiveKey="1" type="line">
            <Tabs.TabPane tab="月度计划完成率-印钞" key="1">
              <Print />
            </Tabs.TabPane>
            <Tabs.TabPane tab="月度计划完成率-钞纸" key="2">
              <Paper />
            </Tabs.TabPane>
          </Tabs>
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <PrintComplete/>
        </Col>
      </Row>
    </>
  );
};
