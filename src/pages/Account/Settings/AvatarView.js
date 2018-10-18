import React, { Component } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Upload, message, Icon, Button } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import * as util from '@/utils/setting';
import * as db from '@/pages/login/service';
import classNames from 'classnames';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const avatarSize = 256;
@connect(({ common: { userSetting: { uid: _id, username } } }) => ({
  _id,
  username
}))
class AvatarView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      imageUrl: props.avatar,
      src: null,
      image: null,
      crop: {
        x: 10,
        y: 10,
        aspect: 1
      },
      file: null
    };
  }

  loadFile = file => {
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        let src = reader.result;
        this.setState({
          src,
          file: null
        });
      },
      false
    );

    reader.readAsDataURL(file);
  };

  onImageLoaded = image => {
    this.setState({
      image
    });
  };

  onCropComplete = async crop => {
    if (this.state.image) {
      this.getCroppedImg(this.state.image, crop, 'file');
    }
  };

  onCropChange = crop => {
    this.setState({ crop });
  };

  getScaleAxis = ({ naturalWidth, naturalHeight }, { x, y, width, height }) => {
    let cX = parseInt((x * naturalWidth) / 100, 10);
    let cY = parseInt((y * naturalHeight) / 100, 10);
    let cWidth = parseInt((width * naturalWidth) / 100, 10);
    let cHeight = parseInt((height * naturalHeight) / 100, 10);
    return {
      x: cX,
      y: cY,
      width: cWidth,
      height: cHeight
    };
  };

  /**
   * @param {File} image - Image File Object
   * @param {Object} pixelCrop - pixelCrop Object provided by react-image-crop
   * @param {String} fileName - Name of the returned file in Promise
   */
  getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    canvas.width = avatarSize;
    canvas.height = avatarSize;
    const ctx = canvas.getContext('2d');
    let { x, y, width, height } = this.getScaleAxis(image, crop);
    ctx.drawImage(image, x, y, width, height, 0, 0, avatarSize, avatarSize);

    // As Base64 string
    const imageUrl = canvas.toDataURL('image/jpeg');
    this.setState({
      imageUrl
    });

    canvas.toBlob(file => {
      file.name = fileName;
      this.setState({
        file
      });
    }, 'image/jpeg');
  };

  beforeUpload = file => {
    const isIMAGE = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/bmp',
      'image/gif',
      'image/svg+xml'
    ].includes(file.type);
    if (!isIMAGE) {
      message.error(`${file.type}不是当前支持的图片格式`);
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小请勿超过5MB!');
    }

    if (isIMAGE && isLt5M) {
      this.setState(file);
      this.loadFile(file);
    }
    return false;
  };

  handleUpload = () => {
    const { file } = this.state;
    const formData = new FormData();
    formData.append('file', file);
    this.setState({
      loading: true
    });

    db.uploadFile(formData)
      .catch(e => {
        message.error(`头像上传失败`);
      })
      .then(this.refreshAvatar);
  };

  refreshAvatar = async ({ url }) => {
    const avatar = `${util.uploadHost}${url.slice(1)}`;
    this.setState({
      imageUrl: avatar,
      loading: false
    });
    const { _id, username } = this.props;
    const {
      data: [{ affected_rows }]
    } = await db.setSysUser({
      avatar,
      _id,
      username
    });

    if (affected_rows) {
      message.success('个人头像更新成功!');
    }
    // 重新登录，更新用户信息
    db.reLogin(this.props.dispatch);
  };

  handleChange = async info => {
    if (info.file.status === 'loading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      const { response } = info.file;
      this.refreshAvatar(response);
    }
  };

  render() {
    const { imageUrl, src, loading } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const cls = classNames('avatar-uploader', styles.avatar_edit);
    return (
      <div style={{ width: 400 }}>
        <Upload
          name="file"
          listType="picture-card"
          className={cls}
          showUploadList={false}
          action={util.uploadHost}
          beforeUpload={this.beforeUpload}
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
        {src && (
          <ReactCrop
            src={src}
            crop={this.state.crop}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        )}
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={!this.state.file}
          loading={loading}>
          {loading ? '上传中' : '上传头像'}
        </Button>
      </div>
    );
  }
}
export default AvatarView;
