/**
 *
 * SignUp
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import { Layout, Input} from 'antd';
import { Form } from '@ant-design/compatible';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import reducer from './reducer';
import makeSelectSignUp from './selectors';
import colors from '../../utils/colors';
// import * as api from '../../utils/api';
// import { ApiUrls } from '../../utils/apiUrls';
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

export function SignUp(props) {
  useInjectReducer({ key: 'signUp', reducer });
  const { getFieldDecorator } = props.form;

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
        // const [, response] = await api.request(
        //   'get',
        //   ApiUrls.register(values.email, values.password),
        // );
        // if (response) {
        // }
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
          title={
            <div style={{ textAlign: 'center' }}>
              Create your Impact All account
            </div>
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
            <StyledFormItem>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please input your password!' },
                ],
              })(<StyledInput placeholder="Password" type="password" />)}
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
              })(<Input placeholder="Confirm Password" type="password" />)}
            </StyledFormItem>
            <PrimaryButton type="primary" htmlType="submit">
              Register
            </PrimaryButton>
          </StyledForm>
        </StyledCard>
        <StyledDiv>
          <StyledPText>Already have an account? </StyledPText>{' '}
          <StyledHrefTag to="/">Log in</StyledHrefTag>
        </StyledDiv>
      </StyledWrapper>
    </StyledLayout>
  );
}

SignUp.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  form: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  signUp: makeSelectSignUp(),
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
  Form.create({ name: 'signup' }),
)(SignUp);
