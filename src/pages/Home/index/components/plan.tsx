import React from 'react';
import { Col, Row, Card, Button, Tabs } from 'antd';
import * as R from 'ramda';
import useFetch from '@/components/hooks/useFetch';
import { CHART_MODE } from '@/pages/chart/utils/lib';

import SimpleChart from '@/pages/Search/components/SimpleChart';

import { cardStyle, chartHeight } from '../../components/Cards';
import * as lib from '@/utils/lib';

import Profit from './profit';
import Ovmi from './ovmi';

const { TabPane } = Tabs;

const Plan = () => {
  /**
   *   useFetch (React hooks)
   *   @database: { 总公司数据共享平台 }
   *   @desc:     { 公司主要经济指标 }
   *   useFetch 返回值说明： data(返回数据), error(报错), loading(加载状态), reFetch(强制刷新),setData(强制设定数据)
   */
  const res = useFetch({
    param: {
      url: `/1172/e3f61b67fc.json`,
    },
    callback: e => {
      if (e.rows === 0) {
        return e;
      }
      let res = e.data[0];
      let data = [
        {
          month: '03',
          type: '累计预算',
          value: res.month_3,
        },
        {
          month: '06',
          type: '累计预算',
          value: res.month_3 + res.month_6,
        },
        {
          month: '09',
          type: '累计预算',
          value: res.month_3 + res.month_6 + res.month_9,
        },
        {
          month: '12',
          type: '累计预算',
          value: res.month_year,
        },
      ].map(item => {
        item.month = lib.monthname(item.month);
        return item;
      });
      let header = ['type', 'month', 'value'];

      return {
        ...e,
        data,
        header,
        rows: data.length,
      };
    },
  });

  const { data, loading } = useFetch({
    param: {
      url: `/1173/d9aa8f684d.json`,
    },
    callback: e => {
      e.data = e.data.map(item => {
        item.month = lib.monthname(item.month);
        return item;
      });
      return e;
    },
  });

  return (
    <Card
      {...cardStyle({
        title: (
          <div>
            财务利润预算执行情况(成钞公司合并)
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
      loading={loading}
    >
      <SimpleChart
        title="sd"
        style={{ height: chartHeight - 15, width: '100%' }}
        data={{
          ...res.data,
          err: res.error,
          loading: res.loading || loading,
          data: res.data?.data && data?.data ? [...R.clone(data.data), ...res.data.data] : [],
        }}
        params={{
          type: 'line',
          smooth: true,
          simple: CHART_MODE.HIDE_ALL,
          legend: 0,
          x: 1,
          y: 2,
        }}
        beforeRender={e => {
          if (!e?.series?.length) {
            return e;
          }
          let config = {
            grid: { ...e.grid, left: 90, right: 30, top: 20, bottom: 30 },
          };
          e.legend.top = 2;
          e.series[1].connectNulls = true;
          return { ...e, ...config };
        }}
      />
    </Card>
  );
};

export default () => (
  <Row gutter={24} style={{ marginBottom: 24 }}>
    <Col xl={12} lg={24} md={24} sm={24} xs={24}>
      <Tabs defaultActiveKey="2" type="line">
        <TabPane key="1" tab="预算执行">
          <Plan />
        </TabPane>
        <TabPane key="2" tab="合并利润">
          <Profit />
        </TabPane>
      </Tabs>
    </Col>
    <Col xl={12} lg={24} md={24} sm={24} xs={24}>
      <Ovmi />
    </Col>
  </Row>
);
