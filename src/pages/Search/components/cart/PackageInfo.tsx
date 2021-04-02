import React, { useState, useEffect } from 'react';
import { Col, Card, Tabs } from 'antd';
import VTable from '@/components/Table';
import { useFetch } from '@/pages/Search/utils/useFetch';
import * as R from 'ramda';
import { getType } from '@/utils/lib';

const TabPane = Tabs.TabPane;

export default function PackageInfo({ prod, code }) {
  const beforeFetch: (params: any) => boolean = params =>
    !R.isNil(params.prod) &&
    params.prod.length > 0 &&
    !R.isNil(params.code) &&
    params.code.length > 0;
  const { loading: loading3, ...boxInfo } = useFetch({
    params: { code, prod },
    api: 'getViewCbpcBoxinfo',
    init: [code, prod],
    beforeFetch,
  });

  const { loading: loading4, ...boxDetail } = useFetch({
    params: { code, prod },
    api: 'getViewCbpcPackage',
    init: [code, prod],
    beforeFetch,
  });

  let [cpkParam, setCpkParam] = useState({});

  useEffect(() => {
    if (!boxInfo.data?.length) {
      return;
    }
    let codenum = R.pluck('col0')(boxInfo.data);
    if (codenum.length === 0 || R.isNil(codenum[0])) {
      return;
    }
    let code = codenum[0].match(/[A-Z](|\*+)[A-Z]/g).join('');
    codenum = R.map(item => item.match(/\d+/g).join(''))(codenum);
    setCpkParam({ prod, code, codenum });
  }, [boxInfo?.data?.[0]]);

  // 成品库记录
  const { loading: loading5, ...cpkDetail } = useFetch({
    params: cpkParam,
    api: 'getBXq',
    init: [cpkParam],
    beforeFetch: params =>
      beforeFetch(params) && !R.isNil(params.codenum) && params.codenum.length > 0,
  });

  // 20206T2   500001箱号 1900E366A 拍号
  const beforeRender = option =>
    getType(option) === 'object'
      ? option
      : option.map(item => {
          Reflect.deleteProperty(item, 'sorter');
          Reflect.deleteProperty(item, 'filters');
          Reflect.deleteProperty(item, 'filteredValue');
          return item;
        });

  return (
    <Col span={24}>
      <Card
        hoverable
        bodyStyle={{
          padding: '10px 20px',
        }}
        style={{ marginBottom: 10 }}
      >
        <Tabs defaultActiveKey="0" animated={false}>
          <TabPane tab="装箱记录" key="0">
            <VTable
              isAntd
              dataSrc={boxInfo}
              loading={loading3}
              beforeRender={beforeRender}
              simple={true}
              pagesize={5}
            />
          </TabPane>
          <TabPane tab="装箱首张号原始信息" key="1">
            <VTable
              dataSrc={boxDetail}
              loading={loading4}
              beforeRender={beforeRender}
              simple={true}
              pagesize={5}
            />
          </TabPane>
          <TabPane tab="成品库出入记录" key="2">
            <VTable
              isAntd
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
