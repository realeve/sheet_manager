import React from 'react';
import { connect } from 'dva';
import Chart from './components/Chart';
import styles from './index.less';
import classNames from 'classnames';
import QueryCondition from '@/components/QueryCondition';
import { Spin } from 'antd';
import { ICommon } from '@/models/common';

function Charts({ dispatch, config, spinning }) {
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

const chartPage = connect(
  ({ common: { spinning }, chart: { config } }: { common: ICommon; chart: { config: any[] } }) => ({
    config,
    spinning,
  })
)(Charts);

export default chartPage;
