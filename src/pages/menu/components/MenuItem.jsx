import React, { Component } from "react";
import { Modal, Button, Input, Row, Col, Icon } from "antd";
import styles from "./menuitem.less";
import IconList from "./IconList.jsx";

const R = require("ramda");

const mapPropsToState = props => ({
  visible: props.visible,
  menuItem: props.menuItem,
  editMode: props.editMode
});

class MenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = mapPropsToState(props);
  }

  static getDerivedStateFromProps(props, state) {
    if (
      // R.equals(props.visible, state.visible) ||
      // (props.editMode && R.isNil(props.menuItem))
      R.equals(props, state)
    ) {
      return null;
    }
    return mapPropsToState(props);
  }

  handleOk = e => {
    console.log(this.state);
    this.props.onCancel(false);
  };

  handleCancel = e => {
    this.props.onCancel(false);
  };

  toggleIconList = iconVisible => {
    this.setState({
      iconVisible
    });
  };

  chooseIcon = () => {
    this.toggleIconList(true);
  };

  updateIcon = icon => {
    let { menuItem } = this.state;
    menuItem = Object.assign(menuItem, { icon });
    this.setState({ menuItem });
    this.toggleIconList(false);
  };

  render() {
    let { menuItem, editMode, iconVisible } = this.state;
    menuItem = menuItem || { title: "", url: "", icon: "" };
    let urlIcon = menuItem.icon === "" ? "图标" : <Icon type={menuItem.icon} />;
    return (
      <Modal
        title={editMode ? "编辑菜单项" : "新增菜单项"}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <IconList
          visible={iconVisible}
          onCancel={this.toggleIconList}
          onOk={this.updateIcon}
        />
        <Row className={styles.title}>
          <Button onClick={this.chooseIcon}>{urlIcon}</Button>
          <Input placeholder="标题" defaultValue={menuItem.title} />
        </Row>
        <Input
          className={styles.input}
          placeholder="链接地址"
          defaultValue={menuItem.url}
        />
      </Modal>
    );
  }
}

MenuItem.defaultProps = {
  visible: false,
  menuItem: {
    title: "",
    url: "",
    icon: ""
  },
  editMode: false,
  iconVisible: false
};

export default MenuItem;
