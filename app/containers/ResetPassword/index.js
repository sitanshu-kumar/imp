/**
 *
 * ResetPassword
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import { Layout, Input, message } from 'antd';
import { Form } from '@ant-design/compatible';
import styled from 'styled-components';
import reducer from './reducer';
import makeSelectResetPassword from './selectors';
import colors from '../../utils/colors';
import * as api from '../../utils/api';
import { ApiUrls } from '../../utils/apiUrls';
import SplashLogo from '../../components/SplashLogo';
import { CardLayout, PrimaryButton } from '../../commonStyles/general';

const queryString = require('query-string');

const StyledLayout = styled(Layout)`
  background-color: ${colors.offWhite};
  min-height: 100vh;
`;
const StyledWrapper = styled.div`
  width: 414px;
  margin: auto;
`;
const StyledCard = styled(CardLayout)``;
const StyledForm = styled(Form)``;

const StyledInput = styled(Input)``;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 16px;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 30px;
`;

export function ResetPassword(props) {
  useInjectReducer({ key: 'resetPassword', reducer });
  const { getFieldDecorator } = props.form;
  const [userId, setUserId] = useState('');
  const [searchValues] = useState(queryString.parse(props.location.search));
  useEffect(() => {
    if (searchValues && searchValues.id) {
      setUserId(searchValues.id);
    }
  }, []);

  const compareToFirstPassword = (rule, value, callback) => {
    const { form } = props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields(async (err, values) => {
      if (!err) {
        const [, response] = await api.request(
          'get',
          ApiUrls.resetPassword(userId, values.password),
        );
        if (response && response.status === 'ok') {
          message.success('Password has been set.');
        } else {
          message.error('Something went wrong');
        }
      }
    });
  };

  return (
    <StyledLayout>
      <StyledWrapper>
        <ImageWrapper>
          <SplashLogo width="100px" />
        </ImageWrapper>

        <StyledCard
          size="small"
          title={<div style={{ textAlign: 'center' }}>Set a new password</div>}
        >
          <StyledForm onSubmit={handleSubmit}>
            <StyledFormItem>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please input your password!' },
                ],
              })(<StyledInput placeholder="New password" type="password" />)}
            </StyledFormItem>

            <StyledFormItem>
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  {
                    validator: compareToFirstPassword,
                  },
                ],
              })(<Input placeholder="Password confirmation" type="password" />)}
            </StyledFormItem>
            <PrimaryButton type="primary" htmlType="submit">
              Save
            </PrimaryButton>
          </StyledForm>
        </StyledCard>
      </StyledWrapper>
    </StyledLayout>
  );
}

ResetPassword.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  form: PropTypes.any,
  location: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  resetPassword: makeSelectResetPassword(),
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
  Form.create({ name: 'resetPassword' }),
)(ResetPassword);
