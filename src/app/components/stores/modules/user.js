import { createItemStore, createListStore } from '@/app/components/stores/factory'

export const useUserStore = createItemStore(`user`,
  (username) => `user/${username}`
)

export const useUserEntriesStore = createListStore('user_entries',
  (username) => `user/${username}/entries`,
  { offset: 0 }
)

export const useUserSubscribersStore = createListStore('user_subscribers',
  (username) => `user/${username}/subscribers`,
  { offset: 0 }
)

export const useUserSubscriptionsStore = createListStore('user_subscriptions',
  (username) => `user/${username}/subscriptions`,
  { offset: 0 }
)

export const useUserBadgesStore = createListStore('user_badges',
  (username) => `user/${username}/badges`,
  { offset: 0 }
)