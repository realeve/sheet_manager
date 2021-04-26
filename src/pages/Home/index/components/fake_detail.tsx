import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import * as R from 'ramda';
import { CHART_MODE } from '@/pages/chart/utils/lib';
import { cardStyle } from '../../components/Cards';
import SimpleChart from '@/pages/Search/components/SimpleChart';

const chartHeight = 600;
export default ({ data, prod, error, loading }) => {
  let [state, setState] = useState(null);
  useEffect(() => {
    if (!data?.data) {
      return;
    }

    let maxDate = R.pluck('月份')(data.data);

    maxDate = Math.max(...maxDate);
    let nextData = R.filter(R.propEq('月份', maxDate))(data.data);
    nextData = R.filter(item => item['作废小开数'] > 0)(nextData);

    setState({
      ...data,
      data: nextData,
      rows: nextData.length,
    });
  }, [data]);

  let [curData, setCurData] = useState(null);
  useEffect(() => {
    if (!state || prod.length === 0) {
      return;
    }
    let nextData = R.filter(R.propEq('品种', prod))(state.data);

    const header = ['工序', '作废类型', '作废小开数'];
    nextData = R.map(R.pick(header))(nextData);

    setCurData({
      ...state,
      header,
      data: nextData,
      rows: nextData.length,
    });
  }, [prod, state]);

  return (
    <Card
      {...cardStyle({
        title: null,
        height: chartHeight,
      })}
      loading={loading}
    >
      <SimpleChart
        data={{ ...curData, err: error }}
        params={{
          type: 'sunburst',
          prefix: prod,
          renderer: 'canvas',
          //   simple: CHART_MODE.HIDE_ALL,
        }}
        beforeRender={e => {
          return e;
        }}
        style={{ height: chartHeight - 15, width: '100%' }}
      />
    </Card>
  );
};
