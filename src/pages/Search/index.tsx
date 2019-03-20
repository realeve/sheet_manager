import React from 'react';
import { connect } from 'dva';
import Exception from 'ant-design-pro/lib/Exception';
import CartDetail from './CartDetail';
import ProdItem from './components/ProdItem';
import { Card } from 'antd';
import styles from './components/ProdSelect.less';

const Link = () => (
  <Card className={styles.prodcontainer}>
    <ProdItem />
  </Card>
);
function SearchPage({ type }) {
  if (type === 'unknown') {
    return (
      <Exception
        type="403"
        title="信息追溯"
        desc="查车号、查轴号、查冠字"
        linkElement={Link}
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
