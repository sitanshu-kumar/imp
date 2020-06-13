import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the topics state domain
 */

const selectTopicsDomain = state => state.topics || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Topics
 */

const makeSelectTopics = () =>
  createSelector(
    selectTopicsDomain,
    substate => substate,
  );

export default makeSelectTopics;
export { selectTopicsDomain };
