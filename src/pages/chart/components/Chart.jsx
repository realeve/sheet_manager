import React, { Component } from "react";
import { Card, Tabs } from "antd";
import * as db from "../services/chart";
import styles from "./Chart.less";
import ReactEcharts from "./echarts-for-react";
import VTable from "../../../components/Table.jsx";

const R = require("ramda");
const TabPane = Tabs.TabPane;

class Charts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      option: {},
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
    state.dataSrc.data = state.dataSrc.data.map(item => Object.values(item));
    this.setState({
      ...state
    });
    this.props.onLoad(state.dataSrc.title);
  };

  componentDidUpdate({ config }) {
    let { url, params } = this.state;
    if (R.equals(config.params, params) && url === config.url) {
      return false;
    }
    this.init();
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.echarts_react.dispose();
  }

  render() {
    let { loading, dataSrc, params, option } = this.state;
    let { tstart, tend } = params;
    let renderer = params.histogram ? "canvas" : "svg";
    let height = params.type === "sankey" ? "1000px" : "500px";
    return (
      <Tabs defaultActiveKey="1" className={styles.chartContainer}>
        <TabPane tab="数据图表" key="1">
          <Card
            bodyStyle={{ padding: "20px" }}
            className={styles.exCard}
            loading={loading}
            bordered={false}
          >
            <ReactEcharts
              ref={e => {
                this.echarts_react = e;
              }}
              option={option}
              style={{ height }}
              opts={{ renderer }}
            />
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

Charts.defaultProps = {
  config: {
    url: "",
    params: {
      cache: 10,
      tstart: "",
      tend: ""
    }
  }
};

export default Charts;
