import React from 'react';
import styles from '../config.less';
import { IChart } from '../utils/lib';
import classnames from 'classnames';
const R = require('ramda');

export interface configItemProps {
  config: IChart;
  //  {
  //   key: string;
  //   type?: string;
  //   title: string;
  //   default?: string;
  //   url?: string | Array<string>;
  // };
  idx?: number;
}

export default function configItem(props: configItemProps) {
  const { key, title, type, default: defaultVal, url } = props.config;
  return (
    <li>
      <div className={styles.tip}>
        {props.idx + 1}.{key}
        {type && <span>type:{type}</span>}
      </div>

      <div className={classnames(styles.desc, 'configDemoDesc')}> {title} </div>
      {!R.isNil(defaultVal) && <div>默认值：{defaultVal}</div>}
      {!R.isNil(url) && (
        <div className={classnames(styles.desc, 'configDemoDesc')}>
          {typeof url === 'string' ? (
            <a href={url} target="_blank">
              {url}
            </a>
          ) : (
            url.map(u => (
              <a href={u} target="_blank" key={u}>
                {u}
              </a>
            ))
          )}
        </div>
      )}
    </li>
  );
}
