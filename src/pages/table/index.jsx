import React from 'react';
import { connect } from 'dva';
import VTable from '@/components/Table.jsx';
import VTableCalc from '@/components/TableCalc.jsx';
import { formatMessage } from 'umi/locale';
import { Tabs } from 'antd';
import styles from './index.less';
import moment from 'moment';
import classNames from 'classnames/bind';
import * as lib from '@/utils/lib';
import QueryCondition from '@/components/QueryCondition';

const cx = classNames.bind(styles);

const TabPane = Tabs.TabPane;

function Tables({ dispatch, dateRange, loading, dataSource, selectList, selectValue, dateFormat }) {
  // 表头合并相关设置信息
  let param = lib.parseUrl(window.location.hash);

  const onChange = (value, idx, key) => {
    console.log({
      idx,
      data: {
        [key]: value,
      },
    });
    dispatch({
      type: 'table/refreshSelector',
      payload: {
        idx,
        data: {
          [key]: value,
        },
      },
    });
  };

  const refreshData = async () => {
    await dispatch({
      type: 'table/updateParams',
    });
    await dispatch({
      type: 'table/refreshData',
    });
  };

  const staticRanges = ([tstart, tend]) => {
    let format = '';
    switch (dateFormat) {
      case 'YYYYMMDD':
        format = 'YYYY年M月D日';
        break;
      case 'YYYYMM':
        format = 'YYYY年M月';
        break;
      case 'YYYY':
      default:
        format = 'YYYY年';
        break;
    }

    return (
      `${formatMessage({ id: 'app.daterange.name' })}: ${moment(tstart, dateFormat).format(
        format
      )}` +
      (tstart === tend
        ? ''
        : ` ${formatMessage({
            id: 'app.daterange.to',
          })} ${moment(tend, dateFormat).format(format)}`)
    );
  };

  return (
    <>
      <QueryCondition
        data={selectList}
        selectValue={selectValue}
        onSelectChange={onChange}
        onQuery={refreshData}
      />

      {dataSource.map((dataSrc, key) => {
        let subTitle = dataSrc.dates && dataSrc.dates.length > 0 && staticRanges(dateRange);
        return (
          <div key={key} className={cx({ tableContainer: key, dataList: !key, tabs: true })}>
            <Tabs defaultActiveKey="1">
              <TabPane tab={formatMessage({ id: 'chart.tab.table' })} key="1">
                <VTable dataSrc={dataSrc} loading={loading} config={param} subTitle={subTitle} />
              </TabPane>
              <TabPane tab={formatMessage({ id: 'chart.tab.tableCalc' })} key="2">
                <VTableCalc dataSrc={dataSrc} loading={loading} merge={false} subTitle={subTitle} />
              </TabPane>
            </Tabs>
          </div>
        );
      })}
    </>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.table,
    ...state.table,
    dateFormat: state.common.dateFormat,
    dateRange: state.common.dateRange,
  };
}

export default connect(mapStateToProps)(Tables);
