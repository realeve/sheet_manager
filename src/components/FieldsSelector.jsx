import React, { Component } from "react";
import { Checkbox } from "antd";
import styles from "./TableCalc.less";

const CheckboxGroup = Checkbox.Group;
const R = require("ramda");

class FiledsSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      header: props.header,
      title: props.title,
      indeterminate: true,
      checkAll: false,
      checkedList: [],
      allChecked: props.header.map((item, i) => i),
      desc: props.desc
    };
  }

  // 返回的值即是当前需要setState的内容
  static getDerivedStateFromProps({ header, desc, checkedList }, state) {
    if (
      R.equals(header, state.header) &&
      R.equals(checkedList, state.checkedList)
    ) {
      return null;
    }

    return {
      header,
      checkedList,
      desc,
      allChecked: header.map((item, i) => i)
    };
  }

  onChange = checkedList => {
    let { header } = this.state;
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < header.length,
      checkAll: checkedList.length === header.length
    });
    this.props.onChange(checkedList);
  };

  onCheckAllChange = e => {
    let { allChecked } = this.state;
    let { checked } = e.target;
    const checkedList = checked ? allChecked : [];
    this.setState({
      checkedList,
      indeterminate: false,
      checkAll: checked
    });
    this.props.onChange(checkedList);
  };

  render() {
    let { header, title, desc, checkedList } = this.state;
    return (
      <>
        <div className={styles.container}>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            {title}
          </Checkbox>
          {desc && <p className={styles.desc}>{desc}</p>}
        </div>
        <CheckboxGroup
          options={header}
          value={checkedList}
          onChange={this.onChange}
          style={{ marginTop: 10 }}
        />
      </>
    );
  }
}

FiledsSelector.defaultProps = {
  header: [],
  onChange: e => {
    console.log(e);
  },
  title: "",
  checkedList: [],
  desc: ""
};

export default FiledsSelector;
