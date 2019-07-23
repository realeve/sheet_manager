import qs from 'qs';
export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
  },

  effects: {
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`

      return history.listen(({ hash, search }) => {
        let params = qs.parse(hash.slice(1));
        if (hash.length === 0) {
          params = qs.parse(search.slice(1));
        }
        let menuFold = params.menufold && params.menufold !== '0';
        menuFold = Boolean(menuFold) || false;
        dispatch({ type: 'changeLayoutCollapsed', payload: menuFold });
      });
    },
  },
};
