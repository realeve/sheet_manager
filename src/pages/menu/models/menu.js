import pathToRegexp from 'path-to-regexp';
import { setStore } from '@/utils/lib';

import * as db from '../service';

const namespace = 'menu';
export default {
  namespace,
  state: {
    treeDataLeft: [],
    treeDataRight: [],
    menuList: [],
    menuItemList: [],
  },
  reducers: {
    setStore,
  },
  effects: {
    *refreshMenuList(_, { call, put }) {
      let { data } = yield call(db.getBaseMenuList);
      let menuList = data.map(item => {
        item.detail = JSON.parse(item.detail);
        return item;
      });

      let { data: menuItemList } = yield call(db.getBaseMenuItem);

      yield put({
        type: 'setStore',
        payload: {
          menuList,
          menuItemList,
          treeDataLeft: menuItemList,
        },
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/' + namespace).exec(pathname);
        if (!match) {
          return;
        }
        dispatch({ type: 'refreshMenuList' });
      });
    },
  },
};
