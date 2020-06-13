import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the subTopics state domain
 */

const selectSubTopicsDomain = state => state.subTopics || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SubTopics
 */

const makeSelectSubTopics = () =>
  createSelector(
    selectSubTopicsDomain,
    substate => substate,
  );

export default makeSelectSubTopics;
export { selectSubTopicsDomain };
