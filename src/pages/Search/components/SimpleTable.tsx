import React from 'react';
import styles from './simpleTable.less';
import { getType } from '@/utils/lib';
import { Skeleton, Empty } from 'antd';
import * as R from 'ramda';
import Err from '@/components/Err';

export default function SimpleTable({
  data,
  loading,
  ...props
}: {
  data: any;
  loading?: boolean;
  [key: string]: any;
}) {
  if (loading || R.isNil(data) || R.isNil(data.data)) {
    return <Skeleton active />;
  }
  if (data.err) {
    return <Err err={data.err} />;
  } else if (data.rows == 0) {
    return <Empty />;
  }

  let dataSrc = R.clone(data.data);
  // 处理数据结构
  if (dataSrc && getType(dataSrc[0]) === 'object') {
    dataSrc = dataSrc.map(R.props(data.header));
  }

  return (
    <table className={styles['table-simple']} {...props}>
      <thead>
        <tr>
          {data.header.map(th => (
            <th key={th}>{th}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSrc.map((tr, idx) => (
          <tr key={idx}>
            {tr.map((td, idx) => (
              <td key={idx}>{td}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
