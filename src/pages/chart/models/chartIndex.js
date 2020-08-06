import pathToRegexp from 'path-to-regexp';
import { setStore, handleTextVal } from '@/utils/lib';
import * as db from '../services/chart';
// import * as R from 'ramda';
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
        yield put({
          type: 'initState',
        });
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

      if (!tid) {
        yield put({
          type: 'initState',
        });
        return;
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
      return history.listen(props => {
        const match = pathToRegexp('/' + namespace).exec(props.pathname);
        if (!match) {
          return;
        } 

        dispatch({
          type: 'refreshData',
        });

        // dispatch({ type: 'initState' });
      });
    },
  },
};
