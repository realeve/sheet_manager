import React, { Suspense } from 'react';
import { Col, Row } from 'antd';
const Print = React.lazy(() => import('./components/machine_print'));

export default () => {
  return (
    <Row gutter={24} style={{ marginBottom: 24 }}>
      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
        <Suspense fallback={null}>
          <Print />
        </Suspense>
      </Col>
    </Row>
  );
};
