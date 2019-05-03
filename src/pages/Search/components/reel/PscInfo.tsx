import React, { useState, useEffect } from 'react';
import { Col, Card, Empty, Tabs } from 'antd';
import styles from '../cart/ProdList.less';
import { useFetch } from '@/pages/Search/utils/useFetch';
import Err from '@/components/Err';
import * as R from 'ramda';
const TabPane = Tabs.TabPane;

const DetailList = ({ res }) =>
  res.err ? (
    <Err err={res.err} />
  ) : res.rows === 0 ? (
    <Empty />
  ) : (
    <div className={styles.detail}>
      {R.splitEvery(Math.ceil(res.header.length / 3), res.header).map((item, idx) => (
        <Col span={8} key={idx}>
          {item.map(title => (
            <ul key={title}>
              <li>
                <strong>{title}</strong>
                {res.data[0][title] === '0.0' ? '' : res.data[0][title]}
              </li>
            </ul>
          ))}
        </Col>
      ))}
    </div>
  );

export default function PscInfo({ reel }) {
  let fetchReel = api =>
    useFetch({
      params: reel,
      type: 'reel',
      api,
      init: [reel],
    });
  let res = fetchReel('getViewPaperPsc');
  let res2 = fetchReel('getViewPaperSurface');
  let res3 = fetchReel('getViewPaperParaAbnormal');
  let res4 = fetchReel('getViewPaperValidate');
  let res5 = fetchReel('getPaperValidate');
  let res6 = fetchReel('getViewPaperCutwaste');

  return (
    <Col span={24}>
      <Card
        bodyStyle={{
          padding: '10px 20px',
        }}
        hoverable
        style={{ marginBottom: 10 }}
        className={styles.cart}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="物理站" key="1">
            <DetailList res={res} />
          </TabPane>
          <TabPane tab="物理外观检测" key="2">
            <DetailList res={res2} />
          </TabPane>
          <TabPane tab="非常规检测" key="3">
            <DetailList res={res3} />
          </TabPane>
          <TabPane tab="人工校验" key="4">
            <DetailList res={res4} />
          </TabPane>
          <TabPane tab="机检在线抽查" key="5">
            <DetailList res={res5} />
          </TabPane>
          <TabPane tab="切纸机生产原始记录校验" key="6">
            <DetailList res={res6} />
          </TabPane>
        </Tabs>
      </Card>
    </Col>
  );
}
