import React from 'react';
import useFetch from '@/components/hooks/useFetch';
import { IAxiosState } from '@/utils/axios';
import moment from 'moment';
import { CHART_MODE } from '@/pages/chart/utils/lib';
import { _beforeRender as beforeRender } from './GroupCard';
import { Card } from 'antd';
import SimpleChart from '@/pages/Search/components/SimpleChart';
import { cardStyle } from '../../components/Cards';

import { getTooltipUnit, tooltipFormatter } from '@/pages/chart/utils/lib';

export default ({ title = '纸机运行情况 (单位:分钟)', url = `/1130/29aac9061c.json` }) => {
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

  const callback = option => {
    let opt = beforeRender(option);

    let axisName = option?.yAxis?.name;
    let unit = getTooltipUnit(res?.data?.title);

    opt.tooltip.formatter = e => {
      let date = e[0].axisValue;
      let append = !res ? [] : res.data.data.filter(item => item['日期'] == date.replace(/-/g, ''));
      let record = {};
      append.forEach(item => {
        record[item.设备] = '生产记录：' + item.生产记录;
      });
      return tooltipFormatter(e, unit, axisName, record);
    };
    return opt;
  };

  return (
    <Card
      loading={res.loading}
      {...cardStyle({
        height: 500,
      })}
      title={title}
    >
      <SimpleChart
        title={title}
        {...res}
        params={{
          type: 'line',
          smooth: true,
          simple: CHART_MODE.HIDE_ALL,
          x: 0,
          legend: 1,
          y: 3,
          renderer: 'svg',
        }}
        style={{ height: 500 - 30, width: '100%' }}
        beforeRender={callback}
      />
    </Card>
  );
};
