import React from 'react';
import { connect } from 'dva';
import VTable from '@/components/Table.jsx';
import VTableCalc from '@/components/TableCalc.jsx';
import { formatMessage } from 'umi/locale';

import { DatePicker, Card, Tabs } from 'antd';
import styles from './index.less';
import dateRanges from '@/utils/ranges';
import moment from 'moment';
import 'moment/locale/zh-cn';

import classNames from 'classnames/bind';
import * as lib from '@/utils/lib';

const cx = classNames.bind(styles);

moment.locale('zh-cn');

const TabPane = Tabs.TabPane;
const RangePicker = DatePicker.RangePicker;

function Tables({ dispatch, dateRange, loading, dataSource }) {
  const onDateChange = async (_, dateStrings) => {
    dispatch({
      type: 'table/setStore',
      payload: { dateRange: dateStrings },
    });
    dispatch({
      type: 'table/updateParams',
    });
    dispatch({
      type: 'table/refreshData',
    });
  };

  const DateRangePicker = () => (
    <>
      <label className={styles.labelDesc}>{formatMessage({ id: 'app.timerange' })}:</label>
      <RangePicker
        ranges={dateRanges}
        format="YYYYMMDD"
        onChange={onDateChange}
        defaultValue={[moment(dateRange[0]), moment(dateRange[1])]}
        locale={{
          rangePlaceholder: ['开始日期', '结束日期'],
        }}
      />
    </>
  );

  // 表头合并相关设置信息
  let params = lib.parseUrl();

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
            <TabPane tab={formatMessage({ id: 'chart.tab.table' })} key="1">
              <VTable
                dataSrc={dataSrc}
                loading={loading}
                config={params}
                subTitle={
                  dataSrc.dates.length > 0 &&
                  `${formatMessage({ id: 'app.daterange' })}: ${dateRange[0]} ${formatMessage({
                    id: 'app.daterange.to',
                  })} ${dateRange[1]}`
                }
              />
            </TabPane>
            <TabPane tab={formatMessage({ id: 'chart.tab.tableCalc' })} key="2">
              <VTableCalc
                dataSrc={dataSrc}
                loading={loading}
                merge={false}
                subTitle={`${formatMessage({ id: 'app.daterange' })}: ${
                  dateRange[0]
                } ${formatMessage({
                  id: 'app.daterange.to',
                })} ${dateRange[1]}`}
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
    // showDateRange: state.common.showDateRange,
    ...state.table,
  };
}

export default connect(mapStateToProps)(Tables);
