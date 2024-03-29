import React, { Suspense, useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import * as R from 'ramda';
import useFetch from '@/components/hooks/useFetch';
import { CHART_MODE } from '@/pages/chart/utils/lib';

const GroupCard = React.lazy(() => import('./GroupCard'));

const handleData = (data, key) => {
  if (!data) {
    return data;
  }
  let res = R.clone(data);
  res.data = R.compose(R.filter(item => item['类型'].includes(key)))(res.data);
  res.rows = res.data.length;
  return res;
};

let procs = ['印钞', '钞纸'];

export default ({ proc_name = 0 }) => {
  /**
   *   useFetch (React hooks)
   *   @database: { 总公司数据共享平台 }
   *   @desc:     { 公司主要经济指标 }
   *   useFetch 返回值说明： data(返回数据), error(报错), loading(加载状态), reFetch(强制刷新),setData(强制设定数据)
   */
  const { data, loading, error } = useFetch({
    param: {
      url: `/1158/45412abcb2.json`, // @/mock/1158_45412abcb2.json
      params: {
        proc1: proc_name,
        proc2: proc_name,
        proc3: proc_name,
        proc4: proc_name,
      },
    },
    callback: e => {
      if (!e) {
        return e;
      }

      let res = R.filter(R.propEq('期间', '去年平均'))(e.data);
      setAvg(res);

      let data = R.reject(R.propEq('期间', '去年平均'))(e.data);

      data = data.map(item => {
        if (item['类型'] === '总成本') {
          item['类型'] = '变动成本';
        }
        return item;
      });

      return {
        ...e,
        data,
      };
    },
  });

  const [avg, setAvg] = useState([]);

  const [period, setPeriod] = useState('');
  useEffect(() => {
    if (!data) {
      setPeriod('');
      return;
    }
    setPeriod(data.data[0].期间);
  }, [data?.hash]);

  const param = {
    error,
    loading,
    radioIdx: 1,
    tabIdx: 4,
    chartHeight: 300,
    chartParam: {
      type: 'bar',
      smooth: true,
      simple: CHART_MODE.HIDE_ALL,
      x: 0,
      y: 5,
      legend: 3,
      markline: 0,
      marktext: '行业平均',
    },
    beforeRender: (_e, a, curtype) => {
      let e = R.clone(_e);
      let series = R.clone(e.series[0]);
      if (e.xAxis.data.length === 1) {
        return e;
      }


      // ?为何删除最后一项
      // series.data = R.init(series.data);
      // e.xAxis.data = R.init(e.xAxis.data);

      e.series = [series];
      e.legend.show = false;

      e.grid = {
        ...e.grid,
        left: 50,
        right: 55,
      };

      e.tooltip.axisPointer.type = 'cross';

      let barData = series.data.map((value, idx) => {
        let name = e.xAxis.data[idx].replace('公司', '');
        return {
          value: (name.includes('成都') || name.includes('成钞'))
            ? { value, itemStyle: { normal: { color: '#2FC25B' } } }
            : value,
          name,
        };
      });

      let haveAverage = barData.find(item => item.name == '平均值')
      barData = barData.filter((item) => item?.name != '平均值')
      if (haveAverage) {
        let val = haveAverage.value

        if (['纸张', '变动成本合计'].includes(a)) {
          e.yAxis.min = Math.floor((val * 0.9) / 5000) * 5000;
        }
        let prevMarkLine = R.clone(series.markLine) || {
          data: [
            {
              label: {
                formatter(a) {
                  return '行业平均';
                },
              },
            },
          ],
          symbolSize: 0,
          symbol: 'none',
          lineStyle: {},
        };

        // console.log(prevMarkLine, series);
        if (prevMarkLine) {
          prevMarkLine.data[0].yAxis = val;
          prevMarkLine.lineStyle = { normal: { type: 'dashed', color: '#e23' } };

          let avgItem = avg.find(item => item['品种'] == curtype && item['成本项目'] == a);
          if (avgItem) {
            prevMarkLine.data.push({
              yAxis: avgItem['成本值'],
              label: {
                formatter(a) {
                  return '去年成钞';
                },
              },
              lineStyle: { normal: { type: 'dashed', color: '#2FC25B' } },
            });
          }
          series.markLine = prevMarkLine;
        }
      }


      // 数据排序
      barData = barData.sort((a, b) => (a.value?.value || a.value) - (b.value?.value || b.value));

      (series.data = barData.map(item => item.value)),
        (e.xAxis.data = barData.map((item, idx) => idx + 1 + '.' + item.name));
      // console.log(e, a, curtype);
      return e;
    },
  };

  return (
    <Row gutter={24} style={{ marginBottom: 24 }}>
      <Col xl={12} lg={24} md={24} sm={24} xs={24}>
        <Suspense fallback={null}>
          <GroupCard
            data={handleData(data, '变动成本')}
            title={
              <div style={{ lineHeight: '16px' }}>
                {procs[proc_name]}变动成本({period})
                <br />
                <small>(单位:元/百万小张)</small>
              </div>
            }
            {...param}
          />
        </Suspense>
      </Col>
      <Col xl={12} lg={24} md={24} sm={24} xs={24}>
        <Suspense fallback={null}>
          <GroupCard
            {...param}
            data={handleData(data, '固定成本')}
            title={
              <div style={{ lineHeight: '16px' }}>
                {procs[proc_name]}固定成本({period})
                <br />
                <small>(单位:元/百万小张)</small>
              </div>
            }
          />
        </Suspense>
      </Col>
    </Row>
  );
};
