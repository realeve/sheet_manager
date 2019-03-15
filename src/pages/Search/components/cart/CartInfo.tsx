import React from 'react';
import { Card, Icon, Button } from 'antd';
import styles from './ProdList.less';
import * as R from 'ramda';

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
        padding: '20px 20px 10px 20px',
      }}
      hoverable
      style={{ marginBottom: 10 }}
      className={styles.cart}
      loading={loading}
    >
      <div className={styles.detail}>
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
        <div style={{ float: 'right' }}>
          <Button type="danger" className={styles.btnDanger}>
            实废图像
          </Button>
        </div>
      </div>
    </Card>
  );
}
