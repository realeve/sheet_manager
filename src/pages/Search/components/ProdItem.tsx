import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Input, Radio } from 'antd';
import styles from './ProdSelect.less';
import router from 'umi/router';
import * as R from 'ramda';
import { connect } from 'dva';
import * as lib from '../models/search.js';
import { formatMessage } from 'umi/locale';
import { useDebounce } from 'react-use';

import CartRule from './cart/rules';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

function ProdItem({ cart, onClose, dispatch }) {
  const [prod, setProd] = useState(null);
  const [state, setState] = useState(cart);
  useEffect(() => {
    setState(cart);
  }, [cart]);

  const prodList = ['9602A', '9602T', '9603A', '9603T', '9604A', '9604T', '9606T', '9607T'];

  const confirm = cart => {
    let type = lib.getProdType(cart);

    if (type === 'unknown' || (type === 'gz' && R.isNil(prod))) {
      return;
    } else if (['reel', 'plate'].includes(type)) {
      router.push('#' + cart);
      return;
    }

    dispatch({
      type: 'search/setStore',
      payload: {
        type,
        prod,
        cart,
      },
    });
  };

  const searchChange = value => {
    let val = value.trim().toUpperCase();
    setState(val);
  };

  useDebounce(
    () => {
      confirm(state);
    },
    800,
    [state]
  );

  const onQuery = () => {
    confirm(state);
    onClose && onClose();
  };

  return (
    <div>
      <div className={styles.title}>
        <span>{formatMessage({ id: 'app.querycondition' })}</span>
        <CartRule />
      </div>
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
        <Col span={8}>冠字/车号/轴号/印版</Col>
        <Col span={16}>
          <Input
            size="small"
            placeholder="输入冠字、车号、印版信息(A0A001)"
            allowClear
            defaultValue={cart}
            value={state}
            onChange={e => searchChange(e.target.value)}
            style={{ width: 250 }}
            maxLength={12}
          />
        </Col>
      </Row>
      <div className={styles.block}>
        <p>提示：查字查询请输入前六位，如"A2A400"，品种信息必须选择。</p>
        <p>指定冠字请在结果中加1，如"AA0000"请查询"AA0001"。</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
        <Button type="primary" onClick={onQuery}>
          查询
        </Button>
      </div>
    </div>
  );
}

export default connect(({ search }) => ({
  ...search,
}))(ProdItem);
