import { useSetState } from 'react-use';
import useFetch from './useFetch';
import { AxiosRequestConfig } from 'axios';

interface IPageCfg {
  current: number;
  pageSize: number;
}

export interface IUsePagination extends IPageCfg {
  param: AxiosRequestConfig;
  callback?: (e: any) => {};
  [key: string]: any;
}

/**
 * @param current 当前页码
 * @param pageSize 页码大小
 * */
const useFetchPagination = ({
  param,
  current = 1,
  pageSize = 10,
  callback = e => e,
}: IUsePagination) => {
  const [page, setPage] = useSetState({
    total: 1,
    current,
    pageSize,
  });

  let { data, loading, error, reFetch } = useFetch({
    param: {
      // param中可能未 post 请求，需要把参数解构，同时post请求需要把分页信息放到 data
      url: param.url,
      method: param.method || 'get',
      params: {
        page: page.current,
        pageSize: page.pageSize,
        ...param.params,
      },
      data: {
        page: page.current,
        pageSize: page.pageSize,
        ...param.data,
      },
    },
    callback: data => {
      let { pageEntity, ...rest } = data;
      setPage({
        total: pageEntity.totalPage * page.pageSize,
      });
      // return callback(Object.values(rest)[0]);

      return callback(rest);
    },
  });

  return { data, loading, error, page, setPage, reFetch };
};

export default useFetchPagination;
