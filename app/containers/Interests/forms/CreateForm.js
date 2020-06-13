import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Input, message, Form } from 'antd';
// import { Form } from '@ant-design/compatible';
import { PrimaryButton } from '../../../commonStyles/general';
import ModuleService from '../../../utils/services/ModuleService';

const CreateForm = props => {
  const { record } = props;
  // const { getFieldDecorator, setFieldsValue } = props.form;
  const [form] = Form.useForm();

  useEffect(() => {
    if (record && record._id) {
      form.setFieldsValue({
        name: record.name,
      });
    }
  }, [record]);

  const handleSubmit = async values => {
    // e.preventDefault();
    // props.form.validateFields(async (err, values) => {
    // if (!err) {
    if (record && record._id) {
      props.afterEditSubmit(values, record._id);
      return;
    }
    const [, response] = await ModuleService.addModule('interests', {
      name: values.name,
    });
    if (response && response.data) {
      message.success('Added Successfully !!');
      form.resetFields();
      props.onAddSuccess(response.data);
    }
  };
  //   });
  // };

  return (
    <div>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input Interest Name' }]}
        >
          <Input placeholder="Interest Name" />
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

export default compose(
  memo,
)(CreateForm);
