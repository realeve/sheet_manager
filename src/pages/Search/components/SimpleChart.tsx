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
export default function SimpleChart({ data, params, beforeRender, ...props }: ChartProps) {
  const [state, setState] = useState({});
  useEffect(() => {
    if (!data?.data) {
      return;
    }
    let {
      option: [option],
    } = getDrivedState({ dataSrc: data, params });
    if (beforeRender) {
      option = beforeRender(option);
    }
    if (option.legend) {
      option.legend = {
        ...option.legend,
        icon: 'circle',
      };
    }

    setState(option);
  }, [data?.data]);
  if (!data) {
    return null;
  }

  return data.err ? (
    <Err err={data.err} />
  ) : (
    <Chart renderer={params.renderer || 'svg'} option={state} {...props} />
  );
}
