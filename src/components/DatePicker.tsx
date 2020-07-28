import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { DatePicker } from 'antd';
import dateRanges from '@/utils/ranges';
import * as R from 'ramda';
import { formatMessage } from 'umi/locale';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const getRanges = (dateFormat: string) => {
  let range = {};
  Object.keys(dateRanges).map(key => {
    range[key] = dateRanges[key].map(item => moment(moment(item, dateFormat).format(dateFormat)));
  });
  return range;
};

const { RangePicker } = DatePicker;
const getDefaultDateStr: (string) => [string, string] = dateFormat => {
  let defaultVal = dateRanges['昨天'];
  let tstart = moment(defaultVal[0]).format(dateFormat);
  let tend = moment(defaultVal[1]).format(dateFormat);
  return [tstart, tend];
};

const getDerivedState = (value: string[], dateFormat: string) => {
  let tstart, tend;
  if (R.isNil(value) || value.length == 0) {
    let res = getDefaultDateStr(dateFormat);
    tstart = res[0];
    tend = res[1];
  } else if (value.length == 1) {
    tstart = value[0];
    tend = value[0];
  } else {
    tstart = value[0];
    tend = value[1];
  }
  return [moment(tstart).format(dateFormat), moment(tend).format(dateFormat)];
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
  const [strDate, setStrDate] = useState(getDerivedState(value, dateFormat));
  useEffect(() => {
    setStrDate(getDerivedState(value, dateFormat));
  }, [value]);

  const onRangeChange = (_, date) => {
    setStrDate(date);
  };

  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open || strDate.length === 0) {
      return;
    }
    onChange(strDate);
  }, [open, strDate.join('')]);

  return (
    <div {...props}>
      <label style={{ paddingRight: 10 }}>{formatMessage({ id: 'app.timerange' })}:</label>
      <RangePicker
        ranges={getRanges(dateFormat)}
        format={dateFormat}
        defaultValue={[moment(strDate[0], dateFormat), moment(strDate[1], dateFormat)]}
        value={[moment(strDate[0], dateFormat), moment(strDate[1], dateFormat)]}
        // mode={dateType}
        onOpenChange={setOpen}
        onChange={onRangeChange}
        style={{ width: 220 }}
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
