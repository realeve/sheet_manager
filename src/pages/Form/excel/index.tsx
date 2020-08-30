import React, { useState, useEffect } from 'react';
import FormItem from '@/components/FormCreater/FormItem';
import { useSetState } from 'react-use';
import { Card, Row, Button, notification } from 'antd';
import Sheet from './tablesheet';
import { IFormConfig } from '@/components/FormCreater';

import qs from 'qs';
import useFetch from '@/components/hooks/useFetch';
import * as lib from '@/utils/lib';
import { connect } from 'dva';
import { handleDetail } from '../index';
import moment from 'moment';

import TableSheet from '@/components/TableSheet';
import { axios } from '@/utils/axios';

interface ICallbackData {
  data: string[][]; // 前台插入的数据
  table: { title: string; header: string[]; data: [][]; rows: number; hash: string }[]; //解析结果
  title: string; // 业务标题
  affected_rows: number; //写入数据量
}
const post = ({ url, data, extra }) =>
  fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data, extra }),
  }).then(res => res.json());

interface ISheetForm extends IFormConfig {
  maxrow?: number; // 用表格录入数据时最大数据行数;
  maxcol?: number; // 最大数据列
  sheetHeight?: number; // sheet高度
  callback: string; // 数据回调
}

const callback = res => {
  if (!res) {
    return null;
  }
  res.detail = res.detail.map(handleDetail);
  return res;
};

export const Form = ({ data: json, children, state, setState, dev }) => {
  return (
    <Card title={json?.name}>
      {json?.detail && (
        <Row gutter={15}>
          {json.detail.map(({ key, cascade, ...detail }, idx) => (
            <FormItem
              key={key + idx}
              keyName={key}
              state={state[key]}
              cascade={[cascade, state[cascade]]}
              dev={dev}
              setState={async res => {
                if (lib.getType(res) === 'object') {
                  setState(res);
                  return;
                }
                setState({
                  [key]: res,
                });
              }}
              detail={detail}
              formLayout="horizontal"
            />
          ))}
        </Row>
      )}
      {children}
    </Card>
  );
};

const handleSubmit = async ({ params, url, idx }) => {
  let [id, nonce] = url.match(/(\d+)\/(\w+)/g)[0].split('/');
  let {
    data: [{ affected_rows }],
  } = await axios({
    method: 'post',
    data: {
      ...params,
      id,
      nonce,
    },
  }).catch(e => {
    return { data: [{ affected_rows: 0 }] };
  });

  notification.success({
    message: '系统提示',
    description: `第${idx + 1}组数据提交${affected_rows > 0 ? '成功' : '失败'}`,
  });
  return affected_rows > 0 ? 1 : 0;
};
// http://localhost:8000/form/excel?hidemenu=1&id=./data/finance/print_cost.json
const Index = ({ location }) => {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    let res: { id?: string } = qs.parse(window.location.hash.slice(1));
    setUrl(res.id || '');
  }, [location.hash]);

  // 增加对总分的计算，与scope字段一并处理
  let [state, setState] = useSetState<{
    [key: string]: any;
  }>({});

  // 是否需要写入数据
  const [needinsert, setNeedinsert] = useState(true);

  const { data: option } = useFetch<ISheetForm>({
    param: { url },
    valid: () => url.length > 0,
    callback: e => {
      let isUnmounted = false;
      let res = callback(e);
      res.detail.forEach(item => {
        if (item.type === 'datepicker') {
          if (!isUnmounted) {
            setState({ [item.key]: moment().format(item.datetype || 'YYYY-MM-DD') });
          }
        } else if (item.type === 'datepicker.month') {
          if (!isUnmounted) {
            setState({ [item.key]: moment().format(item.datetype || 'YYYY-MM') });
          }
        } else if (item.type === 'datepicker.year') {
          if (!isUnmounted) {
            setState({ [item.key]: moment().format(item.datetype || 'YYYY') });
          }
        }
      });
      isUnmounted = true;
      return res;
    },
  });

  const [hot, setHot] = useState(null);

  const [result, setResult] = useState([]);
  const [formdata, setFormdata] = useState([]);
  const save = () => {
    if (!hot) {
      return;
    }
    let data = hot.getData();
    decode(data);
  };

  const decode = (src: string[][]) => {
    setResult([]);
    setFormdata([]);
    post({ url: option.callback, data: src, extra: state }).then((res: ICallbackData) => {
      setFormdata(res.data || []);
      setResult(res.table || []);

      // 需要前端处理数据提交
      if (typeof res.affected_rows == 'undefined') {
        setNeedinsert(true);
        return;
      }

      // 服务端处理数据提交
      notification.success({
        message: '系统提示',
        description: `服务端数据提交${res.affected_rows > 0 ? '成功' : '失败'}`,
      });
      setNeedinsert(false);
      clearData();
    });
  };

  const upload = async () => {
    if (!needinsert) {
      return;
    }
    if (!option?.api?.insert) {
      console.error({
        message: '系统提示',
        description: '未配置数据提交接口',
        option,
      });
      return;
    }
    let form = formdata.map(row => row.map(item => ({ ...item, ...state })));
    // 调用上传
    let res = 0;
    for (let idx = 0; idx < form.length; idx++) {
      res += await handleSubmit({
        params: { values: form[idx] },
        url: option.api.insert[idx],
        idx,
      });
    }
    if (res == form.length) {
      clearData();
      return;
    }
    console.error('数据提交出现错误', form, res);
  };

  const clearData = () => {
    hot.clear();
    hot.selectCell(0, 0);
    setFormdata([]);
    setNeedinsert(true);
  };

  return (
    <Form data={option} state={state} setState={setState} dev={option?.dev}>
      <p>请在【A1】单元格粘贴数据，然后点击下方【解析数据】按钮.</p>
      <Sheet
        sheetHeight={option?.sheetHeight}
        onRender={setHot}
        maxrow={option?.maxrow}
        maxcol={option?.maxcol}
        onPaste={decode}
      />

      <Row style={{ marginTop: 15 }}>
        <Button type="default" onClick={save}>
          手工解析数据
        </Button>
        {needinsert && (
          <Button
            style={{ marginLeft: 15 }}
            disabled={formdata.length === 0}
            type="primary"
            onClick={upload}
          >
            数据上传
          </Button>
        )}
      </Row>

      <Row style={{ marginTop: 15 }}>
        {result.map(item => (
          <div key={item.hash} style={{ marginTop: 20, width: '100%' }}>
            <h3 style={{ fontWeight: 'bold', textAlign: 'center' }}>
              数据解析结果 —— {item.title}
            </h3>
            <TableSheet
              style={{ width: '100%' }}
              data={item}
              sheetHeight={Math.min(Math.max(item.rows + 1, 5) * 25, 400)}
            />
          </div>
        ))}
      </Row>
    </Form>
  );
};

export default connect()(Index);
