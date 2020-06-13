import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { Input, message, Row, Col, Checkbox, Radio } from 'antd';
import { Form } from '@ant-design/compatible';
import { PrimaryButton } from '../../../commonStyles/general';
import ModuleService from '../../../utils/services/ModuleService';
import CustomSelect from '../../../components/CustomSelect';
import CustomImageRender from '../../../components/CustomImageRender';
import CustomFileUpload from '../../../components/CustomFileUpload';
import AppConstants from '../../../utils/constants';

const { TextArea } = Input;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled(CustomImageRender)`
  width: 100px;
  object-fit: scale-down;
`;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 8px;
`;

const StyledRow = styled(Row)`
  justify-content: space-between;
`;

const CreateForm = props => {
  const { record } = props;
  const { getFieldDecorator, setFieldsValue } = props.form;
    const [subTopicImage, setSubTopicImage] = useState({});
    
    const [inputs, setInputs] = useState({
        isPublished: true,
        // class: [],
        // topicId: [],
        // chapterId: [],
        // appSegments: [],
    });

const [appSegments] = useState(AppConstants.appSegments);
const [editData, setEditData] = useState(false);
    
useEffect(() => {
    if (record && record._id) {
      setInputs(i => ({
        ...i,
          class: record.class,
          topicId: record.topicId,
        chapterId: record.chapterId,
        appSegments: record.appSegments,
        image: record.image && record.image._id,
      }));
      setSubTopicImage(record.image);
      setFieldsValue({
        name: record.name,
        description: record.description,
      });
      setEditData(true);
    } else {
      setEditData(true);
    }
  }, [record]);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields(async (err, values) => {
      const payload = inputs;
      (payload.name = values.name), (payload.description = values.description);
      if (!err) {
        if (record && record._id) {
          props.afterEditSubmit(payload, record._id);
          setEditData(false);
          return;
        }
        const [, response] = await ModuleService.addModule('subtopics', payload);
        if (response && response.data) {
          message.success('Added Successfully !!');
          props.form.resetFields();
          props.onAddSuccess(response.data);
        }
      }
    });
  };

  const afterMediaUploaded = media => {
    setSubTopicImage(media[0]);
    setInputs(i => ({ ...i, image: media[0]._id }));
  };

  const handleModuleSelect = (arr, key) => {
    setInputs(i => ({ ...i, [key]: arr }));
  };

  const onSegmentSelect = checkedValues => {
    setInputs(i => ({ ...i, appSegments: checkedValues }));
    };
    
    // { appSegments: "study" }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <StyledFormItem>
          <label>Name</label>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Enter name' }],
          })(<Input placeholder="Sub Topic Name" />)}
        </StyledFormItem>
        <StyledFormItem>
          <label>Description</label>
          {getFieldDecorator('description', {
            rules: [],
          })(
            <TextArea rows="3" label="Description" placeholder="Description" />,
          )}
        </StyledFormItem>

        {editData && (
          <div>
            <StyledRow>
            <Col span={8}>
                <StyledFormItem>
                  <label>Select Classes</label>
                  <CustomSelect
                    placeholder="Select Classes"
                    module="classes"
                    defaultValue={inputs.class}
                    loadFromApi
                    // mode="multiple"
                    serverKey="_id"
                    showKey="name"
                    afterSelect={arr => handleModuleSelect(arr, 'class')}
                  />
                </StyledFormItem>
                          </Col>
                          
            <Col span={8}>
                <StyledFormItem>
                  <label>Select Topics</label>
                  <CustomSelect
                    placeholder="Select Topics"
                    module="topics"
                    defaultValue={inputs.topicId}
                    loadFromApi
                    // mode="multiple"
                    serverKey="_id"
                    showKey="name"
                    afterSelect={arr => handleModuleSelect(arr, 'topicId')}
                  />
                </StyledFormItem>
              </Col>
                    
            <Col span={8}>
                <StyledFormItem>
                  <label>Select Chapters</label>
                  <CustomSelect
                    placeholder="Select Chapters"
                    module="chapters"
                    defaultValue={inputs.chapterId}
                    loadFromApi
                    // mode="multiple"
                    serverKey="_id"
                    showKey="name"
                    afterSelect={arr => handleModuleSelect(arr, 'chapterId')}
                  />
                </StyledFormItem>
              </Col>
            </StyledRow>

            <StyledFormItem>
              <label style={{ marginRight: '20px' }}>
                Select in which segment it has to show
              </label>
              <Radio.Group
                defaultValue={inputs.appSegments}
                options={appSegments}
                onChange={onSegmentSelect}
              />
            </StyledFormItem>
          </div>
        )}

        <CustomFileUpload
          assetType="image"
          multiple={false}
          buttonText="Upload Icon"
          afterMediaUploaded={afterMediaUploaded}
        />

        <ImageWrapper>
          {subTopicImage && subTopicImage._id && <StyledImage urldata={subTopicImage} />}
        </ImageWrapper>

        <PrimaryButton type="primary" htmlType="submit">
          Submit
        </PrimaryButton>
      </Form>
    </div>
  );
};
CreateForm.propTypes = {
  form: PropTypes.any,
  record: PropTypes.object,
  afterEditSubmit: PropTypes.func,
  onAddSuccess: PropTypes.func,
};

export default compose(
  memo,
  Form.create({ name: 'createSubTopic' }),
)(CreateForm);
