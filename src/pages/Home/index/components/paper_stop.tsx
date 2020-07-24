import React from 'react';
import useFetch from '@/components/hooks/useFetch';
import { IAxiosState } from '@/utils/axios';
import moment from 'moment';
import { CHART_MODE } from '@/pages/chart/utils/lib';
import GroupCard from './GroupCard';

export default ({ title = '纸机停机时长分析 (单位:分钟)', url = `/1132/7b211c3592.json` }) => {
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
          .subtract(1, 'month')
          .format('YYYYMMDD'),
        tend: moment().format('YYYYMMDD'),
      },
    },
  });

  return (
    <GroupCard
      title={title}
      {...res}
      radioIdx={0}
      chartHeight={500}
      chartParam={{
        type: 'bar',
        smooth: true,
        simple: CHART_MODE.HIDE_ALL,
        legend: 1,
        x: 2,
        y: 3,
        renderer: 'svg',
        stack: true,
      }}
    />
  );
};
