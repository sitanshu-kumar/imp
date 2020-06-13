/**
 *
 * Test
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectTest from './selectors';
import reducer from './reducer';
import saga from './saga';

export function Test() {
  useInjectReducer({ key: 'test', reducer });
  useInjectSaga({ key: 'test', saga });

  return <div>
    <h1>Shubham</h1>
  </div>;
  }
  
Test.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  test: makeSelectTest(),
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
)(Test);
