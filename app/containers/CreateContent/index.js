/* eslint-disable no-underscore-dangle */
/**
 *
 * CreateContent
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
// import { Form } from '@ant-design/compatible';
import {
  Input,
  Radio,
  Row,
  Form,
  Col,
  message,
  notification,
  Modal,
  Button,
  Alert,
  Switch,
} from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { each } from 'lodash';
import { useParams } from 'react-router-dom';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import styled from 'styled-components';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
// import Cropper from 'react-cropper';
import makeSelectCreateContent from './selectors';
import reducer from './reducer';
import saga from './saga';

import colors from '../../utils/colors';
import CustomSelect from '../../components/CustomSelect';
import AppConstants from '../../utils/constants';
import CustomFileUpload from '../../components/CustomFileUpload';
import CustomImageRender from '../../components/CustomImageRender';
import ModuleService from '../../utils/services/ModuleService';

// import 'cropperjs/dist/cropper.css';

export function CreateContent() {
  useInjectReducer({ key: 'createContent', reducer });
  useInjectSaga({ key: 'createContent', saga });
  // const cropper = useRef(null);
  const [topicCriteria, setTopicCriteria] = useState({ appSegments: 'study' });
  const [postTypes] = useState(AppConstants.postTypes);
  const [uploadText, setUploadText] = useState('');
  const [uploadType, setUploadType] = useState('');
  const [assetType, setAssetType] = useState('');
  const [uploadedMedia, setUploadMedia] = useState([]);
  const [thumbnail, setThumbnail] = useState({});
  const [contentDescription, setContentDescription] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [record, setRecordData] = useState({});
  const { id } = useParams();
  const [recordId] = useState(id);
  const [publisherTypes] = useState(AppConstants.publisherTypes);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!recordId && form) {
      form.setFieldsValue({
        appSegment: 'study',
        postType: 'article',
        isPaid: false,
        publisherType: 'creator',
      });
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      const payload = {
        population: JSON.stringify([
          'flashcards',
          'video',
          '3dVideo',
          'vrVideo',
          'thumbnail',
          'class',
          'topicId',
          'chapterId',
          'subtopicId',
        ]),
      };
      const [, response] = await ModuleService.getModule(
        `contents/${recordId}`,
        payload,
      );
      if (response && response.data) {
        const res = response.data;
        form.setFieldsValue({
          appSegment: res.appSegment,
          postType: res.postType,
          detailLink: res.detailLink,
          title: res.title,
          description: res.description,
          isPaid: res.isPaid,
          publisherType: res.publisherType || 'curator',
        });
        setThumbnail(res.thumbnail);
        if (res.postType !== 'article') {
          setUploadMedia(res[res.postType]);
        }
        setRecordData(res);
        setEditorState(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(res.description)),
          ),
        );
      }
    }

    if (recordId) {
      loadData();
    }
  }, [recordId]);

  const handleSubmit = async values => {
    const payload = {};
    if (recordId) {
      payload.title = values.title;
      payload.description = contentDescription || values.description;
    } else {
      payload.postType = values.postType;
      payload.topicId = values.topicId;
      payload.description = contentDescription || values.description;
      payload.title = values.title;
      payload.isAdminCreated = true;
      payload.appSegment = values.appSegment;
      payload.publisherType = values.publisherType;
    }
    payload.isPaid = values.isPaid;

    if (values.detailLink) {
      payload.detailLink = values.detailLink;
    }
    if (values.appSegment === 'study' && !recordId) {
      payload.chapterId = values.chapterId;
      payload.class = values.class;
      payload.subtopicId = values.subtopicId;
    }

    if (uploadedMedia && uploadedMedia.length) {
      const arr = [];
      each(uploadedMedia, item => {
        arr.push(item._id);
      });
      if (values.postType === 'article') {
        payload.articleCover = arr[0];
      } else if (values.postType === 'flashcards') {
        payload.flashcards = arr;
      } else {
        payload[values.postType] = arr[0];
      }
    }
    if (thumbnail && thumbnail._id) {
      payload.thumbnail = thumbnail._id;
      if (values.postType === 'article') {
        payload.articleCover = thumbnail._id;
      }
    }
    if (payload.description === '') {
      delete payload.description;
    }

    if (recordId) {
      const [error, response] = await ModuleService.updateModule(
        'contents',
        payload,
        recordId,
      );
      if (response && response.data) {
        notification.success({
          message: 'Updated Successfully',
        });
      }

      if (error) {
        message.error(error.message);
      }
    } else {
      // add content
      const [error, response] = await ModuleService.addModule(
        'contents',
        payload,
      );

      if (response && response.data) {
        notification.success({
          message: 'Created Successfully',
        });
        form.setFieldsValue({
          description: '',
          detailLink: '',
          title: '',
        });
        setUploadMedia([]);
        setThumbnail('');
        setEditorState(EditorState.createEmpty());
      }
      if (error) {
        message.error(error.message);
      }
    }
  };

  const handleClassSelect = classId => {
    form.setFieldsValue({
      class: classId,
    });
    topicCriteria.classes = classId;
    setTopicCriteria({ ...topicCriteria });
  };
  const handleTopicSelect = topicId => {
    form.setFieldsValue({
      topicId,
    });
  };
  const onEditorStateChange = state => {
    setEditorState(state);
    setContentDescription(draftToHtml(convertToRaw(state.getCurrentContent())));
  };

  const afterMediaUploaded = arr => {
    setUploadMedia(arr);
  };

  const afterThumbnailUploaded = arr => {
    setThumbnail(arr[0]);
  };

  const handleEmbedFile = arr => {
    const url = arr[0].baseUrl + arr[0].name;
    Modal.info({
      title: 'Upload Successful !! Copy this url and add into image Url',
      content: (
        <div>
          <p>{url}</p>
        </div>
      ),
      onOk() {},
    });
  };

  const test = e => {
    const postType = e.target.value;
    let text = '';
    let type = '';
    let asset = '';
    switch (postType) {
      case 'article':
        text = 'Upload Cover';
        type = 'image';
        asset = 'image';
        break;
      case 'video':
        text = 'Upload Video';
        type = 'video';
        asset = 'video';
        break;

      case 'flashcards':
        text = 'Upload FlashCards';
        type = 'image';
        asset = 'image';
        break;
      case '3dVideo':
        text = 'Upload 3D Video';
        type = '3dVideo';
        asset = 'file';
        break;
      case 'vrVideo':
        text = 'Upload VR Video';
        type = 'vrVideo';
        asset = 'video';
        break;
      default:
        text = 'Upload Cover';
        type = 'image';
        asset = 'image';
    }
    setUploadText(text);
    setUploadType(type);
    setAssetType(asset);
  };

  const showCropper = () => {};

  return (
    <div>
      <Helmet>
        <title>CreateContent</title>
        <meta name="description" content="Description of CreateContent" />
      </Helmet>
      <StyledFormWrapper>
        <Form onFinish={handleSubmit} form={form} name="create-form">
          <CenterDiv>
            <Form.Item label="Select segment" name="appSegment">
              <Radio.Group buttonStyle="solid" disabled={!!recordId}>
                <Radio.Button value="study">Study</Radio.Button>
                <Radio.Button value="explore">Discover</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </CenterDiv>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="Select segment"
                name="publisherType"
                rules={[{ required: true, message: 'Select Publisher Type' }]}
              >
                <Radio.Group
                  name="publisherType"
                  options={publisherTypes}
                  disabled={!!recordId}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item shouldUpdate>
                {() => (
                  <Form.Item
                    label="Select Post Type"
                    name="postType"
                    rules={[{ required: true, message: 'Select Post Type' }]}
                  >
                    <Radio.Group
                      name="radiogroup"
                      disabled={!!recordId}
                      onChange={e => test(e)}
                    >
                      {postTypes.map(item => (
                        <Radio value={item.value}>{item.label}</Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item shouldUpdate>
                {() => (
                  <Form.Item label="Paid Content ?" name="isPaid">
                    <Switch
                      checked={!!form.getFieldValue('isPaid')}
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                    />
                  </Form.Item>
                )}
              </Form.Item>
            </Col>
          </Row>

          {record && record._id && (
            <Row gutter={24}>
              {record.class && <Col span={6}>Class : {record.class.name}</Col>}
              <Col span={6}>Topic : {record.topicId.name}</Col>
              {record.chapterId && (
                <Col span={6}>Chapter : {record.chapterId.name}</Col>
              )}
              {record.subtopicId && (
                <Col span={6}>SubTopic : {record.subtopicId.name}</Col>
              )}
            </Row>
          )}

          {!recordId && (
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item shouldUpdate>
                  {() =>
                    form.getFieldValue('appSegment') === 'study' && (
                      <Form.Item
                        label="Select Classes"
                        name="class"
                        rules={[{ required: true, message: 'Select Class' }]}
                      >
                        <CustomSelect
                          placeholder="Select Classes"
                          module="classes"
                          loadFromApi
                          serverKey="_id"
                          showKey="name"
                          afterSelect={arr => handleClassSelect(arr)}
                        />
                      </Form.Item>
                    )
                  }
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item shouldUpdate>
                  {() => (
                    <Form.Item
                      label="Select Topics/Subjects"
                      name="topicId"
                      rules={[{ required: true, message: 'Select Topics' }]}
                    >
                      <CustomSelect
                        placeholder="Select Topics"
                        criteria={{
                          classes: form.getFieldValue('class'),
                          appSegments: form.getFieldValue('appSegment'),
                        }}
                        module="topics"
                        loadFromApi
                        serverKey="_id"
                        showKey="name"
                        afterSelect={item => handleTopicSelect(item)}
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item shouldUpdate>
                  {() =>
                    form.getFieldValue('appSegment') === 'study' &&
                    form.getFieldValue('topicId') && (
                      <Form.Item
                        label="Select Chapter"
                        name="chapterId"
                        rules={[{ required: true, message: 'Select Chapter' }]}
                      >
                        <CustomSelect
                          placeholder="Select Chapter"
                          criteria={{
                            topicId: form.getFieldValue('topicId'),
                            classes: form.getFieldValue('class'),
                          }}
                          module="chapters"
                          loadFromApi
                          serverKey="_id"
                          showKey="name"
                          afterSelect={item =>
                            form.setFieldsValue({ chapterId: item })
                          }
                        />
                      </Form.Item>
                    )
                  }
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item shouldUpdate>
                  {() =>
                    form.getFieldValue('appSegment') === 'study' &&
                    form.getFieldValue('chapterId') && (
                      <Form.Item
                        label="Select Sub Topic"
                        name="subtopicId"
                        rules={[
                          { required: true, message: 'Select Sub topics' },
                        ]}
                      >
                        <CustomSelect
                          placeholder="Select Sub Topic"
                          criteria={{
                            chapterId: form.getFieldValue('chapterId'),
                            topicId: form.getFieldValue('topicId'),
                            class: form.getFieldValue('class'),
                          }}
                          module="subtopics"
                          loadFromApi
                          serverKey="_id"
                          showKey="name"
                          afterSelect={item =>
                            form.setFieldsValue({ subtopicId: item })
                          }
                        />
                      </Form.Item>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          )}

          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Enter Title' }]}
          >
            <Input placeholder="Title" />
          </Form.Item>

          <Form.Item label="Link" name="detailLink">
            <Input placeholder="Link" />
          </Form.Item>

          <Form.Item label="Content" name="description">
            <StyledEditor
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorStateChange}
              toolbarCustomButtons={[
                <CustomFileUpload
                  type="image"
                  buttonText="Get Image Url"
                  showButton
                  afterMediaUploaded={handleEmbedFile}
                  assetType="image"
                />,
              ]}
            />
          </Form.Item>

          <Form.Item shouldUpdate>
            {() =>
              form.getFieldValue('postType') !== 'article' && (
                <Form.Item>
                  <CustomFileUpload
                    type={uploadType}
                    multiple={form.getFieldValue('postType') === 'flashcards'}
                    buttonText={uploadText}
                    afterMediaUploaded={afterMediaUploaded}
                    assetType={assetType}
                    isCropper={form.getFieldValue('postType') === 'flashcards'}
                  />
                </Form.Item>
              )
            }
          </Form.Item>

          <Form.Item shouldUpdate>
            {() =>
              uploadedMedia &&
              !!uploadedMedia.length && (
                <StyledImageWrapper>
                  {uploadedMedia.map(item =>
                    form.getFieldValue('postType') === 'flashcards' ? (
                      <StyledImage urldata={item} key={item._id} />
                    ) : (
                      <Alert
                        message={`${item.name} uploaded/added successfully !!`}
                        type="success"
                      />
                    ),
                  )}
                </StyledImageWrapper>
              )
            }
          </Form.Item>

          <StyledImageWrapper showInStart>
            <Form.Item>
              <CustomFileUpload
                type="image"
                buttonText="Add Thumbnail"
                afterMediaUploaded={afterThumbnailUploaded}
                assetType="image"
              />
            </Form.Item>
            {thumbnail && thumbnail._id && (
              <StyledThumbnail urldata={thumbnail} />
            )}
          </StyledImageWrapper>

          <CenterDiv>
            <StyledButton type="primary" htmlType="submit">
              Submit
            </StyledButton>
          </CenterDiv>
        </Form>
      </StyledFormWrapper>
    </div>
  );
}

CreateContent.propTypes = {
  uploadType: PropTypes.string,
  assetType: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  createContent: makeSelectCreateContent(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CreateContent);

const StyledFormWrapper = styled.div`
  background-color: ${colors.white};
  padding: 20px;
`;

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props =>
    props.showInStart ? 'flex-start' : 'space-around'};
  flex-wrap: wrap;
`;

const StyledImage = styled(CustomImageRender)`
  width: 200px;
  object-fit: contain;
  margin-bottom: 20px;
`;

const StyledThumbnail = styled(CustomImageRender)`
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 20px;
  margin-left: 20px;
`;

const StyledEditor = styled(Editor)`
  width: 80%;
  margin: auto;
`;

const StyledButton = styled(Button)`
  background-color: ${colors.primaryColor};
  border-color: ${colors.primaryColor};
  height: 40px;
  min-width: 200px;
  &:hover,
  &:active,
  &:focus {
    background-color: ${colors.primaryInteractionColor};
    border-color: ${colors.primaryInteractionColor};
  }
`;
