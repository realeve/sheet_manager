import React, { useState, useEffect } from 'react';
import * as db from '../../db';
import { Card, Icon } from 'antd';
import styles from './ProdList.less';
import * as R from 'ramda';

export default function LockReason({ cart }) {
  // 载入状态
  const [loading, setLoading] = useState(false);
  const [lockReason, setLockReason] = useState([]);
  useEffect(() => {
    getProdDetail();
  }, [cart]);

  const getProdDetail = async () => {
    setLoading(true);
    let { data } = await db.getLockReason(cart);
    setLockReason([R.last(data)]);
    setLoading(false);
  };
  return (
    <Card
      title={`锁车原因`}
      bodyStyle={{
        padding: '10px 20px',
      }}
      hoverable
      style={{ marginBottom: 10 }}
      className={styles.cart}
      loading={loading}
    >
      <ul>
        {lockReason.length === 0 && <li>未查询到锁车原因</li>}
        {lockReason.map(({ locktype, username, reason, rec_time }, idx) => (
          <li key={idx}>
            <div>
              <div className={styles.detail}>
                <ul>
                  <li>
                    <strong>
                      <Icon type="ordered-list" /> 类型
                    </strong>
                    {locktype}
                  </li>
                  <li>
                    <strong>
                      <Icon type="user" /> 操作员
                    </strong>
                    {username}
                  </li>
                  <li>
                    <strong>
                      <Icon type="clock-circle" /> 锁车时间
                    </strong>
                    {rec_time}
                  </li>
                  <li>
                    <strong>
                      <Icon type="edit" /> 锁车原因
                    </strong>
                    {reason}
                  </li>
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
