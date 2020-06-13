/**
 *
 * ForgotPassword
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import styled from 'styled-components';
import { Layout, Input, message } from 'antd';
import { Form } from '@ant-design/compatible';
import { Link } from 'react-router-dom';
import saga from './saga';
import colors from '../../utils/colors';
import * as api from '../../utils/api';
import { ApiUrls } from '../../utils/apiUrls';
import SplashLogo from '../../components/SplashLogo';
import { CardLayout, PrimaryButton } from '../../commonStyles/general';

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

const StyledDiv = styled.div`
  margin-top: 25px;
  text-align: center;
`;
const StyledPText = styled.p`
  display: inline-block;
  font-size: 12px;
`;
const StyledHrefTag = styled(Link)`
  font-size: 12px;
`;
const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 30px;
`;

export function ForgotPassword(props) {
  useInjectSaga({ key: 'forgotPassword', saga });
  const { getFieldDecorator } = props.form;

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields(async (err, values) => {
      if (!err) {
        const [, response] = await api.request(
          'get',
          ApiUrls.forgotPassword(values.email),
        );
        if (response) {
          if (response.status === 'error') {
            message.error('Email is not registered.');
          } else if (response.status === 'email_sent') {
            message.success('Email has been sent to set new password');
          }
        }
      }
    });
  };

  return (
    <div>
      <StyledLayout>
        <StyledWrapper>
          <ImageWrapper>
            <SplashLogo width="100px" />
          </ImageWrapper>
          <StyledCard
            size="small"
            title={
              <div style={{ textAlign: 'center' }}>Reset your password</div>
            }
          >
            <StyledForm onSubmit={handleSubmit}>
              <StyledFormItem>
                {getFieldDecorator('email', {
                  rules: [
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    },
                    { required: true, message: 'Please input your email!' },
                  ],
                })(<StyledInput placeholder="Email" />)}
              </StyledFormItem>
              <PrimaryButton type="primary" htmlType="submit">
                Reset Password
              </PrimaryButton>
            </StyledForm>
          </StyledCard>
          <StyledDiv>
            <StyledPText>Already have an account? </StyledPText>{' '}
            <StyledHrefTag to="/">Log in</StyledHrefTag>
          </StyledDiv>
        </StyledWrapper>
      </StyledLayout>
    </div>
  );
}

ForgotPassword.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  form: PropTypes.any,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
  Form.create({ name: 'forgot-password' }),
)(ForgotPassword);
