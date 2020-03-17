import React from 'react';
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

let tabs = [
  '物理站',
  '物理外观检测',
  '纸张过程检测',
  '非常规检测',
  '人工校验',
  '机检在线抽查',
  '切纸机生产原始记录校验',
];

export default function PscInfo({ reel }) {
  let state = [];
  let fetchReel = api =>
    useFetch({
      params: reel,
      type: 'reel',
      api,
      init: [reel],
    });
  let res1 = fetchReel('getViewPaperPsc');
  let res2 = fetchReel('getViewPaperSurface');
  let res7 = fetchReel('getViewProcessCheckPaper');
  let res3 = fetchReel('getViewPaperParaAbnormal');
  let res4 = fetchReel('getViewPaperValidate');
  let res5 = fetchReel('getPaperValidate');
  let res6 = fetchReel('getViewPaperCutwaste');
  state = [res1, res2, res7, res3, res4, res5, res6];

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
          {state.length &&
            tabs.map((tab, i) => (
              <TabPane tab={tab} key={String(i)}>
                <DetailList res={state[i]} />
              </TabPane>
            ))}
        </Tabs>
      </Card>
    </Col>
  );
}
