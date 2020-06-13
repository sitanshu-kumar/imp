import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the contents state domain
 */

const selectContentsDomain = state => state.contents || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Contents
 */

const makeSelectContents = () =>
  createSelector(
    selectContentsDomain,
    substate => substate,
  );

export default makeSelectContents;
export { selectContentsDomain };
