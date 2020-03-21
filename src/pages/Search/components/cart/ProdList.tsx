import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Skeleton, Badge, Empty } from 'antd';
import { Icon } from '@ant-design/compatible';
import styles from './ProdList.less';
import * as R from 'ramda';
import * as lib from '@/utils/lib';
import * as db from '@/pages/Search/utils/db';
import Err from '@/components/Err';

import CartsByDate from './CartsByDate';

import { Scrollbars } from 'react-custom-scrollbars';

const weekList: string[] = ['日', '一', '二', '三', '四', '五', '六'];

interface CartConfig {
  cart: string;
  type: string;
  prod?: string;
  onRefresh?: Function;
  beforeRender?: Function;
}

export default function ProdList({ onRefresh, beforeRender, ...params }: CartConfig) {
  const [visible, setVisible] = useState(false);
  const [cartDetail, setCartDetail] = useState({ mid: 0, tstart: '', machine: '' });
  const [res, setRes] = useState({ loading: true, rows: 0, data: [] });
  const [err, setErr] = useState(false);

  let callback = ({ data, rows }) => {
    setVisible(false);
    onRefresh && onRefresh(rows ? R.last(data) : {});
  };

  let { cart, type } = params;

  useEffect(() => {
    if (type !== 'cart') {
      return;
    }

    db.getVCbpcCartlist(cart)
      .then(res => {
        if (beforeRender) {
          res = beforeRender(res);
        }
        setRes(res);
        callback(res);
      })
      .catch(e => {
        setErr(e);
        setRes({ loading: false, rows: 0, data: [] });
      });
  }, [cart]);

  useEffect(() => {
    if (type !== 'gz' || R.isNil(params.prod)) {
      return;
    }

    let gzRes = lib.handleGZInfo({ code: params.cart, prod: params.prod });
    if (typeof gzRes === 'boolean') {
      return;
    }

    db.getCartinfoByGZ({
      prod: params.prod,
      ...gzRes,
    })
      .then(res => {
        setRes(res);
        callback(res);
      })
      .catch(e => {
        setErr(e.message);
        setRes({ loading: false, rows: 0, data: [] });
      });
  }, [params.cart, params.prod]);

  const { loading, data: prodDetail, rows } = res;
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

  // let cartName: string = rows ? `(${prodDetail[0].CartNumber})` : '';
  return (
    <>
      <CartsByDate {...cartDetail} visible={visible} onToggle={onToggle} />
      <div
        // title={`生产信息${cartName}`}
        // bodyStyle={{
        //   padding: '10px 20px',
        // }}
        // hoverable
        style={{ marginBottom: 10, padding: '10px 20px 0 20px' }}
        className={styles.detail}
        // loading={loading}
      >
        {loading ? (
          <Skeleton active />
        ) : err ? (
          <Err err={err} />
        ) : prodDetail.length === 0 ? (
          <Empty />
        ) : (
          <Scrollbars
            autoHide
            autoHeight
            autoHeightMin={300}
            autoHeightMax={970}
            style={{
              marginBottom: 10,
              width: '100%',
            }}
          >
            <ul
              style={{
                marginBottom: 10,
              }}
            >
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
                    remark,
                    remark_type,
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
                          <Badge
                            count={WorkClassName}
                            className={styles.workclass}
                            style={{ backgroundColor: '#e74c3c' }}
                          />
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
                                  <Icon type="edit" style={{ color: '#337ab7' }} /> {CaptainName}{' '}
                                  发表于{' '}
                                  {moment(EndDate)
                                    .startOf('hour')
                                    .fromNow()}
                                </span>
                              </div>
                            </li>
                          )}
                          {remark && (
                            <li style={{ background: '#ffc9ce' }}>
                              <strong>
                                <Icon type="edit" />
                                机台关注
                              </strong>
                              <div className={styles.loginfo}>
                                <div>{remark_type}:</div>
                                <div>{remark}</div>
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
          </Scrollbars>
        )}
      </div>
    </>
  );
}
