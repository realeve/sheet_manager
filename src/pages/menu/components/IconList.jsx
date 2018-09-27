import React, { Component } from "react";
import { Modal, Collapse, Icon } from "antd";
import iconList from "./iconList.js";
import styles from "./iconList.less";

const R = require("ramda");
const Panel = Collapse.Panel;

const mapPropsToState = props => ({
  visible: props.visible
});

class IconList extends Component {
  constructor(props) {
    super(props);
    this.state = mapPropsToState(props);
  }

  static getDerivedStateFromProps(props, state) {
    if (R.equals(props.visible, state.visible)) {
      return null;
    }
    return mapPropsToState(props);
  }

  handleOk = e => {
    this.props.onCancel(false);
  };

  handleCancel = e => {
    this.props.onCancel(false);
  };

  selectIcon = curIcon => {
    this.props.onOk(curIcon);
  };

  render() {
    // accordion
    const IconItems = ({ list }) =>
      list.map(type => (
        <li key={type}>
          <Icon
            onClick={() => this.selectIcon(type)}
            type={type}
            style={{ fontSize: 36 }}
          />
        </li>
      ));

    return (
      <Modal
        title="图标列表"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <Collapse bordered="false" defaultActiveKey={["2", "3", "4", "5"]}>
          {iconList.map(({ type, list }, key) => (
            <Panel header={key + 1 + ". " + type} key={key}>
              <ul className={styles.anticons}>
                <IconItems list={list} />
              </ul>
            </Panel>
          ))}
        </Collapse>
      </Modal>
    );
  }
}

IconList.defaultProps = {
  visible: false
};

export default IconList;
