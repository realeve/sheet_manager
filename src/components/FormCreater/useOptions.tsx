import { useState, useEffect } from 'react';
import { axios } from '@/utils/axios';
import * as R from 'ramda';

export const handleOptions = data =>
  data.map(item => {
    if (item.name) {
      return { ...item, label: item.name };
    } else {
      return {
        label: item.value,
        name: item.value,
        value: item.id,
      };
    }
  });

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
