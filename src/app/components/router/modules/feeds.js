import Feeds from '@/views/Feeds'


export default [
  {
    path: '/feeds',
    component: Feeds,
    meta: { section: 'feeds' },
    children: [
      { path: '', name: 'feeds', component: Feeds },
	    { path: ':pathMatch(.*)*', redirect: { name: 'feeds' } }
    ]
  }
]