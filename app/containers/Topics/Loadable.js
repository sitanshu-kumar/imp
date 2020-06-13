/**
 *
 * Asynchronously loads the component for Topics
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
