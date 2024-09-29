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
			{ path: 'abyss', name: 'feed-abyss', component: Feed, meta: { tab: 'abyss' } },
			{ path: 'collections', name: 'feed-collections', component: Feed, meta: { tab: 'collections' } },
			{ path: ':uuid', name: 'feed-custom', component: Feed, props: true },
		]
	}
]