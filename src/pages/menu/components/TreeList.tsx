import React from 'react';
import { Button, Popconfirm, Icon, notification } from 'antd';

import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import FileExplorerTheme from 'react-sortable-tree-theme-minimal';
import * as treeUtil from './tree-data-utils';
import * as db from '../service';
import styles from '../index.less';

const R = require('ramda');

function TreeList({ uid, treeDataLeft: treeList, editMenuItem, dispatch }) {
  // 移除菜单项
  const removeMenuItem: ({ path: string }) => void = async ({ path }) => {
    let treeDataLeft = R.clone(treeList);
    let { data } = await db.delBaseMenuItem(treeDataLeft[path].id);
    if (data[0].affected_rows === 0) {
      notification.error({
        message: '系统提示',
        description: '菜单项调整失败，请稍后重试.',
      });
      return;
    }
    treeDataLeft = treeUtil.removeNodeAtPath({
      treeData: treeDataLeft,
      path,
      getNodeKey: treeUtil.getNodeKey,
    });

    dispatch({
      type: 'menu/setStore',
      payload: {
        treeDataLeft,
      },
    });

    notification.success({
      message: '系统提示',
      description: '菜单项删除成功.',
    });
  };

  return treeList.length === 0 ? (
    <div className={styles.notSearch}>未搜索到菜单项</div>
  ) : (
    <div style={{ height: 500, marginRight: 20 }} className={styles.container}>
      <SortableTree
        treeData={treeList}
        onChange={() => {}}
        theme={FileExplorerTheme}
        rowHeight={32}
        dndType="shareNodeType"
        shouldCopyOnOutsideDrop={false}
        generateNodeProps={treeItem => {
          if (treeItem.node.uid != uid) {
            return null;
          }
          return {
            buttons: [
              <Button
                size="small"
                icon="edit"
                title="编辑"
                style={{ marginRight: 5 }}
                onClick={() => editMenuItem(treeItem)}
              />,
              <Popconfirm
                title="确定删除该菜单项?"
                okText="是"
                cancelText="否"
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                onConfirm={() => removeMenuItem(treeItem)}
              >
                <Button size="small" title="删除" icon="delete" />
              </Popconfirm>,
            ],
          };
        }}
      />
    </div>
  );
}

export default TreeList;
