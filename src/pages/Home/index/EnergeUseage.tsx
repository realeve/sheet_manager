import React, { Suspense, useState } from 'react';
import { Col, Row, Tabs, Card } from 'antd';
import useFetch, { IFetchState } from '@/components/hooks/useFetch';
import { CHART_MODE } from '@/pages/chart/utils/lib';
import style from './index.less';
import { useSetState } from 'react-use';

import SimpleChart from '@/pages/Search/components/SimpleChart';
import { cardStyle } from '../components/Cards';

// 以下逻辑改编自 能环系统：http://10.9.5.27/ccc/lingdao/corp_index.js
const getTimeTick = (i: number) =>
  i % 4 == 0 ? i / 4 + ':00' : Math.floor(i / 4) + ':' + (i % 4) * 15;

const handleData = (src, res) => {
  let data = [];
  src.cur_day_buf.map((value, i) => {
    let time_tick = getTimeTick(i);
    time_tick = time_tick.padStart(4, '0');

    if (value > 0) {
      data.push({
        type: '今日',
        time_tick,
        value,
      });
    }

    data.push({
      type: '昨日',
      time_tick,
      value: src.last_day_buf[i],
    });
  });

  return { ...res, data, rows: data.length, header: ['type', 'time_tick', 'value'] };
};

const Chart = ({ res }) => (
  <SimpleChart
    style={{ height: 400 - 20, width: '100%' }}
    data={{ ...res.data, err: res.error }}
    params={{
      type: 'line',
      smooth: true,
      simple: CHART_MODE.HIDE_ALL,
      legend: 0,
      x: 1,
      y: 2,
    }}
    beforeRender={e => {
      let config = { grid: { ...e.grid, left: 60,top:25 }, color: ['#1890FF', '#F04864'] };
      let series = e.series.map((item, idx) => {
        item.symbolSize = 0;
        if (idx === 0) {
          item.areaStyle = {
            normal: {
              opacity: 0.2,
            },
          };
        }
        return item;
      });
      e.legend.top = 2; 
      console.log(e)
      return { ...e, series, ...config };
    }}
  />
);

export default () => {
  const [total, setTotal] = useSetState({
    electronic: 0,
    water: 0,
    cold: 0,
    stream: 0,
  });
  const res: IFetchState = useFetch({
    param: {
      url: `/1159/0365af0235`,
      params: {
        method: 'post',
        deptName: '',
        groupName: '',
        procName: '',
        typeName: '总计',
      },
    },
    callback(res) {
      let src = res.data[0];
      // 用电总量
      setTotal({
        electronic: src.pre_p,
      });
      return handleData(src, res);
    },
  });

  const res2: IFetchState = useFetch({
    param: {
      url: `/1161/9a37e5de0b`,
      params: {
        method: 'post',
        sblb: 's',
        deptName: '',
        groupName: '',
        procName: '',
      },
    },
    callback(res) {
      let src = res.data;
      // 用电总量
      setTotal({
        water: src.cur_day,
      });
      return handleData(src, res);
    },
  });

  const res3: IFetchState = useFetch({
    param: {
      url: `/1161/9a37e5de0b`,
      params: {
        method: 'post',
        sblb: 'q',
        deptName: '',
        groupName: '',
        procName: '',
      },
    },
    callback(res) {
      let src = res.data;
      // 用电总量
      setTotal({
        cold: src.cur_day,
      });
      return handleData(src, res);
    },
  });

  const res4: IFetchState = useFetch({
    param: {
      url: `/1161/9a37e5de0b`,
      params: {
        method: 'post',
        sblb: 'l',
        deptName: '',
        groupName: '',
        procName: '',
      },
    },
    callback(res) {
      let src = res.data;
      // 用电总量
      setTotal({
        stream: src.cur_day,
      });
      return handleData(src, res);
    },
  });

  return (
    <Row gutter={24} style={{ marginBottom: 24 }}>
      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
        <Suspense fallback={null}>
          <Tabs defaultActiveKey="0" type="line" className={style.tabs}>
            <Tabs.TabPane tab="今日电量" key="0">
              <Card
                loading={res.loading}
                {...cardStyle({
                  height: 400,
                })}
                title={<div>今日电量: {total.electronic} kWh <small>(采集频率：15分钟)</small></div>}
              >
                <Chart res={res} />
              </Card>
            </Tabs.TabPane>
            <Tabs.TabPane tab="今日用水" key="1">
              <Card
                loading={res2.loading}
                {...cardStyle({
                  height: 400,
                })}
                title={<div>今日用水: {total.water} 立方米/小时 <small>(采集频率：15分钟)</small></div>}
              >
                <Chart res={res2} />
              </Card>
            </Tabs.TabPane>
            <Tabs.TabPane tab="今日用气" key="2">
              <Card
                loading={res3.loading}
                {...cardStyle({
                  height: 400,
                })}
                title={<div>今日气量: {total.stream} GJ <small>(采集频率：15分钟)</small></div>}
              >
                <Chart res={res3} />
              </Card>
            </Tabs.TabPane>
            <Tabs.TabPane tab="今日制冷" key="3">
              <Card
                loading={res4.loading}
                {...cardStyle({
                  height: 400,
                })}
                title={<div>今日制冷: {total.cold} 吨 <small>(采集频率：15分钟)</small></div>}
              >
                <Chart res={res4} />
              </Card>
            </Tabs.TabPane>
          </Tabs>
        </Suspense>
      </Col>
    </Row>
  );
};
