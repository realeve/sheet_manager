import React, { useState, useEffect } from 'react';
import { useSetState } from 'react-use';
import { Card, Row, Icon } from 'antd';
import styles from './index.less';
import { validRequire } from './lib';
import FormItem from './FormItem';
import CodeDrawer from './CodeDrawer';
import FormAction from './FormAction';
import useFetch from '@/components/hooks/useFetch';
import VTable from '@/components/Table.jsx';
import * as R from 'ramda';
import { connect } from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

function FormCreater({ config, dispatch }) {
  // 增加对总分的计算，与scope字段一并处理
  let [state, setState] = useSetState();
  let [totalScore, setTotalScore] = useState(100);

  let [editMethod, setEditMethod] = useState('insert');
  let [validateState, setValidateState] = useSetState();

  // 初始化空数据，获取必填字段
  let [fields, setFields] = useState({});
  let [requiredFileds, setRequiredFileds] = useState([]);

  let [modalVisible, setModalVisible] = useState(false);

  let [formConfig, setFormConfig] = useState(config);

  let cfg = R.flatten(R.map(R.prop('detail'))(config.detail));

  // 初始化defaultValue
  useEffect(() => {
    let defaultList = R.filter(item => item.defaultValue || item.value)(cfg);
    let res = {};
    defaultList.forEach(({ key, defaultValue, value }) => {
      res[key] = value || defaultValue;
    });
    setState(res);
    setFields(res);
  }, []);

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
    reFetch();
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

  // console.log(config, state, '🌸');

  // 对应指标数据范围
  const [scope, setScope] = useState([]);
  const [hideKeys, setHideKeys] = useState([]);

  const { data: tblData, loading, reFetch } = useFetch({
    param: {
      url: (formConfig.api.table || { url: '' }).url,
    },
    valid: () =>
      formConfig.api.table && formConfig.api.table.url && formConfig.api.table.url.length > 0,
  });

  // 设置不合格数据
  let [remark, setRemark] = useState('');
  const getFieldNameByKey = key => {
    let res = R.find(R.propEq('key', key))(cfg);
    return res.title;
  };

  // 变更时收集scope
  useEffect(() => {
    if (scope.length > 0) {
      return;
    }
    // console.log(cfg);
    // 收集初始scope
    let res = R.compose(
      R.flatten,
      R.filter(item => item),
      R.map(item => {
        // item.scope
        if (R.type(item.scope) === 'Object') {
          return [
            {
              key: item.key,
              ...item.scope,
            },
          ];
        }
        return item.scope;
      })
    )(cfg);

    console.log(res);
    setScope(res);
  }, [state]);

  // 不合格字段判断，总分计算
  useEffect(() => {
    if (scope.length === 0) {
      return;
    }
    let fields = [];

    // 总分
    let sumScore = 100;

    scope.forEach(({ key, min, max, score }) => {
      let val = state[key] || '';
      if (String(val).length === 0) {
        return;
      }
      if (max && val > max) {
        fields.push(getFieldNameByKey(key));
        sumScore -= score;
      }
      if (min && val < min) {
        fields.push(getFieldNameByKey(key));
        sumScore -= score;
      }
    });

    setTotalScore(sumScore);

    if (fields.length) {
      setRemark('不合格项:' + fields.join('、'));
    } else {
      setRemark('');
    }
  }, [state, scope]);

  // 数据重置：配置中 unReset 的项在重置时保持上次结果
  const onReset = () => {
    let keys = R.compose(
      R.pluck('key'),
      R.filter(item => item.unReset || item.type === 'label') // label项默认不重置、unReset项不重置
    )(cfg);
    if (keys.length === 0) {
      setState(fields);
      return;
    }

    let prevFileds = R.pick(keys)(state);
    let nextFields = {
      ...fields,
      ...prevFileds,
    };
    setFields(nextFields);

    setState(nextFields);
    setTotalScore(100);
  };

  // http://localhost:8000/form#id=./form/paper/chemical_pva.json

  // 字段隐藏时数据默认值处理
  useEffect(() => {
    if (hideKeys.length === 0) {
      return;
    }
    let nextState = hideKeys.map(key => ({
      [key]: '',
    }));

    setState({
      ...state,
      ...nextState,
    });
    setFields({
      ...fields,
      ...nextState,
    });
  }, [hideKeys]);

  return (
    <div>
      <CodeDrawer
        formConfig={formConfig}
        setFormConfig={setFormConfig}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />

      <div className={styles.form}>
        {formConfig.detail.map(({ title: mainTitle, detail: detailArr }, idx) => (
          <Card
            title={
              <div>
                {idx === 0 && <h3 style={{ marginBottom: 10 }}>{formConfig.name}</h3>}
                <span>
                  {idx + 1}.{mainTitle}
                  {idx === 0 && (
                    <Icon
                      style={{ paddingLeft: 10 }}
                      type="question-circle-o"
                      onClick={() => setModalVisible(true)}
                    />
                  )}
                  {formConfig.showScore && idx === 0 && (
                    <p>
                      <small>总分：{totalScore}</small>
                    </p>
                  )}
                </span>
              </div>
            }
            style={{ marginBottom: 20 }}
            key={mainTitle}
          >
            <Row gutter={15}>
              {detailArr.map(
                ({ key, cascade, ...detail }) =>
                  !hideKeys.includes(key) && (
                    <FormItem
                      key={key}
                      keyName={key}
                      state={state[key]}
                      cascade={[cascade, state[cascade]]}
                      setState={res => {
                        setState({
                          [key]: res,
                        });
                      }}
                      setFormstatus={setFormstatus}
                      detail={detail}
                      scope={scope}
                      setScope={({ scope: nextScope, hide }) => {
                        let keys = R.map(R.prop('key'))(nextScope);
                        console.log(nextScope, keys);
                        let prevScope = R.reject(item => keys.includes(item.key))(scope);
                        // console.log(keys, prevScope);
                        setScope([...prevScope, ...nextScope]);
                        setHideKeys(hide);
                      }}
                    />
                  )
              )}
              {idx === formConfig.detail.length - 1 && (
                <FormAction
                  requiredFileds={requiredFileds}
                  state={state}
                  setState={setState}
                  fields={fields}
                  setEditMethod={setEditMethod}
                  formstatus={formstatus}
                  editMethod={editMethod}
                  formConfig={formConfig}
                  config={config}
                  reFetch={reFetch}
                  remark={remark}
                  onReset={onReset}
                  score={totalScore}
                />
              )}
            </Row>
          </Card>
        ))}
        {tblData && (
          <Card>
            <VTable dataSrc={tblData} loading={loading} merge={false} />
          </Card>
        )}
      </div>
    </div>
  );
}

export default connect()(FormCreater);
