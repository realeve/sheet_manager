import React from 'react';
import { connect } from 'dva';
import VTable from '@/components/Table.jsx';
import VTableCalc from '@/components/TableCalc.jsx';

import { DatePicker, Card, Tabs } from 'antd';
import styles from './index.less';
import dateRanges from '@/utils/ranges';
import moment from 'moment';
import 'moment/locale/zh-cn';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

moment.locale('zh-cn');

const TabPane = Tabs.TabPane;
const RangePicker = DatePicker.RangePicker;

function Tables({ dispatch, dateRange, loading, dataSource }) {
  const onDateChange = async (dates, dateStrings) => {
    dispatch({
      type: 'table/setStore',
      payload: { dateRange: dateStrings }
    });
    dispatch({
      type: 'table/updateParams'
    });
    dispatch({
      type: 'table/refreshData'
    });
  };

  const DateRangePicker = () => (
    <>
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
    </>
  );

  return (
    <>
      <div className={styles.header}>
        <div className={styles.dateRange}>
          <DateRangePicker />
        </div>
      </div>
      {dataSource.length === 0 && <Card title="加载中" loading={true} />}
      {dataSource.map((dataSrc, key) => (
        <div key={key} className={cx({ tableContainer: key, dataList: !key })}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="原始数据" key="1">
              <VTable
                dataSrc={dataSrc}
                loading={loading}
                subTitle={`统计期间: ${dateRange[0]} 至 ${dateRange[1]}`}
              />
            </TabPane>
            <TabPane tab="数据汇总" key="2">
              <VTableCalc
                dataSrc={dataSrc}
                loading={loading}
                subTitle={`统计期间: ${dateRange[0]} 至 ${dateRange[1]}`}
              />
            </TabPane>
          </Tabs>
        </div>
      ))}
    </>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.table,
    ...state.table
  };
}

export default connect(mapStateToProps)(Tables);
