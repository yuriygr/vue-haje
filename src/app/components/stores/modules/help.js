import { createItemStore, createListStore } from '@/app/components/stores/factory'

export const useHelpPageStore = createItemStore(`help_page`,
  (slug) => `help/${slug}`
)
export const useHelpPagesStore = createListStore('help_pages',
  `help`,
  { offset: 0, query: '' }
)