import React, { useState, useEffect } from 'react';
import * as db from '../../db';
import VTable from '@/components/Table';
import { Modal } from 'antd';
import DatePicker from '@/components/DatePicker';
import styles from './ProdList.less';
export default function CartsByDate({ mid, tstart, visible, onToggle, machine }) {
  // 载入状态
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([tstart, tstart]);

  const [state, setState] = useState({ data: [], header: [] });
  const updateMachine = async ([tstart, tend]) => {
    setLoading(true);
    let res = await db.getVCbpcCartlistByMachine({ mid, tstart, tend });
    setLoading(false);
    setState(res);
  };
  useEffect(() => {
    if (mid > 0) {
      updateMachine([tstart, tstart]);
    }
  }, [mid, tstart]);
  const onDateChange = async e => {
    setDates(e);
    updateMachine(e);
  };

  return (
    <Modal
      title={
        <div className={styles['modal-title']}>
          <h3>
            {machine} {dates[0] === '' ? tstart : dates.join('至')} 生产记录
          </h3>
          <DatePicker value={[tstart]} onChange={onDateChange} />
        </div>
      }
      visible={visible}
      width="800px"
      footer={null}
      bodyStyle={{ paddingTop: 10 }}
      onCancel={() => onToggle(false)}
    >
      <VTable dataSrc={state} loading={loading} simple={true} showDownload={true} pagesize={15} />
    </Modal>
  );
}
