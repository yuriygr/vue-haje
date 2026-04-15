import { createItemStore, createListStore } from '@/app/components/stores/factory'

export const useTagStore = createItemStore(`tag`,
  (slug) => `tag/${slug}`
)

export const useTagEntriesStore = createListStore('tag_entries',
  (slug) => `tag/${slug}/entries`,
  { offset: 0 }
)
