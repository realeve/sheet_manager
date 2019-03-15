import React, { useState, useEffect } from 'react';
import { getDrivedState } from '@/pages/chart/services/chart';
import Chart from '@/pages/chart/components/ChartComponent';

export interface ChartProps {
  [key: string]: any;
  data: any;
  params: any;
  beforeRender?: Function;
}
export default function SimpleChart({ data, params, beforeRender, ...props }: ChartProps) {
  const [state, setState] = useState({});
  useEffect(() => {
    let {
      option: [option],
    } = getDrivedState({ dataSrc: data, params });
    if (beforeRender) {
      option = beforeRender(option);
    }
    setState(option);
  }, params);
  return <Chart renderer="svg" option={state} {...props} />;
}
