import React, { Component } from "react";
import { Button, Row, Col, Card } from "antd";
import * as db from "../services/tableCalc";
import styles from "./TableCalc.less";
import * as setting from "../utils/setting";
import * as libMath from "../utils/math";
import VFiledsSelector from "./FieldsSelector";

const dataOperator = libMath.dataOperator;

const R = require("ramda");
class TableCalc extends Component {
  constructor(props) {
    super(props);
    this.state = db.initState(props);
  }

  // 返回的值即是当前需要setState的内容
  static getDerivedStateFromProps(props, state) {
    if (R.equals(props.dataSrc, state.dataSrc)) {
      return { loading: props.loading };
    }
    return db.updateState(props, state);
  }

  fieldsChange = fieldList => {
    let { groupList, operatorList } = this.state;
    fieldList = R.sort((a, b) => a - b)(fieldList);
    groupList = R.difference(groupList, fieldList);

    if (groupList.length === 0) {
      operatorList = [0];
    }

    this.setState({
      fieldList,
      groupList,
      operatorList
    });
  };

  operatorChange = operatorList => {
    this.setState({
      operatorList
    });
  };

  groupChange = groupList => {
    let { fieldList, operatorList } = this.state;
    groupList = R.sort((a, b) => a - b)(groupList);
    fieldList = R.difference(fieldList, groupList);
    if (groupList.length === 0) {
      operatorList = [0];
    }

    this.setState({
      groupList,
      fieldList,
      operatorList
    });
  };

  groupData = () => {
    let { dataSrc, groupList, fieldList, operatorList } = this.state;
    let res = libMath.groupArr({
      dataSrc,
      groupFields: groupList,
      calFields: fieldList,
      operatorList
    });
    console.log(res);
  };

  render() {
    let { header, fieldList, operatorList, groupList } = this.state;
    return (
      <Card title="基础设置" bordered>
        <Row gutter={16} style={{ marginTop: 10 }}>
          <Col span={8}>
            <VFiledsSelector
              title="参与分组的字段"
              desc="这些数据通常是文本类型的数据，比如日期、人员、设备等无法用于计算的数据"
              header={header}
              onChange={this.fieldsChange}
              checkedList={fieldList}
            />
          </Col>
          <Col span={8}>
            <VFiledsSelector
              title="参与计算的字段"
              desc="这些数据通常是数值类型的数据，比如小数、整数等可用于计算平均值、求和。"
              header={header}
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
          <Button>重置</Button>
        </div>
      </Card>
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
