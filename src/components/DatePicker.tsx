import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { DatePicker } from 'antd';
import dateRanges from '@/utils/ranges';
import * as R from 'ramda';
import { formatMessage } from 'umi/locale';

import moment, { Moment } from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { RangePicker } = DatePicker;
const getDefaultDates: (string) => [Moment, Moment] = dateFormat => {
  let defaultVal = dateRanges['昨天'];
  let tstart = moment(defaultVal[0], dateFormat);
  let tend = moment(defaultVal[1], dateFormat);
  return [tstart, tend];
};
function DatePick({
  value,
  onChange,
  dateType: _dateType,
  dateFormat,
  dispatch,
  ...props
}: {
  value?: string[];
  [key: string]: any;
}) {
  const [dates, setDates] = useState(getDefaultDates(dateFormat));

  useEffect(() => {
    let tstart, tend;
    if (R.isNil(value) || value.length == 0) {
      let res = getDefaultDates(dateFormat);
      tstart = res[0];
      tend = res[1];
    } else if (value.length == 1) {
      tstart = moment(value[0], dateFormat);
      tend = moment(value[0], dateFormat);
    } else {
      tstart = moment(value[0], dateFormat);
      tend = moment(value[1], dateFormat);
    }
    // 格式化
    tstart = moment(tstart, dateFormat);
    tend = moment(tend, dateFormat);

    setDates([tstart, tend]);
  }, [value]);

  const [ranges, setRanges] = useState(dateRanges);
  useEffect(() => {
    let range = {};
    Object.keys(dateRanges).map(key => {
      range[key] = dateRanges[key].map(item => moment(moment(item, dateFormat).format(dateFormat)));
    });
    setRanges(range);
  }, [dateRanges]);

  const onRangeChange = (_, dateString) => {
    onChange(dateString);
  };

  // const [dateType, setDateType] = useState(_dateType);
  // const handlePanelChange = (value, mode) => {
  //   console.log(value);
  //   console.log(mode);
  //   let curMode = [
  //     mode[0] === 'date' ? _dateType[0] : mode[0],
  //     mode[1] === 'date' ? _dateType[0] : mode[1],
  //   ];
  //   if (R.isNil(mode[0])) {
  //     curMode[0] = _dateType[0];
  //   }
  //   if (R.isNil(mode[1])) {
  //     curMode[1] = _dateType[1];
  //   }
  //   setDateType(curMode);
  //   setDates(value);
  // };

  return (
    <div {...props}>
      <label style={{ paddingRight: 10 }}>{formatMessage({ id: 'app.timerange' })}:</label>
      <RangePicker
        ranges={ranges}
        format={dateFormat}
        defaultValue={dates}
        value={dates}
        // mode={dateType}
        // onPanelChange={handlePanelChange}
        onChange={onRangeChange}
        style={{ width: 190 }}
        size="small"
        allowClear={false}
        locale={{
          rangePlaceholder: ['开始日期', '结束日期'],
        }}
      />
    </div>
  );
}

export default connect(({ common }) => ({
  dateType: common.dateType,
  dateFormat: common.dateFormat,
}))(DatePick);
