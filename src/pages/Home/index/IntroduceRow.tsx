import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import React from 'react';
import numeral from 'numeral';
import { ChartCard, Field, Yuan } from '../components/';
import { VisitDataType } from '../data';
// MiniArea,MiniProgress,
import PrintComplete from './card/print_complete';
import PaperProdNum from './card/paper_complete';
import useFetch from '@/components/hooks/useFetch';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const Income = ({ url = '/1013/a33ed9f4ec.json', title = '销售收入' }) => {
  const { data, error, loading } = useFetch({
    param: {
      url,
    },
  });

  return (
    <ChartCard
      bordered={false}
      title={`${title}(截至${data?.data[0]?.prod_date})`}
      action={
        <Tooltip title="数据来源：财务报表系统">
          <InfoCircleOutlined />
        </Tooltip>
      }
      loading={loading}
      total={() => data && <Yuan>{data.data[0].year_total}</Yuan>}
      footer={
        data && (
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Field
              label={data.data[1].type_desc}
              value={numeral(data.data[1].year_total).format('0,0')}
            />
            <Field
              label={data.data[2].type_desc}
              value={numeral(data.data[2].year_total).format('0,0')}
            />
          </div>
        )
      }
      contentHeight={46}
    ></ChartCard>
  );
};

const IntroduceRow = ({ visitData }: { visitData: VisitDataType[] }) => (
  <Row gutter={24} type="flex">
    <Col {...topColResponsiveProps}>
      <Income />
    </Col>

    <Col {...topColResponsiveProps}>
      <Income url="/1014/0af41299ce.json" title="利润总额" />
    </Col>
    <PrintComplete />
    <PaperProdNum />
  </Row>
);

export default IntroduceRow;
