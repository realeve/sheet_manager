import React from 'react';
import SimpleTable from '../SimpleTable';
import { useFetch } from '@/pages/Search/utils/useFetch';
import { Scrollbars } from 'react-custom-scrollbars';

export default function StorageLog({ cart }) {
  const { loadingLog, ...logData } = useFetch({ params: cart, api: 'getProdLog', init: [cart] });
  return (
    <Scrollbars
      autoHide
      autoHeight
      autoHeightMin={300}
      autoHeightMax={970}
      style={{
        marginBottom: 10,
      }}>
      <SimpleTable title="产品流转记录" loading={loadingLog} data={logData} />
    </Scrollbars>
  );
}
