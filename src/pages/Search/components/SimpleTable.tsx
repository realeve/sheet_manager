import React from 'react';
import styles from './simpleTable.less';
import { getType } from '@/utils/lib';
import { Skeleton } from 'antd';
import * as R from 'ramda';

export default function SimpleTable({ data, loading, ...props }) {
  if (data.rows == 0) {
    return <h3>未检索到相关数据</h3>;
  }
  let dataSrc = R.clone(data.data);
  // 处理数据结构
  if (getType(dataSrc[0]) === 'object') {
    dataSrc = dataSrc.map(item => data.header.map(key => item[key]));
  }

  return loading ? (
    <Skeleton active />
  ) : (
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
