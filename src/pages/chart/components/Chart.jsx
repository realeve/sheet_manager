import React, { Component } from "react";
import { Card } from "antd";
import * as db from "../services/chart";
import styles from "./Chart.less";
import ReactEcharts from "./echarts-for-react";
const R = require("ramda");

// import theme from "../utils/theme";
// import echarts from "echarts";
// echarts.registerTheme("g2", theme);

class Charts extends Component {
  constructor(props) {
    super(props);
    let { dataSrc, params, url } = props.config;
    this.state = {
      loading: false,
      option: {},
      dataSrc,
      params,
      idx: props.idx,
      url
    };
  }

  init = async () => {
    let { dataSrc, params, url, idx } = this.state;
    let data = await db.computeDerivedState({ dataSrc, params, url, idx });
    this.setState({
      ...data
    });
  };

  componentDidMount() {
    this.init();
    // console.log(this.echarts_react);
    this.echarts_react.renderEchartDom();
    // window.onhashchange = () => {
    //   this.hashChange();
    // };
  }

  static getDerivedStateFromProps(nextProp, { dataSrc }) {
    if (R.equals(nextProp.dataSrc, { dataSrc })) {
      return { loading: true };
    }
    return {
      dataSrc,
      loading: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (R.equals(prevProps.dataSrc, prevState.dataSrc)) {
      console.log("update");
      return false;
    }

    // let state = await db.computeDerivedState(config, idx);
    // this.setState({
    //   ...state
    // });
  }

  // hashChange = async () => {
  //   let { config, idx } = this.state;
  //   this.setState({ loading: true });
  //   let state = await db.computeDerivedState(config, idx);
  //   console.log(state);
  //   this.setState({ ...state });
  //   this.chartInstance.renderEchartDom();
  // };

  render() {
    let { loading } = this.state;
    return (
      <Card
        style={{ width: "100%" }}
        bodyStyle={{ padding: "12px" }}
        className={styles.exCard}
        loading={loading}
      >
        <div>{JSON.stringify(this.state.config)}</div>
        <ReactEcharts
          ref={e => {
            this.echarts_react = e;
          }}
          option={this.state.option}
          style={{ height: "700px" }}
          opts={{ renderer: "svg" }}
        />
      </Card>
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
