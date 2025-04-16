import Feed from '@/views/Feed'

import {
  FeedTimeline, FeedAbyss, FeedCustom, FeedsList, FeedCustomEntries
} from '@/views/_feed'

export default [
	{
		path: '/feed',
		name: 'feed',
		component: Feed,
    meta: { section: 'feed' },
		redirect: { name: 'feed-timeline' },
		children: [
			{ path: '', name: 'feed-timeline', component: FeedTimeline, meta: { tab: 'timeline' } },
			{ path: 'abyss', name: 'feed-abyss', component: FeedAbyss, meta: { tab: 'abyss' } },
			{ path: 'list', name: 'feed-list', component: FeedsList, meta: { tab: 'list' } },
			{ path: ':uuid', component: FeedCustom, props: true, meta: { tab: 'list' }, children: [
				{ path: '', name: 'feed-custom', component: FeedCustomEntries },
				{ path: ':pathMatch(.*)*', redirect: { name: 'feed-custom' } }
			] },
		]
	}
]