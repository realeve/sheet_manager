import pathToRegexp from 'path-to-regexp';
import * as db from '../services/table';
import { setStore, handleUrlParams } from '@/utils/lib';

const R = require('ramda');

const namespace = 'table';
export default {
  namespace,
  state: {
    dateRange: [],
    tid: [],
    dataSource: [],
    params: [],
    axiosOptions: [],
    selectList: [],
  },
  reducers: {
    setStore,
  },
  effects: {
    *updateParams(_, { put, call, select }) {
      const { dateRange, params, tid } = yield select(state => state[namespace]);
      if (R.isNil(tid)) {
        return;
      }
      let axiosOptions = yield call(db.handleParams, {
        params,
        tid,
        dateRange,
      });

      yield put({
        type: 'setStore',
        payload: {
          axiosOptions,
        },
      });
    },
    // 条件选择项更新查询参数
    *updateAxiosOption(
      {
        payload: { idx, data },
      },
      { put, select }
    ) {
      let { axiosOptions } = yield select(state => state[namespace]);

      let { params } = axiosOptions[idx];
      params = Object.assign({}, R.clone(params), data);
      Reflect.deleteProperty(params, 'select');
      Reflect.deleteProperty(params, 'selectkey');

      axiosOptions[idx].params = params;
      yield put({
        type: 'setStore',
        payload: {
          axiosOptions,
        },
      });
    },
    // 初始化选择器
    *initSelector(_, { call, put, select }) {
      const { axiosOptions } = yield select(state => state[namespace]);

      let selectList = [];

      for (let idx = 0; idx < axiosOptions.length; idx++) {
        let param = axiosOptions[idx];
        let { params } = param;
        // 如果有select，只渲染选择项，不做数据初始化
        if (params.select) {
          let { title, data } = yield call(db.fetchData, { url: params.select + '.json?cache=5' });
          selectList[idx] = {
            title,
            data,
            key: params.selectkey,
          };
        }
      }

      yield put({
        type: 'setStore',
        payload: {
          selectList,
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
        let { id, params, dateRange } = handleUrlParams(hash);

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
