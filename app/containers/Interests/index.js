/**
 *
 * Interests
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectInterests from './selectors';
import reducer from './reducer';
import CustomTable from '../../components/CustomTable';
import CreateForm from './forms/CreateForm';

// import AddInterest from '../AddInterests/Loadable';

export function Interests(props) {
  useInjectReducer({ key: 'interests', reducer });
  const [columns, setColumnData] = useState([]);

  useEffect(() => {
    setColumnData([
      {
        title: 'Interest Name',
        dataIndex: 'name',
      },
      // {
      //   title: 'Icon',
      //   dataIndex: '',
      // },
    ]);
  }, []);

  return (
    <div>
      <Helmet>
        <title>Interests</title>
        <meta name="description" content="Description of Interests" />
      </Helmet>
      <div>
        {columns && !!columns.length && (
          <CustomTable
            columns={columns}
            module="interests"
            // formComponent={<AddInterest />
            formComponent={<CreateForm />}
          />
        )}
      </div>
    </div>
  );
}

Interests.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  interests: makeSelectInterests(),
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
)(Interests);
