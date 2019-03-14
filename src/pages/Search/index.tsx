import React from 'react';
import { connect } from 'dva';
import Exception from 'ant-design-pro/lib/Exception';
import { Link } from 'react-router-dom';
import CartDetail from './CartDetail';

function SearchPage({ reel, cart, type }) {
  if (type === 'unknown') {
    return (
      <Exception
        type="403"
        desc="目前只支持车号及轴号查询追溯"
        linkElement={Link}
        img="/img/403.svg"
        backText="返回首页"
      />
    );
  } else if (type === 'cart') {
    return <CartDetail cart={cart} />;
  }
  return <h1>3232adf</h1>;
}

export default connect(({ search }) => ({
  ...search,
}))(SearchPage);
