import React, { useState, useEffect } from 'react';
import { Card, Radio, Tabs } from 'antd';
import chartLib, { CHART_MODE } from '@/pages/chart/utils/lib';
import styles from './product_print.less';

import { cardStyle, chartHeight } from '../../components/Cards';
import SimpleChart from '@/pages/Search/components/SimpleChart';

import * as R from 'ramda';
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

const TabChart = ({ data, tabs }) => {
  const [curprod, setCurprod] = useState(null);

  useEffect(() => {
    if (!tabs || tabs.length == 0) {
      return;
    }
    setCurprod(tabs[0]);
  }, [tabs]);

  return (
    data && (
      <Tabs activeKey={curprod} onChange={setCurprod} type="line">
        {tabs.map(prod => (
          <Tabs.TabPane tab={prod} key={prod}>
            <SimpleChart
              data={filterData(data, prod, 'prod_name')}
              params={{
                type: 'line',
                smooth: true,
                simple: CHART_MODE.HIDE_ALL,
                x: 2,
                y: 4,
                legend: 0,
              }}
              style={{ height: chartHeight - 70, width: '100%' }}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
    )
  );
};

const getUnit = curdata => {
  if (!curdata) {
    return null;
  }
  let res = curdata.data[0];
  return `(单位:${res.unit})`;
};

export default ({ title, loading, data }) => {
  const [type, setType] = useState([]);
  const [curtype, setCurtype] = useState('');
  const [curdata, setCurdata] = useState(null);

  const [prods, setProds] = useState([]);

  useEffect(() => {
    if (!data) {
      return;
    }

    let type = chartLib.getUniqByIdx({
      key: 'type',
      data: R.clone(data.data),
    });

    setType(type);
    setCurtype(type[0]);
  }, [data?.hash]);

  const [cardTitle, setCardTitle] = useState(title);

  useEffect(() => {
    if (!data || curtype.length == 0) {
      return;
    }
    let dist = filterData(data, curtype, 'type');
    setCurdata(dist);

    setCardTitle(title + getUnit(dist));

    let type = chartLib.getUniqByIdx({
      key: 'prod_name',
      data: R.clone(dist.data),
    });
    setProds(type);
  }, [curtype]);

  return (
    <Card
      loading={loading}
      {...cardStyle({
        height: chartHeight,
      })}
      title={cardTitle}
      extra={
        <div className={styles.action}>
          <Radio.Group
            value={curtype}
            onChange={e => {
              setCurtype(e.target.value);
            }}
            buttonStyle="solid"
            size="small"
          >
            {type.map(item => (
              <Radio.Button key={item} value={item}>
                {item}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
      }
    >
      <TabChart data={curdata} tabs={prods} />
    </Card>
  );
};
