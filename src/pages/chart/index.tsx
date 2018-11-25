import React from 'react';
import { connect } from 'dva';
import Chart from './components/Chart';
import { DatePicker, Card } from 'antd';
import styles from './index.less';
import dateRanges from '@/utils/ranges';
import moment from 'moment';
import classNames from 'classnames';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const RangePicker = DatePicker.RangePicker;

function Charts({ dispatch, dateRange, config, loading }) {
  const onDateChange = async (_, dateStrings: Array<string>) => {
    const [tstart, tend]: Array<string> = dateStrings;
    await dispatch({
      type: 'chart/setStore',
      payload: { dateRange: dateStrings }
    });

    await dispatch({
      type: 'chart/refreshConfig',
      payload: { tstart, tend }
    });
  };

  const onLoad = (curPageName) => {
    dispatch({
      type: 'common/setStore',
      payload: {
        curPageName
      }
    });
  };

  const DateRangePicker = () => (
    <div className={styles.setting}>
      <label className={styles.labelDesc}>起始时间:</label>
      <RangePicker
        ranges={dateRanges}
        format="YYYYMMDD"
        onChange={onDateChange}
        defaultValue={[moment(dateRange[0]), moment(dateRange[1])]}
        locale={{
          rangePlaceholder: ['开始日期', '结束日期']
        }}
      />
    </div>
  );

  if (!config.length || loading) {
    return <Card loading={true} />;
  }

  return (
    <>
      <div className={styles.header}>
        <div className={styles.dateRange}>
          <DateRangePicker />
        </div>
      </div>
      {config.map((option, idx) => (
        <div
          className={classNames({ [styles.tableContainer]: idx })}
          key={option.url + idx}>
          <Chart onLoad={onLoad} config={option} idx={idx} />
        </div>
      ))}
    </>
  );
}

function mapStateToProps(state) {
  return {
    ...state.chart
  };
}

export default connect(mapStateToProps)(Charts);
