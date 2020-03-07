import React from 'react';
import Link from 'umi/link';
import styles from './index.less';
import { DateRangePicker } from '@/components/QueryCondition';
import { connect } from 'dva';
import ToggleMenu from './ToggleMenu';

const GlobalHeader = ({ isMobile, logo, selectList, dispatch, dateRange, textAreaList }) => {
  return (
    <div className={styles.header}>
      {isMobile && (
        <Link to="/" className={styles.logo} key="logo">
          <img src={logo} alt="logo" width="32" />
        </Link>
      )}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {isMobile && <ToggleMenu />}
        {!isMobile && selectList.length + textAreaList.length === 0 && (
          <DateRangePicker refresh={true} dispatch={dispatch} dateRange={dateRange} />
        )}
      </div>
    </div>
  );
};

export default connect(({ common: { dateRange, selectList, textAreaList } }) => ({
  dateRange,
  selectList,
  textAreaList,
}))(GlobalHeader);
