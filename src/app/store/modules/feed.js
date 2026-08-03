import { createListStore } from '@/app/store/factory'

export const useFeedTimelineStore = createListStore('feed_timeline', 'feed/timeline')

export const useFeedAbyssStore = createListStore('feed_abyss', 'feed/abyss')

export const useFeedFeedsStore = createListStore('feed_feeds', 'feed/feeds',
  { offset: 0 }
)