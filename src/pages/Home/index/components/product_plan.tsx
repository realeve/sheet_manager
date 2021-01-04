import React, { useState, useEffect } from 'react';

import { Card, Button, Radio } from 'antd';
import styles from './product_print.less';
import useFetch from '@/components/hooks/useFetch';
import * as R from 'ramda';
import chartLib, { CHART_MODE } from '@/pages/chart/utils/lib';
import { cardStyle, chartHeight } from '../../components/Cards';
import SimpleChart from '@/pages/Search/components/SimpleChart';
import jStat from 'jstat';
const keyName = '类型';

const getTotal = data => {
  if (!data) {
    return 0;
  }
  let res = R.pluck(['计划数'])(data.data);
  return jStat.sum(res);
};

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
      url: `/1153/c42eaa96b5.json`,
      params: { cache: 5 },
    },
    callback(res) {
      if (!res.data) {
        return res;
      }
      res.data = res.data.map(item => {
        item['品种'] = item['品种'].replace('品', '');
        return item;
      });
      let prods = chartLib.getUniqByIdx({
        key: keyName,
        data: res.data,
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
    res.data = res.data.filter(item => item[keyName] == prod);
    res.hash += prod;
    setState(res);
    getTotal(res);
  }, [prod, data?.hash]);

  return (
    <Card
      {...cardStyle({
        title: (
          <div>
            {prod}生产计划 ( 合计:{getTotal(state)} {prod === '印钞' ? '千尺' : '吨'} )
            <Button
              type="default"
              size="small"
              style={{ marginLeft: 20, fontSize: 12 }}
              onClick={() => {
                window.open('/table#id=1153/c42eaa96b5&datetype=none');
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
          x: 1,
          y: 2,
        }}
        style={{ height: chartHeight - 15, width: '100%' }}
        beforeRender={e => {
          if (!e?.grid) {
            return {};
          }
          e.grid.left = 45;
          return e;
        }}
      />
    </Card>
  );
};
