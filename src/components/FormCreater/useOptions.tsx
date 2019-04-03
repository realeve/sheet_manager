import { useState, useEffect } from 'react';
import { axios } from '@/utils/axios';
import * as R from 'ramda';
import { handleOptions } from './lib';

export function useOptions({ url, defaultOption }) {
  const [options, setOptions] = useState({ options: [], loading: true });
  useEffect(() => {
    if (defaultOption) {
      let data = handleOptions(defaultOption);
      setOptions({ options: data, loading: false });
      return;
    }

    if (R.isNil(url)) {
      return;
    }

    axios({ url }).then(({ data }) => {
      data = handleOptions(data);
      setOptions({ options: data, loading: false });
    });
  }, [url, defaultOption]);
  return options;
}
