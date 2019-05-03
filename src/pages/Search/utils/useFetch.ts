import React, { useState, useEffect } from 'react';
import * as dbCart from './db';
import * as dbReel from './reel';
import { AxiosError } from '@/utils/axios';
export interface DbJson {
  data?: any[];
  header?: string[];
  rows?: number;
  loading?: boolean;
  err?: AxiosError | boolean;
  [key: string]: any;
}
export function useFetch({
  params,
  api,
  init: [initState],
  type = 'cart',
  callback,
}: {
  params: any;
  api: string;
  init: any[];
  type?: string;
  callback?: Function;
}) {
  const [state, setState]: [DbJson, any] = useState({
    data: [],
    header: [],
    rows: 0,
    loading: true,
    err: false,
  });
  let db = type === 'cart' ? dbCart : dbReel;
  useEffect(() => {
    db[api](params)
      .then((res: DbJson) => {
        setState({ ...res, loading: false, err: false });
        if (callback) {
          callback(res);
        }
      })
      .catch((err: AxiosError) => {
        setState({ err, loading: false, rows: 0 });
      });
  }, [initState]);
  return state;
}
