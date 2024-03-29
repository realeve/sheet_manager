import React from 'react';
import styles from './simpleTable.less';
import { getType } from '@/utils/lib';
import { Skeleton, Empty } from 'antd';
import * as R from 'ramda';
import Err from '@/components/Err';
import * as lib from '@/utils/lib';
import * as setting from '@/utils/setting';

const searchUrl = setting.searchUrl;

const getTableCell = (tdValue, i: number, tr: any[]) => {
  const isCart: boolean = lib.isCart(tdValue);

  if (lib.isReel(tdValue) || isCart) {
    let url = searchUrl;
    let attrs: {
      href: string;
      target?: string;
    } = {
      href: url + tdValue,
    };
    // if (!simpleMode) {
    //   attrs.target = '_blank';
    // }
    return <a {...attrs}> {tdValue} </a>;
  }
  return tdValue;
};

export default function SimpleTable({
  data,
  loading, getTd,
  ...props
}: {
  data: any;
  loading?: boolean;
  getTd?: (item: any, i: number, tr: any[]) => React.ReactNode,
  [key: string]: any;
}) {
  if (loading || R.isNil(data) || R.isNil(data.data)) {
    return <Skeleton active />;
  }
  if (data.err) {
    return <Err err={data.err} />;
  } else if (data.rows == 0) {
    return <Empty description="查询无结果，请更换检索日期重试" />;
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
            {tr.map((td, idx, tr) => (
              <td key={idx}>{(getTd || getTableCell)(td, idx, tr)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
