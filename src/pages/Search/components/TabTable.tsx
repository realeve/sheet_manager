import React, { useState, useEffect } from 'react';
import { Col, Card, Tabs } from 'antd';
import * as db from '@/pages/Search/utils/db';
import VTable from '@/components/Table';
import SimpleTable from './SimpleTable'
import * as R from 'ramda';
import { Scrollbars } from 'react-custom-scrollbars';

const TabPane = Tabs.TabPane;

let fetchData = ({ api, params }) => db[api](params)
  .then((res) => ({ ...res, loading: false, err: false }))
  .catch((err) => ({ err, loading: false, rows: 0 }));

const defaultTableSetting = {
  simple: true,
  pagesize: 10,
};

export default function LogInfo({ cart, config, simpleIdx = [], ...props }) {
  let [activeKey, setActiveKey]: [string, (str: string) => void] = useState('0');
  let [needRefresh, setNeedRefresh] = useState(new Array(config.length).fill(false));
  let [state, setState] = useState(new Array(config.length).fill({ loading: true }));

  // 重置刷新状态
  useEffect(() => {
    setNeedRefresh(new Array(config.length).fill(true));
  }, [cart]);

  useEffect(() => {
    // 当前key已经载入过数据，退出
    if (!needRefresh[activeKey]) {
      return;
    }

    let nextState = R.clone(state);
    nextState[Number(activeKey)].loading = true;
    setState(nextState);

    fetchData({ api: config[activeKey].api, params: cart }).then(data => {
      nextState[Number(activeKey)] = data;
      setState(nextState);

      let nextStatus = R.clone(needRefresh);
      nextStatus[Number(activeKey)] = false;
      setNeedRefresh(nextStatus);
    })
  }, [needRefresh[activeKey]]);

  return (
    <Col span={24} {...props}>
      <Card
        hoverable
        bodyStyle={{
          padding: '10px 20px',
        }}
        style={{ marginBottom: 10 }}
      >
        <Tabs defaultActiveKey="0" onChange={setActiveKey}>
          {
            state.map((res, key) => <TabPane tab={config[key].title} key={String(key)}>
              {
                simpleIdx.includes(key) ?
                  <Scrollbars
                    autoHide
                    style={{
                      height: 300,
                      marginBottom: 10,
                    }}>
                    <SimpleTable data={res} loading={res.loading} />
                  </Scrollbars> : <VTable dataSrc={res} loading={res.loading} {...defaultTableSetting} />
              }
            </TabPane>)
          }
        </Tabs>
      </Card>
    </Col>
  );
}
