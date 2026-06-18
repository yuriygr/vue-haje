import { createItemStore, createListStore } from '@/app/components/stores/factory'

export const useEntryStore = createItemStore('entry',
  (uuid) => `entry/${uuid}`
)
export const useEntryHistoryStore = createListStore('entry_history',
  (uuid) => `entry/${uuid}/history`,
  { offset: 0 }
)