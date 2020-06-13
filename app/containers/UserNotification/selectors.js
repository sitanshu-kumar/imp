import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the userNotification state domain
 */

const selectUserNotificationDomain = state =>
  state.userNotification || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by UserNotification
 */

const makeSelectUserNotification = () =>
  createSelector(
    selectUserNotificationDomain,
    substate => substate,
  );

export default makeSelectUserNotification;
export { selectUserNotificationDomain };
