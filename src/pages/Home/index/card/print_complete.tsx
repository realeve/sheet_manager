import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Tooltip } from 'antd';
import React, { useState } from 'react';
import numeral from 'numeral';
import { ChartCard, MiniBar, Field } from '../../components/';
import { VisitDataType } from '../../data';
import useFetch from '@/components/hooks/useFetch';
import * as lib from '@/utils/lib';
import * as R from 'ramda';
import { topColResponsiveProps } from '../../components/Cards';

export default () => {
  const [total, setTotal] = useState(0);
  const { loading, data } = useFetch<{ source: string; data: VisitDataType[] }>({
    param: { url: '/990/9877f70475.array' },
    callback({ data, source }) {
      let sum = R.compose(R.sum, R.map(R.prop('1')))(data);
      setTotal(sum);
      return { data: data.map(([x, y]) => ({ x, y })), source };
    },
  });

  /**
   *   useFetch (React hooks)
   *   @database: { MES系统_生产环境 }
   *   @desc:     { 本月成品入库及解缴量汇总 }
   *   useFetch 返回值说明： data(返回数据), error(报错), loading(加载状态), reFetch(强制刷新),setData(强制设定数据)
   */
  const { data: storage } = useFetch({
    param: {
      url: `/991/b6b55a36a0.json`,
    },
    callback({ data }) {
      return data[0];
    },
  });

  return (
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={`印钞入库总数(${lib.monthname()})`}
        action={
          <Tooltip title={data?.source}>
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(total).format('0,0')}
        suffix="千尺"
        footer={
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Field label="累计入库" value={numeral(storage?.income).format('0,0')} />
            <Field label="累计解缴" value={numeral(storage?.pay).format('0,0')} />
          </div>
        }
        contentHeight={46}
      >
        <MiniBar data={data?.data || []} />
      </ChartCard>
    </Col>
  );
};
