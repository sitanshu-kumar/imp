import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the tags state domain
 */

const selectTagsDomain = state => state.tags || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Tags
 */

const makeSelectTags = () =>
  createSelector(
    selectTagsDomain,
    substate => substate,
  );

export default makeSelectTags;
export { selectTagsDomain };
