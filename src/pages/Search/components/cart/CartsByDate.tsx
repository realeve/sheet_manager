import React, { useState, useEffect } from 'react';
import * as db from '../../utils/db';
import VTable from '@/components/Table';
import { Modal } from 'antd';
import DatePicker from '@/components/DatePicker';
import styles from './ProdList.less';
import dayjs from 'dayjs';
import * as R from 'ramda';
export default function CartsByDate({
  mid,
  tstart,
  visible,
  onToggle,
  machine,
}: {
  mid: number | string;
  tstart: string;
  visible: boolean;
  onToggle?: any;
  machine: string;
}) {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({ data: [], header: [] });
  const updateMachine = async ([tstart, tend]: string[]) => {
    setLoading(true);
    let res = await db.getVCbpcCartlistByMachine({ mid, tstart, tend });
    setLoading(false);
    setState(res);
  };

  useEffect(() => {
    if (mid == 0 || !visible) {
      return;
    }
    updateMachine([tstart, tstart]);
  }, [visible]);

  const [dates, setDates] = useState([tstart, tstart]);
  const onDateChange = async e => {
    setDates(e);
    updateMachine([dayjs(e[0]).format('YYYYMMDD'), dayjs(e[1]).format('YYYYMMDD')]);
  };

  useEffect(() => {
    if (tstart.length) {
      setDates([tstart, tstart]);
    }
  }, [tstart]);

  return (
    <Modal
      title={
        <div className={styles['modal-title']}>
          <h3>
            <span style={{ marginRight: 5 }}>{machine}</span>
            {dates[0] === ''
              ? tstart
              : R.uniq(dates)
                  .map(item => dayjs(item).format('YYYY年MM月DD日'))
                  .join(' 至 ')}
            <span style={{ marginLeft: 5 }}>生产记录</span>
          </h3>
          <DatePicker value={dates[0] === '' ? [tstart] : dates} onChange={onDateChange} />
        </div>
      }
      visible={visible}
      width="1200px"
      footer={null}
      bodyStyle={{ paddingTop: 10 }}
      onCancel={() => onToggle(false)}
    >
      <VTable
        isAntd
        dataSrc={state}
        loading={loading}
        simple={true}
        showDownload={true}
        pagesize={15}
      />
    </Modal>
  );
}
