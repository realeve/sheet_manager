import React from 'react';
import { connect } from 'dva';
import VTable from '@/components/Table.jsx';
import VTableCalc from '@/components/TableCalc.jsx';
import { formatMessage } from 'umi/locale';

import { DatePicker, Card, Tabs, Select, Row, Col, Button } from 'antd';
import styles from './index.less';
import dateRanges from '@/utils/ranges';
import moment from 'moment';
import 'moment/locale/zh-cn';

import classNames from 'classnames/bind';
import * as lib from '@/utils/lib';

const cx = classNames.bind(styles);

const { Option } = Select;

moment.locale('zh-cn');

const TabPane = Tabs.TabPane;
const RangePicker = DatePicker.RangePicker;

function Tables({ dispatch, dateRange, loading, dataSource, selectList, axiosOptions }) {
  const onDateChange = async (dateStrings, refresh) => {
    dispatch({
      type: 'table/setStore',
      payload: { dateRange: dateStrings },
    });

    // 立即刷新数据
    if (refresh) {
      dispatch({
        type: 'table/updateParams',
      });
      dispatch({
        type: 'table/refreshData',
      });
    }
  };

  const DateRangePicker = ({ refresh }) => (
    <>
      <label className={styles.labelDesc}>{formatMessage({ id: 'app.timerange' })}:</label>
      <RangePicker
        ranges={dateRanges}
        format="YYYYMMDD"
        onChange={(_, dateStrings) => {
          onDateChange(dateStrings, refresh);
        }}
        defaultValue={[moment(dateRange[0]), moment(dateRange[1])]}
        style={{ width: 190 }}
        locale={{
          rangePlaceholder: ['开始日期', '结束日期'],
        }}
      />
    </>
  );

  // 表头合并相关设置信息
  let param = lib.parseUrl(window.location.hash);

  const onChange = (value, idx, key) => {
    dispatch({
      type: 'table/updateAxiosOption',
      payload: {
        idx,
        data: {
          [key]: value,
        },
      },
    });
  };

  const refresh = () => {
    dispatch({
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
      <Card title={formatMessage({ id: 'app.querycondition' })} style={{ marginBottom: 10 }}>
        <Row>
          <Col span={8}>
            <DateRangePicker refresh={false} />
          </Col>
          {data.map(({ key, data: selectorData, title }, idx) => (
            <Col span={8} className={styles.selectContainer} key={key}>
              <span className={styles.title}>{title}:</span>
              <Select
                className={styles.selector}
                value={axiosOptions[idx].params[key]}
                onSelect={value => onChange(value, idx, key)}
              >
                {selectorData.map(({ name, value }) => (
                  <Option key={name} value={value}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Col>
          ))}
          <Col span={8}>
            <Button type="primary" onClick={refresh}>
              {formatMessage({ id: 'app.query' })}
            </Button>
          </Col>
        </Row>
      </Card>
    );

  return (
    <>
      <SelectList data={selectList} />

      {dataSource.length === 0 && (
        <Card title={formatMessage({ id: 'app.loading' })} loading={true} />
      )}
      {dataSource.map((dataSrc, key) => (
        <div key={key} className={cx({ tableContainer: key, dataList: !key })}>
          <Tabs defaultActiveKey="1">
            <TabPane tab={formatMessage({ id: 'chart.tab.table' })} key="1">
              <VTable
                dataSrc={dataSrc}
                loading={loading}
                config={param}
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
