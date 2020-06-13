import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the interests state domain
 */

const selectInterestsDomain = state => state.interests || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Interests
 */

const makeSelectInterests = () =>
  createSelector(
    selectInterestsDomain,
    substate => substate,
  );

export default makeSelectInterests;
export { selectInterestsDomain };
