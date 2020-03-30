import React from 'react';
import useFetch from '@/components/hooks/useFetch';
import { Modal } from 'antd';
import SimpleTable from '@/pages/Search/components/SimpleTable';

export default ({ equid, rec_time, title = '', visible = false, setVisible }) => {
  let { data, loading } = useFetch({
    param: {
      url: '/922/f85bf29a64.json',
      params: { equid, rec_time },
    },
    valid: () => equid > 0 && rec_time,
  });

  if (!visible) {
    return null;
  }

  return (
    <Modal
      title={`${title} 在时间 ${rec_time} 前后设备维修记录`}
      visible={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      width={1000}
    >
      <SimpleTable loading={loading} data={data} />
    </Modal>
  );
};
