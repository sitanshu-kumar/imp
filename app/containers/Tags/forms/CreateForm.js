import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {  Input, message, Form } from 'antd';
// import { Form } from '@ant-design/compatible';
import { PrimaryButton } from '../../../commonStyles/general';
import ModuleService from '../../../utils/services/ModuleService';

const CreateForm = props => {
  const { record } = props;
  const [form] = Form.useForm();
  // const { getFieldDecorator, setFieldsValue } = props.form;

  useEffect(() => {
    if (record && record._id) {
      form.setFieldsValue({
        title: record.title,
      });
    }
  }, [record]);

  const handleSubmit = async values => {
    // e.preventDefault();
    // props.form.validateFields(async (err, values) => {
    //   if (!err) {
        if (record && record._id) {
          props.afterEditSubmit(values, record._id);
          return;
        }
        const [, response] = await ModuleService.addModule('tags', {
          title: values.title,
        });
        if (response && response.data) {
          message.success('Added Successfully !!');
          form.resetFields();
          props.onAddSuccess(response.data);
        }
      }
  //   });
  // };

  return (
    <div>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item name="title"
          
            rules= {[{ required: true, message: 'Please input title' }]}>
          <Input placeholder="Tag Name" />
        </Form.Item>
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
)(CreateForm);
