import React, { useState, useEffect } from 'react';
import { Spin, Breadcrumb } from 'antd';
import * as db from '../services/chart';
import ChartComponent from './ChartComponent';
import { useCounter } from 'react-use';
import { handleSimpleMode, CHART_MODE } from '../utils/lib';
import * as R from 'ramda';
import { HomeOutlined } from '@ant-design/icons';
import SimpleTable from '@/pages/Search/components/SimpleTable';
import { Scrollbars } from 'react-custom-scrollbars';

const { Item } = Breadcrumb;

export const getDrillParam = ({ select, ...params }, param, level = 0) => {
  let reg = new RegExp('^dr' + level + '_');

  let { name, seriesName: series_name } = param;
  name = String(name).trim();
  series_name = String(series_name).trim();
  let _param = { name, series_name };

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
  return { ...params, ..._param };
};

export const DrillChart = ({
  loading: modalLoading,
  group_name,
  title,
  option,
  config,
  ...props
}) => {
  const [options, setOptions] = useState([option]);
  const [loading, setLoading] = useState(false);

  const [level, { inc, reset, set }] = useCounter(0, 10, 0);

  const [titles, setTitles] = useState([title]);

  const [data, setData] = useState(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    reset();
    setOptions([option]);
    setTitles([title]);
    setData(null);
  }, [JSON.stringify(option)]);

  // 第三个参数传入，用于echarts内部绑定的事件中，引用外部数据。不传入时无法读到外部数据
  const handleClick = async (param, instance, { level, options, group_name, titles }) => {
    let nextLevel = level + 1;
    if (!config[`dr${nextLevel}_id`]) {
      return;
    }
    inc(1);
    let params = getDrillParam({ ...config, group_name }, param, nextLevel);

    let nextTitle = R.clone(titles);
    nextTitle[nextLevel] = params.name;
    setTitles(nextTitle);

    setLoading(true);

    let drilltype = params.drilltype;
    if (drilltype === 'table') {
      setShowTable(true);
      setData({});
    } else {
      setShowTable(false);
    }

    let { option, dataSrc } = await db
      .computeDerivedState({
        method: 'get',
        params,
      })
      .finally(e => {
        setLoading(false);
      });

    if (typeof drilltype === 'undefined' || drilltype == 'chart') {
      let _option = handleSimpleMode(R.clone(option[0]), { simple: CHART_MODE.SHOW_TITLE });
      let nextOption = R.clone(options);
      nextOption[nextLevel] = _option;
      setOptions(nextOption);
    } else if (drilltype == 'table') {
      setData(dataSrc);
    }

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
    setShowTable(false);
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

      {!showTable && (
        <ChartComponent
          option={level == 0 ? option : options[!showTable ? level : Math.max(level - 1, 0)] || {}}
          renderer="canvas"
          style={{ width: '100%', height: 500 }}
          onEvents={{
            click: handleClick,
          }}
          append={{ level, options, group_name, titles }}
        />
      )}
      {showTable && (
        <Scrollbars
          autoHide
          style={{
            height: 500,
            marginTop: 20,
          }}
        >
          <SimpleTable data={data} loading={loading} />
        </Scrollbars>
      )}
    </Spin>
  );
};
