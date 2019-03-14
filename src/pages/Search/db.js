import { axios, mock } from '@/utils/axios';
import { DEV } from '@/utils/setting';

/**
 *   @database: { MES_MAIN }
 *   @desc:     { 机台作业信息追溯 }
 */
export const getVCbpcCartlist = cart =>
  DEV
    ? mock(require('@/mock/331_8ed6e81fa3.json'))
    : axios({
        url: '/331/8ed6e81fa3.json',
        params: {
          cart,
        },
      });
