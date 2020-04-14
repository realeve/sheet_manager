import React, { useState, useEffect, useRef } from 'react';
import { Spin, Breadcrumb } from 'antd';
import * as db from '../services/chart';
import ChartComponent from './ChartComponent';
import { useCounter } from 'react-use';
import { handleSimpleMode, CHART_MODE } from '../utils/lib';
import * as R from 'ramda';
import { HomeOutlined } from '@ant-design/icons';

const { Item } = Breadcrumb;

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

export const DrillChart = ({ loading: modalLoading, title, option, config, ...props }) => {
  const [options, setOptions] = useState([option]);
  const [loading, setLoading] = useState(false);

  const [level, { inc, reset, set }] = useCounter(0, 10, 0);

  const [titles, setTitles] = useState([title]);

  useEffect(() => {
    reset();
    setOptions([option]);
    setTitles([title]);
  }, [JSON.stringify(option)]);

  const handleClick = async (param, instance, { level, options, titles }) => {
    let nextLevel = level + 1;
    if (!config[`dr${nextLevel}_id`]) {
      return;
    }
    console.log('load', nextLevel);

    inc(1);

    let params = getDrillParam(config, nextLevel);

    let { name, seriesName } = param;
    name = String(name).trim();
    seriesName = String(seriesName).trim();

    console.log(param, name, seriesName);

    let nextTitle = R.clone(titles);
    nextTitle[nextLevel] = name;
    setTitles(nextTitle);

    params = { ...params, name, seriesName };

    setLoading(true);
    let { option } = await db
      .computeDerivedState({
        method: 'get',
        params,
      })
      .finally(e => {
        setLoading(false);
      });

    let _option = handleSimpleMode(R.clone(option[0]), { simple: CHART_MODE.SHOW_TITLE });
    let nextOption = R.clone(options);
    nextOption[nextLevel] = _option;

    setOptions(nextOption);

    // 隐藏tooltip
    instance.dispatchAction({
      type: 'hideTip',
    });
  };

  // 点击顶部事件处理
  const handleBreadClick = idx => {
    set(idx);
    let nextOption = R.slice(0, idx + 1)(options);
    setOptions(nextOption);
    setTitles(R.slice(0, idx + 1)(titles));
  };

  return (
    <Spin spinning={loading || modalLoading} tip="加载中...">
      <Breadcrumb separator=">">
        {titles.map((item, idx) => (
          <Item
            key={idx}
            onClick={() => idx < titles.length - 1 && handleBreadClick(idx)}
            style={{ cursor: 'pointer' }}
          >
            {idx == 0 && <HomeOutlined style={{ marginRight: 5 }} />}
            {item}
          </Item>
        ))}
      </Breadcrumb>

      <ChartComponent
        option={level == 0 ? option : options[level] || {}}
        renderer="canvas"
        style={{ width: '100%', height: 450 }}
        onEvents={{
          click: handleClick,
        }}
        append={{ level, options, titles }}
      />
    </Spin>
  );
};
