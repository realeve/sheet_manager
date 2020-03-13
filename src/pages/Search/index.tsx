import React from 'react';
import { connect } from 'dva';
import CartDetail from './CartDetail';
import ProdItem from './components/ProdItem';
import { Card } from 'antd';
import styles from './components/ProdSelect.less';
import ReelDetail from './ReelDetail';
import PlateSearch from './components/plate';

function SearchPage({ type }) {
  if (type === 'unknown') {
    return (
      <div className="ant-result ant-result-success">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: '50vh',
          }}
        >
          <div className="ant-result-title">信息追溯</div>
          <div className="ant-result-subtitle" style={{ marginBottom: 25 }}>
            查车号、查轴号、查冠字、查版号
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <img src="/img/403.svg" style={{ marginRight: 50 }} />
            <Card className={styles.prodcontainer}>
              <ProdItem />
            </Card>
          </div>
        </div>
      </div>
    );
  } else if (['cart', 'gz'].includes(type)) {
    return <CartDetail />;
  } else if (type === 'plate') {
    return <PlateSearch />;
  }
  return <ReelDetail />;
}

export default connect(({ search: { type } }) => ({
  type,
}))(SearchPage);
