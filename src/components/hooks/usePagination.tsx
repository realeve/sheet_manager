import { useEffect } from 'react';
import { useSetState } from 'react-use';

interface IPageCfg {
  total: number;
  current: number;
  pageSize: number;
}

export interface IUsePagination extends IPageCfg {
  data: any[] | null;
  pageData: any[] | null;
  url?: string;
  [key: string]: any;
}

/**
 * @param data 待分页数据
 * @param curret 当前页码
 * @param total 总共多少条数据
 * @param pageSize 页码大小
 * */
const usePagination: <T>(props: IUsePagination) => [IUsePagination, ({}) => void] = ({
  data,
  current = 1,
  total = 1,
  pageSize = 5,
}) => {
  const [page, setPage] = useSetState<IUsePagination>({
    total,
    current,
    pageSize,
    pageData: [],
    data,
  });

  useEffect(() => {
    if (data === null) {
      setPage({ total: 1, pageData: null });
      return;
    }

    setPage({
      total: data.length,
      pageData: data.slice((page.current - 1) * page.pageSize, page.current * page.pageSize),
    });
  }, [data, page.current, page.pageSize]);

  return [page, setPage];
};

export default usePagination;
