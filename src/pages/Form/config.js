export default {
  name: '业务名称',
  api: {
    insert: {
      url: '122/adsf78234.json',
      param: ['rec_time', 'uid'],
    },
    update: {
      url: '123/asdfasdf.json',
      param: ['_id'],
    },
    delete: {
      url: '112/a1234asdf.json',
      param: ['_id'],
    },
    query: {
      url: '114/ad3adsf4d.json',
      param: ['cart_number'],
    },
  },
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
          url: '27/9b520a55df.json',
          key: 'dept_id',
          rule: { required: true },
          mode: 'multiple',
        },
        {
          title: '品种',
          type: 'select',
          defaultOption: [
            { name: '2A', value: 2 },
            { name: '3A', value: 3 },
            { name: '4A', value: 4 },
            { name: '5A', value: 5 },
          ],
          key: 'prod_2',
        },

        {
          title: '单选部门',
          type: 'select',
          url: '27/9b520a55df.json',
          key: 'dept_id2',
          rule: { required: true },
          mode: 'tags',
          block: '(用户可输入自定义文字)',
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
        {
          title: '品种1',
          type: 'radio.button',
          key: 'prod_id',
          url: '34/ad64451402.json',
          rule: { required: true },
        },
        {
          title: '品种2',
          type: 'radio',
          key: 'prod_id2',
          url: '34/ad64451402.json',
        },
        {
          title: '品种3',
          type: 'check',
          key: 'prod_id3',
          url: '34/ad64451402.json',
        },
        {
          title: '评分',
          type: 'rate',
          key: 'grade',
          desc: ['低于较差值', '较差值', '中间值', '良好值', '优秀值'],
        },
        {
          title: '品种4',
          type: 'check',
          key: 'prod_id4',
          // url: '34/ad64451402.json', // 自定义选择项，不从接口读取
          defaultOption: [
            { name: '2A', value: 2 },
            { name: '3A', value: 3 },
            { name: '4A', value: 4 },
            { name: '5A', value: 5 },
          ],
        },
        {
          title: '字段5',
          type: 'radio.button',
          key: 'param5',
          defaultOption: [
            { name: '2A', value: 2 },
            { name: '3A', value: 3 },
            { name: '4A', value: 4 },
            { name: '5A', value: 5 },
          ],
          rule: { required: true },
        },
      ],
    },
  ],
};
