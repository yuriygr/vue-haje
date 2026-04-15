import { createListStore } from '@/app/components/stores/factory'

export const useBookmarksUsersStore = createListStore('bookmarks_users', 'my/bookmarks/users', { offset: 0 })
export const useBookmarksEntriesStore = createListStore('bookmarks_entries', 'my/bookmarks/entries', { offset: 0 })
export const useBookmarksCommentsStore = createListStore('bookmarks_comments', 'my/bookmarks/comments', { offset: 0 })
export const useBookmarksFeedsStore = createListStore('bookmarks_feeds', 'my/bookmarks/feeds', { offset: 0 })