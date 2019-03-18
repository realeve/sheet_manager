import React from 'react';
import SimpleChart from '../SimpleChart';
import { Card } from 'antd';
import { useFetch } from '@/pages/Search/utils/useFetch';

export default function CodeInfo({ cart }) {
  const state = useFetch({ params: cart, api: 'getQaInspectSlaveCode', init: [cart] });
  const params = {
    type: 'bar',
    simple: '2',
    stack: true,
    barwidth: 20,
    legend: 0,
    x: 1,
    y: 2,
    smooth: true,
    // reverse: true,
  };

  const beforeRender = option => {
    if (option.series && option.series.length) {
      option.series = option.series.map(item => {
        item.label.normal.position = 'top';
        return item;
      });
    }

    return Object.assign(option, {
      grid: { left: 20, right: 10, top: 10, bottom: 20 },
      legend: { top: 10 },
    });
  };

  return (
    <Card
      bodyStyle={{
        padding: 0,
      }}
      bordered={false}
      loading={state.loading}
      style={{ height: 180 }}
    >
      <SimpleChart
        data={state}
        params={params}
        beforeRender={beforeRender}
        style={{ height: 180 }}
      />
    </Card>
  );
}
