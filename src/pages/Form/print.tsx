import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { ICommon } from '@/models/common';
import styles from './print.less';
import * as lib from '@/utils/lib';
import { useLocation, useSetState } from 'react-use';
import qs from 'qs';
import { handleParams } from '@/pages/table/services/table';
import { axios } from '@/utils/axios';
import SimpleList from '@/pages/Search/components/SimpleList';
import SimpleTable from '@/pages/Search/components/SimpleTable';
import * as R from 'ramda';
import utils from '@/pages/chart/utils/lib';
import { Button } from 'antd';

// 处理为AXIOS请求所需的参数列表
const handleParam = (hash, uid, tabletype) => {
  let res = qs.parse(hash.slice(1));
  let param = { tstart: lib.ymd(), uid: uid, tend: lib.ymd(), ...res };
  let params = lib.handleUrlParams(hash);
  let arr = handleParams(params);
  return arr.map((item, idx) => {
    let { id, ...append } = param;
    item.params = {
      ...item.params,
      ...append,
      mode: tabletype[idx] === 'list' ? 'json' : 'array',
      cache: 0,
    };
    return item;
  });
};

const handleTableType = hash => {
  let res = qs.parse(hash.slice(1));
  let tabletype = res.tabletype || 'list';
  if (typeof res.id == 'string') {
    res.id = [res.id];
  }
  if (typeof tabletype == 'string') {
    tabletype = [tabletype];
  }
  tabletype = res.id.map((_, id) => {
    return tabletype[id] || R.last(tabletype);
  });
  return tabletype;
};

const removeEmptyData = res => {
  let dist = { ...res, header: [] };
  let counter = 0;
  res.header.forEach((header, key) => {
    let arr = utils.getUniqByIdx({ key, data: res.data });

    // 是否该列为空值?
    let isEmpty = !arr.some(item => !['0', '', 0].includes(item));

    // 非空，写入header值
    if (!isEmpty) {
      dist.header.push(header);
    } else {
      dist.data = dist.data.map(item => {
        return R.remove(key - counter, 1, item);
      });
      counter++;
    }
  });
  return dist;
};

const Index = ({ user }) => {
  const { hash } = useLocation();
  const [state, setState] = useSetState({});
  const [tabletype, setTabletype] = useState(['list']);
  useEffect(() => {
    if (!user.uid) {
      setState({});
      return;
    }
    let tabletype = handleTableType(hash);
    setTabletype(tabletype);

    let param = handleParam(hash, user.uid, tabletype);

    param.forEach((data, idx) => {
      axios(data).then(res => {
        setState({
          [idx]: tabletype[idx] !== 'list' ? removeEmptyData(res) : res,
        });
      });
    });
  }, [hash, user.uid]);

  const printIt = () => {
    window.print();
  };

  return (
    <div className={styles.print}>
      {Object.values(state).map((item, i) => {
        let TableItem = tabletype[i] === 'list' ? SimpleList : SimpleTable;
        let props = { data: item, span: 6 };
        if (tabletype[i] === 'list') {
          props = {
            ...props,
            removeEmpty: true,
            removeZero: true,
          };
        }
        return (
          <div key={i}>
            <div className={styles.title}>
              {Object.values(state).length > 1 ? `${i + 1}.` : ''}
              {item.title}
            </div>
            <TableItem {...props} />
          </div>
        );
      })}
      <div className={styles.action}>
        <Button onClick={printIt} type="primary">
          打印
        </Button>
      </div>
    </div>
  );
};

export default connect((state: { common: ICommon }) => ({ user: state.common.userSetting }))(Index);
