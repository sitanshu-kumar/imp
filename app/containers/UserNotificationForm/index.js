/**
 *
 * UserNotificationForm
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Input, message, Form, Tag, Switch } from 'antd';
import styled from 'styled-components';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectUserNotificationForm from './selectors';
import reducer from './reducer';
import saga from './saga';
import * as api from '../../utils/api';
import { PrimaryButton } from '../../commonStyles/general';
import { ApiUrls } from '../../utils/apiUrls';
import { handleServerError } from '../App/constants';
import CustomImageRender from '../../components/CustomImageRender';
import CustomFileUpload from '../../components/CustomFileUpload';
import CustomSearch from '../../components/CustomSearch';

const StyledForm = styled(Form)`
  margin: 20px;
`;
const StyledInput = styled(Input)``;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 16px;
`;

const ItemSwitchWrap = styled(Switch)`
  margin-left: 120px;
  /* display: flex;
  justify-content: flex-end; */
`;
const StyledButton = styled(PrimaryButton)`
  margin-top: 16px;
`;

const StyledImage = styled(CustomImageRender)`
  width: 100px;
  object-fit: scale-down;
`;
const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export function UserNotificationForm(props) {
  useInjectReducer({ key: 'userNotificationForm', reducer });
  useInjectSaga({ key: 'userNotificationForm', saga });
  const [form] = Form.useForm();
  const [notification, setNotification] = useState();
  const [users, setUsers] = useState([]);
  const [addModalVisible, setAddModal] = useState(false);
  const [addImage, setImage] = useState({});

  useEffect(() => {
    form.setFieldsValue({
      toAllUsers: true,
    });
  }, []);

  const handleSubmit = async values => {
    const dataToAdd = {
      message: values.message,
      image: values.image,
      toAllUsers: values.toAllUsers,
      users: users.map(u => u.id),
    };

    const dataToShow = { ...dataToAdd };

    const [error, response] = await api.request(
      'post',
      ApiUrls.adminNotifications,
      dataToAdd,
    );
    if (error) {
      handleServerError(error);
    }
    if (response) {
      setNotification(response.data);
      message.success('Your Data updated Successfully!!');
      form.resetFields();
      form.setFieldsValue({ toAllUsers: true });

      if (props.onAddSuccess) {
        props.onAddSuccess({
          ...response.data,
          ...dataToShow,
        });
      }
    }
  };

  const afterMediaUploaded = media => {
    setImage(media[0]);
    form.setFieldsValue({ image: media[0]._id });
  };

  const handleAddToggle = () => {
    setAddModal(true);
  };
  // const onAddSuccess = () => {
  //   // setAddData(data);
  //   setAddModal(!addModalVisible);
  // };
  // const handleEditClick = data => {
  //   // console.log('--->>>>>>', data);
  //   setCurrentSelectedItem(data);
  //   setAddModal(!addModalVisible);
  // };

  const addSearchedUser = u => {
    const isUserExists = users.filter(ou => ou.id === u.id);
    if (isUserExists && !isUserExists.length) {
      setUsers(users => [...users, u]);
      setAddModal(true);
    }
  };
  const removeUser = index => {
    const filteredList = users.splice(index, 1);
    setUsers([...users]);
  };

  // const addSearchedUser = (u) => {
  // const isUserExists = users.filter(ou => ou.id === u.id)
  //   if (isUserExists && !isUserExists.length)
  //   {
  //     setUsers(users => [...users, u])
  //   }
  // }
  // const removeUser = (index) => {
  //   console.log(index,"00---->>>")
  //  const filteredList = users.splice(index,1);
  //   console.log(filteredList, "00---->>>")
  //   setUsers([...users])
  // }

  const options = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];
  function onChange(checkedValues) {
    console.log('checked = ', checkedValues);
    form.setFieldsValue({
      toAllUsers: checkedValues,
    });
  }

  return (
    <div>
      <Helmet>
        <title>UserNotificationForm</title>
        <meta
          name="description"
          content="Description of UserNotificationForm"
        />
      </Helmet>
      <StyledForm form={form} onFinish={handleSubmit}>
        <StyledFormItem
          name="message"
          rules={[{ required: true, message: 'Please write a message!' }]}
        >
          <StyledInput placeholder="Message" type="Message" />
        </StyledFormItem>
        <Form.Item name="image">
          <CustomFileUpload
            assetType="image"
            multiple={false}
            buttonText="Upload Image"
            afterMediaUploaded={afterMediaUploaded}
          />

          <ImageWrapper>
            {addImage && addImage._id && <StyledImage urldata={addImage} />}
          </ImageWrapper>
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <StyledFormItem
              name="toAllUsers"
              label="To All Users"
              rules={[{ required: true, message: 'Please Choose the User!' }]}
            >
              <ItemSwitchWrap
                checked={!!form.getFieldValue('toAllUsers')}
                checkedChildren="Yes"
                unCheckedChildren="No"
              />
            </StyledFormItem>
          )}
        </Form.Item>

        {users &&
          users.map((u, index) => (
            <Tag onClick={() => removeUser(index)}>{u.value}</Tag>
          ))}
        <Form.Item shouldUpdate>
          {() =>
            form.getFieldsValue().toAllUsers === false && (
              // need to place searchbox instead of formItem
              // <StyledFormItem
              //   name="users"
              //   rules={[{ required: true, message: 'Please Enter the users!' }]}
              // >
              <CustomSearch
                onChange={e => addSearchedUser(e.target)}
                searchKey="name"
                module="users"
                placeholder="Users"
                type="users"
              />

              // </StyledFormItem>
            )
          }
        </Form.Item>

        <StyledButton type="primary" htmlType="submit">
          Add Details
        </StyledButton>
      </StyledForm>
    </div>
  );
}

UserNotificationForm.propTypes = {
  // dispatch: PropTypes.func.isRequired,

  afterEditSubmit: PropTypes.func,
  onAddSuccess: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  userNotificationForm: makeSelectUserNotificationForm(),
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
)(UserNotificationForm);
