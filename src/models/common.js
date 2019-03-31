import pathToRegexp from 'path-to-regexp';
import userTool from '@/utils/users';
import { setStore, handleUrlParams } from '@/utils/lib';
import qs from 'qs';

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
    // showDateRange: true,
    curPageName: '',
    dateRange: [],
    tid: [],
    query: {},
  },
  reducers: {
    setStore,
    clearQuery(state) {
      return {
        ...state,
        query: {},
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async ({ pathname, hash }) => {
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
              if (params[key].includes(',')) {
                params[key] = params[key].split(',');
              } else if (params[key].includes(';')) {
                params[key] = params[key].split(';');
              }
            }
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
