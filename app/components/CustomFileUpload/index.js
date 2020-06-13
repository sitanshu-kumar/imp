/**
 *
 * CustomFileUpload
 *
 */

import React, { memo, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { each } from 'lodash';
import styled from 'styled-components';
import { Spin, Alert, message, Modal, Button } from 'antd';
import { Icon } from '@ant-design/compatible';
import { UploadOutlined } from '@ant-design/icons';
import * as api from '../../utils/api';
import { ApiUrls } from '../../utils/apiUrls';
import { PrimaryButton } from '../../commonStyles/general';
import CropperView from './cropper';

const StyledPrimaryButton = styled(PrimaryButton)`
  padding: 5px;
  margin-bottom: 20px;
`;

function CustomFileUpload(props) {
  const {
    multiple,
    assetType,
    buttonText,
    type,
    showButton,
    sendDirectFile,
  } = props;
  const [loading, setLoading] = useState(false);
  const [isCropper, setIsCropper] = useState(props.isCropper);
  const [uploadedMediaArr, setUploadedMediaArr] = useState([]);
  const [cropperModalVisible, setCropperModalVisible] = useState(false);
  const inputFile = useRef(null);
  const [selectedFileToCrop, setSelectedFileToCrop] = useState('');

  useEffect(() => {
    setIsCropper(props.isCropper);
  }, [props.isCropper]);

  // useEffect(() => {
  //   if (props.assetType) {
  //     inputFile.current.click();
  //   }
  // }, [props.assetType, props.toggle]);

  function onAddFile(evt) {
    setLoading(true);
    const { files } = evt.target;
    each(files, data => {
      handleUpload(data);
    });
  }

  // const validateFile = file => {
  //   console.log('check in file');

  //   const video = document.createElement('video');
  //   video.preload = 'metadata';

  //   video.onloadedmetadata = () => {
  //     window.URL.revokeObjectURL(video.src);

  //     console.log(video.duration, '====video.duartion');

  //     if (video.duration < 1) {
  //       console.log('Invalid Video! video is less than 1 second');
  //     }
  //   };

  //   video.src = URL.createObjectURL(file);
  // };

  const showModal = () => {
    setCropperModalVisible(true);
  };
  const handleOk = () => {
    setCropperModalVisible(false);
    // this.setState({
    //   ModalText: 'The modal will be closed after two seconds',
    //   confirmLoading: true,
    // });
    // setTimeout(() => {
    //   this.setState({
    //     visible: false,
    //     confirmLoading: false,
    //   });
    // }, 2000);
  };

  async function handleUpload(file, skipCropingModal) {
    // validateFile(file);

    if (isCropper && !skipCropingModal) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFileToCrop(reader.result);
      };

      reader.readAsDataURL(file);
      showModal();
      return;
    }

    if (sendDirectFile) {
      props.handleDirectFile(file);
      setLoading(false);
      return;
    }
    const formData = new FormData();

    if (isCropper) {
      formData.append('file', file);
      formData.append('fileType', 'image');
      formData.append('fileName', `${new Date().getTime()}.png`);
    } else {
      formData.append('file', file);
      formData.append('type', type || 'image');
    }

    const [error, response] = await api.upload(
      'post',
      isCropper ? ApiUrls.mediaUploadBase64 : ApiUrls.mediaUpload,
      formData,
      true,
    );
    if (response && response.data) {
      setLoading(false);
      response.data.file = file;
      uploadedMediaArr.push(response.data);
      if (multiple) {
        props.afterMediaUploaded([...uploadedMediaArr]);
        setUploadedMediaArr([...uploadedMediaArr]);
      } else {
        props.afterMediaUploaded([response.data]);
        setUploadedMediaArr([response.data]);
      }
    }

    if (error) {
      message.error(error.message);
      setLoading(false);
    }
    // if (uploadedMediaArr.length === mediaCount) {
    //   setLoading(false);
    //   props.afterMediaUploaded(uploadedMediaArr);
    // }
  }

  const onCroppedFileData = async file => {
    handleOk();

    handleUpload(file, true);
  };

  const getAssetTypes = types => {
    if (Array.isArray(types)) return types.reduce((a, b) => `${b}/*,${a}`, '');
    return types ? `${assetType}/*` : '';
  };

  return (
    <div>
      {!showButton && (
        <StyledUploadWrapper onClick={() => inputFile.current.click()}>
          <Icon type="plus" />

          <div>{buttonText || `Upload`}</div>
        </StyledUploadWrapper>
      )}
      {showButton && (
        <StyledPrimaryButton
          icon={<UploadOutlined />}
          onClick={() => inputFile.current.click()}
        >
          {buttonText || `Upload`}
        </StyledPrimaryButton>
      )}
      <input
        style={{ display: 'none' }}
        type="file"
        id="fileInput"
        ref={inputFile}
        onChange={evt => onAddFile(evt)}
        multiple={multiple}
        accept={getAssetTypes(assetType)}
      />
      {loading && (
        <Spin tip="Loading...">
          <Alert
            message="Uploading File"
            description="Please wait while we upload."
            type="info"
          />
        </Spin>
      )}
      {isCropper && (
        <Modal
          title="Title"
          visible={cropperModalVisible}
          // onOk={handleOk}
          // confirmLoading={confirmLoading}
          onCancel={handleOk}
          footer={[
            <Button key="cancel" onClick={handleOk}>
              Cancel
            </Button>,
            // <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
            //   Submit
            // </Button>,
          ]}
        >
          <CropperView
            onBase64Data={onCroppedFileData}
            file={selectedFileToCrop}
          />
        </Modal>
      )}
    </div>
  );
}

CustomFileUpload.propTypes = {
  multiple: PropTypes.bool,
  afterMediaUploaded: PropTypes.func,
  assetType: PropTypes.any,
  buttonText: PropTypes.string,
  type: PropTypes.string,
  showButton: PropTypes.bool,
  sendDirectFile: PropTypes.bool,
  handleDirectFile: PropTypes.func,
  isCropper: PropTypes.bool,
};

export default memo(CustomFileUpload);

const StyledUploadWrapper = styled.div`
  border: 1px dashed #bbb;
  padding: 30px;
  width: 200px;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
  flex-wrap: wrap;
`;
