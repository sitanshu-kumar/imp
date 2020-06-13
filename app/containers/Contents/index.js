/**
 *
 * Contents
 *
 */

import React, { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import styled from 'styled-components';

import { useInjectReducer } from 'utils/injectReducer';
import { Tag } from 'antd';
import makeSelectContents from './selectors';
import reducer from './reducer';

import CustomTable from '../../components/CustomTable';
import colors from '../../utils/colors';
import ContentHide from './forms/ContentHide';

export function Contents() {
  useInjectReducer({ key: 'contents', reducer });
  const [columns, setColumnData] = useState([]);
  useEffect(() => {
    setColumnData([
      {
        title: 'Created by',
        dataIndex: 'createdBy',
        width: 100,
        render: createdBy => (
          <div>
            {createdBy ? (
              <div>
                <StyledName type="name">{createdBy.name}</StyledName>
                <StyledName type="email">{createdBy.email}</StyledName>
                <StyledName type="organization">
                  {createdBy.organization || '--'}
                </StyledName>
              </div>
            ) : (
              <StyledAdmin>ADMIN</StyledAdmin>
            )}
          </div>
        ),
        searchable: true,
        sortable: true,
        searchModel: 'users',
        searchKey: 'name',
      },
      {
        title: 'Type',
        dataIndexNew: 'postType',
        render: record => (
          <div>
            <span>{record.postType}</span>
            <Tag color={record.isPaid ? 'green' : 'blue'}>
              {record.isPaid ? 'PAID CONTENT' : 'FREE CONTENT'}
            </Tag>
          </div>
        ),
        width: 100,
        searchable: true,
        sortable: true,
      },
      {
        title: 'Title',
        dataIndex: 'title',
        width: 100,
        ellipsis: true,
        searchable: true,
        sortable: true,
      },
      {
        title: 'App Segment',
        dataIndex: 'appSegment',
        width: 100,
        render: appSegment => (
          <span>
            <Tag color={appSegment === 'study' ? 'geekblue' : 'magenta'}>
              {appSegment}
            </Tag>
          </span>
        ),
        searchable: true,
        sortable: true,
      },
      {
        title: 'Class',
        dataIndex: ['class', 'name'],
        width: 100,
        searchModel: 'classes',
        searchKey: 'name',
        searchable: true,
      },
      {
        title: 'Chapter',
        width: 80,
        dataIndex: ['chapterId', 'name'],
        searchModel: 'chapters',
        searchKey: 'name',
        searchable: true,
      },
      {
        title: 'Subject',
        width: 80,
        dataIndex: ['topicId', 'name'],
        searchModel: 'topics',
        searchKey: 'name',
        searchable: true,
      },
      {
        title: 'Subtopic',
        width: 100,
        dataIndex: ['subtopicId', 'name'],
        searchModel: 'subtopics',
        searchKey: 'name',
        searchable: true,
      },
      {
        title: 'Link',
        width: 100,
        dataIndex: 'detailLink',
        ellipsis: true,
        render: detailLink => (
          <a href={detailLink} target="_blank" color="blue">
            {detailLink || '--'}
          </a>
        ),
      },
    ]);
  }, []);

  return (
    <div>
      <Helmet>
        <title>Contents</title>
        <meta name="description" content="Description of Contents" />
      </Helmet>
      <div>
        {columns && !!columns.length && (
          <CustomTable
            populationKey={[
              'topicId',
              'class',
              'createdBy',
              'subtopicId',
              'chapterId',
            ]}
            columns={columns}
            module="contents"
            moduleWidth="100%"
            openCreatePage
            showViewIcon
            showPublishedButtons
            contentHideComponent={<ContentHide />}
          />
        )}
      </div>
    </div>
  );
}

Contents.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  contents: makeSelectContents(),
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
)(Contents);

const StyledName = styled.p`
  font-size: 13px;
  margin-bottom: 5px;
  text-transform: ${props =>
    props.type === 'email' ? 'lowercase' : 'capitalize'};
`;

const StyledAdmin = styled.p`
  margin-bottom: 5px;
  color: ${colors.primaryBlue};
`;
