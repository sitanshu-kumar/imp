/**
 *
 * Dashboard
 *
 */

import React, { memo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import { withRouter } from 'react-router';
import makeSelectDashboard from './selectors';
import reducer from './reducer';

export function Dashboard() {
  useInjectReducer({ key: 'dashboard', reducer });

  return (
    <div>
      <h1>Welcome to Impactall!</h1>
    </div>
  );
}

Dashboard.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  dashboard: makeSelectDashboard(),
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

export default withRouter(
  compose(
    withConnect,
    memo,
  )(Dashboard),
);
