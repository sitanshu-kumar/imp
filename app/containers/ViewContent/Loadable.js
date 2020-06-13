/**
 *
 * Asynchronously loads the component for ViewContent
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
