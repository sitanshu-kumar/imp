export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

const AppConstants = {
  appSegments: [
    {
      label: 'Study',
      value: 'study',
    },
    {
      label: 'Explore',
      value: 'explore',
    },
  ],
  postTypes: [
    {
      label: 'Article',
      value: 'article',
    },
    {
      label: 'Flash Cards',
      value: 'flashcards',
    },
    {
      label: 'Video',
      value: 'video',
    },
    {
      label: '3D Video',
      value: '3dVideo',
    },
    {
      label: 'VR Video',
      value: 'vrVideo',
    },
  ],
  publisherTypes: [
    {
      label: 'Creator',
      value: 'creator',
    },
    {
      label: 'Curator',
      value: 'curator',
    },
  ],
};

export default AppConstants;
