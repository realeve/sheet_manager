import React, { useState, useEffect } from 'react';
import { useSetState } from 'react-use';
import { Card, Row, Switch, notification } from 'antd';
import { Icon } from '@ant-design/compatible';
import styles from './index.less';
import { validRequire, beforeSheetRender, getIncrease } from './lib';
import FormItem from './FormItem';
import CodeDrawer from './CodeDrawer';
import FormAction from './FormAction';
import useFetch from '@/components/hooks/useFetch';
import VTable from '@/components/Table.jsx';
import * as R from 'ramda';
import { connect } from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import qs from 'qs';
import { useLocation } from 'react-use';
import router from 'umi/router';

moment.locale('zh-cn');
let getUrl = formConfig => {
  let url = (formConfig.api.table || { url: '' }).url.replace('.json', '.array');
  if (!url.includes('.array')) {
    url += '.array';
  }
  return url;
};

const getDefaultList = cfg => {
  let defaultList = R.filter(item => item.defaultValue || item.value)(cfg);
  let res = {};
  defaultList.forEach(({ key, defaultValue, value }) => {
    res[key] = value || defaultValue;
  });
  return res;
};

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
  /**
   * @wiki https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
   * 处理带function的JSON文件
   */
  useEffect(() => {
    init();
  }, []);

  const init = () => {
    let res = getDefaultList(cfg);
    setState(res);
    setFields(res);
  };

  const [qualifyKey, setQualifyKey] = useState(null);

  const [queryKey, setQueryKey] = useState([]);
  const { hash } = useLocation();

  useEffect(() => {
    // config改变后初始化表单数据
    init();

    setFormConfig(config);
    let requiredFileds = [];
    let nextFields = {};
    let observeKey = null;

    if (config.api && config.api.query && config.api.query.param) {
      setQueryKey(config.api.query.param);
    }
    console.log('config变更：', config);

    config.detail.forEach(({ detail }) => {
      detail.forEach(item => {
        if (item.rule && item.rule.required) {
          requiredFileds.push(item.key);
        }

        // 有字段表示合格时
        if (item.checkedChildren === '合格') {
          observeKey = item.key;
        }

        nextFields[item.key] = item.mode === 'tags' ? [] : '';
        // 如果有日期选择组件，记录初始化数据
        if (item.type === 'datepicker') {
          setState({ [item.key]: moment().format(item.datetype || 'YYYY-MM-DD') });
        }
        setValidateState({ [item.key]: true });
      });
    });

    // 表示结果是否“合格”的字段
    setQualifyKey(observeKey);

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

  /**
   * 此处定义beforeInsert，对应配置中的JSON信息；
   * JSON配置中支持定义 beforeInsert 字段，内容为函数表达式，默认仅传入当前数据值，如：
   * {
   *  beforeInsert:{
   *    rule:"beforeInsert = function(state){return state.username == '张三'}"
   *  }
   * }
   * 
   * "beforeInsert": {
        "rule": "beforeInsert = function(state)\n{return state.ream_count == state.ream_num1+state.ream_num2  }",
    "msg": "小计令数与详情数据校验失败，两者和不相等"
  }
   * 用于校验用户信息是否为张三，该场景用在多个内部字段的联合校验上，适用于单字段无法处理的场景
   */

  useEffect(() => {
    if (!Object.keys(state).length) {
      setFormstatus(false);
      return;
    }
    let beforeInsert = null;
    if (config.beforeInsert && config.beforeInsert.rule) {
      eval(config.beforeInsert.rule);
    }

    console.log(state, beforeInsert);
    // 处理用户自定义数据校验逻辑
    if (beforeInsert && !beforeInsert(state)) {
      notification.error({
        message: '系统提示',
        description: config.beforeInsert.msg,
      });
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
      url: getUrl(formConfig),
    },
    valid: () =>
      formConfig.api.table && formConfig.api.table.url && formConfig.api.table.url.length > 0,
    // callback: ({ data, ...res }) => {
    //   data = data.map(tr => tr.map(td => (td ? td.trim() : '')));
    //   return { data, ...res };
    // },
  });

  // 设置不合格数据
  let [remark, setRemark] = useState('');
  const getFieldNameByKey = key => {
    let res = R.find(R.propEq('key', key))(cfg);
    // console.log(key, res);
    return res.title;
  };

  const refreshScope = () => {
    // 收集初始scope
    let cfg = R.flatten(R.map(R.prop('detail'))(config.detail));
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
    setScope(res);
  };

  // 变更时收集scope
  // useEffect(() => {
  //   if (scope.length > 0) {
  //     return;
  //   }
  //   // console.log(cfg);
  //   refreshScope();
  // }, [state]);

  useEffect(() => {
    refreshScope();
  }, [config]);

  // 手工决定是否继续执行重计算，当做完scope判断后，需要对 【合格】 字段重新计算是否合格，此时应该禁止再次计算，防止循环更新。
  const [needCalc, setNeedCalc] = useState(true);
  // 不合格字段判断，总分计算
  useEffect(() => {
    if (scope.length === 0) {
      return;
    }
    if (!needCalc) {
      setNeedCalc(true);
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
      if (!R.isNil(max) && val > max) {
        fields.push(getFieldNameByKey(key));
        sumScore -= score;
      }
      if (!R.isNil(min) && val < min) {
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
    if (qualifyKey) {
      setState({ [qualifyKey]: fields.length === 0 });
      setNeedCalc(false);
    }
  }, [state, scope]);

  // 数据重置：配置中 unReset 的项在重置时保持上次结果
  const onReset = () => {
    let keys = R.compose(
      R.pluck('key'),
      R.filter(
        item =>
          item.unReset ||
          item.type === 'label' ||
          item.defaultValue ||
          item.value ||
          item.defaultOption ||
          item.url
      ) // label项默认不重置、unReset项不重置、带有defaultValue的项不重置,带有value的项不重置
      // 带有defaultOption及url的下拉项不重置
    )(cfg);

    if (keys.length === 0) {
      setState(fields);
      return;
    }

    let prevFileds = R.pick(keys)(state);

    let increaseFileds = handleIncrease();

    let nextFields = {
      ...fields,
      ...prevFileds,
      ...increaseFileds,
    };
    setFields(nextFields);
    setState(nextFields);
    setTotalScore(100);
  };

  const handleIncrease = () => {
    // -- TODO 2020-03-12 在处理处理increse重置的逻辑

    // 当前隐藏的字段不用处理,当前显示的字段，有自增需求的才需处理
    let keys = R.compose(
      R.map(R.pick(['key', 'increase'])),
      R.filter(item => item.increase && !hideKeys.includes(item.increase))
    )(cfg);
    let nextFileds = {};
    keys.map(({ key, increase }) => {
      let item = state[key];

      // 是否继续录入，用于关闭数据自增逻辑
      nextFileds[key] = state.ignoreIncrese ? item : getIncrease(increase, item);
    });
    return nextFileds;
  };

  // http://localhost:8000/form#id=./form/paper/chemical_pva.json

  // 字段隐藏时数据默认值处理
  useEffect(() => {
    if (hideKeys.length === 0) {
      return;
    }
    let nextState = {};
    hideKeys.forEach(key => {
      nextState[key] = '';
    });

    setState({
      // ...state,
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
            extra={
              idx === 0 &&
              location.href.includes('&_id=') && (
                <Switch
                  checked={editMethod === 'update'}
                  title="数据更新模式，将覆盖当前数据，点击切换到普通模式"
                  checkedChildren="更新模式"
                  unCheckedChildren="编辑模式"
                  onClick={() => {
                    let param = qs.parse(hash.slice(1));
                    if (!param._id) {
                      return;
                    }

                    // 关闭载入模式;
                    router.push('#id=' + param.id);

                    let status = {
                      insert: 'update',
                      update: 'insert',
                    };
                    setEditMethod(status[editMethod]);
                  }}
                />
              )
            }
          >
            <Row gutter={15}>
              {detailArr.map(
                ({ key, cascade, ...detail }) =>
                  !hideKeys.includes(key) &&
                  !detail.hide && (
                    <FormItem
                      key={key}
                      keyName={key}
                      state={state[key]}
                      cascade={[cascade, state[cascade]]}
                      isQueryKey={queryKey.includes(key)}
                      setState={res => {
                        setState({
                          [key]: res,
                        });

                        // 如果是“合格”判断的字段，不执行重计算
                        if (key === qualifyKey) {
                          setNeedCalc(false);
                        }
                      }}
                      setFormstatus={setFormstatus}
                      detail={detail}
                      scope={scope}
                      setScope={({ scope: nextScope, hide }) => {
                        let keys = R.map(R.prop('key'))(nextScope);
                        // console.log(nextScope, keys);
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
                  formstatus={formstatus} // 数据校验字段，为false时禁止提交
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
            <VTable
              dataSrc={tblData}
              beforeRender={formConfig.api.load ? beforeSheetRender : e => e}
              loading={loading}
              merge={false}
            />
          </Card>
        )}
      </div>
    </div>
  );
}

export default connect()(FormCreater);
