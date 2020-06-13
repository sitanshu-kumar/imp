import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the chapters state domain
 */

const selectChaptersDomain = state => state.chapters || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Chapters
 */

const makeSelectChapters = () =>
  createSelector(
    selectChaptersDomain,
    substate => substate,
  );

export default makeSelectChapters;
export { selectChaptersDomain };
