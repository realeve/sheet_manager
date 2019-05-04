import React, { useState, useEffect } from 'react';
import { Row, Card, Button, message } from 'antd';
import styles from './index.less';
import * as db from './utils/db';
import 'animate.css';
import classNames from 'classnames/bind';
import OnlinePanel from './components/OnlineInfo';

const cx = classNames.bind(styles);

export default function Dashboard() {
  let [visible, setVisible] = useState(false);
  let [curIdx, setCurIdx] = useState(0);
  let [state, setState] = useState({ rows: 0, data: [], title: '' })
  const refresh = async () => {
    let res = await db.getViewPrintOnlineQuality();
    setState(res);
    message.success('数据刷新成功');
  }
  useEffect(() => {
    refresh();
    // 30 秒刷新一次
    let itvId = setInterval(refresh, 1000 * 30);
    return function cleanup() {
      clearInterval(itvId);
    };
  }, [])


  return (
    <Row gutter={10}>
      {state.rows > 0 && (
        <OnlinePanel
          visible={visible}
          res={state.data[curIdx]}
          onOk={() => {
            setVisible(false);
          }}
        />
      )}
      <Card title={state.title} bodyStyle={{ padding: 10 }}>
        <div className={styles.dashboard}>
          <ul className={styles.content}>
            {state.data.map((item, idx) => (
              <li key={item.machine_name}>
                <div className={cx(styles.mask, 'animated', 'zoomIn')}>
                  <div className={styles.wrap}>
                    {item.image_1.length > 30 && <img src={item.image_1} alt={item.machine_name} />}
                  </div>
                  <div className={styles.desc}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                        type="danger"
                        onClick={() => {
                          setVisible(true);
                          setCurIdx(idx);
                        }}
                      >
                        查看详情
                      </Button>
                    </div>
                    <div className={styles.block}>
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
