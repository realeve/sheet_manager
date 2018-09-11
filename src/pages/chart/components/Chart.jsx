import React, { Component } from "react";
import { Card } from "antd";
import * as db from "../services/chart";
import styles from "./Chart.less";
import ReactEcharts from "./echarts-for-react";
const R = require("ramda");

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
  }

  static getDerivedStateFromProps({ config }, state) {
    let { dataSrc, params } = config;
    console.log(params, state.params);
    if (R.equals(dataSrc, state.dataSrc) && R.equals(params, state.params)) {
      return { loading: false };
    }
    return {
      dataSrc,
      params,
      loading: true
    };
  }

  componentDidUpdate({ config }) {
    let { dataSrc, url, params } = this.state;
    if (R.equals(config, { dataSrc, url, params })) {
      return false;
    }

    this.init();
  }

  render() {
    let { loading } = this.state;
    return (
      <Card
        style={{ width: "100%" }}
        bodyStyle={{ padding: "12px" }}
        className={styles.exCard}
        loading={loading}
      >
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
