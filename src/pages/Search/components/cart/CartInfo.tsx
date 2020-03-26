import React from 'react';
import { Card } from 'antd';
import { Icon } from '@ant-design/compatible';
import styles from './ProdList.less';
import * as R from 'ramda';
import classNames from 'classnames/bind';
import CartRules from './rules';
import useFetch from '@/components/hooks/useFetch';

const cx = classNames.bind(styles);

const CartInfo = ({ res }) => {
  let {
    CartNumber,
    ProductName,
    GzNumber,
    TechTypeName,
    lockStatus,
    checkStatus,
    payOperator,
    rcvOperator,
    rcvUser,
  } = res;
  let loading = R.isNil(CartNumber);

  return (
    <Card
      title={`车号信息`}
      bodyStyle={{
        padding: '10px 20px',
      }}
      hoverable
      style={{ marginBottom: 10 }}
      className={styles.cart}
      loading={loading}
      extra={<CartRules />}
    >
      <div className={styles.detail} style={{ flexDirection: 'column' }}>
        <ul>
          <li>
            <strong>
              <Icon type="credit-card" /> 车号
            </strong>
            {CartNumber}
          </li>
          <li>
            <strong>
              <Icon type="tags" /> 品种
            </strong>
            {ProductName}
          </li>
          <li>
            <strong>
              <Icon type="clock-circle" /> 冠字
            </strong>
            {GzNumber}
          </li>
          <li>
            <strong>
              <Icon type="share-alt" /> 工艺
            </strong>
            {TechTypeName}
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
        </ul>
        <div>
          <a
            className={cx(['ant', 'ant-btn', styles.btnDanger])}
            href={`/search/image#${CartNumber}`}
          >
            实废图像
          </a>
        </div>
      </div>
    </Card>
  );
};

export default ({ cartInfo, cart: carno }) => {
  /**
   *   useFetch (React hooks)
   *   @database: { MES系统_生产环境 }
   *   @desc:     { 指定车号立体库工艺查询 }
   *   useFetch 返回值说明： data(返回数据), error(报错), loading(加载状态), reFetch(强制刷新),setData(强制设定数据)
   */
  const { data, error, loading } = useFetch({
    param: {
      url: `//10.8.1.25:100/api/898/8cd5e99472.json`,
      params: { carno },
    },
    // valid:()=>true , // params中指定参数存在时才发起请求
  });

  if (data && data.rows === 0) {
    return <CartInfo res={cartInfo} />;
  }

  const icons = [
    'credit-card',
    'tags',
    'clock-circle',
    'apartment',
    'share-alt',
    'node-index',
    'aim',
    'user',
    'lock',
    'clock-circle',
  ];
  return (
    <Card
      title={`车号信息`}
      bodyStyle={{
        padding: '10px 20px',
      }}
      hoverable
      style={{ marginBottom: 10 }}
      className={styles.cart}
      loading={loading}
      extra={<CartRules />}
    >
      <div className={styles.detail} style={{ flexDirection: 'column' }}>
        <ul>
          {data &&
            data.rows > 0 &&
            data.header.map((key, idx) => (
              <li key={key}>
                <strong>
                  <Icon type={icons[idx]} /> {key}
                </strong>
                {data.data[0][key]}
              </li>
            ))}
        </ul>
        <div>
          <a className={cx(['ant', 'ant-btn', styles.btnDanger])} href={`/search/image#${carno}`}>
            实废图像
          </a>
        </div>
      </div>
    </Card>
  );
};
