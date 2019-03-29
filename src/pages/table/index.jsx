import React from 'react';
import { connect } from 'dva';
import VTable from '@/components/Table.jsx';
import VTableCalc from '@/components/TableCalc.jsx';
import { formatMessage } from 'umi/locale';
import { Card, Tabs, Row, Col, Button } from 'antd';
import styles from './index.less';
import moment from 'moment';

import DatePicker from '@/components/DatePicker';

import classNames from 'classnames/bind';
import * as lib from '@/utils/lib';

import PinyinSelect from '@/components/PinyinSelect';

const cx = classNames.bind(styles);

const TabPane = Tabs.TabPane;

function Tables({ dispatch, dateRange, loading, dataSource, selectList, selectValue, dateFormat }) {
  const onDateChange = async (dateStrings, refresh) => {
    dispatch({
      type: 'table/setStore',
      payload: { dateRange: dateStrings },
    });

    // 立即刷新数据
    if (refresh) {
      refreshData();
    }
  };

  const DateRangePicker = ({ refresh }) => (
    <DatePicker
      className={refresh ? styles.setting : null}
      value={dateRange}
      onChange={dateStrings => onDateChange(dateStrings, refresh)}
    />
  );

  // 表头合并相关设置信息
  let param = lib.parseUrl(window.location.hash);

  const onChange = (value, idx, key) => {
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

  const SelectList = ({ data }) =>
    data.length === 0 ? (
      <div className={styles.header}>
        <div className={styles.dateRange}>
          <DateRangePicker refresh={true} />
        </div>
      </div>
    ) : (
      <Card
        title={formatMessage({ id: 'app.querycondition' })}
        bodyStyle={{
          padding: '5px 20px',
        }}
        style={{ marginBottom: 10 }}
      >
        <Row>
          <Col span={8} md={8} sm={12} xs={24} className={styles.selectContainer}>
            <DateRangePicker refresh={false} />
          </Col>
          {data.map(({ key, data: selectorData, title }, idx) => (
            <Col span={8} md={8} sm={12} xs={24} className={styles.selectContainer} key={key}>
              <span className={styles.title}>{title}:</span>
              <PinyinSelect
                style={{ width: 150 }}
                className={styles.selector}
                value={selectValue[key]}
                onSelect={value => onChange(value, idx, key)}
                options={selectorData}
                placeholder="拼音首字母过滤"
              />
            </Col>
          ))}
          <Col span={8} md={8} sm={12} xs={24} className={styles.selectContainer}>
            <Button
              type="primary"
              onClick={() => refreshData()}
              disabled={Object.keys(selectValue).length < selectList.length}
            >
              {formatMessage({ id: 'app.query' })}
            </Button>
          </Col>
        </Row>
      </Card>
    );
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
      <SelectList data={selectList} />

      {dataSource.map((dataSrc, key) => (
        <div key={key} className={cx({ tableContainer: key, dataList: !key, tabs: true })}>
          <Tabs defaultActiveKey="1">
            <TabPane tab={formatMessage({ id: 'chart.tab.table' })} key="1">
              <VTable
                dataSrc={dataSrc}
                loading={loading}
                config={param}
                subTitle={dataSrc.dates && dataSrc.dates.length > 0 && staticRanges(dateRange)}
              />
            </TabPane>
            <TabPane tab={formatMessage({ id: 'chart.tab.tableCalc' })} key="2">
              <VTableCalc
                dataSrc={dataSrc}
                loading={loading}
                merge={false}
                subTitle={dataSrc.dates && dataSrc.dates.length > 0 && staticRanges(dateRange)}
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
    ...state.table,
    dateFormat: state.common.dateFormat,
  };
}

export default connect(mapStateToProps)(Tables);
