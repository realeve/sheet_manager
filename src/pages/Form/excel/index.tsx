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

import TableSheet from '@/components/TableSheet';

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

  const [result, setResult] = useState([]);
  const [formdata, setFormdata] = useState([]);
  const save = () => {
    if (!hot) {
      return;
    }
    let data = hot.getData();
    setResult([]);
    setFormdata([]);

    var mock = () =>
      fetch('http://localhost:3030/api/finance/cost', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      })
        .then(res => res.json())
        .then(res => {
          setFormdata(res.data);
          setResult(res.table);
        });

    mock();
  };

  const upload = () => {
    console.log(formdata);
  };

  return (
    <Form
      data={data}
      state={state}
      setState={setState}
      dev={data?.dev}
      setFormstatus={setFormstatus}
    >
      <p>请在【A1】单元格粘贴数据，然后点击下方【解析数据】按钮.</p>
      <Sheet
        sheetHeight={data?.sheetHeight}
        onRender={setHot}
        maxrow={data?.maxrow}
        maxcol={data?.maxcol}
      />

      <Row style={{ marginTop: 15 }}>
        <Button disabled={!formstatus} type="primary" onClick={save}>
          解析数据
        </Button>
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

      {formdata.length > 0 && (
        <Row style={{ marginTop: 15 }}>
          <Button disabled={!formstatus} type="primary" onClick={upload}>
            数据上传
          </Button>
        </Row>
      )}
    </Form>
  );
};

export default connect()(Index);
