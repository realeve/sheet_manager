import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tabs } from 'antd';
import * as db from '../services/chart';
import styles from './Chart.less';
import VTable from '@/components/Table.jsx';
import ChartConfig, { TAxisName, IConfigState, getParams } from './ChartConfig';
import ChartComponent from './ChartComponent';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
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
  dateFormat?: string;
  [key: string]: any;
}
interface IState extends Iconfig {
  loading: boolean;
  option: any;
  idx: number | string;
  appendParams: IConfigState;
  [key: string]: any;
}
/**
 * todo:
 * 1.增加group选项，数据以此做切换(2018-11-25 已完成)；
 * 2.对参数长度排序，以最长的为准做合并，避免出现 &id=a&id=a...&otherparams的情况
 */
class Charts extends Component<IProp, IState> {
  static defaultProps: Partial<IProp> = {
    config: {
      url: '',
      params: {
        cache: 10,
        tstart: '',
        tend: '',
      },
    },
    dateFormat: 'YYYYMMDD',
  };

  echarts_react = null;

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      option: [],
      idx: props.idx,
      ...props.config,
      dataSrc: {
        data: [],
        rows: 0,
      },
      appendParams: {}
    };
  }

  static getDerivedStateFromProps(props, state) {
    let params = props.config;
    let appendParams: IConfigState = getParams(params);

    if (R.equals(params, state.params)) {
      if (R.equals(appendParams, state.appendParams)) {
        return { loading: false };
      }
    }
    let isInited = Object.keys(state.appendParams).length === 0;
    appendParams = isInited ? appendParams : state.appendParams;
    params = Object.assign(params, appendParams);

    let newState =
      0 == state.dataSrc.rows
        ? {}
        : db.getDrivedState({
          dataSrc: state.dataSrc,
          params,
          idx: state.idx,
        });

    return { appendParams, params, loading: true, ...newState };
  }

  init = () => {
    const setLoadingStatus = spinning => {
      this.props.dispatch({
        type: 'common/setStore',
        payload: {
          spinning,
        },
      });
    }
    setLoadingStatus(true)
    let { params } = this.state;
    db.computeDerivedState({
      method: this.props.textAreaList.length > 0 ? 'post' : 'get',
      params,
    }).then(({ dataSrc, option }) => {
      this.setState({ showErr: false, dataSrc, option });
      this.props.onLoad(dataSrc.title);
    }).finally(e => {
      setLoadingStatus(false)
    })
  };

  componentDidUpdate({ config }) {
    let {
      // url,
      params,
      // appendParams,
      // option,
    } = this.state;
    // let prevAppendParams: IConfigState = getParams(params);

    if (R.equals(config, params)) {
      // if (R.equals(appendParams, prevAppendParams)) {
      //   if (option.length === 0) {
      //   }
      //   return false;
      // }
      return false;
    }
    this.init();
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.setState = () => ({
      loading: false,
      option: [],
      dataSrc: {
        data: [],
        rows: 0,
      },
      appendParams: {},
    });

    // this.props.dispatch({
    //   type: 'common/setStore',
    //   payload: {
    //     spinning: false,
    //   },
    // });
  }

  changeParam(axisName: TAxisName, value: string): void {
    let appendParams = R.clone(this.state.appendParams);
    let commonKeys = ['x', 'y', 'z', 'legend', 'group'];
    // visual可以与其它轴一同设置
    if (axisName === 'visual') {
      appendParams[axisName] = value;
      this.setState({ appendParams });
      return;
    }
    // 是否有轴需要互换;
    let res = {
      key: null,
      value: null,
    };
    R.compose(
      R.forEach(key => {
        if (commonKeys.includes(key) && appendParams[key] == value) {
          res = { key, value };
        }
      }),
      R.keys
    )(appendParams);

    if (!R.isNil(res.key)) {
      // 旧数据
      let prevValue = appendParams[axisName];
      appendParams[res.key] = prevValue;
    }

    // 更新当前数据
    appendParams[axisName] = value;
    this.setState({ appendParams });
  }

  staticRanges = ([tstart, tend]) => {
    let format = '';
    switch (this.props.dateFormat) {
      case 'YYYYMMDD':
        format = 'YYYY年M月D日';
        break;
      case 'YYYYMM':
        format = 'YYYY年M月';
        break;
      case 'YYYY':
      default:
        format = 'YYYY年';
        break;
    }

    return (
      `${formatMessage({ id: 'app.daterange.name' })}: ${moment(
        tstart,
        this.props.dateFormat
      ).format(format)}` +
      (tstart === tend
        ? ''
        : ` ${formatMessage({
          id: 'app.daterange.to',
        })} ${moment(tend, this.props.dateFormat).format(format)}`)
    );
  };

  render() {
    let { loading, dataSrc, params, option, appendParams } = this.state;
    let { tstart, tend } = params;
    let renderer = lib.getRenderer(params);
    let height = lib.getChartHeight(params, option);
    let header = dataSrc.header || false;
    let tblDataSrc = R.clone(dataSrc);

    tblDataSrc.data = tblDataSrc.data.map(item => Object.values(item));
    return (
      tblDataSrc.data.length > 0 && <Tabs defaultActiveKey="1" className={styles.chartContainer}>
        <TabPane tab={formatMessage({ id: 'chart.tab.chart' })} key="1">
          {header && (
            <ChartConfig
              header={header}
              params={appendParams}
              onChange={(key: TAxisName, val: string) => this.changeParam(key, val)}
              onSwitch={(key: TAxisName, val: boolean) => {
                let appendParams = R.clone(this.state.appendParams);
                appendParams[key] = val;
                this.setState({ appendParams });
              }}
            />
          )}
          <Card
            bodyStyle={{
              padding: '10px 20px',
            }}
            className={styles.exCard}
            // loading={loading}
            bordered={false}
          >
            {option.map((opt, key) => (
              <ChartComponent
                key={key}
                option={opt}
                renderer={renderer}
                style={{ height, marginTop: key ? 40 : 0 }}
              />
            ))}
          </Card>
        </TabPane>
        <TabPane tab={formatMessage({ id: 'chart.tab.table' })} key="2" style={{ padding: 15 }}>
          <VTable
            dataSrc={tblDataSrc}
            loading={loading}
            subTitle={
              dataSrc.dates && dataSrc.dates.length > 0 && this.staticRanges([tstart, tend])
            }
            merge={false}
          />
        </TabPane>
      </Tabs>
    );
  }
}

function mapStateToProps(state) {
  return {
    dateFormat: state.common.dateFormat,
    textAreaList: state.common.textAreaList
  };
}

export default connect(mapStateToProps)(Charts);
