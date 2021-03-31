import React from 'react';
import { Card, Button } from 'antd';
import useFetch from '@/components/hooks/useFetch';
import { CHART_MODE } from '@/pages/chart/utils/lib';

import SimpleChart from '@/pages/Search/components/SimpleChart';

import { cardStyle, chartHeight } from '../../components/Cards';

export default () => {
  /**
   *   @database: { 生产指挥中心BI数据 }
   *   @desc:     { 过去一年丝印油墨单位耗量(千克/万张) }
   */
  const { data, error, loading } = useFetch({
    param: {
      url: `/1273/805356f217.json`,
    },
  });

  return (
    <Card
      {...cardStyle({
        title: (
          <div>
            丝印油墨单位耗量(千克/千尺)
            <Button
              type="default"
              size="small"
              style={{ marginLeft: 20, fontSize: 12 }}
              onClick={() => {
                window.open(
                  '/chart#id=1273/805356f217&datetype=none&legend=0&x=1&type=line&smooth=1'
                );
              }}
              title="点击查看详细数据报表"
            >
              详情
            </Button>
          </div>
        ),
        height: chartHeight + 62,
      })}
      loading={loading}
    >
      <SimpleChart
        data={{ ...data, err: error }}
        params={{
          type: 'line',
          simple: CHART_MODE.HIDE_ALL,
          legend: 0,
          x: 1,
          y: 2,
          smooth: true,
        }}
        beforeRender={e => {
          return {
            ...e,
            grid: {
              ...e.grid,
              right: 30,
              bottom: 40,
            },
            legend: {
              ...e.legend,
              top: 0,
            },
          };
        }}
        style={{ height: '100%', width: '100%' }}
      />
    </Card>
  );
};
