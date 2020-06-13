/**
 *
 * Chapters
 *
 */

import React, { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import { Tag } from 'antd';
import styled from 'styled-components';
import makeSelectChapters from './selectors';
import reducer from './reducer';

import CustomTable from '../../components/CustomTable';
import CreateForm from './forms/CreateForm';

import CustomImageRender from '../../components/CustomImageRender';

const StyledImage = styled(CustomImageRender)`
  width: 100px;
  object-fit: scale-down;
`;

export function Chapters() {
  useInjectReducer({ key: 'chapters', reducer });
  const [columns, setColumnData] = useState([]);

  useEffect(() => {
    setColumnData([    
      {
        title: 'Chapter Name',
        dataIndex: 'name',
        searchable: true,
        sorter: true,
      },
      {
        title: 'Classes',
        dataIndex: 'classes',
        searchModel: 'classes',
        searchKey: 'name',
        searchable: true,
        sorter: true,
        render: classes => (
          <span>
            {classes.map(item => (
              <Tag color="blue" key={item._id}>
                {item.name}
              </Tag>
            ))}
          </span>
        ),
      },
      {
        title: 'Subject/Topic',
        dataIndex: ['topicId', 'name'],
        searchModel: 'topics',
        searchKey: 'name',
        searchable: true,
        sorter: true,
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
        <title>Chapters</title>
        <meta name="description" content="Description of Chapters" />
      </Helmet>
      <div>
        {columns && !!columns.length && (
          <CustomTable
            populationKey={['image', 'topicId', 'classes']}
            columns={columns}
            module="chapters"
            formComponent={<CreateForm />}
          />
        )}
      </div>
    </div>
  );
}

Chapters.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  chapters: makeSelectChapters(),
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
)(Chapters);
