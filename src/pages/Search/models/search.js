import pathToRegexp from 'path-to-regexp';
import { setStore, isReel, isCart } from '@/utils/lib';
import { createArrayTypeNode } from 'typescript';

const namespace = 'search';
export default {
  namespace,
  state: {
    cart: '',
    reel: '',
    type: 'unknown',
  },
  reducers: {
    setStore,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, hash }) => {
        const match = pathToRegexp('/' + namespace).exec(pathname);
        if (!match) {
          return;
        }
        let number = hash.slice(1);
        let key;
        if (isReel(number)) {
          key = 'reel';
        } else if (isCart(number)) {
          key = 'cart';
        } else {
          key = 'unknown';
        }

        dispatch({
          type: 'setStore',
          payload: {
            [key]: number,
            type: key,
          },
        });
      });
    },
  },
};
