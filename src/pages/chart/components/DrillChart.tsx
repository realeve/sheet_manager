import React, { useState, useEffect } from 'react';
import { Card, Tabs, Modal } from 'antd';
import * as db from '../services/chart';
import ChartComponent from './ChartComponent';
import moment from 'moment';
import lib from '../utils/lib';
import { useSetState } from 'react-use';
import { handleSimpleMode, CHART_MODE } from '../utils/lib';
import * as R from 'ramda';

export const getDrillParam = (params, level = 0) => {
  let reg = new RegExp('^dr' + level + '_');
  let _param = {};
  Object.keys(params)
    .filter(key => reg.test(key))
    .forEach(key => {
      let nextKey = key.replace('dr' + level + '_', '');
      let val = R.clone(params)[key];
      if (nextKey === 'id' && /^\d+\/\S{10}$/.test(val)) {
        _param.id = val.split('/')[0];
        _param.nonce = val.split('/')[1];
      } else {
        _param[nextKey] = val;
      }
    });
  return _param;
};

export default props => {
  return (
    <ChartComponent
      option={handleSimpleMode(R.clone(), { simple: CHART_MODE.SHOW_TITLE })}
      renderer="canvas"
      style={{ width: '100%', height: 450 }}
    />
  );
};
