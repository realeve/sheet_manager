import React from 'react';
import { connect } from 'dva';
import Chart from './components/Chart';
import styles from './index.less';
import classNames from 'classnames';
import QueryCondition from '@/components/QueryCondition';

function Charts({ dispatch, config }) {
  const onLoad = curPageName => {
    dispatch({
      type: 'common/setStore',
      payload: {
        curPageName,
      },
    });
  };

  const refreshData = () => {
    dispatch({
      type: 'chart/refreshData',
    });
  };

  return (
    <>
      <QueryCondition onQuery={refreshData} />
      {config.map((option, idx) => (
        <div className={classNames({ [styles.tableContainer]: idx })} key={option.nonce + idx}>
          <Chart onLoad={onLoad} config={option} idx={idx} />
        </div>
      ))}
    </>
  );
}

export default connect(state => ({ ...state.chart }))(Charts);
