import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import React from 'react';
import numeral from 'numeral';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field, Yuan, Trend } from '../components/';
import { VisitDataType } from '../data';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = ({ loading, visitData }: { loading: boolean; visitData: VisitDataType[] }) => (
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
        loading={loading}
        total={() => <Yuan>12656023</Yuan>}
        footer={<Field label="完成率" value={`47.3%`} />}
        contentHeight={46}
      >
        <MiniProgress percent={47.3} strokeWidth={8} target={50} />
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="利润"
        action={
          <Tooltip title="数据来源：财务报表系统">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={() => <Yuan>6522198</Yuan>}
        footer={<Field label="完成率" value={`42.8%`} />}
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={visitData} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="本月印钞产量(五月)"
        action={
          <Tooltip title="数据来源：MES系统">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(2133).format('0,0')}
        footer={<Field label="1-5月累计产量" value={numeral(41378).format('0,0')} />}
        contentHeight={46}
      >
        <MiniBar data={visitData} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title="本月钞纸产量(五月)"
        action={
          <Tooltip title="数据来源：MES系统">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(1265).format('0,0')}
        footer={<Field label="1-5月累计产量" value={numeral(4096).format('0,0')} />}
        contentHeight={46}
      >
        <MiniArea line data={visitData} borderColor="#13C2C2" />
      </ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;
