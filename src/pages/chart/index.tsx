import React from 'react';
import { connect } from 'dva';
import Chart from './components/Chart';
import { DatePicker, Card, Select, Row, Col, Button } from 'antd';
import styles from './index.less';
import styleTable from '@/pages/table/index.less';
import dateRanges from '@/utils/ranges';
import moment from 'moment';
import classNames from 'classnames';
import { formatMessage } from 'umi/locale';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Option } = Select;
const RangePicker = DatePicker.RangePicker;

function Charts({ dispatch, dateRange, config, loading, selectList, selectValue }) {
  const onDateChange = async (dateStrings: Array<string>, refresh: boolean = true) => {
    // const [tstart, tend]: Array<string> = dateStrings;
    await dispatch({
      type: 'chart/setStore',
      payload: { dateRange: dateStrings },
    });
    if (refresh) {
      refreshData();
    }
  };

  const onLoad = curPageName => {
    dispatch({
      type: 'common/setStore',
      payload: {
        curPageName,
      },
    });
  };

  const DateRangePicker = ({ refresh }) => (
    <div className={refresh ? styles.setting : null}>
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
    </div>
  );

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
          <Col span={8} md={8} sm={12} xs={24} className={styleTable.selectContainer}>
            <DateRangePicker refresh={false} />
          </Col>
          {data.map(({ key, data: selectorData, title }, idx) => (
            <Col span={8} md={8} sm={12} xs={24} className={styleTable.selectContainer} key={key}>
              <span className={styleTable.title}>{title}:</span>
              <Select
                className={styleTable.selector}
                value={selectValue[key]}
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
          <Col span={8} md={8} sm={12} xs={24} className={styleTable.selectContainer}>
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

  return (
    <>
      <SelectList data={selectList} />
      {config.map((option, idx) => (
        <div className={classNames({ [styles.tableContainer]: idx })} key={option.url + idx}>
          <Chart onLoad={onLoad} config={option} idx={idx} />
        </div>
      ))}
    </>
  );
}

function mapStateToProps(state) {
  return {
    ...state.chart,
  };
}

export default connect(mapStateToProps)(Charts);
