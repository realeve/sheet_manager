import pathToRegexp from 'path-to-regexp';
import * as db from '../services/table';
import { setStore, handleUrlParams } from '@/utils/lib';

const R = require('ramda');

const namespace = 'table';
const needCascade = params => !(R.isNil(params.cascade) || params.cascade[0] === '0');

export function* getSelectList(params, call) {
  if (R.isNil(params.select)) {
    return [];
  }
  // 数据初始化长度,在级联选择时，只初始化第N级选择器,
  // cascade参数用于在第N级开始做级联选择，在此之前的select直接渲染
  let initLength = needCascade(params) ? parseInt(params.cascade[0], 10) : params.select.length;

  let selectList = [];
  for (let idx = 0; idx < initLength; idx++) {
    let url = params.select[idx];
    let { title, data } = yield call(db.fetchData, { url, params: { cache: 5 } });
    selectList[idx] = {
      title,
      data,
      key: params.selectkey[idx],
    };
  }
  return selectList;
}

export function* getCascadeSelectList(params, selectList, idx, data, call) {
  // 需要级联
  if (needCascade(params)) {
    let cascadeIdx = parseInt(params.cascade, 10);
    let nextIdx = idx + 1;
    // 在cascade所指向的索引后续的条件中，均需要级联
    if (cascadeIdx <= nextIdx && nextIdx < params.select.length) {
      // 取下一级选择项的Url
      let url = params.select[nextIdx];
      let { title, data: selectData } = yield call(db.fetchData, {
        url,
        params: { cache: 5, ...data },
      });
      selectList[nextIdx] = {
        title,
        data: selectData,
        key: params.selectkey[nextIdx],
      };
    }
  }
  return selectList;
}

export default {
  namespace,
  state: {
    dateRange: [],
    tid: [],
    dataSource: [],
    params: [],
    axiosOptions: [],
    selectList: [],
    selectValue: {},
  },
  reducers: {
    setStore,
    clearSelectList(state) {
      return {
        ...state,
        selectList: [],
        params: [],
        axiosOptions: [],
      };
    },
  },
  effects: {
    *updateParams(_, { put, call, select }) {
      const { dateRange, params, tid, selectValue } = yield select(state => state[namespace]);
      if (R.isNil(tid)) {
        return;
      }
      let axiosOptions = yield call(db.handleParams, {
        params,
        tid,
        dateRange,
      });
      axiosOptions = axiosOptions.map(item => {
        item.params = { ...item.params, ...selectValue };
        Reflect.deleteProperty(item.params, 'select');
        Reflect.deleteProperty(item.params, 'cascade');
        Reflect.deleteProperty(item.params, 'selectkey');
        return item;
      });

      yield put({
        type: 'setStore',
        payload: {
          axiosOptions,
        },
      });
    },
    // 条件选择项更新查询参数
    *refreshSelector(
      {
        payload: { idx, data },
      },
      { put, select, call }
    ) {
      let { params, selectList } = yield select(state => state[namespace]);
      selectList = yield getCascadeSelectList(params, selectList, idx, data, call);
      yield put({
        type: 'setStore',
        payload: {
          selectList,
          selectValue: data,
        },
      });
    },

    // 初始化选择器
    *initSelector(_, { call, put, select }) {
      const { params } = yield select(state => state[namespace]);
      let selectList = yield getSelectList(params, call);
      yield put({
        type: 'setStore',
        payload: {
          selectList,
          selectValue: {},
        },
      });
    },
    *refreshData(_, { call, put, select }) {
      const { axiosOptions, dataSource } = yield select(state => state[namespace]);

      let curPageName = '';
      for (let idx = 0; idx < axiosOptions.length; idx++) {
        let param = axiosOptions[idx];
        let { url } = param;
        dataSource[idx] = yield call(db.fetchData, param);
        // 将apiid绑定在接口上，方便对数据设置存储
        dataSource[idx].api_id = url.replace('/array', '');
        curPageName = dataSource[idx].title;
      }

      yield put({
        type: 'common/setStore',
        payload: {
          curPageName,
        },
      });
      yield put({
        type: 'setStore',
        payload: {
          dataSource,
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

        // 处理URL参数，对参数中包含逗号的做数组分割
        let { id, params, dateRange } = handleUrlParams(hash, true);

        dispatch({ type: 'clearSelectList' });

        dispatch({
          type: 'setStore',
          payload: {
            dateRange,
            tid: id,
            params,
            dataSource: [], // url变更时，数据变更
          },
        });

        dispatch({
          type: 'updateParams',
        });

        dispatch({
          type: 'initSelector',
        });

        if (id && id.length && R.isNil(params.select)) {
          dispatch({
            type: 'refreshData',
          });
        }
      });
    },
  },
};
