const Bookmarks = () => import('@/views/Bookmarks')

import {
  BookmarksAll, BookmarksUsers, BookmarksEntries, BookmarksComments, BookmarksFeeds
} from '@/views/_bookmarks'

export default [
  {
    path: '/bookmarks',
    component: Bookmarks,
    meta: { section: 'menu' },
    children: [
      { path: '', name: 'bookmarks', components: { bookmarks: BookmarksAll }, meta: { key: 'all' }},
      { path: 'users', name: 'bookmarks-users', components: { bookmarks: BookmarksUsers }, meta: { key: 'users' }},
      { path: 'entries', name: 'bookmarks-entries', components: { bookmarks: BookmarksEntries }, meta: { key: 'entries' }},
      { path: 'feeds', name: 'bookmarks-feeds', components: { bookmarks: BookmarksFeeds }, meta: { key: 'feeds' }},
      { path: 'comments', name: 'bookmarks-comments', components: { bookmarks: BookmarksComments }, meta: { key: 'comments' }},
	    { path: ':pathMatch(.*)*', redirect: { name: 'bookmarks' } }
    ]
  }
]