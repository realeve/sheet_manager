import React, { useState, useEffect } from 'react';
import * as db from '../../db';
import { Card } from 'antd';
import styles from './ProdList.less';
import SimpleTable from '../SimpleTable';
import SimpleChart from '../SimpleChart';
import * as R from 'ramda';

export default function CartsOneDay({ cart }) {
  // 载入状态
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({ data: [], header: [] });
  const [cartInfo, setCartInfo] = useState({ data: [], header: [] });
  useEffect(() => {
    getProdDetail();
  }, [cart]);

  const getProdDetail = async () => {
    setLoading(true);
    let res = await db.getMahoudata(cart);
    res.data = res.data.map((item, idx) => {
      item.id = idx + 1;
      item['好品率'] = Number(item['好品率']).toFixed(2);
      item['判废结果'] =
        item['判废结果'] == '0' ? '未判废' : item['判废结果'] == '1' ? '误废' : '实废';
      return item;
    });
    setState(res);

    let res2 = R.clone(res);
    res2.data = res2.data.map((item, idx) => {
      item['车号'] = <a href={`#${item['车号']}`}>{item['车号']}</a>;
      return item;
    });
    setCartInfo(res2);
    setLoading(false);
  };

  const params = { type: 'line', simple: '2', x: 1, y: 2, smooth: true };

  return (
    <>
      <Card
        title={`当日核查质量记录`}
        bodyStyle={{
          padding: '20px',
        }}
        hoverable
        style={{ marginBottom: 10 }}
        className={styles.cart}
        loading={loading}
      >
        <SimpleTable data={cartInfo} />
      </Card>
      <Card
        title={`当日核查质量记录`}
        bodyStyle={{
          padding: '20px',
        }}
        hoverable
        style={{ marginBottom: 10 }}
        className={styles.cart}
        loading={loading}
      >
        <SimpleChart data={state} params={params} style={{ height: 240 }} />
      </Card>
    </>
  );
}
