import pathToRegexp from 'path-to-regexp';
import userTool from '@/utils/users';
import * as lib from '@/utils/lib';

const namespace = 'common';
export default {
  namespace,
  state: {
    userSetting: {
      uid: '',
      avatar: '',
      menu: '',
      previewMenu: [],
      username: '',
      fullname: '',
      user_type: 0,
      actived: 0,
      dept_name: ''
    },
    isLogin: false,
    curPageName: ''
  },
  reducers: {
    setStore(state, { payload }) {
      return lib.setStore({
        state,
        payload
      });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async ({ pathname, query }) => {
        const match = pathToRegexp('/login').exec(pathname);
        if (match && match[0] === '/login') {
          dispatch({
            type: 'setStore',
            payload: {
              isLogin: false
            }
          });
          userTool.saveLoginStatus(0);
          return;
        }
        let isLogin = userTool.getLoginStatus(0);
        userTool.saveLastRouter(pathname);
        dispatch({
          type: 'setStore',
          payload: {
            isLogin: isLogin === '1'
          }
        });
      });
    }
  }
};
