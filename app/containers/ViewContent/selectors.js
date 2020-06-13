import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the viewContent state domain
 */

const selectViewContentDomain = state => state.viewContent || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ViewContent
 */

const makeSelectViewContent = () =>
  createSelector(
    selectViewContentDomain,
    substate => substate,
  );

export default makeSelectViewContent;
export { selectViewContentDomain };
