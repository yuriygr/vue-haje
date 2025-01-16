const Notifications = () => import('@/views/Notifications')

export default [
	{
    path: '/notifications',
    name: 'notifications',
    component: Notifications,
    meta: { section: 'notifications' }
  }
]