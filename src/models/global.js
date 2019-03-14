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
      let params = qs.parse(history.location.hash.slice(1));
      if (history.location.hash.length === 0) {
        params = qs.parse(history.location.search.slice(1));
      }
      let menuFold = params.menufold && params.menufold !== '0';
      menuFold = menuFold || false;
      dispatch({ type: 'changeLayoutCollapsed', payload: menuFold });

      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
