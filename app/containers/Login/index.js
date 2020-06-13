import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectReducer } from 'utils/injectReducer';
import { Layout, Input, message, Form } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
// import { Form } from '@ant-design/compatible';
import reducer from './reducer';
import makeSelectLogin from './selectors';
import colors from '../../utils/colors';
import * as api from '../../utils/api';
import { ApiUrls } from '../../utils/apiUrls';
import SplashLogo from '../../components/SplashLogo';
import { setAuthenticationToken, setUserId } from '../../utils/authentication';
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
const StyledButton = styled(PrimaryButton)`
  margin-top: 16px;
`;
const StyledFormItem = styled(Form.Item)`
  margin-bottom: 16px;
`;
const StyledTag = styled(Link)`
  font-size: 12px;
  display: flex;
  justify-content: flex-end;
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
export function Login(props) {
  useInjectReducer({ key: 'login', reducer });

  const history = useHistory();

  const [form] = Form.useForm();
  const { getFieldDecorator } = form;

  const handleSubmit = async values => {
    // e.preventDefault();
    // form.validateFields(async (err, values) => {
    // if (!err) {
    const [error, response] = await api.request('post', ApiUrls.login(), {
      email: values.email,
      password: values.password,
    });
    if (error) {
      message.error(error.message);
    }
    if (response && response.data) {
      setAuthenticationToken(response.data.token);
      setUserId(response.data._id);
      history.push('/dashboard');
    }
    // }
    // });
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
              <div style={{ textAlign: 'center' }}>Log in to ImpactAll</div>
            }
          >
            <Form form={form} onFinish={handleSubmit}>
              <StyledFormItem
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                ]}
              >
                <StyledInput placeholder="Email" />
              </StyledFormItem>
              <StyledFormItem
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                <StyledInput placeholder="Password" type="password" />
              </StyledFormItem>
              {/* <StyledTag to="/auth/forgot-password">
                Forgot your password?
              </StyledTag> */}
              <StyledButton type="primary" htmlType="submit">
                Log In
              </StyledButton>
            </Form>
          </StyledCard>
          <StyledDiv>
            <StyledPText>Don't have an account? </StyledPText>
            <StyledHrefTag to="/auth/sign-up"> Sign up</StyledHrefTag>
          </StyledDiv>
        </StyledWrapper>
      </StyledLayout>
    </div>
  );
}
Login.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  // form: PropTypes.any,
};
const mapStateToProps = createStructuredSelector({
  login: makeSelectLogin(),
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
)(Login);
