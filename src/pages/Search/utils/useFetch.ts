import React, { useState, useEffect } from 'react';
import * as db from '../db';
import * as R from 'ramda';
export interface DbJson {
  data: any[];
  header: string[];
  rows: number;
  loading: boolean;
  [key: string]: any;
}
export function useFetch({
  params,
  api,
  init,
  callback,
}: {
  params: any;
  api: string;
  init?: any[];
  callback?: Function;
}) {
  const [state, setState] = useState({ data: [], header: [], rows: 0, loading: true });
  let initState = R.isNil(init) ? [params] : init;
  useEffect(() => {
    db[api](params).then((res: DbJson) => {
      setState({ ...res, loading: false });
      if (callback) {
        callback(res);
      }
    });
  }, initState);
  return state;
}
