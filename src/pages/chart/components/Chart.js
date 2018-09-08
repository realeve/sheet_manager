import React, { Component } from "react";
import { Card } from "antd";
import * as db from "../services/chart";
import styles from "./Chart.less";
import ReactEcharts from "./echarts-for-react";

// import theme from "../utils/theme";
// import echarts from "echarts";
// echarts.registerTheme("g2", theme);

const R = require("ramda");

class Charts extends Component {
  constructor(props) {
    super(props);
    this.config = props.config;
    this.dataSrc = {};

    this.state = {
      loading: false,
      option: {}
    };

    this.echarts = null;
  }

  init = async () => {
    let start = new Date();

    this.setState({ loading: true });
    this.dataSrc = await db.fetchData(this.config);
    this.hashChange();
    let end = new Date();
    console.log(
      "表格",
      this.config.params.ID,
      "加载完成，总耗时：",
      end.getTime() - start.getTime(),
      "ms"
    );
  };

  hashChange = () => {
    const option = this.getOption();
    this.setState({ loading: false, option });
    this.echarts_react.renderEchartDom();
    console.log(`option=${JSON.stringify(option)}`);
  };

  componentDidMount() {
    this.init();

    window.onhashchange = () => {
      this.hashChange();
    };
  }

  componentDidUpdate({ config }) {
    if (R.equals(config, this.config)) {
      return;
    }
    this.config = config;
    this.init();
  }

  getOption() {
    if (this.dataSrc.rows) {
      // 根据地址栏参数顺序决定图表配置顺序
      return db.getChartOption(this.dataSrc, this.props.idx, [
        this.config.params.tstart,
        this.config.params.tend
      ]);
    }
    return {
      tooltip: {},
      xAxis: {
        type: "category"
      },
      yAxis: {
        type: "value"
      },
      series: []
    };
  }

  render() {
    return (
      <Card
        style={{ width: "100%" }}
        bodyStyle={{ padding: "12px" }}
        className={styles.exCard}
      >
        <ReactEcharts
          ref={e => {
            this.echarts_react = e;
          }}
          option={this.state.option}
          style={{ height: "700px" }}
          opts={{ renderer: "canvas" }}
        />
      </Card>
    );
  }
}

Charts.defaultProps = {
  config: {
    url: "",
    params: {
      ID: "258",
      cache: 10,
      tstart: "",
      tend: ""
    }
  }
};

export default Charts;
