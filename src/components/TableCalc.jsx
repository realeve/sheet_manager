import React, { Component } from "react";
import { Button, Row, Col, Card } from "antd";
import * as db from "../services/tableCalc";
import styles from "./TableCalc.less";
import * as setting from "../utils/setting";
import * as libMath from "../utils/math";
import VFiledsSelector from "./FieldsSelector";

import VTable from "./Table.jsx";

const dataOperator = libMath.dataOperator;

const R = require("ramda");
class TableCalc extends Component {
  constructor(props) {
    super(props);
    this.state = db.initState(props);
  }

  // 返回的值即是当前需要setState的内容
  static getDerivedStateFromProps(props, state) {
    // if (R.equals(props.dataSrc, state.dataSrc)) {
    //   return null; //{ loading: props.loading };
    // }
    return db.updateState(props, state);
  }

  fieldsChange = async fieldList => {
    let { groupList, operatorList } = this.state;
    fieldList = R.sort((a, b) => a - b)(fieldList);
    if (groupList.length === 0) {
      operatorList = [0];
    }
    await this.setState({
      fieldList,
      operatorList
    });
    this.saveFieldsSetting();
  };

  operatorChange = async operatorList => {
    await this.setState({
      operatorList
    });
    this.saveFieldsSetting();
  };

  groupChange = async groupList => {
    let { operatorList } = this.state;
    groupList = R.sort((a, b) => a - b)(groupList);
    if (groupList.length === 0) {
      operatorList = [0];
    }
    await this.setState({
      groupList,
      operatorList
    });
    this.saveFieldsSetting();
  };

  // 将分组字段，计算字段存储至本地
  saveFieldsSetting = () => {
    let { groupList, operatorList, fieldList, dataSrc } = this.state;
    let key = setting.lsKeys.calSetting + dataSrc.api_id;
    window.localStorage.setItem(
      key,
      JSON.stringify({ groupList, operatorList, fieldList })
    );
  };

  groupData = () => {
    let dataSource = db.getDataSourceWithState(this.state);
    this.setState({ dataSource });
  };

  render() {
    let {
      fieldHeader,
      groupHeader,
      fieldList,
      operatorList,
      groupList,
      dataSource,
      loading,
      subTitle
    } = this.state;
    return (
      <div>
        <Card title="基础设置" bordered>
          <Row gutter={16} style={{ marginTop: 10 }}>
            <Col span={8}>
              <VFiledsSelector
                title="参与分组的字段"
                desc="这些数据通常是文本类型的数据，比如日期、人员、设备等无法用于计算的数据"
                header={fieldHeader}
                onChange={this.fieldsChange}
                checkedList={fieldList}
              />
            </Col>
            <Col span={8}>
              <VFiledsSelector
                title="参与计算的字段"
                desc="这些数据通常是数值类型的数据，比如小数、整数等可用于计算平均值、求和。"
                header={groupHeader}
                onChange={this.groupChange}
                checkedList={groupList}
              />
            </Col>
            <Col span={8}>
              <VFiledsSelector
                title="计算方式"
                header={dataOperator}
                onChange={this.operatorChange}
                checkedList={operatorList}
              />
            </Col>
          </Row>
          <div className={styles.action}>
            <Button type="primary" onClick={this.groupData}>
              汇总数据
            </Button>
            {/* <Button>重置</Button> */}
          </div>
        </Card>
        <VTable dataSrc={dataSource} loading={loading} subTitle={subTitle} />
      </div>
    );
  }
}

TableCalc.defaultProps = {
  dataSrc: {
    data: [],
    title: "",
    rows: 0,
    time: "0ms",
    header: []
  },
  loading: false,
  cartLinkPrefix: setting.searchUrl,
  actions: false,
  subTitle: ""
};

export default TableCalc;
