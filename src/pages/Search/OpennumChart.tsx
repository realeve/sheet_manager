import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import useFetch from '@/components/hooks/useFetch';
import Chart from '@/pages/chart/components/ChartComponent';
import * as lib from './utils/lib';
import theme from '@/pages/chart/utils/charts/theme';

export default function OpennumChart({ cart }) {
  let [option, setOption] = useState({});
  const { loading, data } = useFetch({
    param: {
      url: '/794/7f57462b6e.json',
      params: {
        carts: cart,
      },
    },
    valid: () => cart,
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    let _option = lib.getFeakOption(data);
    setOption(_option);
  }, [data && data.hash]);

  return (
    <Spin spinning={loading}>
      <Chart
        option={option}
        theme={theme}
        style={{ height: 420, width: '100%' }}
        renderer="canvas"
      />
    </Spin>
  );
}
