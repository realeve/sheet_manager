import pathToRegexp from 'path-to-regexp';
import { setStore, handleTextVal } from '@/utils/lib';
import * as db from '../services/chart';
import * as R from 'ramda';
import { isDisabled } from '@/components/QueryCondition';

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
      let common = yield select(state => state.common);
      let disabled = isDisabled(common);
      if (disabled) {
        return;
      }

      let {
        dateRange,
        tid,
        query,
        selectValue,
        textAreaValue,
        dateType: [dateType],
      } = common;
      if (!R.isNil(payload)) {
        // 首次加载数据
        if (!(payload.isInit && tid && tid.length && R.isNil(query.select))) {
          return;
        }
      }
      let inputValue = handleTextVal(textAreaValue);
      let config = db.decodeHash({ selectValue, dateRange, tid, query, inputValue, dateType });
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
