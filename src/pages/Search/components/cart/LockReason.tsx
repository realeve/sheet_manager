import React from 'react';
import { Card, Icon, Empty } from 'antd';
import styles from './ProdList.less';
import * as R from 'ramda';
import { useFetch } from '@/pages/Search/utils/useFetch';

export default function LockReason({ cart }) {
  const { data, loading, rows } = useFetch({ params: cart, api: 'getLockReason', init: [cart] });
  let lockReason = [R.last(data)];
  return !rows ? null : (
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
