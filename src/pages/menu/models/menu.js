import pathToRegexp from 'path-to-regexp';
import { setStore } from '@/utils/lib';

const namespace = 'menu';
export default {
  namespace,
  state: {
    treeDataLeft: [],
    treeDataRight: []
  },
  reducers: {
    setStore
  },
  subscriptions: {
    setup({ _, history }) {
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/' + namespace).exec(pathname);
        if (!match) {
          return;
        }
      });
    }
  }
};
