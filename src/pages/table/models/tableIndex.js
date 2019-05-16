import pathToRegexp from 'path-to-regexp';
import * as db from '../services/table';
import { setStore, handleTextVal } from '@/utils/lib';
import * as R from 'ramda';
import { isDisabled } from '@/components/QueryCondition';

const namespace = 'table';

export default {
  namespace,
  state: {
    dataSource: [],
    axiosOptions: [],
    err: false,
  },
  reducers: {
    setStore,
    initState() {
      return { dataSource: [], axiosOptions: [] };
    },
  },
  effects: {
    *updateParams(_, { put, call, select }) {
      let {
        dateRange,
        tid,
        query,
        selectValue,
        textAreaValue,
        dateType: [dateType],
      } = yield select(state => state.common);

      if (R.isNil(tid)) {
        return;
      }
      let axiosOptions = yield call(db.handleParams, {
        params: query,
        tid,
        dateRange,
        dateType,
      });

      let inputValue = handleTextVal(textAreaValue);

      axiosOptions = axiosOptions.map(item => {
        item.params = { ...item.params, ...selectValue, ...inputValue };
        Reflect.deleteProperty(item.params, 'select');
        Reflect.deleteProperty(item.params, 'selectkey');
        Reflect.deleteProperty(item.params, 'cascade');
        Reflect.deleteProperty(item.params, 'textarea');
        Reflect.deleteProperty(item.params, 'textareakey');
        Reflect.deleteProperty(item.params, 'merge');
        Reflect.deleteProperty(item.params, 'mergetext');
        Reflect.deleteProperty(item.params, 'mergev');
        return item;
      });

      yield put({
        type: 'setStore',
        payload: {
          axiosOptions,
        },
      });
    },

    *refreshData({ payload }, { call, put, select }) {
      const { tid, query, ...common } = yield select(state => state.common);

      // 参数是否全部设置
      const disabled = isDisabled(common);
      if (disabled) {
        return;
      }

      if (!R.isNil(payload)) {
        // 首次加载数据
        if (!(payload.isInit && tid && tid.length && R.isNil(query.select))) {
          return;
        }
      }

      const { axiosOptions, dataSource } = yield select(state => state[namespace]);

      let curPageName = '';
      for (let idx = 0; idx < axiosOptions.length; idx++) {
        let param = axiosOptions[idx];
        let { data } = param;
        dataSource[idx] = yield call(db.fetchData, param);
        // 将apiid绑定在接口上，方便对数据设置存储
        dataSource[idx].api_id = `${data.id}/${data.nonce}`;
        curPageName = dataSource[idx].title || '';
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
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/' + namespace).exec(pathname);
        if (!match) {
          return;
        }

        // 初始化数据
        dispatch({
          type: 'initState',
        });

        dispatch({
          type: 'updateParams',
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
