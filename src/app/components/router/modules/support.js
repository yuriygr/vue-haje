import User from '@/views/User'

export default [
  {
    path: '/support',
    component: User,
    meta: { section: 'support' },
    children: [
      { path: 'kb/:uuid', name: 'support-kb' },
    ]
  }
]