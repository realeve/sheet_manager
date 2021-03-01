import React, { useState, useEffect } from 'react';
import { useSetState } from 'react-use';
import { Row, Button, notification, Upload, Spin, Progress, Tabs } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import qs from 'qs';
import useFetch from '@/components/hooks/useFetch';
import * as lib from '@/utils/lib';
import { connect } from 'dva';
import moment from 'moment';
import * as R from 'ramda';
import TableSheet from '../excel/tablesheet';
import styles from './index.less';
import XLSX from 'xlsx';
import { Form, post, ICallbackData, IExcelForm, callback, handleSubmit } from '../excel';

// http://localhost:8000/form/excel?hidemenu=1&id=./data/finance/print_cost.json
const Index = ({ location }) => {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    let res: { id?: string } = qs.parse(window.location.hash.slice(1));
    setUrl(res.id || '');
  }, [location.hash]);

  // 增加对总分的计算，与scope字段一并处理
  let [state, setState] = useSetState<{
    [key: string]: any;
  }>({});

  // 是否需要写入数据
  const [needinsert, setNeedinsert] = useState(true);

  const { data: option } = useFetch<IExcelForm>({
    param: { url },
    valid: () => url.length > 0,
    callback: e => {
      let isUnmounted = false;
      let res = callback(e);
      res.detail &&
        res.detail.forEach(item => {
          if (item.type === 'datepicker') {
            if (!isUnmounted) {
              setState({ [item.key]: moment().format(item.datetype || 'YYYY-MM-DD') });
            }
          } else if (item.type === 'datepicker.month') {
            if (!isUnmounted) {
              setState({ [item.key]: moment().format(item.datetype || 'YYYY-MM') });
            }
          } else if (item.type === 'datepicker.year') {
            if (!isUnmounted) {
              setState({ [item.key]: moment().format(item.datetype || 'YYYY') });
            }
          }
        });
      isUnmounted = true;
      return res;
    },
  });

  const [result, setResult] = useState<{ title: string; data: any[][] }[]>([]);

  const decode = (src: string[][], tabName: string = '') => {
    let data = R.clone(src);
    // 忽略数据
    if (option?.omitLine > 0) {
      data = R.slice(option.omitLine, src.length)(src);
    }

    return post({ url: option.callback, data, extra: state })
      .then((res: ICallbackData) => {
        // 需要前端处理数据提交
        if (typeof res.affected_rows == 'undefined') {
          setNeedinsert(true);
          return;
        }

        setNeedinsert(false);
        // 服务端处理数据提交
        notification.success({
          message: '系统提示',
          description: `${tabName} 数据提交${res.affected_rows > 0 ? '成功' : '失败'}`,
        });
      })
      .catch(e => {
        notification.success({
          message: '系统提示',
          description: `${tabName} 数据提交失败`,
        });
      });
  };

  // 前台处理数据上传
  const upload = async () => {
    if (!needinsert) {
      return;
    }
    if (!option?.api?.insert) {
      console.error({
        message: '系统提示',
        description: '未配置数据提交接口',
        option,
      });
      return;
    }

    setUploading(true);
    setUploadStatus('active');

    result.forEach(async ({ data }, idx) => {
      let form = data.map(row => row.map(item => ({ ...item, ...state })));
      // 调用上传
      let res = 0;
      for (let idx = 0; idx < form.length; idx++) {
        res += await handleSubmit({
          params: { values: form[idx] },
          url: option.api.insert[idx],
          idx,
        }).catch(e => {
          console.error('数据提交出现错误', form, res);
          setUploadStatus('exception');
          return 0;
        });
      }
      setPercent(Number((((idx + 1) * 100) / result.length).toFixed(0)));
    });
    setUploading(false);
    if (uploadStatus == 'active') setUploadStatus('success');
  };

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [percent, setPercent] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'success' | 'active' | 'normal' | 'exception'>(
    'active'
  );

  const handleResult = async res => {
    if (typeof option.decimal === 'undefined') {
      setResult(res);
      return;
    }

    res = res.map(item => {
      item.data = item.data.map(row =>
        row.map(td => {
          // 只处理浮点数
          if (lib.isFloat(td)) {
            return td.toFixed(option.decimal);
          }
          // 移除换行符
          return String(td).replace(/\r|\n/g, '');
        })
      );
      return item;
    });
    setResult(res);
    console.log('数据解析结果：', res);
  };

  const manualUpload = async () => {
    let res = R.clone(result);
    for (let i = 0; i < res.length; i++) {
      await decode(res[i].data, res[i].title).catch(e => {
        setUploadStatus('exception');
        console.error(e);
        return 0;
      });

      // 进度条更新
      setPercent(Number((((i + 1) * 100) / res.length).toFixed(0)));
    }
    setUploading(false);
    if (uploadStatus == 'active') setUploadStatus('success');
  };

  return (
    <Form data={option} state={state} setState={setState} dev={option?.dev}>
      <div className={styles.uploadWrapper}>
        <Upload.Dragger
          showUploadList={false}
          accept=".xlsx,.xls"
          style={{ padding: 10 }}
          beforeUpload={file => {
            setLoading(true);
            lib
              .loadDataFile(file)
              .then(buffer => {
                if (!buffer) {
                  setLoading(false);
                  return;
                }

                let workbook = XLSX.read(buffer, { type: 'array' });
                let res = [];

                workbook.SheetNames.forEach(sheetName => {
                  let roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
                  if (roa.length) {
                    res.push({
                      title: sheetName,
                      data: roa,
                    });
                  }
                });
                handleResult(res);
                setLoading(false);
              })
              .catch(e => {
                notification.error({
                  message: '文件解析错误',
                  description: '错误信息:' + e.message,
                });
              });
            return false;
          }}
        >
          <Spin tip="文件解析中..." spinning={loading}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text"> {option?.desc || '点击或拖拽文件到这里上传数据'}</p>
            <p className="ant-upload-hint">只支持上传xlsx及xls格式文件</p>
          </Spin>
          {uploading && <Progress percent={percent} size="small" status={uploadStatus} />}
        </Upload.Dragger>
      </div>

      <Row style={{ marginTop: 15 }}>
        <Button
          style={{ marginLeft: 15 }}
          disabled={result.length === 0}
          type="primary"
          onClick={manualUpload}
        >
          数据上传
        </Button>
      </Row>

      <Row style={{ marginTop: 15 }}>
        <Tabs type="line" tabPosition="bottom" className={styles.formTab}>
          {result.map(({ title, data }) => (
            <Tabs.TabPane tab={title} key={title} style={{ width: '100%' }}>
              {
                <TableSheet
                  data={{
                    data,
                    rows: data.length,
                    hash: (data[1] || [''])[0],
                  }}
                  sheetHeight={700}
                />
              }
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Row>
    </Form>
  );
};

export default connect()(Index);
