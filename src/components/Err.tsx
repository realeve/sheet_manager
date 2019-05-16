import React from 'react';
import styles from './Err.less';
import qs from 'qs';

export default function Err({ err }) {
  Reflect.deleteProperty(err.params, 'tstart2');
  Reflect.deleteProperty(err.params, 'tend2');
  Reflect.deleteProperty(err.params, 'tstart3');
  Reflect.deleteProperty(err.params, 'tend3');

  let url = `${err.url}?${qs.stringify(err.params)}`;
  return (
    <div>
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
    </div>
  );
}
