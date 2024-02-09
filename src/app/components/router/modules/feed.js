import Feed from '@/views/Feed'

export default [
	{
		path: '/feed',
		name: 'feed',
		component: Feed,
    meta: { section: 'feed' },
		redirect: { name: 'feed-timeline' },
		children: [
			{ path: '', name: 'feed-timeline', component: Feed, meta: { tab: 'timeline' } },
			{ path: 'popular', name: 'feed-popular', component: Feed, meta: { tab: 'popular' } },
			{ path: 'abyss', name: 'feed-abyss', component: Feed, meta: { tab: 'abyss' } },
		]
	}
]