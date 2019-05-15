import React, { useState, useEffect } from 'react';
import { useSetState } from 'react-use';
import {
  Card,
  Row,
  Icon,
} from 'antd';
import styles from './index.less';
import { validRequire } from './lib';
import FormItem from './FormItem'
import CodeDrawer from './CodeDrawer'
import FormAction from './FormAction'
import { connect } from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

function FormCreater({ config, dispatch }) {
  let [state, setState] = useSetState();
  let [editMethod, setEditMethod] = useState('insert');
  let [validateState, setValidateState] = useSetState();

  // 初始化空数据，获取必填字段
  let [fields, setFields] = useState({});
  let [requiredFileds, setRequiredFileds] = useState([]);

  let [modalVisible, setModalVisible] = useState(false);

  let [formConfig, setFormConfig] = useState(config);

  // config改变后初始化表单数据
  useEffect(() => {
    setFormConfig(config);
    let requiredFileds = [];
    let nextFields = {};
    config.detail.forEach(({ detail }) => {
      detail.forEach(item => {
        if (item.rule && item.rule.required) {
          requiredFileds.push(item.key);
        }

        nextFields[item.key] = item.mode === 'tags' ? [] : '';
        // 如果有日期选择组件，记录初始化数据
        if (item.type === 'datepicker') {
          setState({ [item.key]: moment().format(item.datetype || 'YYYY-MM-DD') });
        }
        setValidateState({ [item.key]: true });
      });
    });

    setFields(nextFields);
    setRequiredFileds(requiredFileds);
    dispatch({
      type: 'common/setStore',
      payload: {
        curPageName: config.name,
      },
    });

  }, [config]);

  // 表单字段当前状态判断
  const [formstatus, setFormstatus] = useState(false);
  useEffect(() => {

    if (!Object.keys(state).length) {
      setFormstatus(false);
      return;
    }
    // 必填字段状态校验
    let required = validRequire(requiredFileds, state);
    let validStatus = Object.values(validateState).filter(item => !item).length == 0;
    setFormstatus(validStatus && required);
  }, [state]);

  console.log(formConfig.detail, config, '🌸');

  return (
    <div>
      <CodeDrawer formConfig={formConfig} setFormConfig={setFormConfig} modalVisible={modalVisible} setModalVisible={setModalVisible} />

      <div className={styles.form}>
        {formConfig.detail.map(({ title: mainTitle, detail }, idx) => (
          <Card
            title={
              <span>
                {idx + 1}.{mainTitle}
                {idx === 0 && (
                  <Icon style={{ paddingLeft: 10 }} type="question-circle-o" onClick={() => setModalVisible(true)} />
                )}
              </span>
            }
            style={{ marginBottom: 20 }}
            key={mainTitle}
          >
            <Row gutter={15}>
              {detail.map((detail, i) => <FormItem key={detail.key} keyName={detail.key} state={state} setState={setState} setFormstatus={setFormstatus} detail={detail} />)}
              {idx === formConfig.detail.length - 1 && <FormAction requiredFileds={requiredFileds} state={state} setState={setState} fields={fields} setEditMethod={setEditMethod} formstatus={formstatus} editMethod={editMethod} formConfig={formConfig} config={config} />}
            </Row>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default connect()(FormCreater)