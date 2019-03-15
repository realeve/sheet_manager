import React, { useState, useEffect } from 'react';
import * as db from '../../db';
import CardTable from '../CardTable';

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

  return <CardTable title="产品兑换记录" data={state} loading={loading} />;
}
