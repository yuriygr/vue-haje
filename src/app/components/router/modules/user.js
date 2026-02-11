import User from '@/views/User'

import { UserEntries, UserSubscribers, UserSubscriptions, UserBadges } from '@/views/_user'

export default [
  {
    path: '/u/:username',
    component: User,
    props: true,
    meta: { section: 'user' },
    children: [
      { path: '', name: 'user', components: { user: UserEntries } },
      { path: 'entries', name: 'user-entries', components: { user: UserEntries } },
      { path: 'subscribers', name: 'user-subscribers', components: { user: UserSubscribers } },
      { path: 'subscriptions', name: 'user-subscriptions', components: { user: UserSubscriptions } },
      { path: 'badges', name: 'user-badges', components: { user: UserBadges } },
	    { path: ':pathMatch(.*)*', redirect: { name: 'user' } }
    ]
  }
]