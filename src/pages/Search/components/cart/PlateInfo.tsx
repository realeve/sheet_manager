import React from 'react';
import useFetch from '@/components/hooks/useFetch';
import { Modal } from 'antd';
import SimpleTable from '@/pages/Search/components/SimpleTable';

export default ({ equid, rec_time, title = '', visible = false, setVisible }) => {
  let { data, loading } = useFetch({
    param: {
      url: '/923/00499d89d2.json',
      params: { equid, rec_time },
    },
    valid: () => visible && equid > 0 && rec_time,
  });

  if (!visible) {
    return null;
  }

  return (
    <Modal
      title={`${title} 在时间 ${rec_time} 前上机印版记录`}
      visible={visible}
      onCancel={() => setVisible(false)}
      width={1000}
      footer={null}
    >
      <SimpleTable loading={loading} data={data} />
    </Modal>
  );
};
