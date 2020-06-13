/**
 *
 * Users
 *
 */

import React, { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Avatar } from 'antd';
import styled from 'styled-components';
import { UserOutlined } from '@ant-design/icons';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectUsers from './selectors';
import reducer from './reducer';
import CustomTable from '../../components/CustomTable';

export function Users() {
  useInjectReducer({ key: 'users', reducer });
  const [columns, setColumnData] = useState([]);

  useEffect(() => {
    setColumnData([
      {
        title: '',
        dataIndex: 'profilePicURL',
        render: profilePicURL => (
          <StyledUser>
            <Avatar
              size={50}
              src={
                profilePicURL ? profilePicURL.baseUrl + profilePicURL.name : ''
              }
              icon={<UserOutlined />}
            />
          </StyledUser>
        ),
      },
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
        searchable: true,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        sorter: true,
        searchable: true,
      },
      {
        title: 'Country',
        dataIndex: 'countryName',
        searchable: true,
        sorter: true,
      },
      {
        title: 'Age Group',
        dataIndex: 'ageGroup',
        searchable: true,
        sorter: true,
      },
      {
        title: 'Organization',
        dataIndex: 'organization',
        searchable: true,
        sorter: true,
      },
      {
        title: 'Total Coins',
        dataIndex: 'totalCoins',
        sorter: true,
        searchable: true,
      },
      {
        title: 'Uploads',
        dataIndex: 'totalUploads',
        sorter: true,
        searchable: true,
      },
    ]);
  }, []);

  return (
    <div>
      <Helmet>
        <title>Users</title>
        <meta name="description" content="Description of Users" />
      </Helmet>
      <div>
        {columns && !!columns.length && (
          <CustomTable
            columns={columns}
            populationKey={['profilePicURL']}
            module="users"
            noEdit
          />
        )}
      </div>
    </div>
  );
}

Users.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  users: makeSelectUsers(),
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
)(Users);

const StyledUser = styled.div`
  display: flex;
  .user-details {
    margin-left: 16px;
    p {
      margin-bottom: 0;
    }
  }
`;
