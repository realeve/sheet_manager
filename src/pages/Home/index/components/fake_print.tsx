import React from 'react';
import useFetch from '@/components/hooks/useFetch';
import { IAxiosState } from '@/utils/axios';
import moment from 'moment';
import { CHART_MODE } from '@/pages/chart/utils/lib';
import GroupCard from './GroupCard';

export default ({ title = '印钞作废类型分析', url = `/1015/d0011e0da9.json` }) => {
  /**
   *   useFetch (React hooks)
   *   @database: { 数据共享平台 }
   *   @desc:     { 印钞小开作废类型分析 }
   */
  const res = useFetch<IAxiosState>({
    param: {
      url,
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
      title={title}
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
        area: true,
        stack: true,
      }} 
      beforeRender={e=>{
        let grid = {left: 50, right: 25, top: 10, bottom: 20};
        return {...e,grid};
      }}
    />
  );
};
