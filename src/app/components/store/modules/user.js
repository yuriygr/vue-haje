import { createItemModule, createListedModule } from '@/app/components/store/factory'

export default {
  ...createItemModule(user_id => `user/${user_id}`),
  modules: {
    entries: createListedModule(
      (rootState) => `user/${rootState.user.data.username}/entries`
    ),
    subscribers: createListedModule(
      (rootState) => `user/${rootState.user.data.username}/subscribers`
    ),
    subscriptions: createListedModule(
      (rootState) => `user/${rootState.user.data.username}/subscriptions`
    ),
    badges: createListedModule(
      (rootState) => `user/${rootState.user.data.username}/badges`
    )
  }
}