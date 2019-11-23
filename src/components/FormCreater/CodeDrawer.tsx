import React, { useState, useEffect } from 'react';

import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import beautify from 'js-beautify';
import 'codemirror/mode/sql/sql';

import { Drawer, Button, notification } from 'antd';
import { Typography, Divider } from 'antd';

const { Title, Paragraph } = Typography;

import styles from './index.less';
import * as R from 'ramda';

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
    if (formConfig.detail) {
      let res = R.compose(
        R.flatten,
        R.map(item => item.detail)
      )(formConfig.detail);
      let keys = res.map(item => item.key);
      const insert = `insert into ${formConfig.table} (${keys.join(',')}) values(${new Array(
        res.length
      )
        .fill('?')
        .join(',')})`;
      const select = `select ${keys.join(',')} from ${formConfig.table} where id = 1`;
      const deleteStr = `delete from ${formConfig.table} where id=?`;
      const update = `update ${formConfig.table} set ${keys
        .map(key => key + '=?')
        .join(',')} where id=?`;
      setSql({
        insert,
        select,
        delete: deleteStr,
        update,
      });
    }
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
      width="450px"
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
          预览
        </Button>
      </div>

      <Paragraph>
        <Title level={4}>sql配置文件</Title>
      </Paragraph>
      <CodeMirror
        value={beautify(sql.select, { indent_size: 2, wrap_line_length: 60 })}
        options={{
          mode: 'sql',
          lineNumbers: true,
          styleActiveLine: true,
          matchBrackets: true,
          theme: 'material',
        }}
      />
    </Drawer>
  );
}
