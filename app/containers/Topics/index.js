/**
 *
 * Topics
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import { Modal, Tag } from 'antd';
import styled from 'styled-components';
import makeSelectTopics from './selectors';
import reducer from './reducer';
import CreateForm from './forms/CreateForm';
import CustomTable from '../../components/CustomTable';
import BulkUpload from './forms/BulkUpload';
// import { Form } from '@ant-design/compatible';
import CustomImageRender from '../../components/CustomImageRender';

const StyledImage = styled(CustomImageRender)`
  width: 100px;
  object-fit: scale-down;
`;

export function Topics() {
  useInjectReducer({ key: 'topics', reducer });
  const [columns, setColumnData] = useState([]);
  const [showBulkModal, setBulkModal] = useState(false);
  useEffect(() => {
    setColumnData([
      {
        title: 'Name',
        dataIndex: 'name',
        render: name => (
          <span style={{ textTransform: 'capitalize' }}>{name}</span>
        ),
        searchable: true,
        sorter: true,
      },
      {
        title: 'Tags',
        dataIndex: 'tags',
        render: tags => (
          <span>
            {tags &&
              tags.map(item => (
                <Tag color="blue" key={item._id}>
                  {item.title}
                </Tag>
              ))}
          </span>
        ),
        searchable: true,
        sorter: true,
      },
      {
        title: 'Segment',
        dataIndex: 'appSegments',
        searchable: true,
        sorter: true,
      },
      {
        title: 'Icon',
        render: record => <StyledImage urldata={record.image} />,
        // dataIndex: 'image.baseUrl',
      },
    ]);
  }, []);

  return (
    <div>
      <Helmet>
        <title>Topics</title>
        <meta name="description" content="Description of Topics" />
      </Helmet>
      <div>
        {columns && !!columns.length && (
          <CustomTable
            populationKey={['image', 'tags', 'interests', 'classes']}
            columns={columns}
            module="topics"
            modalWidth="800px"
            showBulkButton
            bulkUploadHandle={() => setBulkModal(true)}
            formComponent={<CreateForm />}
            addText="Subjects/Topics"
          />
        )}
        <Modal
          title="Upload Topics"
          visible={showBulkModal}
          onCancel={() => setBulkModal(false)}
          footer={null}
          width={400}
        >
          <BulkUpload onClose={() => setBulkModal(false)} />
        </Modal>
      </div>
    </div>
  );
}

Topics.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  topics: makeSelectTopics(),
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
)(Topics);
