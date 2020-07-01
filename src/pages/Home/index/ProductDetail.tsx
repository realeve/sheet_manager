import React, { Suspense } from 'react';
import { Col, Row, Tabs, Button } from 'antd';
import useFetch from '@/components/hooks/useFetch';
import { IAxiosState } from '@/utils/axios';
import { CHART_MODE } from '@/pages/chart/utils/lib';
import dateRanges from '@/utils/ranges';
import style from './index.less';

const GroupCard = React.lazy(() => import('./components/GroupCard'));

const ranges = dateRanges['过去一月'];
const params = {
  tstart: ranges[0].format('YYYYMMDD'),
  tend: ranges[1].format('YYYYMMDD'),
  tstart2: ranges[0].format('YYYYMMDD'),
  tend2: ranges[1].format('YYYYMMDD'),
};

export default () => {
  /**
   *   useFetch (React hooks)
   *   @database: { 总公司数据共享平台 }
   *   @desc:     { 公司主要经济指标 }
   *   useFetch 返回值说明： data(返回数据), error(报错), loading(加载状态), reFetch(强制刷新),setData(强制设定数据)
   */
  const { data, loading, error } = useFetch<IAxiosState>({
    param: {
      url: `1026/097c1d4161.json`,
      params,
    },
  });

  const { data: data2, loading: loading2, error: error2 } = useFetch<IAxiosState>({
    param: {
      url: `1027/f1037acf8c.json`,
      params,
    },
  });
  const { data: data3, loading: loading3, error: error3 } = useFetch<IAxiosState>({
    param: {
      url: `1028/a90809cb29`,
      params,
    },
  });

  return (
    <Row gutter={24} style={{ marginBottom: 24 }}>
      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
        <Suspense fallback={null}>
          <Suspense fallback={null}>
            <Tabs defaultActiveKey="0" type="line" className={style.tabs}>
              <Tabs.TabPane tab="月度班效率" key="0">
                <GroupCard
                  data={data3}
                  title={
                    <div>
                      班效率汇总(大万/台班)
                      <Button
                        type="default"
                        size="small"
                        style={{ marginLeft: 20, fontSize: 12 }}
                        onClick={() => {
                          window.open(`/table#id=1036/5148b9c40f&daterange=9`);
                        }}
                        title="点击查看详细数据报表"
                      >
                        详情
                      </Button>
                    </div>
                  }
                  {...{
                    error: error2,
                    loading: loading2,
                    radioIdx: 0,
                    chartHeight: 400,
                    // tabIdx: 0,
                    chartParam: {
                      type: 'bar',
                      smooth: true,
                      simple: CHART_MODE.HIDE_ALL,
                      x: 1,
                      y: 2,
                    },
                  }}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="每日班效率" key="1">
                <GroupCard
                  data={data2}
                  title={
                    <div>
                      工序每日班效率(大万/台班)
                      <Button
                        type="default"
                        size="small"
                        style={{ marginLeft: 20, fontSize: 12 }}
                        onClick={() => {
                          window.open(`/table#id=1027/f1037acf8c&daterange=9`);
                        }}
                        title="点击查看详细数据报表"
                      >
                        详情
                      </Button>
                    </div>
                  }
                  {...{
                    error: error2,
                    loading: loading2,
                    radioIdx: 2,
                    chartHeight: 400,
                    // tabIdx: 0,
                    chartParam: {
                      type: 'line',
                      smooth: true,
                      simple: CHART_MODE.HIDE_ALL,
                      x: 1,
                      y: 3,
                      legend: 0,
                      renderer: 'canvas',
                    },
                  }}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="日产量" key="2">
                <GroupCard
                  data={data}
                  title={
                    <div>
                      印钞各工序产量汇总(大万总数)
                      <Button
                        type="default"
                        size="small"
                        style={{ marginLeft: 20, fontSize: 12 }}
                        onClick={() => {
                          window.open(
                            `/chart#id=940/bd3aba9285&select=550/12623689ae&selectkey=prod&daterange=9&group=1&legend=2&x=0&y=3&type=line&smooth=1&dr0_id=941/958dada9e0&dr0_type=bar&dr0_legend=1&dr0_x=0&dr0_y=2&dr1_id=942/47a7d8b252&dr1_type=bar&dr2_id=943/64fbe9194a&dr2_drilltype=table&cache=0`
                          );
                        }}
                        title="点击查看详细数据报表"
                      >
                        详情
                      </Button>
                    </div>
                  }
                  {...{
                    error,
                    loading,
                    radioIdx: 0,
                    tabIdx: 2,
                    chartHeight: 400,
                    chartParam: {
                      type: 'line',
                      smooth: true,
                      simple: CHART_MODE.HIDE_ALL,
                      x: 1,
                      y: 4,
                      legend: 3,
                      ...params,
                    },
                  }}
                />
              </Tabs.TabPane>
            </Tabs>
          </Suspense>
        </Suspense>
      </Col>
    </Row>
  );
};
