import React, { useState, useEffect } from 'react';
import { Col, Card, Tabs } from 'antd';
import SimpleTable from '../SimpleTable';
import VTable from '@/components/Table';
import { useFetch } from '@/pages/Search/utils/useFetch';
import * as R from 'ramda'

const TabPane = Tabs.TabPane;

export default function PackageInfo({ cart, prod, code }) {
  const { loading, ...state } = useFetch({ params: cart, api: 'getViewPrintOcr', init: [cart] });
  const { loading: loading2, ...ananyData } = useFetch({
    params: cart,
    api: 'getNoteaysdata',
    init: [cart],
  });

  const beforeFetch: (params: any) => boolean = params => !R.isNil(params.prod) && params.prod.length > 0 && !R.isNil(params.code) && params.code.length > 0
  const { loading: loading3, ...boxInfo } = useFetch({
    params: { code, prod },
    api: 'getViewCbpcBoxinfo',
    init: [code, prod],
    beforeFetch
  });

  const { loading: loading4, ...boxDetail } = useFetch({
    params: { code, prod },
    api: 'getViewCbpcPackage',
    init: [code, prod],
    beforeFetch
  });

  let [cpkParam, setCpkParam] = useState({});

  useEffect(() => {
    let codenum = R.pluck(2)(boxInfo.data);
    if (codenum.length === 0) { return; }
    let code = codenum[0].match(/[A-Z](|\*+)[A-Z]/g).join('');
    codenum = R.map(item => item.match(/\d+/g).join(''))(codenum);
    setCpkParam({ prod, code, codenum });
  }, [boxInfo.data[0]]);

  // 成品库记录
  const { loading: loading5, ...cpkDetail } = useFetch({
    params: cpkParam,
    api: 'getBXq',
    init: [cpkParam],
    beforeFetch: params => beforeFetch(params) && !R.isNil(params.codenum) && params.codenum.length > 0
  });

  const beforeRender = option =>
    option.map(item => {
      Reflect.deleteProperty(item, 'sorter');
      Reflect.deleteProperty(item, 'filters');
      Reflect.deleteProperty(item, 'filteredValue');
      return item;
    });

  const { loading: loading0, ...changeLog } = useFetch({ params: cart, api: 'getVCbpcCfturnguard', init: [cart] });

  return (
    <Col span={24}>
      <Card
        hoverable
        bodyStyle={{
          padding: '10px 20px',
        }}
        style={{ marginBottom: 10 }}
      >
        <Tabs defaultActiveKey="0">
          <TabPane tab="清分机兑换记录" key="0">
            <SimpleTable data={changeLog} loading={loading0} />
          </TabPane>

          <TabPane tab="OCR汇总" key="1">
            <SimpleTable data={state} loading={loading} />
          </TabPane>
          <TabPane tab="特抽信息" key="2">
            <VTable
              dataSrc={ananyData}
              loading={loading2}
              beforeRender={beforeRender}
              simple={true}
              pagesize={5}
            />
          </TabPane>
          <TabPane tab="装箱记录" key="3" >
            <VTable
              dataSrc={boxInfo}
              loading={loading3}
              beforeRender={beforeRender}
              simple={true}
              pagesize={5}
            />
          </TabPane>
          <TabPane tab="装箱首张号原始信息" key="4" >
            <VTable
              dataSrc={boxDetail}
              loading={loading4}
              beforeRender={beforeRender}
              simple={true}
              pagesize={5}
            />
          </TabPane>
          <TabPane tab="成品库出入记录" key="5" >
            <VTable
              dataSrc={cpkDetail}
              loading={loading5}
              beforeRender={beforeRender}
              simple={true}
              pagesize={5}
            />
          </TabPane>
        </Tabs>
      </Card>
    </Col>
  );
}
