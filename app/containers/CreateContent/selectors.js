import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the createContent state domain
 */

const selectCreateContentDomain = state => state.createContent || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CreateContent
 */

const makeSelectCreateContent = () =>
  createSelector(
    selectCreateContentDomain,
    substate => substate,
  );

export default makeSelectCreateContent;
export { selectCreateContentDomain };
