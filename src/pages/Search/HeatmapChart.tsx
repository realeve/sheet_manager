import React, { useEffect, useState, memo } from 'react';
import { Spin } from 'antd';
import { useFetch } from './utils/useFetch';
import { getDrivedState } from '@/pages/chart/services/chart';
import Chart from '@/pages/chart/components/ChartComponent';
import { getPosByRowAndCol, getMaxPapersByCarts } from './utils/lib';
import * as R from 'ramda'

const beforeRender = (param, maxPaper) => {
  let { title, toolbox, ...dist } = param;
  dist = Object.assign(dist, {
    grid: {
      x: 25, y: 5, x2: 10, y2: 45
    }
  })
  dist.tooltip.formatter = ({ value: [col, row, val] }) => {
    let curPos = getPosByRowAndCol({ col, row, maxPaper });
    return `第${curPos}开: ${val}条`;
  }
  dist.tooltip.axisPointer = { type: 'none' }
  return dist;
}

const RChart = ({ option, maxPaper, onFilter }) => (<Chart option={option}
  style={{ height: 300, width: '100%' }}
  renderer="canvas"
  onEvents={{
    mousedown: ({ value: [col, row] }) => {
      let curPos = getPosByRowAndCol({ col, row, maxPaper })
      onFilter && onFilter(curPos);
    }
  }}
/>)

let HeatChart = memo(RChart, (prev, next) => R.equals(prev.option, next.option))

export default function HeatmapChart({ cart, onFilter }) {
  let [option, setOption] = useState({});
  const { loading, err, ...data } = useFetch({ params: cart, api: 'getQfmWipJobsByCarts', init: [cart] });
  let [maxPaper, setMaxpaper] = useState(getMaxPapersByCarts(cart));
  useEffect(() => {
    setMaxpaper(getMaxPapersByCarts(cart))
  }, [cart[2]]);

  useEffect(() => {
    let {
      option: [param],
    } = getDrivedState({
      dataSrc: data, params: {
        type: 'heatmap'
      }
    });
    let dist = beforeRender(param, maxPaper)
    setOption(dist);
  }, [data.data]);

  return <Spin spinning={loading}>
    <HeatChart option={option} maxPaper={maxPaper} onFilter={onFilter} />
  </Spin>
}