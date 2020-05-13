import React, { Suspense } from 'react';
import { Col, Row } from 'antd';
const Print = React.lazy(() => import('./components/product_print'));
const Paper = React.lazy(() => import('./components/product_paper'));

export default () => {
  return (
    <Row gutter={24}>
      <Col xl={12} lg={24} md={24} sm={24} xs={24}>
        <Suspense fallback={null}>
          <Print />
        </Suspense>
      </Col>
      <Col xl={12} lg={24} md={24} sm={24} xs={24}>
        <Suspense fallback={null}>
          <Paper />
        </Suspense>
      </Col>
    </Row>
  );
};
