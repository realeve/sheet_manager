import React, { useState, useEffect } from 'react';
import { Card, Radio, Tabs } from 'antd';
import chartLib, { CHART_MODE } from '@/pages/chart/utils/lib';
import styles from './product_print.less';

import { cardStyle } from '../../components/Cards';
import SimpleChart from '@/pages/Search/components/SimpleChart';

import * as R from 'ramda';
import Err from '@/components/Err';
import { AxiosError, IAxiosState } from '@/utils/axios';

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

export let _beforeRender = e => {
  if (e.legend) {
    e.legend = {
      ...e.legend,
      top: -5,
    };
  }
  return e;
};

const TabChart = ({ data, tabs, tabKey, chartParam, chartHeight, beforeRender }) => {
  const [curprod, setCurprod] = useState(null);

  useEffect(() => {
    if (!tabs || tabs.length == 0) {
      return;
    }
    setCurprod(tabs[0]);
  }, [tabs]);

  if (data && (tabs.length == 0 || R.isNil(tabKey))) {
    return (
      <SimpleChart
        data={data}
        params={chartParam}
        style={{ height: chartHeight - 70, width: '100%' }}
        beforeRender={e => {
          let res = _beforeRender(e);
          return beforeRender ? beforeRender(res) : res;
        }}
      />
    );
  }

  return (
    data && (
      <Tabs activeKey={curprod} onChange={setCurprod} type="line">
        {tabs.map(prod => (
          <Tabs.TabPane tab={prod} key={prod}>
            <SimpleChart
              data={filterData(data, prod, tabKey)}
              params={chartParam}
              style={{ height: chartHeight - 70, width: '100%' }}
              beforeRender={e => {
                let res = _beforeRender(e);
                return beforeRender ? beforeRender(res) : res;
              }}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
    )
  );
};
export interface IGroupCard {
  title: React.ReactNode;
  loading?: boolean;
  data: null | IAxiosState;
  error?: AxiosError;
  radioIdx?: number;
  tabIdx?: number;
  chartHeight?: number;
  chartParam?: {
    type?: string;
    simple?: CHART_MODE;
    x: number;
    y: number;
    legend?: number;
    renderer?: 'svg' | 'canvas';
    [key: string]: any;
  };
  callback?: (e: any, a: any) => any;
  beforeRender: (e: any) => any;
  [key: string]: any;
}
export default ({
  title,
  loading,
  data,
  error,
  radioIdx,
  tabIdx,
  chartHeight = 300,
  chartParam = {
    type: 'line',
    smooth: true,
    simple: CHART_MODE.HIDE_ALL,
    x: 2,
    y: 4,
    legend: 0,
    renderer: 'svg',
  },
  callback,
  beforeRender,
}: IGroupCard) => {
  const [type, setType] = useState([]);
  const [curtype, setCurtype] = useState('');
  const [curdata, setCurdata] = useState(null);

  const [prods, setProds] = useState([]);

  useEffect(() => {
    if (!data) {
      return;
    }
    let key = data.header[radioIdx];

    let type = chartLib.getUniqByIdx({
      key,
      data: R.clone(data.data),
    });

    setType(type);
    setCurtype(type[0]);
  }, [data?.hash]);

  useEffect(() => {
    if (!data || (curtype || '').length == 0) {
      return;
    }
    let key = data.header[radioIdx];
    let dist = filterData(data, curtype, key);
    setCurdata(dist);

    if (typeof tabIdx != 'undefined') {
      let tabKey = data.header[tabIdx];

      let type = chartLib.getUniqByIdx({
        key: tabKey,
        data: R.clone(dist.data),
      });
      setProds(type);
    }
  }, [curtype]);

  return (
    <Card
      loading={loading}
      {...cardStyle({
        height: chartHeight,
      })}
      title={title}
      extra={
        <div className={styles.action}>
          <Radio.Group
            value={curtype}
            onChange={e => {
              setCurtype(e.target.value);
              callback && callback(e.target.value, data);
            }}
            buttonStyle="solid"
            // size="small"
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
      {error && <Err err={error} />}
      <TabChart
        chartHeight={chartHeight}
        data={curdata}
        tabs={prods}
        tabKey={data?.header[tabIdx]}
        chartParam={chartParam}
        beforeRender={beforeRender}
      />
    </Card>
  );
};
