/**
 *
 * Asynchronously loads the component for Classes
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
