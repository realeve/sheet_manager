import React, { useEffect } from 'react';
import { connect } from 'dva';
import Chart from './components/Chart';
import styles from './index.less';
import classNames from 'classnames';
import QueryCondition from '@/components/QueryCondition';
import { Spin } from 'antd';
import * as R from 'ramda';

function Charts({ dispatch, config, spinning, tid, query }) {
  const onLoad = curPageName => {
    dispatch({
      type: 'common/setStore',
      payload: {
        curPageName,
      },
    });
  };

  useEffect(() => {
    refreshData();
  }, [JSON.stringify(tid), JSON.stringify(query)]);

  const refreshData = () => {
    dispatch({
      type: 'chart/refreshData',
    });
  };

  console.log(config)
  return (
    <Spin size="large" tip="载入中..." spinning={spinning}>
      <QueryCondition onQuery={refreshData} />
      {config.map((option, idx) => (
        <div className={classNames({ [styles.tableContainer]: idx })} key={option.nonce + idx}>
          <Chart onLoad={onLoad} config={option} idx={idx} />
        </div>
      ))}
    </Spin>
  );
}

const chartPage = connect(state => ({
  ...state.chart,
  ...R.pick(['spinning', 'query', 'tid'])(state.common),
}))(Charts);

export default React.memo(chartPage, (prevProps, nextProps) =>
  R.equals(prevProps.config, nextProps.config)
);
