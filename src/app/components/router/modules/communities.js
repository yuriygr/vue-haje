import Communities from '@/views/Communities'

import Community from '@/views/Community'
import { CommunityEntries } from '@/views/_community'

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
    path: '/c/:slug',
    component: Community,
    props: true,
    meta: { section: 'community' },
    children: [
			{ path: '', name: 'community', component: CommunityEntries },
	    { path: ':pathMatch(.*)*', redirect: { name: 'community' } }
    ]
  }
]