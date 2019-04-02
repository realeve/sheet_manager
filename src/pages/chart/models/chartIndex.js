import pathToRegexp from 'path-to-regexp';
import { setStore } from '@/utils/lib';
import * as db from '../services/chart';
import * as R from 'ramda';

const namespace = 'chart';
export default {
  namespace,
  state: {
    config: [],
  },
  reducers: {
    setStore,
    initState() {
      return { config: [] };
    },
  },
  effects: {
    *refreshData({ payload }, { put, select }) {
      let { dateRange, tid, query, selectValue, textAreaValue } = yield select(
        state => state.common
      );
      if (!R.isNil(payload)) {
        // 首次加载数据
        if (!(payload.isInit && tid && tid.length && R.isNil(query.select))) {
          return;
        }
      }

      let inputValue = handleTextVal(textAreaValue);

      let config = db.decodeHash({ selectValue, dateRange, tid, query, inputValue });
      yield put({
        type: 'setStore',
        payload: {
          config,
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
        dispatch({ type: 'initState' });
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
