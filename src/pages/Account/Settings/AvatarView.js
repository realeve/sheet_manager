import React, { Component } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Upload, Button, message, Icon } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
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
    console.log(info);
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false
        })
      );
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
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="//jsonplaceholder.typicode.com/posts/"
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
