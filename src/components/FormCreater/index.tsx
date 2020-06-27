import React, { useState, useEffect } from 'react';
import { useSetState } from 'react-use';
import { Card, Row, Switch } from 'antd';
import { Icon } from '@ant-design/compatible';
import styles from './index.less';
import {
  validRequire,
  beforeSheetRender,
  getIncrease,
  validCalcKeys,
  handleDefaultHiddenKeys,
  calcResult,
} from './lib';
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
import { ICommon, IUserSetting } from '@/models/common';
import * as lib from '@/utils/lib';
import User from './user';
import classnames from 'classnames';
import { Dispatch } from 'redux';
import { DEV } from '@/utils/setting';

import * as mathjs from 'mathjs';
import { axios } from '@/utils/axios';

moment.locale('zh-cn');

let getUrl = formConfig => {
  let url = (formConfig.api.table || { url: '' }).url.replace('.json', '.array');
  if (!url.includes('.array')) {
    url += '.array';
  }
  return url;
};

const getCalcResult = (calcvalue: 'class_name' | 'hour' | string) => {
  switch (calcvalue) {
    case 'class_name':
      return new Date().getHours() >= 8 && new Date().getHours() < 16
        ? '白班'
        : new Date().getHours() >= 16
        ? '中班'
        : '';
    case 'hour':
      return new Date().getHours();
    default:
      return mathjs.evaluate(calcvalue);
  }
};

const getDefaultList = async (cfg, ip, initParam) => {
  let defaultList = R.filter(item => item.defaultValue || item.value || item.calcvalue)(cfg);
  let res = {};
  defaultList.forEach(({ key, defaultValue, value, calcvalue }) => {
    res[key] = value || defaultValue;
    if (calcvalue) {
      res[key] = getCalcResult(calcvalue);
    }
  });
  if (initParam) {
    await axios({
      ...initParam,
      params: {
        ip,
      },
    }).then(({ data, rows }) => {
      if (rows === 0) {
        return;
      }
      res = {
        ...res,
        ...data[0],
      };
    });
  }

  return res;
};

const handleCalcKey = (item, cfg) => {
  let keys = [];
  let { key, calc } = R.clone(item);
  cfg.forEach(item => {
    if (item?.title?.length && calc.includes(item.title)) {
      keys.push(item.key);
      calc = calc.replace(item.title, item.key);
    }
  });

  return { result: key, calc, keys };
};

export interface ISelectItem {
  name: string;
  value: string;
  hide?: string[]; // 选中当前选项后需要隐藏哪些字段
  scope?: {
    key: string; // 选中该选项后，对应的当前key字段参数注入
    min?: string; // 最小值
    max?: string; //最大值
  }[]; // 指标范围
}

// 组件类型列表
export type FieldType =
  | 'input.textarea'
  | 'label'
  | 'input'
  | 'input.number'
  | 'datepicker'
  | 'datepicker.month'
  | 'switch'
  | 'select'
  | 'radio.button'
  | 'radio'
  | 'check'
  | 'rate';

export interface IRule {
  type: string; // 校验正则
  required: boolean; // 必填项
  msg: string; // 报错后提示文字
  calc: string; // 当前字段通过计算进行校验
}
export interface IFieldItem {
  title: string; //标题名称，可为空
  tooltip?: string; // 标题移上去显示提示文字
  hidetitle: boolean; // 是否隐藏标题，用于input中，隐藏后placeholder将置为标题
  titlewidth: number; // 标题宽度
  init?: boolean; // 是否需要在初始化的时候加载
  type: FieldType; // 组件类型
  key: string; // 数据库key
  placeholder: string; // 输入框中显示的默认文字
  suffix: string; // 单位
  rule: Partial<IRule> | string; // 字段校验
  offset: number; // 偏移量
  span: number; // 宽度，栅格基准为24
  unReset: boolean; // 保留上次数据
  defaultOption: (string | ISelectItem)[]; // Select选项卡使用
  disabled: boolean; // 禁用
  url: string; // 载入指定链接的数据
  calc: string; // 其它字段计算得到当前值，calc为计算规则
  calcvalue: 'class_name' | 'hour' | string; // 当前字段的计算,不依赖其它值，比如根据时间计算班次；也可配置url，通过接口获取数据值
  block: string; // 字段下方提示文字
  allowClear: boolean; // 允许清除
  defaultValue: any; // 默认值
  checkedChildren: string; // switch选项卡参数
  unCheckedChildren: string; // switch选项卡参数
  showTime: boolean; // 显示时分秒
  dateType: string; // 时间格式,type为datepicker的时候生效
  increase: string; // 字段自增
  toupper: 'true' | 'false'; //转换为大写
  maxLength: number; // 字段长度
  [key: string]: any;
}

export interface IFormDetail {
  title?: string;
  detail: Partial<IFieldItem>[];
}
export interface IFormDb {
  insert: {
    // 添加
    url: string;
    param?: string[];
  };
  update?: {
    // 更新
    url: string;
    param?: string[];
  };
  table?: {
    // 查询最近录入的数据
    url: string;
    param?: string[];
  };
  load?: {
    // 载入历史数据，载入指定id的信息
    url: string;
    param?: string[];
  };
  print?: {
    // 打印当前表单
    url: string;
    param?: string[];
  };
  query?: {
    //  数据载入接口(此处将id转为_id，注入查询结果，用于数据更新)
    url: string;
    param?: string[];
  };
  delete?: {
    // 删除
    url: string;
    param?: string[];
  };
  // 初始化载入数据，以ip为参数，系统自动注入当前ip
  init?: {
    url: string;
  };
}
export interface IFormConfig {
  name: string; // 业务名
  api: IFormDb; // 数据库接口
  table: string; // 表单名
  showScore: boolean; // 显示当前得分，仅用于字段有得分范围需要自动计算分数的场景
  dev: boolean; // 开发模式，设为true后会显示每个字段的key以及对应的数值，用于开发测试
  detail: IFormDetail[];
}
export interface IFormCreater {
  config: IFormConfig;
  hidemenu: boolean;
  dispatch: Dispatch;
  user: IUserSetting;
  innerTrigger: string;
  setInnerTrigger: React.Dispatch<React.SetStateAction<string>>;
  tabId?: number;
  showHeader?: boolean;
  className?: string;
  ip?: string;
}

function FormCreater({
  config,
  hidemenu,
  dispatch,
  user,
  innerTrigger,
  setInnerTrigger,
  tabId = -1,
  showHeader = true,
  className,
  ip,
}: IFormCreater) {
  // 增加对总分的计算，与scope字段一并处理
  let [state, setState] = useSetState<{
    ignoreIncrese?: boolean;
    [key: string]: any;
  }>();
  let [totalScore, setTotalScore] = useState(100);

  let [editMethod, setEditMethod] = useState('insert');
  let [validateState, setValidateState] = useSetState();

  // 初始化空数据，获取必填字段
  let [fields, setFields] = useState({});
  let [requiredFileds, setRequiredFileds] = useState([]);
  let [calcFields, setCalcFields] = useState([]);

  let [modalVisible, setModalVisible] = useState(false);

  let [formConfig, setFormConfig] = useState(R.clone(config));

  let cfg = R.flatten(R.map(R.prop('detail'))(config.detail));

  // 初始化defaultValue
  /**
   * @wiki https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
   * 处理带function的JSON文件
   */

  const init = async () => {
    let res = await getDefaultList(cfg, ip, R.clone(config.api.init));
    setState(res);
    setFields(res);
  };

  const [qualifyKey, setQualifyKey] = useState(null);

  const [queryKey, setQueryKey] = useState([]);
  const { hash } = useLocation();

  const [calcValid, setCalcValid] = useState({
    key: '',
    status: true,
  });

  const [calcKey, setCalcKey] = useState([]);

  useEffect(() => {
    // config改变后初始化表单数据
    init();
    // console.log('config变更了');

    setCalcKey([]);
    setFormConfig(R.clone(config));
    let requiredFileds = [];
    let nextFields = {};
    let observeKey = null;
    let calcFields = [];

    if (config?.api?.query?.param || config?.api?.update?.param) {
      setQueryKey(R.clone(config.api.query || config.api.update).param);
    }

    let calcKeys = [];

    R.clone(config).detail.forEach(({ detail }) => {
      detail.forEach(item => {
        if (item.rule && 'string' !== typeof item.rule) {
          if (item.rule.required) {
            requiredFileds.push(item.key);
          }

          // 计算校验的字段
          if (item.rule.calc) {
            calcFields.push({
              key: item.key,
              calc: item.rule.calc,
            });
          }
        }

        if (item.calc) {
          calcKeys.push({
            key: item.key,
            calc: item.calc,
          });
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

    // 需要被计算的字段
    setCalcKey(R.map(item => handleCalcKey(item, cfg))(calcKeys));

    // 表示结果是否“合格”的字段
    setQualifyKey(observeKey);

    setFields(nextFields);
    setRequiredFileds(requiredFileds);

    setCalcFields(calcFields);

    setCalcValid({
      key: '',
      status: true,
    });

    dispatch({
      type: 'common/setStore',
      payload: {
        curPageName: config.name,
      },
    });

    reFetch();
    refreshScope();
  }, [JSON.stringify(config)]);

  // 表单字段当前状态判断
  const [formstatus, setFormstatus] = useState(false);

  useEffect(() => {
    if (!Object.keys(state).length) {
      setFormstatus(false);
      return;
    }

    // 必填字段状态校验(需排除掉隐藏的字段)
    let required = validRequire(requiredFileds, hideKeys, state);
    // console.log(requiredFileds, hideKeys, state);

    // 正则处理
    let validStatus = Object.values(validateState).filter(item => !item).length == 0;

    // 单独运算的字段处理
    let calcStatus = validCalcKeys(state, calcFields, R.clone(config), setCalcValid);

    // console.log('数据状态', validStatus, calcFields, config, required, calcStatus);

    setFormstatus(validStatus && required && calcStatus);
  }, [JSON.stringify(state)]);

  // console.log(config, state, '🌸');

  // 对应指标数据范围
  const [scope, setScope] = useState([]);
  const [hideKeys, setHideKeys] = useState([]);

  // 跨页面联动
  // useEffect(() => {
  //   if (!shouldConnect) {
  //     return;
  //   }

  //   setParentConfig({
  //     hide: hideKeys,
  //     scope,
  //   });
  // }, [scope, hideKeys]);

  // useEffect(() => {
  //   if (!shouldConnect) {
  //     return;
  //   }

  //   if (!R.equals(parentConfig.hide, hideKeys)  ) {
  //     setHideKeys(parentConfig.hide);
  //   }

  //   if (!R.equals(parentConfig.scope, scope)  ) {
  //     setScope(parentConfig.scope);
  //   }
  // }, [parentConfig]);

  const shouldRefreshHistoryData = () => {
    let status = formConfig.api?.table?.url?.length > 0;
    if (status) {
      let params = (formConfig.api.table.param || []).filter(item => !hideKeys.includes(item));
      // console.log(params)
      if (params.length > 0) {
        // 根据参数列表取值
        params.forEach(key => {
          let item = state[key] || user[key];
          if (typeof item === 'undefined' || String(item).length === 0) {
            status = false;
          }
        });
      }
    }
    // console.log(status)
    return status;
  };

  // 底部table支持注入查询参数
  const { data: tblData, loading, reFetch } = useFetch({
    param: {
      url: getUrl(formConfig),
      params: R.pick(formConfig?.api?.table?.param || [])({ ...state, ...user }),
    },
    valid: shouldRefreshHistoryData,
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

  // useEffect(() => {
  //   refreshScope();
  // }, [JSON.stringify(config)]);

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
  }, [JSON.stringify(state), JSON.stringify(scope)]);

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

    // 提交数据后，新一轮提交状态默认置为false
    let resetFileds = {};
    requiredFileds.forEach(key => {
      resetFileds[key] = ''; // 先置空，再由其它字段填充
    });

    let nextFields = {
      ...resetFileds,
      ...fields,
      ...prevFileds,
      ...increaseFileds,
    };

    // console.log(nextFields);

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
    // console.log(hideKeys);
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
  }, [JSON.stringify(hideKeys)]);

  const updateScope = ({ scope: nextScope, hide }, handleHideKeys) => {
    let keys = R.map(R.prop('key'))(nextScope);
    let prevScope = R.reject(item => keys.includes(item.key))(scope);
    let nextState = [...prevScope, ...nextScope];

    // 如果nextScope中存在默认选择项，此时清空对应的项
    let changedState = {};
    let status = false;
    nextScope.forEach(item => {
      if (item.defaultOption) {
        changedState[item.key] = '';
        status = true;
      }
    });
    setScope(nextState);

    let _hide = cfg.filter(item => item.hide).map(item => item.key);

    // 🐛:没有hide处理的字段，不应对全局hide的状态进行处理
    if (handleHideKeys) {
      setHideKeys([...hide, ..._hide]);
    }

    if (status) {
      setState(changedState);
    }
  };

  const [formLayout, setFormLayout] = useState(
    window.localStorage.getItem('_formLayout') || 'horizontal'
  );

  // TODO 待测试
  const loadHisData = state => {
    // 还需处理初始时字段隐藏逻辑
    let { hide, scope } = handleDefaultHiddenKeys(cfg, state);
    setState(state);

    // 隐藏字段
    setHideKeys(hide);
    setScope(scope);
    // 可以点击提交
    setFormstatus(true);
  };

  const [outterTrigger, setOutterTrigger] = useState(lib.timestamp());

  return (
    <div>
      {DEV && (
        <CodeDrawer
          formConfig={formConfig}
          setFormConfig={setFormConfig}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}

      <div className={classnames(className, styles.form)}>
        {formConfig.detail.map(({ title: mainTitle = '', detail: detailArr }, idx) => (
          <Card
            title={
              <div>
                {idx === 0 && (
                  <h3 style={{ marginBottom: 0 }}>
                    {formConfig.name}

                    {DEV && (
                      <Icon
                        style={{ paddingLeft: 10 }}
                        type="question-circle-o"
                        onClick={() => setModalVisible(true)}
                      />
                    )}
                  </h3>
                )}

                {mainTitle.length > 0 && (
                  <span style={{ marginTop: 10 }}>
                    {mainTitle}
                    {formConfig.showScore && idx === 0 && (
                      <p>
                        <small>总分：{totalScore}</small>
                      </p>
                    )}
                  </span>
                )}
              </div>
            }
            style={{ marginBottom: 20 }}
            key={idx}
            extra={
              idx == 0 && (
                <>
                  {location.href.includes('&_id=') && (
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

                        let hidemenuUrl = hidemenu ? '&hidemenu=1' : '';
                        let tabid = tabId > -1 ? '&tabid=' + tabId : '';
                        // 关闭载入模式;
                        router.push('#id=' + param.id + hidemenuUrl + tabid);

                        let status = {
                          insert: 'update',
                          update: 'insert',
                        };

                        //注入 _id 字段
                        setState({ _id: param._id });

                        setEditMethod(status[editMethod]);
                      }}
                    />
                  )}

                  {showHeader && (
                    <div>
                      <User user={user} />
                      <Switch
                        checked={formLayout === 'horizontal'}
                        title="输入项布局"
                        checkedChildren="横向布局"
                        unCheckedChildren="纵向布局"
                        onClick={val => {
                          setFormLayout(val ? 'horizontal' : 'vertical');
                          window.localStorage.setItem(
                            '_formLayout',
                            val ? 'horizontal' : 'vertical'
                          );
                        }}
                      />
                    </div>
                  )}
                </>
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
                      calcValid={calcValid}
                      formLayout={formLayout}
                      dev={formConfig.dev}
                      innerTrigger={innerTrigger}
                      ip={ip}
                      setState={res => {
                        if (lib.getType(res) === 'object') {
                          setState(res);
                          return;
                        }

                        if (calcKey.length > 0) {
                          setState(
                            calcResult(
                              {
                                ...state,
                                [key]: res,
                              },
                              calcKey,
                              key
                            )
                          );
                        } else {
                          setState({
                            [key]: res,
                          });
                        }

                        // 如果是“合格”判断的字段，不执行重计算
                        if (key === qualifyKey) {
                          setNeedCalc(false);
                        }
                      }}
                      setFormstatus={setFormstatus}
                      detail={detail}
                      scope={scope}
                      setScope={updateScope}
                      user={user}
                      outterTrigger={outterTrigger}
                    />
                  )
              )}
              {idx === formConfig.detail.length - 1 && (
                <FormAction
                  requiredFileds={requiredFileds}
                  state={state}
                  setState={loadHisData}
                  fields={fields}
                  setEditMethod={setEditMethod}
                  formstatus={formstatus} // 数据校验字段，为false时禁止提交
                  editMethod={editMethod}
                  formConfig={formConfig}
                  config={R.clone(config)}
                  reFetch={() => {
                    reFetch();

                    // 变更此项会导致不必要的重渲染
                    // setInnerTrigger(lib.timestamp());
                  }}
                  remark={remark}
                  onReset={onReset}
                  score={totalScore}
                  hideKeys={hideKeys}
                  tabId={tabId}
                  hidemenu={hidemenu}
                  setOutterTrigger={setOutterTrigger}
                  uid={user.uid}
                  ip={ip}
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
              renderParam={{ tabId }}
              loading={loading}
              merge={false}
            />
          </Card>
        )}
      </div>
    </div>
  );
}

export default connect(({ common: { hidemenu, userSetting: user, ip } }: { common: ICommon }) => ({
  hidemenu,
  user,
  ip,
}))(FormCreater);
