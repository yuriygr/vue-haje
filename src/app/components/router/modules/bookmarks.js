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
      { path: '', name: 'bookmarks', component: BookmarksAll, meta: { key: 'all' }},
      { path: 'users', name: 'bookmarks-users', component: BookmarksUsers, meta: { key: 'users' }},
      { path: 'entries', name: 'bookmarks-entries', component: BookmarksEntries, meta: { key: 'entries' }},
      { path: 'feeds', name: 'bookmarks-feeds', component: BookmarksFeeds, meta: { key: 'feeds' }},
      { path: 'comments', name: 'bookmarks-comments', component: BookmarksComments, meta: { key: 'comments' }},
	    { path: ':pathMatch(.*)*', redirect: { name: 'bookmarks' } }
    ]
  }
]