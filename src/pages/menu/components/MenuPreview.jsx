import React, { Component } from 'react';

import { Button, Input, Popconfirm, notification, Icon } from 'antd';

import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';

import * as treeUtil from './tree-data-utils';
import * as db from '../service';
import styles from '../index.less';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const R = require('ramda');

class MenuPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      treeData: [],
      shouldCopyOnOutsideDrop: false,
      externalNodeType: props.externalNodeType,
      editMode: props.editMode,
      menu_id: 0,
      uid: props.uid,
      title: ''
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let { id, detail, title } = nextProps.menuDetail;
    if (R.isNil(id) || R.equals(id, prevState.menu_id)) {
      return null;
    }
    return {
      treeData: detail,
      menu_id: id,
      title,
      editMode: nextProps.editMode
    };
  }

  // 菜单层级调整
  onTreeChange = (treeData) => {
    this.setState({ treeData });
    console.log('菜单项调整：', treeData);
  };

  // 展开所有
  expandAll = () => {
    let { expanded, treeData } = this.state;
    treeData = treeUtil.toggleExpandedForAll({ expanded, treeData });
    this.setState({ treeData, expanded: !expanded });
  };

  // 移除菜单项
  removeMenuItem = async ({ path }) => {
    let { treeData } = R.clone(this.state);
    treeData = treeUtil.removeNodeAtPath({
      treeData,
      path,
      getNodeKey: treeUtil.getNodeKey
    });

    this.setState({ treeData });
  };

  noticeError = () => {
    // 数据插入失败
    notification.error({
      message: '系统提示',
      description: '菜单配置信息调整失败，请稍后重试.'
    });
  };

  submitMenu = async () => {
    let { treeData: detail, title, uid, editMode, menu_id } = this.state;
    let params = {
      title,
      detail: JSON.stringify(detail),
      uid
    };
    if (!editMode) {
      let { data } = await db.addBaseMenuList(params).catch((e) => {
        return [{ affected_rows: 0 }];
      });
      if (data[0].affected_rows === 0) {
        this.noticeError();
        return;
      }

      this.setState({
        editMode: true,
        menu_id: data[0].id
      });
    } else {
      params._id = menu_id;
      let { data } = await db.setBaseMenuList(params).catch((e) => {
        return [{ affected_rows: 0 }];
      });
      if (data[0].affected_rows === 0) {
        this.noticeError();
        return;
      }
    }

    this.props.onNew();

    notification.success({
      message: '系统提示',
      description: '菜单项调整成功.'
    });
  };

  render() {
    const {
      externalNodeType,
      shouldCopyOnOutsideDrop,
      treeData,
      expanded,
      editMode,
      title
    } = this.state;
    return (
      <>
        <p className={styles.title}>2.菜单编辑</p>
        <div className={styles.action} style={{ paddingLeft: 0 }}>
          <span style={{ width: 100 }}>菜单标题：</span>
          <Input
            prefix={<Icon type="edit" />}
            placeholder="菜单名称"
            value={title}
            onChange={(e) => this.setState({ title: e.target.value })}
          />
        </div>

        <div
          className={cx('action', 'action-submit')}
          style={{ paddingLeft: 0 }}>
          <Button onClick={this.expandAll}>
            {expanded ? '全部展开' : '全部折叠'}
          </Button>
          <Button onClick={this.props.onNew} icon="file">
            新建
          </Button>
          <Button
            type="primary"
            onClick={this.submitMenu}
            disabled={R.isNil(treeData) || treeData.length === 0}>
            {editMode ? '更新' : '新增'}
          </Button>
        </div>

        <div style={{ height: 500 }} className={styles.container}>
          <SortableTree
            treeData={treeData}
            onChange={this.onTreeChange}
            rowHeight={45}
            dndType={externalNodeType}
            shouldCopyOnOutsideDrop={shouldCopyOnOutsideDrop}
            generateNodeProps={(treeItem) => ({
              buttons: [
                <Popconfirm
                  title="确定删除该菜单项?"
                  okText="是"
                  cancelText="否"
                  icon={
                    <Icon type="question-circle-o" style={{ color: 'red' }} />
                  }
                  onConfirm={() => this.removeMenuItem(treeItem)}>
                  <Button size="small" icon="delete" />
                </Popconfirm>
              ]
            })}
          />
        </div>
      </>
    );
  }
}

MenuPreview.defaultProps = {
  externalNodeType: 'shareNodeType',
  menuDetail: [],
  editMode: false,
  treeData: []
};

export default MenuPreview;
