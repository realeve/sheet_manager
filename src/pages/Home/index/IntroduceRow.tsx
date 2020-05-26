import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import React from 'react';
import { ChartCard, MiniArea, MiniProgress, Field, Yuan } from '../components/';
import { VisitDataType } from '../data';

import PrintComplete from './card/print_complete';
import PaperProdNum from './card/paper_complete';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = ({ visitData }: { visitData: VisitDataType[] }) => (
  <Row gutter={24} type="flex">
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="销售收入"
        action={
          <Tooltip title="数据来源：财务报表系统">
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={false}
        total={() => <Yuan>464950088</Yuan>}
        footer={<Field label="完成率" value={`27.3%`} />}
        contentHeight={46}
      >
        <MiniProgress percent={27.3} strokeWidth={8} target={50} />
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={false}
        title="利润"
        action={
          <Tooltip title="数据来源：财务报表系统">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={() => <Yuan>73675984.37</Yuan>}
        footer={<Field label="完成率" value={`22.8%`} />}
        contentHeight={46}
      >
        <MiniProgress percent={22.8} color="#975FE4" strokeWidth={8} target={50} />
        {/* <MiniArea color="#975FE4" data={visitData} /> */}
      </ChartCard>
    </Col>
    <PrintComplete />
    <PaperProdNum />
  </Row>
);

export default IntroduceRow;
