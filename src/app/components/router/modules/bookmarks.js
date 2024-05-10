import Bookmarks from '@/views/Bookmarks'

import {
  BookmarksAll, BookmarksUsers, BookmarksEntries, BookmarksCommunities
} from '@/views/_bookmarks'

export default [
  {
    path: '/bookmarks',
    component: Bookmarks,
    meta: { section: 'bookmarks' },
    children: [
      { path: '', name: 'bookmarks', component: BookmarksAll, meta: { key: 'all' }},
      { path: 'users', name: 'bookmarks-users', component: BookmarksUsers, meta: { key: 'users' }},
      { path: 'entries', name: 'bookmarks-entries', component: BookmarksEntries, meta: { key: 'entries' }},
      { path: 'communities', name: 'bookmarks-communities', component: BookmarksCommunities, meta: { key: 'communities' }},
	    { path: ':pathMatch(.*)*', redirect: { name: 'bookmarks' } }
    ]
  }
]