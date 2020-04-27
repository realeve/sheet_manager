import React, { useState, useEffect } from 'react';
import useFetch from '@/components/hooks/useFetch';
import Chart from '@/pages/chart/components/ChartComponent';
import { handleData } from '../cart/ReelInfo/chart';

export default ({ reel: cart }) => {
  const [option, setOption] = useState({});
  /**
   *   useFetch (React hooks)
   *   @database: { 质量信息系统 }
   *   @desc:     { 装箱产品关联分析查询 }
   *   useFetch 返回值说明： data(返回数据), error(报错), loading(加载状态), reFetch(强制刷新),setData(强制设定数据)
   */
  const { data, error, loading } = useFetch({
    param: {
      url: '/964/ee972ac15d.json',
      params: { cart },
    },
    valid: () => cart, // params中指定参数存在时才发起请求
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    setOption(handleData(data.data, cart));
  }, [data]);

  return (
    data &&
    data.rows > 0 && <Chart renderer="svg" option={option} style={{ width: '100%', height: 600 }} />
  );
};
