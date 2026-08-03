import { createItemStore, createListStore } from '@/app/store/factory'

export const useCustomFeed = createItemStore('custom_feed',
  (uuid) => `feed/${uuid}`
)

export const useCustomFeedSettings = createItemStore('custom_feed_settings',
  (uuid) => `feed/${uuid}/settings`
)

export const useCustomFeedEntries = createListStore('custom_feed_entries',
  (uuid) => `feed/${uuid}/entries`,
  { offset: 0 }
)

export const useCustomFeedTags = createListStore('custom_feed_tags',
  (uuid) => `feed/${uuid}/tags`,
  { offset: 0 }
)