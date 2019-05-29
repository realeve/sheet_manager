import React from 'react';
import { connect } from 'dva';
import { Row } from 'antd';
import BasicInfo from './components/cart/BasicInfo';
import OfflineCheck from './components/cart/OfflineCheck';
import HechaInfo from './components/cart/HechaInfo';
import OnlineCount from './components/cart/OnlineCount';
import PackageInfo from './components/cart/PackageInfo';
import LogInfo from './components/cart/LogInfo';
import * as R from 'ramda';
import styles from './CartDetail.less';
import ProdSelect from './components/ProdSelect';
import CodeInfo from './components/cart/MahouInfo';

function CartDetail({ dispatch, ...params }) {
  // 用于冠字查车号
  const onRefresh = params => {
    if (R.isNil(params.cart) || params.cart === '') {
      return;
    }
    dispatch({
      type: 'search/setStore',
      payload: {
        ...params,
      },
    });
  };

  const { cart, type, prod, codeInfo } = params;
  return (
    <>
      <div className={styles.header}>
        <ProdSelect />
      </div>
      <Row gutter={10}>
        <BasicInfo {...params} onRefresh={onRefresh} />
        {type == 'cart' && (
          <>
            <OnlineCount cart={cart} />
            <OfflineCheck cart={cart} />
            <HechaInfo cart={cart} />
            <LogInfo cart={cart} />
            <PackageInfo cart={cart} prod={prod} code={codeInfo} />
          </>
        )}
      </Row>
    </>
  );
}

export default connect(({ search }) => ({
  ...search,
}))(CartDetail);
