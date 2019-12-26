import React, { useState, useEffect } from 'react';
import { Col, Button, Popconfirm, notification } from 'antd';
import { validRequire, getPostData, onValidate } from './lib';
import { axios } from '@/utils/axios';
import * as R from 'ramda';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { connect } from 'dva';

function formAction({
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
}) {
  // 当前数据提交状态，提交时禁止重复提交
  const [submitting, setSubmitting] = useState(false);

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
      if (data.length === 0) {
        return;
      }

      // 去除空格
      let res = data[0];
      Object.keys(res).map(key => {
        res[key] = res[key].trim();
      });
      formInstance.set(res);

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
      let result = onValidate(val, (cfgItem && cfgItem.rule) || {});

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
    onReset();
  };

  // 根据索引字段删除数据，建议用至少一个字段作为索引，推荐用_id(需在查询中一并附带)
  const onDelete = async () => {
    let { api } = config;
    if (!api || !api.delete || !api.delete.param) {
      return;
    }
    let { param, url } = api.delete;
    let params = R.pick(param, state);
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
    let status = validRequire(requiredFileds, state);
    if (!status) {
      notification.error({
        message: '系统提示',
        description: '必填字段校验失败',
      });
    }

    let params = formInstance.get();
    let axiosConfig = getPostData({ config, params, editMethod: editType, uid });
    console.log('插入/更新数据', axiosConfig);

    setSubmitting(true);
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
    formConfig.api.query.param.forEach(key => {
      if (state[key] === '' || R.isNil(state[key])) {
        valid = false;
      }
    });
    setShouldLoad(valid);
  }, [formConfig, state]);

  return (
    <Col span={24} className={styles.submit}>
      {formConfig.api && formConfig.api.query && (
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
          type="danger"
          onClick={() => onsubmit()}
          disabled={!formstatus}
          style={{ marginLeft: 20 }}
          loading={submitting}
        >
          {formatMessage({ id: 'form.update' })}
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
          <Button
            type="danger"
            disabled={!formstatus}
            style={{ marginLeft: 20 }}
            loading={submitting}
          >
            {formatMessage({ id: 'form.delete' })}
          </Button>
        </Popconfirm>
      )}
    </Col>
  );
}

export default connect(({ common: { userSetting } }) => ({
  uid: userSetting.uid,
}))(formAction);
