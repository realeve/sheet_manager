import React from 'react';
import { axios, mock } from '@/utils/axios';
import { DEV } from '@/utils/setting';
import * as R from 'ramda';

// http://cdn.cdyc.cbpm:100/500/f98ac39f1f?blob[]=image_1&blob[]=image_2&blob[]=image_3&blob_type=jpg&cache=0.25
/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 印码机检实时数据 }
 */
export const getViewPrintOnlineQuality = async () => {
  let res = DEV
    ? await mock(require('@/mock/500_f98ac39f1f.json'))
    : await axios({
        url: '/500/f98ac39f1f.json',
        params: {
          blob: ['image_1', 'image_2', 'image_3'],
          blob_type: 'jpg',
          cache: 0,
        },
      });
  res.data = R.sortBy(R.prop('good_rate'))(res.data);

  return res;
};

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 实时监测-近期未检情况 }
 */
export const getOnlineinfo = cart =>
  DEV
    ? mock(require('@/mock/501_ff0feed532.json'))
    : axios({
        url: '/501/ff0feed532.json',
        params: {
          cart,
        },
      });

/**
 *   @database: { 接口管理 }
 *   @desc:     { 实时监测-同一工作日生产其它产品 }
 */
export const getOnlineinfoByMachine = async cart => {
  let res = DEV
    ? await mock(require('@/mock/502_b4c5a73656.json'))
    : await axios({
        url: '/502/b4c5a73656.json',
        params: {
          cart,
        },
      });
  let data = R.clone(res.data);

  res.data2 = data.map((item, idx) => {
    item['好品率'] = Number(item.GoodRate);
    res.data[idx].GoodRate = Number(item.GoodRate);
    item['车号'] = (
      <a href={`/search/#${item['CartNumber']}`} alt={item['CartNumber']} target="_blank">
        {item['CartNumber']}
      </a>
    );
    item['开位'] = item['FormatPos1'];
    item['缺陷条数'] = item['ErrCount1'];
    return item;
  });

  res.header2 = ['车号', '好品率', '开位', '缺陷条数'];
  return res;
};

/**
 *   @database: { 质量信息系统_图像库 }
 *   @desc:     { 码后缺陷图像查询 }
 */
// http://cdn.cdyc.cbpm:100/503/a8dd1e5c75/array?mahou_id=78240&blob[]=0&blob[]=1&blob[]=2&blob_type=jpg
export const getImagedata = mahou_id =>
  DEV
    ? mock(require('@/mock/503_a8dd1e5c75'))
    : axios({
        url: '/503/a8dd1e5c75/array',
        params: {
          mahou_id,
        },
      });

/**
 *   @database: { 接口管理 }
 *   @desc:     { 印码机检系统列表 }
 */
export const proxy109330 = () =>
  axios({
    url: DEV ? '@/mock/1176_7473df504c.json' : '/1176/7473df504c.json',
  }).then(async res => {
    let data = eval(res);
    let data2 = await axios(`${window.location.origin}/vnc.json`);
    return [
      ...data2,
      {
        type: '印码工序',
        data,
      },
    ];
  });

export const getVNCList = () => axios(`${window.location.origin}/vnc_lite.json`);

export const getVNCUser = () => axios(`${window.location.origin}/vnc_user.json`);

export const isOnline = () =>
  axios({ url: 'http://10.9.5.133/ip.json', timeout: 3 }).then(res => res.ip);

export const mList = [
  {
    type: '凹印工序-92型',
    data: [
      {
        machine: '92型-2#',
        token: '92-2',
      },
      {
        machine: '92型-3#',
        token: '92-3',
      },
      {
        machine: '92型-4#',
        token: '92-4',
      },
      {
        machine: '92型-5#',
        token: '92-5',
      },
      {
        machine: '92型-6#',
        token: '92-6',
      },
      {
        machine: '92型-7#',
        token: '92-7',
      },
      {
        machine: '92型-8#',
        token: '92-8',
      },
      {
        machine: '92型-9#',
        token: '92-9',
      },
      {
        machine: '92型-10#',
        token: '92-10',
      },
      {
        machine: '92型-11#',
        token: '92-11',
      },
      {
        machine: '92型-12#',
        token: '92-12',
      },
      {
        machine: 'W10-1#',
        token: 'w10',
      },
    ],
  },
  {
    type: '印码工序',
    data: [
      { machine: '码后大张一号机', ip: '10.9.61.154', token: 'dmj1' },
      { machine: '码后大张二号机', ip: '10.9.61.155', token: 'dmj2' },
      { machine: '丝凸检一号机', ip: '10.9.61.220', token: 'stj1' },
      { machine: '丝凸检二号机', ip: '10.9.61.197', token: 'stj2' },
      { machine: '丝凸检三号机', ip: '10.9.61.225', token: 'stj3' },
      { machine: '丝凸印一号机', ip: '10.9.61.221', token: 'sty1' },
      { machine: '丝凸印二号机', ip: '10.9.61.222', token: 'sty2' },
      { machine: '丝凸印三号机', ip: '10.9.61.223', token: 'sty3' },
      { machine: 'M81D一号机', ip: '10.9.61.156', token: 'm81d1' },
      { machine: 'M81D二号机', ip: '10.9.61.203', token: 'm81d2' },
      { machine: '多功能一号机', ip: '10.9.61.124', token: 'dgn1' },
      { machine: '多功能二号机', ip: '10.9.61.44', token: 'dgn2' },
      { machine: '多功能三号机', ip: '10.9.61.43', token: 'dgn3' },
      { machine: '接线印码机', ip: '10.9.61.217', token: 'jxym' },
      { machine: '涂布一号机', ip: '10.9.61.46', token: 'tb1' },
      { machine: '涂布二号机', ip: '10.9.61.48', token: 'tb2' },
      { machine: '涂布三号机', ip: '10.9.61.50', token: 'tb3' },
      { machine: '涂布四号机', ip: '10.9.61.53', token: 'tb4' },
      { machine: '涂布五号机', ip: '10.9.61.58', token: 'tb5' },
      { machine: '远程建模设备34', ip: '10.9.3.34', token: 'ymjm34' },
      { machine: '远程建模设备35', ip: '10.9.3.35', token: 'ymjm35' },
      { machine: '远程建模设备36', ip: '10.9.3.36', token: 'ymjm36' },
      { machine: '远程建模设备37', ip: '10.9.3.37', token: 'ymjm37' },
    ],
  },
];
