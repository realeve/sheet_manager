import pathToRegexp from 'path-to-regexp';
import { setStore, handleUrlParams } from '@/utils/lib';
import * as db from '../services/chart';
import * as R from 'ramda';
import * as tableUtil from '@/pages/table/models/tableIndex';

const namespace = 'chart';
export default {
  namespace,
  state: {
    dateRange: [],
    tid: [],
    query: {},
    config: [],
    selectList: [],
    selectValue: {},
  },
  reducers: {
    setStore,
    clearQuery(state) {
      return {
        ...state,
        query: {},
      };
    },
  },
  effects: {
    *refreshSelector(
      {
        payload: { idx, data },
      },
      { put, select, call }
    ) {
      let { query, selectList } = yield select(state => state[namespace]);
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
      let config = db.decodeHash({ ...payload, ...res });

      yield put({
        type: 'setStore',
        payload: {
          config,
        },
      });
    },
    // 初始化选择器
    *initSelector(_, { call, put, select }) {
      const { query } = yield select(state => state[namespace]);
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
      return history.listen(({ pathname, hash }) => {
        const match = pathToRegexp('/' + namespace).exec(pathname);
        if (!match) {
          return;
        }

        dispatch({
          type: 'clearQuery',
        });

        let { id, params, dateRange } = handleUrlParams(hash);

        // 处理select参数
        if (params.select) {
          ['select', 'selectkey'].forEach(key => {
            if (typeof params[key] === 'string') {
              if (params[key].includes(',')) {
                params[key] = params[key].split(',');
              } else if (params[key].includes(';')) {
                params[key] = params[key].split(';');
              }
            }
          });
        }
        // /chart#id=6/8d5b63370c&id=6/8d5b63370c&data_type=score&x=3&y=4&legend=2&select=77/51bbce6074,77/51bbce6074,77/51bbce6074&selectkey=prod,prod2,prod3&cascade=1
        dispatch({
          type: 'setStore',
          payload: {
            dateRange,
            tid: id,
            query: params,
          },
        });

        let [tstart, tend] = dateRange;

        dispatch({
          type: 'initSelector',
        });

        if (id && id.length && R.isNil(params.select)) {
          dispatch({
            type: 'refreshData',
            payload: {
              tstart,
              tend,
            },
          });
        }
      });
    },
  },
};
