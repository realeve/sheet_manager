import pathToRegexp from 'path-to-regexp';
import { setStore } from '@/utils/lib';
import * as db from '../services/chart';
import * as R from 'ramda';
import * as tableUtil from '@/pages/table/models/tableIndex';

const namespace = 'chart';
export default {
  namespace,
  state: {
    config: [],
    selectList: [],
    selectValue: {},
  },
  reducers: {
    setStore,
  },
  effects: {
    *refreshSelector(
      {
        payload: { idx, data },
      },
      { put, select, call }
    ) {
      let { selectList } = yield select(state => state[namespace]);
      let { query } = yield select(state => state.common);
      selectList = yield tableUtil.getCascadeSelectList(query, selectList, idx, data, call);
      yield put({
        type: 'setStore',
        payload: {
          selectList,
          selectValue: data,
        },
      });
    },
    *refreshData({ payload }, { put, select }) {
      let res = yield select(state => state[namespace]);
      let { dateRange, tid, query } = yield select(state => state.common);
      if (!R.isNil(payload)) {
        // 首次加载数据
        if (!(payload.isInit && tid && tid.length && R.isNil(query.select))) {
          return;
        }
      }

      let config = db.decodeHash({ ...res, dateRange, tid, query });
      yield put({
        type: 'setStore',
        payload: {
          config,
        },
      });
    },
    // 初始化选择器
    *initSelector(_, { call, put, select }) {
      const { query } = yield select(state => state.common);
      let selectList = yield tableUtil.getSelectList(query, call);
      yield put({
        type: 'setStore',
        payload: {
          selectList,
          selectValue: {},
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
        dispatch({
          type: 'initSelector',
        });
        dispatch({
          type: 'refreshData',
          payload: {
            isInit: true,
          },
        });
      });
    },
  },
};
