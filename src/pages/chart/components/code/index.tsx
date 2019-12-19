import React, { useState, useEffect } from 'react';

import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import beautify from 'js-beautify';
import 'codemirror/mode/sql/sql';

import { Drawer, Button, notification, Typography, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

import styles from './index.less';

export default function codeDrawer({
  modalVisible,
  setModalVisible,
  formConfig,
  setFormConfig,
}): JSX.Element {
  const [beautyConfig, setBeautyConfig] = useState('{}');

  const handleConfig = () => {
    try {
      let configStr: {} = JSON.parse(beautyConfig);
      setFormConfig([configStr]);
    } catch (e) {
      notification.error({
        message: '系统提示',
        description: '格式异常，不是有效的JSON数据，请仔细检查',
      });
    }
  };

  useEffect(() => {
    const beautyOption = {
      indent_size: 2,
      wrap_line_length: 80,
      jslint_happy: true,
    };
    const code: string = beautify(JSON.stringify(formConfig[0]), beautyOption);
    setBeautyConfig(code);
  }, [formConfig]);

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
        <Title level={3}>图表配置</Title>
      </Paragraph>
      <div>
        <p>
          图表基于ECharts实现，修改下列配置中的数据可实时显示图表结果。也可将以下配置信息复制到ECharts图表预览工具中实时查看：
        </p>
      </div>
      <Paragraph>
        <Title level={4}>配置文件</Title>
      </Paragraph>
      <CodeMirror
        value={'var option = ' + beautyConfig}
        options={{
          mode: 'javascript',
          lineNumbers: true,
          styleActiveLine: true,
          matchBrackets: true,
          theme: 'material',
        }}
        onBeforeChange={(editor, data, value) => {
          setBeautyConfig(value.slice(12));
        }}
        className={styles.code}
      />

      <div style={{ marginTop: 20 }}>
        <Button type="primary" onClick={handleConfig}>
          实时预览
        </Button>
      </div>
    </Drawer>
  );
}
