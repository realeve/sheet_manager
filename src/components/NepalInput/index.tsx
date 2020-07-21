import React from 'react';
import styles from './index.less';
import { message } from 'antd';
import classnames from 'classnames';

import { CopyToClipboard } from 'react-copy-to-clipboard';

let alphas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let alphaLowercase = alphas.map(item => item.toLowerCase());
let nums = '0123456789'.split('');
export let initStr = 'BCDEF';

let arrs = [...alphaLowercase, ...alphas].filter(item => !['O', 'o', 'I', 'l'].includes(item));

export let orderIdx: { [key: string]: number } = {};
arrs.forEach((key, idx) => {
  orderIdx[key] = idx + 1;
});

const SymbolList = ({
  list: arr,
  onClick,
  needCopy = true,
  ...props
}: {
  list: string[];
  [key: string]: any;
}) => {
  return (
    <div className={styles.nepalList} {...props}>
      <ul className={styles.row} style={{ height: 30, lineHeight: 30 }}>
        {arr.map((item: string) => (
          <li
            key={item}
            className={classnames({
              [styles.highlight]: initStr.includes(item),
            })}
          >
            <div className={styles.str}>{item}</div>
            <div className={styles.idx}>{orderIdx[item]}</div>
          </li>
        ))}
      </ul>

      <ul className={classnames(styles.row, 'nepal')}>
        {arr.map((item: string) => (
          <CopyToClipboard
            key={item}
            text={item}
            onCopy={() => {
              needCopy && message.success('拷贝成功');
            }}
          >
            <li
              onClick={() => {
                onClick && onClick(item);
              }}
              title={item == 'O' ? '占位符' : item}
              className={classnames({
                [styles.highlight]: initStr.includes(item),
              })}
            >
              {item}
            </li>
          </CopyToClipboard>
        ))}
      </ul>
    </div>
  );
};

let getList = (arr: string[], validStr: string) =>
  validStr ? arr.filter(item => validStr.includes(item)) : arr;

export default ({
  onClick,
  validStr = initStr,
  needCopy = true,
}: {
  onClick?: (e: any) => void;
  validStr?: string | boolean;
  needCopy?: boolean;
}) => {
  return (
    <div className={styles.alignRow} style={{ width: '100%', flexWrap: 'wrap' }}>
      <SymbolList needCopy={needCopy} onClick={onClick} list={getList(alphaLowercase, validStr)} />
      <SymbolList needCopy={needCopy} onClick={onClick} list={getList(alphas, validStr)} />
      <SymbolList needCopy={needCopy} onClick={onClick} list={nums} />
    </div>
  );
};
