import React from 'react';
import { Card } from 'antd';
import { Icon } from '@ant-design/compatible';
import styles from './ProdList.less';
import * as R from 'ramda';
import classNames from 'classnames/bind';
import CartRules from './rules';
const cx = classNames.bind(styles);

export default function CartInfo({ cartInfo }) {
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
  } = cartInfo;
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
}
