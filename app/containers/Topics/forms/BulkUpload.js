import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { message, Alert, Spin, Form } from 'antd';
// import { Form } from '@ant-design/compatible';
import { PrimaryButton } from '../../../commonStyles/general';
import CustomFileUpload from '../../../components/CustomFileUpload';
import CustomSelect from '../../../components/CustomSelect';
import * as api from '../../../utils/api';
import { ApiUrls } from '../../../utils/apiUrls';

const BulkUpload = props => {
  // const { getFieldDecorator, setFieldsValue } = props.form;
  const [csvFile, setCsv] = useState();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async values => {
    // e.preventDefault();
    // props.form.validateFields(async (err, values) => {
    // if (!err) {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('class', values.class);
    const [error, response] = await api.upload(
      'post',
      ApiUrls.topicsBulkUpload,
      formData,
    );
    if (response && response.data) {
      message.success('Success');
      props.onClose();
      setLoading(false);
    }
    if (error) {
      message.error(error.message);
    }
  };
  //   });
  // };

  const handleDirectFile = file => {
    setCsv(file);
  };

  return (
    <div>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="class"
          rules={[{ required: true, message: 'Select Class' }]}
        >
          <CustomSelect
            placeholder="Select Classes"
            module="classes"
            loadFromApi
            serverKey="_id"
            showKey="name"
            afterSelect={itemId => form.setFieldsValue({ class: itemId })}
          />
        </Form.Item>

        <CustomFileUpload
          assetType="['.xlsx', '.xls', '.csv']"
          multiple={false}
          buttonText="Upload Csv File"
          showButton
          sendDirectFile
          handleDirectFile={handleDirectFile}
        />
        {csvFile && csvFile.name && (
          <Alert
            style={{ marginBottom: '20px' }}
            message="File Added"
            type="success"
            showIcon
          />
        )}
        {loading && (
          <Spin tip="Loading...">
            <Alert
              message="Uploading File"
              description="Please wait while we upload."
              type="info"
            />
          </Spin>
        )}

        <PrimaryButton type="primary" htmlType="submit">
          Submit
        </PrimaryButton>
      </Form>
    </div>
  );
};
BulkUpload.propTypes = {
  form: PropTypes.any,
  onClose: PropTypes.func,
};

export default compose(memo)(BulkUpload);
