import React, { useState, useEffect } from 'react';
import { Col, Button, Popconfirm, notification } from 'antd';
import { validRequire, getPostData, onValidate } from './lib';
import { axios } from '@/utils/axios';
import * as R from 'ramda';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { connect } from 'dva';
import { useLocation } from 'react-use';
import qs from 'qs';
import router from 'umi/router';
import * as lib from '@/utils/lib';

export default ({
  fields,
  requiredFileds,
  uid,
  setEditMethod,
  formstatus,
  editMethod,
  state,
  setState,
  formConfig,
  config,
  reFetch,
  remark,
  onReset: resetForm, //重置
  score, // 总分
  hideKeys,
  tabId = -1,
  hidemenu,
  setOutterTrigger,
}) => {
  const [_id, setId] = useState(0);
  // 当前数据提交状态，提交时禁止重复提交
  const [submitting, setSubmitting] = useState(false);
  const { hash } = useLocation();
  useEffect(() => {
    let { api } = config;

    // 载入历史数据
    if (!api.load || !api.load.url) {
      return;
    }

    let param = qs.parse(hash.slice(1));
    if (!param._id) {
      setId(0);
      return;
    }

    // tabid 不一致时，退出
    param.tabid = R.isNil(param.tabid) ? -1 : param.tabid;
    if (param.tabid != tabId) {
      return;
    }

    setId(param._id);

    // 如果有 id
    setLoadOption({
      url: api.load.url,
      params: { _id: param._id, uid },
    });
  }, [hash]);

  const formInstance = {
    set(data) {
      // 设置表单初始数据
      setState(data);
    },
    get() {
      // 获取初始数据
      return {
        ...fields,
        ...state,
        remark: remark + ' ' + (state.remark || ''),
        score, //总分
      };
    },
    reset: () => {
      resetForm();
      // 重置编辑状态
      setEditMethod('insert');
    },
  };

  let [loadOption, setLoadOption] = useState({ url: null, params: {} });

  useEffect(() => {
    if (!loadOption.url) {
      return;
    }

    axios(loadOption).then(({ data }) => {
      notification.success({
        message: '系统提示',
        description: '历史数据载入成功.',
      });
      if (data.length === 0) {
        return;
      }

      // 去除空格
      let res = data[0];
      Object.keys(res).map(key => {
        // console.log(res[key]);
        res[key] = res[key] ? String(res[key]).trim() : '';
        if (lib.isFloat(res[key])) {
          res[key] = Number(res[key]); //.toFixed(2);
        }
      });
      formInstance.set(res);

      // 已完成数据加载
      setOutterTrigger(lib.timestamp());

      setEditMethod('update');
    });
  }, [loadOption.params]);

  const onReset = () => {
    formInstance.reset();
  };

  // 索引字段(通过校验后)改变时，如车号等，载入初始数据用于更新
  const loadHistoryData = async () => {
    // 历史数据载入
    let { api } = formConfig;
    // if (!api || !api.query) {
    //   return;
    // }
    let { param, url } = api.query;
    if (!param) {
      return;
    }
    // 如果不存在 query或没有param时（无查询主键）返回
    let params = R.pick(param)(state);
    if (Object.keys(params).length !== param.length) {
      // 观测参数未设置完全
      return;
    }

    // 查询参数不变更时禁止提交查询
    if (R.equals(params, loadOption.params)) {
      return;
    }

    // 判断观测参数是否满足正则要求
    let valid = true;
    let cfg = R.flatten(R.map(R.prop('detail'))(config.detail));

    param.forEach(key => {
      // 值
      let val = state[key];
      // 配置项
      let cfgItem = R.find(R.propEq('key', key))(cfg);

      // 是否为有效值
      let result = onValidate(val, cfgItem?.rule || {});

      if (!result) {
        valid = false;
      }
    });

    if (!valid) {
      return;
    }

    // 数据满足要求，发起请求

    let option = {
      url,
      params,
    };
    setLoadOption(option);
  };

  const notity = affected_rows => {
    if (affected_rows == 0) {
      notification.error({
        message: '系统提示',
        description: '提交失败.',
      });
    }
    notification.success({
      message: '系统提示',
      description: '提交成功.',
    });

    let { api } = config;
    onReset();

    // 载入历史数据
    if (!api.load || !api.load.url) {
      return;
    }

    let param = qs.parse(hash.slice(1));
    if (!param._id) {
      return;
    }

    let hidemenuUrl = hidemenu ? '&hidemenu=1' : '';
    let tabid = tabId > -1 ? '&tabid=' + tabId : '';
    // 关闭载入模式;
    router.push('#id=' + param.id + hidemenuUrl + tabid);
  };

  // 根据索引字段删除数据，建议用至少一个字段作为索引，推荐用_id(需在查询中一并附带)
  const onDelete = async () => {
    let { api } = config;
    if (!api || !api.delete || !api.delete.param) {
      return;
    }
    let { param, url } = api.delete;
    let params = R.pick(param, state);
    params = {
      ...params,
      _id,
      uid,
    };
    let {
      data: [affected_rows],
    } = await axios({ url, params });
    console.log('删除数据', { url, params });
    notity(affected_rows);
    reFetch && reFetch();
  };

  // 提交数据
  const onsubmit = async (editType = editMethod) => {
    if (submitting) {
      return;
    }

    // 必填数据是否填写
    let status = validRequire(requiredFileds, hideKeys, state);
    if (!status) {
      notification.error({
        message: '系统提示',
        description: '必填字段校验失败',
      });
      return;
    }

    let params = formInstance.get();

    // 注入_id，uid信息，支持用户信息调整
    params = {
      ...params,
      _id,
      uid,
    };

    let axiosConfig = getPostData({ config, params, editMethod: editType, uid });
    console.log('插入/更新数据', axiosConfig);

    if (!axiosConfig) {
      notification.error({
        message: '系统提示',
        description: '数据写入接口未配置',
      });
      return;
    }

    setSubmitting(true);

    // console.log(axiosConfig);

    // notification.success({
    //   message: 'tips',
    //   description: '数据提交测试中',
    // });
    // return;

    let {
      data: [{ affected_rows }],
    } = await axios(axiosConfig).finally(() => {
      setSubmitting(false);
    });

    notity(affected_rows);

    reFetch && reFetch();
  };

  const [shouldLoad, setShouldLoad] = useState(false);
  useEffect(() => {
    if (!formConfig.api.query || !formConfig.api.query.param) {
      setShouldLoad(false);
      return;
    }
    let valid = true;

    // 2020/3/18 数据载入时不必要求字段必须显示
    formConfig.api.query.param.forEach(key => {
      if (!hideKeys.includes(key) && (state[key] === '' || R.isNil(state[key]))) {
        valid = false;
      }
    });

    setShouldLoad(valid);
  }, [formConfig, state]);

  return (
    <Col span={24} className={styles.submit}>
      {formConfig?.api?.query && (
        <Button type="primary" onClick={() => loadHistoryData()} disabled={!shouldLoad}>
          载入历史数据
        </Button>
      )}
      <Button
        type="default"
        onClick={() => onReset()}
        style={{ marginLeft: 20 }}
        disabled={!formstatus}
      >
        {formatMessage({ id: 'form.reset' })}
      </Button>
      {editMethod === 'update' ? (
        <Button
          danger
          onClick={() => onsubmit()}
          disabled={!formstatus}
          style={{ marginLeft: 20 }}
          loading={submitting}
        >
          {formatMessage({ id: 'form.update' }) + '当前数据'}
        </Button>
      ) : (
        <Button
          type="primary"
          onClick={() => onsubmit('insert')}
          disabled={!formstatus}
          style={{ marginLeft: 20 }}
          loading={submitting}
        >
          {formatMessage({ id: 'form.submit' })}
        </Button>
      )}

      {formConfig.api.delete && formConfig.api.delete.url && (
        <Popconfirm
          title="确定删除本条数据?"
          onConfirm={() => onDelete()}
          okText="是"
          cancelText="否"
        >
          <Button danger disabled={!formstatus} style={{ marginLeft: 20 }} loading={submitting}>
            {formatMessage({ id: 'form.delete' })}
          </Button>
        </Popconfirm>
      )}

      {formConfig?.api?.print?.url && (
        <Button
          type="primary"
          style={{ marginLeft: 20 }}
          onClick={() => {
            let uidParam = uid != '' ? `&uid=${uid}` : '';
            window.open(formConfig.api.print.url + uidParam, '_blank');
          }}
        >
          打印填写记录
        </Button>
      )}
    </Col>
  );
};
