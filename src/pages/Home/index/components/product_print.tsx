import React, { useState, useEffect } from 'react';

import { Card, Button, Radio } from 'antd';
import { monthname, jump } from '@/utils/lib';
import styles from './product_print.less';
import useFetch from '@/components/hooks/useFetch';
import range from '@/utils/ranges';
import * as R from 'ramda';
import chartLib, { CHART_MODE } from '@/pages/chart/utils/lib';
import { cardStyle, chartHeight } from '../../components/Cards';
import SimpleChart from '@/pages/Search/components/SimpleChart';

let [tstart, tend] = range['本月'].map(item => item.format('YYYYMMDD'));

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
      url: `/933/1e13988eb5.json`,
      params: {
        tstart,
        tend,
        tstart2: tstart,
        tend2: tend,
      },
    },
    callback(res) {
      res.data = res.data
        .filter(item => item['工序'] != '白纸')
        .map(item => {
          item['品种'] = item['品种'].replace('品', '');
          return item;
        });
      let prods = chartLib.getUniqByIdx({
        key: '品种',
        data: res.data,
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
    res.data = res.data.filter(item => item['品种'] == prod);
    res.hash += prod;
    setState(res);
  }, [prod, data?.hash]);

  return (
    <Card
      {...cardStyle({
        title: (
          <div>
            印钞生产计划完成率(%)
            <Button
              type="default"
              size="small"
              style={{ marginLeft: 20, fontSize: 12 }}
              onClick={() => {
                window.open(
                  `/chart#id=940/bd3aba9285&prod=${prod}&daterange=9&group=1&legend=2&x=0&y=3&type=line&smooth=1&dr0_id=941/958dada9e0&dr0_type=bar&dr0_legend=1&dr0_x=0&dr0_y=2&dr1_id=942/47a7d8b252&dr1_type=bar&dr2_id=943/64fbe9194a&dr2_drilltype=table&cache=0`
                );
              }}
            >
              详情
            </Button>
          </div>
        ),
        height: chartHeight,
      })}
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
          type: 'bar',
          simple: CHART_MODE.HIDE_ALL,
          x: 0,
          y: 1,
        }}
        style={{ height: chartHeight - 15, width: '100%' }}
      />
    </Card>
  );
};
