import React, { useState, useEffect } from 'react';
import * as db from '../../db';
import moment from 'moment';
import { Card, Badge, Icon } from 'antd';
import styles from './ProdList.less';
import * as R from 'ramda';

import CartsByDate from './CartsByDate';

const weekList: string[] = ['日', '一', '二', '三', '四', '五', '六'];

export default function ProdList({ cart, onRefresh }) {
  // 载入状态
  const [loading, setLoading] = useState(false);
  // 生产数据
  const [prodDetail, setProdDetail] = useState([]);
  useEffect(() => {
    getProdDetail();
  }, [cart]);

  const getProdDetail = async () => {
    setLoading(true);
    setVisible(false);
    let { data } = await db.getVCbpcCartlist(cart);
    setProdDetail(data);
    onRefresh(data.length ? R.last(data) : {});
    setLoading(false);
  };

  const [cartDetail, setCartDetail] = useState({ mid: 0, tstart: '', machine: '' });

  const [visible, setVisible] = useState(false);

  // 显示当天生产的其它车号
  useEffect(() => {
    if (cartDetail.mid > 0) {
      setVisible(true);
    }
  }, [cartDetail.mid]);

  const onToggle = () => {
    setVisible(false);
    setCartDetail({ mid: 0, tstart: '', machine: '' });
  };

  let cartName: string = prodDetail.length ? prodDetail[0].CartNumber : '载入中';
  return (
    <>
      <CartsByDate {...cartDetail} visible={visible} onToggle={onToggle} />
      <Card
        title={`生产信息(${cartName})`}
        bodyStyle={{
          padding: '10px 20px',
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
                WorkInfo,
                weekName,
                EndDate,
                mid,
              },
              idx
            ) => (
              <li key={key_recid}>
                <div>
                  <div className={styles.title}>
                    <div>
                      <div className={styles.text}>
                        {idx + 1}.{ProcName}：
                        <a
                          href="javascript:;"
                          onClick={() =>
                            setCartDetail({
                              mid,
                              tstart: moment(StartDate).format('YYYYMMDD'),
                              machine: MachineName,
                            })
                          }
                        >
                          {MachineName}
                        </a>
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
    </>
  );
}
