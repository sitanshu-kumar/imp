/**
 *
 * ChangePassword
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import styled from 'styled-components';
import { Form, Input, message } from 'antd';
import makeSelectChangePassword from './selectors';
import reducer from './reducer';
import { PrimaryButton } from '../../commonStyles/general';
import * as api from '../../utils/api';
import { ApiUrls } from '../../utils/apiUrls';
import { getUserId } from '../../utils/authentication';

const StyledForm = styled(Form)``;

const StyledInput = styled(Input)``;
const StyledFormItem = styled(Form.Item)`
  margin-bottom: 16px;
`;

export function ChangePassword(props) {
  useInjectReducer({ key: 'changePassword', reducer });
  // const { getFieldDecorator } = props.form;
  const [form] = Form.useForm();

  const handleSubmit = async values => {
    const userId = await getUserId();
    const [, response] = await api.request(
      'put',
      ApiUrls.changePassword(userId),
      { password: values.password, newPassword: values.newPassword },
    );
    if (response && response.data) {
      message.success('Password has been changed successfully !!');
      form.resetFields();
      props.closeModal();
    } else {
      message.error('The data that you fill is incorrect');
    }
  };

  return (
    <StyledForm form={form} onFinish={handleSubmit}>
      <StyledFormItem
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <StyledInput placeholder="Current password" type="password" />
      </StyledFormItem>

      <StyledFormItem
        name="newPassword"
        rules={[
          { required: true, message: 'Please input your new  password!' },
        ]}
      >
        <StyledInput placeholder="New password" type="password" />
      </StyledFormItem>

      <StyledFormItem
        name="confirm"
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                'The two passwords that you entered do not match!',
              );
            },
          }),
        ]}
      >
        <Input placeholder="Confirm password" type="password" />
      </StyledFormItem>
      <PrimaryButton type="primary" htmlType="submit">
        Change
      </PrimaryButton>
    </StyledForm>
  );
}

ChangePassword.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  // form: PropTypes.any,
  closeModal: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  changePassword: makeSelectChangePassword(),
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
)(ChangePassword);
