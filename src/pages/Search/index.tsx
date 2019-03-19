import React from 'react';
import { connect } from 'dva';
import Exception from 'ant-design-pro/lib/Exception';
import CartDetail from './CartDetail';
import ProdSelect from './components/ProdSelect';

function SearchPage({ type }) {
  if (type === 'unknown') {
    return (
      <Exception
        type="403"
        title="信息追溯"
        desc="点击以下按钮查询车号或轴号信息"
        linkElement={ProdSelect}
        img="/img/403.svg"
      />
    );
  } else if (['cart', 'gz'].includes(type)) {
    return <CartDetail />;
  }
  return <h1>轴号查询</h1>;
}

export default connect(({ search: { type } }) => ({
  type,
}))(SearchPage);
