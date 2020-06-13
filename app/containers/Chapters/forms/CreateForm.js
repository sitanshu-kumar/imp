import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Input, message, Form, InputNumber } from 'antd';
// import { Form } from '@ant-design/compatible';
import styled from 'styled-components';
import { PrimaryButton } from '../../../commonStyles/general';
import ModuleService from '../../../utils/services/ModuleService';
import CustomSelect from '../../../components/CustomSelect';
import CustomImageRender from '../../../components/CustomImageRender';
import CustomFileUpload from '../../../components/CustomFileUpload';

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled(CustomImageRender)`
  width: 100px;
  object-fit: scale-down;
`;

const CreateForm = props => {
  const { record } = props;
  // const { getFieldDecorator, setFieldsValue } = props.form;
  const [topicImage, setTopicImage] = useState({});
  const [orderAdd, setOrderAdd] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    if (record && record._id) {
      const arr = [];
      if (record.classes && record.classes.length) {
        record.classes.forEach(item => {
          arr.push(item._id);
        });
      }

      // if (record.orderKey > 0 || !record.orderkey) {
      //   setOrderAdd(record.orderKey);
      // }

    
      setOrderAdd(record.orderKey);
      form.setFieldsValue({
        orderKey: record.orderKey,
        name: record.name,
        topicId: record.topicId && record.topicId._id,
        image: record.image && record.image._id,
        classes: arr,
        // topicId: record.topicId,
      });
      
      if (record.image) {
        setTopicImage(record.image);
      }
    }
  }, [record]);

  const handleSubmit = async values => {
    if (record && record._id) {
      props.afterEditSubmit(values, record._id);
      return;
    }
    const [, response] = await ModuleService.addModule('chapters', values);
    if (response && response.data) {
      message.success('Added Successfully !!');
      form.resetFields();
      props.onAddSuccess(response.data);
    }
  };

  const maxNo = value => {
    form.setFieldsValue(value);
  };

  const onChange = value => {
    console.log('changed', value);
  };

  const handleTopicSelect = item => {
    form.setFieldsValue({
      topicId: item,
    });
  };
  const handleClassSelect = arr => {
    form.setFieldsValue({
      classes: arr,
    });
  };

  const afterMediaUploaded = media => {
    setTopicImage(media[0]);
    form.setFieldsValue({
      image: media[0]._id,
    });
  };

  return (
    <div>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          label="Order key"
          name="orderKey"
          rules={[{ required: true, message: 'Please enter order key' }]}
        >
          <InputNumber
            type="number"
            // onkeydown="javascript: return event.keyCode == 69 ? false : true"
            onKeyDown={evt =>
              ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
            }
            min={0}
            max={maxNo}
            defaultValue={3}      
            onChange={onChange}
          />
          {/* <Input placeholder="Order key" /> */}
        </Form.Item>

        <Form.Item
          label="Chapter Name"
          name="name"
          rules={[{ required: true, message: 'Please input name' }]}
        >
          <Input placeholder="Chapter Name" />
        </Form.Item>

        <Form.Item
          label="Select Classes"
          name="classes"
          rules={[{ required: true, message: 'Select Classes' }]}
        >
          <CustomSelect
            placeholder="Select Classes"
            mode="multiple"
            module="classes"
            loadFromApi
            serverKey="_id"
            showKey="name"
            afterSelect={arr => handleClassSelect(arr)}
          />
        </Form.Item>

        <Form.Item
          label="Select Subject/Topic"
          name="topicId"
          rules={[{ required: true, message: 'Select Subject/Topic' }]}
        >
          <CustomSelect
            placeholder="Select Subject/Topic"
            module="topics"
            loadFromApi
            serverKey="_id"
            showKey="name"
            afterSelect={item => handleTopicSelect(item)}
          />
        </Form.Item>

        <Form.Item
          name="image"
          rules={[{ required: true, message: 'Select Icon' }]}
        >
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
  record: PropTypes.object,
  afterEditSubmit: PropTypes.func,
  onAddSuccess: PropTypes.func,
};

export default compose(memo)(CreateForm);
