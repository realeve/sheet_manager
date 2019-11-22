import { useState, useEffect } from 'react';
import { axios } from '@/utils/axios';
import * as R from 'ramda';
import { handleOptions } from './lib';

export function useOptions({ url, defaultOption, params, textVal, cascade }) {
  const [options, setOptions] = useState({ options: [], loading: true });
  useEffect(() => {
    if (cascade && !params[cascade]) {
      return;
    }

    if (defaultOption) {
      let data = handleOptions(defaultOption, textVal);
      setOptions({ options: data, loading: false });
      return;
    }

    if (R.isNil(url)) {
      return;
    }

    axios({ url, params }).then(({ data }) => {
      data = handleOptions(data, textVal);
      setOptions({ options: data, loading: false });
    });
  }, [url, defaultOption, params, cascade]);
  return options;
}
