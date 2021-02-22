import React, { useState } from 'react';
import { Card, Button } from 'antd';
import * as R from 'ramda';
import useFetch from '@/components/hooks/useFetch';
import { CHART_MODE } from '@/pages/chart/utils/lib';

import SimpleChart from '@/pages/Search/components/SimpleChart';

import { cardStyle, chartHeight } from '../../components/Cards';
// import * as lib from '@/utils/lib';

const getWaterfall = data => {
  let total = data[4].value;
  let plus = total - data[0].value - data[1].value - data[2].value - data[3].value;

  let seriesValue = [
    data[0].value,
    data[1].value,
    data[2].value,
    data[3].value,
    plus,
    data[4].value,
  ];

  let supportValue = [
    0,
    data[0].value,
    data[0].value + data[1].value,
    data[0].value + data[1].value + data[2].value,
    data[4].value,
    0,
  ].map(item => (item / 10000).toFixed(2));

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function(params) {
        var tar = params[1];
        return (
          tar.name +
          (tar.dataIndex === 4 ? '抵销利润' : tar.seriesName) +
          ' : ' +
          tar.data.srcValue +
          ' 万元'
        );
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      splitLine: { show: false },
      data: [data[0].type, data[1].type, data[2].type, data[3].type, '成钞公司抵销', data[4].type],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '辅助',
        type: 'bar',
        stack: '总量',
        itemStyle: {
          normal: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)',
          },
          emphasis: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)',
          },
        },
        data: supportValue,
      },
      {
        name: '利润',
        type: 'bar',
        stack: '总量',
        label: {
          show: true,
          position: 'inside',
          formatter(e) {
            return e.data.srcValue;
          },
        },
        data: seriesValue.map(item => ({
          value: (item / 10000).toFixed(2),
          itemStyle: {
            color: item > 0 ? '#1890FF' : '#F04864',
          },
          srcValue: (item / 10000).toFixed(2),
        })),
      },
    ],
  };
};

export default () => {
  /**
   *   useFetch (React hooks)
   *   @database: { 总公司数据共享平台 }
   *   @desc:     { 公司主要经济指标 }
   *   useFetch 返回值说明： data(返回数据), error(报错), loading(加载状态), reFetch(强制刷新),setData(强制设定数据)
   */
  const res = useFetch({
    param: {
      url: `/1174/453eac7573.json`,
    },
    callback: e => {
      if (e.rows !== 5) {
        setOption(null);
        return;
      }
      setOption(getWaterfall(e.data));
    },
  });

  const [option, setOption] = useState(null);
  return (
    <Card
      {...cardStyle({
        title: (
          <div>
            成钞公司合并利润构成(单位：万元)
            <Button
              type="default"
              size="small"
              style={{ marginLeft: 20, fontSize: 12 }}
              onClick={() => {
                window.open('/table#id=1036/5148b9c40f&daterange=9');
              }}
              title="点击查看详细数据报表"
            >
              详情
            </Button>
          </div>
        ),
        height: chartHeight,
      })}
      loading={res.loading}
    >
      <SimpleChart
        title="sd"
        style={{ height: chartHeight - 15, width: '100%' }}
        data={{
          ...res.data,
          err: res.error,
          loading: res.loading,
        }}
        params={{
          simple: CHART_MODE.HIDE_ALL,
        }}
        option={option}
      />
    </Card>
  );
};
