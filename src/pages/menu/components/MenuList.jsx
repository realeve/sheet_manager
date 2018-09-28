import React, { Component } from "react";
import { Button, Popconfirm, Icon, notification } from "antd";
import { connect } from "dva";
import styles from "./MenuList.less";
import * as db from "../service";

const R = require("ramda");

export default class MenuList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuList: props.menuList,
      uid: props.uid
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (R.equals(nextProps.menuList, prevState.menuList)) {
      return null;
    }
    return {
      menuList: nextProps.menuList
    };
  }

  editMenu = menuItem => {
    this.props.onEdit(menuItem, "edit");
  };

  removeMenu = async (menuItem, idx) => {
    let { data } = await db.delBaseMenuList({
      _id: menuItem.id,
      uid: menuItem.uid
    });
    if (data[0].affected_rows === 0) {
      this.noticeError();
      return;
    }

    // 从列表中删除
    // this.setState({
    //   menuList: R.remove(idx, 1)(this.state.menuList)
    // });

    // 重置现在编辑的菜单项
    this.props.onEdit(menuItem, "del");

    notification.success({
      message: "系统提示",
      description: "菜单配置删除成功."
    });
  };

  noticeError = () => {
    // 数据插入失败
    notification.error({
      message: "系统提示",
      description: "菜单配置信息调整失败，请稍后重试."
    });
  };

  render() {
    let { menuList, uid } = this.state;
    return (
      <>
        <p className={styles.title}>3.菜单列表</p>
        <ul className={styles.menuContainer}>
          {menuList.map((item, idx) => (
            <li key={item.id}>
              <div>{item.title}</div>
              <div className={styles.action}>
                {uid == item.uid && (
                  <>
                    <Button
                      shape="circle"
                      title="编辑"
                      icon="edit"
                      onClick={() => this.editMenu(item)}
                    />
                    <Popconfirm
                      title="确定删除该菜单配置?"
                      okText="是"
                      cancelText="否"
                      icon={
                        <Icon
                          type="question-circle-o"
                          style={{ color: "red" }}
                        />
                      }
                      onConfirm={() => this.removeMenu(item, idx)}
                    >
                      <Button
                        shape="circle"
                        title="删除"
                        type="danger"
                        icon="delete"
                      />
                    </Popconfirm>
                  </>
                )}
                <Button shape="circle" title="设为当前菜单" icon="home" />
                <Button
                  shape="circle"
                  type="primary"
                  title="预览"
                  icon="like"
                />
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  }
}
