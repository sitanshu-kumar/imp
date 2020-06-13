import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the userNotificationForm state domain
 */

const selectUserNotificationFormDomain = state =>
  state.userNotificationForm || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by UserNotificationForm
 */

const makeSelectUserNotificationForm = () =>
  createSelector(
    selectUserNotificationFormDomain,
    substate => substate,
  );

export default makeSelectUserNotificationForm;
export { selectUserNotificationFormDomain };
