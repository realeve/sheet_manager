import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import styles from '@/pages/table/index.less';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import DatePicker from './DatePicker';
import PinyinSelect from './PinyinSelect';

function QueryCondition({ data, dateRange, selectValue, onSelectChange, onQuery, dispatch }) {
  const onDateChange = async (dateStrings: Array<string>, refresh: boolean = true) => {
    await dispatch({
      type: 'common/setStore',
      payload: { dateRange: dateStrings },
    });
    if (refresh) {
      onQuery();
    }
  };

  const DateRangePicker = ({ refresh }) => (
    <DatePicker
      className={refresh ? styles.setting : null}
      value={dateRange}
      onChange={dateStrings => onDateChange(dateStrings, refresh)}
    />
  );

  return data.length === 0 ? (
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
              onSelect={value => onSelectChange(value, idx, key)}
              options={selectorData}
              placeholder="拼音首字母过滤"
            />
          </Col>
        ))}
        <Col span={8} md={8} sm={12} xs={24} className={styles.selectContainer}>
          <Button
            type="primary"
            onClick={onQuery}
            disabled={Object.keys(selectValue).length < data.length}
          >
            {formatMessage({ id: 'app.query' })}
          </Button>
        </Col>
      </Row>
    </Card>
  );
}

export default connect(({ common: { dateRange } }) => ({
  dateRange,
}))(QueryCondition);
