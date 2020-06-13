/**
 *
 * Asynchronously loads the component for Chapters
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
