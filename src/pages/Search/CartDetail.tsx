import React from 'react';
import { connect } from 'dva';
import { Row } from 'antd';
import BasicInfo from './components/cart/BasicInfo';
import OfflineCheck from './components/cart/OfflineCheck';
import HechaInfo from './components/cart/HechaInfo';

function SearchPage({ cart, dispatch }) {
  // 用于冠字查车号
  const onRefresh = cart => {
    dispatch({
      type: 'search/setStore',
      payload: {
        cart,
      },
    });
  };

  return (
    <Row gutter={10}>
      <BasicInfo cart={cart} onRefresh={onRefresh} />
      <OfflineCheck cart={cart} />
      <HechaInfo cart={cart} />
    </Row>
  );
}

export default connect(({ search }) => ({
  ...search,
}))(SearchPage);
