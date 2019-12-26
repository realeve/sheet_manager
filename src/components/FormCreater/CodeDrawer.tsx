import React, { useState, useEffect } from 'react';

import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import beautify from 'js-beautify';
import 'codemirror/mode/sql/sql';

import { Drawer, Button, notification, Typography, Divider, message } from 'antd';
import { host } from '@/utils/setting';

const { Title, Paragraph, Text } = Typography;

import styles from './CodeDrawer.less';
import * as R from 'ramda';
import { getNonce } from '@/utils/lib';
import { getApiConfig, getApi, getCreate } from './lib';

import { formatMessage } from 'umi/locale';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function codeDrawer({
  modalVisible,
  setModalVisible,
  formConfig,
  setFormConfig,
}): JSX.Element {
  const [beautyConfig, setBeautyConfig] = useState('{}');

  const [sql, setSql] = useState({});

  useEffect(() => {
    const beautyOption = {
      indent_size: 2,
      wrap_line_length: 80,
      jslint_happy: true,
    };
    const code: string = beautify(JSON.stringify(formConfig), beautyOption);
    setBeautyConfig(code);
    if (!formConfig.detail) {
      return;
    }
    (async () => {
      let res = R.compose(
        R.flatten,
        R.map(item => item.detail)
      )(formConfig.detail);

      let keys = res.map(item => item.key);

      let condition = formConfig.api.query || {
        param: ['_id'],
      };
      const select = `      SELECT 
      ${keys.join(',\r\n        ')} 
    FROM
      tbl_${formConfig.table} 
    WHERE
      ${(condition.param || []).map(item => `${item} = '1'`).join(' and ')}`;

      const create = getCreate(formConfig);
      let query = `

-- 下列语句用于查看最近录入的10条数据
SELECT top 10 * FROM view_${formConfig.table} ORDER BY 录入时间 desc;`;

      let nonce = getNonce();
      const api = getApi(formConfig, nonce);
      let jsonCfg = await getApiConfig(R.clone(formConfig), nonce);

      setSql({
        select,
        create,
        api,
        json: beautify(JSON.stringify(jsonCfg), beautyOption),
        view: `
    CREATE VIEW  view_${formConfig.table} AS
      SELECT id,
      ${res
        .map(item => {
          let keyName = item.key;
          if (item.type.includes('date')) {
            keyName =
              item.datetype === 'YYYY-MM-DD hh:mm:ss'
                ? `CONVERT ( VARCHAR, ${item.key}, 120 )`
                : `CONVERT ( VARCHAR(10), ${item.key}, 120 )`;
          }
          return `${keyName} ${item.title}`;
        })
        .join(',\r\n        ')},
    CONVERT ( VARCHAR, rec_time, 120 ) 录入时间
      FROM
      tbl_${formConfig.table};
      EXEC sp_addextendedproperty
      'MS_Description', N'${formConfig.name}',
      'SCHEMA', N'dbo',
      'VIEW', N'view_${formConfig.table}';`,
        query,
      });
    })();
  }, [formConfig]);

  const handleConfig = () => {
    try {
      let configStr: {} = JSON.parse(beautyConfig);
      setFormConfig(configStr);
    } catch (e) {
      notification.error({
        message: '系统提示',
        description: '格式异常，不是有效的JSON数据，请仔细检查',
      });
    }
  };

  return (
    <Drawer
      placement="right"
      closable={false}
      visible={modalVisible}
      width="550px"
      onClose={() => setModalVisible(false)}
      bodyStyle={{ padding: 20 }}
    >
      <Paragraph>
        <Title level={3}>表单配置项</Title>
      </Paragraph>
      <div>
        <p>自定义报表时，可参考该配置</p>
        <p>
          1.在insert接口设置的param字段，如果设置rec_time,uid，系统自动将当前用户uid以及rec_time作为提交字段向后台提交。
        </p>
        <p>2.span代表当前录入项宽度，建议值24(100%)、12(50%)、8(33%)</p>
      </div>
      <Divider />
      <Paragraph>
        <Title level={4}>配置文件</Title>
      </Paragraph>
      <CodeMirror
        value={beautyConfig}
        options={{
          mode: 'javascript',
          lineNumbers: true,
          styleActiveLine: true,
          matchBrackets: true,
          theme: 'material',
        }}
        onBeforeChange={(editor, data, value) => {
          setBeautyConfig(value);
        }}
        className={styles.code}
      />

      <div style={{ marginTop: 20 }}>
        <Button type="primary" onClick={handleConfig}>
          实时预览
        </Button>
      </div>

      <Paragraph style={{ marginTop: 10 }}>
        <Title level={4}>1.建表</Title>
        此处以<Text mark>MSSQL Server</Text>
        为例建立数据表，需要处理数据字段类型识别、字段注释、表单注释相关功能；同时建立数据视图
        <Text mark>view_{formConfig.table}</Text>
        ，建完视图后用于业务查询。
      </Paragraph>
      <CodeMirror
        value={sql.create + sql.view}
        options={{
          mode: 'sql',
          lineNumbers: true,
          styleActiveLine: true,
          matchBrackets: true,
          theme: 'material',
        }}
      />

      <CopyToClipboard
        text={sql.create + sql.view}
        onCopy={() => message.success('拷贝成功，请到api管理平台建立接口')}
      >
        <Button style={{ marginTop: 10 }} icon="copy">
          点击复制
        </Button>
      </CopyToClipboard>

      <Paragraph style={{ marginTop: 10 }}>
        <Title level={4}>2.接口配置（批量添加）</Title>
        在有大量表单需要处理时，建议通过以下方式手动<Text mark>在接口管理数据库中批量添加</Text>
        ,其中db_id表示业务数据库id,uid表示接口管理用户id，可根据情况手动修改：
      </Paragraph>
      <CodeMirror
        value={sql.api}
        options={{
          mode: 'sql',
          lineNumbers: true,
          styleActiveLine: true,
          matchBrackets: true,
          theme: 'material',
        }}
      />

      <CopyToClipboard
        text={sql.api}
        onCopy={() => message.success('拷贝成功，请到数据库管理工具中初始化配置信息')}
      >
        <Button style={{ marginTop: 10 }} icon="copy">
          点击复制
        </Button>
      </CopyToClipboard>

      <Paragraph style={{ marginTop: 10 }}>
        同时将json配置改为以下形式，其中api部分对应的接口id以及nonce信息已经更新:
      </Paragraph>
      <CodeMirror
        value={sql.json}
        options={{
          mode: 'javascript',
          lineNumbers: true,
          styleActiveLine: true,
          matchBrackets: true,
          theme: 'material',
        }}
      />

      <CopyToClipboard
        text={sql.json}
        onCopy={() => message.success('拷贝成功，请替换当前json文件')}
      >
        <Button style={{ marginTop: 10 }} icon="copy">
          点击复制
        </Button>
      </CopyToClipboard>

      <Paragraph style={{ marginTop: 10 }}>
        <Title level={4}>3.接口配置（手工建接口）</Title>
        请到
        <Text mark>
          <a
            href={`${host.replace('api', 'public')}index.html`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {host.replace('api', 'public')}index.html
          </a>
        </Text>
        添加接口的增、删、改。
      </Paragraph>
      <CodeMirror
        value={sql.select + sql.query}
        options={{
          mode: 'sql',
          lineNumbers: true,
          styleActiveLine: true,
          matchBrackets: true,
          theme: 'material',
        }}
      />
      <CopyToClipboard
        text={sql.select + sql.query}
        onCopy={() => message.success('拷贝成功，请到数据库管理工具中初始化配置信息')}
      >
        <Button style={{ marginTop: 10 }} icon="copy">
          点击复制
        </Button>
      </CopyToClipboard>

      <Paragraph style={{ marginTop: 10 }}>
        <Title level={4}>4.辅助功能-默认选择项</Title>
        <Text>
          部分表单中需要select选择框填写大量可选字段，可参考以下语句分割excel中单列选项数据：
        </Text>
      </Paragraph>

      <CodeMirror
        value={`       JSON.stringify(
        \`JB2 正棕
        JB2 正桔红 
        \`.split('\\n')
      .filter(item=>item.trim().length)
      .map((name)=>({name:name.trim(),value:name.trim(),hide: ["anti_fake", "drying_time", "release_time"],"scope": [
        {
          "key": "anti_fake",
          "max": 15,
          "suffix": "%",
          "block": "有红外吸收，近红外反射值≤15%"
        }
      ]})))`}
        options={{
          mode: 'javascript',
          lineNumbers: true,
          styleActiveLine: true,
          matchBrackets: true,
          theme: 'material',
        }}
      />
    </Drawer>
  );
}
