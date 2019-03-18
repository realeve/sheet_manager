import React, { useState, useEffect } from 'react';
import { Button, Popconfirm, Row, Col, Input, Radio } from 'antd';
import styles from './ProdSelect.less';
import router from 'umi/router';
import * as R from 'ramda';
import { getProdType } from '../models/search';
import { connect } from 'dva';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

function ProdSelect({ cart, dispatch }) {
  const [prod, setProd] = useState(null);
  const [state, setState] = useState(cart);
  useEffect(() => {
    setState(cart);
  }, [cart]);

  const prodList = ['9602A', '9603A', '9604A', '9606T', '9607T'];

  const confirm = () => {
    let type: string = getProdType(state);
    if (type === 'unknown' || (type === 'gz' && R.isNil(prod))) {
      return;
    } else if (type === 'reel') {
      router.push('#' + state);
      return;
    }
    dispatch({
      type: 'search/setStore',
      payload: {
        type,
        prod,
        cart: state,
      },
    });
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
            defaultValue={cart}
            value={state}
            onChange={e => setState(e.target.value.trim().toUpperCase())}
            style={{ width: 270 }}
            maxLength={8}
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

export default connect(({ search }) => ({
  ...search,
}))(ProdSelect);
