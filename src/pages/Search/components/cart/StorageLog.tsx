import React from 'react';
import SimpleTable from '../SimpleTable';
import { useFetch } from '@/pages/Search/utils/useFetch';

export default function StorageLog({ cart }) {
  const { loadingLog, ...logData } = useFetch({ params: cart, api: 'getProdLog', init: [cart] });
  return (
    <div style={{
      maxHeight: 970,
      overflowY: 'auto',
      marginBottom: 10
    }}  >
      <SimpleTable title="产品流转记录" loading={loadingLog} data={logData} />
    </div>
  );
}
