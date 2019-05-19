import pathToRegexp from 'path-to-regexp';
import userTool from '@/utils/users';
import { setStore, handleUrlParams, str2Arr } from '@/utils/lib';
import { axios } from '@/utils/axios';
import qs from 'qs';
import * as R from 'ramda';
import { handleOptions } from '@/components/FormCreater/lib';

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

const namespace = 'common';
export default {
  namespace,
  state: {
    userSetting: {
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
    },
    isLogin: false,
    curPageName: '',
    dateRange: [],
    tid: [],
    query: {},
    selectList: [],
    selectValue: {},
    textAreaList: [],
    textAreaValue: {},
    spinning: false,
  },
  reducers: {
    setStore,
    clearQuery(state) {
      return {
        ...state,
        query: {},
        selectList: [],
        selectValue: {},
        textAreaList: [],
        textAreaValue: {},
      };
    },
  },
  effects: {
    // 条件选择项更新查询参数
    *refreshSelector(
      {
        payload: { idx, data },
      },
      { put, select, call }
    ) {
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
      yield put({
        type: 'setStore',
        payload: {
          selectList,
          selectValue: {},
        },
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async ({ pathname, hash }) => {
        dispatch({
          type: 'setStore',
          payload: {
            spinning: false,
          },
        });

        if (['/chart', '/chart/', '/table', '/table/'].includes(pathname)) {
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
          dispatch({
            type: 'setStore',
            payload: {
              dateType: [dateType, dateType],
              dateFormat,
            },
          });
        }

        // 处理查询参数
        dispatch({
          type: 'clearQuery',
        });

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
          dispatch({
            type: 'setStore',
            payload: {
              textAreaList: params.textarea.map((title, idx) => ({
                title,
                key: params.textareakey[idx],
              })),
            },
          });
        }

        // /chart#id=6/8d5b63370c&id=6/8d5b63370c&data_type=score&x=3&y=4&legend=2&select=77/51bbce6074,77/51bbce6074,77/51bbce6074&selectkey=prod,prod2,prod3&cascade=1
        dispatch({
          type: 'setStore',
          payload: {
            dateRange,
            tid: id,
            query: params,
          },
        });

        dispatch({
          type: 'initSelector',
        });

        const match = pathToRegexp('/login').exec(pathname);
        if (match && match[0] === '/login') {
          dispatch({
            type: 'setStore',
            payload: {
              isLogin: false,
            },
          });
          userTool.saveLoginStatus(0);
          return;
        }

        let isLogin = userTool.getLoginStatus(0);
        userTool.saveLastRouter(pathname);
        dispatch({
          type: 'setStore',
          payload: {
            isLogin: isLogin === '1',
          },
        });
      });
    },
  },
};
