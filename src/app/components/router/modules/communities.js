import Communities from '@/views/Communities'

export default [
  {
    path: '/communities',
    component: Communities,
    meta: { section: 'communities' },
    children: [
      { path: '', name: 'communities', component: Communities },
	    { path: ':pathMatch(.*)*', redirect: { name: 'communities' } }
    ]
  },
  {
    path: '/c',
    component: Communities,
    meta: { section: 'community' },
    children: [
      { path: ':slug', name: 'community', component: Communities },
      { path: 'entries', name: 'community-entries', component: Communities, meta: { key: 'entries' }}
    ]
  }
]