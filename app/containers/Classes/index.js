/**
 *
 * Classes
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectClasses from './selectors';
import reducer from './reducer';
import CustomTable from '../../components/CustomTable';
import CreateForm from './forms/CreateForm';

export function Classes() {
  useInjectReducer({ key: 'classes', reducer });

  const [columns, setColumnData] = useState([]);

  useEffect(() => {
    setColumnData([
      {
        title: 'Class',
        dataIndex: 'name',
        searchable: true,
        sorter: true,
      },
    ]);
  }, []);

  return (
    <div>
      <Helmet>
        <title>Classes</title>
        <meta name="description" content="Description of Classes" />
      </Helmet>
      <div>
        {columns && !!columns.length && (
          <CustomTable
            columns={columns}
            module="classes"
            formComponent={<CreateForm />}
          />
        )}
      </div>
    </div>
  );
}

Classes.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  classes: makeSelectClasses(),
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
)(Classes);
