import React from 'react';
import SimpleTable from '../SimpleTable';
import { useFetch } from '@/pages/Search/utils/useFetch';
import { Scrollbars } from 'react-custom-scrollbars';

export default function StorageLog({ cart }) {
  const { loadingLog, ...logData } = useFetch({
    params: cart,
    api: 'getShushujiCount',
    init: [cart],
  });
  return (
    <Scrollbars
      autoHide
      autoHeight
      autoHeightMin={300}
      autoHeightMax={970}
      style={{
        marginBottom: 10,
        width: '100%',
      }}
    >
      <SimpleTable title="大张过数记录" loading={loadingLog} data={logData} />
    </Scrollbars>
  );
}
