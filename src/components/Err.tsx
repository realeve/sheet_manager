import React from 'react';
import styles from './Err.less';
// import { Controlled as CodeMirror } from 'react-codemirror2';
// import 'codemirror/mode/javascript/javascript';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/material.css';
// import beautify from 'js-beautify';
import qs from 'qs';

export default function Err({ err }) {
  // const beautyOption = {
  //   indent_size: 2,
  //   wrap_line_length: 80,
  //   jslint_happy: true,
  // };

  // const beautyConfig = beautify(
  //   `axios(${JSON.stringify({ url: err.url, params: err.params })})`,
  //   beautyOption
  // );
  Reflect.deleteProperty(err.params, 'tstart2');
  Reflect.deleteProperty(err.params, 'tend2');
  Reflect.deleteProperty(err.params, 'tstart3');
  Reflect.deleteProperty(err.params, 'tend3');
  let url = `${err.url}?${qs.stringify(err.params)}`;
  return (
    <div>
      <div className={styles.error}>
        <img src="/img/500.svg" alt="" />
        <div className={styles.desc}>
          <h1>
            {err.status && `${err.status}:`}
            {err.message}:<br />
            <span>{err.description}</span>
          </h1>
          {err.params && (
            <p>
              点击调试:
              <a href={url} target="_blank">
                {url}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* {err.params && (
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
      )} */}
    </div>
  );
}
