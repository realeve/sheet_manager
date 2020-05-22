import React, { Suspense } from 'react';
import { Col, Row } from 'antd';
import * as R from 'ramda';
import useFetch from '@/components/hooks/useFetch';
import * as lib from '@/utils/lib';

const QualityCard = React.lazy(() => import('./components/quality_card'));

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

export default () => {
  /**
   *   useFetch (React hooks)
   *   @database: { 总公司数据共享平台 }
   *   @desc:     { 公司主要经济指标 }
   *   useFetch 返回值说明： data(返回数据), error(报错), loading(加载状态), reFetch(强制刷新),setData(强制设定数据)
   */
  const { data, loading } = useFetch({
    param: {
      url: `/999/9a4ae4bce9.json`,
    },
  });

  return (
    <Row gutter={24} style={{ marginBottom: 24 }}>
      <Col xl={12} lg={24} md={24} sm={24} xs={24}>
        <Suspense fallback={null}>
          <QualityCard loading={loading} data={handleData(data, '印钞')} title="印钞主要经济指标" />
        </Suspense>
      </Col>
      <Col xl={12} lg={24} md={24} sm={24} xs={24}>
        <Suspense fallback={null}>
          <QualityCard loading={loading} data={handleData(data, '钞纸')} title="钞纸主要经济指标" />
        </Suspense>
      </Col>
    </Row>
  );
};
