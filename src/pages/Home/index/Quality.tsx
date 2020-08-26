import React, { Suspense, useEffect } from 'react';
import { Col, Row } from 'antd';
import * as R from 'ramda';
import useFetch from '@/components/hooks/useFetch';
import * as lib from '@/utils/lib';
import { CHART_MODE } from '@/pages/chart/utils/lib';
import { useSetState } from 'react-use';

const GroupCard = React.lazy(() => import('./components/GroupCard'));

const filterData = (res, type: string, key: string = 'type') => {
  let data = R.filter(item => item[key] == type)(res.data);
  let hash = res.hash + type + data.length;
  return {
    ...res,
    data,
    hash,
    rows: data.length,
  };
};

const handleData = (data, key) => {
  if (!data) {
    return data;
  }
  let res = R.clone(data);

  res.data = R.compose(
    R.map(item => {
      item.type = item.type.replace(key + '产品', '');
      item.month_name = lib.monthname(String(item.month_name).slice(-2));
      return item;
    }),
    R.filter(item => item.type.includes(key))
  )(res.data);
  res.rows = res.data.length;
  return res;
};

const getUnit = curdata => {
  if (!curdata) {
    return null;
  }
  let res = curdata.data[0];
  return `(单位:${res?.unit})`;
};

export default () => {
  /**
   *   useFetch (React hooks)
   *   @database: { 总公司数据共享平台 }
   *   @desc:     { 公司主要经济指标 }
   *   useFetch 返回值说明： data(返回数据), error(报错), loading(加载状态), reFetch(强制刷新),setData(强制设定数据)
   */
  const { data, loading, error } = useFetch({
    param: {
      url: `/999/9a4ae4bce9.json`,
    },
  });
  console.log(data)

  const [unit, setUnit] = useSetState({
    print: null,
    paper: null,
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    setUnit({
      print: '(单位:%)',
      paper: '(单位:%)',
    });
  }, [data?.hash]);

  const param = {
    error,
    loading,
    radioIdx: 1,
    tabIdx: 3,
    chartHeight: 300,
    chartParam: {
      type: 'line',
      smooth: true,
      simple: CHART_MODE.HIDE_ALL,
      x: 2,
      y: 4,
      legend: 0,
    },
  };

  return (
    <Row gutter={24} style={{ marginBottom: 24 }}>
      <Col xl={12} lg={24} md={24} sm={24} xs={24}>
        <Suspense fallback={null}>
          <GroupCard
            data={handleData(data, '印钞')}
            title={'印钞主要绩效指标' + unit.print}
            {...param}
            callback={(e, data) => {
              let dist = filterData(data, e, 'type');
              let print = getUnit(dist);
              setUnit({
                print,
              });
            }}
          />
        </Suspense>
      </Col>
      <Col xl={12} lg={24} md={24} sm={24} xs={24}>
        <Suspense fallback={null}>
          <GroupCard
            {...param}
            data={handleData(data, '钞纸')}
            title={'钞纸主要绩效指标' + unit.paper}
            callback={(e, data) => {
              let dist = filterData(data, e, 'type');
              let paper = getUnit(dist);
              setUnit({
                paper,
              });
            }}
          />
        </Suspense>
      </Col>
    </Row>
  );
};
