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
    *refreshData(_, { put, select }) {
      let common = yield select(state => state.common);
      let disabled = isDisabled({ ...common, select: common.query.select });

      if (disabled) {
        return;
      }

      // console.log('refresh chart data');
      let {
        dateRange,
        tid,
        query,
        selectValue,
        textAreaValue,
        dateType: [dateType],
      } = common;

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
      });
    },
  },
};
