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
  title: <div>年度能源消耗详情</div>,
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
      url: `1169/ebfd135d15`,
    },
    callback(res) {
      let prods = chartLib.getUniqByIdx({
        key: '类型',
        data: res.data.map(item => {
          item.month = item['月份'];
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
    if (prod.length == 0 || !data) {
      return;
    }
    let res = R.clone(data);
    res.data = res.data.filter(item => item['类型'] == prod);

    // 处理其它合并数据

    let other = R.filter(
      item => (item.type.includes('32') && item.type != '325外售') || item.type == '设备管理部'
    )(res.data);
    let main = R.reject(
      item => (item.type.includes('32') && item.type != '325外售') || item.type == '设备管理部'
    )(res.data);

    let dist = R.groupBy(R.prop('month'))(other);
    let otherSummary = Object.values(dist).map(item => {
      let arr = R.pluck('值')(item);
      let val = R.sum(arr);
      return {
        ...item[0],
        type: '其它(生活区/库房/驻警/外售/办公/维修)',
        值: val,
      };
    });
    res.data = [...main, ...otherSummary];

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
      style={{ marginTop: 20 }}
    >
      <SimpleChart
        data={{ ...state, err: error }}
        params={{
          type: 'line',
          renderer: 'canvas',
          stack: true,
          area: true,
          smooth: true,
          simple: CHART_MODE.HIDE_ALL,
          x: 1,
          legend: 0,
          y: 3,
        }}
        style={{ height: chartHeight - 15, width: '100%' }}
        beforeRender={e => {
          let formatter = param => {
            let arr = R.pluck('value')(param); 
            let sum = R.sum(arr); 
            let next = param.map(item => {
              let percent = ((item.value / sum) * 100).toFixed(2);
              return { ...item, percent };
            }); 
            return e.tooltip.formatter(next);
          };

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
            tooltip: {
              ...e.tooltip,
              formatter,
            },
          };
        }}
      />
    </Card>
  );
};
