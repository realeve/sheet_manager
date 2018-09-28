import React, { Component } from "react";
import { Input, Button, Popconfirm, Icon, notification } from "antd";
import { connect } from "dva";

import styles from "./MenuList.less";

import * as db from "../service";

const R = require("ramda");

export default class MenuList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuList: [],
      uid: props.uid
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = async () => {
    let { data } = await db.getBaseMenuList();
    let menuList = data.map(item => {
      item.detail = JSON.parse(item.detail);
      return item;
    });
    this.setState({
      menuList
    });
  };

  editMenu = (menuItem, mode) => {
    this.props.onEdit(menuItem);
  };

  render() {
    let { menuList, uid } = this.state;
    return (
      <>
        <p className={styles.title}>3.菜单列表</p>
        <ul className={styles.menuContainer}>
          {menuList.map(item => (
            <li key={item.id}>
              <div>{item.title}</div>
              <div className={styles.action}>
                {uid == item.uid && (
                  <Button
                    shape="circle"
                    title="编辑"
                    icon="edit"
                    onClick={() => this.editMenu(item, "edit")}
                  />
                )}
                <Button shape="circle" title="设为当前菜单" icon="home" />
                <Button type="primary" title="预览">
                  预览
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  }
}
