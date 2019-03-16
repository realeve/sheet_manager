import React from 'react';

import { DatePicker } from 'antd';
import dateRanges from '@/utils/ranges';
import * as R from 'ramda';
import { formatMessage } from 'umi/locale';

import moment, { Moment } from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const RangePicker = DatePicker.RangePicker;

export default function DatePick({
  value,
  onChange,
  ...props
}: {
  value?: Moment[];
  [key: string]: any;
}) {
  let tstart, tend;
  if (R.isNil(value) || value.length == 0) {
    let defaultVal = dateRanges['昨天'];
    tstart = moment(defaultVal[0]);
    tend = moment(defaultVal[1]);
  } else if (value.length == 1) {
    tstart = moment(value[0]);
    tend = moment(value[0]);
  } else {
    tstart = moment(value[0]);
    tend = moment(value[1]);
  }

  return (
    <div {...props}>
      <label style={{ paddingRight: 10 }}>{formatMessage({ id: 'app.timerange' })}:</label>
      <RangePicker
        ranges={dateRanges}
        format="YYYYMMDD"
        size="small"
        onChange={(_, dateStrings) => onChange(dateStrings)}
        defaultValue={[moment(tstart), moment(tend)]}
        style={{ width: 190 }}
        locale={{
          rangePlaceholder: ['开始日期', '结束日期'],
        }}
      />
    </div>
  );
}
