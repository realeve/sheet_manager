import React, { useState, useEffect } from 'react';
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
import { useSetState } from 'react-use';
import CodeDrawer from './code';
import beautify from 'js-beautify';

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

/**
 * todo:
 * 1.增加group选项，数据以此做切换(2018-11-25 已完成)；
 * 2.对参数长度排序，以最长的为准做合并，避免出现 &id=a&id=a...&otherparams的情况
 */

const Charts = ({ dispatch, ...props }: IProp) => {
  const [state, setState] = useSetState({
    loading: false,
    // option: [],
    idx: props.idx,
    showErr: false,
    params: {},
    dataSrc: {
      data: [],
      rows: 0,
    },
  });

  const [appendParams, setAppendParams] = useSetState({});

  const [option, setOption] = useState([]);

  const init = async () => {
    setState({ loading: true });
    let params = R.clone(props.config);
    let nextParam: IConfigState = getParams(params);
    params = Object.assign(params, nextParam, appendParams);
    setState({ params });
    if (R.equals(params, {})) {
      setState({ loading: false });
      return;
    }

    let { dataSrc, option } = await db
      .computeDerivedState({
        method: props.textAreaList.length > 0 ? 'post' : 'get',
        params,
      })
      .finally(e => {
        setState({ loading: false });
      });

    setOption(option);
    setState({ showErr: false, dataSrc });
    props.onLoad(dataSrc.title);
  };

  useEffect(() => {
    init();
  }, [JSON.stringify(props.config), JSON.stringify(appendParams)]);

  const changeParam: (axisName: TAxisName, value: string) => void = (axisName, value) => {
    let commonKeys = ['x', 'y', 'z', 'legend', 'group'];
    // visual可以与其它轴一同设置
    if (axisName === 'visual') {
      setAppendParams({
        ...appendParams,
        [axisName]: value,
      });
      return;
    }
    // 是否有轴需要互换;
    let res = {
      key: null,
      value: null,
    };

    let nextParam = R.clone(appendParams);

    R.compose(
      R.forEach(key => {
        if (commonKeys.includes(key) && nextParam[key] == value) {
          res = { key, value };
        }
      }),
      R.keys
    )(nextParam);

    if (!R.isNil(res.key)) {
      // 旧数据
      let prevValue = nextParam[axisName];
      nextParam[res.key] = prevValue;
    }

    // 更新当前数据
    nextParam[axisName] = value;

    setAppendParams(nextParam);
  };

  const staticRanges = ([tstart, tend]) => {
    let format = '';
    switch (props.dateFormat) {
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
      `${formatMessage({ id: 'app.daterange.name' })}: ${moment(tstart, props.dateFormat).format(
        format
      )}` +
      (tstart === tend
        ? ''
        : ` ${formatMessage({
            id: 'app.daterange.to',
          })} ${moment(tend, props.dateFormat).format(format)}`)
    );
  };

  let [modalVisible, setModalVisible] = useState(false);

  const downloadHtml = () => {
    const beautyOption = {
      indent_size: 2,
      wrap_line_length: 80,
      jslint_happy: true,
    };
    const code: string = beautify(JSON.stringify(option[0]), beautyOption);
    const scriptStr = window.location.href.includes('3d')
      ? `
    <script type="text/javascript" src="http://${window.location.host}/doc/echarts-gl.min.js"></script>`
      : '';

    let html = `
<!DOCTYPE html>
<html style="height: 100%"> 
  <head>
    <script type="text/javascript" src="http://${window.location.host}/doc/echarts.min.js"></script>${scriptStr}
    <script type="text/javascript" src="http://${window.location.host}/doc/echarts.theme.js"></script>
  </head>
  <body style="height: 100%; margin: 0">
    <div id="chart" style="height: 100%"></div>    
    <script type="text/javascript">
      var dom = document.getElementById("chart");
      var myChart = echarts.init(dom,theme); 
      var option = ${code};
      if (option && typeof option === "object") {
        var startTime = +new Date();
        myChart.setOption(option, true);
        var endTime = +new Date();
        var updateTime = endTime - startTime;
        console.log("Time used:", updateTime);
      }
    </script>
  </body>
</html>`;

    let blob = new Blob([html], {
        type: 'text/html;charset=UTF-8',
        encoding: 'UTF-8',
      }),
      link = document.createElement('a');
    (link.href = URL.createObjectURL(blob)),
      (link.download = dataSrc.title + '.html'),
      link.click();
  };

  let { loading, dataSrc } = state;
  let tblDataSrc = R.clone(dataSrc);
  tblDataSrc.data = tblDataSrc.data.map(item => Object.values(item));

  return (
    <>
      <CodeDrawer
        formConfig={option}
        setFormConfig={setOption}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <Tabs defaultActiveKey="1" className={styles.chartContainer}>
        <TabPane tab={formatMessage({ id: 'chart.tab.chart' })} key="1">
          {dataSrc.header && (
            <ChartConfig
              header={dataSrc.header || false}
              params={{ ...state.params, ...appendParams }}
              onChange={(key: TAxisName, val: string) => changeParam(key, val)}
              onSwitch={(key: TAxisName, val: boolean) => {
                setAppendParams({ ...appendParams, [key]: val });
              }}
              onEdit={() => {
                setModalVisible(!modalVisible);
              }}
              onDownload={downloadHtml}
            />
          )}
          <Card
            bodyStyle={{
              padding: '10px 20px',
            }}
            className={styles.exCard}
            loading={loading}
            bordered={false}
          >
            {option.map((opt, key) => (
              <ChartComponent
                key={key}
                option={opt}
                renderer={lib.getRenderer(state.params)}
                style={{
                  height: lib.getChartHeight(state.params, option),
                  marginTop: key ? 40 : 0,
                }}
              />
            ))}
          </Card>
        </TabPane>
        <TabPane tab={formatMessage({ id: 'chart.tab.table' })} key="2" style={{ padding: 15 }}>
          <VTable
            dataSrc={tblDataSrc}
            loading={loading}
            subTitle={
              dataSrc.dates &&
              dataSrc.dates.length > 0 &&
              staticRanges([state.params.tstart, state.params.tend])
            }
            merge={false}
          />
        </TabPane>
      </Tabs>
    </>
  );
};

export default connect(({ common }) => ({
  dateFormat: common.dateFormat,
  textAreaList: common.textAreaList,
}))(Charts);
