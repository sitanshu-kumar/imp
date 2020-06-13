/**
 *
 * Navbar
 *
 */
/* eslint-disable-next-line anchor-is-valid */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Dropdown, Menu, Modal, Avatar } from 'antd';
import { withRouter } from 'react-router';
import colors from '../../utils/colors';
import {
  clearUserId,
  clearAuthenticationToken,
} from '../../utils/authentication';
import ChangePassword from '../../containers/ChangePassword';
import { UserOutlined } from '@ant-design/icons';

const { Header } = Layout;

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  width: 85%;
  z-index: 100;
  margin-bottom: 24px;
`;

const StyledHeader = styled(Header)`
  padding-right: 24px;
  flex-direction: row;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 70px;
  &.ant-layout-header {
    background: ${colors.white};
  }
`;

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const AvatarIcon = styled(Avatar)`
  background-color: ${colors.secondaryGrey};
  cursor: pointer;
`;
const StyledMenuItem = styled(Menu.Item)`
  padding: 8px 70px 8px 12px;
`;

function Navbar(props) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    clearAuthenticationToken();
    clearUserId();
    props.history.push('/');
  };

  const showChangePassword = () => {
    setModalVisible(true);
  };

  const handleToggle = () => {
    setModalVisible(!modalVisible);
  };
  const menu = (
    <Menu>
      <StyledMenuItem key="0" onClick={showChangePassword}>
        Change Password
      </StyledMenuItem>
      <StyledMenuItem key="1" onClick={handleLogout}>
        Log out
      </StyledMenuItem>
    </Menu>
  );
  return (
    <StyledWrapper>
      <StyledHeader>
        <RightWrapper>
          <Dropdown overlay={menu}>
            <AvatarIcon size={40} icon={<UserOutlined />} />
          </Dropdown>
        </RightWrapper>
      </StyledHeader>
      <Modal
        title="Change Password"
        visible={modalVisible}
        onCancel={handleToggle}
        footer={null}
        width={400}
      >
        <ChangePassword closeModal={handleToggle} />
      </Modal>
    </StyledWrapper>
  );
}

Navbar.propTypes = {
  history: PropTypes.any,
};

export default withRouter(memo(Navbar));
