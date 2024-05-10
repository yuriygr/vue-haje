import Tag from '@/views/Tag'
import { TagEntries } from '@/views/_tag'

export default [
	{
    path: '/t/:slug',
    component: Tag,
    props: true,
    meta: { section: 'tag' },
		children: [
			{ path: '', name: 'tag', component: TagEntries },
	    { path: ':pathMatch(.*)*', redirect: { name: 'tag' } }
    ]
	}
]