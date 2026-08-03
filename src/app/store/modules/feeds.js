import { createListStore } from '@/app/store/factory'

export const useFeedsStore = createListStore('feeds', 'my/feeds', { query: '', offset: 0 })