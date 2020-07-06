import { useState, useEffect } from 'react';
import { axios } from '@/utils/axios';
import * as R from 'ramda';
import { handleOptions } from './lib';
import http from 'axios';
const { CancelToken } = http;

export function useOptions({ url, defaultOption, params, textVal, cascade = '' }) {
  const [options, setOptions] = useState({ options: [], loading: true });

  const callback = (data, textVal) => {
    let res = !data ? [] : handleOptions(data, textVal);
    setOptions({ options: res, loading: false });
  };

  useEffect(() => {
    let mounted = false;
    if (cascade.length > 0 && !params[cascade]) {
      return;
    }
    if (defaultOption) {
      callback(defaultOption, textVal);
      return;
    }

    if (R.isNil(url)) {
      return;
    }

    const source = CancelToken.source();

    axios({ url, params, cancelToken: source.token })
      .then(res => {
        if (!res) {
          return;
        }
        let { data } = res;
        !mounted && callback(data, textVal);
      })
      .catch(e => {
        console.error(e);
        return e;
      });

    // 路由变更时，取消axios
    return () => {
      source.cancel();
      mounted = true;
    };
  }, [url, JSON.stringify(defaultOption), cascade, JSON.stringify(params)]);

  return options;
}
