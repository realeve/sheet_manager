import pathToRegexp from 'path-to-regexp';
import { setStore, isReel, isCart } from '@/utils/lib';
import { dispatch } from 'rxjs/internal/observable/range';

const namespace = 'search';
export default {
  namespace,
  state: {
    cartnumber: '',
    reelnumber: '',
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
        if (isReel(number)) {
          dispatch({
            type: 'setStore',
            payload: {
              reelnumber: number,
              type: 'reel',
            },
          });
        } else if (isCart(number)) {
          dispatch({
            type: 'setStore',
            payload: {
              cartnumber: number,
              type: 'cart',
            },
          });
        } else {
          dispatch({
            type: 'setStore',
            payload: { invalid: 'unknown' },
          });
        }
      });
    },
  },
};
