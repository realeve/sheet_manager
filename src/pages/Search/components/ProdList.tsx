import React, { useState, useEffect } from 'react';
import * as db from '../db';

import { Card, Badge } from 'antd';
import styles from './ProdList.less';

const weekList: string[] = ['日', '一', '二', '三', '四', '五', '六'];

export default function SearchPage({ cart }) {
  // 载入状态
  const [loading, setLoading] = useState(false);
  // 生产数据
  const [prodDetail, setProdDetail] = useState([]);
  useEffect(() => {
    getProdDetail();
  }, [cart]);

  const getProdDetail = async () => {
    setLoading(true);
    let { data } = await db.getVCbpcCartlist(cart);
    setProdDetail(data);
    setLoading(false);
  };

  let cartName: string = prodDetail.length ? prodDetail[0].CartNumber : '载入中';
  return (
    <Card
      title={`生产信息(${cartName})`}
      bodyStyle={{
        padding: '20px',
      }}
      hoverable
      style={{ marginBottom: 10 }}
      className={styles.cart}
      loading={loading}
    >
      <ul>
        {prodDetail.map(
          (
            {
              key_recid,
              ProcName,
              WorkClassName,
              MachineName,
              CaptainName,
              TeamName,
              PrintNum,
              StartDate,
              ProductName,
              WorkInfo,
              weekName,
              EndDate,
              lockStatus,
              checkStatus,
              payOperator,
              rcvOperator,
              rcvUser,
              mid,
            },
            idx
          ) => (
            <li key={key_recid}>
              <div>
                <div className={styles.title}>
                  <div>
                    <div className={styles.proc}>
                      {idx + 1}.{ProcName}：<a href={`#${mid}`}>{MachineName}</a>
                    </div>
                    <Badge status="error" className={styles['margin-left-10']}>
                      {WorkClassName}
                    </Badge>
                    <Badge status="success" className={styles['margin-left-10']}>
                      星期{weekList[weekName]}
                    </Badge>
                  </div>
                  <h4>{StartDate}</h4>
                </div>
                <div className={styles.detail}>
                  <ul>
                    <li>
                      <strong>品种</strong>
                      {ProductName}
                    </li>
                    <li>
                      <strong>机长</strong>
                      {CaptainName}
                    </li>
                    <li>
                      <strong>完工时间</strong>
                      {EndDate}
                    </li>
                    <li>
                      <strong>班组</strong>
                      {TeamName}
                    </li>
                    <li>
                      <strong>产量</strong>
                      {PrintNum}
                    </li>
                    <li>
                      <strong>锁车状态</strong>
                      {lockStatus}
                    </li>
                    {checkStatus && (
                      <li>
                        <strong>人工复查</strong>
                        {checkStatus}
                      </li>
                    )}
                    {payOperator && (
                      <li>
                        <strong>付出方</strong>
                        {payOperator}
                      </li>
                    )}
                    {rcvOperator && (
                      <li>
                        <strong>接收方(当前位置)</strong>
                        {rcvOperator}
                      </li>
                    )}
                    {rcvUser && (
                      <li>
                        <strong>付出人员</strong>
                        {rcvUser}
                      </li>
                    )}
                    {WorkInfo && (
                      <li>
                        <strong>原始记录</strong>
                        <div>{WorkInfo}</div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </li>
          )
        )}
      </ul>
    </Card>
  );
}
