import Bookmarks from '@/views/Bookmarks'
import { BookmarksAll, BookmarksUsers, BookmarksEntries } from '@/views/_bookmarks'

export default [
  {
    path: '/bookmarks',
    component: Bookmarks,
    meta: { section: 'bookmarks' },
    children: [
      { path: '', name: 'bookmarks', component: BookmarksAll, meta: { key: 'all' }},
      { path: 'users', name: 'bookmarks-users', component: BookmarksUsers, meta: { key: 'users' }},
      { path: 'entries', name: 'bookmarks-entries', component: BookmarksEntries, meta: { key: 'entries' }},
	    { path: ':pathMatch(.*)*', redirect: { name: 'bookmarks' } }
    ]
  }
]