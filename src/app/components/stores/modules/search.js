import { createItemStore, createListStore } from '@/app/components/stores/factory'

export const useSearchAllStore = createItemStore('search', () => 'search/all', {
  users: [],
  entries: [],
  comments: [],
  tags: [],
  feeds: []
})
export const useSearchUsersStore = createListStore('search_users', 'search/users', { offset: 0 })
export const useSearchEntriesStore = createListStore('search_entries', 'search/entries', { offset: 0 })
export const useSearchCommentsStore = createListStore('search_comments', 'search/comments', { offset: 0 })
export const useSearchTagsStore = createListStore('search_tags', 'search/tags', { offset: 0 })
export const useSearchFeedsStore = createListStore('search_feeds', 'search/feeds', { offset: 0 })