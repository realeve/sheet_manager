import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import * as db from '../../db';
import SimpleTable from '../SimpleTable';

export default function OffineCheck({ cart }) {
  const [state, setState] = useState({ rows: 0 });
  const [loading, setLoading] = useState(false);
  let loadData = async () => {
    setLoading(true);
    let res = await db.getUdtPsExchange(cart);
    setState(res);
    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, [cart]);

  return (
    <Card
      title="产品兑换记录"
      hoverable
      bodyStyle={{
        padding: '20px 20px 10px 20px',
      }}
      style={{ marginBottom: 10 }}
      loading={loading}
    >
      <SimpleTable data={state} />
    </Card>
  );
}
