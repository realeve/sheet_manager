import React, { Component } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Upload, message, Icon } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import * as util from '@/utils/setting';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isIMAGE = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/bmp',
    'image/gif',
    'image/svg'
  ].includes(file.type);
  if (!isIMAGE) {
    message.error(`${file.type}不是当前支持的图片格式`);
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('图片大小请勿超过5MB!');
  }
  return isIMAGE && isLt5M;
}

@connect(({ common: { userSetting } }) => ({
  userSetting
}))
class AvatarView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      imageUrl: props.avatar
    };
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      const { response } = info.file;
      const { url } = response;
      this.setState({
        imageUrl: `${util.uploadHost}${url.slice(1)}`,
        loading: false
      });
      // Get this url from response in real world.
      // getBase64(info.file.originFileObj, imageUrl =>
      //   this.setState({
      //     imageUrl,
      //     loading: false
      //   })
      // );
    }
  };

  render() {
    const { imageUrl } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={util.uploadHost}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}>
        {imageUrl ? (
          <>
            <div className={styles.avatar_title}>
              <FormattedMessage
                id="app.settings.basic.avatar"
                defaultMessage="Change avatar"
              />
            </div>
            <div className={styles.avatar}>
              <img src={imageUrl} alt="avatar" />
            </div>
          </>
        ) : (
          uploadButton
        )}
      </Upload>
    );
  }
}
export default AvatarView;
