/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';

import styled from 'styled-components';
import { Layout } from 'antd';
import Login from '../Login/Loadable';
import SignUp from '../SignUp/Loadable';
import ForgotPassword from '../ForgotPassword/Loadable';
import ResetPassword from '../ResetPassword/Loadable';
import UserNotification from '../UserNotification/Loadable';
import Dashboard from '../Dashboard/Loadable';
import Users from '../Users/Loadable';

import NotFoundPage from '../NotFoundPage/Loadable';

import GlobalStyle from '../../global-styles';
import { getAuthenticationToken } from '../../utils/authentication';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Topics from '../Topics/Loadable';
import SubTopics from '../SubTopics/Loadable';
import Interests from '../Interests/Loadable';
import Tags from '../Tags/Loadable';
import Classes from '../Classes/Loadable';
import Chapters from '../Chapters/Loadable';
import Contents from '../Contents/Loadable';
import CreateContent from '../CreateContent/Loadable';
import ViewContent from '../ViewContent/Loadable';

const { Sider, Content } = Layout;

const StyledContainer = styled.div``;

const StyledContent = styled(Content)`
  min-height: 100vh;
`;
const PagesContent = styled.div`
  padding-top: 70px;
`;

export default function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Login} />
        <AuthRoute path="/auth/log-in">
          <Login />
        </AuthRoute>
        <Route path="/auth/sign-up" component={SignUp} />
        <Route path="/auth/forgot-password" component={ForgotPassword} />
        <Route path="/auth/set-new-password" component={ResetPassword} />
        <PrivateRoute path="/dashboard">
          <Dashboard />
        </PrivateRoute>
        <PrivateRoute path="/users">
          <Users />
        </PrivateRoute>
        <PrivateRoute path="/topics">
          <Topics />
        </PrivateRoute>
        <PrivateRoute path="/subtopics">
          <SubTopics />
        </PrivateRoute>
        <PrivateRoute path="/interests">
          <Interests />
        </PrivateRoute>
        <PrivateRoute path="/tags">
          <Tags />
        </PrivateRoute>
        <PrivateRoute path="/classes">
          <Classes />
        </PrivateRoute>
        <PrivateRoute path="/chapters">
          <Chapters />
        </PrivateRoute>
        <PrivateRoute path="/userNotification">
          <UserNotification />
        </PrivateRoute>
        <PrivateRoute path="/contents" exact>
          <Contents />
        </PrivateRoute>
        <PrivateRoute path="/contents/create" exact>
          <CreateContent />
        </PrivateRoute>
        <PrivateRoute path="/contents/:id/view" exact>
          <ViewContent />
        </PrivateRoute>

        <PrivateRoute path="/contents/:id/edit" exact>
          <CreateContent />
        </PrivateRoute>
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </div>
  );
}

function AuthRoute({ children, ...rest }) {
  const isAuthenticated = getAuthenticationToken();
  // (async () => {
  //   isAuthenticated = await
  // })();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          <Redirect
            to={{
              pathname: '/dashboard',
              state: { from: location },
            }}
          />
        ) : (
          children
        )
      }
    />
  );
}

AuthRoute.propTypes = {
  children: PropTypes.any,
};

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  const isAuthenticated = getAuthenticationToken();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          <StyledContainer>
            <Layout>
              <Sider theme="light" width="15%">
                <Sidebar />
              </Sider>
              <StyledContent>
                <Navbar />
                <PagesContent>{children}</PagesContent>
              </StyledContent>
            </Layout>
          </StyledContainer>
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
PrivateRoute.propTypes = {
  children: PropTypes.any,
};
