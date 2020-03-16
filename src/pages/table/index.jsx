import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import VTable from '@/components/Table.jsx';
import VTableCalc from '@/components/TableCalc.jsx';
import { formatMessage } from 'umi/locale';
import { Tabs, Spin } from 'antd';
import styles from './index.less';
import moment from 'moment';
import classNames from 'classnames/bind';
import * as lib from '@/utils/lib';
import QueryCondition from '@/components/QueryCondition';
import Err from '@/components/Err';
import ImageList from './components/ImagePage';
import * as R from 'ramda';

const cx = classNames.bind(styles);

const TabPane = Tabs.TabPane;

function Tables({
  dispatch,
  dateRange,
  loading,
  dataSource,
  extraData,
  dateFormat,
  common,
  axiosOptions,
}) {
  const [tableIds, setTableIds] = useState(common.tid);
  const [query, setQuery] = useState(common.query);

  useEffect(() => {
    if (R.equals(tableIds, common.tid) && R.equals(common.query, query)) {
      return;
    }
    setTableIds(common.tid);
    setQuery(common.query);
    refreshData();
  }, [common.tid]);

  useEffect(() => {
    refreshData();
  }, []);

  // 表头合并相关设置信息
  // let param = lib.parseUrl(window.location.hash);

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
      (R.isNil(tend) || tstart === tend
        ? ''
        : ` ${formatMessage({
            id: 'app.daterange.to',
          })} ${moment(tend, dateFormat).format(format)}`)
    );
  };

  // loading={loading}
  return (
    <Spin size="large" tip="载入中..." spinning={common.spinning}>
      <QueryCondition onQuery={refreshData} />
      {dataSource.map((dataSrc, key) => {
        let subTitle = dataSrc.dates && dataSrc.dates.length > 0 && staticRanges(dataSrc.dates);

        let blob =
          axiosOptions[key] &&
          (axiosOptions[key].data || axiosOptions[key].params) &&
          (axiosOptions[key].data || axiosOptions[key].params).blob;

        // console.log(axiosOptions[key], blob);

        if (!R.isNil(blob)) {
          return <ImageList data={dataSrc} blob={blob} key={key} subTitle={subTitle} />;
        }

        return (
          <div key={key} className={cx({ tableContainer: key, dataList: !key, tabs: true })}>
            <Tabs defaultActiveKey="1" animated={false}>
              <TabPane tab={formatMessage({ id: 'chart.tab.table' })} key="1">
                <VTable
                  loading={loading}
                  dataSrc={dataSrc}
                  extra={extraData[key]}
                  config={lib.parseUrl(window.location.hash)}
                  subTitle={subTitle}
                />
              </TabPane>
              <TabPane tab={formatMessage({ id: 'chart.tab.tableCalc' })} key="2">
                {dataSrc.err ? (
                  <Err err={dataSrc.err} />
                ) : (
                  <VTableCalc
                    dataSrc={dataSrc}
                    loading={loading}
                    merge={false}
                    subTitle={subTitle}
                  />
                )}
              </TabPane>
            </Tabs>
          </div>
        );
      })}
    </Spin>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.table,
    ...state.table,
    dateFormat: state.common.dateFormat,
    dateRange: state.common.dateRange,
    common: state.common,
  };
}

export default connect(mapStateToProps)(Tables);
