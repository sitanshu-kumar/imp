import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the classes state domain
 */

const selectClassesDomain = state => state.classes || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Classes
 */

const makeSelectClasses = () =>
  createSelector(
    selectClassesDomain,
    substate => substate,
  );

export default makeSelectClasses;
export { selectClassesDomain };
