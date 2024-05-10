import User from '@/views/User'
import { UserEntries, UserSubscribers, UserSubscriptions, UserBadges, UserTags, UserLinks } from '@/views/_user'

export default [
  {
    path: '/u/:username',
    component: User,
    props: true,
    meta: { section: 'user' },
    children: [
      { path: '', name: 'user', component: UserEntries },
      { path: 'entries', name: 'user-entries', component: UserEntries },
      { path: 'subscribers', name: 'user-subscribers', component: UserSubscribers },
      { path: 'subscriptions', name: 'user-subscriptions', component: UserSubscriptions },
      { path: 'badges', name: 'user-badges', component: UserBadges },
      { path: 'links', name: 'user-links', component: UserLinks },
	    { path: ':pathMatch(.*)*', redirect: { name: 'user' } }
    ]
  }
]