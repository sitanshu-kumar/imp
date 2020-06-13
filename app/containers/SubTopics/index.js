/**
 *
 * SubTopics
 *
 */
import React, { memo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectReducer } from 'utils/injectReducer';
import styled from 'styled-components';
import makeSelectSubTopics from './selectors';
import reducer from './reducer';
import CustomTable from '../../components/CustomTable';
import CreateForm from './forms/CreateForm';

import CustomImageRender from '../../components/CustomImageRender';

const StyledImage = styled(CustomImageRender)`
  width: 100px;
  object-fit: scale-down;
`;

export function SubTopics() {
  useInjectReducer({ key: 'subTopics', reducer });
  const [columns, setColumnData] = useState([]);
  useEffect(() => {
    setColumnData([
      {
        title: 'Sub-Topic Name',
        dataIndex: 'name',
        searchable: true,
        sorter: true,
      },
      {
        title: 'Class',
        dataIndex: ['class', 'name'],
        searchModel: 'classes',
        searchKey: 'name',
        searchable: true,
      },
      {
        title: 'Subject/topic',
        dataIndex: ['topicId', 'name'],
        searchModel: 'topics',
        searchKey: 'name',
        searchable: true,
      },
      {
        title: 'Chapter',
        dataIndex: ['chapterId', 'name'],
        searchModel: 'chapters',
        searchKey: 'name',
        searchable: true,
      },
      {
        title: 'Icon',
        render: record => <StyledImage urldata={record.image} />,
      },
    ]);
  }, []);

  return (
    <div>
      <Helmet>
        <title>SubTopics</title>
        <meta name="description" content="Description of SubTopics" />
      </Helmet>
      <div>
        {columns && !!columns.length && (
          <CustomTable
            // populationKey={['image', 'topicId', 'classes']}
            populationKey={['image', 'class', 'topicId', 'chapterId']}
            columns={columns}
            module="subtopics"
            modalWidth="800px"
            formComponent={<CreateForm />}
          />
        )}
      </div>
    </div>
  );
}
SubTopics.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = createStructuredSelector({
  subTopics: makeSelectSubTopics(),
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
)(SubTopics);
