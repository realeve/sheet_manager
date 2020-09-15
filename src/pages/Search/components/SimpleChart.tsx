import React, { useState, useEffect } from 'react';
import { getDrivedState } from '@/pages/chart/services/chart';
import Chart from '@/pages/chart/components/ChartComponent';
import Err from '@/components/Err';
export interface ChartProps {
  [key: string]: any;
  data: any;
  params: any;
  beforeRender?: Function;
}
export default function SimpleChart({ option, data, params, beforeRender, ...props }: ChartProps) {
  const [state, setState] = useState({});
  useEffect(() => {
    if (!data?.data || option) {
      return;
    }
    let {
      option: [nextOption],
    } = getDrivedState({ dataSrc: data, params });
    if (beforeRender) {
      nextOption = beforeRender(nextOption);
    }
    if (nextOption.legend) {
      nextOption.legend = {
        ...nextOption.legend,
        icon: 'circle',
      };
    }

    setState(nextOption);
  }, [data?.data]);
  if (!data) {
    return null;
  }

  return data.err ? (
    <Err err={data.err} />
  ) : (
    <Chart renderer={params.renderer || 'svg'} option={option || state} {...props} />
  );
}
