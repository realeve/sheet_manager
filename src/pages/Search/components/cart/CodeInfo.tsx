import React from 'react';
import SimpleChart from '../SimpleChart';
import { Card } from 'antd';
import { useFetch } from '@/pages/Search/utils/useFetch';

export default function CodeInfo({ cart }) {
  const state = useFetch({ params: cart, api: 'getQaInspectSlaveCode' });
  const params = {
    type: 'bar',
    simple: '2',
    stack: true,
    barwidth: 20,
    legend: 0,
    x: 1,
    y: 2,
    smooth: true,
    reverse: true,
  };

  const beforeRender = option =>
    Object.assign(option, {
      grid: { left: 80, right: 10, top: 5, bottom: 20 },
      legend: { top: 10 },
    });

  return (
    <Card
      bodyStyle={{
        padding: 0,
      }}
      bordered={false}
      loading={state.loading}
    >
      <SimpleChart
        data={state}
        params={params}
        beforeRender={beforeRender}
        style={{ height: 300 }}
      />
    </Card>
  );
}
