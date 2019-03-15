import React, { useState, useEffect } from 'react';
import * as db from '../../db';
import VTable from '@/components/Table';
import { Modal } from 'antd';

export default function CartsByDate({ mid, tstart, visible, onToggle, machine }) {
  // 载入状态
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({ data: [], header: [] });

  const updateMachine = async () => {
    let res = await db.getVCbpcCartlistByMachine({ mid, tstart, tend: tstart });
    setState(res);
  };

  useEffect(() => {
    if (mid > 0) {
      setLoading(true);
      updateMachine();
      setLoading(false);
    }
  }, [{ mid, tstart }]);

  return (
    <Modal
      title={`${machine} ${tstart} 生产记录`}
      visible={visible}
      width="800px"
      footer={null}
      onCancel={() => onToggle(false)}
    >
      <VTable dataSrc={state} loading={loading} simple={true} showDownload={true} pagesize={15} />
    </Modal>
  );
}
