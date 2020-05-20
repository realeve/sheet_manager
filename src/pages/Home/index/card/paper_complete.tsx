import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Tooltip } from 'antd';
import React from 'react';
import numeral from 'numeral';
import { ChartCard, MiniArea, Field } from '../../components/';
import useFetch from '@/components/hooks/useFetch';
import * as lib from '@/utils/lib';
import { topColResponsiveProps } from '../../components/Cards';

export default () => {
  /**
   *   useFetch (React hooks)
   *   @database: { 数据共享平台 }
   *   @desc:     { 钞纸制作部新老线纸浆产量 }
   */
  const { data, loading } = useFetch({
    param: {
      url: `/993/497fcdf516.json`,
    },
    callback({ data, source }) {
      return { data: data[0], source };
    },
  });

  /**
   *   useFetch (React hooks)
   *   @database: { 数据共享平台 }
   *   @desc:     { 每日精浆产量 }
   */
  const { data: detail } = useFetch({
    param: {
      url: `/994/3b3ae58e40.json`,
    },
  });

  return (
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={`钞纸纸浆产量(${lib.monthname()})`}
        action={
          <Tooltip title={data?.source}>
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(
          data?.data?.新线精浆产量 + data?.data?.老线精浆产量 + data?.data?.损纸浆产量
        ).format('0,0')}
        suffix="吨"
        footer={
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Field label="新线" value={numeral(data?.data?.新线精浆产量).format('0,0')} />
            <Field label="老线" value={numeral(data?.data?.老线精浆产量).format('0,0')} />
            <Field label="损纸浆" value={numeral(data?.data?.损纸浆产量).format('0,0')} />
          </div>
        }
        contentHeight={46}
      >
        <MiniArea line data={detail?.data || []} borderColor="#13C2C2" />
      </ChartCard>
    </Col>
  );
};
