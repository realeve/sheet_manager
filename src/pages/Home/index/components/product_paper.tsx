import React, { useState, useEffect } from 'react';

import { Card, Button, Radio } from 'antd';
import styles from './product_print.less';
import useFetch from '@/components/hooks/useFetch';
import range from '@/utils/ranges';
import * as R from 'ramda';
import chartLib, { CHART_MODE } from '@/pages/chart/utils/lib';
import { cardStyle, chartHeight } from '../../components/Cards';
import SimpleChart from '@/pages/Search/components/SimpleChart';

let [tstart, tend] = range['本月'].map(item => item.format('YYYYMMDD'));

const cardProp = cardStyle({
  title: (
    <div>
      钞纸生产计划完成情况
      <Button
        type="default"
        size="small"
        style={{ marginLeft: 20, fontSize: 10 }}
        onClick={() => {
          window.open(`/table#id=664/9cdc31ddc6&daterange=1`);
        }}
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
      url: `/996/ca5a5a101f.json`,
    },
    callback(res) {
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
        data={state}
        params={{
          type: 'bar',
          simple: CHART_MODE.HIDE_ALL,
          x: 0,
          legend: 2,
          y: 3,
        }}
        style={{ height: chartHeight - 15, width: '100%' }}
      />
    </Card>
  );
};
