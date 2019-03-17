import React, { useState, useEffect } from 'react';
import { Button, Popconfirm, Row, Col, Input, Radio } from 'antd';
import styles from './ProdSelect.less';
import router from 'umi/router';
import * as R from 'ramda';
import * as lib from '@/utils/lib';

// import { useFetch } from '@/pages/Search/utils/useFetch';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const getStrType = str => {
  if (lib.isCart(str)) {
    return 'cart';
  }
  if (lib.isGZ(str)) {
    return 'gz';
  }
  if (lib.isReel(str)) {
    return 'reel';
  }
  return 'unknown';
};

export default function ProdSelect({ cart, onChange }) {
  const [prod, setProd] = useState(null);
  const [state, setState] = useState(cart);

  // const state = useFetch({ params: cart, api: 'getQaInspectSlaveCode' });
  const prodList = ['9602A', '9603A', '9604A', '9606T', '9607T'];

  const confirm = () => {
    let type: string = getStrType(state);
    if (type === 'unknown' || (type === 'gz' && R.isNil(prod))) {
      return;
    }
    if (type === 'reel') {
      router.push('#' + state);
      return;
    }
    // 查询冠字或车号
    onChange({ type, prod, cart: state });
  };

  const container = (
    <div>
      <h3 className={styles.title}>
        <span>查询条件</span>
      </h3>
      <Row className={styles['form-control']}>
        <Col span={4}>品种</Col>
        <Col span={20}>
          <RadioGroup onChange={e => setProd(e.target.value)} value={prod} size="small">
            {prodList.map(value => (
              <RadioButton value={value} key={value}>
                {value}
              </RadioButton>
            ))}
          </RadioGroup>
        </Col>
      </Row>
      <Row className={styles['form-control']}>
        <Col span={4}>
          冠字/
          <br />
          车号
        </Col>
        <Col span={20}>
          <Input
            size="small"
            placeholder="输入冠字或车号信息(A0A001)"
            allowClear
            defaultValue={state}
            value={state}
            onChange={e => setState(e.target.value.trim().toUpperCase())}
            style={{ width: 270 }}
          />
        </Col>
      </Row>
      <div className={styles.block}>
        <p>提示：查字查询请输入前六位，如"A2A400"，品种信息必须选择。</p>
        <p>指定冠字请在结果中加1，如"AA0000"请查询"AA0001"。</p>
      </div>
    </div>
  );

  return (
    <Popconfirm
      placement="left"
      overlayClassName={styles.prodcontainer}
      trigger="hover"
      title={container}
      icon={null}
      onConfirm={confirm}
    >
      <Button>冠号查询</Button>
    </Popconfirm>
  );
}
