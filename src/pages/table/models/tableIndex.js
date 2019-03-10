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
    *refreshData(_, { call, put, select }) {
      const { axiosOptions, dataSource } = yield select(state => state[namespace]);

      let curPageName = '';

      for (let idx = 0; idx < axiosOptions.length; idx++) {
        let { url } = axiosOptions[idx];
        dataSource[idx] = yield call(db.fetchData, axiosOptions[idx]);

        // 将apiid绑定在接口上，方便对数据设置存储
        dataSource[idx].api_id = url.replace('/array', '');
        curPageName = dataSource[idx].title;
      }

      // let showDateRange = true;
      // // 对单个查询条件做处理
      // if (axiosOptions.length === 1) {
      //   showDateRange = dataSource[0].dates.length > 0;
      // }

      yield put({
        type: 'common/setStore',
        payload: {
          curPageName,
          // showDateRange,
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
        console.log(match, pathname);
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

        if (id && id.length) {
          dispatch({
            type: 'refreshData',
          });
        }
      });
    },
  },
};
