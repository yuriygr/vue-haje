import { createItemStore, createListStore } from '@/app/store/factory'

export const useBookmarksAllStore = createItemStore('bookmarks', () => 'my/bookmarks/all', {
  users: [],
  entries: [],
  comments: [],
  feeds: []
})
export const useBookmarksUsersStore = createListStore('bookmarks_users', 'my/bookmarks/users', { offset: 0 })
export const useBookmarksEntriesStore = createListStore('bookmarks_entries', 'my/bookmarks/entries', { offset: 0 })
export const useBookmarksCommentsStore = createListStore('bookmarks_comments', 'my/bookmarks/comments', { offset: 0 })
export const useBookmarksFeedsStore = createListStore('bookmarks_feeds', 'my/bookmarks/feeds', { offset: 0 })