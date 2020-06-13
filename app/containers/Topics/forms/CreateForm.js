import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { Input, message, Row, Col, Checkbox, Form } from 'antd';
// import { Form } from '@ant-design/compatible';
import { PrimaryButton } from '../../../commonStyles/general';
import ModuleService from '../../../utils/services/ModuleService';
import CustomFileUpload from '../../../components/CustomFileUpload';
import CustomImageRender from '../../../components/CustomImageRender';
import CustomSelect from '../../../components/CustomSelect';
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
  //  const { , setFieldsValue } = props.form;
  const [topicImage, setTopicImage] = useState({});
  const [appSegments] = useState(AppConstants.appSegments);
  const [form] = Form.useForm();

  useEffect(() => {
    if (record && record._id) {
      form.setFieldsValue({
        tags: getArrOfIds(record.tags || []),
        interests: getArrOfIds(record.interests || []),
        classes: getArrOfIds(record.classes || []),
        name: record.name,
        description: record.description,
        appSegments: record.appSegments,
        image: record.image && record.image._id,
      });
      setTopicImage(record.image);
    }
  }, [record]);

  const getArrOfIds = arr => {
    const newArr = [];
    arr.forEach(item => {
      newArr.push(item._id);
    });

    return newArr;
  };

  const handleSubmit = async values => {
    // e.preventDefault();
    // props.form.validateFields(async (err, values) => {
    //   if (!err) {
    const payload = {
      name: values.name,
      description: values.description,
      image: values.image,
      tags: values.tags,
      interests: values.interests,
      isPublished: true,
      appSegments: values.appSegments,
      classes: values.classes,
    };
    if (record && record._id) {
      props.afterEditSubmit(payload, record._id);
      return;
    }
    const [, response] = await ModuleService.addModule('topics', payload);
    if (response && response.data) {
      message.success('Added Successfully !!');
      form.resetFields();
      props.onAddSuccess(response.data);
    }
  };
  //   });
  // };

  const afterMediaUploaded = media => {
    setTopicImage(media[0]);
    form.setFieldsValue({ image: media[0]._id });
  };

  const handleModuleSelect = (arr, key) => {
    form.setFieldsValue({ [key]: arr });
  };

  const onSegmentSelect = checkedValues => {
    form.setFieldsValue({ appSegments: checkedValues });
  };

  return (
    <div>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Enter name' }]}
        >
          <Input placeholder="Topic Name" />
        </Form.Item>
        <StyledFormItem name="description">
          <TextArea rows="3" label="Description" placeholder="Description" />
        </StyledFormItem>

        <StyledRow>
          <Col span={8}>
            <StyledFormItem name="tags">
              <CustomSelect
                placeholder="Select Tags"
                module="tags"
                loadFromApi
                mode="multiple"
                serverKey="_id"
                showKey="title"
                afterSelect={arr => handleModuleSelect(arr, 'tags')}
              />
            </StyledFormItem>
          </Col>
          <Col span={8}>
            <StyledFormItem name="interests">
              <CustomSelect
                placeholder="Select Interests"
                module="interests"
                loadFromApi
                mode="multiple"
                serverKey="_id"
                showKey="name"
                afterSelect={arr => handleModuleSelect(arr, 'interests')}
              />
            </StyledFormItem>
          </Col>
          <Col span={8}>
            <StyledFormItem name="classes">
              <CustomSelect
                placeholder="Select Classes"
                module="classes"
                loadFromApi
                mode="multiple"
                serverKey="_id"
                showKey="name"
                afterSelect={arr => handleModuleSelect(arr, 'classes')}
              />
            </StyledFormItem>
          </Col>
        </StyledRow>

        <StyledFormItem
          name="appSegments"
          rules={[
            {
              required: true,
              message: 'Select in which segment it has to show',
            },
          ]}
        >
          <Checkbox.Group options={appSegments} onChange={onSegmentSelect} />
        </StyledFormItem>

        <Form.Item name="image">
          <CustomFileUpload
            assetType="image"
            multiple={false}
            buttonText="Upload Icon"
            afterMediaUploaded={afterMediaUploaded}
          />

          <ImageWrapper>
            {topicImage && topicImage._id && (
              <StyledImage urldata={topicImage} />
            )}
          </ImageWrapper>
        </Form.Item>

        <PrimaryButton type="primary" htmlType="submit">
          Submit
        </PrimaryButton>
      </Form>
    </div>
  );
};
CreateForm.propTypes = {
  // form: PropTypes.any,
  record: PropTypes.object,
  afterEditSubmit: PropTypes.func,
  onAddSuccess: PropTypes.func,
};

export default compose(memo)(CreateForm);
