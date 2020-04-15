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

// 数据下钻参数处理，不传入group字段
export const getDrillParam = ({ group, select, legend, x, y, ...params }, param, level = 0) => {
  let reg = new RegExp('^dr' + level + '_');

  let { name, seriesName: series_name } = param;
  name = String(name).trim();
  series_name = String(series_name).trim();

  let suffix = level == 0 ? '' : String(level);

  // 处理多级联动时参数
  let _param = { ['name' + suffix]: name, ['series_name' + suffix]: series_name };

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
  series_name,
  option,
  visible,
  config,
  ...props
}) => {
  const [options, setOptions] = useState([option]);
  const [loading, setLoading] = useState(false);

  const [level, { inc, reset, set }] = useCounter(0, 10, 0);

  const [titles, setTitles] = useState([title]);

  const [data, setData] = useState(null);
  const [showTable, setShowTable] = useState(false);

  // 显示或隐藏时，level重置
  useEffect(() => {
    // reset();
    setShowTable(false);
  }, [visible]);

  // 上一级图表请求参数
  const [preParam, setPreParam] = useState({
    name: title,
    series_name: series_name,
  });

  useEffect(() => {
    reset();
    setOptions([option]);
    setTitles([title]);
    setData(null);
    setPreParam({ name: title, series_name: series_name });
    setShowTable(false);
  }, [JSON.stringify(option)]);

  /**
   * 2020-04-15 李宾
   * 组件点击事件处理。
   * 由于此处的事件绑定为异步状态，绑定后只能获取到绑定当时的数据状态，在本组件中数据变化后的结果是不监听的，
   * 这样会导致外部的数据无法读入的错误。需要在第3个参数中将需要注入的外部数据加载，同时在组件调用中的append字段注入该字段。
   *
   * @param param 点击事件后由echarts传回的数据
   * @param instance ECHARTS实例
   * @param param2 外部注入的数据，用于echarts内部绑定的事件中，引用外部数据。不传入时无法读到外部数据
   */
  const handleClick = async (param, instance, { level, options, group_name, titles, preParam }) => {
    let nextLevel = level + 1;
    if (!config[`dr${nextLevel}_id`]) {
      return;
    }
    inc(1);

    let suffix = nextLevel == 0 ? '' : String(nextLevel);

    // 注入上一级点击项的参数
    let params = getDrillParam({ ...config, group_name }, param, nextLevel);
    let _preParam = R.clone(preParam);
    _preParam['name' + suffix] = params['name' + suffix];
    _preParam['series_name' + suffix] = params['series_name' + suffix];
    params = { ...preParam, ..._preParam, ...params };

    setPreParam(_preParam);

    // console.log(params, preParam, _preParam);

    let nextTitle = R.clone(titles);
    nextTitle[nextLevel] = params['name' + suffix];

    // console.log(nextTitle, params, 'name' + suffix);
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
          append={{ level, options, group_name, titles, preParam }}
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
