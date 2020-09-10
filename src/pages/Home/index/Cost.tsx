import React, { Suspense } from 'react';
import { Col, Row } from 'antd';
const Cost = React.lazy(() => import('./components/cost'));

export default () => {
  return (
    <>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            <Cost proc_name={0}/>
          </Suspense>
        </Col>
      </Row>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            <Cost proc_name={1} />
          </Suspense>
        </Col>
      </Row>
    </>
  );
};
