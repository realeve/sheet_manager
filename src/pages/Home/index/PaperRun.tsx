import React, { Suspense } from 'react';
import { Col, Row, Tabs } from 'antd';
const PaperStop = React.lazy(() => import('./components/paper_stop'));
const PaperRun = React.lazy(() => import('./components/paper_run'));
import style from './index.less';

export default () => {
  return (
    <Row gutter={24} style={{ marginBottom: 24 }}>
      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
        <Suspense fallback={null}>
          <Tabs defaultActiveKey="1" type="line" className={style.tabs}>
            <Tabs.TabPane tab="纸机运行情况" key="1">
              <PaperRun />
            </Tabs.TabPane>
            <Tabs.TabPane tab="纸机停机原因" key="2">
              <PaperStop />
            </Tabs.TabPane>
          </Tabs>
        </Suspense>
      </Col>
    </Row>
  );
};
