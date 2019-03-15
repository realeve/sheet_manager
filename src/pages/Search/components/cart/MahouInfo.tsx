import React, { useState, useEffect } from 'react';
import * as db from '../../db';
import SimpleChart from '../SimpleChart';
import SimpleTable from '../SimpleTable';
import { Card } from 'antd';
import * as R from 'ramda';

export default function CodeInfo({ cart }) {
  // 载入状态
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({ data: [], header: [] });
  const [errCount, setErrCount] = useState({ data: [], header: [] });
  useEffect(() => {
    getProdDetail();
  }, [cart]);

  const getProdDetail = async () => {
    setLoading(true);
    let res = await db.getMahoudataLog(cart);
    let errDetail = { header: [], data: [] };
    if (res.rows) {
      errDetail.header = res.header.slice(-9);
      errDetail.data[0] = R.props(errDetail.header, res.data[0]);
      console.log(errDetail);
    }
    setState(res);
    setLoading(false);
  };

  return (
    <Card
      bodyStyle={{
        padding: 0,
      }}
      bordered={false}
      loading={loading}
    >
      <SimpleTable data={state} />
    </Card>
  );
}
