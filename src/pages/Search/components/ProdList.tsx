import React, { useState, useEffect } from 'react';
import * as db from '../db';
import moment from 'moment';
import { Card, Badge, Icon } from 'antd';
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
                    <Badge count={WorkClassName} className={styles.workclass} />
                    <Badge
                      count={'星期' + weekList[weekName]}
                      className={styles.workclass}
                      style={{ backgroundColor: '#337ab7' }}
                    />
                  </div>
                  <h4>{StartDate}</h4>
                </div>
                <div className={styles.detail}>
                  <ul>
                    <li>
                      <strong>
                        <Icon type="tags" /> 品种
                      </strong>
                      {ProductName}
                    </li>
                    <li>
                      <strong>
                        <Icon type="user" /> 机长
                      </strong>
                      {CaptainName}
                    </li>
                    <li>
                      <strong>
                        <Icon type="clock-circle" /> 完工时间
                      </strong>
                      {EndDate}
                    </li>
                    <li>
                      <strong>
                        <Icon type="team" /> 班组
                      </strong>
                      {TeamName}
                    </li>
                    <li>
                      <strong>
                        <Icon type="ordered-list" /> 产量
                      </strong>
                      {PrintNum}
                    </li>
                    <li>
                      <strong>
                        <Icon type="lock" /> 锁车状态
                      </strong>
                      {lockStatus}
                    </li>
                    {checkStatus && (
                      <li>
                        <strong>
                          <Icon type="eye" /> 人工复查
                        </strong>
                        {checkStatus}
                      </li>
                    )}
                    {payOperator && (
                      <li>
                        <strong>
                          <Icon type="upload" /> 付出方
                        </strong>
                        {payOperator}
                      </li>
                    )}
                    {rcvOperator && (
                      <li>
                        <strong>
                          <Icon type="environment" theme="twoTone" twoToneColor="#eb2f96" /> 接收方
                        </strong>
                        {rcvOperator}
                      </li>
                    )}
                    {rcvUser && (
                      <li>
                        <strong>
                          <Icon type="barcode" /> 付出人员
                        </strong>
                        {rcvUser}
                      </li>
                    )}
                    {WorkInfo && (
                      <li>
                        <strong>
                          <Icon type="edit" /> 原始记录
                        </strong>
                        <div className={styles.loginfo}>
                          <div>{WorkInfo}</div>
                          <span style={{ float: 'right' }}>
                            <Icon type="edit" style={{ color: '#337ab7' }} /> {CaptainName} 发表于{' '}
                            {moment(EndDate)
                              .startOf('hour')
                              .fromNow()}
                          </span>
                        </div>
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
