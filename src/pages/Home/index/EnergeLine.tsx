import React, { useState, useEffect } from 'react';

import { Card, Button, Radio } from 'antd';
import styles from './components/product_print.less';
import useFetch from '@/components/hooks/useFetch';
import * as R from 'ramda';
import chartLib, { CHART_MODE } from '@/pages/chart/utils/lib';
import { cardStyle, chartHeight } from '../components/Cards';
import SimpleChart from '@/pages/Search/components/SimpleChart';
import * as lib from '@/utils/lib';

const cardProp = cardStyle({
  title: (
    <div>
      年度能源消耗曲线
      <Button
        type="default"
        size="small"
        style={{ marginLeft: 20, fontSize: 12 }}
        onClick={() => {
          window.open(`/table#id=1164/62d5ee7ff1&daterange=8`);
        }}
        title="点击查看详细数据报表"
      >
        详情
      </Button>
    </div>
  ),
  height: chartHeight,
});

export default () => {
  const [state, setState] = useState(null);
  const [prod, setProd] = useState('');
  const [prodList, setProdList] = useState([]);

  /**
   *   useFetch (React hooks)
   *   @database: { MES系统_生产环境 }
   *   @desc:     { 印钞工序月度完成率 }
   *   useFetch 返回值说明： data(返回数据), error(报错), loading(加载状态), reFetch(强制刷新),setData(强制设定数据)
   */
  const { data, error, loading } = useFetch({
    param: {
      url: `1163/74628b9941`,
    },
    callback(res) {
      let prods = chartLib.getUniqByIdx({
        key: '类型',
        data: res.data.map(item => {
          item['月份'] = lib.monthList[item['月份']];
          return item;
        }),
      });
      setProdList(prods);
      setProd(prods[0]);
      return res;
    },
  });

  useEffect(() => {
    if (prod?.length == 0 || !data) {
      return;
    }
    let res = R.clone(data);
    res.data = res.data.filter(item => item['类型'] == prod);
    res.hash += prod;
    setState(res);
  }, [prod, data?.hash]);

  return (
    <Card
      {...cardProp}
      loading={loading}
      extra={
        <div className={styles.action}>
          <Radio.Group
            value={prod}
            onChange={e => {
              setProd(e.target.value);
            }}
            buttonStyle="solid"
            size="small"
          >
            {prodList.map(item => (
              <Radio.Button key={item} value={item}>
                {item}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
      }
    >
      <SimpleChart
        data={{ ...state, err: error }}
        params={{
          type: 'line',
          smooth: true,
          simple: CHART_MODE.HIDE_ALL,
          x: 1,
          legend: 0,
          y: 3,
        }}
        style={{ height: chartHeight - 15, width: '100%' }}
        beforeRender={e => {
          return {
            ...e,
            grid: {
              ...e.grid,
              left: 70,
              right: 35,
            },
            legend: {
              ...e.legend,
              top: 0,
            },
          };
        }}
      />
    </Card>
  );
};
