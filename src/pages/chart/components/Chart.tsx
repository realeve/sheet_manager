import React, { Component } from 'react';
import { Card, Tabs } from 'antd';
import * as db from '../services/chart';
import styles from './Chart.less';
import ReactEcharts from './echarts-for-react';
import VTable from '@/components/Table.jsx';
import lib from '../utils/lib';

const R = require('ramda');
const TabPane = Tabs.TabPane;
interface Iconfig {
  url: string;
  params: any;
}
interface IProp {
  onLoad: (title: string) => void;
  config: Array<Iconfig> | Iconfig;
  idx: number | string;
}
interface IState extends Iconfig {
  loading: boolean;
  option: any;
  idx: number | string;
  [key: string]: any;
}
/**
 * todo:
 * 1.增加group选项，数据以此做切换；
 * 2.对参数长度排序，以最长的为准做合并，避免出现 &id=a&id=a...&otherparams的情况
 */
export default class Charts extends Component<IProp, IState> {
  static defaultProps: Partial<IProp> = {
    config: {
      url: '',
      params: {
        cache: 10,
        tstart: '',
        tend: ''
      }
    }
  };

  echarts_react = null;

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      option: [],
      idx: props.idx,
      ...props.config,
      dataSrc: []
    };

    // 创建echarts实例
    this.echarts_react = React.createRef();
  }

  static getDerivedStateFromProps({ config }, state) {
    let { params } = config;
    if (R.equals(params, state.params)) {
      return { loading: false };
    }
    return {
      params,
      loading: true
    };
  }

  init = async () => {
    let state = await db.computeDerivedState(this.state);
    state.dataSrc.data = state.dataSrc.data.map((item) => Object.values(item));
    this.setState({
      ...state
    });
    this.props.onLoad(state.dataSrc.title);
  };

  componentDidUpdate({ config }) {
    let {
      url,
      params
    }: {
      url: string;
      params: any;
    } = this.state;
    if (R.equals(config.params, params) && url === config.url) {
      return false;
    }
    this.init();
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    if (this.echarts_react) {
      this.echarts_react.dispose();
    }
  }

  render() {
    let { loading, dataSrc, params, option } = this.state;
    let { tstart, tend } = params;
    let renderer = lib.getRenderer(params);
    let height = lib.getChartHeight(params, option);

    return (
      <Tabs defaultActiveKey="1" className={styles.chartContainer}>
        <TabPane tab="数据图表" key="1">
          <Card
            bodyStyle={{ padding: '20px' }}
            className={styles.exCard}
            loading={loading}
            bordered={false}>
            {option.map((opt, key) => (
              <ReactEcharts
                key={key}
                ref={(e) => {
                  this.echarts_react = e;
                }}
                option={opt}
                style={{ height, marginTop: key ? 40 : 0 }}
                opts={{ renderer }}
              />
            ))}
          </Card>
        </TabPane>
        <TabPane tab="原始数据" key="2">
          <VTable
            dataSrc={dataSrc}
            loading={loading}
            subTitle={`统计期间: ${tstart} 至 ${tend}`}
          />
        </TabPane>
      </Tabs>
    );
  }
}
