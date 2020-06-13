import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { Input, message, Row, Col, Form, InputNumber } from 'antd';
// import { Form } from '@ant-design/compatible';
import { PrimaryButton } from '../../../commonStyles/general';
import ModuleService from '../../../utils/services/ModuleService';
import CustomSelect from '../../../components/CustomSelect';
import CustomImageRender from '../../../components/CustomImageRender';
import CustomFileUpload from '../../../components/CustomFileUpload';

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
// const CreateForm = props => {
export function CreateForm(props) {
  const { record } = props;
  // const { form } = props;

  // const { getFieldDecorator, setFieldsValue } = form;
  const [topicCriteria, setTopicCriteria] = useState({});
  const [subTopicImage, setSubTopicImage] = useState({});
  const [orderAdd, setOrderAdd] = useState({});
  // const [inputs, setInputs] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    if (record && record._id) {
      setSubTopicImage(record.image);
       setOrderAdd(record.orderKey);
      form.setFieldsValue({
        orderKey: record.orderKey,
        name: record.name,
        description: record.description,
        class: record.class && record.class._id,
        topicId: record.topicId && record.topicId._id,
        chapterId: record.chapterId && record.chapterId._id,
        image: record.image && record.image._id,
      });
    }
  }, [record]);

  const handleSubmit = async values => {
    // e.preventDefault();
    // props.form.validateFields(async (err, values) => {
    // if (!err) {
    const payload = {
      orderKey: values.orderKey,
      name: values.name,
      description: values.description,
      topicId: values.topicId,
      chapterId: values.chapterId,
      class: values.class,
      image: values.image,
    };
    if (record && record._id) {
      props.afterEditSubmit(payload, record._id);

      return;
    }
    const [, response] = await ModuleService.addModule('subtopics', payload);
    if (response && response.data) {
      message.success('Added Successfully !!');
      form.resetFields();
      props.onAddSuccess(response.data);
    }
  };
  //   });
  // };

  const handleClassSelect = arr => {
    form.setFieldsValue({
      class: arr,
    });
    topicCriteria.classes = { $in: arr };
    setTopicCriteria({ ...topicCriteria });
  };

  const maxNo = value => {
    form.setFieldsValue(value);
  };
  const onChange = value => {
    console.log('changed', value);
  };

  const afterMediaUploaded = media => {
    setSubTopicImage(media[0]);
    form.setFieldsValue({ image: media[0]._id });
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

        <StyledFormItem
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Enter name' }]}
        >
          <Input placeholder="Sub Topic Name" />
        </StyledFormItem>
        <StyledFormItem label="Description" name="description" rules={[]}>
          <TextArea rows="3" label="Description" placeholder="Description" />
        </StyledFormItem>

        <div>
          <StyledRow>
            <Col span={8}>
              <StyledFormItem
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
              </StyledFormItem>
            </Col>

            <Col span={8}>
              <StyledFormItem
                dependencies={['class']}
                label="Select Subject/Topic"
                name="topicId"
                rules={[{ required: true, message: 'Select Subject/Topic' }]}
              >
                <CustomSelect
                  placeholder="Select Subject/Topic"
                  criteria={{
                    classes: form.getFieldValue('class'),
                  }}
                  module="topics"
                  loadFromApi
                  serverKey="_id"
                  showKey="name"
                  afterSelect={item => form.setFieldsValue({ topicId: item })}
                />
              </StyledFormItem>
            </Col>

            <Col span={8}>
              <Form.Item shouldUpdate>
                {() =>
                  (<StyledFormItem
                    dependencies={['topicId']}
                    label="Select Chapter"
                    name="chapterId"
                    rules={[{ required: true, message: 'Select Chapter' }]}
                  >
                    <CustomSelect
                      placeholder="Select Chapter"
                      criteria={{
                        topicId: form.getFieldValue('topicId'),
                      }}
                      module="chapters"
                      loadFromApi
                      serverKey="_id"
                      showKey="name"
                      afterSelect={item => form.setFieldsValue({ chapterId: item })}
                    />
                  </StyledFormItem>)
                }

              </Form.Item>

            </Col>
          </StyledRow>
        </div>

        <Form.Item name="image" rules={[]}>
          <CustomFileUpload
            assetType="image"
            multiple={false}
            buttonText="Upload Icon"
            afterMediaUploaded={afterMediaUploaded}
          />

          <ImageWrapper>
            {subTopicImage && subTopicImage._id && (
              <StyledImage urldata={subTopicImage} />
            )}
          </ImageWrapper>
        </Form.Item>

        <PrimaryButton type="primary" htmlType="submit">
          Submit
        </PrimaryButton>
      </Form>
    </div>
  );
}
CreateForm.propTypes = {
  // form: PropTypes.any,
  record: PropTypes.object,
  afterEditSubmit: PropTypes.func,
  onAddSuccess: PropTypes.func,
};
export default compose(memo)(CreateForm);
