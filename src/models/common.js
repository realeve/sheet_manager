import pathToRegexp from 'path-to-regexp';
import userTool from '@/utils/users';
import { setStore } from '@/utils/lib';
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
  },
  reducers: {
    setStore,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async ({ pathname, query, hash }) => {
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
