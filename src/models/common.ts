import userTool from '@/utils/users';
import { setStore, handleUrlParams, str2Arr } from '@/utils/lib';
import { axios } from '@/utils/axios';
import qs from 'qs';
import * as R from 'ramda';
import { handleOptions } from '@/components/FormCreater/lib';
import router from 'umi/router';

const needCascade = params => !(R.isNil(params.cascade) || params.cascade[0] === '0');
export function* getSelectList(params, call) {
  if (R.isNil(params.select)) {
    return [];
  }
  // 数据初始化长度,在级联选择时，只初始化第N级选择器,
  // cascade参数用于在第N级开始做级联选择，在此之前的select直接渲染
  let initLength = needCascade(params) ? parseInt(params.cascade[0], 10) : params.select.length;

  let selectList = [];
  for (let idx = 0; idx < initLength; idx++) {
    let url = params.select[idx];
    let { title, data } = yield call(axios, { url, params: { cache: 5 } });
    selectList[idx] = {
      title,
      data: handleOptions(data),
      key: params.selectkey[idx],
    };
  }
  return selectList;
}

export function* getCascadeSelectList(params, selectList, idx, data, call) {
  // 需要级联
  if (needCascade(params)) {
    let cascadeIdx = parseInt(params.cascade, 10);
    let nextIdx = idx + 1;
    // 在cascade所指向的索引后续的条件中，均需要级联
    if (cascadeIdx <= nextIdx && nextIdx < params.select.length) {
      // 取下一级选择项的Url
      let url = params.select[nextIdx];
      let { title, data: selectData } = yield call(axios, {
        url,
        params: { cache: 5, ...data },
      });
      selectList[nextIdx] = {
        title,
        data: selectData,
        key: params.selectkey[nextIdx],
      };
    }
  }
  return selectList;
}

const getDateFormatByHash = hash => {
  let queryInfo = hash.slice(1);
  let params = qs.parse(queryInfo);
  let dateType = params.datetype || 'date';
  let dateFormat = 'YYYYMMDD';
  switch (dateType) {
    case 'year':
      dateFormat = 'YYYY';
      break;
    case 'month':
      dateFormat = 'YYYYMM';
      break;
    default:
    case 'date':
      dateFormat = 'YYYYMMDD';
      break;
  }
  return { dateType, dateFormat };
};

const namespace = 'common';
export interface IUserSetting {
  uid: string;
  avatar: string;
  menu: string;
  menu_title: string;
  previewMenu: any[];
  username: string;
  fullname: string;
  user_type: number;
  actived: number;
  dept_name: string;
  dateType: string[];
  dateFormat: string;
}

const defaultUserSetting: IUserSetting = {
  uid: '',
  avatar: '',
  menu: '',
  menu_title: '',
  previewMenu: [],
  username: '',
  fullname: '',
  user_type: 0,
  actived: 0,
  dept_name: '',
  dateType: ['date', 'date'],
  dateFormat: 'YYYYMMDD',
};

export interface ICommon {
  userSetting: IUserSetting;
  hidemenu: boolean;
  isLogin: boolean;
  curPageName: string;
  dateRange: any[];
  tid: any[];
  query: {};
  selectList: any[];
  selectValue: {};
  textAreaList: any[];
  textAreaValue: {};
  showDateRange: boolean;
  spinning: boolean;
  curUrl: string;
}
const defaultState: ICommon = {
  userSetting: defaultUserSetting,
  hidemenu: false,
  isLogin: false,
  curPageName: '',
  dateRange: [],
  tid: [],
  query: {},
  selectList: [],
  selectValue: {},
  textAreaList: [],
  textAreaValue: {},
  showDateRange: false,
  spinning: false,
  curUrl: '',
};

export default {
  namespace,
  state: defaultState,
  reducers: {
    setStore,
    initQuery(state, { payload }) {
      return {
        ...state,
        query: {},
        selectList: [],
        selectValue: {},
        textAreaList: [],
        textAreaValue: {},
        ...payload,
      };
    },
  },
  effects: {
    // 条件选择项更新查询参数
    *refreshSelector({ payload: { idx, data } }, { put, select, call }) {
      let { query, selectList } = yield select(state => state.common);
      selectList = yield getCascadeSelectList(query, selectList, idx, data, call);
      yield put({
        type: 'setStore',
        payload: {
          selectList,
          selectValue: data,
        },
      });
    },
    // 初始化选择器
    *initSelector(_, { call, put, select }) {
      const { query } = yield select(state => state.common);
      let selectList = yield getSelectList(query, call);
      // console.log(query, selectList);
      yield put({
        type: 'setStore',
        payload: {
          selectList,
          selectValue: {},
        },
      });
    },
    *handleLogin({ payload: { pathname } }, { put, select }) {
      const hideMenu = window.location.href.includes('hidemenu=1');

      const { isLogin } = yield select(state => state.common);

      if (!isLogin) {
        let curStatus = userTool.getLoginStatus(0);
        yield put({
          type: 'setStore',
          payload: {
            isLogin: curStatus === '1',
          },
        });
      }
      if (pathname !== '/login') {
        userTool.saveLastRouter(pathname);
      }

      // 登录逻辑
      let { data, success } = userTool.getUserSetting();
      if (pathname !== '/login' && !hideMenu) {
        if (!success || !data.autoLogin) {
          router.push('/login');
          return false;
        }
      }

      if (data && data.setting) {
        yield put({
          type: 'setStore',
          payload: {
            userSetting: data.setting,
          },
        });

        yield put({
          type: 'setting/getSetting',
        });
      }

      return true;
    },
    *handleTableAndChart({ payload: { pathname, hash } }, { put }) {
      let nextStore = {};
      if (['/chart', '/chart/', '/table', '/table/'].includes(pathname)) {
        let { dateType, dateFormat } = getDateFormatByHash(hash);
        nextStore = {
          dateType: [dateType, dateType],
          dateFormat,
        };
      }

      let { id, params, dateRange } = handleUrlParams(hash);
      // 处理select参数
      if (params.select) {
        ['select', 'selectkey'].forEach(key => {
          if (typeof params[key] === 'string') {
            params[key] = str2Arr(params[key]);
          }
        });
      }

      if (params.textarea) {
        ['textarea', 'textareakey'].forEach(key => {
          if (typeof params[key] === 'string') {
            params[key] = str2Arr(params[key]);
          }
        });
        nextStore.textAreaList = params.textarea.map((title, idx) => ({
          title,
          key: params.textareakey[idx],
        }));
      }

      yield put({
        type: 'initQuery',
        payload: {
          ...nextStore,
          dateRange,
          tid: id,
          query: params,
        },
      });

      yield put({
        type: 'initSelector',
      });
    },
    *init({}, { select, put }) {
      let { pathname, href: url, hash } = window.location;
      const { curUrl } = yield select(state => state.common);
      if (curUrl === url) {
        return;
      }

      console.log('开始刷新:', url);
      yield put({
        type: 'setStore',
        payload: {
          spinning: false,
          curUrl: url,
          hidemenu: (hash || '').includes('hidemenu=1'),
        },
      });

      let isLogin = yield put({
        type: 'handleLogin',
        payload: {
          pathname,
        },
      });
      if (!isLogin) {
        return;
      }

      yield put({
        type: 'handleTableAndChart',
        payload: {
          pathname,
          hash,
        },
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(() => {
        dispatch({
          type: 'init',
        });
        // /chart#id=6/8d5b63370c&id=6/8d5b63370c&data_type=score&x=3&y=4&legend=2&select=77/51bbce6074,77/51bbce6074,77/51bbce6074&selectkey=prod,prod2,prod3&cascade=1
      });
    },
  },
};
