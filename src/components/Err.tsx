import React from 'react';
import styles from './Err.less';
import qs from 'qs';

export default function Err({ err }) {
  if (err.message) {
    return <div className={styles.error}>
      <img src="/img/500.svg" alt="" />
      <div className={styles.desc}>
        错误提示:{err.message}
      </div>
    </div>
  }

  ['tstart2', 'tend2', 'tstart3', 'tend3'].forEach((key) => {
    Reflect.deleteProperty(err.params, key);
  })
  let url = `${err.url}?${qs.stringify(err.params)}`;
  return (
    <div className={styles.error}>
      <img src="/img/500.svg" alt="" />
      <div className={styles.desc}>
        <h1>
          {err.status && `${err.status}:`}
          {err.message}:<br />
          <span>{err.description}</span>
        </h1>
        {err.params && (
          <p>
            点击调试:
              <a href={url} target="_blank">
              {url}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
