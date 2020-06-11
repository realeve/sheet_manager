import React, { Suspense } from 'react';
import { Col, Row, Tabs } from 'antd';
const Print = React.lazy(() => import('./components/fake_print'));

import style from './index.less';

export default () => {
  return (
    <Row gutter={24} style={{ marginBottom: 24 }}>
      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
        <Suspense fallback={null}>
          <Tabs defaultActiveKey="1" type="line" className={style.tabs}>
            <Tabs.TabPane tab="作废类型" key="1">
              <Print />
            </Tabs.TabPane>
            <Tabs.TabPane tab="印刷设备" key="2">
              <Print title="设备月度作废小开数" url="1016/a1776b3624" />
            </Tabs.TabPane>
          </Tabs>
        </Suspense>
      </Col>
    </Row>
  );
};
