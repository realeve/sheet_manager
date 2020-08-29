import React, { useState, useEffect } from 'react';
import FormItem from '@/components/FormCreater/FormItem';
import { useSetState } from 'react-use';
import * as R from 'ramda';
import { Card, Row, Button } from 'antd';
import Sheet from './tablesheet';
import { IFormConfig } from '@/components/FormCreater';

import qs from 'qs';
import useFetch from '@/components/hooks/useFetch';
import * as lib from '@/utils/lib';
import { connect } from 'dva';
import { handleDetail } from '../index';

interface ISheetForm extends IFormConfig {
  maxrow?: number; // 用表格录入数据时最大数据行数;
  maxcol?: number; // 最大数据列
  sheetHeight?: number; // sheet高度
}
const callback = res => {
  if (!res) {
    return null;
  }
  res.detail = res.detail.map(handleDetail);
  return res;
};

export const Form = ({ data: json, children, state, setState, dev, setFormstatus }) => { 
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
              setFormstatus={setFormstatus}
              formLayout="horizontal"
            />
          ))}
        </Row>
      )}
      {children}
    </Card>
  );
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
  // 表单字段当前状态判断
  const [formstatus, setFormstatus] = useState(false);

  const { data } = useFetch<ISheetForm>({
    param: { url },
    valid: () => url.length > 0,
    callback: res => {
      if (!res?.detail || res?.detail.length === 0) {
        setFormstatus(true);
        return res;
      }
      return callback(res);
    },
  });

  const [hot, setHot] = useState(null);

  const save = () => {
    if (!hot) {
      return;
    }
    let res = hot.getData();
    console.log(res);
  };

  return (
    <Form
      data={data}
      state={state}
      setState={setState}
      dev={data?.dev}
      setFormstatus={setFormstatus}
    >
      <Sheet
        sheetHeight={data?.sheetHeight}
        onRender={setHot}
        maxrow={data?.maxrow}
        maxcol={data?.maxcol}
      />
      <Row style={{ marginTop: 15 }}>
        <Button disabled={!formstatus} type="default" onClick={save}>
          提交
        </Button>
      </Row>
    </Form>
  );
};

export default connect()(Index);
