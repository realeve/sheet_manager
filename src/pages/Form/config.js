export default {
  name: '业务名称',
  insert: {
    url: '122/adsf78234.json',
    extra: {
      rec_time: true,
      uid: true,
    },
  },
  update: '123/asdfasdf.json',
  delete: '112/a1234asdf.json',
  query: '114/ad3adsf4d.json',
  uniqKey: ['cart_number'],
  detail: [
    {
      title: '基础数据',
      detail: [
        {
          title: '车号',
          type: 'input',
          key: 'cart_number',
          rule: {
            type: 'cart', // 'cart'|'reel'|'gz'| RegExp
            required: true,
            msg: '请输入有效车号信息',
          },
          placeholder: '请输入8位车号信息',
          maxLength: 8,
          toupper: 'true', //tolower|toupper
        },
        {
          title: '部门',
          type: 'select',
          url: '77/51bbce6074.json',
          key: 'dept_id',
          rule: { required: true },
        },
        {
          title: '数量1',
          type: 'input',
          key: 'fake_num',
          rule: 'number',
          min: 0,
          max: 1000,
          placeholder: '某指标数量',
        },
        {
          title: '录入日期',
          type: 'datepicker',
          key: 'rec_date',
          datetype: 'YYYY-MM-DD',
          rule: { required: true },
        },
      ],
    },
    {
      title: '其它数据',
      detail: [
        {
          title: '指标1',
          type: 'input.number',
          key: 'param1',
          rule: 'int',
          min: 0,
          max: 1000,
          block: '(单位：小张)',
          placeholder: '某指标1数量',
        },
        {
          title: '指标2',
          type: 'input',
          key: 'param2',
          rule: 'float',
          block: '(单位：大张)',
          placeholder: '某指标2数量',
        },
        {
          title: '白/中班',
          type: 'switch',
          key: 'param3',
          block: '选中表示白班',
        },
        {
          title: '备注',
          type: 'input.textarea',
          key: 'remark',
          placeholder: '请在此填入备注信息',
        },
      ],
    },
  ],
};
