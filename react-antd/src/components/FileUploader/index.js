import React from 'react';
import {Upload, Icon, Modal, message, Button, Tooltip} from 'antd';
import globalConfig from '../../config.js';
import Utils from '../../utils';
import Logger from '../../utils/Logger.js';
import './index.less';

const logger = Logger.getLogger('FileUploader');

/**
 * 
 */
class FileUploader extends React.Component {

  state = {
    previewVisible: false, 
    previewImage: '', 
    fileList: [],  
  };

  componentWillMount() {
    const {defaultValue, max, url, type} = this.props;
    const forImage = type === 'image';
    if (forImage) {
      this.listType = 'picture-card';  
    } else {
      this.listType = 'text';  
    }

    this.forceUpdateStateByValue(defaultValue, max);

    if (url) {
      if (url.startsWith('http')) {
        this.uploadUrl = url;
      } else {
        this.uploadUrl = `${globalConfig.getAPIPath()}${url}`;
      }
    } else {
      this.uploadUrl = `${globalConfig.getAPIPath()}${forImage ? globalConfig.upload.image : globalConfig.upload.file}`;  // 默认上传接口
    }

    if (this.props.sizeLimit) {
      this.sizeLimit = this.props.sizeLimit;
    } else {
      if (forImage) {
        this.sizeLimit = globalConfig.upload.imageSizeLimit;
      } else {
        this.sizeLimit = globalConfig.upload.fileSizeLimit;
      }
    }

    if (this.props.accept) {
      this.accept = this.props.accept;
    } else if (forImage) {
      this.accept = '.jpg,.png,.gif,.jpeg';  
    }

    logger.debug('type = %s, upload url = %s, sizeLimit = %d, accept = %s', type, this.uploadUrl, this.sizeLimit, this.accept);

    this.forImage = forImage;
  }

  componentWillReceiveProps(nextProps) {

    if (this.needRender(nextProps)) {
      const {value, max} = nextProps;
      this.forceUpdateStateByValue(value, max);
    }
  }

  /**
   *
   * @param nextProps
   * @returns {boolean}
   */
  needRender(nextProps) {
    const {value} = nextProps;
    if (!value) {  
      return true;
    }

    const fileArray = this.state.fileList.filter(file => file.status === 'done');
    if (Utils.isString(value)) {
      if (fileArray.length !== 1 || value !== fileArray[0].url) {  
        return true;
      }
    }
    else if (value instanceof Array) {
      if (value.length !== fileArray.length) {
        return true;
      }
      for (let i = 0; i < value.length; i++) {
        if (value[i] !== fileArray[i].url) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * 
   *
   * @param value
   * @param max
   */
  forceUpdateStateByValue(value, max) {
    this.state.fileList.length = 0;
    if (Utils.isString(value) && value.length > 0) {
      this.state.fileList.push({
        uid: -1,
        name: value.substr(value.lastIndexOf('/') + 1),  
        status: 'done',
        url: value,
      });
    } else if (value instanceof Array) {
      if (max === 1 && value.length > 0) {
        this.state.fileList.push({
          uid: -1,
          name: value[0].substr(value[0].lastIndexOf('/') + 1),
          status: 'done',
          url: value[0],
        });
      } else {
        for (let i = 0; i < value.length; i++) {
          this.state.fileList.push({
            uid: -1 - i,
            name: value[i].substr(value[i].lastIndexOf('/') + 1),
            status: 'done',
            url: value[i],
          });
        }
      }
    }
  }

  /**
   * 
   *
   * @param file
   * @returns {boolean}
   */
  beforeUpload = (file) => {
    if (this.sizeLimit) {
      if (file.size / 1024 > this.sizeLimit) {
        message.error(`${this.forImage ? 'Image' : 'File'}exceed，Maximum is ${this.sizeLimit}KB`);
        return false;
      }
    }

    return true;
  };

  /**
   * 
   *
   * @param file
   */
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  /**
   * 
   */
  handleCancel = () => this.setState({previewVisible: false});

  /**
   * 
   *
   * @param fileList
   */
  handleChange = ({file, fileList}) => {
    for (const tmp of fileList) {
      if (tmp.status === 'done' && !tmp.url && tmp.response && tmp.response.success) {
        tmp.url = tmp.response.data;  
      }
    }

    if (file.status === 'error') {
      if (globalConfig.debug) {
        message.info(`debug mode testing${this.forImage ? 'Image' : 'File'}`, 2.5);
        fileList.push({
          uid: Date.now(),
          name: this.forImage ? 'avatar.jpg' : 'mapreduce-osdi04.pdf',
          status: 'done',
          url: this.forImage ? 'http://jxy.me/about/avatar.jpg' : 'https://static.googleusercontent.com/media/research.google.com/zh-CN//archive/mapreduce-osdi04.pdf',
        });
        this.notifyFileChange();
      } else {
        message.error(`${file.name}上传失败`, 2.5);
      }
    }
    else if (file.status === 'done' || file.status === 'removed') {
      this.notifyFileChange();
    }
    this.setState({fileList});

  };

  /**
   * 
   */
  notifyFileChange = () => {
    const {onChange, max} = this.props;

    if (onChange) {
      let res;
      if (max === 1) {
        if (this.state.fileList.length > 0 && this.state.fileList[0].status === 'done') {
          res = this.state.fileList[0].url;
        } else {
          res = '';
        }
      } else {
        res = this.state.fileList.filter(file => file.status === 'done').map(file => file.url); 
      }

      onChange(res);
    }
  };

  /**
   * 
   */
  renderUploadButton() {
    const {fileList} = this.state;
    const disabled = fileList.length >= this.props.max;

    if (this.forImage) {
      const button = (<div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload Image</div>
      </div>);
      if (disabled) {
        return null;
      }
      if (this.props.placeholder) {
        return <Tooltip title={this.props.placeholder} mouseLeaveDelay={0}>
          {button}
        </Tooltip>;
      } else {
        return button;
      }
    } else {
      const button = <Button disabled={disabled}><Icon type="upload"/> Upload</Button>;
      if (this.props.placeholder && !disabled) {
        return <Tooltip title={this.props.placeholder} mouseLeaveDelay={0}>
          {button}
        </Tooltip>;
      } else {
        return button;
      }
    }
  }


  render() {
    const {previewVisible, previewImage, fileList} = this.state;

    return (
      <div>
        <Upload
          action={this.uploadUrl}
          listType={this.listType}
          fileList={fileList}
          onPreview={this.forImage ? this.handlePreview : undefined}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
          accept={this.accept}
          withCredentials={globalConfig.isCrossDomain()}
        >
          {this.renderUploadButton()}
        </Upload>
        {this.forImage &&
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="Image load failed" style={{ width: '100%' }} src={previewImage}/>
        </Modal>}
      </div>
    );
  }

}

FileUploader.propTypes = {
  max: React.PropTypes.number.isRequired,  
  sizeLimit: React.PropTypes.number,  
  onChange: React.PropTypes.func,  
  defaultValue: React.PropTypes.oneOfType([  
    React.PropTypes.string,
    React.PropTypes.array,
  ]),
  value: React.PropTypes.oneOfType([  
    React.PropTypes.string,
    React.PropTypes.array,
  ]),
  url: React.PropTypes.string, 
  type: React.PropTypes.string,  
  accept: React.PropTypes.string, 
  placeholder: React.PropTypes.string, 
};

FileUploader.defaultProps = {
  max: 1, 
};

export default FileUploader;
