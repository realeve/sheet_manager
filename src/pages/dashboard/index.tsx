import React, { useState, useEffect } from 'react';
import { Row, Card } from 'antd';
import styles from './index.less';
import { useFetch } from './utils/useFetch';
import 'animate.css';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function Dashboard() {
  let res = useFetch({ api: 'getViewPrintOnlineQuality' });
  console.log(res);
  return (
    <Row gutter={10}>
      <Card title={res.title} bodyStyle={{ padding: 10 }}>
        <div className={styles.dashboard}>
          <ul className={styles.content}>
            {res.data.map(item => (
              <li key={item.machine_name}>
                <div className={cx(styles.mask, 'animated', 'zoomIn')}>
                  <div className={styles.wrap}>
                    {item.image_1.length > 30 && <img src={item.image_1} alt={item.machine_name} />}
                  </div>
                  <div className={styles.desc}>
                    <div>
                      <p>
                        第{item.k_info_1}开/{item.fake_num}条
                      </p>
                      <p>{item.machine_name}</p>
                    </div>
                  </div>
                </div>
                <div
                  className={cx(styles.title, {
                    error: item.good_rate < 80,
                    success: item.good_rate > 90,
                  })}
                >
                  {item.machine_name}:{Number(item.good_rate)}%
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </Row>
  );
}
