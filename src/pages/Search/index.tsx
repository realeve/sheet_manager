import React from 'react';
import { connect } from 'dva';
import CartDetail from './CartDetail';
import ProdItem from './components/ProdItem';
import { Card, Result } from 'antd';
import styles from './components/ProdSelect.less';
import ReelDetail from './ReelDetail';
const Link = () => (
  <Card className={styles.prodcontainer}>
    <ProdItem />
  </Card>
);
function SearchPage({ type }) {
  if (type === 'unknown') {
    return <Result status="403" title="信息追溯" subTitle="查车号、查轴号、查冠字" extra={Link} />;
  } else if (['cart', 'gz'].includes(type)) {
    return <CartDetail />;
  }
  return <ReelDetail />;
}

export default connect(({ search: { type } }) => ({
  type,
}))(SearchPage);
