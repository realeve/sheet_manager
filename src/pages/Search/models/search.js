import pathToRegexp from 'path-to-regexp';
import { setStore, isReel, isCart, isGZ } from '@/utils/lib';

export const getProdType = number => {
  let key;
  if (isReel(number)) {
    key = 'reel';
  } else if (isCart(number)) {
    key = 'cart';
  } else if (isGz(number)) {
    key = 'gz';
  } else {
    key = 'unknown';
  }
  return key;
};

const namespace = 'search';
export default {
  namespace,
  state: {
    cart: '',
    prod: null,
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
        let key = getProdType(number);

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
