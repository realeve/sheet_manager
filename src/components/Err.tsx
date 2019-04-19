import React from 'react';
import styles from './Err.less';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import beautify from 'js-beautify';

export default function Err({ err }) {
  const beautyOption = {
    indent_size: 2,
    wrap_line_length: 80,
    jslint_happy: true,
  };
  const beautyConfig = beautify(
    `axios(${JSON.stringify({ url: err.url, params: err.params })})`,
    beautyOption
  );
  return (
    <div>
      <div className={styles.error}>
        <img src="/img/500.svg" alt="" />
        <div className={styles.desc}>
          <h1>
            {err.status && `${err.status}:`}
            {err.message}:<span>{err.description}</span>
          </h1>
        </div>
      </div>
      {err.params && (
        <CodeMirror
          value={beautyConfig}
          options={{
            mode: 'javascript',
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            theme: 'material',
          }}
          className={styles.code}
          onBeforeChange={(editor, data, value) => {}}
        />
      )}
    </div>
  );
}
