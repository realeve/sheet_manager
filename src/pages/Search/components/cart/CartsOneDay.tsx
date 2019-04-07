import React, { useEffect, useState } from 'react';
import CardTable from '../CardTable';
import SimpleChart from '../SimpleChart';
import * as R from 'ramda';
import * as styles from './ProdList.less';
import { Card, Empty } from 'antd';
import { useFetch } from '@/pages/Search/utils/useFetch';

// 处理返回数据
let handleData = res => {
  res.data = res.data.map((item, idx) => {
    item.id = idx + 1;
    item['好品率'] = Number(item['好品率']).toFixed(2);
    item['判废结果'] =
      item['判废结果'] == '0' ? '未判废' : item['判废结果'] == '1' ? '误废' : '实废';
    return item;
  });

  let res2 = R.clone(res);
  res2.data = res2.data.map(item => {
    item['车号'] = <a href={`#${item['车号']}`}>{item['车号']}</a>;
    return item;
  });
  return { res, res2 };
};

export default function CartsOneDay({ cart }) {
  const { loading, ...mahouData } = useFetch({ params: cart, api: 'getMahoudata', init: [cart] });
  const [state, setState] = useState({ rows: 0, data: [], header: [] });
  const [cartInfo, setCartInfo] = useState({ rows: 0, data: [], header: [] });

  useEffect(() => {
    let { res, res2 } = handleData(mahouData);
    setState(res);
    setCartInfo(res2);
  }, [mahouData.data]);

  const params = { type: 'line', simple: '2', x: 1, y: 2, smooth: true };
  const beforeRender = option => ({ ...option, color: ['#e74c3c'] });

  return (
    <>
      <CardTable title="码后核查记录" data={cartInfo} loading={loading} />
      <Card
        title="码后好品率曲线图"
        bodyStyle={{
          padding: '10px 20px',
        }}
        hoverable
        style={{ marginBottom: 10 }}
        className={styles.cart}
        loading={loading}
      >
        {state.rows === 0 ? (
          <Empty />
        ) : (
          <SimpleChart
            data={state}
            params={params}
            beforeRender={beforeRender}
            style={{ height: 240 }}
          />
        )}
      </Card>
    </>
  );
}
