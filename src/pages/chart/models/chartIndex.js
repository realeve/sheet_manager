import pathToRegexp from 'path-to-regexp';
import { setStore, handleUrlParams } from '@/utils/lib';
import * as db from '../services/chart';
const namespace = 'chart';
export default {
  namespace,
  state: {
    dateRange: [],
    tid: [],
    query: {},
    config: []
  },
  reducers: {
    setStore,
    clearQuery(state) {
      return {
        ...state,
        query: {}
      };
    }
  },
  effects: {
    *refreshConfig({ payload }, { call, put, select }) {
      const res = yield select((state) => state[namespace]);
      const config = db.decodeHash({ ...payload, ...res });
      yield put({
        type: 'setStore',
        payload: {
          config
        }
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, hash }) => {
        const match = pathToRegexp('/' + namespace).exec(pathname);
        if (!match) {
          return;
        }

        dispatch({
          type: 'clearQuery'
        });

        let { id, params, dateRange } = handleUrlParams(hash);
        dispatch({
          type: 'setStore',
          payload: {
            dateRange,
            tid: id,
            query: params
          }
        });

        let [tstart, tend] = dateRange;

        dispatch({
          type: 'refreshConfig',
          payload: {
            tstart,
            tend
          }
        });
      });
    }
  }
};
