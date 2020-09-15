import React from 'react';
import { Card } from 'antd';
import useFetch from '@/components/hooks/useFetch';
import { CHART_MODE } from '@/pages/chart/utils/lib';
import { cardStyle } from '../components/Cards';
import SimpleChart from '@/pages/Search/components/SimpleChart';

let chartHeight = 500;

const cardProp = cardStyle({
  title: <div>立体库货位使用情况(总货位：12694)</div>,
  height: chartHeight,
});

export default () => {
  const { data, error, loading } = useFetch({
    param: {
      url: `1168/d5593bab3f.json`,
    },
  });
  return (
    <Card {...cardProp} loading={loading} style={{ margin: '20px 0' }}>
      <SimpleChart
        data={{ ...data, err: error }}
        params={{
          type: 'sunburst',
          smooth: true,
          simple: CHART_MODE.HIDE_ALL,
          renderer: 'canvas',
        }}
        style={{ height: chartHeight - 15, width: '100%' }}
      />
    </Card>
  );
};
