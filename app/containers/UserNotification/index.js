/**
 *
 * UserNotification
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Button, message } from 'antd';
import styled from 'styled-components';
import makeSelectUserNotification from './selectors';
import * as api from '../../utils/api';
import { ApiUrls } from '../../utils/apiUrls';
import reducer from './reducer';
import saga from './saga';
import colors from '../../utils/colors';
import UserNotificationForm from '../UserNotificationForm/Loadable';
import CustomTable from '../../components/CustomTable';
import CustomImageRender from '../../components/CustomImageRender';
const StyledImage = styled(CustomImageRender)`
  width: 100px;
  object-fit: scale-down;
`;

const StyledButton = styled(Button)`
  font-size: 14px;
  color: ${colors.white};
  /* margin-left: 5px; */
`;

export function UserNotification(props) {
  useInjectReducer({ key: 'userNotification', reducer });
  useInjectSaga({ key: 'userNotification', saga });
  const [columns, setColumnData] = useState([]);
  const [updateData, setUpdateData] = useState({});

  useEffect(() => {
    setColumnData([
      {
        title: 'Message',
        dataIndex: 'message',
      },
      {
        title: 'Image',
        // dataIndex: 'image',
        render: record => <StyledImage urldata={record.image} />,
      },

      {
        title: 'Resend',
        // dataIndex: 'users',

        render: (text, record, index) => (
          <div>
            <StyledButton
              type="primary"
              title="Resend"
              onClick={() => handleSubmit(record)}
            >
              Resend
            </StyledButton>
          </div>
        ),
      },
    ]);
  }, []);

  const handleSubmit = async record => {
    const dataToAdd = {
      message: record.message,
      image: record.image && record.image._id,
      toAllUsers: record.toAllUsers,
      users: record.users,
    };

    const [err, response] = await api.request(
      'post',
      ApiUrls.adminNotifications,
      dataToAdd,
    );

    if (err) {
      message.error('Some issue on server.Please try again later.');
    }
    if (response && response.data) {
      setUpdateData(updateData);
      message.success('Your Updation has been Confirmed !!');
    }
  };

  return (
    <div>
      <Helmet>
        <title>UserNotification</title>
        <meta name="description" content="Description of UserNotification" />
      </Helmet>
      <div>
        {columns && !!columns.length && (
          <CustomTable
            hideEditButton
            hideDeleteButton
            columns={columns}
            populationKey={['image']}
            module="adminNotifications"
            formComponent={<UserNotificationForm />}
          />
        )}
      </div>
    </div>
  );
}

UserNotification.propTypes = {
  //dispatch: PropTypes.func.isRequired,
  onAddSuccess: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  userNotification: makeSelectUserNotification(),
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
)(UserNotification);
