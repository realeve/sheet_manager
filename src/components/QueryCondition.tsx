import React from 'react';
import { Card, Row, Col, Button, Input } from 'antd';
import styles from '@/pages/table/index.less';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import DatePicker from './DatePicker';
import { str2Arr } from '@/utils/lib'
import PinyinSelect from './PinyinSelect';
const { TextArea } = Input;

export const isDisabled = ({ selectValue,
  selectList,
  textAreaList,
  select,
  textAreaValue, }) => Object.keys(selectValue).length < (select || selectList).length ||
  Object.values(textAreaValue).filter(item => String(item).length > 0).length < textAreaList.length

function QueryCondition({
  selectValue,
  selectList,
  textAreaList,
  textAreaValue,
  dateRange,
  onQuery,
  dateType,
  select,
  dispatch,
}) {
  const onDateChange = async (dateStrings: Array<string>, refresh: boolean = true) => {
    await dispatch({
      type: 'common/setStore',
      payload: { dateRange: dateStrings },
    });
    if (refresh) {
      onQuery();
    }
  };

  const onSelectChange = (value, idx, key) => {
    dispatch({
      type: 'common/refreshSelector',
      payload: {
        idx,
        data: {
          [key]: value,
        },
      },
    });
  };

  const onTextChange = (value, key) => {
    dispatch({
      type: 'common/setStore',
      payload: {
        textAreaValue: {
          [key]: value,
        },
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

  const disabled = isDisabled({
    selectValue,
    selectList,
    textAreaList,
    textAreaValue,
    select
  })

  return textAreaList.length + selectList.length === 0 ? (
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
          {dateType !== 'none' && <Col span={8} md={8} sm={12} xs={24} className={styles.selectContainer}>
            <DateRangePicker refresh={false} />
          </Col>}
          {textAreaList.map(({ key, title }) => (
            <Col span={24} md={24} sm={24} xs={24} className={styles.selectContainer} style={{ height: '5em', marginTop: 20 }} key={key}>
              <span className={styles.title}>{title}:</span>
              <div
                style={{
                  marginRight: 10,
                  width: '100%'
                }}>
                <TextArea
                  style={{
                    width: '100%'
                  }}
                  autosize={{ minRows: 4, maxRows: 4 }}
                  value={textAreaValue[key]}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onTextChange(e.target.value, key)}
                />
                <p>有效{title}共计: {textAreaValue[key] && str2Arr(textAreaValue[key]).length}</p>
              </div>
            </Col>
          ))}
          {selectList.map(({ key, data: selectorData, title }, idx) => (
            <Col span={8} md={8} sm={12} xs={24} className={styles.selectContainer} key={key}>
              <span className={styles.title}>{title}:</span>
              <PinyinSelect
                style={{ width: 150 }}
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
              disabled={disabled}
            >
              {formatMessage({ id: 'app.query' })}
            </Button>
          </Col>
        </Row>
      </Card>
    );
}

export default connect(
  ({ common: { dateType: [dateType], dateRange, selectValue, selectList, textAreaList, textAreaValue, query: { select } } }) => ({
    dateRange,
    selectValue,
    selectList,
    textAreaList,
    textAreaValue,
    dateType,
    select
  })
)(QueryCondition);
