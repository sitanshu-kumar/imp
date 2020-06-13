/**
 *
 * Asynchronously loads the component for SubTopics
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
