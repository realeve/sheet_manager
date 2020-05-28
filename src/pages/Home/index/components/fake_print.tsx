import React from 'react';
import useFetch from '@/components/hooks/useFetch';
import moment from 'moment';
import { CHART_MODE } from '@/pages/chart/utils/lib';
import GroupCard from './GroupCard';

export default () => {
  /**
   *   useFetch (React hooks)
   *   @database: { 数据共享平台 }
   *   @desc:     { 印钞小开作废类型分析 }
   *   useFetch 返回值说明： data(返回数据), error(报错), loading(加载状态), reFetch(强制刷新),setData(强制设定数据)
   */
  const res = useFetch({
    param: {
      url: `/1015/d0011e0da9.json`,
      params: {
        tstart: moment()
          .subtract(12, 'month')
          .startOf('month')
          .format('YYYYMM'),
        tend: moment()
          .subtract(1, 'month')
          .endOf('month')
          .format('YYYYMM'),
      },
    },
  });

  return (
    <GroupCard
      title="印钞作废类型分析"
      {...res}
      radioIdx={0}
      tabIdx={4}
      chartHeight={500}
      chartParam={{
        type: 'line',
        smooth: true,
        simple: CHART_MODE.HIDE_ALL,
        legend: 1,
        x: 2,
        y: 3,
        renderer: 'canvas',
      }}
    />
  );
};
