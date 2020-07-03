import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Card, List, Tabs } from 'antd';
import useFetch from '@/components/hooks/useFetch';
import { ListItemFull } from '@/pages/Search/components/SimpleList';
import * as R from 'ramda';
import * as lib from '@/utils/lib';

import { Skeleton, Empty } from 'antd';

const { TabPane } = Tabs;

let data = {
  data: [
    {
      机台: 'J98-3号',
      班次: '白班',
      工序: '胶印',
      机长: '杨略',
      产量: '8000',
      作业记录:
        '1、上班开班前会，会后做设备卫生保养，检查合格后等1号机试验MES系统。2、接班长通知放墨跑色生产，生产正常。3、到点清场，无过版纸、产品纸遗留后交班。',
    },
    {
      机台: 'J98-3号',
      班次: '白班',
      工序: '胶印',
      机长: '陈兵',
      产量: '2000',
      作业记录: '调整拉规盖板。到点下班。',
    },
    {
      机台: '丝凸印-1号',
      班次: '白班',
      工序: '丝印',
      机长: '付锐',
      产量: '10000',
      作业记录: '1.首检正常。2.已清场，现场无遗留过版纸及产品，无安全事故隐患。',
    },
    {
      机台: '接线凹-3号',
      班次: '中班',
      工序: '凹一印',
      机长: '佘涛',
      产量: '10000',
      作业记录: '正常印刷结束换辊子，换压印3块，清场未发现产品样张过版纸。',
    },
    {
      机台: '接线凹-5号',
      班次: '中班',
      工序: '凹二印',
      机长: '蔡勇',
      产量: '10000',
      作业记录:
        '1、印刷中途电源跳闸，重启擦干版后机器不能升速，配合电工检修恢复耗时100分钟；2、印刷中途换万过程中，在线监测总是掉线无法连接数据库，联系在线人员解决后印刷；3、已清场，机台无样张、产品、过版纸遗留。',
    },
    {
      机台: 'M97-3号',
      班次: '中班',
      工序: '印码',
      机长: '王洪',
      产量: '10000',
      作业记录: '1.开印正常，留存号5000.2、已清场，现场无遗留过版纸及产品，无安全事故隐患。',
    },
    {
      机台: 'DMJ12-1号',
      班次: '中班',
      工序: '印码',
      机长: '王洪',
      产量: '10000',
      作业记录: '1.开印正常，留存号5000.2、已清场，现场无遗留过版纸及产品，无安全事故隐患。',
    },
    {
      机台: 'DMJ12-2号',
      班次: '白班',
      工序: '印码',
      机长: '王洪',
      产量: '10000',
      作业记录: '1.开印正常，留存号5000.2、已清场，现场无遗留过版纸及产品，无安全事故隐患。',
    },
    {
      机台: '多功能-2号',
      班次: '白班',
      工序: '印码',
      机长: '王洪',
      产量: '10000',
      作业记录:
        '1.开印正常，留存号5000.2、已清场，现场无遗留过版纸及产品，无安全事故隐患。1.开印正常，留存号5000.2、已清场，现场无遗留过版纸及产品，无安全事故隐患。1.开印正常，留存号5000.2、已清场，现场无遗留过版纸及产品，无安全事故隐患。1.开印正常，留存号5000.2、已清场，现场无遗留过版纸及产品，无安全事故隐患。',
    },
    {
      机台: '裁封-9号',
      班次: '白班',
      工序: '裁封',
      机长: '查勇智',
      产量: '350',
      作业记录: '正常',
    },
    {
      机台: '清分机-4号',
      班次: '中班',
      工序: '抽查',
      机长: '钟祖志',
      产量: '350',
      作业记录: '正常',
    },
  ],
  rows: 8,
  ip: '10.8.18.243',
  header: ['机台', '班次', '工序', '机长', '产量', '作业记录'],
  title: '机台生产作业记录',
  source: '数据来源：MES系统_生产环境',
  hash: '234234',
  dates: ['20190801', '20190805'],
};

const groupData = (data, param) => {
  if (lib.isInt(param)) {
    param = R.nth(param, data.header);
  }
  return R.groupBy(R.prop(param))(data.data);
};

const CardListItem = ({ data, loading = false }) => (
  <div className={styles.cardList}>
    <List
      rowKey="id"
      loading={loading}
      grid={{ gutter: 12, lg: 3, md: 2, sm: 1, xs: 1 }}
      dataSource={(data && data.data) || []}
      renderItem={(item, idx) => {
        return (
          <List.Item key={idx}>
            <Card hoverable className={styles.card}>
              <ListItemFull header={data.header} data={item} span={24} />
            </Card>
          </List.Item>
        );
      }}
    />
  </div>
);

const handleData = (data, group) => {
  let res = groupData(data, group);
  return Object.keys(res).map(key => {
    let item = res[key];
    return {
      ...data,
      data: item,
      rows: item.length,
      tabTitle: key,
    };
  });
};

const GroupCardList = ({ data, group }) => (
  <Tabs defaultActiveKey="1" type="line">
    {handleData(data, group).map(item => (
      <TabPane tab={item.tabTitle} key={item.tabTitle}>
        <CardListItem data={item} />
      </TabPane>
    ))}
  </Tabs>
);

export default ({ group = 2 }) => {
  const { data: list, loading } = useFetch({
    initData: data,
    param: {
      url: '9999/updatekeiid',
    },
  });
  // 载入数据
  if (loading || R.isNil(list) || R.isNil(list.data)) {
    return <Skeleton active />;
  }

  return (
    <div>
      <h3
        style={{
          fontSize: 24,
          marginLeft: 5,
          marginBottom: 0,
        }}
      >
        {list?.title}
        {list.dates && (
          <small style={{ marginLeft: 5, fontSize: 14 }}>
            ( 统计日期: {list.dates.join(' 至 ')} )
          </small>
        )}
      </h3>
      {typeof group !== 'undefined' ? (
        <GroupCardList data={data} group={group} />
      ) : (
        <CardListItem data={list} loading={loading} />
      )}
    </div>
  );
};
