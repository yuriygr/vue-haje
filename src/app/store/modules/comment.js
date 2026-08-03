import { createItemStore, createListStore } from '@/app/store/factory'

export const useCommentStore = createItemStore('comment',
  (id) => `comment/${id}`
)
export const useCommentHistoryStore = createListStore('comment_history',
  (id) => `comment/${id}/history`,
  { offset: 0 }
)