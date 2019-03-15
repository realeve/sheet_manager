import React, { useState, useEffect } from 'react';
import { getDrivedState } from '@/pages/chart/services/chart';
import Chart from '@/pages/chart/components/ChartComponent';

export default function SimpleChart({ data, params, ...props }) {
  const [state, setState] = useState({});
  useEffect(() => {
    let {
      option: [option],
    } = getDrivedState({ dataSrc: data, params });
    setState(option);
  }, params);

  return <Chart renderer="svg" option={state} {...props} />;
}
