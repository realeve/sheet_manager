import React, { useState, useEffect } from 'react';
import * as db from '../../db';
import SimpleChart from '../SimpleChart';
import { Card } from 'antd';

export default function CodeInfo({ cart }) {
  // 载入状态
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({ data: [], header: [] });
  useEffect(() => {
    getProdDetail();
  }, [cart]);

  const getProdDetail = async () => {
    setLoading(true);
    let res = await db.getQaInspectSlaveCode(cart);
    setState(res);
    setLoading(false);
  };

  const params = {
    type: 'bar',
    simple: '2',
    stack: true,
    barwidth: 20,
    legend: 0,
    x: 1,
    y: 2,
    smooth: true,
    reverse: true,
  };

  const beforeRender = option =>
    Object.assign(option, {
      grid: { left: 80, right: 10, top: 5, bottom: 20 },
      legend: { top: 10 },
    });

  return (
    <Card
      bodyStyle={{
        padding: 0,
      }}
      bordered={false}
      loading={loading}
    >
      <SimpleChart
        data={state}
        params={params}
        beforeRender={beforeRender}
        style={{ height: 300 }}
      />
    </Card>
  );
}
