import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Input, message, Switch } from 'antd';
import { Form } from 'antd';
import ModuleService from '../../../utils/services/ModuleService';
import { PrimaryButton } from '../../../commonStyles/general';

const { TextArea } = Input;

const ContentHide = props => {
  const { record } = props;
  // const { getFieldDecorator } = form;
  const [form] = Form.useForm();

  const handleSubmit = async values => {
    //  e.preventDefault();
    //  props.form.validateFields(async (err, values) => {
    const payload = {
      isHidden: true,
      hiddenReason: values.hiddenReason,
      applyPenalty: values.applyPenalty || false,
    };

    const [error, response] = await ModuleService.updateModule(
      'contents',
      payload,
      record._id,
    );
    if (response && response.data) {
      message.success('Hidden Successfully !!');
      form.resetFields();
      props.afterHideContentSuccess(response.data);
    }
    if (error) {
      message.error(error.message);
    }

  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <p>Are you sure you want to hide this content ? </p>
      <Form.Item label="Reason" name="hiddenReason"
        rules={[]}>
        <TextArea placeholder="Enter reason for hiding" rows="3" />
      </Form.Item>

      <Form.Item label="Apply Penalty" name='applyPenalty'>
        <Switch />
      </Form.Item>

      <PrimaryButton type="primary" htmlType="submit">
        Submit
      </PrimaryButton>
    </Form>
  );
};

ContentHide.propTypes = {
  form: PropTypes.any,
  record: PropTypes.object,
  afterHideContentSuccess: PropTypes.func,
};

export default compose(
  memo
)(ContentHide);
