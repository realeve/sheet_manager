import React, { Component } from "react";
import { Button, Row, Col } from "antd";
import * as db from "../services/tableCalc";
import styles from "./Table.less";
import * as setting from "../utils/setting";
import * as lib from "../utils/lib";
import VFiledsSelector from "./FieldsSelector";

const R = require("ramda");
const dataOperator = [
  {
    label: "求和",
    value: 0
  },
  {
    label: "计数",
    value: 1
  },
  {
    label: "平均值",
    value: 2
  }
];
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

  refreshGroupList = (fieldList, groupList) => {
    return R.difference(groupList, fieldList);
  };

  fieldsChange = fieldList => {
    // let { groupList } = this.state;
    // console.log(groupList);
    // groupList = this.refreshGroupList(fieldList, groupList);
    // console.log(groupList);
    this.setState({
      fieldList
      // groupList
    });
  };

  operatorChange = operatorList => {
    this.setState({
      operatorList
    });
    console.log(operatorList);
  };

  groupChange = groupList => {
    // let { fieldList } = this.state;
    // groupList = this.refreshGroupList(fieldList, groupList);
    this.setState({
      groupList
      // fieldList
    });
    console.log(groupList);
  };

  render() {
    let { header, fieldList, operatorList, groupList } = this.state;
    return (
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
