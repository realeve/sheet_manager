import React from 'react';
import { connect } from 'dva';
import Chart from './components/Chart';
import styles from './index.less';
import classNames from 'classnames';
import QueryCondition from '@/components/QueryCondition';

function Charts({ dispatch, config, selectList, selectValue }) {
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

  const onChange = (value, idx, key) => {
    dispatch({
      type: 'chart/refreshSelector',
      payload: {
        idx,
        data: { [key]: value },
      },
    });
  };

  return (
    <>
      <QueryCondition
        data={selectList}
        selectValue={selectValue}
        onSelectChange={onChange}
        onQuery={refreshData}
      />
      {config.map((option, idx) => (
        <div className={classNames({ [styles.tableContainer]: idx })} key={option.url + idx}>
          <Chart onLoad={onLoad} config={option} idx={idx} />
        </div>
      ))}
    </>
  );
}

export default connect(state => ({ ...state.chart }))(Charts);
