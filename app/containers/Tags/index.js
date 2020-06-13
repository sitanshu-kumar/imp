/**
 *
 * Tags
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectTags from './selectors';
import reducer from './reducer';
import CustomTable from '../../components/CustomTable';
import CreateForm from './forms/CreateForm';

export function Tags() {
  useInjectReducer({ key: 'tags', reducer });
  const [columns, setColumnData] = useState([]);

  useEffect(() => {
    setColumnData([
      {
        title: 'Tag Name',
        dataIndex: 'title',
      },
    ]);
  }, []);

  return (
    <div>
      <Helmet>
        <title>Tags</title>
        <meta name="description" content="Description of Tags" />
      </Helmet>
      <div>
        {columns && !!columns.length && (
          <CustomTable
            columns={columns}
            module="tags"
            formComponent={<CreateForm />}
          />
        )}
      </div>
    </div>
  );
}

Tags.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  tags: makeSelectTags(),
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
)(Tags);
