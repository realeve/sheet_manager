import React from 'react';
import { connect } from 'dva';
import Chart from './components/Chart';
import { Card, Select, Row, Col, Button } from 'antd';
import styles from './index.less';
import styleTable from '@/pages/table/index.less';
import classNames from 'classnames';
import { formatMessage } from 'umi/locale';
import DatePicker from '@/components/DatePicker';

const { Option } = Select;

function Charts({ dispatch, dateRange, config, loading, selectList, selectValue }) {
  const onDateChange = async (dateStrings: Array<string>, refresh: boolean = true) => {
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
    <DatePicker
      className={refresh ? styles.setting : null}
      value={dateRange}
      onChange={dateStrings => onDateChange(dateStrings, refresh)}
    />
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
