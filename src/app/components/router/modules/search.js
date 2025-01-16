const Search = () => import('@/views/Search')

import { SearchAll, SearchUsers, SearchTags, SearchEntries, SearchComments, SearchFeeds } from '@/views/_search'

export default [
  {
    path: '/search',
    component: Search,
    meta: { section: 'search' },
    children: [
      { path: '', name: 'search', component: SearchAll, meta: { key: 'all' }},
      { path: 'users', name: 'search-users', component: SearchUsers, meta: { key: 'users' }},
      { path: 'tags', name: 'search-tags', component: SearchTags, meta: { key: 'tags' }},
      { path: 'entries', name: 'search-entries', component: SearchEntries, meta: { key: 'entries' }},
      { path: 'comments', name: 'search-comments', component: SearchComments, meta: { key: 'comments' }},
      { path: 'feeds', name: 'search-feeds', component: SearchFeeds, meta: { key: 'feeds' }},
	    { path: ':pathMatch(.*)*', redirect: { name: 'search' } }
    ]
  }
]