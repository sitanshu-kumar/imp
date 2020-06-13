/**
 *
 * Sidebar
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import SplashLogo from '../SplashLogo';
const BrandWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  padding: 8px 0;
`;

const { SubMenu } = Menu;

function Sidebar() {
  return (
    <div>
      <BrandWrapper>
        <SplashLogo width="60px" />
      </BrandWrapper>
      <Menu
        mode="inline"
        theme="light"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        style={{ height: '100%' }}
      >
        <Menu.Item>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>

        <Menu.Item>
          <Link to="/users">Users</Link>
        </Menu.Item>

        <MenuItem>
          <Link to="/classes">Classes</Link>
        </MenuItem>
        <SubMenu title={<span>Key Data</span>}>
          <Menu.Item key="1fkjgdfjg">
            <Link to="/topics">Subjects/Topics</Link>
          </Menu.Item>
          <Menu.Item key="2cskjhvjksf">
            <Link to="/chapters">Chapters</Link>
          </Menu.Item>
          <Menu.Item key="3jfshkjx">
            <Link to="/subtopics">Sub Topics</Link>
          </Menu.Item>
        </SubMenu>
        <MenuItem>
          <Link to="/contents">Contents</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/interests">Interests</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/tags">Tags</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/userNotification">userNotification</Link>
        </MenuItem>
      </Menu>
    </div>
  );
}

Sidebar.propTypes = {};

export default memo(Sidebar);
