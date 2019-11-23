import { useState, useEffect } from 'react';
import { mock, axios, AxiosError } from '@/utils/axios';
import http, { AxiosRequestConfig } from 'axios';
import * as R from 'ramda';

/**
 *
 * @param axios所返回数据的自动解析，在返回数据只有单个对象时使用
 * @example: callback({[key:string]:value}) === value
 * @return value 此处无论key为何值，
 */
export const callback = <T extends {}>(data: { [key: string]: any }): T => Object.values(data)[0];

const { CancelToken } = http;

export interface IFetchProps<T> {
  param?: AxiosRequestConfig | null;
  initData?: T;
  valid?: (e?: any) => boolean;
  callback?: (data: any) => T;
  [key: string]: any;
}
/**
 * React hooks，数据获取
 * @param param axios请求的参数
 * @param initData 模拟数据请求时传入的初始数据，如果传入了数据则优先使用模拟数据，否则使用param的接口参数发起请求
 * @param callback 对数据的回调处理
 * @param valid 数据发起前有效性校验,返回true时正常发起请求调用，为False中断调用
 * 
 * @return data 接口返回的数据
   @return loading 数据载入状态
   @return error 抛错
   @return setData 函数，手工设置data的数据值，如初始化的值
   @return reFetch 函数，手工强制刷新，由于是监听param的值(url,data,params)，在它们不变更的时候也应有刷新的机制
 */
const useFetch = <T extends {} | void>({
  param,
  initData,
  callback = e => e,
  valid = (e?: any) => true,
}: IFetchProps<T>): {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
  setData: (data: T) => void;
  reFetch: () => void;
} => {
  // 同时未传时，返回空值
  // 部分场景允许不设置param时，返回默认状态为空的数据
  // 如，多个tab条的切换点击
  if (R.isNil(param) || (!param && !initData)) {
    return { data: null, loading: true, error: null, setData: () => {}, reFetch: () => {} };
  }

  // 初始化数据
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  // 用于强制刷新
  const [innerTrigger, setInnerTrigger] = useState(0);

  // 首次加载
  useEffect(() => {
    // if (!R.isNil(initData) && R.equals(data, initData)) {
    //   return;
    // }

    // 加载时，data置为空
    setData(null);

    // 数据请求前校验
    if (typeof param.url === 'undefined' || !param.url || param.url.length === 0 || !valid()) {
      return;
    }

    setLoading(true);

    // 数据mock
    if (initData) {
      mock<T>(initData).then(v => {
        // 如果为空就不再进行设置
        // if (v.length === 0) {
        //   return;
        // }
        setData(v);
        setLoading(false);
      });
      return;
    }

    const source = CancelToken.source();

    param.cancelToken = source.token;

    // 从后端发起请求
    axios(param as AxiosRequestConfig)
      .then((data: any) => {
        if (callback) {
          setData(callback(data));
        } else {
          setData(data);
        }
        setLoading(false);
      })
      .catch((e: any) => {
        setError(e);
        setLoading(false);
        throw e;
      });

    // 路由变更时，取消axios
    return () => {
      source.cancel();
    };
    // 监听axios数据请求中 url、get/post关键参数
  }, [param.url, JSON.stringify(param.params), JSON.stringify(param.data), initData, innerTrigger]);

  return {
    data,
    loading,
    error,
    setData,
    reFetch: () => {
      // 数据刷新的场景中，重置innerTrigger，在useFetch中会
      setInnerTrigger(+new Date());
    },
  };
};

export default useFetch;
