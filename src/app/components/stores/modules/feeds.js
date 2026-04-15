import { createListStore } from '@/app/components/stores/factory'

export const useFeedsStore = createListStore('feeds', 'my/feeds', { query: '', offset: 0 })