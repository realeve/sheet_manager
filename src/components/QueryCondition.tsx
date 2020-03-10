import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Input } from 'antd';
import styles from '@/pages/table/index.less';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import DatePicker from './DatePicker';
import { str2Arr } from '@/utils/lib';
import PinyinSelect from './PinyinSelect';
import * as R from 'ramda';
import { enquireScreen, unenquireScreen } from 'enquire-js';

const { TextArea } = Input;

export const isDisabled = ({ selectValue, selectList, textAreaList, select, textAreaValue }) =>
  (select && selectList.length + textAreaList.length == 0) ||
  Object.keys(selectValue).length < selectList.length ||
  Object.values(textAreaValue).filter(item => String(item).length > 0).length < textAreaList.length;

export const DateRangePicker = ({ dispatch, refresh, dateRange, style }) => {
  let queryType = window.location.pathname.includes('/table')
    ? 'table'
    : window.location.pathname.includes('/chart')
    ? '/chart'
    : 'none';

  const onDateChange = async (dateStrings: Array<string>, refresh: boolean = true) => {
    await dispatch({
      type: 'common/setStore',
      payload: { dateRange: dateStrings },
    });
    if (refresh) {
      onQuery();
    }
  };

  const onQuery = async () => {
    // console.log(queryType);
    if (queryType === 'table') {
      await dispatch({
        type: 'table/updateParams',
      });
      await dispatch({
        type: 'table/refreshData',
      });
      return;
    } else if (queryType === 'chart') {
      dispatch({
        type: 'chart/refreshData',
      });
    }
  };

  console.log(queryType);

  return (
    queryType !== 'none' && (
      <DatePicker
        className={refresh ? styles.setting : null}
        value={dateRange}
        style={style}
        onChange={dateStrings => onDateChange(dateStrings, refresh)}
      />
    )
  );
};

function QueryCondition({
  selectValue,
  selectList,
  textAreaList,
  textAreaValue,
  dateRange,
  dateType,
  select,
  dispatch,
  hidemenu,
}) {
  let queryType = window.location.pathname.includes('/table')
    ? 'table'
    : window.location.pathname.includes('/chart')
    ? '/chart'
    : 'none';
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

  const disabled = isDisabled({
    selectValue,
    selectList,
    textAreaList,
    textAreaValue,
    select,
  });

  const [textVal, setTextVal] = useState({});

  useEffect(() => {
    if (R.equals(textAreaValue, {})) {
      return;
    }
    let dist = R.clone(textAreaValue);

    textAreaList.forEach(({ key }) => {
      let val = textAreaValue[key];
      val = R.uniq(str2Arr(val, false));
      dist[key] = val.join(',');
    });
    setTextVal(dist);
  }, [textAreaList, textAreaValue]);

  useEffect(() => {
    let showDateRange = textAreaList.length + selectList.length === 0 && dateType !== 'none';
    dispatch({
      type: 'common/setStore',
      payload: { showDateRange },
    });
  }, [textAreaList.length, selectList.length, dateType]);

  const onQuery = async () => {
    if (queryType === 'table') {
      await dispatch({
        type: 'table/updateParams',
      });
      await dispatch({
        type: 'table/refreshData',
      });
      return;
    }

    dispatch({
      type: 'chart/refreshData',
    });
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const enquireHandler = enquireScreen(mobile => {
      if (isMobile !== mobile) {
        setIsMobile(mobile);
      }
    });
    return () => {
      unenquireScreen(enquireHandler);
    };
  }, []);

  if (isMobile || hidemenu) {
    if (textAreaList.length + selectList.length === 0 && dateType !== 'none') {
      return (
        <div className={styles.dateRange} style={{ marginBottom: 10 }}>
          <DateRangePicker refresh={true} dispatch={dispatch} dateRange={dateRange} />
        </div>
      );
    }
  }

  return (
    textAreaList.length + selectList.length > 0 && (
      <Card
        title={formatMessage({ id: 'app.querycondition' })}
        bodyStyle={{
          padding: '5px 20px',
        }}
        style={{ marginBottom: 10 }}
      >
        <Row>
          {dateType !== 'none' && (
            <Col span={8} md={8} sm={12} xs={24} className={styles.selectContainer}>
              <DateRangePicker refresh={false} dispatch={dispatch} dateRange={dateRange} />
            </Col>
          )}
          {textAreaList.map(({ key, title }) => (
            <Col
              span={24}
              md={24}
              sm={24}
              xs={24}
              className={styles.selectContainer}
              style={{ height: '5em', marginTop: 20 }}
              key={key}
            >
              <span className={styles.title}>{title}:</span>
              <div
                style={{
                  marginRight: 10,
                  width: '100%',
                }}
              >
                <TextArea
                  style={{
                    width: '100%',
                  }}
                  autoSize={{ minRows: 4, maxRows: 4 }}
                  value={textVal[key]}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    onTextChange(e.target.value, key)
                  }
                />
                <p>
                  有效{title}共计: {textVal[key] && str2Arr(textVal[key]).length}
                </p>
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
            <Button type="primary" onClick={onQuery} disabled={disabled}>
              {formatMessage({ id: 'app.query' })}
            </Button>
          </Col>
        </Row>
      </Card>
    )
  );
}

export default connect(
  ({
    common: {
      dateType: [dateType],
      dateRange,
      selectValue,
      selectList,
      textAreaList,
      textAreaValue,
      query: { select },
      hidemenu,
    },
  }) => ({
    dateRange,
    selectValue,
    selectList,
    textAreaList,
    textAreaValue,
    dateType,
    select,
    hidemenu,
  })
)(QueryCondition);
