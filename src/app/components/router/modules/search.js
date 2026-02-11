import Search from '@/views/Search'

import { SearchAll, SearchUsers, SearchTags, SearchEntries, SearchComments, SearchFeeds } from '@/views/_search'

export default [
  {
    path: '/search',
    component: Search,
    meta: { section: 'search' },
    children: [
      { path: '', name: 'search', components: { search: SearchAll }, meta: { key: 'all' }},
      { path: 'users', name: 'search-users', components: { search: SearchUsers }, meta: { key: 'users' }},
      { path: 'tags', name: 'search-tags', components: { search: SearchTags }, meta: { key: 'tags' }},
      { path: 'entries', name: 'search-entries', components: { search: SearchEntries }, meta: { key: 'entries' }},
      { path: 'comments', name: 'search-comments', components: { search: SearchComments }, meta: { key: 'comments' }},
      { path: 'feeds', name: 'search-feeds', components: { search: SearchFeeds }, meta: { key: 'feeds' }},
	    { path: ':pathMatch(.*)*', redirect: { name: 'search' } }
    ]
  }
]