import Feed from '@/views/Feed'

import {
  FeedTimeline, FeedFeed, FeedFeeds
} from '@/views/_feed'

export default [
	{
		path: '/feed',
		name: 'feed',
		component: Feed,
    meta: { section: 'feed', keepAlive: true },
		redirect: { name: 'feed-timeline' },
		children: [
			{ path: '', name: 'feed-timeline', component: FeedTimeline, meta: { tab: 'timeline' } },
			{ path: 'abyss', name: 'feed-abyss', component: FeedTimeline, meta: { tab: 'abyss' } },
			{ path: 'feeds', name: 'feed-feeds', component: FeedFeeds, meta: { tab: 'feeds' } },
			{ path: ':uuid', name: 'feed-custom', component: FeedFeed, props: true, meta: { tab: 'feeds' } },
		]
	}
]